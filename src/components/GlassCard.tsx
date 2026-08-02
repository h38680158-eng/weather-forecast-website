import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "../utils/cn";

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
  ariaLabel?: string;
}

/**
 * Reusable card that adapts to the active skin (glass / minimal / neon / cyberpunk)
 * via CSS variables set on :root, plus scroll-reveal + hover lift.
 */
export default function GlassCard({ children, className, delay = 0, hover = true, ariaLabel }: Props) {
  return (
    <motion.section
      aria-label={ariaLabel}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={hover ? { y: -4 } : undefined}
      className={cn("skin-card p-5", className)}
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        backdropFilter: "var(--card-blur)",
        WebkitBackdropFilter: "var(--card-blur)",
        borderRadius: "var(--card-radius)",
        boxShadow: "var(--card-shadow)",
      }}
    >
      {children}
    </motion.section>
  );
}
