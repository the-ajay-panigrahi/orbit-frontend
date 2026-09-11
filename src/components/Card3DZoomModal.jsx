import { useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "motion/react";
import { X } from "lucide-react";
import UserCard from "./UserCard";

export default function Card3DZoomModal({
  isOpen,
  onClose,
  user,
  onPass,
  onConnect,
  showActions = true,
}) {
  const cardRef = useRef(null);

  // 3D Tilt interactive physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 280 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], ["-12deg", "12deg"]);

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

  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  return (
    <AnimatePresence>
      {isOpen && user && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 xs:p-4 sm:p-8 overflow-y-auto"
          style={{ perspective: 1200 }}
        >
          {/* Card zooming up uniformly in 3D, keeping exact aspect ratio */}
          <motion.div
            ref={cardRef}
            initial={{
              opacity: 0,
              scale: 0.92,
              y: 20,
              rotateX: 12,
            }}
            animate={{
              opacity: 1,
              scale: isMobile ? 1 : 1.08,
              y: 0,
              rotateX: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.92,
              y: 16,
              rotateX: -10,
            }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 280,
            }}
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm my-auto select-none origin-center max-h-[calc(100dvh-2rem)]"
          >
            {/* Card wrapper maintaining exact aspect ratio with firmly anchored close button */}
            <div className="relative rounded-2xl shadow-2xl ring-1 ring-base-content/20">
              {/* Close Button firmly anchored directly to the card's top-right corner */}
              <button
                onClick={onClose}
                className="absolute top-2 right-2 sm:-top-3 sm:-right-3 z-40 btn btn-circle btn-sm bg-base-100/95 backdrop-blur-md border border-base-content/25 shadow-2xl hover:bg-base-200 text-base-content hover:scale-110 active:scale-95 transition-all cursor-pointer"
                aria-label="Close 3D profile inspection"
                title="Close (Esc)"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>

              {/* Exact UserCard rendered in its authentic aspect ratio */}
              <div className="rounded-2xl overflow-hidden bg-base-100">
                <UserCard
                  user={user}
                  showActions={showActions}
                  className="shadow-none border-0"
                  onPass={() => {
                    if (onPass) onPass();
                    onClose();
                  }}
                  onConnect={() => {
                    if (onConnect) onConnect();
                    onClose();
                  }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
