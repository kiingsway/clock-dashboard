import { useEffect, useState } from "react";

// Os SVGs eram guardados no localStorage quando vinham de um CDN externo.
// Agora são servidos pelo próprio app com Cache-Control, então o cache do
// navegador basta; removemos as entradas antigas uma única vez.
const LEGACY_CACHE_PREFIX = "svg-cache:";

let legacyCacheCleared = false;

function clearLegacyCache() {
  if (legacyCacheCleared) return;
  legacyCacheCleared = true;

  try {
    Object.keys(localStorage)
      .filter(key => key.startsWith(LEGACY_CACHE_PREFIX))
      .forEach(key => localStorage.removeItem(key));
  } catch {
    // localStorage indisponível (ex: modo privado); nada a limpar.
  }
}

export function useSvgContent(src?: string) {
  const [svgContent, setSvgContent] = useState<string>();

  useEffect(() => {
    if (!src) return;

    clearLegacyCache();

    let cancelled = false;

    fetch(src)
      .then(response => {
        if (!response.ok) throw new Error(`Failed to fetch SVG: ${src}`);
        return response.text();
      })
      .then(content => {
        if (!cancelled) setSvgContent(content);
      })
      .catch(error => console.error(error));

    return () => {
      cancelled = true;
    };
  }, [src]);

  return svgContent;
}
