import { PHOTO_TYPES, PHOTO_TYPE_LABELS } from "../lib/entryValidation.js";
import styles from "./contributeStyles.js";

export default function EntryFormFields({ values, errors, disabled, onChange, onPhotoChange }) {
  const accessibility = (name) => ({
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });
  const error = (name) => errors[name]
    ? <p id={`${name}-error`} role="alert" style={styles.error}>{errors[name]}</p>
    : null;

  return (
    <>
      <label htmlFor="title" style={styles.label}>Story title</label>
      <input id="title" name="title" value={values.title} onChange={onChange}
        disabled={disabled} style={styles.input} {...accessibility("title")} />
      {error("title")}

      <label htmlFor="description" style={styles.label}>Oral-history story</label>
      <textarea id="description" name="description" value={values.description}
        onChange={onChange} disabled={disabled} style={{ ...styles.input, ...styles.textarea, ...styles.story }}
        {...accessibility("description")} />
      {error("description")}

      <label htmlFor="contributor_name" style={styles.label}>Narrator or family source</label>
      <input id="contributor_name" name="contributor_name" value={values.contributor_name}
        onChange={onChange} disabled={disabled} style={styles.input}
        {...accessibility("contributor_name")} />
      {error("contributor_name")}

      <label htmlFor="place" style={styles.label}>Place</label>
      <input id="place" name="place" value={values.place} onChange={onChange}
        disabled={disabled} style={styles.input} {...accessibility("place")} />
      <p style={styles.help}>An approximate location or “Unknown” is welcome when an exact place is uncertain.</p>
      {error("place")}

      <label htmlFor="photo_type" style={styles.label}>Kind of image</label>
      <select id="photo_type" name="photo_type" value={values.photo_type}
        onChange={onChange} disabled={disabled} style={styles.input}
        {...accessibility("photo_type")}>
        <option value="">Choose an image type</option>
        {PHOTO_TYPES.map((type) => <option key={type} value={type}>{PHOTO_TYPE_LABELS[type]}</option>)}
      </select>
      <p style={styles.help}>AI-generated images and illustrations will be clearly labeled in the archive.</p>
      {error("photo_type")}

      <label htmlFor="photo" style={styles.label}>Entry image</label>
      <input id="photo" name="photo" type="file" required disabled={disabled}
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        onChange={onPhotoChange} style={styles.input} {...accessibility("photo")} />
      <p style={styles.help}>JPEG, PNG, or WebP; maximum 5 MB. Only upload an image you may publish.</p>
      {error("photo")}

      <label htmlFor="photo_alt" style={styles.label}>Image description</label>
      <textarea id="photo_alt" name="photo_alt" value={values.photo_alt}
        onChange={onChange} disabled={disabled} style={{ ...styles.input, ...styles.textarea }}
        {...accessibility("photo_alt")} />
      <p style={styles.help}>Briefly describe the meaningful visible content for screen-reader visitors.</p>
      {error("photo_alt")}
    </>
  );
}
