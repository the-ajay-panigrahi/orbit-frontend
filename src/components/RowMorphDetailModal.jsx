import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "motion/react";
import { X } from "lucide-react";
import UserCard from "./UserCard";

export default function RowMorphDetailModal({
  isOpen,
  onClose,
  user,
  originRect = null,
  actions = null,
}) {
  const cardRef = useRef(null);
  const [isSettled, setIsSettled] = useState(false);

  // 3D Tilt interactive physics (active once settled in center)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 260 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const tiltRotateX = useTransform(smoothY, [-0.5, 0.5], ["10deg", "-10deg"]);
  const tiltRotateY = useTransform(smoothX, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    if (!cardRef.current || !isSettled) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Calculate delta coordinates and aspect scale from the clicked row to screen center
  const getTransformOrigin = () => {
    if (!originRect || typeof window === "undefined") {
      return { deltaX: 0, deltaY: 40, scaleX: 0.9, scaleY: 0.6, rotateX: 25, rotateY: 0 };
    }

    const viewportCenterX = window.innerWidth / 2;
    const viewportCenterY = window.innerHeight / 2;
    const rowCenterX = originRect.left + originRect.width / 2;
    const rowCenterY = originRect.top + originRect.height / 2;

    const deltaX = rowCenterX - viewportCenterX;
    const deltaY = rowCenterY - viewportCenterY;

    // Approximate card size is 380px wide by 500px tall
    const cardWidth = Math.min(380, window.innerWidth - 32);
    const cardHeight = Math.min(520, window.innerHeight - 40);

    const scaleX = Math.min(Math.max(originRect.width / cardWidth, 0.9), 1.15);
    const scaleY = Math.min(Math.max(originRect.height / cardHeight, 0.35), 0.55);

    const rotateX = deltaY > 0 ? 30 : -25;
    const rotateY = deltaX !== 0 ? (deltaX > 0 ? -12 : 12) : 0;

    return { deltaX, deltaY, scaleX, scaleY, rotateX, rotateY };
  };

  const { deltaX, deltaY, scaleX, scaleY, rotateX, rotateY } = getTransformOrigin();

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) {
      setIsSettled(false);
      return;
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence onExitComplete={() => setIsSettled(false)}>
      {isOpen && user && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          style={{ perspective: 1200 }}
        >
          {/* Card flying and morphing from row directly into screen center */}
          <motion.div
            ref={cardRef}
            initial={{
              x: deltaX,
              y: deltaY,
              scaleX: scaleX,
              scaleY: scaleY,
              rotateX: rotateX,
              rotateY: rotateY,
              opacity: 0.75,
              borderRadius: "20px",
            }}
            animate={{
              x: 0,
              y: 0,
              scaleX: 1,
              scaleY: 1,
              rotateX: 0,
              rotateY: 0,
              opacity: 1,
              borderRadius: "16px",
            }}
            exit={{
              x: deltaX,
              y: deltaY,
              scaleX: scaleX,
              scaleY: scaleY,
              rotateX: rotateX * 0.8,
              rotateY: rotateY * 0.8,
              opacity: 0,
              borderRadius: "20px",
            }}
            transition={{
              type: "spring",
              damping: 24,
              stiffness: 270,
              mass: 0.85,
            }}
            onAnimationComplete={() => setIsSettled(true)}
            style={{
              rotateX: isSettled ? tiltRotateX : undefined,
              rotateY: isSettled ? tiltRotateY : undefined,
              transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm my-auto select-none origin-center"
          >
            {/* Close Button floating top-right */}
            <button
              onClick={onClose}
              className="absolute -top-3 -right-3 z-30 btn btn-circle btn-sm bg-base-100/90 backdrop-blur-sm border border-base-content/20 shadow-xl hover:bg-base-200 text-base-content hover:scale-110 active:scale-95 transition-all cursor-pointer"
              aria-label="Close user profile"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Complete UserCard display */}
            <div className="shadow-2xl rounded-2xl overflow-hidden ring-1 ring-base-content/15">
              <UserCard user={user} showActions={false} customActions={actions} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
