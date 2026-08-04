import { LOCALE_MAP } from "@/constants/appInfo";

export default function getAppLocale(language: string = "en"): string {
  const baseLang = language.split("-")[0];
  return LOCALE_MAP[baseLang] ?? "en-US";
}