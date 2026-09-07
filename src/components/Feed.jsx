import {
  UserCheck,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Zap,
} from "lucide-react";
import { useFeed } from "../hooks/useFeed";
import UserCard from "./UserCard";

export default function Feed() {
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
  } = useFeed();

  // Loading state (initial mount)
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
        <div className="card w-full max-w-sm bg-base-100 shadow-xl border border-base-content/10 p-8 flex flex-col items-center gap-4 relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <UserCheck className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h2 className="text-xl font-bold text-base-content">
            Orbit Queue Cleared
          </h2>
          <p className="text-xs text-base-content/60 leading-relaxed">
            You&apos;ve reviewed all active founders and builders in your Orbit.
            Refresh whenever you&apos;re ready to explore new arrivals.
          </p>
          <button
            onClick={handleRefresh}
            className="btn btn-sm btn-outline gap-2 mt-2 font-mono text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Check for New Profiles
          </button>
        </div>
      </div>
    );
  }

  // Calculate rotation and stamp opacity
  const rotationDeg = isDragging
    ? dragOffset.x * 0.08
    : flyDirection === "right"
      ? 28
      : flyDirection === "left"
        ? -28
        : 0;

  const translateX = flyDirection === "right"
    ? 650
    : flyDirection === "left"
      ? -650
      : dragOffset.x;

  const translateY = flyDirection ? 40 : dragOffset.y;

  const cardStyle = {
    transform: `translate3d(${translateX}px, ${translateY}px, 0) rotate(${rotationDeg}deg)`,
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
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 select-none relative overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast toast-top toast-center z-50 transition-all duration-300">
          <div className="alert alert-neutral py-2 px-4 shadow-xl border border-base-content/10 text-xs font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Feed Queue Tracker Badge */}
      <div className="mb-4 flex items-center gap-2 text-xs font-mono text-base-content/60">
        <Zap className="w-3.5 h-3.5 text-primary" />
        <span>
          {feed.length} {feed.length === 1 ? "builder" : "builders"} in queue
        </span>
      </div>

      {/* Cards Deck Stack Container */}
      <div className="relative w-full max-w-sm min-h-[490px] sm:min-h-[510px] flex items-center justify-center">
        {/* Background Peek Card (Next in queue) */}
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

        {/* Foreground Active Card — key ensures fresh DOM node per user (no bounce glitch) */}
        <div
          key={currentUser._id}
          ref={cardRef}
          {...pointerHandlers}
          style={cardStyle}
          className="relative w-full z-20 touch-none flex justify-center"
        >
          {/* Visual Feedback Stamps */}
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
          />
        </div>
      </div>

      {/* Keyboard Helper Hints */}
      <div className="hidden sm:flex items-center gap-6 mt-4 text-[11px] font-mono text-base-content/40">
        <span className="flex items-center gap-1">
          <kbd className="kbd kbd-xs">
            <ArrowLeft className="w-3 h-3" />
          </kbd>
          <span>Pass</span>
        </span>
        <span className="flex items-center gap-1">
          <kbd className="kbd kbd-xs">
            <ArrowRight className="w-3 h-3" />
          </kbd>
          <span>Connect</span>
        </span>
      </div>
    </div>
  );
}
