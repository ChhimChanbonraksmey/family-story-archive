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
    backgroundColor: "rgba(33, 28, 24, 0.94)",
    backgroundImage: "linear-gradient(145deg, rgba(231, 184, 106, 0.05), transparent 42%), repeating-linear-gradient(90deg, rgba(231, 184, 106, 0.04) 0 2px, transparent 2px 11px, rgba(183, 98, 61, 0.03) 11px 13px, transparent 13px 22px), repeating-linear-gradient(0deg, rgba(231, 184, 106, 0.04) 0 2px, transparent 2px 11px, rgba(183, 98, 61, 0.03) 11px 13px, transparent 13px 22px)",
    border: "1px solid #5C4938", borderTop: "4px solid #B7623D", borderRadius: 14,
    boxShadow: "inset 0 0 0 1px rgba(231, 184, 106, 0.05), 0 24px 60px rgba(0, 0, 0, 0.22)",
  },
  title: {
    color: "#F1DFC2",
    fontFamily: "Georgia, serif",
    fontSize: "clamp(34px, 6vw, 52px)",
    margin: "0 0 18px",
  },
  titleKhmer: { display: "block", fontFamily: "system-ui, sans-serif", lineHeight: 1.45 },
  titleEnglish: { display: "block", marginTop: 3, color: "#D8CCBC", fontSize: "0.62em" },
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
          <h1 id="review-access-heading" style={styles.title}>
            <span lang="km" style={styles.titleKhmer}>សម្រាប់អ្នកពិនិត្យតែប៉ុណ្ណោះ</span>
            <span style={styles.titleEnglish}>Review access only</span>
          </h1>
          <p lang="km" style={{ ...styles.khmer, margin: "0 0 8px" }}>
            សម្រាប់អ្នកពិនិត្យតែប៉ុណ្ណោះ។ ទំព័រនេះអាចប្រើបានសម្រាប់តែអ្នកពិនិត្យដែលបានអនុញ្ញាតប៉ុណ្ណោះ។
          </p>
          <p style={{ ...styles.message, margin: "0 0 24px" }}>
            This page is available only to authorized reviewers.
          </p>
          <Link href="/" style={styles.link}>Return to the family archive →</Link>
        </section>
      </main>
    );
  }

  const { data, error: queueError } = await supabase.from("entries")
    .select("id, title, title_kh, description, description_kh, contributor_name, place, created_at, photo_url, photo_alt, photo_type")
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
        <h1 style={styles.title}>
          <span lang="km" style={styles.titleKhmer}>ជួររង់ចាំពិនិត្យ</span>
          <span style={styles.titleEnglish}>Review queue</span>
        </h1>
        <p style={styles.intro}>
          <span lang="km" style={{ display: "block", fontFamily: "system-ui, sans-serif", lineHeight: 1.8 }}>
            រឿងរ៉ាវគ្រួសារដែលកំពុងរង់ចាំការពិនិត្យ ត្រូវបានបង្ហាញពីរឿងចាស់បំផុតមុន។
          </span>
          <span style={{ display: "block", marginTop: 4 }}>Pending family stories are shown oldest first.</span>
        </p>
        <ReviewQueue initialEntries={entries} />
        <Link href="/" style={styles.returnLink}>
          Return to the family archive →
        </Link>
      </section>
    </main>
  );
}
