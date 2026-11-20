const styles = {
  wrap: {
    display: "inline-flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", lineHeight: 1.25,
  },
  khmer: {
    fontFamily: "system-ui, sans-serif", fontSize: 14, fontWeight: 700,
  },
  english: { marginTop: 2, fontSize: 13, fontWeight: 700 },
};

export default function BilingualActionLabel({ english, khmer, khmerStyle, englishStyle }) {
  return (
    <span style={styles.wrap}>
      <span lang="km" style={{ ...styles.khmer, ...khmerStyle }}>{khmer}</span>
      <span style={{ ...styles.english, ...englishStyle }}>{english}</span>
    </span>
  );
}
