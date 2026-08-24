"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

export const SIZE_PRESETS = {
  hero: "100vw",
  card: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  detail: "(max-width: 1024px) 100vw, 50vw",
  related: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  showcase: "(max-width: 1024px) 100vw, 55vw",
};

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  fill?: boolean;
  width?: number;
  height?: number;
}

/**
 * Optimized local product image via next/image (WebP/AVIF when supported).
 * Parent must be position:relative with defined size (or aspect ratio).
 */
export function OptimizedImage({
  src,
  alt,
  className = "",
  sizes = SIZE_PRESETS.card,
  priority = false,
  quality = 80,
  fill = true,
  width,
  height,
}: OptimizedImageProps) {
  const shared = {
    src,
    alt,
    className: `object-cover object-center ${className}`,
    sizes,
    quality,
    priority,
    ...(priority ? {} : { loading: "lazy" as const }),
  };

  if (fill) {
    return <Image {...shared} fill />;
  }

  return <Image {...shared} width={width} height={height} />;
}

interface RevealImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  zoomOnHover?: boolean;
  priority?: boolean;
  quality?: number;
}

export function RevealImage({
  src,
  alt,
  className = "",
  sizes = SIZE_PRESETS.card,
  zoomOnHover = true,
  priority = false,
  quality = 80,
}: RevealImageProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      initial={reduceMotion ? false : { opacity: 0, scale: 1.08, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 1, ease }}
      whileHover={
        reduceMotion || !zoomOnHover
          ? undefined
          : { scale: 1.05, transition: { duration: 0.7, ease } }
      }
    >
      <OptimizedImage src={src} alt={alt} className={className} sizes={sizes} priority={priority} quality={quality} />
    </motion.div>
  );
}

interface HeroBackgroundImageProps {
  src: string;
  alt: string;
}

export function HeroBackgroundImage({ src, alt }: HeroBackgroundImageProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="absolute inset-0"
      initial={reduceMotion ? false : { scale: 1.12, opacity: 0 }}
      animate={
        reduceMotion
          ? { scale: 1, opacity: 1 }
          : { scale: [1.06, 1.12, 1.06], opacity: 1 }
      }
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              opacity: { duration: 1.1, ease },
              scale: { duration: 22, repeat: Infinity, ease: "easeInOut" },
            }
      }
    >
      <OptimizedImage
        src={src}
        alt={alt}
        className="object-[58%_center] opacity-50 sm:object-center"
        sizes={SIZE_PRESETS.hero}
        priority
        quality={75}
      />
    </motion.div>
  );
}
