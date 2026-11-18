const styles = {
  wrap: {
    display: "inline-flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", lineHeight: 1.25,
  },
  khmer: {
    fontFamily: "system-ui, sans-serif", fontSize: 12, fontWeight: 700,
  },
};

export default function BilingualActionLabel({ english, khmer }) {
  return (
    <span style={styles.wrap}>
      <span>{english}</span>
      <span lang="km" style={styles.khmer}>{khmer}</span>
    </span>
  );
}
