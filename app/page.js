"use client";

import { useEffect, useState } from "react";
import collection from "../collection.config.js";
import AccountStatus from "../components/AccountStatus.js";
import SearchableEntryList from "../components/SearchableEntryList.js";
import { createClient } from "../lib/supabase/client.js";

const styles = {
  wrap: {
    maxWidth: 960,
    margin: "0 auto",
    padding: "96px 24px 64px",
  },
  hero: {
    maxWidth: 820,
    paddingLeft: 24,
    borderLeft: "4px solid #B7623D",
  },
  kicker: {
    fontFamily: "'Courier New', monospace",
    color: "#D49A56",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: 2,
  },
  title: {
    color: "#F1DFC2",
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "clamp(40px, 7vw, 68px)",
    fontWeight: 700,
    margin: "18px 0 20px",
    lineHeight: 1.05,
  },
  description: {
    fontSize: 19,
    color: "#BFB2A1",
    lineHeight: 1.7,
    margin: 0,
  },
  archiveInfo: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 16,
    marginTop: 48,
  },
  card: {
    padding: "20px 22px",
    backgroundColor: "rgba(48, 39, 32, 0.72)",
    border: "1px solid #493A2D",
    borderRadius: 12,
  },
  cardLabel: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    color: "#B7623D",
    fontWeight: 700,
    letterSpacing: 1.5,
    margin: 0,
  },
  cardValue: {
    fontSize: 16,
    margin: "6px 0 0",
  },
  browse: {
    marginTop: 64,
  },
  browseTitle: {
    color: "#F1DFC2",
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: 32,
    margin: "0 0 8px",
  },
  count: {
    fontFamily: "'Courier New', monospace",
    fontSize: 14,
    color: "#D49A56",
    margin: 0,
  },
  countNumber: {
    fontSize: 20,
    fontWeight: 700,
  },
  footer: {
    marginTop: 64,
    paddingTop: 24,
    borderTop: "1px solid #493A2D",
    fontSize: 13,
    color: "#88796A",
  },
};

export default function Home() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadEntries() {
      try {
        const { data, error } = await createClient()
          .from("entries")
          .select("*")
          .order("created_at", { ascending: false });

        if (!active) return;

        setLoadError(Boolean(error));
        setEntries(
          error
            ? []
            : data.map((entry) => ({
                id: entry.id,
                number: entry.display_order,
                title: entry.title,
                description: entry.description,
                contributor: entry.contributor_name,
                place: entry.place,
                image: entry.photo_url,
                imageAlt: entry.photo_alt,
              })),
        );
      } catch {
        if (active) {
          setLoadError(true);
          setEntries([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadEntries();
    return () => { active = false; };
  }, []);

  return (
    <main style={styles.wrap}>
      <header style={styles.hero}>
        <AccountStatus />
        <p style={styles.kicker}>KHMER LIVING ARCHIVE</p>
        <h1 style={styles.title}>{collection.name}</h1>
        <p style={styles.description}>{collection.description}</p>
      </header>

      <div style={styles.archiveInfo}>
        <div style={styles.card}>
          <p style={styles.cardLabel}>CURATED BY</p>
          <p style={styles.cardValue}>{collection.curator}</p>
        </div>
        <div style={styles.card}>
          <p style={styles.cardLabel}>SOURCE</p>
          <p style={styles.cardValue}>{collection.source}</p>
        </div>
      </div>

      <section style={styles.browse} aria-labelledby="browse-heading">
        <h2 id="browse-heading" style={styles.browseTitle}>
          Browse the archive
        </h2>
        <p style={styles.count}>
          {loading ? (
            "Loading entries..."
          ) : (
            <>
              <span style={styles.countNumber}>{entries.length}</span>{" "}
              entries in the collection
            </>
          )}
        </p>

        <SearchableEntryList
          entries={entries}
          loading={loading}
          loadError={loadError}
        />
      </section>

      <footer style={styles.footer}>
        Built in ICT 340 — Vibe Coding, American University of Phnom Penh, Fall
        2026. This archive is under construction all semester. Come back in
        December.
      </footer>
    </main>
  );
}
