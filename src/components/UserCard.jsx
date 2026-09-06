import { X, Heart, Sparkles, MapPin, Sparkle } from "lucide-react";

export default function UserCard({
  user = {},
  showActions = false,
  theme = "",
  onPass,
  onConnect,
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

  return (
    <div className="card w-full max-w-sm bg-base-100 shadow-xl border border-base-content/10 overflow-hidden transition-all duration-300 hover:shadow-2xl">
      <figure className="p-4 sm:p-5 pb-0">
        <div className="w-full h-60 sm:h-64 rounded-2xl bg-base-200 text-base-content flex items-center justify-center overflow-hidden border border-base-content/5">
          <img
            src={profilePictureUrl}
            alt={fullName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/default-avatar.svg";
            }}
          />
        </div>
      </figure>

      <div className="card-body p-5 gap-3">
        <div className="flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <h2 className="card-title text-xl font-bold tracking-tight text-base-content truncate">
              {fullName}
            </h2>
            {(age || gender) && (
              <p className="text-xs text-base-content/60 flex items-center gap-1 mt-0.5 capitalize">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">
                  {[age, gender].filter(Boolean).join(" • ")}
                </span>
              </p>
            )}
          </div>
          <span className="badge badge-sm badge-outline font-medium text-xs shrink-0">
            Active
          </span>
        </div>

        {lookingFor && (
          <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
            <Sparkle className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Looking for: {lookingFor}</span>
          </div>
        )}

        <p className="text-xs sm:text-sm text-base-content/75 leading-relaxed break-words line-clamp-4">
          {about || "Building and discovering on Orbit."}
        </p>

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1 max-h-24 overflow-y-auto">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="badge badge-sm bg-base-200 text-base-content/80 font-mono border-0"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        <div className="card-actions justify-between items-center mt-2 pt-3 border-t border-base-content/10">
          {showActions ? (
            <>
              <button
                onClick={onPass}
                className="btn btn-circle btn-outline border-error/30 text-error hover:bg-error hover:text-error-content hover:border-error transition-all"
                aria-label="Pass"
                title="Pass"
              >
                <X className="w-5 h-5 stroke-[2.2]" />
              </button>

              {theme && (
                <span className="text-[11px] text-base-content/50 font-mono flex items-center gap-1.5 capitalize">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span>{theme}</span>
                </span>
              )}

              <button
                onClick={onConnect}
                className="btn btn-circle btn-primary shadow-lg shadow-primary/25 hover:scale-105 transition-all"
                aria-label="Connect"
                title="Connect"
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-between">
              <span className="badge badge-sm badge-primary badge-outline font-mono text-[11px] gap-1.5 py-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Live Preview
              </span>

              {theme && (
                <span className="text-[11px] text-base-content/50 font-mono flex items-center gap-1.5 capitalize">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span>{theme}</span>
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
