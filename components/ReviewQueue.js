"use client";

import { useState } from "react";
import { createClient } from "../lib/supabase/client.js";
import { PHOTO_TYPE_LABELS } from "../lib/entryValidation.js";
import ClearableInput from "./ClearableInput.js";
import styles from "./reviewStyles.js";
import interactive from "./interactive.module.css";

export default function ReviewQueue({ initialEntries }) {
  const [entries, setEntries] = useState(initialEntries);
  const [busyId, setBusyId] = useState("");
  const [failedId, setFailedId] = useState("");
  const [returningId, setReturningId] = useState("");
  const [noteDrafts, setNoteDrafts] = useState({});
  const [noteErrorId, setNoteErrorId] = useState("");

  async function decide(entryId, decision, note = null) {
    setBusyId(entryId);
    setFailedId("");

    try {
      const { data, error } = await createClient().rpc("review_entry", {
        entry_id: entryId,
        decision,
        note: decision === "returned" ? note : null,
      });

      if (error || data !== true) {
        console.error("Review decision failed", { entryId, decision, error, data });
        setFailedId(entryId);
        return;
      }

      setEntries((current) => current.filter((entry) => entry.id !== entryId));
      setReturningId("");
      setNoteDrafts((current) => {
        const next = { ...current };
        delete next[entryId];
        return next;
      });
    } catch (error) {
      console.error("Review decision request failed", { entryId, decision, error });
      setFailedId(entryId);
    } finally {
      setBusyId("");
    }
  }

  function openReturnForm(entryId) {
    setReturningId(entryId);
    setNoteErrorId("");
    setFailedId("");
  }

  function cancelReturn() {
    setReturningId("");
    setNoteErrorId("");
  }

  function changeNote(entryId, value) {
    setNoteDrafts((current) => ({ ...current, [entryId]: value }));
    if (noteErrorId === entryId) setNoteErrorId("");
  }

  function confirmReturn(entryId) {
    const note = (noteDrafts[entryId] || "").trim();
    if (!note) {
      setNoteErrorId(entryId);
      return;
    }
    decide(entryId, "returned", note);
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
              <button className={interactive.reviewAction} type="button" disabled={busy} onClick={() => decide(entry.id, "published")}
                style={{ ...styles.button, ...styles.publish, ...(busy ? styles.disabled : {}) }}>
                Publish / <span lang="km">បោះពុម្ពផ្សាយ</span>
              </button>
              <button className={interactive.reviewAction} type="button" disabled={busy} onClick={() => openReturnForm(entry.id)}
                style={{ ...styles.button, ...styles.return, ...(busy ? styles.disabled : {}) }}>
                Return for changes / <span lang="km">ផ្ញើត្រឡប់ឱ្យកែសម្រួល</span>
              </button>
            </div>
            {returningId === entry.id ? (
              <div style={styles.notePanel}>
                <label htmlFor={`review-note-${entry.id}`} style={styles.noteLabel}>
                  Reviewer’s note / <span lang="km" style={styles.noteLabelKhmer}>កំណត់សម្គាល់របស់អ្នកពិនិត្យ</span>
                </label>
                <p style={styles.noteHelp}>
                  Explain what the contributor should change before resubmitting.
                </p>
                <ClearableInput
                  as="textarea"
                  id={`review-note-${entry.id}`}
                  value={noteDrafts[entry.id] || ""}
                  onChange={(event) => changeNote(entry.id, event.target.value)}
                  onClear={() => changeNote(entry.id, "")}
                  clearLabel="Clear reviewer note / លុបកំណត់សម្គាល់របស់អ្នកពិនិត្យ"
                  maxLength={1000}
                  rows={5}
                  disabled={busy}
                  aria-describedby={`review-note-count-${entry.id}`}
                  style={styles.noteInput}
                />
                <p id={`review-note-count-${entry.id}`} style={styles.noteCount}>
                  {(noteDrafts[entry.id] || "").length}/1000
                </p>
                {noteErrorId === entry.id ? (
                  <p role="alert" style={styles.noteError}>
                    Please write a note before returning this entry.<br />
                    <span lang="km">សូមសរសេរកំណត់សម្គាល់ មុនពេលផ្ញើរឿងនេះត្រឡប់។</span>
                  </p>
                ) : null}
                <div style={styles.noteActions}>
                  <button
                    className={interactive.reviewAction}
                    type="button"
                    disabled={busy}
                    onClick={() => confirmReturn(entry.id)}
                    style={{ ...styles.button, ...styles.return, ...(busy ? styles.disabled : {}) }}
                  >
                    Confirm return / <span lang="km">បញ្ជាក់ការផ្ញើត្រឡប់</span>
                  </button>
                  <button
                    className={interactive.reviewAction}
                    type="button"
                    disabled={busy}
                    onClick={cancelReturn}
                    style={{ ...styles.button, ...styles.cancel, ...(busy ? styles.disabled : {}) }}
                  >
                    Cancel / <span lang="km">បោះបង់</span>
                  </button>
                </div>
              </div>
            ) : null}
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
