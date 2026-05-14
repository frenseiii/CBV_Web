import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  curtainClassName?: string;
  delay?: number;
  variant?: "up" | "card" | "scale" | "curtain" | "drop";
  curtainDirection?: "up" | "down";
};

export function Reveal({
  children,
  className = "",
  curtainClassName = "bg-background",
  delay = 0,
  variant = "up",
  curtainDirection = "up",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  // Default visible, guarantees content always renders even if IO never fires (SSR, reduced-motion, old browsers)
  const [shown, setShown] = useState(true);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    let cancelled = false;
    setShown(false);

    const reveal = () => {
      requestAnimationFrame(() => requestAnimationFrame(() => !cancelled && setShown(true)));
    };

    const rect = el.getBoundingClientRect();
    // Stricter triggers for curtain/drop so the reveal only fires when the
    // user has actually scrolled to the section, not when it merely peeks
    // above the fold on initial page load.
    const strict = variant === "drop" || variant === "curtain";
    const inView = strict
      ? rect.top < window.innerHeight * 0.35 && rect.bottom > 0
      : rect.top < window.innerHeight && rect.bottom > 0;
    if (inView) {
      reveal();
      return;
    }

    const rootMargin = strict ? "0px 0px -65% 0px" : "0px 0px -10% 0px";

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            reveal();
          } else {
            // re-arm: hide again when fully out, so it animates next time
            if (!cancelled) setShown(false);
          }
        }
      },
      { threshold: 0, rootMargin },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, []);

  const base =
    "transition-[opacity,transform,clip-path] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform";
  const hidden =
    variant === "curtain"
      ? "opacity-0 [clip-path:inset(0_0_100%_0)] [transform:translate3d(0,56px,0)]"
      : variant === "card"
        ? "opacity-0 [transform:perspective(1200px)_rotateX(10deg)_translate3d(0,28px,0)]"
        : variant === "scale"
          ? "opacity-0 [transform:scale(0.97)]"
          : "opacity-0 [transform:translate3d(0,24px,0)]";
  const visible = "opacity-100 [clip-path:inset(0_0_0_0)] [transform:none]";

  if (variant === "curtain") {
    return (
      <div ref={ref} className={`relative overflow-hidden ${className}`}>
        <div
          className={`${base} ${shown ? visible : hidden}`}
          style={{ transitionDelay: `${delay}ms` }}
        >
          {children}
        </div>
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 z-10 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${curtainClassName} ${
            shown
              ? curtainDirection === "down"
                ? "translate-y-full"
                : "-translate-y-full"
              : "translate-y-0"
          }`}
          style={{ transitionDelay: `${delay}ms` }}
        />
      </div>
    );
  }

  if (variant === "drop") {
    return <DropPanel className={className} delay={delay}>{children}</DropPanel>;
  }

  return (
    <div
      ref={ref}
      className={`${base} ${shown ? visible : hidden} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function DropPanel({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [height, setHeight] = useState(0);

  // Measure natural height of the content so we can animate the wrapper
  // from height: 0 -> measured height when revealing.
  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;
    const measure = () => setHeight(inner.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(inner);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const check = () => {
      const rect = el.getBoundingClientRect();
      // Reveal once the wrapper's top is well within the viewport
      // (top edge has scrolled to within 40% of the viewport bottom).
      const trigger = window.innerHeight * 0.6;
      if (rect.top < trigger) setShown(true);
    };

    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{
        height: shown ? height : 0,
        transition:
          "height 1100ms cubic-bezier(0.22, 1, 0.36, 1)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <div
        ref={innerRef}
        className="transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
        style={{
          transform: shown ? "translateY(0)" : "translateY(-100%)",
          transitionDelay: `${delay}ms`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
