"use client";

import { useEffect } from "react";

export function UXScript() {
  useEffect(() => {
    // Reveal observer
    if (!("IntersectionObserver" in window)) return;
    document.documentElement.classList.add("js-ready");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -10% 0px" }
    );

    const seen = new WeakSet();
    function observeAll() {
      document.querySelectorAll(".reveal").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        const r = el.getBoundingClientRect();
        const inView = r.top < window.innerHeight && r.bottom > 0;
        if (inView) {
          el.classList.add("is-in");
          return;
        }
        io.observe(el);
      });
    }

    observeAll();
    const mo = new MutationObserver(() => observeAll());
    mo.observe(document.body, { childList: true, subtree: true });
    [200, 600, 1500, 3000].forEach((t) => setTimeout(observeAll, t));
    setTimeout(() => {
      document.querySelectorAll(".reveal:not(.is-in)").forEach((el) =>
        el.classList.add("is-in")
      );
    }, 5000);

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
