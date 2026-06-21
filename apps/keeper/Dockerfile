# Build from the repo root: docker build -f apps/keeper/Dockerfile .
FROM node:20-slim AS deps
WORKDIR /app
RUN corepack enable
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/keeper/package.json apps/keeper/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN pnpm install --frozen-lockfile

FROM deps AS runtime
COPY apps/keeper apps/keeper
COPY packages/shared packages/shared
WORKDIR /app/apps/keeper
CMD ["node_modules/.bin/tsx", "src/index.ts"]
