import { X, Heart, Sparkles, MapPin, Sparkle } from "lucide-react";

export default function Feed({ theme }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl border border-base-content/10 overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <figure className="p-4 sm:p-5 pb-0">
          <div className="w-full h-60 sm:h-64 rounded-2xl bg-base-200 text-base-content flex items-center justify-center overflow-hidden border border-base-content/5">
            <img
              src="/default-avatar.svg"
              alt="Profile Silhouette"
              className="w-full h-full object-cover"
            />
          </div>
        </figure>

        <div className="card-body p-5 gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="card-title text-xl font-bold tracking-tight text-base-content">
                Alex Morgan
              </h2>
              <p className="text-xs text-base-content/60 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" />
                <span>28 • San Francisco, CA</span>
              </p>
            </div>
            <span className="badge badge-sm badge-outline font-medium text-xs">
              Active
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
            <Sparkle className="w-3.5 h-3.5" />
            <span>Open to explore new projects & ideas</span>
          </div>

          <p className="text-xs sm:text-sm text-base-content/75 leading-relaxed">
            Curious mind building things people love. Always up for an honest
            conversation, brainstorming, and coffee.
          </p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="badge badge-sm bg-base-200 text-base-content/80 font-mono border-0">
              Product
            </span>
            <span className="badge badge-sm bg-base-200 text-base-content/80 font-mono border-0">
              Engineering
            </span>
            <span className="badge badge-sm bg-base-200 text-base-content/80 font-mono border-0">
              Design
            </span>
            <span className="badge badge-sm bg-base-200 text-base-content/80 font-mono border-0">
              Growth
            </span>
          </div>

          <div className="card-actions justify-between items-center mt-2 pt-3 border-t border-base-content/10">
            <button
              className="btn btn-circle btn-outline border-error/30 text-error hover:bg-error hover:text-error-content hover:border-error transition-all"
              aria-label="Pass"
              title="Pass"
            >
              <X className="w-5 h-5 stroke-[2.2]" />
            </button>

            <span className="text-[11px] text-base-content/50 font-mono flex items-center gap-1.5 capitalize">
              <Sparkles className="w-3 h-3 text-primary" />
              <span>{theme}</span>
            </span>

            <button
              className="btn btn-circle btn-primary shadow-lg shadow-primary/25 hover:scale-105 transition-all"
              aria-label="Connect"
              title="Connect"
            >
              <Heart className="w-5 h-5 fill-current" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
