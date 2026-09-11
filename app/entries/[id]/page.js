import Link from "next/link";
import { notFound } from "next/navigation";
import entries from "../../../data/entries.js";

const styles = {
  wrap: {
    maxWidth: 1120,
    margin: "0 auto",
    padding: "48px 24px 80px",
  },
  back: {
    display: "inline-block",
    color: "#D49A56",
    marginBottom: 28,
    textDecoration: "none",
  },
  image: {
    display: "block",
    width: "100%",
    maxHeight: 560,
    objectFit: "cover",
    borderRadius: 18,
  },
  story: {
    maxWidth: 760,
    margin: "44px auto 0",
  },
  number: {
    color: "#B7623D",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: 1.5,
    margin: "0 0 14px",
  },
  title: {
    color: "#E7B86A",
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "clamp(36px, 6vw, 64px)",
    lineHeight: 1.12,
    margin: "0 0 24px",
  },
  details: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 36,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0.5,
  },
  contributor: {
    color: "#F2C879",
    backgroundColor: "#4A3025",
    padding: "8px 12px",
    borderRadius: 20,
  },
  place: {
    color: "#C7D5B1",
    backgroundColor: "#2E392D",
    padding: "8px 12px",
    borderRadius: 20,
  },
  description: {
    color: "#D2C7B8",
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: 20,
    lineHeight: 1.9,
    overflowWrap: "anywhere",
    whiteSpace: "pre-line",
  },
  returnLink: {
    display: "inline-block",
    color: "#D49A56",
    marginTop: 36,
    textDecoration: "none",
  },
};

export function generateStaticParams() {
  return entries.map((entry) => ({ id: entry.id }));
}

export default async function EntryPage({ params }) {
  const { id } = await params;
  const entry = entries.find((item) => item.id === id);

  if (!entry) {
    notFound();
  }

  return (
    <main style={styles.wrap}>
      <Link href="/" style={styles.back}>
        ← Back to archive
      </Link>
      <article>
        {entry.image ? (
          <img
            src={entry.image}
            alt={entry.imageAlt || ""}
            style={styles.image}
          />
        ) : null}
        <div style={styles.story}>
          <p style={styles.number}>ARCHIVE ENTRY {entry.number}</p>
          <h1 style={styles.title}>{entry.title}</h1>
          <div style={styles.details}>
            <span style={styles.contributor}>
              CONTRIBUTED BY · {entry.contributor}
            </span>
            <span style={styles.place}>PLACE · {entry.place}</span>
          </div>
          {entry.description ? (
            <p style={styles.description}>{entry.description}</p>
          ) : null}
          <Link href="/" style={styles.returnLink}>
            Return to the family archive →
          </Link>
        </div>
      </article>
    </main>
  );
}
