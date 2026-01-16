import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

function Chat({ user, onLogout }) {
  const [toUserId, setToUserId] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("Connecting...");

  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // create socket ONCE
    socketRef.current = io("http://localhost:5000", {
      auth: { token },
      transports: ["websocket"], // important: prevents polling issues
    });

    const socket = socketRef.current;

    socket.on("connect", () => setStatus("Socket connected ✅"));
    socket.on("disconnect", (reason) =>
      setStatus("Socket disconnected ❌: " + reason)
    );
    socket.on("connect_error", (err) =>
      setStatus("Connect error ❌: " + err.message)
    );

    socket.on("private_message", (msg) => {
      setMessages((prev) => [
        ...prev,
        { type: "in", fromUserId: msg.fromUserId, text: msg.text },
      ]);
    });

    socket.on("error_message", (e) => {
      setStatus(e?.message || "Error");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("private_message");
      socket.off("error_message");
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  function send() {
    if (!toUserId || !text) return;
    const socket = socketRef.current;
    if (!socket) return;

    socket.emit("private_message", { toUserId, text });

    setMessages((prev) => [...prev, { type: "out", toUserId, text }]);
    setText("");
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Chat (Socket.io)</h2>
      <p>User: {user.email}</p>
      <p>User ID: {user.userId}</p>
 differenti      <p>{status}</p>

      <button onClick={onLogout}>Logout</button>

      <hr />

      <input
        placeholder="Receiver userId"
        value={toUserId}
        onChange={(e) => setToUserId(e.target.value)}
        style={{ width: 420 }}
      />
      <br />
      <br />

      <input
        placeholder="Type message"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: 420 }}
      />
      <button onClick={send} style={{ marginLeft: 8 }}>
        Send
      </button>

      <hr />

      <div>
        {messages.map((m, i) => (
          <div key={i}>
            {m.type === "out" ? (
              <strong>Me ➜ {m.toUserId}:</strong>
            ) : (
              <strong>{m.fromUserId} ➜ Me:</strong>
            )}{" "}
            {m.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Chat;
