import { useEffect, useState } from 'react';

interface Props {
  src: string;
  alt: string;
  title: string;
  size: number;
  duration?: number;
}

export default function AnimatedWeatherIcon({ src, duration, alt, size = 100, title }: Props) {
  const [svgContent, setSvgContent] = useState<string>();

  useEffect(() => {
    fetch(src)
      .then(res => res.text())
      .then(svgText => {
        let modified = svgText;

        if (duration !== undefined) {
          // ajusta durações SMIL
          modified = modified.replace(/dur="[\d.]+s"/g, `dur="${duration}s"`);
          // ajusta durações CSS, caso existam
          modified = modified.replace(/animation-duration:\s*[\d.]+s/g, `animation-duration: ${duration}s`);
        }

        setSvgContent(modified);
      });
  }, [src, duration]);

  if (!svgContent) return null;

  return (
    <div
      title={title}
      role="img"
      aria-label={alt}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}