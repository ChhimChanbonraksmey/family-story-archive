"use client";

import { useState } from "react";
import { createClient } from "../lib/supabase/client.js";
import { PHOTO_TYPE_LABELS } from "../lib/entryValidation.js";
import ClearableInput from "./ClearableInput.js";
import BilingualActionLabel from "./BilingualActionLabel.js";
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
            <p style={styles.languageLabel}>ខ្មែរ</p>
            <h2 lang="km" style={styles.titleKh}>{entry.title_kh}</h2>
            <p style={{ ...styles.languageLabel, ...styles.englishDivider }}>ENGLISH</p>
            <p style={styles.titleEn}>{entry.title}</p>
            <img src={entry.photo_url} alt={entry.photo_alt} style={styles.photo} />
            <p style={styles.label}>
              <span lang="km" style={styles.labelKhmer}>ប្រភេទរូបភាព</span>
              <span style={styles.labelEnglish}>IMAGE TYPE</span>
            </p>
            <p style={styles.value}>{PHOTO_TYPE_LABELS[entry.photo_type] || entry.photo_type}</p>
            <p style={styles.label}>
              <span lang="km" style={styles.labelKhmer}>ការពិពណ៌នារូបភាព</span>
              <span style={styles.labelEnglish}>IMAGE DESCRIPTION</span>
            </p>
            <p style={styles.value}>{entry.photo_alt}</p>
            <p style={styles.label}>
              <span lang="km" style={styles.labelKhmer}>រឿងរ៉ាវប្រវត្តិផ្ទាល់មាត់ជាភាសាខ្មែរ</span>
              <span style={styles.labelEnglish}>KHMER ORAL-HISTORY STORY</span>
            </p>
            <p lang="km" style={styles.story}>{entry.description_kh}</p>
            <p style={{ ...styles.label, ...styles.storyDivider }}>
              <span lang="km" style={styles.labelKhmer}>រឿងរ៉ាវប្រវត្តិផ្ទាល់មាត់ជាភាសាអង់គ្លេស</span>
              <span style={styles.labelEnglish}>ENGLISH ORAL-HISTORY STORY</span>
            </p>
            <p style={styles.story}>{entry.description}</p>
            <p style={styles.label}>
              <span lang="km" style={styles.labelKhmer}>ប្រភពរឿងរ៉ាវ</span>
              <span style={styles.labelEnglish}>STORY SOURCE</span>
            </p>
            <p style={styles.value}>{entry.contributor_name}</p>
            <p style={styles.label}>
              <span lang="km" style={styles.labelKhmer}>ទីកន្លែង</span>
              <span style={styles.labelEnglish}>PLACE</span>
            </p>
            <p style={styles.value}>{entry.place}</p>
            <p style={styles.label}>
              <span lang="km" style={styles.labelKhmer}>បានដាក់ស្នើ</span>
              <span style={styles.labelEnglish}>SUBMITTED</span>
            </p>
            <p style={styles.value}>{entry.submittedLabel}</p>
            <div style={styles.actions}>
              <button className={interactive.reviewAction} type="button" disabled={busy} onClick={() => decide(entry.id, "published")}
                style={{ ...styles.button, ...styles.publish, ...(busy ? styles.disabled : {}) }}>
                <BilingualActionLabel english="Publish" khmer="បោះពុម្ពផ្សាយ" />
              </button>
              <button className={interactive.reviewAction} type="button" disabled={busy} onClick={() => openReturnForm(entry.id)}
                style={{ ...styles.button, ...styles.return, ...(busy ? styles.disabled : {}) }}>
                <BilingualActionLabel english="Return for changes" khmer="ផ្ញើត្រឡប់ឱ្យកែសម្រួល" />
              </button>
            </div>
            {returningId === entry.id ? (
              <div style={styles.notePanel}>
                <label htmlFor={`review-note-${entry.id}`} style={styles.noteLabel}>
                  <span lang="km" style={styles.noteLabelKhmer}>កំណត់សម្គាល់របស់អ្នកពិនិត្យ</span>
                  <span style={styles.noteLabelEnglish}>Reviewer’s note</span>
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
                    style={{ ...styles.button, ...styles.confirmReturn, ...(busy ? styles.disabled : {}) }}
                  >
                    <BilingualActionLabel english="Confirm return" khmer="បញ្ជាក់ការផ្ញើត្រឡប់" />
                  </button>
                  <button
                    className={interactive.reviewAction}
                    type="button"
                    disabled={busy}
                    onClick={cancelReturn}
                    style={{ ...styles.button, ...styles.cancel, ...(busy ? styles.disabled : {}) }}
                  >
                    <BilingualActionLabel english="Cancel" khmer="បោះបង់" />
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
