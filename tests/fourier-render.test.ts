import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";
import { FourierSketchpad } from "../components/fourier-sketchpad";

it("renders identical initial SVG geometry despite runtime math rounding differences", () => {
  const server = renderToStaticMarkup(createElement(FourierSketchpad));
  const sin = Math.sin;
  const cos = Math.cos;
  // Engines can differ in the last bit of transcendental calculations.
  vi.spyOn(Math, "sin").mockImplementation((angle) => sin(angle) * (1 + Number.EPSILON));
  vi.spyOn(Math, "cos").mockImplementation((angle) => cos(angle) * (1 + Number.EPSILON));
  const browser = renderToStaticMarkup(createElement(FourierSketchpad));
  expect(browser).toBe(server);
});
