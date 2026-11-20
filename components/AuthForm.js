"use client";

import { useState } from "react";
import Link from "next/link";
import ClearableInput from "./ClearableInput.js";
import BilingualActionLabel from "./BilingualActionLabel.js";
import BilingualReturnLabel from "./BilingualReturnLabel.js";
import { createClient } from "../lib/supabase/client.js";
import styles from "./authStyles.js";
import interactive from "./interactive.module.css";

export default function AuthForm({ mode, confirmationFailed = false, redirectTo = "/" }) {
  const isSignup = mode === "signup";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState(
    confirmationFailed
      ? { kind: "error", text: "That confirmation link could not be verified. Please try again.\nតំណបញ្ជាក់នោះមិនអាចផ្ទៀងផ្ទាត់បានទេ។ សូមសាកល្បងម្តងទៀត។" }
      : null,
  );
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    const failureText = isSignup
      ? "Unable to sign up. Please check your details and try again.\nមិនអាចបង្កើតគណនីបានទេ។ សូមពិនិត្យព័ត៌មានរបស់អ្នក ហើយសាកល្បងម្តងទៀត។"
      : "Invalid email or password.\nអ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ។";

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
        else if (data.session) window.location.assign(redirectTo);
        else setFeedback({
          kind: "success",
          text: "Check your email to confirm your account.\nសូមពិនិត្យអ៊ីមែលរបស់អ្នក ដើម្បីបញ្ជាក់គណនី។",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setFeedback({ kind: "error", text: failureText });
        else window.location.assign(redirectTo);
      }
    } catch {
      setFeedback({ kind: "error", text: failureText });
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={styles.main}>
      <Link href="/" style={styles.back}>
        <BilingualReturnLabel khmer="ត្រឡប់ទៅបណ្ណសារ" english="Back to archive" />
      </Link>
      <section style={styles.panel} aria-labelledby="auth-title">
        <p style={styles.kicker}>
          <span lang="km" style={styles.kickerKhmer}>ការចូលប្រើគណនី</span>
          <span style={styles.kickerEnglish}>ACCOUNT ACCESS</span>
        </p>
        <h1 id="auth-title" style={styles.title}>
          {isSignup ? "Join the archive" : "Welcome back"}
        </h1>
        <p style={styles.intro}>
          <span lang="km" style={styles.introKhmer}>
            {isSignup
              ? "សូមបង្កើតគណនី ដើម្បីចូលរួមក្នុងបណ្ណសារនេះ។"
              : "សូមបញ្ចូលអាសយដ្ឋានអ៊ីមែល និងពាក្យសម្ងាត់របស់អ្នក ដើម្បីបន្ត។"}
          </span>
          <span style={styles.introEnglish}>
            {isSignup
              ? "Create an account to take part in the archive."
              : "Enter your email and password to continue."}
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
          <button className={interactive.primary} type="submit" disabled={busy} style={styles.button}>
            {busy ? (
              <BilingualActionLabel english="Please wait…" khmer="សូមរង់ចាំ…" khmerStyle={styles.buttonKhmer} />
            ) : isSignup ? (
              <BilingualActionLabel english="Sign up" khmer="បង្កើតគណនី" khmerStyle={styles.buttonKhmer} />
            ) : (
              <BilingualActionLabel english="Log in" khmer="ចូលគណនី" khmerStyle={styles.buttonKhmer} />
            )}
          </button>
        </form>
        {!isSignup ? (
          <p style={styles.switch}>
            <Link href="/forgot-password" className={interactive.textHighlight} style={styles.link}>
              <span lang="km" style={styles.switchKhmer}>ភ្លេចពាក្យសម្ងាត់?</span>
              <span aria-hidden="true"> / </span>
              <span>Forgot your password?</span>
            </Link>
          </p>
        ) : null}
        <p style={styles.switch}>
          <span lang="km" style={styles.switchKhmer}>
            {isSignup ? "មានគណនីរួចហើយ?" : "ថ្មីសម្រាប់បណ្ណសារនេះ?"}
          </span>
          <span aria-hidden="true"> / </span>
          <span>{isSignup ? "Already have an account?" : "New to the archive?"} </span>
          <Link
            href={isSignup ? "/login" : "/signup"}
            className={interactive.textHighlight}
            style={styles.link}
          >
            <span lang="km" style={styles.switchKhmer}>{isSignup ? "ចូលគណនី" : "បង្កើតគណនី"}</span>
            <span aria-hidden="true"> / </span>
            <span>{isSignup ? "Log in" : "Sign up"}</span>
          </Link>
        </p>
      </section>
    </main>
  );
}
