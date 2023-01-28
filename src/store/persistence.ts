import { Dispatch, MiddlewareAPI } from "@reduxjs/toolkit";
import { GameData, initialGameState } from "./game";
import { initialSettings, SettingsData } from "./settings";

const GAME_STATE_KEY = "yahtzee-game-state";
const GAME_STATE_VERSION_KEY = "yahtzee-game-state-version";
const CURRENT_VERSION = 1;

type Data = { game: GameData; settings: SettingsData };

function initialData(): Data {
    return { game: initialGameState(), settings: initialSettings() };
}

export function loadFromLocalStorage(): Data {
    let versionStr = localStorage.getItem(GAME_STATE_VERSION_KEY);
    let version = 0;
    if (versionStr !== null) {
        version = parseInt(versionStr);
    }

    const serializedState = localStorage.getItem(GAME_STATE_KEY);
    if (serializedState === null) {
        return initialData();
    }

    if (version === 0) {
    }

    try {
        const result = JSON.parse(serializedState);
        // TODO check that all properties are present, otherwise create a fresh initial state
        return result;
    } catch (e) {
        console.warn(e);
        return initialData();
    }
}

export function saveToLocalStorage(state: Data) {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem(GAME_STATE_KEY, serializedState);
    } catch (e) {
        console.warn(e);
    }
}

export const localStorageMiddleware =
    (api: MiddlewareAPI<Dispatch, { game: GameData }>) =>
    (next: Dispatch) =>
    (action: any) => {
        const result = next(action);
        saveToLocalStorage(api.getState());
        return result;
    };
