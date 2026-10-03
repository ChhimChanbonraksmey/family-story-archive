import Link from "next/link";
import { notFound } from "next/navigation";
import OwnerEntryActions from "../../../components/OwnerEntryActions.js";
import { createClient } from "../../../lib/supabase/server.js";
import { photoDisclosure } from "../../../lib/entryValidation.js";

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
  media: { position: "relative" },
  imageLabel: {
    position: "absolute", left: 18, bottom: 18, maxWidth: "calc(100% - 68px)",
    padding: "8px 11px", color: "#F1DFC2",
    backgroundColor: "rgba(23, 20, 17, 0.92)", border: "1px solid #6A5140",
    borderRadius: 6, fontSize: 12, fontWeight: 700,
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

export default async function EntryPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: entry, error } = await supabase
    .from("entries")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !entry) {
    notFound();
  }

  const { data: userData } = await supabase.auth.getUser();
  const disclosure = photoDisclosure(entry.photo_type);

  return (
    <main style={styles.wrap}>
      <Link href="/" style={styles.back}>
        ← Back to archive
      </Link>
      <article>
        {entry.photo_url ? (
          <div style={styles.media}>
            <img
              src={entry.photo_url}
              alt={entry.photo_alt || ""}
              style={styles.image}
            />
            {disclosure ? <span style={styles.imageLabel}>{disclosure}</span> : null}
          </div>
        ) : null}
        <div style={styles.story}>
          <p style={styles.number}>ARCHIVE ENTRY {entry.display_order}</p>
          <h1 style={styles.title}>{entry.title}</h1>
          <div style={styles.details}>
            <span style={styles.contributor}>
              CONTRIBUTED BY · {entry.contributor_name}
            </span>
            <span style={styles.place}>PLACE · {entry.place}</span>
          </div>
          {entry.description ? (
            <p style={styles.description}>{entry.description}</p>
          ) : null}
          {userData.user?.id === entry.owner ? (
            <OwnerEntryActions entryId={entry.id} photoUrl={entry.photo_url} />
          ) : null}
          <Link href="/" style={styles.returnLink}>
            Return to the family archive →
          </Link>
        </div>
      </article>
    </main>
  );
}
