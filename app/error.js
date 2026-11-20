"use client";

import { useEffect } from "react";
import Link from "next/link";
import BilingualActionLabel from "../components/BilingualActionLabel.js";
import BilingualReturnLabel from "../components/BilingualReturnLabel.js";
import interactive from "../components/interactive.module.css";

const styles = {
  wrap: { maxWidth: 720, margin: "0 auto", padding: "96px 24px" },
  panel: {
    padding: "clamp(26px, 5vw, 42px)",
    backgroundColor: "rgba(48, 39, 32, 0.86)",
    backgroundImage: "linear-gradient(145deg, rgba(231, 184, 106, 0.05), transparent 42%)",
    border: "1px solid #5C4938",
    borderTop: "4px solid #B7623D",
    borderRadius: 14,
  },
  kickerKhmer: {
    display: "block", color: "#E7B86A", fontFamily: "system-ui, sans-serif",
    fontSize: 16, lineHeight: 1.6,
  },
  kickerEnglish: {
    display: "block", marginTop: 4, color: "#D49A56",
    fontFamily: "'Courier New', monospace", fontSize: 13, fontWeight: 700, letterSpacing: 2,
  },
  title: { margin: "18px 0 0" },
  titleKhmer: {
    display: "block", color: "#E7B86A", fontFamily: "system-ui, sans-serif",
    fontSize: "clamp(30px, 6vw, 44px)", lineHeight: 1.5,
  },
  titleEnglish: {
    display: "block", marginTop: 6, color: "#F1DFC2",
    fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "clamp(28px, 5vw, 40px)",
  },
  messageKhmer: {
    display: "block", marginTop: 24, color: "#E0B97A",
    fontFamily: "system-ui, sans-serif", fontSize: 17, lineHeight: 1.85,
  },
  messageEnglish: {
    display: "block", marginTop: 14, paddingTop: 14,
    color: "#BFB2A1", borderTop: "1px solid #6A5140", lineHeight: 1.7,
  },
  actions: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 20, marginTop: 28 },
  retry: {
    padding: "12px 18px", color: "#171411", backgroundColor: "#E7B86A",
    border: 0, borderRadius: 8, fontWeight: 700, cursor: "pointer",
  },
  back: { color: "#D49A56", textDecoration: "none" },
};

export default function ErrorPage({ error, reset }) {
  useEffect(() => {
    console.error("Unhandled application error", error);
  }, [error]);

  return (
    <main style={styles.wrap}>
      <section style={styles.panel} aria-labelledby="application-error-title">
        <p>
          <span lang="km" style={styles.kickerKhmer}>សេចក្តីជូនដំណឹងពីបណ្ណសារ</span>
          <span style={styles.kickerEnglish}>ARCHIVE NOTICE</span>
        </p>
        <h1 id="application-error-title" style={styles.title}>
          <span lang="km" style={styles.titleKhmer}>ទំព័រនេះមានបញ្ហាបណ្តោះអាសន្ន</span>
          <span style={styles.titleEnglish}>This page encountered a temporary problem.</span>
        </h1>
        <p role="alert">
          <span lang="km" style={styles.messageKhmer}>
            សូមព្យាយាមបើកទំព័រនេះម្តងទៀត។ ប្រសិនបើវានៅតែមិនដំណើរការ សូមត្រឡប់ទៅបណ្ណសារ។
          </span>
          <span style={styles.messageEnglish}>
            Try loading this page again. If it still does not work, return to the archive.
          </span>
        </p>
        <div style={styles.actions}>
          <button type="button" onClick={reset} className={interactive.primary} style={styles.retry}>
            <BilingualActionLabel khmer="ព្យាយាមម្តងទៀត" english="Try again" />
          </button>
          <Link href="/" className={interactive.textHighlight} style={styles.back}>
            <BilingualReturnLabel khmer="ត្រឡប់ទៅបណ្ណសារ" english="Return to the archive" />
          </Link>
        </div>
      </section>
    </main>
  );
}
