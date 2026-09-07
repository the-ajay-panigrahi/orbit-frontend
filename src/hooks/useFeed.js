import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addFeed, appendFeed, removeUserFromFeed } from "../utils/feedSlice";

const FEED_PAGE_LIMIT = 10;
const PREFETCH_THRESHOLD = 3;

/**
 * Manages the card feed lifecycle: data fetching, threshold-based infinite pagination,
 * pointer gesture physics (drag, rotation, damping), keyboard shortcuts, and swipe actions.
 */
export function useFeed() {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const feedRef = useRef(feed);
  useEffect(() => {
    feedRef.current = feed;
  }, [feed]);

  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);
  const isFetchingRef = useRef(false);

  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [flyDirection, setFlyDirection] = useState(null);
  const [isActionPending, setIsActionPending] = useState(false);

  const dragStartRef = useRef({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const fetchFeedPage = useCallback(
    async (page, replace = false) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      try {
        const currentDeck = feedRef.current || [];
        const excludeParam =
          !replace && currentDeck.length > 0
            ? `&exclude=${currentDeck.map((u) => u._id).join(",")}`
            : "";

        const res = await axios.get(
          `${BASE_URL}/user/feed?page=${page}&limit=${FEED_PAGE_LIMIT}${excludeParam}`,
          { withCredentials: true },
        );

        const users = res?.data?.data || [];
        if (users.length < FEED_PAGE_LIMIT) {
          hasMoreRef.current = false;
        }

        if (replace) {
          dispatch(addFeed(users));
        } else {
          dispatch(appendFeed(users));
        }
      } catch (err) {
        setError(
          err?.response?.data?.error ||
            "Failed to load feed. Please try again.",
        );
      } finally {
        isFetchingRef.current = false;
      }
    },
    [dispatch],
  );

  const maybePrefetchNextPage = useCallback(() => {
    if (!hasMoreRef.current || isFetchingRef.current) return;
    pageRef.current += 1;
    fetchFeedPage(pageRef.current, false);
  }, [fetchFeedPage]);

  useEffect(() => {
    pageRef.current = 1;
    hasMoreRef.current = true;
    const controller = new AbortController();

    axios
      .get(
        `${BASE_URL}/user/feed?page=1&limit=${FEED_PAGE_LIMIT}`,
        { withCredentials: true, signal: controller.signal },
      )
      .then((res) => {
        const users = res?.data?.data || [];
        if (users.length < FEED_PAGE_LIMIT) {
          hasMoreRef.current = false;
        }
        dispatch(addFeed(users));
      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          setError(
            err?.response?.data?.error ||
              "Failed to load feed. Please try again.",
          );
        }
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [dispatch]);

  const handleRefresh = () => {
    setError("");
    setIsLoading(true);
    pageRef.current = 1;
    hasMoreRef.current = true;

    axios
      .get(
        `${BASE_URL}/user/feed?page=1&limit=${FEED_PAGE_LIMIT}`,
        { withCredentials: true },
      )
      .then((res) => {
        const users = res?.data?.data || [];
        if (users.length < FEED_PAGE_LIMIT) {
          hasMoreRef.current = false;
        }
        dispatch(addFeed(users));
      })
      .catch((err) => {
        setError(
          err?.response?.data?.error ||
            "Failed to load feed. Please try again.",
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const triggerSwipeAction = useCallback(
    async (direction, targetUser) => {
      if (!targetUser || isActionPending) return;

      setIsActionPending(true);
      setFlyDirection(direction);

      const status = direction === "right" ? "interested" : "ignored";
      const userName = targetUser.firstName || "Builder";

      try {
        await axios.post(
          `${BASE_URL}/request/send/${status}/${targetUser._id}`,
          {},
          { withCredentials: true },
        );
      } catch (err) {
        console.error("Action error:", err?.response?.data?.error);
      }

      setTimeout(() => {
        dispatch(removeUserFromFeed(targetUser._id));
        setFlyDirection(null);
        setDragOffset({ x: 0, y: 0 });
        setIsActionPending(false);

        setToastMessage(
          direction === "right"
            ? `Connection request sent to ${userName}!`
            : `Passed on ${userName}`,
        );
        setTimeout(() => setToastMessage(""), 2500);

        // Feed length in closure still includes the card currently being removed
        const remainingAfterRemove = (feed?.length || 1) - 1;
        if (remainingAfterRemove <= PREFETCH_THRESHOLD && hasMoreRef.current) {
          maybePrefetchNextPage();
        }
      }, 260);
    },
    [dispatch, isActionPending, feed?.length, maybePrefetchNextPage],
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!feed || feed.length === 0 || isActionPending) return;
      if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) {
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        triggerSwipeAction("left", feed[0]);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        triggerSwipeAction("right", feed[0]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [feed, isActionPending, triggerSwipeAction]);

  const handlePointerDown = (e) => {
    if (isActionPending || !feed || feed.length === 0) return;
    if (e.target.closest("button")) return;

    dragStartRef.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = (e.clientY - dragStartRef.current.y) * 0.4;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore if pointer capture already released
    }

    const threshold = 110;
    if (dragOffset.x > threshold) {
      triggerSwipeAction("right", feed[0]);
    } else if (dragOffset.x < -threshold) {
      triggerSwipeAction("left", feed[0]);
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const handlePointerCancel = () => {
    if (isDragging) {
      setIsDragging(false);
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const currentUser = feed && feed.length > 0 ? feed[0] : null;
  const nextUser = feed && feed.length > 1 ? feed[1] : null;

  return {
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
    pointerHandlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel,
    },
  };
}
