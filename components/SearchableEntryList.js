"use client";

// React state and input events require this App Router component to run in the browser.
import { useState } from "react";
import Link from "next/link";
import ClearableInput from "./ClearableInput.js";
import EntryCard from "./EntryCard.js";
import filterStyles from "./SearchableEntryList.module.css";
import interactive from "./interactive.module.css";

const styles = {
  controls: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
    alignItems: "end",
    marginTop: 28,
  },
  search: {
    display: "block",
    color: "#D49A56",
    fontFamily: "'Courier New', monospace",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: 1,
  },
  labelHeading: {
    display: "flex", alignItems: "center", gap: 9, minHeight: 38,
  },
  labelIcon: { flexShrink: 0, width: 17, height: 17, color: "#E7B86A" },
  labelText: { display: "block" },
  labelKh: {
    display: "block", color: "#E7B86A", fontFamily: "system-ui, sans-serif",
    fontSize: 15, fontWeight: 700, letterSpacing: 0, lineHeight: 1.45,
  },
  labelEn: { display: "block", marginTop: 1, color: "#BFB2A1", fontSize: 12 },
  input: {
    display: "block",
    boxSizing: "border-box",
    width: "100%",
    padding: "14px 16px",
    color: "#F1DFC2",
    backgroundColor: "#211C18",
    border: "1px solid #5C4938",
    borderRadius: 10,
    fontSize: 16,
  },
  inputWrap: { marginTop: 10 },
  select: {
    display: "block",
    boxSizing: "border-box",
    width: "100%",
    padding: "14px 48px 14px 16px",
    color: "#F1DFC2",
    backgroundColor: "#211C18",
    border: "1px solid #5C4938",
    borderRadius: 10,
    fontSize: 16,
  },
  feedback: { color: "#BFB2A1", fontSize: 14, lineHeight: 1.65, margin: "12px 0 0" },
  feedbackKh: { display: "block", color: "#D8CCBC", fontFamily: "system-ui, sans-serif" },
  feedbackEn: { display: "block" },
  entries: { display: "grid", gap: 28, marginTop: 28 },
  entryLink: { color: "inherit", display: "block", textDecoration: "none" },
  highlight: {
    color: "#211C18",
    backgroundColor: "#E7B86A",
    borderRadius: 3,
    padding: "0 2px",
  },
  empty: { color: "#BFB2A1", padding: "32px 0", textAlign: "center" },
  khmer: { display: "block", marginTop: 8 },
  messageKh: { display: "block", color: "#D8CCBC", fontFamily: "system-ui, sans-serif", lineHeight: 1.8 },
  messageEn: { display: "block", marginTop: 5 },
};

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" style={styles.labelIcon}>
      <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="2" />
      <path d="m15.5 15.5 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" style={styles.labelIcon}>
      <path d="M4 5h16l-6.2 7.1v5.2L10.2 19v-6.9L4 5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function highlightMatch(text, query) {
  if (!text) {
    return text;
  }

  // One-letter highlights create too much visual noise in longer stories.
  if (query.length < 2) {
    return text;
  }

  // Split the original text so each matching section can render as a <mark>.
  const normalizedText = text.toLocaleLowerCase();
  const parts = [];
  let start = 0;
  let matchIndex = normalizedText.indexOf(query);

  while (matchIndex !== -1) {
    parts.push(text.slice(start, matchIndex));
    parts.push(
      <mark key={matchIndex} style={styles.highlight}>
        {text.slice(matchIndex, matchIndex + query.length)}
      </mark>,
    );
    start = matchIndex + query.length;
    matchIndex = normalizedText.indexOf(query, start);
  }

  parts.push(text.slice(start));
  return parts;
}

function normalizeSearchQuery(query) {
  // Ignore extra spaces and quotation marks around an otherwise valid search.
  const trimmedQuery = query.trim();
  const quotePairs = [
    ['"', '"'],
    ["'", "'"],
    ["“", "”"],
    ["‘", "’"],
  ];
  const surroundingQuotes = quotePairs.find(
    ([opening, closing]) =>
      trimmedQuery.startsWith(opening) && trimmedQuery.endsWith(closing),
  );
  const searchableQuery = surroundingQuotes
    ? trimmedQuery.slice(1, -1).trim()
    : trimmedQuery;

  return searchableQuery.toLocaleLowerCase();
}

