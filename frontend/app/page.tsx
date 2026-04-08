"use client";

import { useEffect, useState } from "react";

type Rep = {
  name: string;
  office: string;
  party: string;
  phone: string;
  url: string;
};

export default function Home() {
  const [user, setUser] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const [results, setResults] = useState<Rep[]>([]);
  const [favorites, setFavorites] = useState<Rep[]>([]);

  // AUTH
  const handleAuth = async () => {
    const endpoint = isLogin ? "login" : "register";

    const res = await fetch(`http://127.0.0.1:8000/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      if (isLogin) setUser(username);
      else {
        alert("Account created! Please login.");
        setIsLogin(true);
      }
    } else {
      alert(data.detail);
    }
  };

  // DATA
  const fetchReps = async () => {
    const res = await fetch(
      "http://127.0.0.1:8000/representatives?address=test"
    );
    const data = await res.json();
    setResults(data.results);
  };

  const fetchFavorites = async () => {
    if (!user) return;
    const res = await fetch(`http://127.0.0.1:8000/favorites/${user}`);
    const data = await res.json();
    setFavorites(data.favorites);
  };

  const addFavorite = async (rep: Rep) => {
    await fetch("http://127.0.0.1:8000/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...rep, username: user }),
    });
    fetchFavorites();
  };

  const removeFavorite = async (name: string) => {
    await fetch(
      `http://127.0.0.1:8000/favorites/${user}/${name}`,
      { method: "DELETE" }
    );
    fetchFavorites();
  };

  useEffect(() => {
    if (user) fetchFavorites();
  }, [user]);

  // -------------------------
  // LOGIN SCREEN
  // -------------------------
  if (!user) {
    return (
      <main style={styles.center}>
        <div style={styles.card}>
          <h1>🇺🇸 Civic Finder</h1>
          <h2>{isLogin ? "Login" : "Register"}</h2>

          <input
            style={styles.input}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button style={styles.primaryBtn} onClick={handleAuth}>
            {isLogin ? "Login" : "Register"}
          </button>

          <p style={styles.link} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Create account" : "Back to login"}
          </p>
        </div>
      </main>
    );
  }

  // -------------------------
  // MAIN APP
  // -------------------------
  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <h1>🇺🇸 Civic Finder</h1>
        <div>
          <span>Welcome, {user}</span>
          <button style={styles.logoutBtn} onClick={() => setUser(null)}>
            Logout
          </button>
        </div>
      </header>

      <button style={styles.primaryBtn} onClick={fetchReps}>
        Load Representatives
      </button>

      <section>
        <h2>Results</h2>
        <div style={styles.grid}>
          {results.map((rep, i) => (
            <div key={i} style={styles.card}>
              <h3>{rep.name}</h3>
              <p>{rep.office}</p>
              <p>{rep.party}</p>

              <div style={styles.actions}>
                <button onClick={() => addFavorite(rep)}>⭐ Save</button>
                <a href={rep.url} target="_blank">Profile</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Your Favorites</h2>
        <div style={styles.grid}>
          {favorites.map((rep, i) => (
            <div key={i} style={styles.card}>
              <h3>{rep.name}</h3>
              <p>{rep.office}</p>

              <button onClick={() => removeFavorite(rep.name)}>
                ❌ Remove
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

// -------------------------
// STYLES
// -------------------------
const styles: any = {
  container: {
    padding: "2rem",
    fontFamily: "Arial, sans-serif",
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "2rem",
  },
  card: {
    background: "#f9f9f9",
    padding: "1rem",
    borderRadius: "10px",
    margin: "0.5rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "1rem",
  },
  input: {
    display: "block",
    margin: "0.5rem 0",
    padding: "0.5rem",
    width: "100%",
  },
  primaryBtn: {
    padding: "0.7rem 1rem",
    background: "#0070f3",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  logoutBtn: {
    marginLeft: "1rem",
  },
  link: {
    cursor: "pointer",
    color: "#0070f3",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "1rem",
  },
};