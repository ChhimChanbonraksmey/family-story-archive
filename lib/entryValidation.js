export const PHOTO_TYPES = [
  "family_photo",
  "place_photo",
  "illustration",
  "ai_illustration",
];

export const PHOTO_TYPE_LABELS = {
  family_photo: "រូបថតគ្រួសារ ឬរូបថតប្រវត្តិសាស្ត្រ / Family or historical photograph",
  place_photo: "រូបថតទីកន្លែងបច្ចុប្បន្ន / Present-day place photograph",
  illustration: "រូបគំនូរដើម / Original illustration",
  ai_illustration: "រូបគំនូរបង្កើតដោយ AI / AI-generated illustration",
};

export const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
const KHMER_SCRIPT = /[\u1780-\u17ff]/u;

export const FIELD_LIMITS = {
  title: 300,
  title_kh: 300,
  description: 20000,
  description_kh: 20000,
  contributor_name: 150,
  place: 200,
  photo_alt: 500,
};

export function countVisibleCharacters(value) {
  if (typeof Intl.Segmenter === "function") {
    return [...new Intl.Segmenter("km", { granularity: "grapheme" }).segment(value)].length;
  }
  return Array.from(value).length;
}

export function validateEntryFields(input) {
  const values = Object.fromEntries(
    ["title", "title_kh", "description", "description_kh", "contributor_name", "place", "photo_alt", "photo_type"]
      .map((name) => [name, String(input[name] || "").trim()]),
  );
  const errors = {};
  const missing = {
    title: "សូមបញ្ចូលចំណងជើងជាភាសាអង់គ្លេស។ / Add the English title.",
    title_kh: "សូមបញ្ចូលចំណងជើងជាភាសាខ្មែរ។ / Add the Khmer title.",
    description: "សូមបញ្ចូលរឿងរ៉ាវជាភាសាអង់គ្លេស។ / Add the English story.",
    description_kh: "សូមបញ្ចូលរឿងរ៉ាវជាភាសាខ្មែរ។ / Add the Khmer story.",
    contributor_name: "សូមបញ្ចូលឈ្មោះអ្នកនិទាន ឬប្រភព។ / Add the narrator or source name.",
    place: "សូមបញ្ចូលទីកន្លែង ទីតាំងប្រហាក់ប្រហែល ឬ «មិនស្គាល់»។ / Add a place, approximate location, or Unknown.",
    photo_alt: "សូមពិពណ៌នាអ្វីដែលមើលឃើញក្នុងរូបភាព។ / Describe what is visible in the image.",
  };

  Object.entries(FIELD_LIMITS).forEach(([name, limit]) => {
    if (!values[name]) errors[name] = missing[name];
    else if (countVisibleCharacters(values[name]) > limit) {
      errors[name] = `សូមកំណត់វាលនេះត្រឹម ${limit.toLocaleString()} តួអក្សរ ឬតិចជាងនេះ។ / Keep this field to ${limit.toLocaleString()} characters or fewer.`;
    }
  });
  if (values.title_kh && !KHMER_SCRIPT.test(values.title_kh)) {
    errors.title_kh = "សូមប្រើអក្សរខ្មែរក្នុងចំណងជើងជាភាសាខ្មែរ។ / Use Khmer script in the Khmer title.";
  }
  if (values.description_kh && !KHMER_SCRIPT.test(values.description_kh)) {
    errors.description_kh = "សូមប្រើអក្សរខ្មែរក្នុងរឿងរ៉ាវជាភាសាខ្មែរ។ / Use Khmer script in the Khmer story.";
  }
  if (!PHOTO_TYPES.includes(values.photo_type)) {
    errors.photo_type = "សូមជ្រើសរើសប្រភេទរូបភាព។ / Choose the kind of image.";
  }
  return { values, errors };
}

function detectedImage(bytes) {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { mime: "image/jpeg", extension: "jpg", allowedExtensions: ["jpg", "jpeg"] };
  }
  const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (png.every((byte, index) => bytes[index] === byte)) {
    return { mime: "image/png", extension: "png", allowedExtensions: ["png"] };
  }
  const text = String.fromCharCode(...bytes);
  if (text.slice(0, 4) === "RIFF" && text.slice(8, 12) === "WEBP") {
    return { mime: "image/webp", extension: "webp", allowedExtensions: ["webp"] };
  }
  return null;
}

export async function inspectPhoto(file, filename = file?.name || "") {
  const failure = "សូមជ្រើសរើសរូបភាព JPEG, PNG ឬ WebP ដែលមានទំហំក្រោម ៥ MB។ / Choose a JPEG, PNG, or WebP image under 5 MB.";
  if (!file || typeof file.arrayBuffer !== "function" || file.size < 1) return { error: failure };
  if (file.size > MAX_PHOTO_SIZE) return { error: failure };

  const extension = filename.split(".").pop()?.toLowerCase() || "";
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const detected = detectedImage(bytes);
  if (!detected || !detected.allowedExtensions.includes(extension) || file.type !== detected.mime) {
    return { error: failure };
  }
  return { ...detected, error: "" };
}

export function isOwnedPhotoPath(path, userId) {
  const filename = String(path || "").slice(String(userId || "").length + 1);
  return String(path || "").startsWith(`${userId}/`)
    && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(jpg|jpeg|png|webp)$/i.test(filename);
}

export function photoDisclosure(photoType, short = false) {
  if (photoType === "ai_illustration") {
    return short
      ? "រូបគំនូរបង្កើតដោយ AI / AI-GENERATED ILLUSTRATION"
      : "រូបគំនូរបង្កើតដោយ AI។ នេះមិនមែនជារូបថតប្រវត្តិសាស្ត្រទេ។ / AI-generated illustration. This is not a historical photograph.";
  }
  if (photoType === "illustration") {
    return short
      ? "រូបគំនូរ / ILLUSTRATION"
      : "រូបគំនូរ។ នេះមិនមែនជារូបថតប្រវត្តិសាស្ត្រទេ។ / Illustration. This is not a historical photograph.";
  }
  return "";
}
