import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { loadFromLocalStorage, localStorageMiddleware } from "./persistence";
import { changeLanguage } from "../translations";
import { settingsReducer } from "./settings";
import { statisticsReducer } from "./statistics";
import { gameReducer } from "./game";
import { RootState } from "../logic/models";

const preloadedState = loadFromLocalStorage();
changeLanguage(preloadedState.settings.language);

export const store = configureStore<RootState>({
    reducer: {
        game: gameReducer,
        statistics: statisticsReducer,
        settings: settingsReducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(localStorageMiddleware) as any, // NOTE "any" fixes a type error here
});

// Infer the `AppDispatch` types from the store itself
export type AppDispatch = typeof store.dispatch;

type DispatchFunc = () => AppDispatch;
export const useAppDispatch: DispatchFunc = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
