import { useState } from "react";
import { RotateCcw, Sparkles, Compass, Maximize2, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { useFeed } from "../hooks/useFeed";
import UserCard from "./UserCard";
import Card3DZoomModal from "./Card3DZoomModal";

export default function Feed() {
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const {
    feed,
    currentUser,
    nextUser,
    isLoading,
    error,
    toastMessage,
    dragOffset,
    isDragging,
    flyDirection,
    cardRef,
    handleRefresh,
    triggerSwipeAction,
    pointerHandlers,
  } = useFeed({
    onCardTap: () => setIsZoomOpen(true),
  });

  if (isLoading && !feed) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="card w-full max-w-sm bg-base-100 shadow-xl border border-base-content/10 p-6 flex flex-col items-center gap-4">
          <div className="skeleton h-60 w-full rounded-2xl"></div>
          <div className="skeleton h-6 w-3/4"></div>
          <div className="skeleton h-4 w-1/2"></div>
          <div className="skeleton h-16 w-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 text-center">
        <div className="card w-full max-w-sm bg-base-100 shadow-xl border border-base-content/10 p-8 flex flex-col items-center gap-4">
          <p className="text-sm text-error font-medium">{error}</p>
          <button onClick={handleRefresh} className="btn btn-sm btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!feed || feed.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 text-center">
        <div className="card w-full max-w-sm bg-base-100 shadow-xl border border-base-content/10 p-8 flex flex-col items-center gap-5 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-subtle opacity-30 pointer-events-none" />
          <div className="relative w-20 h-20 rounded-full bg-primary/8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-primary/15 animate-ping" />
            <Compass className="w-9 h-9 text-primary stroke-[1.5]" />
          </div>
          <h2 className="text-xl font-bold text-base-content relative">
            Orbit Queue Cleared
          </h2>
          <p className="text-sm text-base-content/60 leading-relaxed relative">
            You&apos;ve reviewed all active founders and builders in your Orbit.
            Refresh whenever you&apos;re ready to explore new arrivals.
          </p>
          <motion.button
            onClick={handleRefresh}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 26 }}
            className="btn btn-sm btn-outline gap-2 font-mono text-xs relative cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Check for New Profiles
          </motion.button>
        </div>
      </div>
    );
  }

  const rotationDeg = isDragging
    ? dragOffset.x * 0.08
    : flyDirection === "right"
      ? 28
      : flyDirection === "left"
        ? -28
        : 0;

  const translateX =
    flyDirection === "right"
      ? 650
      : flyDirection === "left"
        ? -650
        : dragOffset.x;

  const translateY = flyDirection ? 40 : dragOffset.y;

  const cardStyle = {
    transform:
      isDragging || flyDirection
        ? `translate3d(${translateX}px, ${translateY}px, 0) rotate(${rotationDeg}deg)`
        : "none",
    transition: isDragging
      ? "none"
      : "transform 0.28s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.25s ease",
    opacity: flyDirection ? 0 : 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  const connectStampOpacity = isDragging
    ? Math.min(Math.max(dragOffset.x - 20, 0) / 90, 1)
    : flyDirection === "right"
      ? 1
      : 0;

  const passStampOpacity = isDragging
    ? Math.min(Math.max(-dragOffset.x - 20, 0) / 90, 1)
    : flyDirection === "left"
      ? 1
      : 0;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-3 sm:py-6 pb-20 sm:pb-6 select-none relative overflow-hidden w-full">
      {toastMessage && (
        <div className="toast toast-top toast-center z-50 transition-all duration-300">
          <div className="alert alert-neutral py-2 px-4 shadow-xl border border-base-content/10 text-xs font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="relative w-full max-w-[360px] xs:max-w-[370px] sm:max-w-sm mx-auto flex items-center justify-center">
        {nextUser && (
          <div
            key={nextUser._id}
            className="absolute inset-0 pointer-events-none flex justify-center"
            style={{
              transform: isDragging
                ? `scale(${Math.min(0.95 + Math.abs(dragOffset.x) * 0.0004, 1)}) translateY(${Math.max(12 - Math.abs(dragOffset.x) * 0.08, 0)}px)`
                : "scale(0.95) translateY(12px)",
              opacity: isDragging
                ? Math.min(0.6 + Math.abs(dragOffset.x) * 0.003, 1)
                : 0.65,
              zIndex: 10,
            }}
          >
            <UserCard user={nextUser} showActions={false} />
          </div>
        )}

        <div
          key={currentUser._id}
          ref={cardRef}
          {...pointerHandlers}
          style={cardStyle}
          className="relative w-full z-20 touch-none flex justify-center"
        >
          {connectStampOpacity > 0 && (
            <div
              style={{ opacity: connectStampOpacity }}
              className="absolute top-7 left-7 z-30 pointer-events-none transform -rotate-12 border-4 border-success text-success bg-base-100/90 font-black text-xl tracking-widest px-4 py-1.5 rounded-2xl shadow-2xl uppercase"
            >
              CONNECT
            </div>
          )}

          {passStampOpacity > 0 && (
            <div
              style={{ opacity: passStampOpacity }}
              className="absolute top-7 right-7 z-30 pointer-events-none transform rotate-12 border-4 border-error text-error bg-base-100/90 font-black text-xl tracking-widest px-4 py-1.5 rounded-2xl shadow-2xl uppercase"
            >
              PASS
            </div>
          )}

          <UserCard
            user={currentUser}
            showActions={true}
            onPass={() => triggerSwipeAction("left", currentUser)}
            onConnect={() => triggerSwipeAction("right", currentUser)}
            onExpand={() => setIsZoomOpen(true)}
          />
        </div>
      </div>

      {/* Floating Glass Controls Dock */}
      <div className="flex items-center gap-2 mt-3 p-1 px-3.5 rounded-full bg-base-100/90 backdrop-blur-md border border-base-content/10 shadow-xs text-xs font-mono text-base-content/65">
        <div className="hidden xs:flex items-center gap-1">
          <kbd className="kbd kbd-xs bg-base-200 text-base-content font-bold">←</kbd>
          <span>Pass</span>
        </div>
        <span className="hidden xs:inline opacity-25">•</span>
        <div className="hidden xs:flex items-center gap-1">
          <kbd className="kbd kbd-xs bg-base-200 text-base-content font-bold">→</kbd>
          <span>Connect</span>
        </div>
        <span className="hidden xs:inline opacity-25">•</span>
        <button
          onClick={() => setIsZoomOpen(true)}
          className="flex items-center gap-1 text-primary hover:text-primary/80 font-sans font-semibold cursor-pointer transition-colors"
          title="Inspect full profile details"
        >
          <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>View Details</span>
        </button>
      </div>

      <Card3DZoomModal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        user={currentUser}
        onPass={() => triggerSwipeAction("left", currentUser)}
        onConnect={() => triggerSwipeAction("right", currentUser)}
        showActions={true}
      />
    </div>
  );
}
