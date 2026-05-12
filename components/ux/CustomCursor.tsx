"use client";

import { useEffect } from "react";

export function CustomCursor() {
  useEffect(() => {
    // Only on desktop
    if (window.matchMedia("(max-width: 900px)").matches) return;
    if ("ontouchstart" in window) return;

    const cursor = document.getElementById("cursor");
    if (!cursor) return;
    const label = document.getElementById("cursorLabel");
    const dot = cursor.querySelector(".cursor__dot") as HTMLElement;
    const ring = cursor.querySelector(".cursor__ring") as HTMLElement;

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let dx = mx, dy = my;
    let rx = mx, ry = my;

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    const onDown = () => cursor.classList.add("is-press");
    const onUp = () => cursor.classList.remove("is-press");

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);

    let raf: number;
    function tick() {
      dx += (mx - dx) * 0.6;
      dy += (my - dy) * 0.6;
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;

      dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      if (label) label.style.transform = `translate(${dx}px, ${dy}px)`;
      raf = requestAnimationFrame(tick);
    }
    tick();

    function setHover(on: boolean, text: string) {
      cursor!.classList.toggle("is-hover", !!on);
      cursor!.classList.toggle("is-label", !!text);
      if (label) label.textContent = text || "";
    }

    const onOver = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest("[data-cursor]") as HTMLElement | null;
      if (t) setHover(true, t.dataset.cursor || "");
      else if ((e.target as HTMLElement).closest("a, button, input, .cat-row, .faq__head, .blog__card, .calc__chip")) {
        setHover(true, "");
      }
    };
    const onOut = (e: MouseEvent) => {
      if (!e.relatedTarget) return;
      const t = (e.relatedTarget as HTMLElement).closest("[data-cursor], a, button, input, .cat-row, .faq__head, .blog__card, .calc__chip");
      if (!t) setHover(false, "");
    };

    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);

  return (
    <div className="cursor" id="cursor" aria-hidden="true">
      <div className="cursor__dot" />
      <div className="cursor__ring" />
      <div className="cursor__label" id="cursorLabel" />
    </div>
  );
}
