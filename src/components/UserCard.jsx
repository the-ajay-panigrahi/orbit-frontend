import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "motion/react";
import { X, Heart, Crown, Zap, ShieldCheck, ArrowUpRight } from "lucide-react";

const springTap = { type: "spring", stiffness: 400, damping: 22 };

export default function UserCard({
  user = {},
  showActions = false,
  customActions = null,
  onPass,
  onConnect,
  onExpand = null,
  className = "",
  isExpanded = false,
}) {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    if (containerRef.current.clientWidth > 0) {
      setContainerWidth(containerRef.current.clientWidth);
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setContainerWidth(Math.floor(entry.contentRect.width));
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

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

  const { visibleSkills, remainingCount } = useMemo(() => {
    if (!skills || skills.length === 0) return { visibleSkills: [], remainingCount: 0 };
    if (isExpanded) {
      return { visibleSkills: skills, remainingCount: 0 };
    }

    // Default to sensible width if container hasn't measured yet
    const availableWidth =
      containerWidth > 0
        ? containerWidth
        : typeof window !== "undefined" && window.innerWidth < 400
          ? 310
          : 345;

    const GAP = 6;
    const CHAR_PX = 6.6;
    const CHIP_PADDING_BORDER = 22; // px-2.5 (20px) + border (2px)
    const MORE_PADDING_BORDER = 18; // px-2 (16px) + border (2px)

    const calcChipWidth = (str) => Math.ceil(str.length * CHAR_PX + CHIP_PADDING_BORDER);
    const calcMoreWidth = (count) =>
      Math.ceil(`+${count} more`.length * CHAR_PX + MORE_PADDING_BORDER);

    // 1. If ALL skills fit on 1 row, show all of them with no "+N more" badge
    let totalAllWidth = 0;
    for (let i = 0; i < skills.length; i++) {
      totalAllWidth += calcChipWidth(skills[i]) + (i > 0 ? GAP : 0);
    }
    if (totalAllWidth <= availableWidth) {
      return { visibleSkills: skills, remainingCount: 0 };
    }

    // 2. Otherwise, fit as many as possible on row 1 while reserving space for "+N more"
    const picked = [];
    let currentWidth = 0;

    for (let i = 0; i < skills.length; i++) {
      const skill = skills[i];
      const remainingIfPicked = skills.length - (i + 1);
      const chipWidth = calcChipWidth(skill);
      const gapWidth = picked.length > 0 ? GAP : 0;
      const moreWidth =
        remainingIfPicked > 0 ? GAP + calcMoreWidth(remainingIfPicked) : 0;

      if (currentWidth + gapWidth + chipWidth + moreWidth <= availableWidth) {
        picked.push(skill);
        currentWidth += gapWidth + chipWidth;
      } else {
        if (picked.length === 0) {
          picked.push(skill);
        }
        break;
      }
    }

    return {
      visibleSkills: picked,
      remainingCount: skills.length - picked.length,
    };
  }, [skills, isExpanded, containerWidth]);

  const maxWidthClass = className.includes("max-w-") ? "" : "max-w-sm";
  const tierCardClass = isPremium
    ? "border border-amber-500/35 shadow-md shadow-amber-500/5 hover:border-amber-500/60"
    : isPro
      ? "border border-primary/30 shadow-md shadow-primary/5 hover:border-primary/55"
      : "border border-base-content/12 shadow-sm hover:border-base-content/25";

  return (
    <div
      className={`card w-full ${maxWidthClass} bg-base-100 shadow-xl ${tierCardClass} overflow-hidden transition-all duration-300 hover:shadow-2xl flex flex-col justify-between select-none ${className}`}
    >
      {/* Photo with Overlay Badges */}
      <figure className="p-3 pb-0 relative">
        <div
          className={`w-full rounded-2xl bg-base-200 text-base-content flex items-center justify-center overflow-hidden border border-base-content/8 relative group transition-all duration-300 ${
            isExpanded ? "h-72 xs:h-80 sm:h-96 md:h-[420px]" : "h-56 sm:h-64"
          }`}
        >
          <img
            src={profilePictureUrl}
            alt={fullName}
            width="600"
            height="480"
            fetchPriority="high"
            loading="eager"
            style={{ objectPosition: isExpanded ? "center 25%" : "center 22%" }}
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
      <div className="card-body p-3.5 sm:p-4 gap-2 sm:gap-2.5 flex-1 flex flex-col justify-between min-h-0">
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
            <div className="flex items-center gap-1.5 shrink-0">
              {(age || gender) && (
                <span className="text-xs font-semibold text-base-content/65 bg-base-200 px-2 py-0.5 rounded-full capitalize">
                  {[age, gender].filter(Boolean).join(" • ")}
                </span>
              )}
              {onExpand && !isExpanded && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onExpand();
                  }}
                  className="w-6 h-6 rounded-full flex items-center justify-center bg-base-200/80 hover:bg-primary/15 text-base-content/60 hover:text-primary border border-base-content/12 hover:border-primary/30 transition-all cursor-pointer shadow-2xs group/expand"
                  title="View full profile & all skills"
                  aria-label="View full profile & all skills"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5] transition-transform duration-200 group-hover/expand:translate-x-0.5 group-hover/expand:-translate-y-0.5" />
                </button>
              )}
            </div>
          </div>

          {/* Looking For Highlight Card */}
          {lookingFor && (
            <div
              className={`mt-2 p-2 px-2.5 rounded-xl bg-base-200/70 border border-base-content/10 text-xs text-base-content flex items-center gap-2 ${
                isExpanded ? "" : "overflow-hidden"
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-primary stroke-[2.5] shrink-0" />
              <div className={isExpanded ? "min-w-0" : "truncate"}>
                <span className="text-primary font-bold">Seeking: </span>
                <span className="font-medium text-base-content/85">{lookingFor}</span>
              </div>
            </div>
          )}
        </div>

        {/* Bio */}
        <p
          className={`text-xs sm:text-sm text-base-content/75 leading-relaxed break-words ${
            isExpanded ? "" : "line-clamp-2"
          }`}
        >
          {about || "Building and discovering innovative projects on Orbit."}
        </p>

        {/* Tech Stack Chips */}
        {skills.length > 0 && (
          <div
            ref={containerRef}
            className={`flex items-center gap-1.5 pt-0.5 w-full ${
              isExpanded ? "flex-wrap pt-1" : "flex-nowrap overflow-hidden"
            }`}
          >
            {visibleSkills.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center bg-base-200/90 hover:bg-primary/10 hover:text-primary transition-colors cursor-default text-base-content/80 font-mono text-[11px] border border-base-content/12 px-2.5 py-1 rounded-lg select-none whitespace-nowrap shrink-0"
                title={`Skill: ${skill}`}
              >
                {skill}
              </span>
            ))}
            {remainingCount > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onExpand) onExpand();
                }}
                className={`text-[11px] font-mono text-base-content/60 hover:text-primary hover:bg-primary/10 border border-base-content/12 hover:border-primary/30 rounded-lg px-2 py-1 font-semibold transition-all select-none shrink-0 whitespace-nowrap ${
                  onExpand ? "cursor-pointer" : "cursor-default"
                }`}
                title={onExpand ? "Click to view all skills & bio" : undefined}
              >
                +{remainingCount} more
              </button>
            )}
          </div>
        )}

        {/* Actions Area */}
        <div className="card-actions justify-center items-center mt-1 pt-2.5 border-t border-base-content/8">
          {customActions ? (
            <div className="w-full">{customActions}</div>
          ) : showActions ? (
            <div className="w-full flex items-center justify-between px-7 sm:px-9 py-0.5">
              <motion.button
                onClick={onPass}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                transition={springTap}
                className="w-12 h-12 rounded-full flex items-center justify-center bg-base-200/80 hover:bg-base-300 text-base-content/60 hover:text-base-content border border-base-content/15 hover:border-base-content/40 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md group active:scale-95"
                aria-label="Pass"
                title="Pass (Left Arrow)"
              >
                <X className="w-5 h-5 stroke-[2.75] transition-transform duration-200 group-hover:rotate-90" />
              </motion.button>

              <motion.button
                onClick={onConnect}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                transition={springTap}
                className="w-12 h-12 rounded-full flex items-center justify-center bg-base-200/80 hover:bg-error/15 text-base-content/60 hover:text-error border border-base-content/15 hover:border-error/40 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md hover:shadow-error/20 group active:scale-95"
                aria-label="Connect"
                title="Connect (Right Arrow)"
              >
                <Heart className="w-5 h-5 stroke-[2.75] transition-all duration-200 group-hover:scale-110 group-hover:fill-error" />
              </motion.button>
            </div>
          ) : (
            <div className="w-full flex items-center justify-center py-0.5">
              <span className="badge badge-sm badge-ghost font-mono text-[11px] gap-1.5 py-1.5 px-3 border-base-content/15">
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
