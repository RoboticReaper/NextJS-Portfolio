"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";
import styles from "./site-pet.module.css";

const STORAGE_KEY = "portfolio-guga";
const WIDTH = 136;
const HEIGHT = 146;
const MARGIN = 16;
const animations = {
  rest: { row: 0, frames: 1, duration: 0 },
  idle: { row: 0, frames: 6, duration: 1560 },
  "walk-right": { row: 1, frames: 8, duration: 960 },
  "walk-left": { row: 2, frames: 8, duration: 960 },
  wave: { row: 3, frames: 4, duration: 1400 },
  jump: { row: 4, frames: 5, duration: 1400 },
  think: { row: 8, frames: 6, duration: 1560 },
};
type Animation = keyof typeof animations;
type Position = { x: number; y: number };
type Drag = { pointerId: number; offsetX: number; offsetY: number; lastX: number };
const idleActivities: Animation[] = ["idle", "jump", "think", "wave"];

function clampPosition(position: Position): Position {
  return {
    x: Math.max(MARGIN, Math.min(position.x, window.innerWidth - WIDTH - MARGIN)),
    y: Math.max(MARGIN, Math.min(position.y, window.innerHeight - HEIGHT - MARGIN)),
  };
}

function savePet(position: Position | null, hidden: boolean) {
  if (!position) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...position, hidden }));
  } catch {
    // The pet remains usable when browser storage is unavailable.
  }
}

const subscribeMotion = (callback: () => void) => {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};
const reducedMotionSnapshot = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const subscribeVisibility = (callback: () => void) => {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
};
const visibilitySnapshot = () => !document.hidden;

export function SitePet() {
  const [position, setPosition] = useState<Position | null>(null);
  const [hidden, setHidden] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [animation, setAnimation] = useState<Animation>("rest");
  const positionRef = useRef<Position | null>(null);
  const drag = useRef<Drag | null>(null);
  const moveButton = useRef<HTMLButtonElement>(null);
  const showButton = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);
  const reducedMotion = useSyncExternalStore(subscribeMotion, reducedMotionSnapshot, () => true);
  const pageVisible = useSyncExternalStore(subscribeVisibility, visibilitySnapshot, () => false);
  const ready = position !== null;

  function moveTo(next: Position) {
    const clamped = clampPosition(next);
    positionRef.current = clamped;
    setPosition(clamped);
  }

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      let initial = { x: window.innerWidth - WIDTH - 24, y: window.innerHeight - HEIGHT - 24 };
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
        if (saved && typeof saved.x === "number" && typeof saved.y === "number" &&
          Number.isFinite(saved.x) && Number.isFinite(saved.y)) {
          initial = { x: saved.x, y: saved.y };
          setHidden(saved.hidden === true);
        }
      } catch {
        // Invalid or blocked storage falls back to the bottom-right corner.
      }
      moveTo(initial);
    });
    const onResize = () => {
      if (positionRef.current) moveTo(positionRef.current);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    if (!ready || hidden || dragging || reducedMotion || !pageVisible) return;
    const timer = window.setTimeout(() => {
      if (animation === "rest") {
        setAnimation(idleActivities[Math.floor(Math.random() * idleActivities.length)]);
      } else {
        setAnimation("rest");
      }
    }, animation === "rest" ? 2000 + Math.random() * 3000 : animations[animation].duration);
    return () => window.clearTimeout(timer);
  }, [ready, hidden, dragging, reducedMotion, pageVisible, animation]);

  useEffect(() => {
    if (!dragging) return;
    const cancel = () => {
      drag.current = null;
      setDragging(false);
      setAnimation("rest");
      savePet(positionRef.current, false);
    };
    window.addEventListener("blur", cancel);
    return () => window.removeEventListener("blur", cancel);
  }, [dragging]);

  useEffect(() => {
    if (!restoreFocus.current) return;
    restoreFocus.current = false;
    (hidden ? showButton : moveButton).current?.focus({ preventScroll: true });
  }, [hidden]);

  function startDrag(event: PointerEvent<HTMLButtonElement>) {
    if (!event.isPrimary || event.button !== 0 || !positionRef.current) return;
    event.preventDefault();
    event.currentTarget.focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - positionRef.current.x,
      offsetY: event.clientY - positionRef.current.y,
      lastX: event.clientX,
    };
    setDragging(true);
    setAnimation("walk-right");
  }

  function moveDrag(event: PointerEvent<HTMLButtonElement>) {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;
    const delta = event.clientX - current.lastX;
    if (Math.abs(delta) > 1) setAnimation(delta < 0 ? "walk-left" : "walk-right");
    current.lastX = event.clientX;
    moveTo({ x: event.clientX - current.offsetX, y: event.clientY - current.offsetY });
  }

  function endDrag(event: PointerEvent<HTMLButtonElement>) {
    if (drag.current?.pointerId !== event.pointerId) return;
    drag.current = null;
    setDragging(false);
    setAnimation("rest");
    savePet(positionRef.current, false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function toggleHidden(next: boolean) {
    drag.current = null;
    setDragging(false);
    setAnimation("rest");
    restoreFocus.current = true;
    setHidden(next);
    savePet(positionRef.current, next);
  }

  function moveWithKeyboard(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      toggleHidden(true);
      return;
    }
    const directions: Record<string, Position> = {
      ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
      ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
    };
    const direction = directions[event.key];
    if (!direction || !positionRef.current) return;
    event.preventDefault();
    const step = event.shiftKey ? 40 : 16;
    moveTo({ x: positionRef.current.x + direction.x * step, y: positionRef.current.y + direction.y * step });
    setAnimation(direction.x < 0 ? "walk-left" : "walk-right");
    savePet(positionRef.current, false);
  }

  if (!position) return null;

  if (hidden) return (
    <button ref={showButton} type="button" className={styles.launcher}
      aria-label="Show Guga" title="Bring Guga back" onClick={() => toggleHidden(false)}>
      <span className={styles.launcherPet} aria-hidden="true" />
    </button>
  );

  const currentAnimation = reducedMotion ? "rest" : animation;
  const sprite = animations[currentAnimation];
  return (
    <div className={styles.pet} data-testid="site-pet" data-dragging={dragging}
      style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}>
      <span id="guga-instructions" className={styles.srOnly}>
        Drag Guga to move. You can also use the arrow keys, hold Shift for bigger steps, or press Escape to hide.
      </span>
      <button ref={moveButton} type="button" className={styles.move}
        aria-label="Move Guga" aria-describedby="guga-instructions" title="Drag me around"
        data-animation={currentAnimation}
        onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag}
        onPointerCancel={endDrag} onLostPointerCapture={endDrag}
        onKeyDown={moveWithKeyboard}
        onKeyUp={(event) => { if (event.key.startsWith("Arrow")) setAnimation("rest"); }}
        onBlur={() => { if (!drag.current) setAnimation("rest"); }}>
        <span key={currentAnimation} className={styles.sprite} aria-hidden="true"
          style={{
            "--pet-row": `${-sprite.row * 130}px`,
            "--pet-end": `${-sprite.frames * 120}px`,
            "--pet-frames": sprite.frames,
            "--pet-duration": `${sprite.duration}ms`,
            animationIterationCount: currentAnimation.startsWith("walk-") ? "infinite" : 1,
            animationPlayState: pageVisible ? "running" : "paused",
          } as CSSProperties} />
      </button>
      <button type="button" className={styles.close} aria-label="Hide Guga" title="Hide Guga"
        onClick={() => toggleHidden(true)}>
        <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor"
          strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
          <path d="m4 4 8 8M12 4l-8 8" />
        </svg>
      </button>
    </div>
  );
}
