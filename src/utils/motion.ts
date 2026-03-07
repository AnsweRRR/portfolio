import type { Transition, Variants } from "framer-motion";

export const textVariant = (delay = 0) => {
  return {
    hidden: {
      opacity: 0,
      scale: 0.95,
    },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        duration: 1.25,
        delay,
      },
    },
  } satisfies Variants;
};

export const fadeIn = (
  _direction: string,
  type: NonNullable<Transition["type"]>,
  delay: number,
  duration: number,
) => {
  return {
    hidden: {
      opacity: 0,
      scale: 0.95,
    },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        type,
        delay,
        duration,
        ease: "easeOut" as const,
      },
    },
  } satisfies Variants;
};

export const zoomIn = (delay: number, duration: number) => {
  return {
    hidden: {
      scale: 0,
      opacity: 0,
    },
    show: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "tween" as const,
        delay: delay,
        duration: duration,
        ease: "easeOut" as const,
      },
    },
  } satisfies Variants;
};

export const slideIn = (
  direction: string,
  type: NonNullable<Transition["type"]>,
  delay: number,
  duration: number,
) => {
  return {
    hidden: {
      x: direction === "left" ? "-100%" : direction === "right" ? "100%" : 0,
      y: direction === "up" ? "100%" : direction === "down" ? "100%" : 0,
    },
    show: {
      x: 0,
      y: 0,
      transition: {
        type: type,
        delay: delay,
        duration: duration,
        ease: "easeOut" as const,
      },
    },
  } satisfies Variants;
};

export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0) => {
  return {
    hidden: {},
    show: {
      transition: {
        staggerChildren: staggerChildren,
        delayChildren: delayChildren || 0,
      },
    },
  } satisfies Variants;
};