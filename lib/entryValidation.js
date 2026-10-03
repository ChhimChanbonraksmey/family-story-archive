export const PHOTO_TYPES = [
  "family_photo",
  "place_photo",
  "illustration",
  "ai_illustration",
];

export const PHOTO_TYPE_LABELS = {
  family_photo: "Family or historical photograph / រូបថតគ្រួសារ ឬរូបថតប្រវត្តិសាស្ត្រ",
  place_photo: "Present-day place photograph / រូបថតទីកន្លែងបច្ចុប្បន្ន",
  illustration: "Original illustration / រូបគំនូរដើម",
  ai_illustration: "AI-generated illustration / រូបគំនូរបង្កើតដោយ AI",
};

export const MAX_PHOTO_SIZE = 5 * 1024 * 1024;

const limits = {
  title: 300,
  description: 20000,
  contributor_name: 150,
  place: 200,
  photo_alt: 500,
};

function visibleLength(value) {
  if (typeof Intl.Segmenter === "function") {
    return [...new Intl.Segmenter("km", { granularity: "grapheme" }).segment(value)].length;
  }
  return Array.from(value).length;
}

export function validateEntryFields(input) {
  const values = Object.fromEntries(
    ["title", "description", "contributor_name", "place", "photo_alt", "photo_type"]
      .map((name) => [name, String(input[name] || "").trim()]),
  );
  const errors = {};
  const missing = {
    title: "Add a title. សូមបញ្ចូលចំណងជើង។",
    description: "Add the story. សូមបញ្ចូលរឿងរ៉ាវ។",
    contributor_name: "Add the narrator or source name. សូមបញ្ចូលឈ្មោះអ្នកនិទាន ឬប្រភព។",
    place: "Add a place, approximate location, or Unknown. សូមបញ្ចូលទីកន្លែង ទីតាំងប្រហាក់ប្រហែល ឬ «មិនស្គាល់»។",
    photo_alt: "Describe what is visible in the image. សូមពិពណ៌នាអ្វីដែលមើលឃើញក្នុងរូបភាព។",
  };

  Object.entries(limits).forEach(([name, limit]) => {
    if (!values[name]) errors[name] = missing[name];
    else if (visibleLength(values[name]) > limit) {
      errors[name] = `Keep this field to ${limit.toLocaleString()} characters or fewer. សូមកំណត់វាលនេះត្រឹម ${limit.toLocaleString()} តួអក្សរ ឬតិចជាងនេះ។`;
    }
  });
  if (!PHOTO_TYPES.includes(values.photo_type)) {
    errors.photo_type = "Choose the kind of image. សូមជ្រើសរើសប្រភេទរូបភាព។";
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
  const failure = "Choose a JPEG, PNG, or WebP image under 5 MB. សូមជ្រើសរើសរូបភាព JPEG, PNG ឬ WebP ដែលមានទំហំក្រោម ៥ MB។";
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
    return short ? "AI-GENERATED ILLUSTRATION" : "AI-generated illustration. This is not a historical photograph.";
  }
  if (photoType === "illustration") {
    return short ? "ILLUSTRATION" : "Illustration. This is not a historical photograph.";
  }
  return "";
}
