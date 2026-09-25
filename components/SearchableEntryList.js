"use client";

// React state and input events require this App Router component to run in the browser.
import { useState } from "react";
import Link from "next/link";
import ClearableInput from "./ClearableInput.js";
import EntryCard from "./EntryCard.js";

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
    marginTop: 10,
    padding: "14px 16px",
    color: "#F1DFC2",
    backgroundColor: "#211C18",
    border: "1px solid #5C4938",
    borderRadius: 10,
    fontSize: 16,
  },
  feedback: { color: "#BFB2A1", fontSize: 14, margin: "12px 0 0" },
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
};

function highlightMatch(text, query) {
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
    return <p role="status" style={styles.empty}>Gathering the family stories...</p>;
  }

  if (loadError) {
    return (
      <p role="alert" style={styles.empty}>
        The family stories could not be retrieved right now. Please try again.
      </p>
    );
  }

  if (entries.length === 0) {
    return (
      <p style={styles.empty}>
        The archive shelf is ready, but no family stories have been added yet.
      </p>
    );
  }

  const normalizedQuery = normalizeSearchQuery(query);

  // Generate filter options from the data so new provinces appear automatically.
  const places = [...new Set(entries.map((entry) => entry.place))].sort();

  // An entry remains visible only when it matches both active controls.
  const filteredEntries = entries.filter((entry) => {
    // A match in any searchable field is enough to pass the text search.
    const matchesQuery = [
      entry.title,
      entry.description,
      entry.contributor,
      entry.place,
    ].some(
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
          SEARCH THE ARCHIVE
          <ClearableInput
            type="text"
            inputMode="search"
            enterKeyHint="search"
            role="searchbox"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClear={() => setQuery("")}
            clearLabel="Clear search"
            placeholder="Try a title, story, contributor, or place"
            style={styles.input}
            wrapperStyle={styles.inputWrap}
          />
        </label>

        <label style={styles.search}>
          FILTER BY PROVINCE
          <select
            value={selectedPlace}
            onChange={(event) => setSelectedPlace(event.target.value)}
            style={styles.select}
          >
            <option value="">All provinces</option>
            {places.map((place) => (
              <option key={place} value={place}>
                {place}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Announce changing result counts to visitors using screen readers. */}
      {normalizedQuery || selectedPlace ? (
        <p style={styles.feedback} aria-live="polite">
          {filteredEntries.length} matching{" "}
          {filteredEntries.length === 1 ? "entry" : "entries"}
        </p>
      ) : null}

      <div style={styles.entries}>
        {filteredEntries.map((entry) => (
          <Link
            key={entry.id}
            href={`/entries/${entry.id}`}
            aria-label={`View ${entry.title}`}
            style={styles.entryLink}
          >
            {/* Highlight display values without changing the original entry data. */}
            <EntryCard
              {...entry}
              title={highlightMatch(entry.title, normalizedQuery)}
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
