"use client";

import { useState } from "react";
import EntryCard from "./EntryCard.js";

const styles = {
  search: {
    display: "block",
    marginTop: 28,
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
  feedback: { color: "#BFB2A1", fontSize: 14, margin: "12px 0 0" },
  entries: { display: "grid", gap: 28, marginTop: 28 },
  empty: { color: "#BFB2A1", padding: "32px 0", textAlign: "center" },
  khmer: { display: "block", marginTop: 8 },
};

export default function SearchableEntryList({ entries }) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase();

  const filteredEntries = entries.filter((entry) =>
    [entry.title, entry.description, entry.contributor, entry.place].some(
      (value) => value.toLocaleLowerCase().includes(normalizedQuery),
    ),
  );

  return (
    <div>
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

      {normalizedQuery ? (
        <p style={styles.feedback} aria-live="polite">
          {filteredEntries.length} matching{" "}
          {filteredEntries.length === 1 ? "entry" : "entries"}
        </p>
      ) : null}

      <div style={styles.entries}>
        {filteredEntries.map((entry) => (
          <EntryCard key={entry.id} {...entry} />
        ))}
      </div>

      {filteredEntries.length === 0 ? (
        <p style={styles.empty}>
          We couldn’t find a family story matching “{query}.” Try another title,
          place, or contributor.
          <span lang="km" style={styles.khmer}>រកមិនឃើញរឿងរ៉ាវគ្រួសារដែលត្រូវនឹង “{query}” ទេ។ សូមសាកល្បងចំណងជើង ទីកន្លែង ឬអ្នកផ្តល់រឿងផ្សេងទៀត។</span>
        </p>
      ) : null}
    </div>
  );
}
