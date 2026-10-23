import Link from "next/link";
import { createClient } from "../../lib/supabase/server.js";

const statusLabels = {
  pending: { english: "Awaiting review", khmer: "កំពុងរង់ចាំការពិនិត្យ", color: "#E7B86A" },
  published: { english: "Published", khmer: "បានបោះពុម្ពផ្សាយ", color: "#C7D5B1" },
  returned: { english: "Changes requested", khmer: "ត្រូវការកែសម្រួល", color: "#F2A69A" },
};

const styles = {
  main: { maxWidth: 840, margin: "0 auto", padding: "72px 24px 80px" },
  back: { color: "#D49A56", textDecoration: "none", fontSize: 14 },
  bottomBack: { display: "inline-block", marginTop: 36 },
  kicker: { color: "#D49A56", fontSize: 13, fontWeight: 700, letterSpacing: 2, margin: "40px 0 0" },
  title: { color: "#F1DFC2", fontFamily: "Georgia, serif", fontSize: "clamp(36px, 7vw, 56px)", margin: "14px 0" },
  intro: { color: "#BFB2A1", lineHeight: 1.7, margin: "0 0 32px" },
  list: { display: "grid", gap: 18 },
  card: { display: "block", padding: "22px 24px", color: "inherit", textDecoration: "none", backgroundColor: "#211C18", border: "1px solid #493A2D", borderRadius: 12 },
  status: { margin: "0 0 10px", fontSize: 12, fontWeight: 700, letterSpacing: 1 },
  khmer: { display: "block", marginTop: 4, fontWeight: 400, letterSpacing: 0 },
  entryTitle: { color: "#E7B86A", fontFamily: "Georgia, serif", fontSize: 26, margin: "0 0 10px" },
  place: { color: "#BFB2A1", margin: 0 },
  notice: { color: "#BFB2A1", lineHeight: 1.7, padding: "24px 0" },
  login: { display: "inline-flex", alignItems: "center", minHeight: 44, padding: "0 16px", color: "#171411", backgroundColor: "#E7B86A", borderRadius: 8, textDecoration: "none", fontWeight: 700 },
};

export default async function MyEntriesPage() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const unavailable = Boolean(userError && userError.name !== "AuthSessionMissingError");
  const user = userError ? null : userData.user;
  let entries = [];
  let entryError = null;

  if (user) {
    const result = await supabase.from("entries")
      .select("id, title, place, status, created_at")
      .eq("owner", user.id)
      .order("created_at", { ascending: false });
    entries = result.data || [];
    entryError = result.error;
    if (entryError) console.error("My entries lookup failed", entryError);
  } else if (unavailable) {
    console.error("My entries session check failed", userError);
  }

  return (
    <main style={styles.main}>
      <Link href="/" style={styles.back}>← Back to archive</Link>
      <p style={styles.kicker}>CONTRIBUTOR SHELF</p>
      <h1 style={styles.title}>My entries</h1>
      <p style={styles.intro}>Follow each family story from submission to publication.</p>

      {unavailable ? (
        <p role="alert" style={styles.notice}>We could not check your account right now. Please try again shortly.</p>
      ) : !user ? (
        <div>
          <p style={styles.notice}>Log in to see the stories you have contributed.</p>
          <Link href="/login" style={styles.login}>Log in</Link>
        </div>
      ) : entryError ? (
        <p role="alert" style={styles.notice}>Your entries could not be retrieved right now. Please try again.</p>
      ) : entries.length === 0 ? (
        <p style={styles.notice}>You have not submitted a family story yet.</p>
      ) : (
        <div style={styles.list}>
          {entries.map((entry) => {
            const label = statusLabels[entry.status] || statusLabels.pending;
            return (
              <Link key={entry.id} href={`/entries/${entry.id}`} style={styles.card}>
                <p style={{ ...styles.status, color: label.color }}>
                  {label.english}
                  <span lang="km" style={styles.khmer}>{label.khmer}</span>
                </p>
                <h2 style={styles.entryTitle}>{entry.title}</h2>
                <p style={styles.place}>{entry.place}</p>
              </Link>
            );
          })}
        </div>
      )}
      <Link href="/" style={{ ...styles.back, ...styles.bottomBack }}>
        Return to the family archive →
      </Link>
    </main>
  );
}
