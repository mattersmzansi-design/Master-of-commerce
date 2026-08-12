// One place to manage every off-site link. Add a row here and it appears in
// the footer (and mobile menu) automatically — no other files to touch.
//
// `label` is the accessible name (screen readers + tooltips).
// `handle` is what humans see in the footer.
// `href`   is the actual URL.
// `icon`   is one of the keys in the SocialIcon component below.

export const SOCIALS = [
  { label:"Instagram", handle:"@mzansimoneymatters", href:"https://www.instagram.com/mzansimoneymatters", icon:"instagram" },
  { label:"X",         handle:"@stillMoneyMat",      href:"https://x.com/stillMoneyMat",                  icon:"x" },
  { label:"Facebook",  handle:"Mzansi Money Matters",href:"https://www.facebook.com/share/1HrWpfWe4M/",   icon:"facebook" },
];

export const CONTACT_EMAIL = "info@mzansimoneymatters.co.za";

// Inline SVG icons — keeps everything self-contained (no icon library, no fetch).
// Add a new one here to support a new platform.
export function SocialIcon({ name, size = 18, color = "currentColor" }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: color, "aria-hidden": true };
  switch (name) {
    case "instagram": return (
      <svg {...p} fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill={color} stroke="none"/>
      </svg>
    );
    case "x": return (
      <svg {...p}><path d="M18.244 2H21l-6.63 7.58L22 22h-6.937l-4.79-6.28L4.7 22H2l7.09-8.11L2 2h7.06l4.33 5.72L18.244 2Zm-1.216 18h1.83L7.05 3.98H5.09L17.028 20Z"/></svg>
    );
    case "facebook": return (
      <svg {...p}><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z"/></svg>
    );
    case "email": return (
      <svg {...p} fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>
      </svg>
    );
    case "linkedin": return (
      <svg {...p}><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5.001 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3zM14.5 9c-2.09 0-3.5 1.16-3.5 1.16V9H7v12h4v-6.5c0-1.66 1.34-3 3-3s3 1.34 3 3V21h4v-7.5C21 10.46 18.54 9 14.5 9Z"/></svg>
    );
    case "tiktok": return (
      <svg {...p}><path d="M19.6 6.2a5.7 5.7 0 0 1-3.6-1.4v9.5a5.7 5.7 0 1 1-5.7-5.7c.3 0 .6 0 .9.1v3a2.7 2.7 0 1 0 1.8 2.6V2h2.9a5.7 5.7 0 0 0 3.7 4.2v3Z"/></svg>
    );
    case "youtube": return (
      <svg {...p}><path d="M23 12s0-3.7-.5-5.4a2.8 2.8 0 0 0-2-2C18.8 4 12 4 12 4s-6.8 0-8.5.6a2.8 2.8 0 0 0-2 2C1 8.3 1 12 1 12s0 3.7.5 5.4a2.8 2.8 0 0 0 2 2C5.2 20 12 20 12 20s6.8 0 8.5-.6a2.8 2.8 0 0 0 2-2C23 15.7 23 12 23 12ZM10 15.5v-7l6 3.5-6 3.5Z"/></svg>
    );
    case "whatsapp": return (
      <svg {...p}><path d="M20.5 3.5A10.6 10.6 0 0 0 3.4 15.6L2 22l6.6-1.4A10.6 10.6 0 1 0 20.5 3.5Zm-8.4 17.1a8.6 8.6 0 0 1-4.5-1.3l-.3-.2-3.8.8.8-3.7-.2-.3a8.6 8.6 0 1 1 8 4.7Zm4.7-6.4c-.3-.1-1.5-.7-1.8-.8-.2-.1-.4-.1-.6.1-.2.3-.7.9-.9 1-.2.2-.3.2-.6.1s-1.2-.4-2.2-1.4c-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.4.1-.6l.4-.4c.1-.2.2-.3.3-.5 0-.2 0-.4-.1-.5-.1-.1-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.4-.2.3-.9.9-.9 2.2 0 1.3 1 2.6 1.1 2.7.1.2 1.9 3 4.6 4.2 1.6.6 2.2.7 3 .6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.5-.3Z"/></svg>
    );
    default: return null;
  }
}
