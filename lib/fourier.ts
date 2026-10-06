export type Point = { x: number; y: number };
export type FourierTerm = { frequency: number; amplitude: number; phase: number; real: number; imaginary: number };

// Equal-distance samples make the transform independent of pointer speed.
export function resampleLoop(points: Point[], count = 128): Point[] {
  if (!Number.isFinite(count) || count < 2) return [];
  const clean = points.filter((point, i) =>
    Number.isFinite(point.x) && Number.isFinite(point.y) &&
    (i === 0 || point.x !== points[i - 1].x || point.y !== points[i - 1].y),
  );
  if (clean.length < 2) return [];
  const lengths = clean.map((point, i) => {
    const next = clean[(i + 1) % clean.length];
    return Math.hypot(next.x - point.x, next.y - point.y);
  });
  const perimeter = lengths.reduce((total, length) => total + length, 0);
  if (perimeter < 0.001) return [];
  const size = Math.min(256, Math.floor(count));
  let segment = 0;
  let traversed = 0;
  return Array.from({ length: size }, (_, i) => {
    const distance = perimeter * i / size;
    while (segment < lengths.length - 1 && traversed + lengths[segment] < distance) {
      traversed += lengths[segment++];
    }
    const start = clean[segment];
    const end = clean[(segment + 1) % clean.length];
    const fraction = lengths[segment] ? (distance - traversed) / lengths[segment] : 0;
    return { x: start.x + (end.x - start.x) * fraction, y: start.y + (end.y - start.y) * fraction };
  });
}

export function decompose(points: Point[]): FourierTerm[] {
  const size = points.length;
  const terms = Array.from({ length: size }, (_, k) => {
    let real = 0;
    let imaginary = 0;
    points.forEach((point, i) => {
      const angle = 2 * Math.PI * k * i / size;
      real += point.x * Math.cos(angle) + point.y * Math.sin(angle);
      imaginary += point.y * Math.cos(angle) - point.x * Math.sin(angle);
    });
    real /= size;
    imaginary /= size;
    return { frequency: k > size / 2 ? k - size : k, real, imaginary, amplitude: Math.hypot(real, imaginary), phase: Math.atan2(imaginary, real) };
  });
  // Keep translation separate; larger rotating components come first.
  return terms.length ? [terms[0], ...terms.slice(1).sort((a, b) => b.amplitude - a.amplitude)] : [];
}

export function epicycleChain(terms: FourierTerm[], time: number, detail: number): Point[] {
  const origin = terms[0];
  const chain: Point[] = [{ x: origin?.real ?? 0, y: origin?.imaginary ?? 0 }];
  terms.slice(1, Math.max(0, Math.floor(detail)) + 1).forEach((term) => {
    const angle = term.phase + 2 * Math.PI * term.frequency * time;
    const previous = chain[chain.length - 1];
    chain.push({ x: previous.x + term.amplitude * Math.cos(angle), y: previous.y + term.amplitude * Math.sin(angle) });
  });
  return chain;
}
