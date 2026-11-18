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
    borderRadius: 13,
  },
  media: {
    position: "relative", padding: 8, backgroundColor: "#211C18",
    backgroundImage: "linear-gradient(135deg, rgba(231, 184, 106, 0.06), transparent 45%)",
    border: "1px solid #6A5140", borderRadius: 20,
    boxShadow: "inset 0 0 0 1px rgba(231, 184, 106, 0.05), 0 22px 55px rgba(0, 0, 0, 0.26)",
  },
  imageLabel: {
    position: "absolute", left: 18, bottom: 18, maxWidth: "calc(100% - 68px)",
    padding: "8px 11px", color: "#F1DFC2",
    backgroundColor: "rgba(23, 20, 17, 0.92)", border: "1px solid #6A5140",
    borderRadius: 6, fontSize: 12, fontWeight: 700,
  },
  story: {
    maxWidth: 760,
    margin: "44px auto 0",
    padding: "clamp(24px, 5vw, 44px)",
    backgroundColor: "rgba(33, 28, 24, 0.78)",
    backgroundImage: "linear-gradient(145deg, rgba(231, 184, 106, 0.035), transparent 38%), repeating-linear-gradient(90deg, rgba(231, 184, 106, 0.032) 0 1px, transparent 1px 11px, rgba(183, 98, 61, 0.024) 11px 12px, transparent 12px 22px), repeating-linear-gradient(0deg, rgba(231, 184, 106, 0.032) 0 1px, transparent 1px 11px, rgba(183, 98, 61, 0.024) 11px 12px, transparent 12px 22px)",
    border: "1px solid #5C4938",
    borderTop: "4px solid #B7623D",
    borderRadius: 14,
    boxShadow: "inset 0 0 0 1px rgba(231, 184, 106, 0.05), 0 20px 50px rgba(0, 0, 0, 0.18)",
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
  languageLabel: {
    color: "#B7623D",
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1.4,
    margin: "0 0 10px",
  },
  titleKh: {
    color: "#E7B86A",
    fontFamily: "system-ui, sans-serif",
    fontSize: "clamp(36px, 6vw, 64px)",
    lineHeight: 1.35,
    margin: "0 0 12px",
  },
  titleEn: {
    color: "#D2C7B8",
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "clamp(24px, 4vw, 36px)",
    lineHeight: 1.3,
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
  descriptionKh: {
    color: "#E1D6C7",
    fontFamily: "system-ui, sans-serif",
    fontSize: 20,
    lineHeight: 2,
    overflowWrap: "anywhere",
    whiteSpace: "pre-line",
  },
  englishStory: {
    marginTop: 32,
    paddingTop: 28,
    borderTop: "1px solid #493A2D",
  },
  reviewNote: {
    marginTop: 28,
    padding: "18px 20px",
    color: "#D8CCBC",
    backgroundColor: "rgba(242, 166, 154, 0.08)",
    border: "1px solid rgba(242, 166, 154, 0.35)",
    borderRadius: 10,
    lineHeight: 1.7,
    whiteSpace: "pre-wrap",
  },
  reviewNoteLabel: { display: "block", color: "#F2A69A", fontSize: 14, fontWeight: 700, marginBottom: 8 },
  reviewNoteKhmer: { display: "block", fontFamily: "system-ui, sans-serif", marginTop: 3 },
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

  if (error) {
    console.error("Entry detail lookup failed", error);
    return (
      <main style={styles.wrap}>
        <Link href="/" style={styles.back}>← Back to archive</Link>
        <section style={styles.story} aria-labelledby="archive-error-title">
          <p style={styles.number}>ARCHIVE NOTICE</p>
          <h1 id="archive-error-title" style={styles.title}>
            The archive shelf is temporarily out of reach
          </h1>
          <p role="alert" style={styles.description}>
            The family stories could not be retrieved right now. Your story has not disappeared.
            Please try again shortly.
            <span lang="km" style={{ display: "block", marginTop: 16 }}>
              មិនអាចភ្ជាប់ទៅបណ្ណសារបាននៅពេលនេះទេ។ រឿងរបស់អ្នកមិនបានបាត់ទេ។
              សូមសាកល្បងម្តងទៀតបន្តិចទៀត។
            </span>
          </p>
        </section>
      </main>
    );
  }

  if (!entry) {
    notFound();
  }

  const { data: orderedEntries, error: orderError } = await supabase
    .from("entries")
    .select("id")
    .order("created_at", { ascending: true })
    .order("display_order", { ascending: true })
    .order("id", { ascending: true });
  if (orderError) console.error("Entry number lookup failed", orderError);
  const entryIndex = orderedEntries?.findIndex((item) => item.id === entry.id) ?? -1;
  const entryNumber = entryIndex >= 0 ? entryIndex + 1 : entry.display_order;

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
          <p style={styles.number}>ARCHIVE ENTRY {entryNumber}</p>
          {entry.title_kh ? (
            <>
              <p lang="km" style={styles.languageLabel}>ខ្មែរ</p>
              <h1 lang="km" style={styles.titleKh}>{entry.title_kh}</h1>
              <p style={styles.titleEn}>{entry.title}</p>
            </>
          ) : (
            <h1 style={styles.title}>{entry.title}</h1>
          )}
          <div style={styles.details}>
            <span style={styles.contributor}>
              STORY SOURCE · {entry.contributor_name}
            </span>
            <span style={styles.place}>PLACE · {entry.place}</span>
          </div>
          {entry.description_kh ? (
            <div lang="km">
              <p style={styles.languageLabel}>ខ្មែរ</p>
              <p style={styles.descriptionKh}>{entry.description_kh}</p>
            </div>
          ) : null}
          {entry.description ? (
            <div style={entry.description_kh ? styles.englishStory : undefined}>
              {entry.description_kh ? <p style={styles.languageLabel}>ENGLISH</p> : null}
              <p style={styles.description}>{entry.description}</p>
            </div>
          ) : null}
          {userData.user?.id === entry.owner && entry.status === "returned" && entry.review_note ? (
            <div style={styles.reviewNote}>
              <span style={styles.reviewNoteLabel}>
                Reviewer’s note
                <span lang="km" style={styles.reviewNoteKhmer}>កំណត់សម្គាល់របស់អ្នកពិនិត្យ</span>
              </span>
              {entry.review_note}
            </div>
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
