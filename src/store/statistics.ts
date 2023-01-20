import { CaseReducer, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface StatisticsData {}

export function initialSettings(): StatisticsData {
    return { isSettingsOpen: false, language: "en" };
}

interface StatisticsReducers {
    [K: string]: CaseReducer<StatisticsData, any>;

    updateStatisticsAfterGame: CaseReducer<StatisticsData, PayloadAction<any>>;
}

const statisticsSlice = createSlice<
    StatisticsData,
    StatisticsReducers,
    "settings"
>({
    name: "settings",
    initialState: initialSettings(),
    reducers: {
        updateStatisticsAfterGame: (state) => {},
    },
});

export const statisticsReducer = statisticsSlice.reducer;
export const {} = statisticsSlice.actions;
