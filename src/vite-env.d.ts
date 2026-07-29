/// <reference types="vite/client" />

// Public-by-design values only. A real secret must never carry the VITE_
// prefix — Vite inlines every VITE_* value into the published JS bundle.
interface ImportMetaEnv {
  readonly VITE_EMAILJS_SERVICE_ID?: string;
  readonly VITE_EMAILJS_TEMPLATE_ID?: string;
  readonly VITE_EMAILJS_PUBLIC_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
