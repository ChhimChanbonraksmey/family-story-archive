import { photoDisclosure } from "../lib/entryValidation.js";

const styles = {
  card: {
    overflow: "hidden",
    backgroundColor: "#211C18",
    backgroundImage: "linear-gradient(145deg, rgba(231, 184, 106, 0.035), transparent 42%), repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.012) 0 1px, transparent 1px 9px)",
    border: "1px solid #6A5140",
    borderTop: "4px solid #B7623D",
    borderRadius: 16,
    boxShadow: "inset 0 0 0 1px rgba(231, 184, 106, 0.05), 0 18px 45px rgba(0, 0, 0, 0.24)",
  },
  image: {
    display: "block",
    width: "100%",
    height: 300,
    objectFit: "cover",
  },
  imageWrap: { position: "relative", borderBottom: "1px solid #6A5140" },
  imageLabel: {
    position: "absolute", left: 16, bottom: 16, padding: "7px 10px",
    color: "#F1DFC2", backgroundColor: "rgba(23, 20, 17, 0.9)",
    border: "1px solid #6A5140", borderRadius: 6,
    fontSize: 11, fontWeight: 700, letterSpacing: 0.8,
  },
  body: {
    padding: "28px 30px 30px",
  },
  numberRow: { display: "flex", alignItems: "center", gap: 10, margin: "0 0 12px" },
  number: { flexShrink: 0, color: "#B7623D", fontSize: 12, fontWeight: 700, letterSpacing: 1.5, margin: 0 },
  numberDiamond: {
    width: 8, height: 8, border: "2px solid #E7B86A", transform: "rotate(45deg)",
    backgroundColor: "rgba(183, 98, 61, 0.16)", boxShadow: "0 0 7px rgba(231, 184, 106, 0.18)",
  },
  numberLine: { height: 2, flex: 1, background: "linear-gradient(90deg, #B7623D, rgba(231, 184, 106, 0.08), transparent)" },
  languageLabel: {
    color: "#B7623D",
    fontFamily: "'Courier New', monospace",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1.4,
    margin: "0 0 8px",
  },
  titleKh: {
    color: "#E7B86A",
    fontFamily: "system-ui, sans-serif",
    fontSize: 30,
    lineHeight: 1.45,
    margin: "0 0 14px",
  },
  descriptionKh: {
    color: "#D2C7B8",
    fontFamily: "system-ui, sans-serif",
    lineHeight: 1.9,
    margin: 0,
    overflowWrap: "anywhere",
  },
  englishSection: {
    marginTop: 22,
    paddingTop: 18,
    borderTop: "2px solid #6A5140",
  },
  titleEn: {
    color: "#E7B86A",
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: 24,
    lineHeight: 1.3,
    margin: "0 0 12px",
  },
  descriptionEn: {
    color: "#BFB2A1",
    lineHeight: 1.75,
    margin: 0,
    overflowWrap: "anywhere",
  },
  textBlock: { marginBottom: 24 },
  details: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0.5,
  },
  contributor: { color: "#F2C879", backgroundColor: "#4A3025", padding: "8px 12px", borderRadius: 20 },
  place: { color: "#C7D5B1", backgroundColor: "#2E392D", padding: "8px 12px", borderRadius: 20 },
};
// Required props: number, title, contributor, and place. Khmer text and media are optional.
export default function EntryCard({
  number, title, titleKh = "", description = "", descriptionKh = "",
  contributor, place, image, imageAlt, photoType,
}) {
  const disclosure = photoDisclosure(photoType, true);
  const hasKhmer = Boolean(titleKh || descriptionKh);
  return (
    <article style={styles.card}>
      {image ? (
        <div style={styles.imageWrap}>
          <img src={image} alt={imageAlt || ""} style={styles.image} />
          {disclosure ? <span style={styles.imageLabel}>{disclosure}</span> : null}
        </div>
      ) : null}
      <div style={styles.body}>
        <div style={styles.numberRow}>
          <p style={styles.number}>ARCHIVE ENTRY {number}</p>
          <span aria-hidden="true" style={styles.numberDiamond} />
          <span aria-hidden="true" style={styles.numberLine} />
        </div>
        <div style={styles.textBlock}>
          {hasKhmer ? (
            <div lang="km">
              <p style={styles.languageLabel}>ខ្មែរ</p>
              {titleKh ? <h2 style={styles.titleKh}>{titleKh}</h2> : null}
              {descriptionKh ? <p style={styles.descriptionKh}>{descriptionKh}</p> : null}
            </div>
          ) : null}
          <div style={hasKhmer ? styles.englishSection : undefined}>
            {hasKhmer ? <p style={styles.languageLabel}>ENGLISH</p> : null}
            {hasKhmer ? (
              <p style={styles.titleEn}>{title}</p>
            ) : (
              <h2 style={styles.titleKh}>{title}</h2>
            )}
            {description ? <p style={styles.descriptionEn}>{description}</p> : null}
          </div>
        </div>
        <div style={styles.details}>
          <span style={styles.contributor}>STORY SOURCE · {contributor}</span>
          <span style={styles.place}>PLACE · {place}</span>
        </div>
      </div>
    </article>
  );
}
