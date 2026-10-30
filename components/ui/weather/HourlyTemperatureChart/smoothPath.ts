export interface Point {
  x: number;
  y: number;
}

/**
 * Curva suave que passa por todos os pontos sem ultrapassá-los (cúbica monótona,
 * Fritsch–Carlson): o pico da curva nunca fica acima da maior temperatura do rótulo.
 */
export default function smoothPath(points: Point[]): string {
  if (points.length < 2) return '';

  const n = points.length;
  const slopes = points.slice(0, -1).map((p, i) => (points[i + 1].y - p.y) / (points[i + 1].x - p.x));
  const tangents = points.map((_, i) => {
    if (i === 0) return slopes[0];
    if (i === n - 1) return slopes[n - 2];
    return slopes[i - 1] * slopes[i] <= 0 ? 0 : (slopes[i - 1] + slopes[i]) / 2;
  });

  slopes.forEach((m, i) => {
    if (m === 0) {
      tangents[i] = tangents[i + 1] = 0;
      return;
    }

    const a = tangents[i] / m;
    const b = tangents[i + 1] / m;
    const s = a * a + b * b;

    if (s > 9) {
      const tau = 3 / Math.sqrt(s);
      tangents[i] = tau * a * m;
      tangents[i + 1] = tau * b * m;
    }
  });

  const f = (v: number) => v.toFixed(1);
  let d = `M${f(points[0].x)},${f(points[0].y)}`;

  for (let i = 0; i < n - 1; i++) {
    const p = points[i];
    const q = points[i + 1];
    const dx = (q.x - p.x) / 3;
    d += `C${f(p.x + dx)},${f(p.y + tangents[i] * dx)} ${f(q.x - dx)},${f(q.y - tangents[i + 1] * dx)} ${f(q.x)},${f(q.y)}`;
  }

  return d;
}
