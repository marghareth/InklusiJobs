"use client";

import { createContext, useContext, useState, useEffect } from "react";

const DEFAULTS = {
  fontSize: 0,
  highContrast: false,
  darkMode: false,
  dyslexiaFont: false,
  reduceMotion: false,
  readingMode: false,
  textToSpeech: false,
  highlightLinks: false,
  largeCursor: false,
};

const A11yContext = createContext({ prefs: DEFAULTS, setPref: () => {} });

export function AccessibilityProvider({ children }) {
  const [prefs, setPrefs] = useState(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("inklusijobs_a11y_prefs");
      if (raw) setPrefs({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {}
  }, []);

  const setPref = (key, value) => setPrefs(prev => ({ ...prev, [key]: value }));

  return (
    <A11yContext.Provider value={{ prefs, setPref }}>
      {children}
    </A11yContext.Provider>
  );
}

export function useA11y() {
  return useContext(A11yContext);
}