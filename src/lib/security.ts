// Utilitaires de sécurité : tout ce qui vient de la base ou d'une URL est traité comme non fiable.

/** N'accepte que les URL http(s). Bloque javascript:, data:, etc. */
export function safeUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const u = new URL(value.trim());
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : null;
  } catch {
    return null;
  }
}

/** Identifiant YouTube valide (11 caractères) ou null. */
export function safeYoutubeId(value: unknown): string | null {
  return typeof value === "string" && /^[A-Za-z0-9_-]{11}$/.test(value) ? value : null;
}

/** Limite un texte saisi par l'utilisateur. */
export function clamp(value: string, max: number): string {
  return value.trim().slice(0, max);
}

const ALLOWED_EXT: Record<string, string[]> = {
  audio: ["mp3", "m4a", "wav", "ogg"],
  pdf: ["pdf"],
  image: ["jpg", "jpeg", "png", "webp"],
};
const MAX_MB: Record<string, number> = { audio: 200, pdf: 100, image: 8 };

/** Vérifie type et taille avant upload. Retourne un nom de fichier propre, ou lève une erreur lisible. */
export function prepareUpload(file: File, kind: "audio" | "pdf" | "image", prefix = ""): string {
  const ext = (file.name.split(".").pop() || "").toLowerCase();
  if (!ALLOWED_EXT[kind].includes(ext)) {
    throw new Error(`Format non accepté (${ALLOWED_EXT[kind].join(", ")}).`);
  }
  if (file.size > MAX_MB[kind] * 1024 * 1024) {
    throw new Error(`Fichier trop lourd (max ${MAX_MB[kind]} Mo).`);
  }
  const base = file.name
    .replace(/\.[^/.]+$/, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
  return `${prefix}${Date.now()}-${base || kind}.${ext}`;
}

/** Messages d'erreur d'auth sans fuite d'information technique. */
export function authErrorMessage(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login")) return "Email ou mot de passe incorrect.";
  if (m.includes("already registered") || m.includes("already been registered"))
    return "Impossible de créer ce compte. Essayez de vous connecter.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Trop de tentatives. Réessayez dans quelques minutes.";
  if (m.includes("email not confirmed")) return "Confirmez votre email avant de vous connecter.";
  return "Une erreur est survenue. Réessayez.";
}
