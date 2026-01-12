import { useState } from "react"

function Chat({ user }) {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState("")

  function sendMessage() {
    if (!text) return

    setMessages([...messages, { sender: user.email, text }])
    setText("")
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Chat</h2>
      <p>User: {user.email}</p>
      <p>User ID: {user.userId}</p>


      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  )
}

export default Chat
