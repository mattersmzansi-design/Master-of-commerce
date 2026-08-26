import { useState } from "react";
import { C, SANS, MONO } from "../theme";

// One-tap "Share to Facebook" button.
// UX flow: click → copy pre-written caption to clipboard → open Facebook's
// compose window with the URL (Facebook auto-generates the link preview from
// the site's Open Graph tags) → owner pastes the caption. Takes ~30 seconds
// and beats template-auto-posts because Facebook's algorithm actively
// downranks obvious automation.
//
// Facebook removed the `quote` param from sharer.php around 2018, so we
// can't literally pre-fill the caption. Copy-to-clipboard is the workaround
// everyone uses.

const FB_LOGO = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z"/>
  </svg>
);

export default function ShareToFacebookButton({ caption, url, label = "Share" }) {
  const [state, setState] = useState("idle"); // idle | copied | failed

  async function share() {
    try {
      await navigator.clipboard.writeText(caption);
      setState("copied");
    } catch {
      // Fallback for older browsers / permissions issues — just open FB
      setState("failed");
    }
    // Small delay so the "Copied" flash is visible before the popup takes focus
    setTimeout(() => {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        "fb-share", "width=640,height=560,noopener,noreferrer",
      );
    }, 180);
    // Reset after a moment
    setTimeout(() => setState("idle"), 3600);
  }

  const message =
    state === "copied" ? "Caption copied — paste it into Facebook" :
    state === "failed" ? "Couldn't copy — paste your own caption" :
    null;

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
      <button
        onClick={share}
        aria-label="Share this to Facebook"
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          fontFamily: SANS, fontSize: 11, fontWeight: 700,
          color: "#1877F2", // Facebook brand blue — recognisable & signals platform
          background: "rgba(24,119,242,.08)",
          border: "1px solid rgba(24,119,242,.25)",
          borderRadius: 8, padding: "6px 10px", cursor: "pointer",
        }}
      >
        {FB_LOGO}
        <span>{label}</span>
      </button>
      {message && (
        <span style={{ fontFamily: MONO, fontSize: 9.5, color: state === "failed" ? C.red : C.green, letterSpacing: ".04em" }}>
          {message}
        </span>
      )}
    </div>
  );
}
