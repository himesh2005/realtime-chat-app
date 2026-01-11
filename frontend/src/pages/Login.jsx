import { useState } from "react"

function Login({ setUser }) {
  const [email, setEmail] = useState("")

  function handleLogin() {
    if (!email) return
    setUser(email)
  }

  return (
    <div style={{ padding: "40px" }}>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", marginBottom: "10px" }}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  )
}

export default Login
