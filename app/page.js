import collection from "../collection.config.js";
import EntryCard from "../components/EntryCard.js";

const entries = [
  {
    title: "Grandmother's Hidden Rice Jar",
    description:
      "During the Khmer Rouge era, Grandmother Sokha kept a small clay jar of rice hidden beneath the packed-earth floor of the family kitchen. She saved one handful at a time, even when doing so placed her at great risk. On nights when her children were too hungry to sleep, she quietly boiled a thin rice porridge and divided it among them. She remembered listening carefully for footsteps outside while the pot warmed over a small flame. For her, the jar represented more than food: it was a private act of care, courage, and determination to keep her family alive during a time of fear and scarcity.",
    contributor: "Grandmother Sokha",
    place: "Kampong Cham Province",
    image: "/images/hidden-rice-jar.png",
    imageAlt: "A clay rice jar hidden beneath the floor of a rural wooden home.",
  },
  {
    title: "The Bicycle Ride Home",
    description:
      "After the Khmer Rouge period ended, Dara began the long journey back to his childhood village on an old bicycle with worn tires and no reliable map. He traveled along damaged roads, slept near pagodas, and asked people in each village for directions and news of surviving relatives. Many familiar landmarks had disappeared, and he worried that he would no longer recognize his home. After several days, he saw the large tamarind tree that had once stood beside the road near his family's house. Although the village had changed and many people were missing, the tree assured him that he had finally returned to the place where his family had lived before the war.",
    contributor: "Father Dara",
    place: "Takeo Province",
    image: "/images/bicycle-ride-home.png",
    imageAlt: "An old bicycle resting beneath a tamarind tree beside a rural road.",
  },
];

const styles = {
  wrap: {
    maxWidth: 960,
    margin: "0 auto",
    padding: "96px 24px 64px",
  },
  hero: {
    maxWidth: 820,
    paddingLeft: 24,
    borderLeft: "4px solid #B7623D",
  },
  kicker: {
    fontFamily: "'Courier New', monospace",
    color: "#D49A56",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: 2,
  },
  title: {
    color: "#F1DFC2",
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "clamp(40px, 7vw, 68px)",
    fontWeight: 700,
    margin: "18px 0 20px",
    lineHeight: 1.05,
  },
  description: {
    fontSize: 19,
    color: "#BFB2A1",
    lineHeight: 1.7,
    margin: 0,
  },
  archiveInfo: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 16,
    marginTop: 48,
  },
  card: {
    padding: "20px 22px",
    backgroundColor: "rgba(48, 39, 32, 0.72)",
    border: "1px solid #493A2D",
    borderRadius: 12,
  },
  cardLabel: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    color: "#B7623D",
    fontWeight: 700,
    letterSpacing: 1.5,
    margin: 0,
  },
  cardValue: {
    fontSize: 16,
    margin: "6px 0 0",
  },
  entries: {
    display: "grid",
    gap: 28,
    marginTop: 64,
  },
  count: {
    fontFamily: "'Courier New', monospace",
    fontSize: 14,
    color: "#D49A56",
    marginTop: 48,
  },
  footer: {
    marginTop: 64,
    paddingTop: 24,
    borderTop: "1px solid #493A2D",
    fontSize: 13,
    color: "#88796A",
  },
};

export default function Home() {
  return (
    <main style={styles.wrap}>
      <header style={styles.hero}>
        <p style={styles.kicker}>KHMER LIVING ARCHIVE</p>
        <h1 style={styles.title}>{collection.name}</h1>
        <p style={styles.description}>{collection.description}</p>
      </header>

      <div style={styles.archiveInfo}>
        <div style={styles.card}>
          <p style={styles.cardLabel}>CURATED BY</p>
          <p style={styles.cardValue}>{collection.curator}</p>
        </div>
        <div style={styles.card}>
          <p style={styles.cardLabel}>SOURCE</p>
          <p style={styles.cardValue}>{collection.source}</p>
        </div>
      </div>

      <section style={styles.entries} aria-label="Archive entries">
        {entries.map((entry) => (
          <EntryCard key={entry.title} {...entry} />
        ))}
      </section>

      <p style={styles.count}>entries in the archive: {entries.length}</p>

      <footer style={styles.footer}>
        Built in ICT 340 — Vibe Coding, American University of Phnom Penh, Fall
        2026. This archive is under construction all semester. Come back in
        December.
      </footer>
    </main>
  );
}
