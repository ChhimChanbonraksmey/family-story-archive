# Family Oral Histories from the Khmer Rouge and Post-Khmer Rouge Eras

Live archive URL: [https://family-story-archive.vercel.app](https://family-story-archive.vercel.app)

## 1. What this is

This is a public oral-history archive preserving personal stories that my parents, grandparents, and older relatives shared about life during and after the Khmer Rouge era. Visitors can browse and search published entries, while registered contributors can submit illustrated family stories for review. Contributors can manage their own entries, and approved reviewers decide whether each submission should be published or returned with an explanation.

## 2. Who it is for

The archive is intended for Cambodian families, younger generations, researchers, and other visitors who want to learn from personal memories that may not appear in formal historical records. It accepts and displays Khmer text without transliteration, and important contributor, status, validation, and review messages are presented in Khmer and English. To make the archive practical on phones and slower connections, I used a responsive layout, avoided extra interface packages, limited uploads to 5 MB, and tested the live site on an iPhone 15 Pro Max using Chrome on mobile data. Every image also requires alternative text and a label identifying whether it is an original photograph, an archival image, or an AI-generated illustration. Public entries use the label "Story source" so visitors can distinguish the relative who provided the memory from the account that uploaded it.

## 3. How it works

The application uses Next.js 15 and React 19 and is deployed on Vercel. Supabase provides authentication, the PostgreSQL database, and photo storage.

The main data and workflow are:

- `entries` stores each story, its owner, title, description, story source, place, photo information, creation date, review note, and status.
- `reviewers` stores the user IDs that are permitted to review submissions. Row-level security prevents ordinary API users from reading or changing this list.
- Entry statuses are `pending`, `published`, and `returned`.
- New contributions receive the database default status of `pending`.
- Public home and search queries explicitly request only `published` entries.
- Contributors use My Entries to see their own pending, published, and returned work.
- Reviewers use an oldest-first queue to publish or return pending entries.
- A returned entry includes a reviewer note explaining what should be revised.
- Editing a published or returned entry sends it back to `pending`, unless the editor is a reviewer.

Supabase Row Level Security is the actual access-control layer. Logged-out visitors can read published entries only. Authenticated contributors can insert entries under their own user ID and can edit or delete only entries they own. Owners can see their own unpublished entries, while reviewers can see the pending queue.

## 4. Security decisions

The main publication gate is the database function `review_entry`. It checks whether the current user is in the reviewers list, accepts only `published` or `returned` as decisions, and changes only an entry that is still pending. Returning an entry also requires a nonblank review note of no more than 1,000 characters. The function lives in the database so a user cannot bypass it by changing the page, revealing a hidden button, or running a request from the browser console.

The application also checks `is_reviewer()` before displaying the review queue. This keeps the interface clear, but it is only a convenience. Hiding a Publish button does not provide security because browser controls can be bypassed. The database function and Row Level Security remain responsible for refusing unauthorized requests.

The workflow decisions I made include:

- Reviewers cannot use the queue to take down an entry after it has been published. `review_entry` acts only on pending entries.
- A returned submission shows the owner a specific review note instead of leaving them to guess what needs revision.
- Public home and search pages show only published material, even when the visitor is signed in and owns pending work.
- Unpublished work is managed through My Entries rather than mixed into public search results.
- Uploaded files are limited to JPEG, PNG, or WebP under 5 MB. Their extension, MIME type, and file signature are checked before insertion, and uploaded files receive randomized names inside an owner-specific storage folder.

The Lab 10 attacks confirmed that a stranger could not insert an already-published entry, promote their pending entry, add themselves as a reviewer, or use `review_entry` successfully. A logged-out request for unpublished entries returned an empty array. Lab 11 also confirmed that a non-reviewer saw only their own pending entry and received `data: false` when attempting to publish it through the review function. After reviewer notes were added, the non-reviewer publish and return attacks were repeated on November 13, 2026. Both returned `data: false`, and the entry remained pending without a review note.

## 5. AI use

AI assisted with the project, but its output was reviewed rather than accepted automatically.

| Model or tool | What it helped produce | What I kept or changed | How I checked it |
| --- | --- | --- | --- |
| ChatGPT, exact early model not recorded | Early technical explanations, planning, wording, and process-log support | I rewrote answers to match what I actually built and removed claims that were not supported by my tests | Compared the answers with my code, lab results, and personal experience |
| Ox Alpha through Cline | An early version of the entry-card component | I kept the component structure but revised its layout, styling, and presentation | Inspected the diff and tested the cards in the browser |
| GPT-5.6 Sol through Codex | Search and filtering, Supabase authentication, contribution and editing flows, validation, password recovery, review statuses, My Entries, the review queue, reviewer notes, responsive styling, and cleanup | I kept the tested Supabase client structure, owner filters, validation structure, status queries, and review RPC workflow. I rewrote the failed-upload control flow, bilingual wording, navigation, colors, status presentation, and reviewer-note interaction when the first version did not behave correctly or fit the archive's users | Ran local builds, manually tested the live and local sites, used two accounts, tested invalid uploads, tested on mobile data, and ran browser-console attacks |
| GPT-5.6 Sol with OpenAI's image-generation tool | AI-generated illustrations for the archive entries | I selected the illustrations, identified them publicly as AI-generated, and added descriptive alternative text | Reviewed each illustration against its story before using it |

One important correction happened when an oversized upload displayed an error but the AI-written control flow continued to `/entries/undefined`. A classmate exposed the problem by uploading an image larger than 5 MB. I changed the flow to stop after validation fails, validate files when selected, verify them again before insertion, and refuse navigation when no entry ID exists.

I also did not treat every AI security warning as automatically correct. For example, a review suggested that an unpublished detail route was publicly exposed because it did not contain a visible status filter. I checked the actual Row Level Security behavior before deciding whether the claim described a real vulnerability.

## 6. Sources and credits

All nine published stories came from conversations with my family members, who gave permission for their memories to appear in this archive. The archive intentionally credits them by their relationship to me rather than publishing their full names.

- **My father:** source for seven entries concerning Takeo Province, Kampong Speu Province, forced labor, forced marriage, schooling, child guards, survival, and travel during and after the Khmer Rouge era.
- **My mother:** source for the entry set in Kampong Som.
- **My grandfather:** source for the account involving the road to Kampong Som and the Prey Nup area.

Places represented or discussed include Takeo Province, Kampong Speu Province, Kampong Som, Prey Ta Chan, and Prey Nup. Each public entry contains its own story-source and place credit.

The nine entry illustrations were generated through GPT-5.6 Sol with OpenAI's image-generation tool. They are labeled as AI-generated in the archive and include alternative text. No outside photograph is presented as my own work.

## 7. Running it locally

Clone and install the project:

```bash
git clone https://github.com/ChhimChanbonraksmey/family-story-archive.git
cd family-story-archive
npm install
```

Create `.env.local` in the project root with these variable names:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Do not commit their values. The Supabase publishable key is public by design and is safe to expose to the browser because Row Level Security protects the data. This project still keeps its value in `.env.local` and Vercel environment variables rather than committing it. No service-role key is used by the application.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). A production build can be checked with:

