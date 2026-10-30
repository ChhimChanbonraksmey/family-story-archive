"use client";

import { useState } from "react";
import { createClient } from "../lib/supabase/client.js";
import { PHOTO_TYPE_LABELS } from "../lib/entryValidation.js";
import styles from "./reviewStyles.js";

export default function ReviewQueue({ initialEntries }) {
  const [entries, setEntries] = useState(initialEntries);
  const [busyId, setBusyId] = useState("");
  const [failedId, setFailedId] = useState("");

  async function decide(entryId, decision) {
    setBusyId(entryId);
    setFailedId("");

    try {
      const { data, error } = await createClient().rpc("review_entry", {
        entry_id: entryId,
        decision,
      });

      if (error || data !== true) {
        console.error("Review decision failed", { entryId, decision, error, data });
        setFailedId(entryId);
        return;
      }

      setEntries((current) => current.filter((entry) => entry.id !== entryId));
    } catch (error) {
      console.error("Review decision request failed", { entryId, decision, error });
      setFailedId(entryId);
    } finally {
      setBusyId("");
    }
  }

  if (entries.length === 0) {
    return (
      <div role="status" style={styles.empty}>
        <p style={styles.emptyText}>No entries are awaiting review.</p>
        <p lang="km" style={styles.emptyKhmer}>
          មិនមានរឿងណាកំពុងរង់ចាំការពិនិត្យទេ។
        </p>
      </div>
    );
  }

  return (
    <div style={styles.list}>
      {entries.map((entry) => {
        const busy = busyId === entry.id;
        return (
          <article key={entry.id} style={styles.entry}>
            <h2 style={styles.title}>{entry.title}</h2>
            <img src={entry.photo_url} alt={entry.photo_alt} style={styles.photo} />
            <p style={styles.label}>
              Image type / <span lang="km" style={styles.labelKhmer}>ប្រភេទរូបភាព</span>
            </p>
            <p style={styles.value}>{PHOTO_TYPE_LABELS[entry.photo_type] || entry.photo_type}</p>
            <p style={styles.label}>
              Image description / <span lang="km" style={styles.labelKhmer}>ការពិពណ៌នារូបភាព</span>
            </p>
            <p style={styles.value}>{entry.photo_alt}</p>
            <p style={styles.label}>
              Oral-history story / <span lang="km" style={styles.labelKhmer}>រឿងរ៉ាវប្រវត្តិផ្ទាល់មាត់</span>
            </p>
            <p style={styles.story}>{entry.description}</p>
            <p style={styles.label}>
              Story source / <span lang="km" style={styles.labelKhmer}>ប្រភពរឿងរ៉ាវ</span>
            </p>
            <p style={styles.value}>{entry.contributor_name}</p>
            <p style={styles.label}>
              Place / <span lang="km" style={styles.labelKhmer}>ទីកន្លែង</span>
            </p>
            <p style={styles.value}>{entry.place}</p>
            <p style={styles.label}>
              Submitted / <span lang="km" style={styles.labelKhmer}>បានដាក់ស្នើ</span>
            </p>
            <p style={styles.value}>{entry.submittedLabel}</p>
            <div style={styles.actions}>
              <button type="button" disabled={busy} onClick={() => decide(entry.id, "published")}
                style={{ ...styles.button, ...styles.publish, ...(busy ? styles.disabled : {}) }}>
                Publish / <span lang="km">បោះពុម្ពផ្សាយ</span>
              </button>
              <button type="button" disabled={busy} onClick={() => decide(entry.id, "returned")}
                style={{ ...styles.button, ...styles.return, ...(busy ? styles.disabled : {}) }}>
                Return for changes / <span lang="km">ផ្ញើត្រឡប់ឱ្យកែសម្រួល</span>
              </button>
            </div>
            {failedId === entry.id ? (
              <p role="alert" style={styles.error}>
                We could not save that review decision. Please try again.<br />
                <span lang="km">មិនអាចរក្សាទុកការសម្រេចចិត្តពិនិត្យនេះបានទេ។ សូមព្យាយាមម្តងទៀត។</span>
              </p>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
