"use client";

import { useState } from "react";
import Link from "next/link";
import ClearableInput from "./ClearableInput.js";
import { createClient } from "../lib/supabase/client.js";
import styles from "./authStyles.js";

export default function UpdatePasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setFeedback("");
    if (password.length < 8) {
      setFeedback("Use at least 8 characters for the new password.");
      return;
    }
    if (password !== confirmation) {
      setFeedback("The two passwords do not match.");
      return;
    }

    setBusy(true);
    try {
      const { error } = await createClient().auth.updateUser({ password });
      if (error) {
        console.error("Password update failed", error);
        setFeedback("The password could not be changed. Request a new recovery link and try again.");
      } else {
        window.location.assign("/");
      }
    } catch (error) {
      console.error("Password update request failed", error);
      setFeedback("The password could not be changed. Request a new recovery link and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={styles.main}>
      <Link href="/" style={styles.back}>← Back to archive</Link>
      <section style={styles.panel} aria-labelledby="password-title">
        <p style={styles.kicker}>ACCOUNT RECOVERY</p>
        <h1 id="password-title" style={styles.title}>Choose a new password</h1>
        <p style={styles.intro}>
          Use at least 8 characters and enter the same password twice.
          <span lang="km" style={{ display: "block" }}>
            ប្រើយ៉ាងតិច ៨ តួអក្សរ ហើយបញ្ចូលពាក្យសម្ងាត់ដូចគ្នាពីរដង។
          </span>
        </p>
        <form onSubmit={submit} noValidate>
          <label htmlFor="new-password" style={styles.label}>New password</label>
          <ClearableInput id="new-password" name="password" type="password" autoComplete="new-password"
            value={password} onChange={(event) => setPassword(event.target.value)}
            onClear={() => setPassword("")} clearLabel="Clear new password" style={styles.input} />
          <label htmlFor="confirm-password" style={styles.label}>Confirm new password</label>
          <ClearableInput id="confirm-password" name="confirmation" type="password" autoComplete="new-password"
            value={confirmation} onChange={(event) => setConfirmation(event.target.value)}
            onClear={() => setConfirmation("")} clearLabel="Clear confirmation password" style={styles.input} />
          {feedback ? <p role="alert" style={styles.error}>{feedback}</p> : null}
          <button type="submit" disabled={busy} style={styles.button}>
            {busy ? "Updating…" : "Update password"}
          </button>
        </form>
      </section>
    </main>
  );
}
