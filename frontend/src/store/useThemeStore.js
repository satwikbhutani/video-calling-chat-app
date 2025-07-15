import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("page-theme") || "forest",
  setTheme: (theme) => {
    localStorage.setItem("page-theme", theme);
    set({ theme });
  },
}));