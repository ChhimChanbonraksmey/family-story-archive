import styles from "./authStyles.js";

export default function AuthFieldLabel({ khmer, english }) {
  return (
    <>
      <span style={styles.labelKhmerRow}>
        <span lang="km" style={styles.labelKhmer}>{khmer}</span>
        <span style={styles.labelOrnament} aria-hidden="true">
          <span style={styles.labelDiamond} />
          <span style={styles.labelLine} />
        </span>
      </span>
      <span style={styles.labelEnglish}>{english}</span>
    </>
  );
}
