import { CaseReducer, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SettingsData } from "../logic/models";
import { changeLanguage, Language } from "../translations";

export function initialSettings(): SettingsData {
    return { isSettingsOpen: false, language: "en", theme: "light" };
}

interface SettingsReducers {
    [K: string]: CaseReducer<SettingsData, any>;

    openSettings: CaseReducer<SettingsData>;
    closeSettings: CaseReducer<SettingsData>;
    updateLanguageSetting: CaseReducer<SettingsData, PayloadAction<Language>>;
    toggleTheme: CaseReducer<SettingsData>;
}

const settingsSlice = createSlice<SettingsData, SettingsReducers, "settings">({
    name: "settings",
    initialState: initialSettings(),
    reducers: {
        openSettings: (state) => {
            state.isSettingsOpen = true;
        },
        closeSettings: (state) => {
            state.isSettingsOpen = false;
        },
        toggleTheme: (state) => {
            if (state.theme === "light") {
                state.theme = "dark";
            } else if (state.theme === "dark") {
                state.theme = "light";
            } else {
                state.theme = "light";
            }
        },
        updateLanguageSetting: (state, action: PayloadAction<Language>) => {
            state.language = action.payload;
            changeLanguage(state.language);
        },
    },
});

export const settingsReducer = settingsSlice.reducer;
export const {
    openSettings,
    closeSettings,
    toggleTheme,
    updateLanguageSetting,
} = settingsSlice.actions;
