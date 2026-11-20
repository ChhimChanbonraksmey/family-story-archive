"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase/client.js";
import { CHANGE_NOT_SAVED, deleteOwnedEntry } from "../lib/entryMutations.js";
import BilingualActionLabel from "./BilingualActionLabel.js";
import interactive from "./interactive.module.css";

const styles = {
  wrap: { display: "flex", alignItems: "center", flexWrap: "wrap", gap: 12, marginTop: 32, paddingTop: 24, borderTop: "2px solid #6A5140" },
  edit: { padding: "10px 16px", color: "#171411", backgroundColor: "#E7B86A", borderRadius: 8, fontWeight: 700, textDecoration: "none" },
  remove: { padding: "10px 16px", color: "#F2A69A", backgroundColor: "transparent", border: "1px solid #8B5148", borderRadius: 8, fontWeight: 700, cursor: "pointer" },
  error: { flexBasis: "100%", color: "#F2A69A", margin: "4px 0 0" },
  backdrop: {
    position: "fixed", inset: 0, zIndex: 1000, display: "grid", placeItems: "center",
    padding: 20, backgroundColor: "rgba(10, 8, 7, 0.78)", backdropFilter: "blur(3px)",
  },
  dialog: {
    boxSizing: "border-box", width: "min(100%, 480px)", padding: "28px",
    color: "#F1DFC2", backgroundColor: "#211C18",
    backgroundImage: "linear-gradient(145deg, rgba(231, 184, 106, 0.06), transparent 45%)",
    border: "1px solid #6A5140", borderTop: "4px solid #B7623D", borderRadius: 12,
    boxShadow: "0 28px 80px rgba(0, 0, 0, 0.48)",
  },
  dialogTitle: { margin: 0 },
  dialogTitleKhmer: {
    display: "block", color: "#E7B86A", fontFamily: "system-ui, sans-serif",
    fontSize: 23, fontWeight: 700, lineHeight: 1.65,
  },
  dialogWarningKhmer: {
    display: "block", marginTop: 8, color: "#F2A69A",
    fontFamily: "system-ui, sans-serif", fontSize: 17, fontWeight: 600, lineHeight: 1.7,
  },
  dialogEnglish: {
    marginTop: 18, paddingTop: 18, borderTop: "1px solid #80624C",
  },
  dialogTitleEnglish: {
    display: "block", color: "#D8CCBC", fontFamily: "Georgia, serif",
    fontSize: 19, lineHeight: 1.45,
  },
  dialogWarningEnglish: { margin: "7px 0 0", color: "#F2A69A", fontSize: 14, fontWeight: 600, lineHeight: 1.6 },
  dialogActions: { display: "flex", flexWrap: "wrap", gap: 12, marginTop: 24 },
  cancelDialog: {
    flex: "1 1 150px", minHeight: 48, padding: "8px 16px",
    color: "#D8CCBC", backgroundColor: "transparent", border: "1px solid #6A5140",
    borderRadius: 8, cursor: "pointer",
  },
  confirmDialog: {
    flex: "1 1 150px", minHeight: 48, padding: "8px 16px",
    color: "#FFF4EC", backgroundColor: "#B7623D", border: "1px solid #D98B70",
    borderRadius: 8, cursor: "pointer",
  },
  dialogButtonKhmer: { fontSize: 16, lineHeight: 1.5 },
};

export default function OwnerEntryActions({ entryId, photoUrl }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!confirming) return undefined;
    function closeOnEscape(event) {
      if (event.key === "Escape") setConfirming(false);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [confirming]);

  async function remove() {
    setConfirming(true);
  }

  async function confirmRemove() {
    setConfirming(false);
    setBusy(true);
    setError("");
    try {
      const result = await deleteOwnedEntry(createClient(), entryId, photoUrl);
      if (result.message) {
        setError(result.message);
        return;
      }
      router.push("/");
      router.refresh();
    } catch (deleteError) {
      console.error("Entry delete request failed", deleteError);
      setError(CHANGE_NOT_SAVED);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={styles.wrap} aria-label="Owner actions">
      <Link href={`/entries/${entryId}/edit`} className={interactive.primary} style={styles.edit}>
        <BilingualActionLabel english="Edit story" khmer="កែសម្រួលរឿង" />
      </Link>
      <button className={interactive.danger} type="button" onClick={remove} disabled={busy} style={styles.remove}>
        {busy ? (
          <BilingualActionLabel english="Deleting…" khmer="កំពុងលុប…" />
        ) : (
          <BilingualActionLabel english="Delete story" khmer="លុបរឿង" />
        )}
      </button>
      {error ? <p role="alert" style={styles.error}>{error}</p> : null}
      {confirming ? (
        <div style={styles.backdrop}>
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
            style={styles.dialog}
          >
            <h2 id="delete-dialog-title" style={styles.dialogTitle}>
              <span lang="km" style={styles.dialogTitleKhmer}>
                តើអ្នកចង់លុបរឿងនេះចេញពីបណ្ណសារមែនទេ?
              </span>
              <span lang="km" style={styles.dialogWarningKhmer}>
                សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។
              </span>
            </h2>
            <div id="delete-dialog-description" style={styles.dialogEnglish}>
              <span style={styles.dialogTitleEnglish}>Delete this story from the archive?</span>
              <p style={styles.dialogWarningEnglish}>This cannot be undone.</p>
            </div>
            <div style={styles.dialogActions}>
              <button
                className={interactive.quiet}
                type="button"
                autoFocus
                onClick={() => setConfirming(false)}
                style={styles.cancelDialog}
              >
                <BilingualActionLabel english="Cancel" khmer="បោះបង់" khmerStyle={styles.dialogButtonKhmer} />
              </button>
              <button
                className={interactive.danger}
                type="button"
                onClick={confirmRemove}
                style={styles.confirmDialog}
              >
                <BilingualActionLabel english="Delete story" khmer="លុបរឿង" khmerStyle={styles.dialogButtonKhmer} />
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
