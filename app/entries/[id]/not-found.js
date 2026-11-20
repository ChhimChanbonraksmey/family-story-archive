import Link from "next/link";
import BilingualReturnLabel from "../../../components/BilingualReturnLabel.js";

const styles = {
  wrap: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "96px 24px",
  },
  kicker: {
    color: "#B7623D",
    fontFamily: "'Courier New', monospace",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: 2,
  },
  kickerKhmer: {
    display: "block", color: "#E7B86A", fontFamily: "system-ui, sans-serif",
    fontSize: 16, fontWeight: 400, letterSpacing: 0, lineHeight: 1.6,
  },
  kickerEnglish: { display: "block", marginTop: 4 },
  title: {
    color: "#F1DFC2",
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: 42,
    margin: "18px 0",
  },
  message: {
    color: "#BFB2A1",
    lineHeight: 1.7,
  },
  titleKhmer: {
    display: "block", color: "#E7B86A", fontFamily: "system-ui, sans-serif",
    fontSize: 34, lineHeight: 1.5,
  },
  titleEnglish: { display: "block", marginTop: 6 },
  messageKhmer: {
    display: "block", color: "#E0B97A", fontFamily: "system-ui, sans-serif",
    fontSize: 17, lineHeight: 1.85,
  },
  messageEnglish: {
    display: "block", marginTop: 14, paddingTop: 14,
    borderTop: "1px solid #6A5140",
  },
  back: {
    display: "inline-block",
    color: "#D49A56",
    marginTop: 24,
  },
};

export default function EntryNotFound() {
  return (
    <main style={styles.wrap}>
      <p style={styles.kicker}>
        <span lang="km" style={styles.kickerKhmer}>បណ្ណសាររស់នៅខ្មែរ</span>
        <span style={styles.kickerEnglish}>KHMER LIVING ARCHIVE</span>
      </p>
      <h1 style={styles.title}>
        <span lang="km" style={styles.titleKhmer}>រកមិនឃើញរឿងនេះនៅលើធ្នើទេ។</span>
        <span style={styles.titleEnglish}>This story is not on the shelf.</span>
      </h1>
      <p style={styles.message}>
        <span lang="km" style={styles.messageKhmer}>
          រកមិនឃើញរឿងរ៉ាវគ្រួសារនេះទេ។ រឿងនេះអាចត្រូវបានផ្លាស់ទី
          ឬតំណភ្ជាប់មិនពេញលេញ។ សូមត្រឡប់ទៅបណ្ណសារ
          ដើម្បីបន្តស្វែងយល់ពីរឿងរ៉ាវគ្រួសារ។
        </span>
        <span style={styles.messageEnglish}>
          This family story may have moved, or the link may be incomplete. Return
          to the archive to continue exploring the collection.
        </span>
      </p>
      <Link href="/" style={styles.back}>
        <BilingualReturnLabel khmer="ត្រឡប់ទៅបណ្ណសារ" english="Return to the archive" />
      </Link>
    </main>
  );
}
