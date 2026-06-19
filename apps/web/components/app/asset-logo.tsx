import type { AssetId } from "@/lib/assets";
import { getAsset } from "@/lib/assets";

/**
 * Asset mark — a tinted disc with the asset's white glyph. Inline SVG so it
 * needs no network and inherits crisp rendering at any size.
 */
export function AssetLogo({ id, size = 24 }: { id: AssetId; size?: number }) {
  const { tint, symbol } = getAsset(id);

  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full"
      style={{ width: size, height: size, background: tint }}
      role="img"
      aria-label={symbol}
    >
      <svg
        width={size * 0.6}
        height={size * 0.6}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        {id === "btc" && (
          <path
            d="M15.4 10.2c.2-1.5-.9-2.3-2.5-2.8l.5-2-1.2-.3-.5 2-1-.3.5-2L10 4.5l-.5 2-2.1-.5-.3 1.3s.9.2.9.2c.5.1.6.4.6.7l-1.4 5.7c-.1.2-.2.4-.6.3 0 0-.9-.2-.9-.2l-.6 1.4 2 .5-.5 2.1 1.2.3.5-2 1 .2-.5 2 1.2.3.5-2.1c2 .4 3.6.2 4.2-1.6.5-1.5 0-2.3-1.1-2.9.8-.2 1.4-.7 1.6-1.8Zm-2.8 3.8c-.4 1.5-2.9.7-3.7.5l.7-2.7c.8.2 3.4.6 3 2.2Zm.4-3.8c-.3 1.3-2.4.7-3.1.5l.6-2.5c.7.2 2.9.5 2.5 2Z"
            fill="#fff"
          />
        )}
        {id === "eth" && (
          <>
            <path d="M12 2 5.5 12 12 8.6 18.5 12 12 2Z" fill="#fff" fillOpacity="0.95" />
            <path d="M12 2 5.5 12 12 8.6 12 2Z" fill="#fff" fillOpacity="0.7" />
            <path d="M12 16.3 5.5 12.4 12 22l6.5-9.6L12 16.3Z" fill="#fff" fillOpacity="0.95" />
            <path d="M12 16.3 5.5 12.4 12 22l0-5.7Z" fill="#fff" fillOpacity="0.7" />
          </>
        )}
        {id === "sui" && (
          <path
            d="M12 3.2c1 1.3 5 5.6 5 9.2a5 5 0 1 1-10 0c0-3.6 4-7.9 5-9.2Zm-2.2 7.6a3.4 3.4 0 0 0 2.9 5.3 .5.5 0 0 0 0-1 2.4 2.4 0 0 1-2.1-3.8.5.5 0 0 0-.8-.5Z"
            fill="#fff"
          />
        )}
      </svg>
    </span>
  );
}
