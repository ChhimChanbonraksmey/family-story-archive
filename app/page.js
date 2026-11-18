"use client";

import { useEffect, useState } from "react";
import collection from "../collection.config.js";
import AccountStatus from "../components/AccountStatus.js";
import ContributeCallToAction from "../components/ContributeCallToAction.js";
import SearchableEntryList from "../components/SearchableEntryList.js";
import { createClient } from "../lib/supabase/client.js";

const styles = {
  wrap: {
    maxWidth: 960,
    margin: "0 auto",
    padding: "96px 24px 64px",
  },
  hero: {
    position: "relative",
    overflow: "hidden",
    padding: "clamp(28px, 5vw, 48px)",
    backgroundColor: "rgba(42, 33, 27, 0.9)",
    backgroundImage: "linear-gradient(145deg, rgba(231, 184, 106, 0.06), transparent 42%), repeating-linear-gradient(90deg, rgba(231, 184, 106, 0.045) 0 2px, transparent 2px 11px, rgba(183, 98, 61, 0.034) 11px 13px, transparent 13px 22px), repeating-linear-gradient(0deg, rgba(231, 184, 106, 0.045) 0 2px, transparent 2px 11px, rgba(183, 98, 61, 0.034) 11px 13px, transparent 13px 22px)",
    border: "1px solid #5C4938",
    borderLeft: "5px solid #B7623D",
    borderRadius: 16,
    boxShadow: "inset 0 0 0 1px rgba(231, 184, 106, 0.08), 0 26px 70px rgba(0, 0, 0, 0.24)",
  },
  heroCorner: {
    position: "absolute",
    top: -22,
    right: -22,
    width: 120,
    height: 120,
    opacity: 0.34,
    transform: "rotate(45deg)",
    backgroundImage: "repeating-linear-gradient(45deg, #E7B86A 0 2px, transparent 2px 12px), repeating-linear-gradient(-45deg, #B7623D 0 2px, transparent 2px 12px)",
    filter: "drop-shadow(0 0 8px rgba(231, 184, 106, 0.14))",
    pointerEvents: "none",
  },
  heroContent: { position: "relative", zIndex: 1, maxWidth: 820 },
  kickerKh: {
    display: "block",
    color: "#E7B86A",
    fontFamily: "system-ui, sans-serif",
    fontSize: 16,
    letterSpacing: 0,
    marginBottom: 5,
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
    textShadow: "0 3px 24px rgba(0, 0, 0, 0.28)",
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
    backgroundColor: "rgba(48, 39, 32, 0.82)",
    backgroundImage: "linear-gradient(120deg, rgba(231, 184, 106, 0.05), transparent 48%), repeating-linear-gradient(90deg, rgba(231, 184, 106, 0.038) 0 2px, transparent 2px 11px, rgba(183, 98, 61, 0.028) 11px 13px, transparent 13px 22px), repeating-linear-gradient(0deg, rgba(231, 184, 106, 0.038) 0 2px, transparent 2px 11px, rgba(183, 98, 61, 0.028) 11px 13px, transparent 13px 22px)",
    border: "1px solid #5C4938",
    borderTop: "3px solid #B7623D",
    borderRadius: 12,
    boxShadow: "inset 0 0 0 1px rgba(231, 184, 106, 0.04)",
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
  browseHeader: {
    display: "flex",
    alignItems: "center",
    gap: 18,
    marginBottom: 8,
  },
  browseHeadingGroup: { flexShrink: 0 },
  browseTitleKh: {
    display: "block",
    color: "#E7B86A",
    fontFamily: "system-ui, sans-serif",
    fontSize: 27,
    lineHeight: 1.5,
  },
  browseTitle: {
    color: "#D8CCBC",
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: 19,
    fontWeight: 400,
    margin: 0,
  },
  ornament: {
    display: "flex",
    alignItems: "center",
    flex: 1,
    gap: 10,
  },
  ornamentLine: {
    height: 2,
    flex: 1,
    background: "linear-gradient(90deg, #D17A50, rgba(231, 184, 106, 0.24))",
  },
  ornamentDiamond: {
    width: 9,
    height: 9,
    border: "1px solid #D49A56",
    transform: "rotate(45deg)",
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
          .eq("status", "published")
          .order("created_at", { ascending: false })
          .order("display_order", { ascending: false })
          .order("id", { ascending: false });

        if (!active) return;

        setLoadError(Boolean(error));
        setEntries(
          error
            ? []
            : data.map((entry, index) => ({
                id: entry.id,
                // Visible numbers describe the current shelf, not deleted rows.
                number: data.length - index,
                title: entry.title,
                titleKh: entry.title_kh || "",
                description: entry.description,
                descriptionKh: entry.description_kh || "",
                contributor: entry.contributor_name,
                place: entry.place,
                image: entry.photo_url,
                imageAlt: entry.photo_alt,
                photoType: entry.photo_type,
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
        <span aria-hidden="true" style={styles.heroCorner} />
        <div style={styles.heroContent}>
          <AccountStatus />
          <p style={styles.kicker}>
            <span lang="km" style={styles.kickerKh}>បណ្ណសារប្រវត្តិផ្ទាល់មាត់គ្រួសារ</span>
            KHMER LIVING ARCHIVE
          </p>
          <h1 style={styles.title}>{collection.name}</h1>
          <p style={styles.description}>{collection.description}</p>
        </div>
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

      <ContributeCallToAction />

      <section style={styles.browse} aria-labelledby="browse-heading">
        <div style={styles.browseHeader}>
          <div style={styles.browseHeadingGroup}>
            <h2 id="browse-heading" style={styles.browseTitle}>
              <span lang="km" style={styles.browseTitleKh}>ស្វែងរកក្នុងបណ្ណសារ</span>
              Browse the archive
            </h2>
          </div>
          <span aria-hidden="true" style={styles.ornament}>
            <span style={styles.ornamentDiamond} />
            <span style={styles.ornamentLine} />
          </span>
        </div>
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
        Built in ICT 340: Vibe Coding at the American University of Phnom Penh,
        Fall 2026.
      </footer>
    </main>
  );
}
