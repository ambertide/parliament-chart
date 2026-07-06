module.exports = {
  variants: {
    extend: {
      // ...
      appearance: ["base-select"],
    },
  },
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-redaction-10)"],
        "serif-degraded": ["var(--font-redaction-35)"],
        mono: ["var(--font-ibm-plex-mono)"],
        ligature: ["var(--font-material-symbols-outlined)"],
      },
    },
  },
};
