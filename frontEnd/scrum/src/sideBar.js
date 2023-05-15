import React, { useState, useEffect } from 'react';
const Sidebar = ({usersList, room_id}) => {
    const [isCopied, setIsCopied] = useState(false);
    const copyToClipboard = () => {
        navigator.clipboard.writeText(`http://localhost:3000/join_room/${room_id}`);
        setIsCopied(true);
        setTimeout(() => {
        setIsCopied(false);
        }, 1000);
    };

  return (
    <div className="sidebar-container">
      <div className="copy-button">
        <button onClick={copyToClipboard}>Copy</button>
        </div>
        <div className="users-list">
        <ul>
            {usersList.map((user) => (
            <li>{user}</li>
            ))}
        </ul>
        </div>
    </div>
  );
};

export default Sidebar;
