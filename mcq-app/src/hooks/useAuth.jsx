import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);
const API = "http://localhost:5000/api/auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("mcq_token"));
  const [loading, setLoading] = useState(true);

  // On mount, verify the stored token
  useEffect(() => {
    if (!token) { setLoading(false); return; }
    fetch(`${API}/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setUser(data.user);
        else logout();
      })
      .catch(logout)
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line

  const save = (tok, usr) => {
    localStorage.setItem("mcq_token", tok);
    setToken(tok);
    setUser(usr);
  };

  const register = async (name, email, password) => {
    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    save(data.token, data.user);
    return data.user;
  };

  const login = async (email, password) => {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    save(data.token, data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("mcq_token");
    setToken(null);
    setUser(null);
  };

  const saveScore = async (scoreData) => {
    if (!token) return;
    await fetch(`${API}/save-score`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(scoreData),
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout, saveScore }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
