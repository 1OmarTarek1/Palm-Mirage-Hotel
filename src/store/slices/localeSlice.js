import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "locale";

const isValid = (v) => v === "EN" || v === "AR";

const readStored = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isValid(saved)) return saved;
  } catch {
    /* ignore */
  }
  return "EN";
};

const applyLang = (code) => {
  if (typeof document === "undefined") return;
  document.documentElement.lang = code === "AR" ? "ar" : "en";
};

const initialCode = readStored();
applyLang(initialCode);

const localeSlice = createSlice({
  name: "locale",
  initialState: {
    code: initialCode,
  },
  reducers: {
    setLocale: (state, action) => {
      const code = action.payload;
      if (!isValid(code)) return;
      state.code = code;
      try {
        localStorage.setItem(STORAGE_KEY, code);
      } catch {
        /* ignore */
      }
      applyLang(code);
    },
    toggleLocale: (state) => {
      const next = state.code === "EN" ? "AR" : "EN";
      state.code = next;
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      applyLang(next);
    },
  },
});

export const { setLocale, toggleLocale } = localeSlice.actions;
export const selectLocale = (state) => state.locale.code;
export default localeSlice.reducer;
