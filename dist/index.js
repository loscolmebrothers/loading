// src/Loading.tsx
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { gsap } from "gsap";

// src/defaultAssets.ts
var BASE = "https://assets.loscolmebrothers.com/logo/slices/vector";
var DEFAULT_SLICES = [
  { src: `${BASE}/LOS.svg`, alt: "LOS" },
  { src: `${BASE}/COLME.svg`, alt: "COLME" },
  { src: `${BASE}/BROTHERS.svg`, alt: "BROTHERS" }
];

// src/Loading.tsx
import { jsx } from "react/jsx-runtime";
var Loading = forwardRef(
  ({ slices = DEFAULT_SLICES, className = "", duration, onFinish, inverted }, ref) => {
    const overlayRef = useRef(null);
    const sliceRefs = useRef([]);
    const finishedRef = useRef(false);
    const durationTimerRef = useRef(void 0);
    const onFinishRef = useRef(onFinish);
    const exitFnRef = useRef(null);
    onFinishRef.current = onFinish;
    useEffect(() => {
      if (!overlayRef.current) return;
      finishedRef.current = false;
      const ctx = gsap.context(() => {
        gsap.fromTo(
          sliceRefs.current,
          { opacity: 0, y: 24, scale: 0.92 },
          {
            opacity: 0.5,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.18,
            ease: "back.out(1.5)"
          }
        );
        const idleDelay = 0.7 + slices.length * 0.18 + 0.2;
        sliceRefs.current.forEach((el, i) => {
          if (!el) return;
          gsap.to(el, {
            y: "+=10",
            duration: 1.6 + i * 0.25,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: idleDelay
          });
          gsap.to(el, {
            opacity: 0.3,
            duration: 1.5 + i * 0.3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: idleDelay + i * 0.1
          });
        });
        if (duration) {
          durationTimerRef.current = window.setTimeout(() => {
            exitFnRef.current?.();
          }, duration);
        }
      }, overlayRef);
      exitFnRef.current = (onComplete) => {
        if (finishedRef.current) {
          onComplete?.();
          return;
        }
        finishedRef.current = true;
        if (durationTimerRef.current) clearTimeout(durationTimerRef.current);
        sliceRefs.current.forEach((el) => {
          if (el) gsap.killTweensOf(el);
        });
        const tl = gsap.timeline({
          onComplete: () => {
            if (overlayRef.current) overlayRef.current.style.display = "none";
            onComplete?.();
            onFinishRef.current?.();
          }
        });
        tl.to(sliceRefs.current, {
          y: "+=18",
          duration: 0.28,
          ease: "sine.inOut",
          stagger: 0.04
        }).to(
          sliceRefs.current,
          {
            opacity: 0,
            y: -32,
            duration: 0.4,
            stagger: 0.06,
            ease: "power2.in",
            overwrite: true
          },
          "-=0.05"
        ).to(
          overlayRef.current,
          { opacity: 0, duration: 0.3, ease: "power2.inOut" },
          "-=0.15"
        );
      };
      return () => {
        ctx.revert();
        if (durationTimerRef.current) clearTimeout(durationTimerRef.current);
      };
    }, [slices, duration, inverted]);
    useImperativeHandle(ref, () => ({
      finish: (onComplete) => {
        exitFnRef.current?.(onComplete);
      }
    }));
    return /* @__PURE__ */ jsx(
      "div",
      {
        ref: overlayRef,
        className: `fixed inset-0 z-40 flex flex-col items-center justify-center gap-1 bg-white ${className}`,
        children: slices.map((slice, i) => /* @__PURE__ */ jsx(
          "div",
          {
            ref: (el) => {
              sliceRefs.current[i] = el;
            },
            className: "opacity-0",
            children: /* @__PURE__ */ jsx(
              "img",
              {
                src: slice.src,
                alt: slice.alt ?? "",
                draggable: false,
                className: "h-9 w-auto select-none sm:h-11",
                style: inverted ? { filter: "invert(1)" } : void 0
              }
            )
          },
          i
        ))
      }
    );
  }
);
Loading.displayName = "Loading";
export {
  DEFAULT_SLICES,
  Loading
};
//# sourceMappingURL=index.js.map