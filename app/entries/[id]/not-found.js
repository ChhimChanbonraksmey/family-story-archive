import Link from "next/link";

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
  back: {
    display: "inline-block",
    color: "#D49A56",
    marginTop: 24,
  },
};

export default function EntryNotFound() {
  return (
    <main style={styles.wrap}>
      <p style={styles.kicker}>KHMER LIVING ARCHIVE</p>
      <h1 style={styles.title}>This story is not on the shelf.</h1>
      <p style={styles.message}>
        This family story may have moved, or the link may be incomplete. Return
        to the archive to continue exploring the collection.
      </p>
      <p lang="km" style={styles.message}>
        រកមិនឃើញរឿងរ៉ាវគ្រួសារនេះទេ។ រឿងនេះអាចត្រូវបានផ្លាស់ទី
        ឬតំណភ្ជាប់មិនពេញលេញ។ សូមត្រឡប់ទៅបណ្ណសារ
        ដើម្បីបន្តស្វែងយល់ពីរឿងរ៉ាវគ្រួសារ។
      </p>
      <Link href="/" style={styles.back}>
        ← Return to the archive
      </Link>
    </main>
  );
}
