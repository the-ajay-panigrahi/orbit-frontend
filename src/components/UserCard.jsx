import { motion } from "motion/react";
import { X, Heart, Crown, Zap, ShieldCheck } from "lucide-react";

const springTap = { type: "spring", stiffness: 400, damping: 22 };

export default function UserCard({
  user = {},
  showActions = false,
  customActions = null,
  onPass,
  onConnect,
  className = "",
}) {
  const firstName = user?.firstName || "";
  const lastName = user?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim() || "Anonymous Builder";
  const profilePictureUrl = user?.profilePictureUrl || "/default-avatar.svg";
  const age = user?.age;
  const gender = user?.gender;
  const lookingFor = user?.lookingFor;
  const about = user?.about;
  const skills = Array.isArray(user?.skills) ? user.skills : [];
  const membershipType = user?.membershipType;
  const isPremium = membershipType === "premium";
  const isPro = membershipType === "pro";

  const maxWidthClass = className.includes("max-w-") ? "" : "max-w-sm";
  const tierCardClass = isPremium
    ? "border-2 border-amber-500/50 shadow-amber-500/10 hover:border-amber-500/80"
    : isPro
      ? "border-2 border-primary/40 shadow-primary/10 hover:border-primary/70"
      : "border border-base-content/10 hover:border-primary/30";

  return (
    <div
      className={`card w-full ${maxWidthClass} bg-base-100 shadow-xl ${tierCardClass} overflow-hidden transition-all duration-300 hover:shadow-2xl flex flex-col justify-between select-none ${className}`}
    >
      {/* Photo with Overlay Badges */}
      <figure className="p-3 pb-0 relative">
        <div className="w-full h-52 sm:h-60 rounded-2xl bg-base-200 text-base-content flex items-center justify-center overflow-hidden border border-base-content/8 relative group">
          <img
            src={profilePictureUrl}
            alt={fullName}
            width="600"
            height="480"
            fetchpriority="high"
            loading="eager"
            style={{ objectPosition: "center 18%" }}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            onError={(e) => {
              e.target.src = "/default-avatar.svg";
            }}
          />

          {/* Membership / Plan Badge */}
          {isPro && (
            <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-primary text-primary-content text-[11px] font-bold font-mono tracking-wider flex items-center gap-1 shadow-md">
              <Zap className="w-3 h-3 stroke-[2.5]" /> PRO
            </div>
          )}
          {isPremium && (
            <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-[11px] font-black font-mono tracking-wider flex items-center gap-1 shadow-lg">
              <Crown className="w-3.5 h-3.5 stroke-[2.5]" /> VIP
            </div>
          )}

          {/* Subtle gradient shadow for smooth transition */}
          <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
        </div>
      </figure>

      {/* Card Body */}
      <div className="card-body p-4 gap-2.5 flex-1 flex flex-col justify-between">
        {/* Name & Demographics */}
        <div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <h2 className="card-title text-lg sm:text-xl font-bold tracking-tight text-base-content truncate">
                {fullName}
              </h2>
              {isPremium ? (
                <Crown
                  className="w-4 h-4 text-amber-500 fill-amber-500/20 stroke-[2.5] shrink-0"
                  title="VIP Premium Builder"
                />
              ) : isPro ? (
                <Zap
                  className="w-4 h-4 text-primary fill-primary/20 stroke-[2.5] shrink-0"
                  title="Pro Builder"
                />
              ) : (
                <ShieldCheck
                  className="w-4 h-4 text-base-content/40 stroke-[2.5] shrink-0"
                  title="Verified Builder"
                />
              )}
            </div>
            {(age || gender) && (
              <span className="text-xs font-semibold text-base-content/65 bg-base-200 px-2 py-0.5 rounded-full shrink-0 capitalize">
                {[age, gender].filter(Boolean).join(" • ")}
              </span>
            )}
          </div>

          {/* Looking For Highlight Card */}
          {lookingFor && (
            <div className="mt-2 p-2 px-2.5 rounded-xl bg-primary/10 border border-primary/20 text-xs text-base-content flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-primary stroke-[2.5] shrink-0" />
              <div className="truncate">
                <span className="text-primary font-bold">Seeking: </span>
                <span className="font-medium text-base-content/80">{lookingFor}</span>
              </div>
            </div>
          )}
        </div>

        {/* Bio */}
        <p className="text-xs sm:text-sm text-base-content/75 leading-relaxed break-words line-clamp-3">
          {about || "Building and discovering innovative projects on Orbit."}
        </p>

        {/* Tech Stack Chips */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5 max-h-20 overflow-y-auto">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="badge badge-sm bg-base-200/80 hover:bg-primary/15 hover:text-primary transition-colors cursor-default text-base-content/80 font-mono border border-base-content/8 py-2 px-2 select-none"
                title={`Skill: ${skill}`}
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Actions Area */}
        <div className="card-actions justify-center items-center mt-2 pt-3 border-t border-base-content/8">
          {customActions ? (
            <div className="w-full">{customActions}</div>
          ) : showActions ? (
            <div className="w-full flex items-center justify-around px-4">
              <motion.button
                onClick={onPass}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.9 }}
                transition={springTap}
                className="btn btn-circle btn-md btn-outline border-error/30 text-error hover:bg-error hover:text-error-content hover:border-error transition-colors cursor-pointer shadow-xs"
                aria-label="Pass"
                title="Pass (Left Arrow)"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </motion.button>

              <div className="text-[10px] font-mono text-base-content/40 uppercase tracking-widest">
                Swipe / Tap
              </div>

              <motion.button
                onClick={onConnect}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.9 }}
                transition={springTap}
                className="btn btn-circle btn-md btn-primary shadow-lg shadow-primary/25 cursor-pointer"
                aria-label="Connect"
                title="Connect (Right Arrow)"
              >
                <Heart className="w-5 h-5 stroke-[2.5] fill-current" />
              </motion.button>
            </div>
          ) : (
            <div className="w-full flex items-center justify-center">
              <span className="badge badge-sm badge-primary badge-outline font-mono text-xs gap-1.5 py-2 px-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Live Preview
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
