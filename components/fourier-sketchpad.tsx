"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type PointerEvent } from "react";
import { decompose, epicycleChain, resampleLoop, type Point } from "@/lib/fourier";
import { logoExample as example } from "@/lib/fourier-logo";

const initialMessage = "Draw a loop. Rotating circles trace it back.";
const pathFor = (points: Point[]) => points.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
const motionSnapshot = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const subscribeMotion = (listener: () => void) => {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
};
const subscribeVisibility = (listener: () => void) => {
  document.addEventListener("visibilitychange", listener);
  return () => document.removeEventListener("visibilitychange", listener);
};

export function FourierSketchpad() {
  const [stroke, setStroke] = useState<Point[]>(example);
  const [drawing, setDrawing] = useState(false);
  const [detail, setDetail] = useState(32);
  const [playing, setPlaying] = useState(true);
  const [explicitPlay, setExplicitPlay] = useState(false);
  const [time, setTime] = useState(0);
  const [message, setMessage] = useState(initialMessage);
  const [visible, setVisible] = useState(false);
  const [boardWidth, setBoardWidth] = useState(360);
  const region = useRef<HTMLElement>(null);
  const drawingArea = useRef<HTMLDivElement>(null);
  const pointer = useRef<number | null>(null);
  const points = useRef<Point[]>([]);
  const phase = useRef(0);
  const reducedMotion = useSyncExternalStore(subscribeMotion, motionSnapshot, () => true);
  const tabVisible = useSyncExternalStore(subscribeVisibility, () => document.visibilityState === "visible", () => true);
  const wantsPlayback = playing && (!reducedMotion || explicitPlay) && !drawing;
  const terms = useMemo(() => drawing ? [] : decompose(resampleLoop(stroke)), [stroke, drawing]);
  const curve = useMemo(() => terms.length ? Array.from({ length: 257 }, (_, i) => {
    const chain = epicycleChain(terms, i / 256, detail);
    return chain[chain.length - 1];
  }) : [], [terms, detail]);
  // Preserve the complete drawing on narrower screens without changing its Fourier data.
  const fit = useMemo(() => {
    if (drawing || !stroke.length) return 1;
    const extentX = Math.max(...stroke.map(point => Math.abs(point.x)), 1);
    const extentY = Math.max(...stroke.map(point => Math.abs(point.y)), 1);
    return Math.min(1, (boardWidth / 2 - 5) / extentX, 95 / extentY);
  }, [drawing, stroke, boardWidth]);
  const chain = epicycleChain(terms, time, detail);
  const tracing = wantsPlayback && visible && tabVisible;
  const trace = tracing ? curve.slice(0, Math.max(2, Math.floor(time * 256) + 1)) : curve;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.1 });
    const resize = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (height > 0) setBoardWidth(200 * width / height);
    });
    if (region.current) observer.observe(region.current);
    if (drawingArea.current) resize.observe(drawingArea.current);
    return () => { observer.disconnect(); resize.disconnect(); };
  }, []);

  useEffect(() => {
    if (!tracing || !terms.length) return;
    let frame = 0;
    let previous: number | undefined;
    const tick = (now: number) => {
      if (previous !== undefined) phase.current = (phase.current + Math.min(now - previous, 50) / 6000) % 1;
      previous = now;
      setTime(phase.current);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [tracing, terms]);

  function resetPhase() {
    phase.current = 0;
    setTime(0);
  }

  function loadExample() {
    setStroke(example);
    setDetail(32);
    setDrawing(false);
    setPlaying(true);
    setExplicitPlay(false);
    setMessage(initialMessage);
    resetPhase();
  }

  function drawLoop() {
    points.current = [];
    setStroke([]);
    setDrawing(true);
    setPlaying(false);
    setExplicitPlay(false);
    setMessage("Draw with your mouse or finger. Lift to finish.");
    resetPhase();
  }

  function position(event: PointerEvent<SVGSVGElement>): Point {
    const svg = event.currentTarget;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const matrix = svg.getScreenCTM();
    const mapped = matrix ? point.matrixTransform(matrix.inverse()) : point;
    const bounds = svg.viewBox.baseVal;
    return {
      x: Math.max(bounds.x + 5, Math.min(bounds.x + bounds.width - 5, mapped.x)),
      y: Math.max(bounds.y + 5, Math.min(bounds.y + bounds.height - 5, mapped.y)),
    };
  }

  function pointerDown(event: PointerEvent<SVGSVGElement>) {
    if (!drawing || event.button !== 0 || pointer.current !== null) return;
    event.preventDefault();
    pointer.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    points.current = [position(event)];
    setStroke([...points.current]);
  }

  function pointerMove(event: PointerEvent<SVGSVGElement>) {
    if (pointer.current !== event.pointerId) return;
    const point = position(event);
    const previous = points.current[points.current.length - 1];
    if (Math.hypot(point.x - previous.x, point.y - previous.y) < 2) return;
    if (points.current.length >= 1024) points.current = points.current.filter((_, i) => i % 2 === 0);
    points.current.push(point);
    setStroke([...points.current]);
  }

  function pointerUp(event: PointerEvent<SVGSVGElement>) {
    if (pointer.current !== event.pointerId) return;
    pointer.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
    const drawn = points.current;
    const length = drawn.reduce((total, point, i) => i ? total + Math.hypot(point.x - drawn[i - 1].x, point.y - drawn[i - 1].y) : total, 0);
    if (drawn.length < 3 || length < 20) {
      setStroke([]);
      setMessage("Draw a longer line, or load the example.");
      return;
    }
    setStroke([...drawn]);
    setDrawing(false);
    setPlaying(true);
    setMessage("Your loop is ready. Adjust Circles or press Play.");
    resetPhase();
  }

  function cancelPointer(event: PointerEvent<SVGSVGElement>) {
    if (pointer.current !== event.pointerId) return;
    pointer.current = null;
    points.current = [];
    setStroke([]);
    setMessage("Drawing cancelled. Try another loop, or load the example.");
  }

  return (
    <section className="fourier-sketchpad" aria-labelledby="fourier-heading" ref={region}>
      <div className="fourier-header">
        <h2 id="fourier-heading">Fourier sketchpad</h2>
        <div className="fourier-header-actions">
          <a className="fourier-project-link" href="https://github.com/RoboticReaper/Fourier-Series-Visualization" aria-label="Explore the Fourier project" target="_blank" rel="noopener noreferrer">Project <span aria-hidden="true">↗</span></a>
          <button type="button" className="fourier-button" disabled={drawing} aria-label={wantsPlayback ? "Pause animation" : "Play animation"} onClick={() => {
            setPlaying(!wantsPlayback);
            setExplicitPlay(!wantsPlayback);
          }}>
            <span aria-hidden="true">{wantsPlayback ? "Ⅱ" : "▶"}</span> {wantsPlayback ? "Pause" : "Play"}
          </button>
        </div>
      </div>
      <div className="fourier-drawing" ref={drawingArea}>
        <svg className={`fourier-board${drawing ? " is-drawing" : ""}`} viewBox={`${-boardWidth / 2} -100 ${boardWidth} 200`} role="img" aria-label="Fourier drawing area" aria-describedby="fourier-status" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={cancelPointer} onLostPointerCapture={cancelPointer}>
        <defs>
          <pattern id="fourier-grid" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="0" cy="0" r="0.7" fill="var(--muted)" /></pattern>
        </defs>
        <rect x={-boardWidth / 2} y="-100" width={boardWidth} height="200" fill="url(#fourier-grid)" className="fourier-grid" />
        <g transform={`scale(${fit})`}>
        <path className="fourier-source" d={pathFor(stroke) + (!drawing && stroke.length ? " Z" : "")} />
        {!drawing && terms.length > 0 && <>
          {chain.slice(0, -1).map((point, i) => <circle className="fourier-circle" key={i} cx={point.x} cy={point.y} r={terms[i + 1].amplitude} />)}
          <path className="fourier-arms" d={pathFor(chain)} />
          <path className="fourier-trace" data-testid="fourier-path" d={pathFor(trace)} />
          <circle className="fourier-tip" cx={chain[chain.length - 1].x} cy={chain[chain.length - 1].y} r="2.8" />
        </>}
        </g>
        </svg>
        <p id="fourier-status" className={`fourier-status${message === initialMessage ? " is-idle" : ""}`} role="status" aria-label="Drawing status">{message}</p>
      </div>
      <div className="fourier-controls">
        <button type="button" className="fourier-button" onClick={drawLoop}>Draw a loop</button>
        <button type="button" className="fourier-button" onClick={loadExample}>Load example</button>
        <div className="fourier-detail">
          <label htmlFor="fourier-detail">Circles <output htmlFor="fourier-detail">{detail}</output></label>
          <input id="fourier-detail" type="range" min="1" max="48" value={detail} disabled={drawing} onChange={(event) => setDetail(Number(event.target.value))} />
        </div>
      </div>
    </section>
  );
}
