import CookieManager from "@react-native-cookies/cookies";

import { API_BASE_URL, API_CSRF_COOKIE_NAME } from "@/lib/api/config";

const getCookieValue = (
  cookies: Record<string, { value?: string }> | undefined,
  cookieName: string,
) => {
  const candidate = cookies?.[cookieName]?.value;

  if (!candidate) {
    return null;
  }

  const token = candidate.trim();
  return token.length > 0 ? token : null;
};

export const getCsrfToken = async () => {
  try {
    const urlCookies = await CookieManager.get(API_BASE_URL);
    const urlToken = getCookieValue(urlCookies, API_CSRF_COOKIE_NAME);

    if (urlToken) {
      return urlToken;
    }

    const baseOrigin = new URL(API_BASE_URL).origin;

    if (baseOrigin !== API_BASE_URL) {
      const originCookies = await CookieManager.get(baseOrigin);
      return getCookieValue(originCookies, API_CSRF_COOKIE_NAME);
    }

    return null;
  } catch {
    return null;
  }
};
