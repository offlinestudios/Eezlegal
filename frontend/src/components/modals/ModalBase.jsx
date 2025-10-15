// Optional modal base that won't block the page when hidden.
// Path: frontend/src/components/modals/ModalBase.jsx
import React from "react";

export default function ModalBase({ open, onClose, children }) {
  if (!open) return null; // unmount when closed so it never steals focus

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: 12,
          width: "min(560px, 92vw)",
          padding: 24,
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)"
        }}
      >
        {children}
      </div>
    </div>
  );
}
