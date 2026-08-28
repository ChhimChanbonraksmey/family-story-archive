import collection from "../collection.config.js";

export const metadata = {
  title: `${collection.name} — Khmer Living Archive`,
  description: collection.description,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          backgroundColor: "#171411",
          backgroundImage:
            "radial-gradient(circle at 85% 5%, #35271D 0, transparent 34%), linear-gradient(180deg, #1B1713 0%, #12100E 100%)",
          color: "#F1DFC2",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          minHeight: "100vh",
        }}
      >
        {children}
      </body>
    </html>
  );
}
