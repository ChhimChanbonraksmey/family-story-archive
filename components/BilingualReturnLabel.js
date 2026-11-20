import styles from "./BilingualReturnLabel.module.css";

export default function BilingualReturnLabel({ khmer, english, arrow = "left" }) {
  return (
    <span className={styles.wrap}>
      {arrow === "left" ? <span className={styles.arrow} aria-hidden="true">{"<"}</span> : null}
      <span lang="km" className={styles.khmer}>{khmer}</span>
      <span className={styles.slash} aria-hidden="true">/</span>
      <span className={styles.english}>{english}</span>
      {arrow === "right" ? <span className={styles.arrow} aria-hidden="true">{">"}</span> : null}
    </span>
  );
}
