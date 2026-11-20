import Link from "next/link";
import BilingualActionLabel from "../../components/BilingualActionLabel.js";
import BilingualReturnLabel from "../../components/BilingualReturnLabel.js";
import ContributionForm from "../../components/ContributionForm.js";
import interactive from "../../components/interactive.module.css";
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
      <Link href="/" style={styles.back}>
        <BilingualReturnLabel khmer="ត្រឡប់ទៅបណ្ណសារ" english="Back to archive" />
      </Link>
      <section style={styles.panel} aria-labelledby="contribute-title">
        <p style={styles.kicker}>
          <span lang="km" style={styles.kickerKhmer}>ចូលរួមរឿងរ៉ាវ</span>
          <span style={styles.kickerEnglish}>CONTRIBUTE A STORY</span>
        </p>
        <h1 id="contribute-title" style={styles.title}>Add to the family archive</h1>
        {accountUnavailable ? (
          <>
            <p role="alert" style={styles.intro}>
              <span lang="km" style={styles.khmer}>
                យើងមិនអាចពិនិត្យគណនីរបស់អ្នកបាននៅពេលនេះទេ។ សម័យចូលគណនីរបស់អ្នក
                អាចនៅតែសកម្ម។ សូមសាកល្បងម្តងទៀតបន្តិចទៀត។
              </span>
              We could not check your account right now. Your session may still be active.
              Please try again shortly.
            </p>
            <a href="/contribute" className={interactive.primary} style={styles.login}>
              <BilingualActionLabel english="Try again" khmer="ព្យាយាមម្តងទៀត" />
            </a>
          </>
        ) : user ? (
          <>
            <p style={styles.intro}>
              <span lang="km" style={styles.introKhmer}>
                អ្នកអាចរក្សាទុករឿងរ៉ាវប្រវត្តិផ្ទាល់មាត់ជាភាសាខ្មែរ និងភាសាអង់គ្លេស។
                ព័ត៌មាននីមួយៗ និងរូបភាពនឹងត្រូវបានពិនិត្យមុនពេលរក្សាទុក។
              </span>
              <span style={styles.introEnglish}>
                Preserve an oral-history entry in both Khmer and English. Every field is reviewed
                before the story and its image are saved.
              </span>
            </p>
            <ContributionForm />
          </>
        ) : (
          <>
            <p style={styles.intro}>
              <span lang="km" style={{ display: "block" }}>
                សូមចូលគណនី មុននឹងបន្ថែមរឿងរ៉ាវគ្រួសារ។
              </span>
              Please log in before contributing a family story.
            </p>
            <Link href="/login" className={interactive.primary} style={styles.login}>
              <BilingualActionLabel english="Log in to contribute" khmer="ចូលគណនីដើម្បីចូលរួម" />
            </Link>
          </>
        )}
      </section>
    </main>
  );
}
