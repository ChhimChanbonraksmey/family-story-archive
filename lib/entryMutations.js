import { inspectPhoto, isOwnedPhotoPath } from "./entryValidation.js";

export const CHANGE_NOT_SAVED = "That change wasn't saved";

async function removePath(supabase, path) {
  if (!path) return;
  const { error } = await supabase.storage.from("photos").remove([path]);
  if (error) console.error("Photo cleanup failed", error);
}

function ownedPhotoPath(photoUrl, userId) {
  const marker = "/storage/v1/object/public/photos/";
  try {
    const pathname = decodeURIComponent(new URL(photoUrl).pathname);
    const path = pathname.includes(marker) ? pathname.split(marker)[1] : "";
    return isOwnedPhotoPath(path, userId) ? path : "";
  } catch {
    return "";
  }
}

async function sessionUser(supabase, action, entryId) {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    console.error(`${action} session check failed`, error || { entryId });
    return null;
  }
  return data.user;
}

export async function updateOwnedEntry(supabase, entry, values, photo) {
  const user = await sessionUser(supabase, "Entry update", entry.id);
  if (!user) return { message: CHANGE_NOT_SAVED };

  let upload = null;
  if (photo?.size) {
    const checked = await inspectPhoto(photo);
    if (checked.error) return { fieldErrors: { photo: checked.error } };
    const path = `${user.id}/${crypto.randomUUID()}.${checked.extension}`;
    const { error } = await supabase.storage.from("photos").upload(path, photo, {
      cacheControl: "3600", contentType: checked.mime, upsert: false,
    });
    if (error) {
      console.error("Replacement photo upload failed", error);
      return { message: "The photo could not be uploaded. Try a different image." };
    }
    const { data } = supabase.storage.from("photos").getPublicUrl(path);
    upload = { path, publicUrl: data.publicUrl };
  }

  const changes = {
    title: values.title, description: values.description,
    contributor_name: values.contributor_name, place: values.place,
    photo_alt: values.photo_alt, photo_type: values.photo_type,
    ...(upload ? { photo_url: upload.publicUrl } : {}),
  };
  const { data, error } = await supabase.from("entries").update(changes)
    .eq("id", entry.id).eq("owner", user.id).select();

  if (error || !data?.length) {
    console.error(error ? "Entry update failed" : "Entry update returned no row", error || { entryId: entry.id });
    await removePath(supabase, upload?.path);
    return { message: CHANGE_NOT_SAVED };
  }
  if (upload) await removePath(supabase, ownedPhotoPath(entry.photo_url, user.id));
  return { id: data[0].id };
}

export async function deleteOwnedEntry(supabase, entryId, photoUrl) {
  const user = await sessionUser(supabase, "Entry delete", entryId);
  if (!user) return { message: CHANGE_NOT_SAVED };
  const { data, error } = await supabase.from("entries").delete()
    .eq("id", entryId).eq("owner", user.id).select();
  if (error || !data?.length) {
    console.error(error ? "Entry delete failed" : "Entry delete returned no row", error || { entryId });
    return { message: CHANGE_NOT_SAVED };
  }
  await removePath(supabase, ownedPhotoPath(photoUrl, user.id));
  return { id: data[0].id };
}
