type Theme = 'light' | 'dark' | null;

let overrideTheme: Theme = null;
const listeners = new Set<() => void>();

export function setOverride(theme: Theme) {
  overrideTheme = theme;
  listeners.forEach((l) => l());
}

export function getOverride(): Theme {
  return overrideTheme;
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
