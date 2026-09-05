const DEFAULT_API_BASE_URL = "http://localhost:8080";

function normalizeApiBaseUrl(value: string) {
  const normalizedValue = value.replace(/\/+$/, "");

  try {
    const url = new URL(normalizedValue);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("The API URL must use HTTP or HTTPS.");
    }
  } catch {
    throw new Error(`VITE_API_BASE_URL must be a valid HTTP(S) URL. Received: ${value}`);
  }

  return normalizedValue;
}

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL;

export const env = Object.freeze({
  apiBaseUrl: normalizeApiBaseUrl(configuredApiBaseUrl),
});
