const styles = {
  wrap: {
    display: "inline-flex", alignItems: "baseline", flexWrap: "wrap",
    columnGap: 4, lineHeight: 1.45,
  },
  khmer: { fontFamily: "system-ui, sans-serif", fontSize: 15, fontWeight: 600 },
  english: { fontSize: 13, fontWeight: 600 },
};

export default function BilingualReturnLabel({ khmer, english, arrow = "left" }) {
  return (
    <span style={styles.wrap}>
      {arrow === "left" ? <span aria-hidden="true">{"\u2190"}</span> : null}
      <span lang="km" style={styles.khmer}>{khmer}</span>
      <span aria-hidden="true">/</span>
      <span style={styles.english}>{english}</span>
      {arrow === "right" ? <span aria-hidden="true">{"\u2192"}</span> : null}
    </span>
  );
}
