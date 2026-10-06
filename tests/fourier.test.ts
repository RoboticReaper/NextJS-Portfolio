import { describe, expect, it } from "vitest";
import { decompose, epicycleChain, resampleLoop } from "../lib/fourier";

describe("closed drawing sampling", () => {
  it("samples by distance, so drawing speed does not distort the loop", () => {
    const sampled = resampleLoop([
      { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 },
      { x: 4, y: 0 }, { x: 4, y: 2 }, { x: 0, y: 2 }, { x: 0, y: 0 },
    ], 6);
    expect(sampled).toEqual([
      { x: 0, y: 0 }, { x: 2, y: 0 }, { x: 4, y: 0 },
      { x: 4, y: 2 }, { x: 2, y: 2 }, { x: 0, y: 2 },
    ]);
  });
  it("rejects empty and stationary gestures without NaN coordinates", () => {
    expect(resampleLoop([], 8)).toEqual([]);
    expect(resampleLoop([{ x: 2, y: 3 }, { x: 2, y: 3 }], 8)).toEqual([]);
  });
});

describe("Fourier reconstruction", () => {
  it("reconstructs a radius-two circle with one rotating circle", () => {
    const terms = decompose([
      { x: 2, y: 0 }, { x: 0, y: 2 }, { x: -2, y: 0 }, { x: 0, y: -2 },
    ]);
    const chain = epicycleChain(terms, 0.25, 1);
    const tip = chain[chain.length - 1];
    expect(tip.x).toBeCloseTo(0, 10);
    expect(tip.y).toBeCloseTo(2, 10);
  });
  it("preserves clockwise rotation with a negative frequency", () => {
    const terms = decompose([
      { x: 2, y: 0 }, { x: 0, y: -2 }, { x: -2, y: 0 }, { x: 0, y: 2 },
    ]);
    const chain = epicycleChain(terms, 0.25, 1);
    expect(chain[chain.length - 1].y).toBeCloseTo(-2, 10);
  });
  it("preserves the drawing position and reconstructs all sampled points", () => {
    const points = Array.from({ length: 16 }, (_, i) => {
      const t = 2 * Math.PI * i / 16;
      return {
        x: 3 + 2 * Math.cos(t) + 0.5 * Math.cos(-2 * t),
        y: -4 + 2 * Math.sin(t) + 0.5 * Math.sin(-2 * t),
      };
    });
    const terms = decompose(points);
    points.forEach((point, i) => {
      const chain = epicycleChain(terms, i / 16, 2);
      const tip = chain[chain.length - 1];
      expect(tip.x).toBeCloseTo(point.x, 10);
      expect(tip.y).toBeCloseTo(point.y, 10);
    });
  });
  it("lower detail keeps the strongest component and the original position", () => {
    const points = Array.from({ length: 16 }, (_, i) => {
      const t = 2 * Math.PI * i / 16;
      return { x: 3 + 2 * Math.cos(t) + 0.5 * Math.cos(2 * t), y: -4 + 2 * Math.sin(t) + 0.5 * Math.sin(2 * t) };
    });
    const chain = epicycleChain(decompose(points), 0, 1);
    expect(chain[chain.length - 1].x).toBeCloseTo(5, 10);
    expect(chain[chain.length - 1].y).toBeCloseTo(-4, 10);
  });
});
