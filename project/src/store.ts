import { create } from 'zustand';

interface ComponentPreset {
  name: string;
  code: string;
  preview?: string;
}

interface WebGenStore {
  presets: Record<string, ComponentPreset[]>;
  addPreset: (category: string, preset: ComponentPreset) => void;
  recentPrompts: string[];
  addRecentPrompt: (prompt: string) => void;
  favorites: string[];
  toggleFavorite: (code: string) => void;
  history: Array<{
    timestamp: number;
    prompt: string;
    code: string;
    template: string;
  }>;
  addToHistory: (entry: { prompt: string; code: string; template: string }) => void;
}

export const useStore = create<WebGenStore>((set) => ({
  presets: {
    headers: [],
    heroes: [],
    features: [],
    footers: [],
  },
  addPreset: (category, preset) =>
    set((state) => ({
      presets: {
        ...state.presets,
        [category]: [...(state.presets[category] || []), preset],
      },
    })),
  recentPrompts: [],
  addRecentPrompt: (prompt) =>
    set((state) => ({
      recentPrompts: [prompt, ...state.recentPrompts].slice(0, 5),
    })),
  favorites: [],
  toggleFavorite: (code) =>
    set((state) => ({
      favorites: state.favorites.includes(code)
        ? state.favorites.filter((c) => c !== code)
        : [...state.favorites, code],
    })),
  history: [],
  addToHistory: (entry) =>
    set((state) => ({
      history: [
        { ...entry, timestamp: Date.now() },
        ...state.history,
      ].slice(0, 50),
    })),
}));