```bash
npm run build
npm start
```

## 8. Submission checklist

- Live URL loads logged out and shows published entries only: **yes**, [live archive](https://family-story-archive.vercel.app)
- A stranger cannot publish their own entry through the page or the console: **yes**, tested during Lab 10 on October 24, 2026, and retested after the reviewer-note change on November 13, 2026
- Logged out, the API returns nothing pending or returned: **yes**, tested during Lab 10 on October 24, 2026
- Contributors can edit and delete only their own entries: **yes**, enforced by the `entries` Row Level Security policies and ownership checks
- No secrets anywhere in the repository history: **yes**, checked by searching the working tree and Git history on November 10, 2026
- At least eight real entries, each with a credited source: **yes**, nine published entries with a Story source field
- Khmer renders on every screen a user meets, including the queue: **yes**, visible in form labels, validation messages, status labels, and review actions
- Works at phone width: **yes**, tested on an iPhone 15 Pro Max using Chrome on mobile data
- No test entries, lorem ipsum, or TODO comments in shipped pages: **yes**, checked in the repository, Supabase data, and published entry list on November 13, 2026
- No console errors on the main pages: **yes**, checked on November 13, 2026
- `jessicaonoff` is a collaborator on this repository: **yes**
- Supabase project restored and awake on November 13, 2026: **yes**
- Demo video link opens in a private window: **not completed yet**
- Reflection pasted in the Canvas submission: **not completed yet**
- Posted in the Show Your Archive discussion: **yes**
- Q&A slot booked: **not completed yet**
