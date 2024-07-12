import React from 'react';

const RecentChats = ({ chats }) => {
  return (
    <div className="recent-chats">
      <h2>Recent Chats</h2>
      <ul>
        {chats.map((chat, index) => (
          <li key={index}>
            <strong>Database:</strong> {chat.database}<br />
            <strong>Query:</strong> {chat.query}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentChats;