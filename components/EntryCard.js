import { photoDisclosure } from "../lib/entryValidation.js";

const styles = {
  card: {
    overflow: "hidden",
    backgroundColor: "#211C18",
    border: "1px solid #493A2D",
    borderTop: "3px solid #B7623D",
    borderRadius: 16,
    boxShadow: "0 18px 45px rgba(0, 0, 0, 0.24)",
  },
  image: {
    display: "block",
    width: "100%",
    height: 300,
    objectFit: "contain",
    backgroundColor: "#171411",
  },
  imageWrap: { position: "relative" },
  imageLabel: {
    position: "absolute", left: 16, bottom: 16, padding: "7px 10px",
    color: "#F1DFC2", backgroundColor: "rgba(23, 20, 17, 0.9)",
    border: "1px solid #6A5140", borderRadius: 6,
    fontSize: 11, fontWeight: 700, letterSpacing: 0.8,
  },
  body: {
    padding: "28px 30px 30px",
  },
  number: { color: "#B7623D", fontSize: 12, fontWeight: 700, letterSpacing: 1.5, margin: "0 0 10px" },
  title: {
    color: "#E7B86A",
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: 30,
    lineHeight: 1.2,
    margin: "0 0 14px",
  },
  description: {
    color: "#D2C7B8",
    lineHeight: 1.75,
    margin: "0 0 24px",
    overflowWrap: "anywhere",
  },
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
// Required props: number, title, contributor, and place. Description and image are optional.
export default function EntryCard({
  number, title, description = "", contributor, place, image, imageAlt, photoType,
}) {
  const disclosure = photoDisclosure(photoType, true);
  return (
    <article style={styles.card}>
      {image ? (
        <div style={styles.imageWrap}>
          <img src={image} alt={imageAlt || ""} style={styles.image} />
          {disclosure ? <span style={styles.imageLabel}>{disclosure}</span> : null}
        </div>
      ) : null}
      <div style={styles.body}>
        <p style={styles.number}>ARCHIVE ENTRY {number}</p>
        <h2 style={styles.title}>{title}</h2>
        {description ? <p style={styles.description}>{description}</p> : null}
        <div style={styles.details}>
          <span style={styles.contributor}>CONTRIBUTED BY · {contributor}</span>
          <span style={styles.place}>PLACE · {place}</span>
        </div>
      </div>
    </article>
  );
}
