import {
  countVisibleCharacters, FIELD_LIMITS, PHOTO_TYPES, PHOTO_TYPE_LABELS,
} from "../lib/entryValidation.js";
import ClearableInput from "./ClearableInput.js";
import styles from "./contributeStyles.js";

function FieldLabel({ khmer, english }) {
  return (
    <>
      <span lang="km" style={styles.labelKhmer}>{khmer}</span>
      <span style={styles.labelEnglish}>{english}</span>
    </>
  );
}

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
      <label htmlFor="title_kh" style={styles.label}>
        <FieldLabel khmer="ចំណងជើងរឿងជាភាសាខ្មែរ" english="Khmer story title" />
      </label>
      <ClearableInput id="title_kh" name="title_kh" value={values.title_kh} onChange={onChange}
        onClear={() => onClear("title_kh")} clearLabel="Clear Khmer story title / លុបចំណងជើងរឿងជាភាសាខ្មែរ"
        disabled={disabled} lang="km" style={styles.input} {...accessibility("title_kh")} />
      {counter("title_kh")}
      <p style={styles.help}>
        <span lang="km" style={styles.khmer}>សូមសរសេរជាភាសាខ្មែរ។ ឈ្មោះ កាលបរិច្ឆេទ និងពាក្យជាក់លាក់អាចរក្សាទម្រង់ដើមបាន។</span>
        <span style={styles.helpEnglish}>Write this in Khmer. Names, dates, and specific terms can stay in their original form.</span>
      </p>
      {error("title_kh")}

      <label htmlFor="title" style={styles.label}>
        <FieldLabel khmer="ចំណងជើងរឿងជាភាសាអង់គ្លេស" english="English story title" />
      </label>
      <ClearableInput id="title" name="title" value={values.title} onChange={onChange}
        onClear={() => onClear("title")} clearLabel="Clear English story title / លុបចំណងជើងរឿងជាភាសាអង់គ្លេស"
        disabled={disabled} style={styles.input} {...accessibility("title")} />
      {counter("title")}
      {error("title")}

      <label htmlFor="description_kh" style={styles.label}>
        <FieldLabel khmer="រឿងរ៉ាវប្រវត្តិផ្ទាល់មាត់ជាភាសាខ្មែរ" english="Khmer oral-history story" />
      </label>
      <ClearableInput as="textarea" id="description_kh" name="description_kh" value={values.description_kh}
        onClear={() => onClear("description_kh")} clearLabel="Clear Khmer oral-history story / លុបរឿងរ៉ាវជាភាសាខ្មែរ"
        onChange={onChange} disabled={disabled} lang="km"
        style={{ ...styles.input, ...styles.textarea, ...styles.story }}
        {...accessibility("description_kh")} />
      {counter("description_kh")}
      <p style={styles.help}>
        <span lang="km" style={styles.khmer}>សូមសរសេរជាភាសាខ្មែរ។ ឈ្មោះ កាលបរិច្ឆេទ និងពាក្យជាក់លាក់អាចរក្សាទម្រង់ដើមបាន។</span>
        <span style={styles.helpEnglish}>Write this in Khmer. Names, dates, and specific terms can stay in their original form.</span>
      </p>
      {error("description_kh")}

      <label htmlFor="description" style={styles.label}>
        <FieldLabel khmer="រឿងរ៉ាវប្រវត្តិផ្ទាល់មាត់ជាភាសាអង់គ្លេស" english="English oral-history story" />
      </label>
      <ClearableInput as="textarea" id="description" name="description" value={values.description}
        onClear={() => onClear("description")} clearLabel="Clear English oral-history story / លុបរឿងរ៉ាវជាភាសាអង់គ្លេស"
        onChange={onChange} disabled={disabled} style={{ ...styles.input, ...styles.textarea, ...styles.story }}
        {...accessibility("description")} />
      {counter("description")}
      {error("description")}

      <label htmlFor="contributor_name" style={styles.label}>
        <FieldLabel khmer="អ្នកនិទាន ឬប្រភពពីគ្រួសារ" english="Narrator or family source" />
      </label>
      <ClearableInput id="contributor_name" name="contributor_name" value={values.contributor_name}
        onClear={() => onClear("contributor_name")} clearLabel="Clear narrator or family source / លុបអ្នកនិទាន ឬប្រភពពីគ្រួសារ"
        onChange={onChange} disabled={disabled} style={styles.input}
        {...accessibility("contributor_name")} />
      {counter("contributor_name")}
      {error("contributor_name")}

      <label htmlFor="place" style={styles.label}>
        <FieldLabel khmer="ទីកន្លែង" english="Place" />
      </label>
      <ClearableInput id="place" name="place" value={values.place} onChange={onChange}
        onClear={() => onClear("place")} clearLabel="Clear place / លុបទីកន្លែង"
        disabled={disabled} style={styles.input} {...accessibility("place")} />
      {counter("place")}
      <p style={styles.help}>An approximate location or “Unknown” is welcome when an exact place is uncertain.</p>
      {error("place")}

      <label htmlFor="photo_type" style={styles.label}>
        <FieldLabel khmer="ប្រភេទរូបភាព" english="Kind of image" />
      </label>
      <select id="photo_type" name="photo_type" value={values.photo_type}
        onChange={onChange} disabled={disabled} style={styles.input}
        {...accessibility("photo_type")}>
        <option value="">ជ្រើសរើសប្រភេទរូបភាព / Choose an image type</option>
        {PHOTO_TYPES.map((type) => <option key={type} value={type}>{PHOTO_TYPE_LABELS[type]}</option>)}
      </select>
      <p style={styles.help}>
        <span lang="km" style={{ ...styles.khmer, marginTop: 0 }}>
          រូបភាព និងរូបគំនូរដែលបង្កើតដោយ AI នឹងត្រូវបានដាក់ស្លាកឱ្យច្បាស់នៅក្នុងបណ្ណសារ។
        </span>
        <span style={styles.helpEnglish}>AI-generated images and illustrations will be clearly labeled in the archive.</span>
      </p>
      {error("photo_type")}

      <label htmlFor="photo" style={styles.label}>
        <FieldLabel khmer="រូបភាពសម្រាប់រឿង" english="Entry image" />
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
        <FieldLabel khmer="ការពិពណ៌នារូបភាព" english="Image description" />
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
