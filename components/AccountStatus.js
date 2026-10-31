"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../lib/supabase/client.js";
import interactive from "./interactive.module.css";

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
  reviewLink: {
    color: "#EAF2F6",
    backgroundColor: "#263640",
    border: "1px solid #9DB7C9",
    borderRadius: 8,
    padding: "0 18px",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 700,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  email: { color: "#F1DFC2", fontSize: 14, overflowWrap: "anywhere" },
  button: {
    color: "#D9B89C",
    backgroundColor: "rgba(142, 66, 47, 0.16)",
    border: "1px solid #8B6551",
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
  const [reviewer, setReviewer] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    const supabase = createClient();

    supabase.auth.getUser()
      .then(async ({ data, error: userError }) => {
        if (!active) return;

        const nextUser = userError ? null : data.user ?? null;
        setUser(nextUser);
        if (!nextUser) {
          setReviewer(false);
          return;
        }

        const { data: reviewerFlag, error: reviewerError } =
          await supabase.rpc("is_reviewer");
        if (!active) return;

        if (reviewerError) {
          console.error("Reviewer link check failed", reviewerError);
        }
        setReviewer(!reviewerError && reviewerFlag === true);
      })
      .catch(() => {
        if (active) {
          setUser(null);
          setReviewer(false);
        }
      });
    return () => { active = false; };
  }, []);

  async function handleLogout() {
    setBusy(true);
    setError("");
    try {
      const { error: signOutError } = await createClient().auth.signOut({ scope: "local" });
      if (signOutError) setError("Could not log out. Please try again.");
      else {
        setUser(null);
        setReviewer(false);
      }
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
          <button className={interactive.quiet} type="button" onClick={handleLogout} disabled={busy} style={styles.button}>
            {busy ? "Logging out…" : "Log out"}
          </button>
          {reviewer ? (
            <Link
              href="/review"
              className={interactive.reviewQueue}
              style={styles.reviewLink}
            >
              Review queue
            </Link>
          ) : null}
        </>
      ) : (
        <>
          <Link href="/login" style={styles.link}>Log in</Link>
          <Link href="/signup" className={interactive.primary} style={styles.signup}>Sign up</Link>
        </>
      )}
      {error && <span role="alert" style={styles.error}>{error}</span>}
    </nav>
  );
}
