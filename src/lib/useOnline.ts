"use client";
import { useCallback, useEffect, useState } from "react";

/** État de la connexion, avec une vérification manuelle (bouton « Réessayer »). */
export function useOnline() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(navigator.onLine);
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  const recheck = useCallback(async () => {
    if (!navigator.onLine) { setOnline(false); return false; }
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (url) await fetch(url, { mode: "no-cors", cache: "no-store" });
      setOnline(true);
      return true;
    } catch {
      setOnline(false);
      return false;
    }
  }, []);

  return { online, recheck };
}
