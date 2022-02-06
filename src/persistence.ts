import {Dispatch, MiddlewareAPI} from "@reduxjs/toolkit";
import {GameData, initialState} from "./store";

const GAME_STATE_KEY = "yahtzee-game-state"

export function loadFromLocalStorage(): { game: GameData } {
    try {
        const serialisedState = localStorage.getItem(GAME_STATE_KEY);
        if (serialisedState === null) {
            return {game: initialState()};
        }
        const result = JSON.parse(serialisedState);
        // TODO check that all properties are present, otherwise create a fresh initial state
        return result;
    } catch (e) {
        console.warn(e);
        return {game: initialState()};
    }
}

export function saveToLocalStorage(state: { game: GameData }) {
    try {
        const serialisedState = JSON.stringify(state);
        localStorage.setItem(GAME_STATE_KEY, serialisedState);
    } catch (e) {
        console.warn(e);
    }
}

export const localStorageMiddleware = (api: MiddlewareAPI<Dispatch, { game: GameData }>) => (next: Dispatch) => (action: any) => {
    const result = next(action);
    saveToLocalStorage(api.getState());
    return result;
};
