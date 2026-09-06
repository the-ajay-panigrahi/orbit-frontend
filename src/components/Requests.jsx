import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  UserCheck,
  Check,
  X,
  Sparkle,
  RotateCcw,
  Compass,
  Sparkles,
} from "lucide-react";
import { BASE_URL } from "../utils/constants";
import { addRequests, removeRequest } from "../utils/requestSlice";

export default function Requests() {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const handleRefresh = () => {
    setError("");
    axios
      .get(`${BASE_URL}/user/requests/received`, { withCredentials: true })
      .then((res) => {
        dispatch(addRequests(res?.data?.data || []));
      })
      .catch((err) => {
        setError(
          err?.response?.data?.error ||
            "Failed to load requests. Please try again.",
        );
      });
  };

  useEffect(() => {
    let ignore = false;

    if (!requests) {
      axios
        .get(`${BASE_URL}/user/requests/received`, { withCredentials: true })
        .then((res) => {
          if (!ignore) {
            dispatch(addRequests(res?.data?.data || []));
          }
        })
        .catch((err) => {
          if (!ignore) {
            setError(
              err?.response?.data?.error ||
                "Failed to load requests. Please try again.",
            );
          }
        });
    }

    return () => {
      ignore = true;
    };
  }, [requests, dispatch]);

  const handleReviewRequest = async (status, requestId, senderName) => {
    if (processingId) return;
    setProcessingId(requestId);

    try {
      await axios.post(
        `${BASE_URL}/request/review/${status}/${requestId}`,
        {},
        { withCredentials: true },
      );

      dispatch(removeRequest(requestId));
      setToastMessage(
        status === "accepted"
          ? `Connected with ${senderName}!`
          : `Declined request from ${senderName}`,
      );
      setTimeout(() => setToastMessage(""), 2500);
    } catch (err) {
      setToastMessage(
        err?.response?.data?.error || "Failed to process request.",
      );
      setTimeout(() => setToastMessage(""), 2500);
    } finally {
      setProcessingId(null);
    }
  };

  // Loading Skeleton State
  if (!requests && !error) {
    return (
      <div className="flex-1 w-full max-w-3xl mx-auto p-4 sm:p-6 flex flex-col gap-4">
        <div className="skeleton h-8 w-48 rounded-lg mb-2"></div>
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="p-5 rounded-2xl bg-base-100 border border-base-content/10 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="skeleton w-14 h-14 rounded-2xl shrink-0"></div>
              <div className="flex flex-col gap-2">
                <div className="skeleton h-5 w-36"></div>
                <div className="skeleton h-3.5 w-24"></div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="skeleton h-9 w-20 rounded-xl"></div>
              <div className="skeleton h-9 w-20 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error State
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

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto p-4 sm:p-6 flex flex-col">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-neutral py-2 px-4 shadow-xl border border-base-content/10 text-xs font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-base-content/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-base-content flex items-center gap-2">
              Connection Requests
              {requests && requests.length > 0 && (
                <span className="badge badge-sm badge-primary font-mono text-[11px]">
                  {requests.length}
                </span>
              )}
            </h1>
            <p className="text-xs text-base-content/60">
              Founders and builders requesting to enter your Orbit
            </p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          className="btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-base-content"
          title="Refresh requests"
          aria-label="Refresh requests"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Empty State */}
      {requests.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center my-auto">
          <div className="w-16 h-16 rounded-2xl bg-base-200 border border-base-content/10 flex items-center justify-center text-base-content/40 mb-4">
            <UserCheck className="w-8 h-8 stroke-[1.4]" />
          </div>
          <h2 className="text-lg font-bold text-base-content mb-1">
            All Caught Up!
          </h2>
          <p className="text-xs text-base-content/60 max-w-sm mb-6 leading-relaxed">
            You don&apos;t have any pending connection requests right now. As you
            discover more builders in the feed, new requests will appear here.
          </p>
          <Link to="/feed" className="btn btn-sm btn-primary gap-2 font-medium">
            <Compass className="w-4 h-4" />
            Discover Builders in Feed
          </Link>
        </div>
      ) : (
        /* Requests List */
        <div className="flex flex-col gap-3">
          {requests.map((request) => {
            const sender = request.fromUserId;
            if (!sender) return null;

            const fullName =
              `${sender.firstName || ""} ${sender.lastName || ""}`.trim() ||
              "Anonymous Builder";
            const profilePictureUrl =
              sender.profilePictureUrl || "/default-avatar.svg";
            const skills = Array.isArray(sender.skills) ? sender.skills : [];
            const isProcessing = processingId === request._id;

            return (
              <div
                key={request._id}
                className="group p-4 sm:p-5 rounded-2xl bg-base-100 border border-base-content/10 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Left Profile Info */}
                <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                  <div className="avatar shrink-0">
                    <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl border border-base-content/10 overflow-hidden bg-base-200">
                      <img
                        src={profilePictureUrl}
                        alt={fullName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/default-avatar.svg";
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-bold text-base-content truncate">
                        {fullName}
                      </h3>
                      {(sender.age || sender.gender) && (
                        <span className="text-[11px] font-semibold text-base-content/60 bg-base-200 px-2 py-0.5 rounded-md shrink-0 capitalize">
                          {[sender.age, sender.gender]
                            .filter(Boolean)
                            .join(" • ")}
                        </span>
                      )}
                    </div>

                    {sender.lookingFor && (
                      <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
                        <Sparkle className="w-3 h-3 shrink-0" />
                        <span className="truncate">
                          Looking for: {sender.lookingFor}
                        </span>
                      </div>
                    )}

                    {sender.about && (
                      <p className="text-xs text-base-content/70 line-clamp-1 break-words">
                        {sender.about}
                      </p>
                    )}

                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {skills.slice(0, 4).map((skill, idx) => (
                          <span
                            key={idx}
                            className="badge badge-xs bg-base-200 text-base-content/75 font-mono border-0"
                          >
                            {skill}
                          </span>
                        ))}
                        {skills.length > 4 && (
                          <span className="text-[10px] text-base-content/50 self-center font-mono">
                            +{skills.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Action Dock */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-base-content/10 shrink-0">
                  <button
                    disabled={isProcessing}
                    onClick={() =>
                      handleReviewRequest(
                        "rejected",
                        request._id,
                        sender.firstName,
                      )
                    }
                    className="btn btn-sm btn-ghost hover:bg-error/10 hover:text-error text-base-content/60 gap-1.5 transition-colors cursor-pointer"
                    title="Decline request"
                  >
                    <X className="w-4 h-4" />
                    <span>Decline</span>
                  </button>

                  <button
                    disabled={isProcessing}
                    onClick={() =>
                      handleReviewRequest(
                        "accepted",
                        request._id,
                        sender.firstName,
                      )
                    }
                    className="btn btn-sm btn-primary gap-1.5 shadow-md shadow-primary/20 hover:scale-105 transition-all cursor-pointer"
                    title="Accept request"
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Accept</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
