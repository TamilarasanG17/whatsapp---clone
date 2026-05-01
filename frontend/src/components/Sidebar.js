import React from 'react';

function Sidebar({ users, changeChat, currentUserId, handleLogout }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header" style={{ padding: '15px', background: '#f0f2f5', borderBottom: '1px solid #d1d7db', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>Chats</h3>
        <button 
          onClick={handleLogout} 
          style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>
      
      <div className="sidebar-contacts">
        {users.length === 0 ? (
          <p style={{ padding: '15px', color: '#888', textAlign: 'center' }}>No other users registered yet.</p>
        ) : (
          users.map((user) => (
            <div 
              key={user._id} 
              className="contact" 
              onClick={() => changeChat(user)}
            >
              <div className="contact-info">
                <h4 style={{ margin: '0 0 5px 0' }}>{user.username}</h4>
                <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>Click to chat</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Sidebar;