export const APP_INFO = {
  version: process.env.NEXT_PUBLIC_APP_VERSION!,
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",
};