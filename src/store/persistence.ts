import { Dispatch, MiddlewareAPI } from "@reduxjs/toolkit";
import { RootState } from "../logic/models";
import { initialGameState } from "./game";
import { initialSettings } from "./settings";
import { initialStatistics } from "./statistics";

const GAME_STATE_KEY = "yahtzee-game-state";
const GAME_STATE_VERSION_KEY = "yahtzee-game-state-version";
const CURRENT_VERSION = 1;

function initialData(): RootState {
    return {
        game: initialGameState(),
        settings: initialSettings(),
        statistics: initialStatistics(),
    };
}

export function loadFromLocalStorage(): RootState {
    let versionStr = localStorage.getItem(GAME_STATE_VERSION_KEY);
    let version = 0;
    if (versionStr !== null) {
        try {
            version = parseInt(versionStr);
        } catch (e) {
            return initialData();
        }
    }

    const serializedState = localStorage.getItem(GAME_STATE_KEY);
    if (serializedState === null) {
        return initialData();
    }

    try {
        const state = JSON.parse(serializedState);

        if (version <= 0) {
            // migrate from v0 to v1
            state.settings.theme = "light";
        }

        return state;
    } catch (e) {
        console.warn(e);
        return initialData();
    }
}

export function saveToLocalStorage(state: RootState) {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem(GAME_STATE_KEY, serializedState);
        localStorage.setItem(
            GAME_STATE_VERSION_KEY,
            CURRENT_VERSION.toString()
        );
    } catch (e) {
        console.warn(e);
    }
}

export const localStorageMiddleware =
    (api: MiddlewareAPI<Dispatch, RootState>) =>
    (next: Dispatch) =>
    (action: any) => {
        const result = next(action);
        saveToLocalStorage(api.getState());
        return result;
    };
