import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { createSocketConnection } from "../utils/socket";

const START_INDEX = 10000;

export function useChat({ targetUserId, currentUser, targetUser }) {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [notConnected, setNotConnected] = useState(false);
  const [isTargetTyping, setIsTargetTyping] = useState(false);
  const [typingUserName, setTypingUserName] = useState("");
  const [chatPartner, setChatPartner] = useState(targetUser || null);
  const [isOnline, setIsOnline] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [firstItemIndex, setFirstItemIndex] = useState(START_INDEX);

  const virtuosoRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  useEffect(() => {
    if (targetUser) {
      setChatPartner(targetUser);
    }
  }, [targetUser]);

  // Fetch initial batch of messages (latest 25)
  useEffect(() => {
    if (!targetUserId || !currentUser?._id) return;

    const fetchChatMessages = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/chat/${targetUserId}?limit=25&skip=0`, {
          withCredentials: true,
        });
        if (res.data?.targetUser) {
          setChatPartner(res.data.targetUser);
        }
        const partner = res.data?.targetUser || targetUser;
        const rawMessages = res.data?.messages || [];
        const chatMessages = rawMessages.map((msg) => {
          const senderIdStr = msg.senderId?._id?.toString() || msg.senderId?.toString();
          const currentUserIdStr = currentUser._id.toString();
          const isMe = senderIdStr === currentUserIdStr;
          return {
            id: msg._id,
            sender: isMe ? "me" : "them",
            senderName: isMe
              ? currentUser.firstName
              : (msg.senderId?.firstName || partner?.firstName || "Peer"),
            senderAvatar: isMe
              ? (currentUser.profilePictureUrl || "/default-avatar.svg")
              : (msg.senderId?.profilePictureUrl || partner?.profilePictureUrl || "/default-avatar.svg"),
            text: msg.text,
            time: new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
        });
        setFirstItemIndex(START_INDEX - chatMessages.length);
        setMessages(chatMessages);
        setHasMore(Boolean(res.data?.hasMore));
      } catch (err) {
        if (err.response?.status === 403) {
          setNotConnected(true);
        }
        console.error("Failed to load chat history:", err);
      }
    };

    fetchChatMessages();
  }, [targetUserId, currentUser?._id, targetUser]);

  // Load older messages on scroll-up
  const loadOlderMessages = async () => {
    if (!hasMore || isLoadingMore || messages.length === 0) return;
    setIsLoadingMore(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/chat/${targetUserId}?limit=25&skip=${messages.length}`,
        { withCredentials: true }
      );
      const rawMessages = res.data?.messages || [];
      if (rawMessages.length > 0) {
        const olderMessages = rawMessages.map((msg) => {
          const senderIdStr = msg.senderId?._id?.toString() || msg.senderId?.toString();
          const currentUserIdStr = currentUser._id.toString();
          const isMe = senderIdStr === currentUserIdStr;
          return {
            id: msg._id,
            sender: isMe ? "me" : "them",
            senderName: isMe
              ? currentUser.firstName
              : (msg.senderId?.firstName || targetUser?.firstName || "Peer"),
            senderAvatar: isMe
              ? (currentUser.profilePictureUrl || "/default-avatar.svg")
              : (msg.senderId?.profilePictureUrl || targetUser?.profilePictureUrl || "/default-avatar.svg"),
            text: msg.text,
            time: new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
        });
        setFirstItemIndex((prev) => prev - olderMessages.length);
        setMessages((prev) => [...olderMessages, ...prev]);
        setHasMore(Boolean(res.data?.hasMore));
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to load older messages:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Socket connection and real-time events lifecycle
  useEffect(() => {
    if (!currentUser?._id || !targetUserId) return;
    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.emit("joinChat", {
      firstName: currentUser.firstName,
      currentUserId: currentUser._id,
      targetUserId,
    });

    socket.emit("checkUserOnline", { targetUserId }, (response) => {
      if (response?.isOnline !== undefined) {
        setIsOnline(response.isOnline);
      }
    });

    socket.on("userOnline", ({ userId }) => {
      if (userId === targetUserId) {
        setIsOnline(true);
      }
    });

    socket.on("userOffline", ({ userId }) => {
      if (userId === targetUserId) {
        setIsOnline(false);
      }
    });

    socket.on("messageReceived", ({ firstName, text, senderId }) => {
      setIsTargetTyping(false);
      const isMe =
        (senderId && senderId.toString() === currentUser._id.toString()) ||
        firstName === currentUser.firstName;

      if (!isMe) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: "them",
            senderName: firstName || chatPartner?.firstName || targetUser?.firstName || "Peer",
            senderAvatar: chatPartner?.profilePictureUrl || targetUser?.profilePictureUrl || "/default-avatar.svg",
            text,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    });

    socket.on("userTyping", ({ firstName }) => {
      setTypingUserName(firstName || chatPartner?.firstName || targetUser?.firstName || "");
      setIsTargetTyping(true);
    });

    socket.on("userStoppedTyping", () => {
      setIsTargetTyping(false);
      setTypingUserName("");
    });

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      socket.disconnect();
    };
  }, [currentUser?._id, targetUserId, currentUser?.firstName, targetUser, chatPartner]);

  // Input change with debounce typing indicator
  const handleInputChange = (e) => {
    setInputText(e.target.value);

    if (!socketRef.current) return;

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socketRef.current.emit("typing", { targetUserId });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit("stopTyping", { targetUserId });
      isTypingRef.current = false;
    }, 2000);
  };

  // Send message handler
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (isTypingRef.current) {
      socketRef.current?.emit("stopTyping", { targetUserId });
      isTypingRef.current = false;
    }

    socketRef.current?.emit("sendMessage", {
      firstName: currentUser.firstName,
      currentUserId: currentUser._id,
      targetUserId,
      text: inputText.trim(),
    });

    const newMessage = {
      id: Date.now().toString(),
      sender: "me",
      senderName: currentUser.firstName,
      senderAvatar: currentUser.profilePictureUrl || "/default-avatar.svg",
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");

    setTimeout(() => {
      virtuosoRef.current?.scrollToIndex({
        index: "LAST",
        align: "end",
        behavior: "smooth",
      });
    }, 50);
  };

  return {
    inputText,
    messages,
    notConnected,
    isTargetTyping,
    typingUserName,
    chatPartner,
    isOnline,
    hasMore,
    isLoadingMore,
    firstItemIndex,
    virtuosoRef,
    handleInputChange,
    handleSendMessage,
    loadOlderMessages,
  };
}
