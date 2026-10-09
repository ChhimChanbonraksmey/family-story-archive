"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "../lib/supabase/client.js";
import { updateOwnedEntry } from "../lib/entryMutations.js";
import { validateEntryFields } from "../lib/entryValidation.js";
import EntryFormFields from "./EntryFormFields.js";
import styles from "./contributeStyles.js";

export default function EditEntryForm({ entry }) {
  const router = useRouter();
  const [values, setValues] = useState({
    title: entry.title, description: entry.description,
    contributor_name: entry.contributor_name, place: entry.place,
    photo_alt: entry.photo_alt || "", photo_type: entry.photo_type || "",
  });
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState(false);

  function change(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  function clear(name) {
    setValues((current) => ({ ...current, [name]: "" }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setFeedback("");
    try {
      const checked = validateEntryFields(values);
      setValues(checked.values);
      setErrors(checked.errors);
      if (Object.keys(checked.errors).length) return;

      const photo = new FormData(event.currentTarget).get("photo");
      const result = await updateOwnedEntry(createClient(), entry, checked.values, photo);
      setErrors(result.fieldErrors || {});
      if (result.fieldErrors) return;
      if (result.message) {
        setFeedback(result.message);
        return;
      }
      if (!result.id) {
        console.error("Entry update returned no entry ID", { entryId: entry.id });
        setFeedback("That change wasn't saved");
        return;
      }
      router.push(`/entries/${result.id}`);
      router.refresh();
    } catch (error) {
      console.error("Entry update request failed", error);
      setFeedback("That change wasn't saved");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate>
      <EntryFormFields values={values} errors={errors} disabled={busy}
        onChange={change} onClear={clear} photoRequired={false}
        onPhotoChange={() => setErrors((current) => ({ ...current, photo: undefined }))} />
      {feedback ? <p role="alert" style={styles.feedback}>{feedback}</p> : null}
      <button type="submit" disabled={busy}
        style={{ ...styles.button, ...(busy ? styles.buttonDisabled : {}) }}>
        {busy ? "Saving changes…" : "Save changes"}
      </button>
    </form>
  );
}
