import { createServer, type ServerResponse } from "node:http";
import { config } from "./config.js";
import { getManagerPolicies } from "./positions.js";

export interface KeeperStats {
  startedAt: number;
  executor: string | null;
  dryRun: boolean;
  lastPollAt: number | null;
  settlementsProcessed: number;
  claimsSubmitted: number;
}

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { "Content-Type": "application/json", ...CORS_HEADERS });
  res.end(JSON.stringify(body));
}

/**
 * Lightweight read API the Sentinel PWA calls. Stateless on top of
 * predict-server; exposes keeper liveness plus per-manager policy listings.
 */
export function startApiServer(stats: KeeperStats) {
  const server = createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
      res.writeHead(204, CORS_HEADERS);
      res.end();
      return;
    }

    const url = new URL(req.url ?? "/", "http://localhost");

    try {
      if (url.pathname === "/" ) {
        json(res, 200, {
          service: "sentinel-keeper",
          endpoints: ["/health", "/managers/:managerId/policies"],
        });
        return;
      }

      if (url.pathname === "/health") {
        json(res, 200, {
          status: "ok",
          network: config.network,
          executor: stats.executor,
          dryRun: stats.dryRun,
          lastPollAt: stats.lastPollAt,
          settlementsProcessed: stats.settlementsProcessed,
          claimsSubmitted: stats.claimsSubmitted,
          uptimeMs: Date.now() - stats.startedAt,
        });
        return;
      }

      const match = url.pathname.match(/^\/managers\/([^/]+)\/policies$/);
      if (match) {
        const managerId = decodeURIComponent(match[1]!);
        const policies = await getManagerPolicies(managerId);
        json(res, 200, { managerId, policies });
        return;
      }

      json(res, 404, { error: "not found" });
    } catch (err) {
      json(res, 500, { error: err instanceof Error ? err.message : String(err) });
    }
  });

  server.listen(config.apiPort, () => {
    console.log(`[keeper] api listening on http://localhost:${config.apiPort}`);
  });

  return server;
}
