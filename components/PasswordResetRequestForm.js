"use client";

import { useState } from "react";
import Link from "next/link";
import AuthFieldLabel from "./AuthFieldLabel.js";
import ClearableInput from "./ClearableInput.js";
import BilingualActionLabel from "./BilingualActionLabel.js";
import BilingualReturnLabel from "./BilingualReturnLabel.js";
import { createClient } from "../lib/supabase/client.js";
import styles from "./authStyles.js";
import interactive from "./interactive.module.css";

export default function PasswordResetRequestForm({ recoveryFailed = false }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState(recoveryFailed
    ? { kind: "error", text: "That recovery link is invalid or expired. Request a new one.\nតំណសង្គ្រោះគណនីមិនត្រឹមត្រូវ ឬផុតកំណត់។ សូមស្នើសុំតំណថ្មី។" }
    : null);

  async function submit(event) {
    event.preventDefault();
    const cleanEmail = email.trim();
    setFeedback(null);
    if (!cleanEmail) {
      setFeedback({
        kind: "error",
        text: "Enter the email used for your archive account.\nសូមបញ្ចូលអ៊ីមែលដែលប្រើសម្រាប់គណនីបណ្ណសាររបស់អ្នក។",
      });
      return;
    }

    setBusy(true);
    try {
      const { error } = await createClient().auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/auth/confirm?next=/update-password`,
      });
      if (error) {
        console.error("Password reset email failed", error);
        setFeedback({
          kind: "error",
          text: "The reset email could not be sent. Please wait and try again.\nមិនអាចផ្ញើអ៊ីមែលកំណត់ពាក្យសម្ងាត់ថ្មីបានទេ។ សូមរង់ចាំ ហើយសាកល្បងម្តងទៀត។",
        });
      } else {
        setFeedback({
          kind: "success",
          text: "If an account exists for that email, a reset link is on its way. Check your inbox and spam folder.\nប្រសិនបើមានគណនីសម្រាប់អ៊ីមែលនេះ តំណកំណត់ពាក្យសម្ងាត់ថ្មីកំពុងត្រូវបានផ្ញើ។ សូមពិនិត្យប្រអប់សារ និងសារឥតបានការ។",
        });
      }
    } catch (error) {
      console.error("Password reset request failed", error);
      setFeedback({
        kind: "error",
        text: "The reset email could not be sent. Please wait and try again.\nមិនអាចផ្ញើអ៊ីមែលកំណត់ពាក្យសម្ងាត់ថ្មីបានទេ។ សូមរង់ចាំ ហើយសាកល្បងម្តងទៀត។",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={styles.main}>
      <Link href="/login" style={styles.back}>
        <BilingualReturnLabel khmer="ត្រឡប់ទៅទំព័រចូលគណនី" english="Back to login" />
      </Link>
      <section style={styles.panel} aria-labelledby="reset-title">
        <p style={styles.kicker}>
          <span lang="km" style={styles.kickerKhmer}>ការសង្គ្រោះគណនី</span>
          <span style={styles.kickerEnglish}>ACCOUNT RECOVERY</span>
        </p>
        <h1 id="reset-title" style={styles.title}>Reset your password</h1>
        <p style={styles.intro}>
          <span lang="km" style={styles.introKhmer}>
            បញ្ចូលអ៊ីមែលគណនីរបស់អ្នក ហើយយើងនឹងផ្ញើតំណសុវត្ថិភាពសម្រាប់កំណត់ពាក្យសម្ងាត់ថ្មី។
          </span>
          <span style={styles.introEnglish}>
            Enter your account email and we will send a secure password-reset link.
          </span>
        </p>
        <form onSubmit={submit} noValidate>
          <label htmlFor="recovery-email" style={styles.label}>
            <AuthFieldLabel khmer="អ៊ីមែល" english="Email" />
          </label>
          <ClearableInput id="recovery-email" name="email" type="email" autoComplete="email"
            value={email} onChange={(event) => setEmail(event.target.value)}
            onClear={() => setEmail("")} clearLabel="Clear email" style={styles.input} />
          {feedback ? <p role={feedback.kind === "error" ? "alert" : "status"}
            style={feedback.kind === "error" ? styles.error : styles.success}>{feedback.text}</p> : null}
          <button className={interactive.primary} type="submit" disabled={busy} style={styles.button}>
            {busy ? (
              <BilingualActionLabel english="Sending…" khmer="កំពុងផ្ញើ…" khmerStyle={styles.buttonKhmer} />
            ) : (
              <BilingualActionLabel english="Send reset link" khmer="ផ្ញើតំណសង្គ្រោះ" khmerStyle={styles.buttonKhmer} />
            )}
          </button>
        </form>
      </section>
    </main>
  );
}
