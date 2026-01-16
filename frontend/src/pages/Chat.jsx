import { useState } from "react";

function Chat({ user, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  function sendMessage() {
    if (!text) return;
    setMessages([...messages, { sender: user.email, text }]);
    setText("");
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Chat</h2>
      <p>User: {user.email}</p>
      <p>User ID: {user.userId}</p>

      <button onClick={onLogout}>Logout</button>

      <hr />

      <div>
        {messages.map((msg, i) => (
          <div key={i}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <br />

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;
