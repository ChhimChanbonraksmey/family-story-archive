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
  const accountUnavailable = Boolean(error && error.name !== "AuthSessionMissingError");
  const user = error ? null : data.user;

  return (
    <main style={styles.main}>
      <Link href="/" style={styles.back}>← Back to archive</Link>
      <section style={styles.panel} aria-labelledby="contribute-title">
        <p style={styles.kicker}>CONTRIBUTE A STORY</p>
        <h1 id="contribute-title" style={styles.title}>Add to the family archive</h1>
        {accountUnavailable ? (
          <>
            <p role="alert" style={styles.intro}>
              We could not check your account right now. Your session may still be active.
              Please try again shortly.
              <span lang="km" style={styles.khmer}>
                យើងមិនអាចពិនិត្យគណនីរបស់អ្នកបាននៅពេលនេះទេ។ សម័យចូលគណនីរបស់អ្នក
                អាចនៅតែសកម្ម។ សូមសាកល្បងម្តងទៀតបន្តិចទៀត។
              </span>
            </p>
            <a href="/contribute" style={styles.login}>Try again</a>
          </>
        ) : user ? (
          <>
            <p style={styles.intro}>
              Preserve an oral-history entry in Khmer, English, or both. Every field is reviewed
              before the story and its image are saved.
              <span lang="km" style={styles.khmer}>
                អ្នកអាចរក្សាទុករឿងរ៉ាវប្រវត្តិផ្ទាល់មាត់ជាភាសាខ្មែរ អង់គ្លេស ឬទាំងពីរ។
                ព័ត៌មាននីមួយៗ និងរូបភាពនឹងត្រូវបានពិនិត្យមុនពេលរក្សាទុក។
              </span>
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
