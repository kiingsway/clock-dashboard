import { useEffect, useState } from "react";

const CACHE_PREFIX = "svg-cache:";
const CACHE_DURATION = 1000 * 60 * 60 * 24 * 7; // 1 semana

interface CachedSvg {
  timestamp: number;
  content: string;
}

export function useSvgContent(src?: string) {
  const [svgContent, setSvgContent] = useState<string>();

  useEffect(() => {
    if (!src) return;

    const loadSvg = async () => {
      const cacheKey = `${CACHE_PREFIX}${src}`;

      const cached = localStorage.getItem(cacheKey);

      if (cached) {
        const parsed: CachedSvg = JSON.parse(cached);

        if (Date.now() - parsed.timestamp < CACHE_DURATION) {
          setSvgContent(parsed.content);
          return;
        }

        localStorage.removeItem(cacheKey);
      }

      const response = await fetch(src);

      if (!response.ok) throw new Error(`Failed to fetch SVG: ${src}`);

      const content = await response.text();

      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          timestamp: Date.now(),
          content,
        }),
      );

      setSvgContent(content);
    };

    loadSvg();
  }, [src]);

  return svgContent;
}