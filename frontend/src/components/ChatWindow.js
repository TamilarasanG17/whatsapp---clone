import React, { useState, useEffect, useRef } from "react";
import API from "../utils/axiosInstance";
import ChatInput from "./ChatInput";

function ChatWindow({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef();

  // ✅ Fetch messages
  useEffect(() => {
    if (!currentChat?._id || !currentUser?._id) return;

    const fetchMessages = async () => {
      try {
        setMessages([]); // clear old messages

        const { data } = await API.get(
          `/api/messages/${currentUser._id}/${currentChat._id}`
        );

        setMessages(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();
    setIsTyping(false);
  }, [currentChat?._id, currentUser?._id]);

  // ✅ Message socket listeners
  useEffect(() => {
    if (!socket.current) return;

    const currentSocket = socket.current;

    const handleReceive = (msg) => {
      if (msg.sender === currentChat?._id) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      }
    };

    const handleSent = (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };

    currentSocket.on("msg-receive", handleReceive);
    currentSocket.on("msg-sent", handleSent);

    return () => {
      currentSocket.off("msg-receive", handleReceive);
      currentSocket.off("msg-sent", handleSent);
    };
  }, [socket, currentChat?._id]);

  // ✅ Typing indicator listeners
  useEffect(() => {
    if (!socket.current) return;

    const currentSocket = socket.current;

    const handleTyping = ({ sender }) => {
      if (sender === currentChat?._id) {
        setIsTyping(true);
      }
    };

    const handleStopTyping = ({ sender }) => {
      if (sender === currentChat?._id) {
        setIsTyping(false);
      }
    };

    currentSocket.on("typing", handleTyping);
    currentSocket.on("stop-typing", handleStopTyping);

    return () => {
      currentSocket.off("typing", handleTyping);
      currentSocket.off("stop-typing", handleStopTyping);
    };
  }, [socket, currentChat?._id]);

  // ✅ Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ✅ Send message
  const handleSend = (text) => {
    if (!socket.current) return;

    socket.current.emit("send-msg", {
      sender: currentUser._id,
      receiver: currentChat._id,
      text,
    });
  };

  return (
    <div className="chat-window">
      {/* Header */}
      <div className="chat-header">
        <h3>{currentChat?.username}</h3>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((msg) => {
          const isSender = msg.sender === currentUser._id;

          return (
            <div
              key={msg._id || `${msg.sender}-${msg.createdAt}`}
              className={`message ${isSender ? "sended" : "received"}`}
            >
              <div className="content">
                <p>{msg.text}</p>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="typing">
            <p>Typing...</p>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <ChatInput
        onSend={handleSend}
        socket={socket}
        currentUser={currentUser}
        currentChat={currentChat}
      />
    </div>
  );
}

export default ChatWindow;