export default function SearchableEntryList({
  entries,
  loading = false,
  loadError = false,
}) {
  const [query, setQuery] = useState("");
  const [selectedPlace, setSelectedPlace] = useState("");

  if (loading) {
    return (
      <p role="status" style={styles.empty}>
        <span lang="km" style={styles.messageKh}>កំពុងទាញយករឿងរ៉ាវគ្រួសារ…</span>
        <span style={styles.messageEn}>Gathering the family stories...</span>
      </p>
    );
  }

  if (loadError) {
    return (
      <p role="alert" style={styles.empty}>
        <span lang="km" style={styles.messageKh}>
          មិនអាចទាញយករឿងរ៉ាវគ្រួសារបាននៅពេលនេះទេ។ សូមព្យាយាមម្តងទៀត។
        </span>
        <span style={styles.messageEn}>The family stories could not be retrieved right now. Please try again.</span>
      </p>
    );
  }

  if (entries.length === 0) {
    return (
      <p style={styles.empty}>
        <span lang="km" style={styles.messageKh}>
          ធ្នើបណ្ណសាររួចរាល់ហើយ ប៉ុន្តែមិនទាន់មានរឿងរ៉ាវគ្រួសារត្រូវបានបន្ថែមនៅឡើយទេ។
        </span>
        <span style={styles.messageEn}>The archive shelf is ready, but no family stories have been added yet.</span>
      </p>
    );
  }

  const normalizedQuery = normalizeSearchQuery(query);

  // Generate filter options and counts from the published entries already loaded.
  const placeCounts = entries.reduce((counts, entry) => {
    counts.set(entry.place, (counts.get(entry.place) || 0) + 1);
    return counts;
  }, new Map());
  const places = [...placeCounts.keys()].sort();

  // An entry remains visible only when it matches both active controls.
  const filteredEntries = entries.filter((entry) => {
    // A match in any searchable field is enough to pass the text search.
    const matchesQuery = [
      entry.title,
      entry.titleKh,
      entry.description,
      entry.descriptionKh,
      entry.contributor,
      entry.place,
    ].filter(Boolean).some(
      (value) => value.toLocaleLowerCase().includes(normalizedQuery),
    );
    const matchesPlace =
      selectedPlace === "" || entry.place === selectedPlace;

    return matchesQuery && matchesPlace;
  });

  return (
    <div>
      <div style={styles.controls}>
        <label style={styles.search}>
          <span style={styles.labelHeading}>
            <SearchIcon />
            <span style={styles.labelText}>
              <span lang="km" style={styles.labelKh}>ស្វែងរកក្នុងបណ្ណសារ</span>
              <span style={styles.labelEn}>SEARCH THE ARCHIVE</span>
            </span>
          </span>
          <ClearableInput
            type="text"
            inputMode="search"
            enterKeyHint="search"
            role="searchbox"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClear={() => setQuery("")}
            clearLabel="Clear search / លុបការស្វែងរក"
            placeholder="ស្វែងរកចំណងជើង រឿង ឬទីកន្លែង"
            style={styles.input}
            wrapperStyle={styles.inputWrap}
          />
        </label>

        <label style={styles.search}>
          <span style={styles.labelHeading}>
            <FilterIcon />
            <span style={styles.labelText}>
              <span lang="km" style={styles.labelKh}>ត្រងតាមខេត្ត</span>
              <span style={styles.labelEn}>FILTER BY PROVINCE</span>
            </span>
          </span>
          <span className={filterStyles.selectWrap}>
            <select
              className={filterStyles.select}
              value={selectedPlace}
              onChange={(event) => setSelectedPlace(event.target.value)}
              style={styles.select}
            >
              <option value="">ខេត្តទាំងអស់ / All provinces</option>
              {places.map((place) => (
                <option key={place} value={place}>
                  {place} ({placeCounts.get(place)})
                </option>
              ))}
            </select>
            <span className={filterStyles.arrow} aria-hidden="true" />
          </span>
        </label>
      </div>

      {/* Announce changing result counts to visitors using screen readers. */}
      {normalizedQuery || selectedPlace ? (
        <p style={styles.feedback} aria-live="polite">
          <span lang="km" style={styles.feedbackKh}>
            រកឃើញរឿងដែលត្រូវគ្នាចំនួន {filteredEntries.length}
          </span>
          <span style={styles.feedbackEn}>
            {filteredEntries.length} matching{" "}
            {filteredEntries.length === 1 ? "entry" : "entries"}
          </span>
        </p>
      ) : null}

      <div style={styles.entries}>
        {filteredEntries.map((entry) => (
          <Link
            key={entry.id}
            href={`/entries/${entry.id}`}
            aria-label={`View ${entry.titleKh || entry.title}`}
            className={interactive.cardLink}
            style={styles.entryLink}
          >
            {/* Highlight display values without changing the original entry data. */}
            <EntryCard
              {...entry}
              titleKh={highlightMatch(entry.titleKh, normalizedQuery)}
              title={highlightMatch(entry.title, normalizedQuery)}
              descriptionKh={highlightMatch(entry.descriptionKh, normalizedQuery)}
              description={highlightMatch(entry.description, normalizedQuery)}
              contributor={highlightMatch(entry.contributor, normalizedQuery)}
              place={highlightMatch(entry.place, normalizedQuery)}
            />
          </Link>
        ))}
      </div>

      {filteredEntries.length === 0 ? (
        <p style={styles.empty}>
          We couldn’t find a family story among these choices. Try another
          title, place, contributor, or province.
          <span lang="km" style={styles.khmer}>
            យើងរកមិនឃើញរឿងរ៉ាវគ្រួសារតាមជម្រើសទាំងនេះទេ។ សូមសាកល្បងចំណងជើង
            ទីកន្លែង អ្នកផ្តល់រឿង ឬខេត្តផ្សេងទៀត។
          </span>
        </p>
      ) : null}
    </div>
  );
}
