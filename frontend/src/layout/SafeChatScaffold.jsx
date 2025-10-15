// Safe chat page scaffold (optional reference)
// Path: frontend/src/layout/SafeChatScaffold.jsx
import React from "react";

export default function SafeChatScaffold({ header, messages, composer }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {header && (
        <header style={{ flex: "0 0 auto", borderBottom: "1px solid #e5e7eb" }}>
          {header}
        </header>
      )}

      <main style={{ flex: 1, overflow: "auto" }}>
        {messages}
      </main>

      <footer style={{ flex: "0 0 auto", borderTop: "1px solid #e5e7eb", padding: "12px 16px", background: "#fff" }}>
        {composer}
      </footer>
    </div>
  );
}
