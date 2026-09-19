"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../lib/supabase/client.js";

const styles = {
  nav: { display: "flex", alignItems: "center", flexWrap: "wrap", gap: 18, marginBottom: 32 },
  link: {
    color: "#D49A56", textDecoration: "none", fontSize: 14, fontWeight: 700,
    display: "inline-flex", alignItems: "center", minHeight: 44,
  },
  signup: {
    color: "#171411", backgroundColor: "#E7B86A", textDecoration: "none",
    fontSize: 14, fontWeight: 700, borderRadius: 8,
    display: "inline-flex", alignItems: "center", minHeight: 44, padding: "0 16px",
  },
  email: { color: "#F1DFC2", fontSize: 14, overflowWrap: "anywhere" },
  button: {
    color: "#D49A56",
    backgroundColor: "#302720",
    border: "1px solid #493A2D",
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  error: { color: "#F2A69A", fontSize: 14 },
};

export default function AccountStatus() {
  const [user, setUser] = useState(undefined);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    createClient().auth.getUser()
      .then(({ data }) => {
        if (active) setUser(data.user ?? null);
      })
      .catch(() => {
        if (active) setUser(null);
      });
    return () => { active = false; };
  }, []);

  async function handleLogout() {
    setBusy(true);
    setError("");
    try {
      const { error: signOutError } = await createClient().auth.signOut({ scope: "local" });
      if (signOutError) setError("Could not log out. Please try again.");
      else setUser(null);
    } catch {
      setError("Could not log out. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <nav aria-label="Account" style={styles.nav}>
      {user === undefined ? (
        <span style={styles.email}>Checking account…</span>
      ) : user ? (
        <>
          <span style={styles.email}>{user.email}</span>
          <button type="button" onClick={handleLogout} disabled={busy} style={styles.button}>
            {busy ? "Logging out…" : "Log out"}
          </button>
        </>
      ) : (
        <>
          <Link href="/login" style={styles.link}>Log in</Link>
          <Link href="/signup" style={styles.signup}>Sign up</Link>
        </>
      )}
      {error && <span role="alert" style={styles.error}>{error}</span>}
    </nav>
  );
}
