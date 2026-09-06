import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { X, Heart, Sparkles, MapPin, Sparkle, UserCheck } from "lucide-react";
import { BASE_URL } from "../utils/constants";
import { addFeed } from "../utils/feedSlice";

export default function Feed({ theme: propTheme }) {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const outletContext = useOutletContext();
  const theme = propTheme || outletContext?.theme || "bumblebee";

  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    if (!feed) {
      axios
        .get(`${BASE_URL}/user/feed`, { withCredentials: true })
        .then((res) => {
          if (!ignore) {
            dispatch(addFeed(res?.data?.data || []));
          }
        })
        .catch((err) => {
          if (!ignore) {
            setError(
              err?.response?.data?.error ||
                "Failed to load feed. Please try again.",
            );
          }
        });
    }

    return () => {
      ignore = true;
    };
  }, [feed, dispatch]);

  const handleRetry = () => {
    setError("");
    axios
      .get(`${BASE_URL}/user/feed`, { withCredentials: true })
      .then((res) => {
        dispatch(addFeed(res?.data?.data || []));
      })
      .catch((err) => {
        setError(
          err?.response?.data?.error ||
            "Failed to load feed. Please try again.",
        );
      });
  };

  if (!feed && !error) {
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
          <button onClick={handleRetry} className="btn btn-sm btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!feed || feed.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 text-center">
        <div className="card w-full max-w-sm bg-base-100 shadow-xl border border-base-content/10 p-8 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center text-primary">
            <UserCheck className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h2 className="text-xl font-bold text-base-content">No New Profiles</h2>
          <p className="text-xs text-base-content/60 leading-relaxed">
            You&apos;ve discovered everyone in your Orbit for now. Check back later for new connections!
          </p>
        </div>
      </div>
    );
  }

  const user = feed[0];
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl border border-base-content/10 overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <figure className="p-4 sm:p-5 pb-0">
          <div className="w-full h-60 sm:h-64 rounded-2xl bg-base-200 text-base-content flex items-center justify-center overflow-hidden border border-base-content/5">
            <img
              src={user.profilePictureUrl || "/default-avatar.svg"}
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
            <div>
              <h2 className="card-title text-xl font-bold tracking-tight text-base-content">
                {fullName}
              </h2>
              {(user.age || user.gender) && (
                <p className="text-xs text-base-content/60 flex items-center gap-1 mt-0.5 capitalize">
                  <MapPin className="w-3 h-3" />
                  <span>
                    {[user.age, user.gender].filter(Boolean).join(" • ")}
                  </span>
                </p>
              )}
            </div>
            <span className="badge badge-sm badge-outline font-medium text-xs">
              Active
            </span>
          </div>

          {user.lookingFor && (
            <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
              <Sparkle className="w-3.5 h-3.5" />
              <span>Looking for: {user.lookingFor}</span>
            </div>
          )}

          <p className="text-xs sm:text-sm text-base-content/75 leading-relaxed">
            {user.about || "Building and discovering on Orbit."}
          </p>

          {user.skills && user.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {user.skills.map((skill, idx) => (
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

