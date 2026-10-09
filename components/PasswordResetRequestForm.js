"use client";

import { useState } from "react";
import Link from "next/link";
import ClearableInput from "./ClearableInput.js";
import { createClient } from "../lib/supabase/client.js";
import styles from "./authStyles.js";

export default function PasswordResetRequestForm({ recoveryFailed = false }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState(recoveryFailed
    ? { kind: "error", text: "That recovery link is invalid or expired. Request a new one." }
    : null);

  async function submit(event) {
    event.preventDefault();
    const cleanEmail = email.trim();
    setFeedback(null);
    if (!cleanEmail) {
      setFeedback({ kind: "error", text: "Enter the email used for your archive account." });
      return;
    }

    setBusy(true);
    try {
      const { error } = await createClient().auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/auth/confirm?next=/update-password`,
      });
      if (error) {
        console.error("Password reset email failed", error);
        setFeedback({ kind: "error", text: "The reset email could not be sent. Please wait and try again." });
      } else {
        setFeedback({ kind: "success", text: "If an account exists for that email, a reset link is on its way. Check your inbox and spam folder." });
      }
    } catch (error) {
      console.error("Password reset request failed", error);
      setFeedback({ kind: "error", text: "The reset email could not be sent. Please wait and try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={styles.main}>
      <Link href="/login" style={styles.back}>← Back to login</Link>
      <section style={styles.panel} aria-labelledby="reset-title">
        <p style={styles.kicker}>ACCOUNT RECOVERY</p>
        <h1 id="reset-title" style={styles.title}>Reset your password</h1>
        <p style={styles.intro}>
          Enter your account email and we will send a secure password-reset link.
          <span lang="km" style={{ display: "block" }}>
            បញ្ចូលអ៊ីមែលគណនីរបស់អ្នក ហើយយើងនឹងផ្ញើតំណសុវត្ថិភាពសម្រាប់កំណត់ពាក្យសម្ងាត់ថ្មី។
          </span>
        </p>
        <form onSubmit={submit} noValidate>
          <label htmlFor="recovery-email" style={styles.label}>Email</label>
          <ClearableInput id="recovery-email" name="email" type="email" autoComplete="email"
            value={email} onChange={(event) => setEmail(event.target.value)}
            onClear={() => setEmail("")} clearLabel="Clear email" style={styles.input} />
          {feedback ? <p role={feedback.kind === "error" ? "alert" : "status"}
            style={feedback.kind === "error" ? styles.error : styles.success}>{feedback.text}</p> : null}
          <button type="submit" disabled={busy} style={styles.button}>
            {busy ? "Sending…" : "Send reset link"}
          </button>
        </form>
      </section>
    </main>
  );
}
