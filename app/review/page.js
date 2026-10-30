import Link from "next/link";
import { createClient } from "../../lib/supabase/server.js";
import ReviewQueue from "../../components/ReviewQueue.js";

const styles = {
  main: { maxWidth: 840, margin: "0 auto", padding: "72px 24px 80px" },
  back: {
    display: "inline-block",
    color: "#D49A56",
    marginBottom: 28,
    textDecoration: "none",
    fontSize: 14,
  },
  returnLink: {
    display: "inline-block",
    color: "#D49A56",
    marginTop: 36,
    textDecoration: "none",
    fontSize: 14,
  },
  panel: {
    padding: "28px 30px",
    backgroundColor: "#211C18",
    border: "1px solid #493A2D",
    borderRadius: 12,
  },
  title: {
    color: "#F1DFC2",
    fontFamily: "Georgia, serif",
    fontSize: "clamp(34px, 6vw, 52px)",
    margin: "0 0 18px",
  },
  intro: { color: "#BFB2A1", lineHeight: 1.7, margin: "0 0 28px" },
  message: { color: "#BFB2A1", lineHeight: 1.7, margin: "0 0 8px" },
  khmer: { color: "#BFB2A1", lineHeight: 1.8, margin: "0 0 24px" },
  link: { color: "#D49A56", textDecoration: "none", fontSize: 14 },
};

export default async function ReviewPage() {
  const supabase = await createClient();
  const { data: reviewer, error } = await supabase.rpc("is_reviewer");

  if (error) console.error("Reviewer access check failed", error);

  if (reviewer !== true) {
    return (
      <main style={styles.main}>
        <section style={styles.panel} aria-labelledby="review-access-heading">
          <h1 id="review-access-heading" style={styles.title}>Review access only</h1>
          <p style={styles.message}>
            This page is available only to authorized reviewers.
          </p>
          <p lang="km" style={styles.khmer}>
            សម្រាប់អ្នកពិនិត្យតែប៉ុណ្ណោះ។ ទំព័រនេះអាចប្រើបានសម្រាប់តែអ្នកពិនិត្យដែលបានអនុញ្ញាតប៉ុណ្ណោះ។
          </p>
          <Link href="/" style={styles.link}>Return to the family archive →</Link>
        </section>
      </main>
    );
  }

  const { data, error: queueError } = await supabase.from("entries")
    .select("id, title, description, contributor_name, place, created_at, photo_url, photo_alt, photo_type")
    .eq("status", "pending")
    .order("created_at", { ascending: true });
  const entries = queueError ? [] : (data || []).map((entry) => ({
    ...entry,
    submittedLabel: new Intl.DateTimeFormat("en-KH", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(new Date(entry.created_at)),
  }));

  if (queueError) console.error("Review queue lookup failed", queueError);

  return (
    <main style={styles.main}>
      <Link href="/" style={styles.back}>
        ← Back to archive
      </Link>
      <section style={styles.panel}>
        <h1 style={styles.title}>Review queue</h1>
        <p style={styles.intro}>Pending family stories are shown oldest first.</p>
        <ReviewQueue initialEntries={entries} />
        <Link href="/" style={styles.returnLink}>
          Return to the family archive →
        </Link>
      </section>
    </main>
  );
}
