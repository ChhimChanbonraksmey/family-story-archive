const reviewStyles = {
  list: { display: "grid", gap: 24 },
  empty: {
    padding: "28px 24px",
    backgroundColor: "#171411",
    border: "1px solid #493A2D",
    borderRadius: 10,
  },
  emptyText: { color: "#D8CCBC", lineHeight: 1.7, margin: "0 0 6px" },
  emptyKhmer: { color: "#BFB2A1", lineHeight: 1.8, margin: 0 },
  entry: { padding: 24, backgroundColor: "#171411", border: "1px solid #493A2D", borderRadius: 10 },
  title: { color: "#E7B86A", fontFamily: "Georgia, serif", fontSize: 28, margin: "0 0 16px" },
  photo: { display: "block", width: "100%", maxHeight: 520, objectFit: "contain", backgroundColor: "#0F0D0B", borderRadius: 8 },
  label: { color: "#D49A56", fontFamily: "'Courier New', monospace", fontSize: 14, fontWeight: 700, lineHeight: 1.6, letterSpacing: 0.7, margin: "22px 0 6px", textTransform: "uppercase" },
  labelKhmer: { fontFamily: "system-ui, sans-serif", fontWeight: 700, letterSpacing: 0, textTransform: "none" },
  value: { color: "#D8CCBC", lineHeight: 1.7, margin: 0 },
  story: { color: "#D8CCBC", lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap" },
  actions: { display: "flex", flexWrap: "wrap", gap: 12, marginTop: 24 },
  button: { minHeight: 44, padding: "0 18px", border: 0, borderRadius: 8, fontWeight: 700, cursor: "pointer" },
  publish: { color: "#171411", backgroundColor: "#C7D5B1" },
  return: { color: "#171411", backgroundColor: "#F2A69A" },
  disabled: { cursor: "wait", opacity: 0.6 },
  error: { color: "#F2A69A", lineHeight: 1.7, margin: "16px 0 0" },
};

export default reviewStyles;
