import {
  countVisibleCharacters, FIELD_LIMITS, PHOTO_TYPES, PHOTO_TYPE_LABELS,
} from "../lib/entryValidation.js";
import ClearableInput from "./ClearableInput.js";
import styles from "./contributeStyles.js";

export default function EntryFormFields({
  values, errors, disabled, onChange, onClear, onPhotoChange, photoRequired = true,
}) {
  const accessibility = (name) => {
    const describedBy = [
      FIELD_LIMITS[name] ? `${name}-count` : "",
      errors[name] ? `${name}-error` : "",
    ].filter(Boolean).join(" ");
    return {
      "aria-invalid": Boolean(errors[name]),
      "aria-describedby": describedBy || undefined,
    };
  };
  const error = (name) => errors[name]
    ? <p id={`${name}-error`} role="alert" style={styles.error}>{errors[name]}</p>
    : null;
  const counter = (name) => {
    const count = countVisibleCharacters(values[name] || "");
    const overLimit = count > FIELD_LIMITS[name];
    return (
      <p id={`${name}-count`} style={{ ...styles.count, ...(overLimit ? styles.countError : {}) }}>
        {count.toLocaleString()} / {FIELD_LIMITS[name].toLocaleString()}
      </p>
    );
  };

  return (
    <>
      <label htmlFor="title" style={styles.label}>
        Story title / <span lang="km">ចំណងជើងរឿង</span>
      </label>
      <ClearableInput id="title" name="title" value={values.title} onChange={onChange}
        onClear={() => onClear("title")} clearLabel="Clear story title / លុបចំណងជើងរឿង"
        disabled={disabled} style={styles.input} {...accessibility("title")} />
      {counter("title")}
      {error("title")}

      <label htmlFor="description" style={styles.label}>
        Oral-history story / <span lang="km">រឿងរ៉ាវប្រវត្តិផ្ទាល់មាត់</span>
      </label>
      <ClearableInput as="textarea" id="description" name="description" value={values.description}
        onClear={() => onClear("description")} clearLabel="Clear oral-history story / លុបរឿងរ៉ាវប្រវត្តិផ្ទាល់មាត់"
        onChange={onChange} disabled={disabled} style={{ ...styles.input, ...styles.textarea, ...styles.story }}
        {...accessibility("description")} />
      {counter("description")}
      {error("description")}

      <label htmlFor="contributor_name" style={styles.label}>
        Narrator or family source / <span lang="km">អ្នកនិទាន ឬប្រភពពីគ្រួសារ</span>
      </label>
      <ClearableInput id="contributor_name" name="contributor_name" value={values.contributor_name}
        onClear={() => onClear("contributor_name")} clearLabel="Clear narrator or family source / លុបអ្នកនិទាន ឬប្រភពពីគ្រួសារ"
        onChange={onChange} disabled={disabled} style={styles.input}
        {...accessibility("contributor_name")} />
      {counter("contributor_name")}
      {error("contributor_name")}

      <label htmlFor="place" style={styles.label}>
        Place / <span lang="km">ទីកន្លែង</span>
      </label>
      <ClearableInput id="place" name="place" value={values.place} onChange={onChange}
        onClear={() => onClear("place")} clearLabel="Clear place / លុបទីកន្លែង"
        disabled={disabled} style={styles.input} {...accessibility("place")} />
      {counter("place")}
      <p style={styles.help}>An approximate location or “Unknown” is welcome when an exact place is uncertain.</p>
      {error("place")}

      <label htmlFor="photo_type" style={styles.label}>
        Kind of image / <span lang="km">ប្រភេទរូបភាព</span>
      </label>
      <select id="photo_type" name="photo_type" value={values.photo_type}
        onChange={onChange} disabled={disabled} style={styles.input}
        {...accessibility("photo_type")}>
        <option value="">Choose an image type</option>
        {PHOTO_TYPES.map((type) => <option key={type} value={type}>{PHOTO_TYPE_LABELS[type]}</option>)}
      </select>
      <p style={styles.help}>AI-generated images and illustrations will be clearly labeled in the archive.</p>
      {error("photo_type")}

      <label htmlFor="photo" style={styles.label}>
        Entry image / <span lang="km">រូបភាពសម្រាប់រឿង</span>
      </label>
      <input id="photo" name="photo" type="file" required={photoRequired} disabled={disabled}
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        onChange={onPhotoChange} style={styles.input} {...accessibility("photo")} />
      <p style={styles.help}>
        {photoRequired
          ? "JPEG, PNG, or WebP; maximum 5 MB. Landscape 3:2, around 1200 × 800, fits best, but portrait images are accepted. Only upload an image you may publish."
          : "Optional: leave this empty to keep the current image. Landscape 3:2, around 1200 × 800, fits best, but portrait images are accepted; maximum 5 MB."}
      </p>
      {error("photo")}

      <label htmlFor="photo_alt" style={styles.label}>
        Image description / <span lang="km">ការពិពណ៌នារូបភាព</span>
      </label>
      <ClearableInput as="textarea" id="photo_alt" name="photo_alt" value={values.photo_alt}
        onClear={() => onClear("photo_alt")} clearLabel="Clear image description / លុបការពិពណ៌នារូបភាព"
        onChange={onChange} disabled={disabled} style={{ ...styles.input, ...styles.textarea }}
        {...accessibility("photo_alt")} />
      {counter("photo_alt")}
      <p style={styles.help}>Briefly describe the meaningful visible content for screen-reader visitors.</p>
      {error("photo_alt")}
    </>
  );
}
