const styles = {
  main: { maxWidth: 760, margin: "0 auto", padding: "72px 24px 80px" },
  back: { color: "#D49A56", textDecoration: "none", fontSize: 14 },
  panel: {
    marginTop: 28, padding: "clamp(24px, 5vw, 40px)",
    backgroundColor: "rgba(48, 39, 32, 0.86)",
    backgroundImage: "linear-gradient(145deg, rgba(231, 184, 106, 0.05), transparent 42%), repeating-linear-gradient(90deg, rgba(231, 184, 106, 0.04) 0 2px, transparent 2px 11px, rgba(183, 98, 61, 0.03) 11px 13px, transparent 13px 22px), repeating-linear-gradient(0deg, rgba(231, 184, 106, 0.04) 0 2px, transparent 2px 11px, rgba(183, 98, 61, 0.03) 11px 13px, transparent 13px 22px)",
    border: "1px solid #5C4938", borderTop: "4px solid #B7623D", borderRadius: 14,
    boxShadow: "inset 0 0 0 1px rgba(231, 184, 106, 0.06), 0 24px 60px rgba(0, 0, 0, 0.22)",
  },
  kicker: {
    color: "#D49A56", fontFamily: "'Courier New', monospace",
    fontSize: 13, fontWeight: 700, letterSpacing: 2, margin: 0,
  },
  kickerKhmer: {
    display: "block", color: "#E7B86A", fontFamily: "system-ui, sans-serif",
    fontSize: 16, fontWeight: 400, letterSpacing: 0, lineHeight: 1.6,
    marginBottom: 5,
  },
  kickerEnglish: { display: "block" },
  title: {
    color: "#F1DFC2", fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "clamp(36px, 7vw, 54px)", lineHeight: 1.1, margin: "14px 0",
  },
  intro: { color: "#BFB2A1", lineHeight: 1.7, marginBottom: 30 },
  introKhmer: {
    display: "block", color: "#E0B97A", fontFamily: "system-ui, sans-serif",
    fontSize: 18, fontWeight: 400, lineHeight: 1.85,
  },
  introEnglish: {
    display: "block", marginTop: 13, paddingTop: 13,
    color: "#BFB2A1", borderTop: "1px solid #6A5140",
    fontSize: 14, lineHeight: 1.7,
  },
  label: { display: "block", color: "#F1DFC2", fontWeight: 700, margin: "22px 0 8px" },
  labelKhmerRow: { display: "flex", alignItems: "center", gap: 12 },
  labelKhmer: {
    color: "#E7B86A", fontFamily: "system-ui, sans-serif",
    fontSize: 15, fontWeight: 700, lineHeight: 1.55,
  },
  labelOrnament: { display: "flex", alignItems: "center", flex: 1, gap: 8, minWidth: 40 },
  labelDiamond: {
    width: 7, height: 7, flex: "0 0 auto",
    border: "1.5px solid #E7B86A", backgroundColor: "rgba(183, 98, 61, 0.14)",
    transform: "rotate(45deg)",
  },
  labelLine: {
    height: 1, flex: 1,
    background: "linear-gradient(90deg, #B7623D, rgba(231, 184, 106, 0.18), transparent)",
  },
  labelEnglish: { display: "block", marginTop: 4, color: "#BFB2A1", fontSize: 13, lineHeight: 1.45 },
  input: {
    boxSizing: "border-box", width: "100%", padding: 12, color: "#F1DFC2",
    backgroundColor: "rgba(33, 28, 24, 0.96)", border: "1px solid #6A5140",
    borderRadius: 8, fontSize: 16, fontFamily: "inherit",
    boxShadow: "inset 0 1px 8px rgba(0, 0, 0, 0.2)",
  },
  textarea: { minHeight: 130, resize: "vertical", lineHeight: 1.6 },
  story: { minHeight: 260 },
  help: { color: "#9F9182", fontSize: 13, lineHeight: 1.5, margin: "7px 0 0" },
  khmer: { display: "block", marginTop: 4, color: "#BFB2A1", fontSize: 14, fontWeight: 400, lineHeight: 1.6 },
  helpEnglish: { display: "block", marginTop: 4 },
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
  submitKhmer: { color: "#211C18", fontSize: 16, fontWeight: 700, lineHeight: 1.5 },
  login: {
    display: "inline-flex", alignItems: "center", minHeight: 44,
    marginTop: 12, padding: "0 16px", color: "#171411",
    backgroundColor: "#E7B86A", borderRadius: 8, textDecoration: "none", fontWeight: 700,
  },
};

export default styles;
