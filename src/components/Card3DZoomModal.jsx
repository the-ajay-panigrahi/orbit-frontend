import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 xs:p-5 sm:p-8 py-6 sm:py-10 overflow-y-auto">
          {/* Isolated Backdrop Overlay with independent fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
          />

          {/* Crisp, native 1:1 spring card (No scale transform to guarantee 100% razor-sharp text on all screens) */}
          <motion.div
            initial={{
              opacity: 0,
              y: 16,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 16,
            }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 350,
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[360px] xs:max-w-[390px] sm:max-w-md my-auto mx-auto select-none origin-center max-h-[calc(100dvh-3rem)] z-10"
          >
            {/* Card wrapper with firmly anchored close button */}
            <div className="relative rounded-2xl shadow-2xl ring-1 ring-base-content/20">
              {/* Close Button firmly anchored directly to the card's top-right corner */}
              <button
                onClick={onClose}
                className="absolute top-2 right-2 sm:-top-3 sm:-right-3 z-40 btn btn-circle btn-sm bg-base-100/95 backdrop-blur-md border border-base-content/25 shadow-2xl hover:bg-base-200 text-base-content hover:scale-110 active:scale-95 transition-all cursor-pointer"
                aria-label="Close profile inspection"
                title="Close (Esc)"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>

              {/* Exact UserCard rendered with full details displayed - 100% razor sharp */}
              <div className="rounded-2xl overflow-y-auto max-h-[calc(100dvh-4.5rem)] bg-base-100">
                <UserCard
                  user={user}
                  showActions={showActions}
                  isExpanded={true}
                  className="shadow-none border-0 max-w-none"
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
        </div>
      )}
    </AnimatePresence>
  );
}
