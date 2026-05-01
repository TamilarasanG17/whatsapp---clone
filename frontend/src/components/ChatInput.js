import React, { useState, useRef } from "react";

function ChatInput({ onSend, socket, currentUser, currentChat }) {
  const [message, setMessage] = useState("");
  const typingTimeoutRef = useRef(null);

  const handleChange = (e) => {
    const value = e.target.value;
    setMessage(value);

    if (!socket?.current) return;

    socket.current.emit("typing", {
      sender: currentUser._id,
      receiver: currentChat._id,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.current.emit("stop-typing", {
        sender: currentUser._id,
        receiver: currentChat._id,
      });
    }, 2000); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    onSend(message);

    socket?.current?.emit("stop-typing", {
      sender: currentUser._id,
      receiver: currentChat._id,
    });

    setMessage("");
  };

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Type a message"
        value={message}
        onChange={handleChange}
      />
      <button type="submit">Send</button>
    </form>
  );
}

export default ChatInput;