import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { UserCheck } from "lucide-react";
import { BASE_URL } from "../utils/constants";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

export default function Feed() {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
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

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
      <UserCard user={user} showActions={true} />
    </div>
  );
}

