const styles = {
  main: { maxWidth: 760, margin: "0 auto", padding: "72px 24px 80px" },
  back: { color: "#D49A56", textDecoration: "none", fontSize: 14 },
  panel: {
    marginTop: 28, padding: "clamp(24px, 5vw, 40px)",
    backgroundColor: "rgba(48, 39, 32, 0.72)", border: "1px solid #493A2D",
    borderTop: "4px solid #B7623D", borderRadius: 12,
  },
  kicker: {
    color: "#D49A56", fontFamily: "'Courier New', monospace",
    fontSize: 13, fontWeight: 700, letterSpacing: 2, margin: 0,
  },
  title: {
    color: "#F1DFC2", fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "clamp(36px, 7vw, 54px)", lineHeight: 1.1, margin: "14px 0",
  },
  intro: { color: "#BFB2A1", lineHeight: 1.7, marginBottom: 30 },
  label: { display: "block", color: "#F1DFC2", fontWeight: 700, margin: "22px 0 8px" },
  input: {
    boxSizing: "border-box", width: "100%", padding: 12, color: "#F1DFC2",
    backgroundColor: "#211C18", border: "1px solid #5C4938",
    borderRadius: 8, fontSize: 16, fontFamily: "inherit",
  },
  textarea: { minHeight: 130, resize: "vertical", lineHeight: 1.6 },
  story: { minHeight: 260 },
  help: { color: "#9F9182", fontSize: 13, lineHeight: 1.5, margin: "7px 0 0" },
  khmer: { display: "block", marginTop: 4, color: "#BFB2A1", fontSize: 14, fontWeight: 400, lineHeight: 1.6 },
  count: { color: "#9F9182", fontSize: 12, textAlign: "right", margin: "6px 0 0" },
  countError: { color: "#F2A69A", fontWeight: 700 },
  error: { color: "#F2A69A", fontSize: 14, lineHeight: 1.5, margin: "7px 0 0" },
  feedback: { color: "#F2A69A", lineHeight: 1.5, margin: "24px 0 0" },
  button: {
    width: "100%", marginTop: 28, padding: 14, color: "#171411",
    backgroundColor: "#E7B86A", border: 0, borderRadius: 8,
    fontSize: 16, fontWeight: 700, cursor: "pointer",
  },
  buttonDisabled: { cursor: "wait", opacity: 0.65 },
  login: {
    display: "inline-flex", alignItems: "center", minHeight: 44,
    marginTop: 12, padding: "0 16px", color: "#171411",
    backgroundColor: "#E7B86A", borderRadius: 8, textDecoration: "none", fontWeight: 700,
  },
};

export default styles;
