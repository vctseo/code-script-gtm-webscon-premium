import type { ScriptTemplate } from "./scriptTemplates";

export interface SavedScript {
  id: string;
  templateId: string;
  templateName: string;
  websiteName: string;
  fieldValues: Record<string, string>;
  generatedScript: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "gtm_saved_scripts";
const CUSTOM_TEMPLATES_KEY = "gtm_custom_templates";

export function getSavedScripts(): SavedScript[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveScript(script: Omit<SavedScript, "id" | "createdAt" | "updatedAt">): SavedScript {
  const scripts = getSavedScripts();
  const now = new Date().toISOString();
  const newScript: SavedScript = {
    ...script,
    id: `script_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: now,
    updatedAt: now,
  };
  scripts.unshift(newScript);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scripts));
  return newScript;
}

export function updateScript(id: string, updates: Partial<SavedScript>): SavedScript | null {
  const scripts = getSavedScripts();
  const idx = scripts.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  scripts[idx] = {
    ...scripts[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scripts));
  return scripts[idx];
}

export function deleteScript(id: string): void {
  const scripts = getSavedScripts().filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scripts));
}

export function getCustomTemplates(): ScriptTemplate[] {
  try {
    const raw = localStorage.getItem(CUSTOM_TEMPLATES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCustomTemplate(template: ScriptTemplate): void {
  const templates = getCustomTemplates();
  const idx = templates.findIndex((t) => t.id === template.id);
  if (idx >= 0) {
    templates[idx] = template;
  } else {
    templates.unshift(template);
  }
  localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(templates));
}

export function deleteCustomTemplate(id: string): void {
  const templates = getCustomTemplates().filter((t) => t.id !== id);
  localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(templates));
}
