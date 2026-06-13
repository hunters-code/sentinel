import { PREDICT_SERVER_URL } from "@sentinel/shared";

const baseUrl =
  process.env.NEXT_PUBLIC_PREDICT_SERVER_URL ?? PREDICT_SERVER_URL;

export async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`);
  if (!res.ok) {
    throw new Error(`predict-server ${path} -> ${res.status}`);
  }
  return (await res.json()) as T;
}
