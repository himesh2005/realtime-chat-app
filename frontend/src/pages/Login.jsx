import { useState } from "react"

function Login({ setUser }) {
  const [email, setEmail] = useState("")

  async function handleLogin() {
    if (!email) return

    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()
    setUser(data)
  }

  return (
    <div style={{ padding: "40px" }}>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  )
}

export default Login
