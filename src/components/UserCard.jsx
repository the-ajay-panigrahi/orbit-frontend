import { X, Heart, Sparkle, Crown } from "lucide-react";

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

  const maxWidthClass = className.includes("max-w-") ? "" : "max-w-sm";

  return (
    <div
      className={`card w-full ${maxWidthClass} min-h-[420px] xs:min-h-[450px] sm:min-h-[470px] bg-base-100 shadow-lg border border-base-content/10 overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col justify-between ${className}`}
    >
      <figure className="p-3 sm:p-3.5 pb-0">
        <div className="w-full h-46 xs:h-52 sm:h-58 rounded-2xl bg-base-200 text-base-content flex items-center justify-center overflow-hidden border border-base-content/10 relative">
          <img
            src={profilePictureUrl}
            alt={fullName}
            width="600"
            height="480"
            fetchpriority="high"
            loading="eager"
            style={{ objectPosition: "center 20%" }}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/default-avatar.svg";
            }}
          />
        </div>
      </figure>

      <div className="card-body p-3.5 sm:p-4 gap-2 flex-1 flex flex-col justify-between">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <h2 className="card-title text-base sm:text-lg font-bold tracking-tight text-base-content truncate">
              {fullName}
            </h2>
            {membershipType === "pro" && (
              <span className="badge badge-xs badge-primary font-mono font-bold tracking-wider shrink-0">
                PRO
              </span>
            )}
            {membershipType === "premium" && (
              <span className="badge badge-xs badge-warning font-mono font-bold tracking-wider shrink-0 gap-0.5">
                <Crown className="w-2.5 h-2.5" /> VIP
              </span>
            )}
          </div>
          {(age || gender) && (
            <span className="text-[11px] font-semibold text-base-content/70 bg-base-200 px-2 py-0.5 rounded-full shrink-0 capitalize">
              {[age, gender].filter(Boolean).join(" • ")}
            </span>
          )}
        </div>

        {lookingFor && (
          <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
            <Sparkle className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Looking for: {lookingFor}</span>
          </div>
        )}

        <p className="text-xs sm:text-sm text-base-content/75 leading-relaxed break-words line-clamp-3">
          {about || "Building and discovering on Orbit."}
        </p>

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5 max-h-20 overflow-y-auto">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="badge badge-xs sm:badge-sm bg-base-200 hover:bg-primary/20 hover:text-primary transition-colors cursor-default text-base-content/80 font-mono border-0 select-none"
                title={`Skill: ${skill}`}
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        <div className="card-actions justify-center items-center mt-1 pt-2.5 border-t border-base-content/10">
          {customActions ? (
            <div className="w-full">{customActions}</div>
          ) : showActions ? (
            <div className="w-full flex items-center justify-around">
              <button
                onClick={onPass}
                className="btn btn-circle btn-sm sm:btn-md btn-outline border-error/30 text-error hover:bg-error hover:text-error-content hover:border-error transition-all"
                aria-label="Pass"
                title="Pass"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
              </button>

              <button
                onClick={onConnect}
                className="btn btn-circle btn-sm sm:btn-md btn-primary shadow-lg shadow-primary/25 hover:scale-105 transition-all"
                aria-label="Connect"
                title="Connect"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              </button>
            </div>
          ) : (
            <div className="w-full flex items-center justify-center">
              <span className="badge badge-sm badge-primary badge-outline font-mono text-[11px] gap-1.5 py-2 px-3">
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
