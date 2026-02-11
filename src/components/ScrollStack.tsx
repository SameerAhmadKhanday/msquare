import React, { useRef, useEffect, useState, createContext, useContext } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

interface ScrollStackContextValue {
  totalItems: number;
}

const ScrollStackContext = createContext<ScrollStackContextValue>({ totalItems: 0 });

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
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start 0.6", "start 0.1"],
  });

  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, 0.92 + index * 0.005]
  );

  const y = useTransform(scrollYProgress, [0, 1], [0, -(index * 8)]);

  return (
    <div ref={cardRef} className="sticky top-24 mb-8 last:mb-0">
      <motion.div
        style={{ scale, y }}
        className="origin-top"
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
    <ScrollStackContext.Provider value={{ totalItems: items.length }}>
      <div className={`relative ${className}`}>
        {items.map((child, i) => {
          if (React.isValidElement<ScrollStackItemProps>(child)) {
            return React.cloneElement(child, {
              index: i,
              total: items.length,
            });
          }
          return child;
        })}
        {/* Extra spacer so last card has room to settle */}
        <div className="h-[20vh]" />
      </div>
    </ScrollStackContext.Provider>
  );
};

export default ScrollStack;
