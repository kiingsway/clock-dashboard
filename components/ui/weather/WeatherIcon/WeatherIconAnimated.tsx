import { useSvgContent } from '@/hooks/useSvgContent';
import { useMemo } from 'react'

interface Props {
  src: string;
  alt: string;
  title?: string;
  size: number;
  duration: number;
}

export default function AnimatedWeatherIcon({
  src,
  duration,
  alt,
  size = 100,
  title,
}: Props) {
  const svgContent = useSvgContent(src);

  const modifiedSvg = useMemo(() => {
    if (!svgContent) return;

    let modified = svgContent;

    if (duration !== undefined) {
      modified = modified.replace(
        /dur="[\d.]+s"/g,
        `dur="${duration}s"`,
      );

      modified = modified.replace(
        /animation-duration:\s*[\d.]+s/g,
        `animation-duration: ${duration}s`,
      );
    }

    return modified;
  }, [svgContent, duration]);

  if (!modifiedSvg) return null;

  return (
    <div
      title={title}
      role="img"
      aria-label={alt}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: modifiedSvg }}
    />
  );
}