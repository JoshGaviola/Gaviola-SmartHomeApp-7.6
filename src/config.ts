const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

export const apiConfig = {
  baseUrl: configuredApiUrl ? configuredApiUrl.replace(/\/+$/, "") : null,
  requestTimeoutMs: 10_000,
};

export const usingRemoteApi = apiConfig.baseUrl !== null;
