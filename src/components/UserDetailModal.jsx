import { useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "motion/react";
import { X } from "lucide-react";
import UserCard from "./UserCard";

export default function UserDetailModal({
  isOpen,
  onClose,
  user,
  actions = null,
}) {
  const cardRef = useRef(null);

  // 3D Tilt interactive physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 250 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
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

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && user && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          style={{ perspective: 1200 }}
        >
          <motion.div
            ref={cardRef}
            initial={{ opacity: 0, scale: 0.78, rotateX: 18, y: 35 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.82, rotateX: -14, y: 25 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm my-auto select-none max-h-[calc(100dvh-2rem)]"
          >
            {/* Close Button floating top-right */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 sm:-top-3 sm:-right-3 z-30 btn btn-circle btn-sm bg-base-100/90 backdrop-blur-sm border border-base-content/20 shadow-xl hover:bg-base-200 text-base-content hover:scale-110 active:scale-95 transition-all cursor-pointer"
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
