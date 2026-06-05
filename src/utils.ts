
export function isSavedResult(x) {
  if (!x || typeof x !== "object") return false;
  const s = x.state;
  if (!s || typeof s !== "object") return false;
  if (typeof s.D !== "number" || typeof s.I !== "number" || typeof s.S !== "number" || typeof s.C !== "number") return false;
  if (typeof x.savedAt !== "string" || typeof x.archetype !== "string") return false;
  if (!Array.isArray(x.badges)) return false;
  return true;
}

export function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return isSavedResult(parsed) ? parsed : null;
  } catch { return null; }
}

export function persistResult(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

export function clearSaved() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export function downloadResult(data) {
  const payload = { version: EXPORT_VERSION, app: "psyche", ...data };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `psyche-resultado-${new Date(data.savedAt).toISOString().slice(0,10)}.json`;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

export function parseImport(text) {
  let o;
  try { o = JSON.parse(text); } catch { throw new Error("O arquivo não é um JSON válido."); }
  if (!o || typeof o !== "object") throw new Error("Conteúdo do arquivo inválido.");
  if (o.app != null && o.app !== "psyche") throw new Error("Este arquivo não parece ser um resultado do Psyche.");
  const s = o.state;
  if (!s || typeof s.D !== "number" || typeof s.I !== "number" || typeof s.S !== "number" || typeof s.C !== "number")
    throw new Error("Pontuações ausentes ou incorretas no arquivo.");
  const state = { D: Math.max(0, Math.round(s.D)), I: Math.max(0, Math.round(s.I)), S: Math.max(0, Math.round(s.S)), C: Math.max(0, Math.round(s.C)) };
  const badges = Array.isArray(o.badges) ? o.badges.filter(b => b && typeof b.id === "string") : [];
  const savedAt = typeof o.savedAt === "string" && !isNaN(Date.parse(o.savedAt)) ? o.savedAt : new Date().toISOString();
  const archetype = typeof o.archetype === "string" ? o.archetype : "";
  return { state, badges, savedAt, archetype };
}