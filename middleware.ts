import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["de", "en", "tr"],

  defaultLocale: "de",

  localePrefix: "always" 
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"]
};