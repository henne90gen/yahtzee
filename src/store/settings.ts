import {CaseReducer, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {changeLanguage, Language} from "../translations";

export interface SettingsData {
    isSettingsOpen: boolean;
    language: Language;
}

export function initialSettings(): SettingsData {
    return {isSettingsOpen: false, language: "en"}
}

interface SettingsReducers {
    [K: string]: CaseReducer<SettingsData, any>

    openSettings: CaseReducer<SettingsData>,
    closeSettings: CaseReducer<SettingsData>,
    updateLanguageSetting: CaseReducer<SettingsData, PayloadAction<Language>>
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
        updateLanguageSetting: (state, action: PayloadAction<Language>) => {
            state.language = action.payload;
            changeLanguage(state.language)
        }
    },
})

export const settingsReducer = settingsSlice.reducer;
export const {
    openSettings,
    closeSettings,
    updateLanguageSetting,
} = settingsSlice.actions;
