"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type ThemeChoice = "clair" | "sombre" | "auto";

type Ctx = { choice: ThemeChoice; dark: boolean; setChoice: (c: ThemeChoice) => void; toggle: () => void };
const ThemeContext = createContext<Ctx>({ choice: "clair", dark: false, setChoice: () => {}, toggle: () => {} });

const STORAGE_KEY = "theme";

function readChoice(): ThemeChoice {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "sombre" || v === "auto" ? v : "clair"; // clair par défaut
  } catch { return "clair"; }
}

const prefersDark = () => window.matchMedia("(prefers-color-scheme: dark)").matches;
const resolveDark = (c: ThemeChoice) => c === "sombre" || (c === "auto" && prefersDark());

function apply(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#0f1614" : "#0d5c4a");
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [choice, setChoiceState] = useState<ThemeChoice>("clair");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const c = readChoice();
    setChoiceState(c);
    const d = resolveDark(c);
    setDark(d); apply(d);
  }, []);

  // En mode "auto", suit le réglage du téléphone en direct
  useEffect(() => {
    if (choice !== "auto") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => { setDark(mq.matches); apply(mq.matches); };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [choice]);

  const setChoice = useCallback((c: ThemeChoice) => {
    try { localStorage.setItem(STORAGE_KEY, c); } catch { /* stockage indisponible */ }
    setChoiceState(c);
    const d = resolveDark(c);
    setDark(d); apply(d);
  }, []);

  const toggle = useCallback(() => setChoice(dark ? "clair" : "sombre"), [dark, setChoice]);

  return <ThemeContext.Provider value={{ choice, dark, setChoice, toggle }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);

/** Script exécuté avant l'affichage : évite le flash blanc quand le mode sombre est choisi. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");var d=t==="sombre"||(t==="auto"&&window.matchMedia("(prefers-color-scheme: dark)").matches);if(d)document.documentElement.classList.add("dark");}catch(e){}})();`;
