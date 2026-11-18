"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase/client.js";
import interactive from "./interactive.module.css";

const styles = {
  wrap: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    flexWrap: "wrap", gap: 20, marginTop: 32, padding: "22px 24px",
    backgroundColor: "rgba(74, 48, 37, 0.62)",
    backgroundImage: "linear-gradient(145deg, rgba(231, 184, 106, 0.05), transparent 42%), repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.012) 0 1px, transparent 1px 12px)",
    border: "1px solid #6A5140", borderTop: "3px solid #B7623D", borderRadius: 12,
    boxShadow: "inset 0 0 0 1px rgba(231, 184, 106, 0.05), 0 14px 34px rgba(0, 0, 0, 0.16)",
  },
  kicker: {
    color: "#D49A56", fontFamily: "'Courier New', monospace",
    fontSize: 12, fontWeight: 700, letterSpacing: 1.5, margin: 0,
  },
  text: { color: "#D2C7B8", lineHeight: 1.55, margin: "6px 0 0" },
  actions: { display: "flex", alignItems: "center", flexWrap: "wrap", gap: 12 },
  link: {
    display: "inline-flex", alignItems: "center", minHeight: 44, padding: "0 18px",
    color: "#FFF4E3", backgroundColor: "#8E442F", border: "1px solid #D49A56",
    borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 700,
    boxShadow: "0 8px 22px rgba(142, 66, 47, 0.28)",
  },
  secondaryLink: {
    display: "inline-flex", alignItems: "center", minHeight: 44, padding: "0 18px",
    color: "#E7B86A", backgroundColor: "#2E392D", border: "1px solid #D49A56",
    borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 700,
  },
};

export default function ContributeCallToAction() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    let active = true;
    const supabase = createClient();

    supabase.auth.getUser()
      .then(({ data }) => { if (active) setUser(data.user ?? null); })
      .catch(() => { if (active) setUser(null); });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setUser(session?.user ?? null);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const href = user === null ? "/login?next=/contribute" : "/contribute";
  return (
    <aside style={styles.wrap} aria-label="Contribute to the archive">
      <div>
        <p style={styles.kicker}>SHARE A FAMILY STORY</p>
        <p style={styles.text}>
          Contribute a new oral-history entry or follow the stories you have already submitted.
        </p>
      </div>
      <div style={styles.actions}>
        <Link href={href} className={interactive.primary} style={styles.link}>Contribute a story</Link>
        {user ? (
          <Link href="/my-entries" className={interactive.secondary} style={styles.secondaryLink}>
            My entries
          </Link>
        ) : null}
      </div>
    </aside>
  );
}
