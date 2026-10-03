import Link from "next/link";
import { notFound } from "next/navigation";
import EditEntryForm from "../../../../components/EditEntryForm.js";
import styles from "../../../../components/contributeStyles.js";
import { createClient } from "../../../../lib/supabase/server.js";

export default async function EditEntryPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: entry, error } = await supabase.from("entries")
    .select("*").eq("id", id).maybeSingle();
  const { data: userData } = await supabase.auth.getUser();

  if (error || !entry || userData.user?.id !== entry.owner) {
    notFound();
  }

  return (
    <main style={styles.main}>
      <Link href={`/entries/${entry.id}`} style={styles.back}>← Back to story</Link>
      <section style={styles.panel} aria-labelledby="edit-title">
        <p style={styles.kicker}>EDIT ARCHIVE ENTRY</p>
        <h1 id="edit-title" style={styles.title}>Edit the family story</h1>
        <p style={styles.intro}>
          Update the story details below. Choose a new image only if you want to replace the current one.
          <span lang="km" style={styles.khmer}>
            កែសម្រួលព័ត៌មានរឿងរ៉ាវខាងក្រោម។ ជ្រើសរើសរូបភាពថ្មី លុះត្រាតែអ្នកចង់ជំនួសរូបភាពបច្ចុប្បន្ន។
          </span>
        </p>
        <EditEntryForm entry={entry} />
      </section>
    </main>
  );
}
