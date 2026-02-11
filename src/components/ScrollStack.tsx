import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ScrollStackItemProps {
  children: React.ReactNode;
  index?: number;
  total?: number;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({
  children,
  index = 0,
  total = 1,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Each card scales down as the NEXT card scrolls in
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0.7]);
  const boxShadow = useTransform(
    scrollYProgress,
    [0, 1],
    [
      "0 4px 20px rgba(0,0,0,0.08)",
      "0 2px 10px rgba(0,0,0,0.04)",
    ]
  );

  // Stagger the sticky top position so cards peek below
  const stickyTop = 96 + index * 28;

  return (
    <div
      ref={ref}
      className="relative"
      style={{ height: "80vh" }}
    >
      <motion.div
        style={{
          scale,
          opacity,
          boxShadow,
          position: "sticky",
          top: `${stickyTop}px`,
          transformOrigin: "top center",
        }}
        className="rounded-xl overflow-hidden"
      >
        {children}
      </motion.div>
    </div>
  );
};

interface ScrollStackProps {
  children: React.ReactNode;
  className?: string;
}

const ScrollStack: React.FC<ScrollStackProps> = ({ children, className = "" }) => {
  const items = React.Children.toArray(children);

  return (
    <div className={`relative ${className}`}>
      {items.map((child, i) => {
        if (React.isValidElement<ScrollStackItemProps>(child)) {
          return React.cloneElement(child, {
            key: i,
            index: i,
            total: items.length,
          });
        }
        return child;
      })}
    </div>
  );
};

export default ScrollStack;
