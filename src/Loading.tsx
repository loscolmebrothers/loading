import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { gsap } from "gsap";
import type { LoadingHandle, LoadingProps } from "./types";
import { DEFAULT_SLICES } from "./defaultAssets";

const STYLES = `
.los-loading {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
}
.los-loading__slice {
  opacity: 0;
  margin: 2px;
}
.los-loading__img {
  display: block;
  width: auto;
  user-select: none;
  -webkit-user-drag: none;
}
`;

let stylesInjected = false;
function injectStyles() {
  if (stylesInjected || typeof document === "undefined") return;
  if (document.querySelector("style[data-los-loading]")) {
    stylesInjected = true;
    return;
  }
  const style = document.createElement("style");
  style.setAttribute("data-los-loading", "");
  style.textContent = STYLES;
  document.head.appendChild(style);
  stylesInjected = true;
}
injectStyles();

export const Loading = forwardRef<LoadingHandle, LoadingProps>(
  ({ slices = DEFAULT_SLICES, className = "", size = 48, duration, onFinish, inverted }, ref) => {
    const overlayRef = useRef<HTMLDivElement>(null);
    const sliceRefs = useRef<(HTMLDivElement | null)[]>([]);
    const finishedRef = useRef(false);
    const durationTimerRef = useRef<number | undefined>(undefined);
    const onFinishRef = useRef(onFinish);
    const exitFnRef = useRef<((onComplete?: () => void) => void) | null>(null);

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
            ease: "back.out(1.5)",
          },
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
            delay: idleDelay,
          });
          gsap.to(el, {
            opacity: 0.3,
            duration: 1.5 + i * 0.3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: idleDelay + i * 0.1,
          });
        });

        if (duration) {
          durationTimerRef.current = window.setTimeout(() => {
            exitFnRef.current?.();
          }, duration);
        }
      }, overlayRef);

      exitFnRef.current = (onComplete?: () => void) => {
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
          },
        });

        tl.to(sliceRefs.current, {
          y: "+=18",
          duration: 0.28,
          ease: "sine.inOut",
          stagger: 0.04,
        })
          .to(
            sliceRefs.current,
            {
              opacity: 0,
              y: -32,
              duration: 0.4,
              stagger: 0.06,
              ease: "power2.in",
              overwrite: true,
            },
            "-=0.05",
          );
      };

      return () => {
        ctx.revert();
        if (durationTimerRef.current) clearTimeout(durationTimerRef.current);
      };
    }, [slices, duration, inverted]);

    useImperativeHandle(ref, () => ({
      finish: (onComplete?: () => void) => {
        exitFnRef.current?.(onComplete);
      },
    }));

    const imgHeight = typeof size === "number" ? `${size}px` : size;

    return (
      <div
        ref={overlayRef}
        className={`los-loading${className ? ` ${className}` : ""}`}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "2px",
        }}
      >
        {slices.map((slice, i) => (
          <div
            key={i}
            ref={(el) => {
              sliceRefs.current[i] = el;
            }}
            className="los-loading__slice"
            style={{
              opacity: 0,
              margin: "2px",
              ...(inverted ? { filter: "invert()" } : {}),
            }}
          >
            <img
              src={slice.src}
              alt={slice.alt ?? ""}
              draggable={false}
              className="los-loading__img"
              style={{ height: imgHeight, display: "block", userSelect: "none" }}
            />
          </div>
        ))}
      </div>
    );
  },
);

Loading.displayName = "Loading";
