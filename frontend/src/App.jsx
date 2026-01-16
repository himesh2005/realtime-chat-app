import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import { getMe } from "./services/api";

function App() {
  const [auth, setAuth] = useState({
    loading: true,
    token: null,
    user: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      setAuth({ loading: false, token: null, user: null });
      return;
    }

    // verify token with backend
    getMe(token)
      .then(() => {
        setAuth({
          loading: false,
          token,
          user: JSON.parse(user),
        });
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setAuth({ loading: false, token: null, user: null });
      });
  }, []);

  function handleLoginSuccess({ token, user }) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setAuth({ loading: false, token, user });
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({ loading: false, token: null, user: null });
  }

  if (auth.loading) return <div style={{ padding: 20 }}>Loading...</div>;

  return auth.user ? (
    <Chat user={auth.user} onLogout={handleLogout} />
  ) : (
    <Login onLoginSuccess={handleLoginSuccess} />
  );
}

export default App;
