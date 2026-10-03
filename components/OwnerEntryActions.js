"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "../lib/supabase/client.js";
import { deleteOwnedEntry } from "../lib/entryMutations.js";

const styles = {
  wrap: { display: "flex", alignItems: "center", flexWrap: "wrap", gap: 12, marginTop: 32, paddingTop: 24, borderTop: "1px solid #493A2D" },
  edit: { padding: "10px 16px", color: "#171411", backgroundColor: "#E7B86A", borderRadius: 8, fontWeight: 700, textDecoration: "none" },
  remove: { padding: "10px 16px", color: "#F2A69A", backgroundColor: "transparent", border: "1px solid #8B5148", borderRadius: 8, fontWeight: 700, cursor: "pointer" },
  error: { flexBasis: "100%", color: "#F2A69A", margin: "4px 0 0" },
};

export default function OwnerEntryActions({ entryId, photoUrl }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function remove() {
    if (!window.confirm("Delete this story from the archive? This cannot be undone.")) return;
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
      setError("That change wasn't saved");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={styles.wrap} aria-label="Owner actions">
      <Link href={`/entries/${entryId}/edit`} style={styles.edit}>Edit story</Link>
      <button type="button" onClick={remove} disabled={busy} style={styles.remove}>
        {busy ? "Deleting…" : "Delete story"}
      </button>
      {error ? <p role="alert" style={styles.error}>{error}</p> : null}
    </div>
  );
}
