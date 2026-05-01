import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import API from '../utils/axiosInstance';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';

function Home() {
  const [users, setUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem('whatsapp-user'));
  const socket = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser?._id) return;

    // ✅ Prevent multiple connections
    if (!socket.current) {
      socket.current = io(process.env.REACT_APP_API_URL);
      socket.current.emit('add-user', currentUser._id);
    }

    // ✅ Fetch users
    const fetchUsers = async () => {
      try {
        const { data } = await API.get(`/api/users/${currentUser._id}`);
        setUsers(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();

    return () => {
      socket.current?.disconnect();
      socket.current = null;
    };
  }, [currentUser?._id]);

  const handleLogout = () => {
    localStorage.removeItem('whatsapp-user');
    navigate('/login');
  };

  return (
    <div className="home-container">
      <div className="two-panel-layout">
        <Sidebar
          users={users}
          changeChat={(chat) => setCurrentChat(chat)}
          currentUserId={currentUser?._id}
          handleLogout={handleLogout}
        />

        {currentChat ? (
          <ChatWindow
            currentChat={currentChat}
            currentUser={currentUser}
            socket={socket}
          />
        ) : (
          <div className="welcome-screen">
            <h1>Welcome, {currentUser?.username}!</h1>
            <p>Select a chat to start messaging.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;