import Link from "next/link";
import { redirect } from "next/navigation";
import BilingualActionLabel from "../../components/BilingualActionLabel.js";
import UpdatePasswordForm from "../../components/UpdatePasswordForm.js";
import styles from "../../components/authStyles.js";
import interactive from "../../components/interactive.module.css";
import { createClient } from "../../lib/supabase/server.js";

export default async function UpdatePasswordPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error && error.name !== "AuthSessionMissingError") {
    console.error("Password recovery session check failed", error);
    return (
      <main style={styles.main}>
        <section style={styles.panel} aria-labelledby="recovery-error-title">
          <p style={styles.kicker}>
            <span lang="km" style={styles.kickerKhmer}>ការសង្គ្រោះគណនី</span>
            <span style={styles.kickerEnglish}>ACCOUNT RECOVERY</span>
          </p>
          <h1 id="recovery-error-title" style={styles.title}>
            <span lang="km" style={styles.titleKhmer}>មិនអាចសង្គ្រោះគណនីបានជាបណ្តោះអាសន្ន</span>
            <span style={styles.titleEnglish}>Recovery is temporarily unavailable</span>
          </h1>
          <p role="alert" style={styles.intro}>
            <span lang="km" style={styles.introKhmer}>
              យើងមិនអាចពិនិត្យសម័យសង្គ្រោះគណនីរបស់អ្នកបានទេ។ សូមសាកល្បងតំណក្នុងអ៊ីមែលម្តងទៀតបន្តិចទៀត។
            </span>
            <span style={styles.introEnglish}>
              We could not check your recovery session. Please try your email link again shortly.
            </span>
          </p>
          <Link href="/forgot-password" className={interactive.textHighlight} style={styles.link}>
            <BilingualActionLabel
              english="Request another recovery link"
              khmer="ស្នើសុំតំណសង្គ្រោះមួយទៀត"
            />
          </Link>
        </section>
      </main>
    );
  }
  if (!data.user) redirect("/forgot-password?recovery=failed");
  return <UpdatePasswordForm />;
}
