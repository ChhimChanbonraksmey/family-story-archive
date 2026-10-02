import Link from "next/link";
import ContributionForm from "../../components/ContributionForm.js";
import styles from "../../components/contributeStyles.js";
import { createClient } from "../../lib/supabase/server.js";

export default async function ContributePage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error && error.name !== "AuthSessionMissingError") {
    console.error("Contribution page session check failed", error);
  }
  const user = error ? null : data.user;

  return (
    <main style={styles.main}>
      <Link href="/" style={styles.back}>← Back to archive</Link>
      <section style={styles.panel} aria-labelledby="contribute-title">
        <p style={styles.kicker}>CONTRIBUTE A STORY</p>
        <h1 id="contribute-title" style={styles.title}>Add to the family archive</h1>
        {user ? (
          <>
            <p style={styles.intro}>
              Preserve an oral-history entry in Khmer, English, or both. Every field is reviewed
              before the story and its image are saved.
            </p>
            <ContributionForm />
          </>
        ) : (
          <>
            <p style={styles.intro}>
              Please log in before contributing a family story.
              <span lang="km" style={{ display: "block" }}>
                សូមចូលគណនី មុននឹងបន្ថែមរឿងរ៉ាវគ្រួសារ។
              </span>
            </p>
            <Link href="/login" style={styles.login}>Log in to contribute</Link>
          </>
        )}
      </section>
    </main>
  );
}
