import React, { useLayoutEffect, useRef, useCallback } from "react";
import type { ReactNode } from "react";
import Lenis from "lenis";

export interface ScrollStackItemProps {
  children: ReactNode;
  itemClassName?: string;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({
  children,
  itemClassName = "",
}) => (
  <div
    className={`scroll-stack-card ${itemClassName}`}
    style={{
      position: "sticky",
      top: 0,
      willChange: "transform",
    }}
  >
    {children}
  </div>
);

interface ScrollStackProps {
  className?: string;
  children: ReactNode;
  /** Distance between cards (in vh). Default 40 */
  itemDistance?: number;
  /** How much cards scale when stacked. Default 0.05 */
  itemScale?: number;
  /** Gap between stacked cards in px. Default 20 */
  itemStackDistance?: number;
  /** Where stacking starts (CSS top). Default "10%" */
  stackPosition?: string;
  /** Where scale ends (CSS position). Default "60%" */
  scaleEndPosition?: string;
  /** Minimum scale. Default 0.88 */
  baseScale?: number;
  /** Scale animation duration (unused if scroll-driven). Default 0.5 */
  scaleDuration?: number;
  /** Use window scroll instead of container. Default false */
  useWindowScroll?: boolean;
  onStackComplete?: () => void;
}

const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = "",
  itemDistance = 40,
  itemScale = 0.05,
  itemStackDistance = 20,
  stackPosition = "10%",
  scaleEndPosition = "60%",
  baseScale = 0.88,
  scaleDuration = 0.5,
  useWindowScroll = false,
  onStackComplete,
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const stackCompletedRef = useRef(false);

  const parsePercentage = useCallback(
    (value: string, total: number) => (parseFloat(value) / 100) * total,
    []
  );

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return {
        scrollTop: window.scrollY,
        clientHeight: window.innerHeight,
      };
    }
    const el = scrollerRef.current;
    if (!el) return { scrollTop: 0, clientHeight: 0 };
    return {
      scrollTop: el.scrollTop,
      clientHeight: el.clientHeight,
    };
  }, [useWindowScroll]);

  const getElementOffset = useCallback(
    (el: HTMLElement) => {
      if (useWindowScroll) {
        return el.getBoundingClientRect().top + window.scrollY;
      }
      return el.offsetTop;
    },
    [useWindowScroll]
  );

  const calculateProgress = useCallback(
    (
      scrollTop: number,
      start: number,
      end: number
    ) => Math.min(1, Math.max(0, (scrollTop - start) / (end - start))),
    []
  );

  const updateCardTransforms = useCallback(() => {
    const container = scrollerRef.current;
    if (!container) return;

    const cards = Array.from(
      container.querySelectorAll<HTMLElement>(".scroll-stack-card")
    );
    if (!cards.length) return;

    const { scrollTop, clientHeight } = getScrollData();
    const stackPos = parsePercentage(stackPosition, clientHeight);
    const scaleEndPos = parsePercentage(scaleEndPosition, clientHeight);

    let allDone = true;

    cards.forEach((card, i) => {
      const cardTop = getElementOffset(card);
      const nextCard = cards[i + 1];

      // Scale down as next card approaches
      if (nextCard) {
        const nextCardTop = getElementOffset(nextCard);
        const scaleStart = nextCardTop - clientHeight;
        const scaleEnd = nextCardTop - scaleEndPos;
        const scaleProgress = calculateProgress(scrollTop, scaleStart, scaleEnd);

        const targetScale = 1 - scaleProgress * itemScale;
        const clampedScale = Math.max(baseScale, targetScale);

        card.style.transform = `scale(${clampedScale})`;
        card.style.transition = `transform ${scaleDuration}s ease-out`;

        if (scaleProgress < 1) allDone = false;
      }

      // Sticky behavior — translate card up to stack position
      const stickyStart = cardTop - stackPos;
      const stickyEnd = cardTop;
      const stickyProgress = calculateProgress(scrollTop, stickyStart, stickyEnd);

      if (stickyProgress >= 1) {
        const stackOffset = i * itemStackDistance;
        card.style.top = `${stackPos + stackOffset}px`;
      } else {
        card.style.top = `${stackPos}px`;
      }
    });

    if (allDone && !stackCompletedRef.current && cards.length > 1) {
      stackCompletedRef.current = true;
      onStackComplete?.();
    }
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    scaleDuration,
    useWindowScroll,
    onStackComplete,
    calculateProgress,
    parsePercentage,
    getScrollData,
    getElementOffset,
  ]);

  const handleScroll = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(updateCardTransforms);
  }, [updateCardTransforms]);

  const setupLenis = useCallback(() => {
    if (useWindowScroll) {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
      });
      lenisRef.current = lenis;

      const raf = (time: number) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);

      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", handleScroll);
        lenis.destroy();
      };
    }

    const el = scrollerRef.current;
    if (!el) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
      infinite: false,
      wrapper: el,
      content: el.firstElementChild as HTMLElement,
    });
    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", handleScroll);
      lenis.destroy();
    };
  }, [handleScroll, useWindowScroll]);

  useLayoutEffect(() => {
    const cleanup = setupLenis();
    updateCardTransforms();
    stackCompletedRef.current = false;

    return () => {
      cleanup?.();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
    };
  }, [setupLenis, updateCardTransforms]);

  // Calculate total height so cards have scroll runway
  const cardCount = React.Children.count(children);
  const totalHeight = `${cardCount * itemDistance}vh`;

  if (useWindowScroll) {
    return (
      <div
        className={`relative ${className}`}
        ref={scrollerRef}
        style={{ minHeight: totalHeight }}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-full overflow-y-auto overflow-x-visible ${className}`.trim()}
      ref={scrollerRef}
      style={{
        overscrollBehavior: "contain",
        WebkitOverflowScrolling: "touch",
        scrollBehavior: "smooth",
        willChange: "scroll-position",
      }}
    >
      <div style={{ minHeight: totalHeight, position: "relative" }}>
        {children}
      </div>
    </div>
  );
};

export default ScrollStack;
