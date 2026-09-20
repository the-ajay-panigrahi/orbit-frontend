import { motion } from "motion/react";

/**
 * HandwrittenText — Organic ink-pen writing effect with full-width underline.
 *
 * Characters spring into view with rotation + blur (pen-on-paper feel).
 * Underline is revealed via CSS clip-path (left→right wipe), NOT pathLength.
 * This avoids the SVG pathLength + preserveAspectRatio="none" rendering bug
 * that causes broken/gapped strokes on wide viewports.
 */
export default function HandwrittenText({
  text = "move with you.",
  className = "",
  underlineClassName = "",
  startDelay = 0.4,
  charStagger = 0.055,
}) {
  const characters = Array.from(text);
  const underlineDelay = startDelay + characters.length * charStagger + 0.28;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: charStagger,
        delayChildren: startDelay,
      },
    },
  };

  const charVariants = {
    hidden: {
      opacity: 0,
      y: 10,
      scale: 0.55,
      rotateZ: -8,
      filter: "blur(3px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateZ: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 14,
        mass: 0.5,
      },
    },
  };

  return (
    <span
      className={`relative inline-block font-handwriting select-none whitespace-nowrap ${className}`}
      aria-label={text}
    >
      <motion.span
        className="inline-flex items-baseline"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        aria-hidden="true"
      >
        {characters.map((char, index) => (
          <motion.span
            key={`${char}-${index}`}
            variants={charVariants}
            className="inline-block origin-bottom-left"
            style={{ whiteSpace: char === " " ? "pre" : "normal" }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.span>

      {/* Underline: full SVG always rendered, revealed left→right via clip-path */}
      <motion.div
        className={`absolute -bottom-1.5 left-0 w-full h-5 pointer-events-none ${underlineClassName}`}
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={{ clipPath: "inset(0 0% 0 0)" }}
        transition={{
          delay: underlineDelay,
          duration: 0.45,
          ease: [0.22, 1, 0.36, 1],
        }}
        aria-hidden="true"
      >
        <svg
          className="w-full h-full text-base-content/80 overflow-visible"
          viewBox="0 0 100 12"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M 1 9 C 30 3, 70 12, 99 5"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </motion.div>
    </span>
  );
}
