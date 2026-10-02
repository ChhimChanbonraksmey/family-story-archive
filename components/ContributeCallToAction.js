"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase/client.js";

const styles = {
  wrap: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    flexWrap: "wrap", gap: 20, marginTop: 32, padding: "22px 24px",
    backgroundColor: "rgba(74, 48, 37, 0.55)", border: "1px solid #6A4634", borderRadius: 12,
  },
  kicker: {
    color: "#D49A56", fontFamily: "'Courier New', monospace",
    fontSize: 12, fontWeight: 700, letterSpacing: 1.5, margin: 0,
  },
  text: { color: "#D2C7B8", lineHeight: 1.55, margin: "6px 0 0" },
  link: {
    display: "inline-flex", alignItems: "center", minHeight: 44, padding: "0 18px",
    color: "#FFF4E3", backgroundColor: "#8E442F", border: "1px solid #D49A56",
    borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 700,
    boxShadow: "0 8px 22px rgba(142, 66, 47, 0.28)",
  },
};

export default function ContributeCallToAction() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    let active = true;
    createClient().auth.getUser()
      .then(({ data }) => { if (active) setUser(data.user ?? null); })
      .catch(() => { if (active) setUser(null); });
    return () => { active = false; };
  }, []);

  const href = user === null ? "/login?next=/contribute" : "/contribute";
  return (
    <aside style={styles.wrap} aria-label="Contribute to the archive">
      <div>
        <p style={styles.kicker}>SHARE A FAMILY STORY</p>
        <p style={styles.text}>Add an oral-history entry and help the collection continue growing.</p>
      </div>
      <Link href={href} style={styles.link}>Contribute a story</Link>
    </aside>
  );
}
