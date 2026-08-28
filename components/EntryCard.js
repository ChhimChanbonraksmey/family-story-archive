const styles = {
  card: {
    overflow: "hidden",
    backgroundColor: "#211C18",
    border: "1px solid #493A2D",
    borderRadius: 16,
    boxShadow: "0 18px 45px rgba(0, 0, 0, 0.24)",
  },
  image: {
    display: "block",
    width: "100%",
    height: 300,
    objectFit: "cover",
  },
  body: {
    padding: "28px 30px 30px",
  },
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

// Required props: title, contributor, place, image, and imageAlt. Description is optional.
export default function EntryCard({ title, description = "", contributor, place, image, imageAlt }) {
  return (
    <article style={styles.card}>
      <img src={image} alt={imageAlt} style={styles.image} />
      <div style={styles.body}>
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
