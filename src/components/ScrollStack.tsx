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
  const isLast = index === total - 1;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Previous cards scale down and dim as next card slides over
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const brightness = useTransform(scrollYProgress, [0, 1], [1, 0.6]);

  const stickyTop = 80 + index * 20;

  return (
    <div
      ref={ref}
      style={{ height: isLast ? "auto" : "100vh" }}
    >
      <motion.div
        style={{
          position: "sticky",
          top: `${stickyTop}px`,
          scale: isLast ? 1 : scale,
          filter: isLast ? "none" : undefined,
          transformOrigin: "top center",
          zIndex: index,
        }}
      >
        <motion.div style={{ opacity: isLast ? 1 : brightness }}>
          {children}
        </motion.div>
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
