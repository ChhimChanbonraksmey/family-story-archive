import Link from "next/link";
import BilingualReturnLabel from "../components/BilingualReturnLabel.js";

const styles = {
  wrap: { maxWidth: 720, margin: "0 auto", padding: "96px 24px" },
  panel: {
    padding: "clamp(26px, 5vw, 42px)", backgroundColor: "rgba(48, 39, 32, 0.86)",
    backgroundImage: "linear-gradient(145deg, rgba(231, 184, 106, 0.05), transparent 42%)",
    border: "1px solid #5C4938", borderTop: "4px solid #B7623D", borderRadius: 14,
  },
  kickerKhmer: {
    display: "block", color: "#E7B86A", fontFamily: "system-ui, sans-serif",
    fontSize: 16, lineHeight: 1.6,
  },
  kickerEnglish: {
    display: "block", marginTop: 4, color: "#D49A56",
    fontFamily: "'Courier New', monospace", fontSize: 13, fontWeight: 700, letterSpacing: 2,
  },
  title: { margin: "18px 0 0" },
  titleKhmer: {
    display: "block", color: "#E7B86A", fontFamily: "system-ui, sans-serif",
    fontSize: "clamp(30px, 6vw, 44px)", lineHeight: 1.5,
  },
  titleEnglish: {
    display: "block", marginTop: 6, color: "#F1DFC2",
    fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "clamp(28px, 5vw, 40px)",
  },
  messageKhmer: {
    display: "block", marginTop: 24, color: "#E0B97A",
    fontFamily: "system-ui, sans-serif", fontSize: 17, lineHeight: 1.85,
  },
  messageEnglish: {
    display: "block", marginTop: 14, paddingTop: 14,
    color: "#BFB2A1", borderTop: "1px solid #6A5140", lineHeight: 1.7,
  },
  back: { display: "inline-block", marginTop: 28, color: "#D49A56", textDecoration: "none" },
};

export default function NotFound() {
  return (
    <main style={styles.wrap}>
      <section style={styles.panel}>
        <p>
          <span lang="km" style={styles.kickerKhmer}>បណ្ណសារប្រវត្តិផ្ទាល់មាត់គ្រួសារ</span>
          <span style={styles.kickerEnglish}>FAMILY ORAL-HISTORY ARCHIVE</span>
        </p>
        <h1 style={styles.title}>
          <span lang="km" style={styles.titleKhmer}>រកមិនឃើញទំព័រនេះទេ។</span>
          <span style={styles.titleEnglish}>This page is not in the archive.</span>
        </h1>
        <p>
          <span lang="km" style={styles.messageKhmer}>
            តំណនេះអាចមិនពេញលេញ ឬទំព័រនេះអាចត្រូវបានផ្លាស់ទី។ សូមត្រឡប់ទៅបណ្ណសារ ដើម្បីបន្តស្វែងរករឿងរ៉ាវគ្រួសារ។
          </span>
          <span style={styles.messageEnglish}>
            The link may be incomplete, or this page may have moved. Return to the archive to continue exploring the family stories.
          </span>
        </p>
        <Link href="/" style={styles.back}>
          <BilingualReturnLabel khmer="ត្រឡប់ទៅបណ្ណសារ" english="Return to the archive" />
        </Link>
      </section>
    </main>
  );
}
