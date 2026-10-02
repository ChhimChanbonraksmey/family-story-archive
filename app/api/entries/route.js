import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server.js";
import {
  inspectPhoto,
  isOwnedPhotoPath,
  validateEntryFields,
} from "../../../lib/entryValidation.js";

const saveFailure = "The story could not be saved. Please try again.";

async function removePhoto(supabase, path) {
  const { error } = await supabase.storage.from("photos").remove([path]);
  if (error) console.error("Server photo cleanup failed", error);
}

export async function POST(request) {
  const requestOrigin = new URL(request.url).origin;
  if (request.headers.get("origin") !== requestOrigin) {
    return NextResponse.json({ message: saveFailure, code: "origin" }, { status: 403 });
  }

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    if (userError && userError.name !== "AuthSessionMissingError") {
      console.error("Entry API session check failed", userError);
    }
    return NextResponse.json(
      { message: "Your session has ended. Log in and try again.", code: "session" },
      { status: 401 },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch (error) {
    console.error("Entry request parsing failed", error);
    return NextResponse.json({ message: saveFailure, code: "request" }, { status: 400 });
  }

  const checked = validateEntryFields(body);
  if (Object.keys(checked.errors).length) {
    return NextResponse.json(
      { message: "Please fix the marked fields.", fieldErrors: checked.errors, code: "fields" },
      { status: 400 },
    );
  }

  const storagePath = String(body.storagePath || "");
  if (!isOwnedPhotoPath(storagePath, userData.user.id)) {
    return NextResponse.json(
      { message: "The photo could not be verified. Upload it again.", code: "path" },
      { status: 400 },
    );
  }

  const { data: photo, error: downloadError } = await supabase.storage.from("photos").download(storagePath);
  if (downloadError || !photo) {
    if (downloadError) console.error("Uploaded photo verification download failed", downloadError);
    await removePhoto(supabase, storagePath);
    return NextResponse.json(
      { message: "The photo could not be verified. Upload it again.", code: "download" },
      { status: 400 },
    );
  }

  const photoCheck = await inspectPhoto(photo, storagePath);
  if (photoCheck.error) {
    await removePhoto(supabase, storagePath);
    return NextResponse.json(
      { message: "Please fix the marked field.", fieldErrors: { photo: photoCheck.error }, code: "photo" },
      { status: 400 },
    );
  }

  const { data: publicData } = supabase.storage.from("photos").getPublicUrl(storagePath);
  const { data: entry, error: insertError } = await supabase.from("entries").insert({
    owner: userData.user.id,
    title: checked.values.title,
    description: checked.values.description,
    contributor_name: checked.values.contributor_name,
    place: checked.values.place,
    photo_url: publicData.publicUrl,
    photo_alt: checked.values.photo_alt,
    photo_type: checked.values.photo_type,
  }).select("id").single();

  if (insertError || !entry) {
    console.error("Entry database insert failed", insertError);
    await removePhoto(supabase, storagePath);
    return NextResponse.json({ message: saveFailure, code: "insert" }, { status: 500 });
  }

  return NextResponse.json({ id: entry.id }, { status: 201 });
}
