"use client";

import { useRef } from "react";

const styles = {
  wrapper: { display: "block", position: "relative" },
  clear: {
    position: "absolute",
    top: "50%",
    right: 4,
    transform: "translateY(-50%)",
    width: 40,
    height: 40,
    border: 0,
    backgroundColor: "transparent",
    color: "#8FBCE0",
    fontSize: 22,
    cursor: "pointer",
  },
};

export default function ClearableInput({
  value, onClear, clearLabel, style, wrapperStyle, ...inputProps
}) {
  const inputRef = useRef(null);

  function clear() {
    onClear();
    inputRef.current?.focus();
  }

  return (
    <span style={{ ...styles.wrapper, ...wrapperStyle }}>
      <input
        {...inputProps}
        ref={inputRef}
        value={value}
        style={{ ...style, paddingRight: 48 }}
      />
      {value ? (
        <button
          type="button"
          aria-label={clearLabel}
          title={clearLabel}
          onClick={clear}
          style={styles.clear}
        >
          ×
        </button>
      ) : null}
    </span>
  );
}
