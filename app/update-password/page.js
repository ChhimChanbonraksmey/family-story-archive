import Link from "next/link";
import { redirect } from "next/navigation";
import UpdatePasswordForm from "../../components/UpdatePasswordForm.js";
import styles from "../../components/authStyles.js";
import { createClient } from "../../lib/supabase/server.js";

export default async function UpdatePasswordPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error && error.name !== "AuthSessionMissingError") {
    console.error("Password recovery session check failed", error);
    return (
      <main style={styles.main}>
        <section style={styles.panel} aria-labelledby="recovery-error-title">
          <p style={styles.kicker}>ACCOUNT RECOVERY</p>
          <h1 id="recovery-error-title" style={styles.title}>Recovery is temporarily unavailable</h1>
          <p role="alert" style={styles.intro}>
            We could not check your recovery session. Please try your email link again shortly.
            <span lang="km" style={{ display: "block" }}>
              យើងមិនអាចពិនិត្យសម័យសង្គ្រោះគណនីរបស់អ្នកបានទេ។ សូមសាកល្បងតំណក្នុងអ៊ីមែលម្តងទៀតបន្តិចទៀត។
            </span>
          </p>
          <Link href="/forgot-password" style={styles.link}>Request another recovery link</Link>
        </section>
      </main>
    );
  }
  if (!data.user) redirect("/forgot-password?recovery=failed");
  return <UpdatePasswordForm />;
}
