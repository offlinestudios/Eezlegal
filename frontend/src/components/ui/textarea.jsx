// Fixed Textarea component (drop-in replacement)
// Path: frontend/src/components/ui/textarea.jsx
// Notes:
// - Works even if Tailwind is missing or purged in production.
// - Guarantees a sensible min height and sane defaults.
// - Keeps className merging so you can layer your own utilities.
import * as React from "react";

// Minimal cn util to avoid importing if your project doesn't have "@/lib/utils"
function cn(...args) {
  return args.filter(Boolean).join(" ");
}

export function Textarea({ className, style, ...props }) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Safe defaults (harmless if Tailwind is absent)
        "w-full resize-y rounded-md border px-3 py-2 text-sm",
        "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      style={{
        minHeight: "6rem",            // ~ Tailwind min-h-24
        lineHeight: "1.5",
        background: "transparent",
        ...style,
      }}
      {...props}
    />
  );
}

export default Textarea;
