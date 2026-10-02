"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "../lib/supabase/client.js";
import { inspectPhoto, validateEntryFields } from "../lib/entryValidation.js";
import EntryFormFields from "./EntryFormFields.js";
import styles from "./contributeStyles.js";

const initialValues = {
  title: "",
  description: "",
  contributor_name: "",
  place: "",
  photo_alt: "",
  photo_type: "",
};

export default function ContributionForm() {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  async function removeUpload(supabase, path) {
    if (!path) return;
    const { error } = await supabase.storage.from("photos").remove([path]);
    if (error) console.error("Photo cleanup failed", error);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const photo = new FormData(form).get("photo");
    setBusy(true);
    setFeedback("");

    try {
      const checked = validateEntryFields(values);
      const photoCheck = await inspectPhoto(photo);
      const nextErrors = { ...checked.errors };
      if (photoCheck.error) nextErrors.photo = photoCheck.error;
      setValues(checked.values);
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length) return;

      const supabase = createClient();
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        if (userError) console.error("Session check failed", userError);
        setFeedback("Your session has ended. Log in and try again.");
        return;
      }

      const storagePath = `${userData.user.id}/${crypto.randomUUID()}.${photoCheck.extension}`;
      const { error: uploadError } = await supabase.storage.from("photos").upload(storagePath, photo, {
        cacheControl: "3600",
        contentType: photoCheck.mime,
        upsert: false,
      });
      if (uploadError) {
        console.error("Photo upload failed", uploadError);
        setFeedback("The photo could not be uploaded. Try a different image.");
        return;
      }

      try {
        const response = await fetch("/api/entries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...checked.values, storagePath }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
          console.error("Entry save failed", { status: response.status, code: result.code });
          await removeUpload(supabase, storagePath);
          setErrors(result.fieldErrors || {});
          setFeedback(result.message || "The story could not be saved. Please try again.");
          return;
        }
        router.push(`/entries/${result.id}`);
        router.refresh();
      } catch (error) {
        console.error("Entry request failed", error);
        await removeUpload(supabase, storagePath);
        setFeedback("The story could not be saved. Check your connection and try again.");
      }
    } catch (error) {
      console.error("Contribution failed", error);
      setFeedback("The story could not be submitted. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <EntryFormFields
        values={values}
        errors={errors}
        disabled={busy}
        onChange={handleChange}
        onPhotoChange={() => setErrors((current) => ({ ...current, photo: undefined }))}
      />
      {feedback ? <p role="alert" style={styles.feedback}>{feedback}</p> : null}
      <button type="submit" disabled={busy}
        style={{ ...styles.button, ...(busy ? styles.buttonDisabled : {}) }}>
        {busy ? "Saving story…" : "Add story to the archive"}
      </button>
    </form>
  );
}
