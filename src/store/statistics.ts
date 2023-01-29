import { CaseReducer, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GameStatistics, StatisticsData } from "../logic/models";

export function initialStatistics(): StatisticsData {
    return { games: [] };
}

interface StatisticsReducers {
    [K: string]: CaseReducer<StatisticsData, any>;

    saveGameStatistics: CaseReducer<
        StatisticsData,
        PayloadAction<GameStatistics>
    >;
}

const statisticsSlice = createSlice<
    StatisticsData,
    StatisticsReducers,
    "statistics"
>({
    name: "statistics",
    initialState: initialStatistics(),
    reducers: {
        saveGameStatistics: (
            state: StatisticsData,
            action: PayloadAction<GameStatistics>
        ) => {
            state.games.push(action.payload);
        },
    },
});

export const statisticsReducer = statisticsSlice.reducer;
export const { saveGameStatistics } = statisticsSlice.actions;
