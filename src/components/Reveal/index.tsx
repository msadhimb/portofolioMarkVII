"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useIsMobileViewport, usePrefersReducedMotion } from "@/hooks/use-media-query";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export const Reveal = ({ children, delay = 0, className }: RevealProps) => {
  const reduce = usePrefersReducedMotion();
  const isMobile = useIsMobileViewport();

  if (reduce || isMobile) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};
