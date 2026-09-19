"use client";

import { useState } from "react";
import Link from "next/link";
import ClearableInput from "./ClearableInput.js";
import { createClient } from "../lib/supabase/client.js";
import styles from "./authStyles.js";

export default function AuthForm({ mode, confirmationFailed = false }) {
  const isSignup = mode === "signup";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState(
    confirmationFailed
      ? { kind: "error", text: "That confirmation link could not be verified. Please try again." }
      : null,
  );
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    const failureText = isSignup
      ? "Unable to sign up. Please check your details and try again."
      : "Invalid email or password";

    setFeedback(null);
    if (!email || !password) {
      setFeedback({ kind: "error", text: failureText });
      return;
    }

    setBusy(true);
    try {
      const supabase = createClient();
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/confirm` },
        });
        if (error) setFeedback({ kind: "error", text: failureText });
        else if (data.session) window.location.assign("/");
        else setFeedback({ kind: "success", text: "Check your email to confirm your account." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setFeedback({ kind: "error", text: failureText });
        else window.location.assign("/");
      }
    } catch {
      setFeedback({ kind: "error", text: failureText });
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={styles.main}>
      <Link href="/" style={styles.back}>← Back to archive</Link>
      <section style={styles.panel} aria-labelledby="auth-title">
        <p style={styles.kicker}>ACCOUNT ACCESS</p>
        <h1 id="auth-title" style={styles.title}>
          {isSignup ? "Join the archive" : "Welcome back"}
        </h1>
        <p style={styles.intro}>
          {isSignup
            ? "Create an account to take part in the archive."
            : "Enter your email and password to continue."}
          <span lang="km" style={{ display: "block" }}>
            {isSignup
              ? "សូមបង្កើតគណនី ដើម្បីចូលរួមក្នុងបណ្ណសារនេះ។"
              : "សូមបញ្ចូលអាសយដ្ឋានអ៊ីមែល និងពាក្យសម្ងាត់របស់អ្នក ដើម្បីបន្ត។"}
          </span>
        </p>
        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="email" style={styles.label}>Email</label>
          <ClearableInput
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onClear={() => setEmail("")}
            clearLabel="Clear email"
            style={styles.input}
          />
          <label htmlFor="password" style={styles.label}>Password</label>
          <ClearableInput
            id="password"
            name="password"
            type="password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onClear={() => setPassword("")}
            clearLabel="Clear password"
            style={styles.input}
          />
          {feedback && (
            <p
              role={feedback.kind === "error" ? "alert" : "status"}
              style={feedback.kind === "error" ? styles.error : styles.success}
            >
              {feedback.text}
            </p>
          )}
          <button type="submit" disabled={busy} style={styles.button}>
            {busy ? "Please wait…" : isSignup ? "Sign up" : "Log in"}
          </button>
        </form>
        <p style={styles.switch}>
          {isSignup ? "Already have an account? " : "New to the archive? "}
          <Link href={isSignup ? "/login" : "/signup"} style={styles.link}>
            {isSignup ? "Log in" : "Sign up"}
          </Link>
        </p>
      </section>
    </main>
  );
}
