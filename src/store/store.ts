import { configureStore } from "@reduxjs/toolkit";
import { loadFromLocalStorage, localStorageMiddleware } from "./persistence";
import { changeLanguage } from "../translations";
import { settingsReducer } from "./settings";
import { gameReducer } from "./game";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const preloadedState = loadFromLocalStorage();
changeLanguage(preloadedState.settings.language);

export const store = configureStore({
    reducer: {
        game: gameReducer,
        settings: settingsReducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(localStorageMiddleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

type DispatchFunc = () => AppDispatch;
export const useAppDispatch: DispatchFunc = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
