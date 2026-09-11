"use client";

import { useState } from "react";
import Link from "next/link";
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
    marginTop: 10,
    padding: "14px 16px",
    color: "#F1DFC2",
    backgroundColor: "#211C18",
    border: "1px solid #5C4938",
    borderRadius: 10,
    fontSize: 16,
  },
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
  if (query.length < 2) {
    return text;
  }

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

export default function SearchableEntryList({ entries }) {
  const [query, setQuery] = useState("");
  const [selectedPlace, setSelectedPlace] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const places = [...new Set(entries.map((entry) => entry.place))].sort();

  const filteredEntries = entries.filter((entry) => {
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
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try a title, story, contributor, or place"
            style={styles.input}
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
