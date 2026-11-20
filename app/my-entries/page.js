import Link from "next/link";
import BilingualActionLabel from "../../components/BilingualActionLabel.js";
import BilingualReturnLabel from "../../components/BilingualReturnLabel.js";
import { createClient } from "../../lib/supabase/server.js";
import interactive from "../../components/interactive.module.css";
import pageStyles from "./myEntries.module.css";

const statusLabels = {
  pending: { english: "Awaiting review", khmer: "កំពុងរង់ចាំការពិនិត្យ", color: "#9DB7C9", tint: "rgba(157, 183, 201, 0.1)" },
  published: { english: "Published", khmer: "បានបោះពុម្ពផ្សាយ", color: "#C7D5B1", tint: "rgba(199, 213, 177, 0.1)" },
  returned: { english: "Changes requested", khmer: "ត្រូវការកែសម្រួល", color: "#F2A69A", tint: "rgba(242, 166, 154, 0.1)" },
};

const styles = {
  main: { maxWidth: 840, margin: "0 auto", padding: "72px 24px 80px" },
  back: { color: "#D49A56", textDecoration: "none", fontSize: 14 },
  bottomBack: { display: "inline-block", marginTop: 36 },
  header: {
    margin: "28px 0 32px", padding: "24px clamp(22px, 4vw, 32px)",
    backgroundColor: "rgba(48, 39, 32, 0.78)",
    backgroundImage: "linear-gradient(145deg, rgba(231, 184, 106, 0.05), transparent 42%), repeating-linear-gradient(90deg, rgba(231, 184, 106, 0.04) 0 2px, transparent 2px 11px, rgba(183, 98, 61, 0.03) 11px 13px, transparent 13px 22px), repeating-linear-gradient(0deg, rgba(231, 184, 106, 0.04) 0 2px, transparent 2px 11px, rgba(183, 98, 61, 0.03) 11px 13px, transparent 13px 22px)",
    border: "1px solid #5C4938", borderLeft: "4px solid #B7623D", borderRadius: 12,
    boxShadow: "inset 0 0 0 1px rgba(231, 184, 106, 0.05)",
  },
  kicker: {
    color: "#D49A56", fontFamily: "'Courier New', monospace",
    fontSize: 13, fontWeight: 700, letterSpacing: 2, margin: 0,
  },
  kickerKhmer: {
    display: "block", color: "#E7B86A", fontFamily: "system-ui, sans-serif",
    fontSize: 16, fontWeight: 400, letterSpacing: 0, lineHeight: 1.6,
    marginBottom: 5,
  },
  kickerEnglish: { display: "block" },
  title: { color: "#F1DFC2", fontFamily: "Georgia, serif", fontSize: "clamp(36px, 7vw, 56px)", margin: "14px 0" },
  intro: { color: "#BFB2A1", lineHeight: 1.7, margin: 0 },
  introKhmer: {
    display: "block", color: "#E0B97A", fontFamily: "system-ui, sans-serif",
    fontSize: 18, fontWeight: 400, lineHeight: 1.85,
  },
  introEnglish: {
    display: "block", marginTop: 12, paddingTop: 12,
    color: "#BFB2A1", borderTop: "1px solid #6A5140",
  },
  list: { display: "grid", gap: 18 },
  card: {
    display: "block", padding: "22px 24px", color: "inherit", textDecoration: "none",
    backgroundColor: "#211C18",
    backgroundImage: "linear-gradient(145deg, rgba(231, 184, 106, 0.035), transparent 45%), repeating-linear-gradient(90deg, rgba(231, 184, 106, 0.032) 0 2px, transparent 2px 11px, rgba(183, 98, 61, 0.024) 11px 13px, transparent 13px 22px), repeating-linear-gradient(0deg, rgba(231, 184, 106, 0.032) 0 2px, transparent 2px 11px, rgba(183, 98, 61, 0.024) 11px 13px, transparent 13px 22px)",
    border: "1px solid #5C4938", borderTop: "3px solid #80624C", borderRadius: 12,
    boxShadow: "inset 0 0 0 1px rgba(231, 184, 106, 0.04), 0 12px 30px rgba(0, 0, 0, 0.16)",
  },
  status: { display: "inline-block", margin: "0 0 12px", padding: "7px 10px", borderRadius: 7, fontSize: 12, fontWeight: 700, letterSpacing: 1 },
  khmer: { display: "block", fontWeight: 700, letterSpacing: 0 },
  statusEnglish: { display: "block", marginTop: 4, fontSize: 11 },
  languageLabel: { color: "#B7623D", fontFamily: "'Courier New', monospace", fontSize: 11, fontWeight: 700, letterSpacing: 1.2, margin: "0 0 6px" },
  entryTitleKh: { color: "#E7B86A", fontFamily: "system-ui, sans-serif", fontSize: 26, lineHeight: 1.5, margin: "0 0 8px" },
  englishLabel: { marginTop: 14, paddingTop: 14, borderTop: "2px solid #6A5140" },
  entryTitleEn: { color: "#E7B86A", fontFamily: "Georgia, serif", fontSize: 20, lineHeight: 1.4, margin: "0 0 10px" },
  place: { color: "#BFB2A1", margin: 0 },
  notice: { color: "#BFB2A1", lineHeight: 1.7, padding: "24px 0" },
  noticeKhmer: {
    display: "block", color: "#E0B97A", fontFamily: "system-ui, sans-serif",
    fontSize: 16, lineHeight: 1.8,
  },
  noticeEnglish: {
    display: "block", marginTop: 9, paddingTop: 9,
    borderTop: "1px solid #6A5140",
  },
  emptyNotice: {
    padding: "24px", backgroundColor: "rgba(48, 39, 32, 0.72)",
    border: "1px solid #5C4938", borderLeft: "4px solid #B7623D", borderRadius: 10,
  },
  emptyKhmer: { fontSize: 18, fontWeight: 700, color: "#E7B86A" },
  reviewNote: { marginTop: 16, padding: "14px 16px", color: "#D8CCBC", backgroundColor: "rgba(242, 166, 154, 0.08)", border: "1px solid rgba(242, 166, 154, 0.35)", borderRadius: 8, lineHeight: 1.7 },
  reviewNoteLabel: { display: "block", color: "#F2A69A", fontWeight: 700, marginBottom: 10 },
  reviewNoteKhmerRow: { display: "flex", alignItems: "center", gap: 12 },
  reviewNoteKhmer: {
    fontFamily: "system-ui, sans-serif", fontSize: 18, fontWeight: 700,
    lineHeight: 1.6, color: "#F2A69A",
  },
  reviewNoteEnglish: { display: "block", marginTop: 4, fontSize: 15, lineHeight: 1.5 },
  reviewNoteOrnament: { display: "flex", alignItems: "center", flex: 1, gap: 8, minWidth: 40 },
  reviewNoteDiamond: {
    width: 7, height: 7, flex: "0 0 auto", border: "1.5px solid #E7B86A",
    backgroundColor: "rgba(183, 98, 61, 0.14)", transform: "rotate(45deg)",
  },
  reviewNoteLine: {
    height: 1, flex: 1,
    background: "linear-gradient(90deg, #B7623D, rgba(231, 184, 106, 0.18), transparent)",
  },
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
      .select("id, title, title_kh, place, status, created_at, review_note")
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
      <Link href="/" style={styles.back}>
        <BilingualReturnLabel khmer="ត្រឡប់ទៅបណ្ណសារ" english="Back to archive" />
      </Link>
      <section style={styles.header}>
        <p style={styles.kicker}>
          <span lang="km" style={styles.kickerKhmer}>ធ្នើអ្នកចូលរួម</span>
          <span style={styles.kickerEnglish}>CONTRIBUTOR SHELF</span>
        </p>
        <h1 style={styles.title}>My entries</h1>
        <p style={styles.intro}>
          <span lang="km" style={styles.introKhmer}>
            តាមដានរឿងរ៉ាវគ្រួសារនីមួយៗ ចាប់ពីការដាក់ស្នើរហូតដល់ការបោះពុម្ពផ្សាយ។
          </span>
          <span style={styles.introEnglish}>
            Follow each family story from submission to publication.
          </span>
        </p>
      </section>

      {unavailable ? (
        <p role="alert" style={styles.notice}>
          <span lang="km" style={styles.noticeKhmer}>
            មិនអាចពិនិត្យគណនីរបស់អ្នកបាននៅពេលនេះទេ។ សូមព្យាយាមម្តងទៀតបន្តិចទៀត។
          </span>
          <span style={styles.noticeEnglish}>We could not check your account right now. Please try again shortly.</span>
        </p>
      ) : !user ? (
        <div>
          <p style={styles.notice}>
            <span lang="km" style={styles.noticeKhmer}>សូមចូលគណនី ដើម្បីមើលរឿងដែលអ្នកបានចូលរួម។</span>
            <span style={styles.noticeEnglish}>Log in to see the stories you have contributed.</span>
          </p>
          <Link href="/login" className={interactive.primary} style={styles.login}>
            <BilingualActionLabel english="Log in" khmer="ចូលគណនី" />
          </Link>
        </div>
      ) : entryError ? (
        <p role="alert" style={styles.notice}>
          <span lang="km" style={styles.noticeKhmer}>
            មិនអាចទាញយករឿងរបស់អ្នកបាននៅពេលនេះទេ។ សូមព្យាយាមម្តងទៀត។
          </span>
          <span style={styles.noticeEnglish}>Your entries could not be retrieved right now. Please try again.</span>
        </p>
      ) : entries.length === 0 ? (
        <p role="status" style={{ ...styles.notice, ...styles.emptyNotice }}>
          <span lang="km" style={{ ...styles.noticeKhmer, ...styles.emptyKhmer }}>
            អ្នកមិនទាន់បានដាក់ស្នើរឿងរ៉ាវគ្រួសារនៅឡើយទេ។
          </span>
          <span style={styles.noticeEnglish}>You have not submitted a family story yet.</span>
        </p>
      ) : (
        <div style={styles.list}>
          {entries.map((entry) => {
            const label = statusLabels[entry.status] || statusLabels.pending;
            return (
              <Link
                key={entry.id}
                href={`/entries/${entry.id}`}
                className={pageStyles.card}
                style={{ ...styles.card, borderLeft: `4px solid ${label.color}` }}
              >
                <p style={{ ...styles.status, color: label.color, backgroundColor: label.tint }}>
                  <span lang="km" style={styles.khmer}>{label.khmer}</span>
                  <span style={styles.statusEnglish}>{label.english}</span>
                </p>
                <p style={styles.languageLabel}>ខ្មែរ</p>
                <h2 lang="km" style={styles.entryTitleKh}>{entry.title_kh}</h2>
                <p style={{ ...styles.languageLabel, ...styles.englishLabel }}>ENGLISH</p>
                <p style={styles.entryTitleEn}>{entry.title}</p>
                <p style={styles.place}>{entry.place}</p>
                {entry.status === "returned" && entry.review_note ? (
                  <div style={styles.reviewNote}>
                    <span style={styles.reviewNoteLabel}>
                      <span style={styles.reviewNoteKhmerRow}>
                        <span lang="km" style={styles.reviewNoteKhmer}>កំណត់សម្គាល់របស់អ្នកពិនិត្យ:</span>
                        <span style={styles.reviewNoteOrnament} aria-hidden="true">
                          <span style={styles.reviewNoteDiamond} />
                          <span style={styles.reviewNoteLine} />
                        </span>
                      </span>
                      <span style={styles.reviewNoteEnglish}>Reviewer’s note:</span>
                    </span>
                    {entry.review_note}
                  </div>
                ) : null}
              </Link>
            );
          })}
        </div>
      )}
      <Link href="/" style={{ ...styles.back, ...styles.bottomBack }}>
        <BilingualReturnLabel khmer="ត្រឡប់ទៅបណ្ណសារគ្រួសារ" english="Return to the family archive" arrow="right" />
      </Link>
    </main>
  );
}
