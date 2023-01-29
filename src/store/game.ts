import {
    AllScoreKeys,
    Die,
    ScoreKey,
    GameState,
    Player,
    PlayerName,
} from "../logic/models";
import { createSlice, PayloadAction, CaseReducer } from "@reduxjs/toolkit";
import {
    getAvailableOptions,
    getLeadingPlayerIndex,
    getWinningPlayerIndex,
    initDice,
    initPlayers,
    playerCanStrike,
    removeIndexAndUpdateLaterIndices,
    rollDice,
    toggleLock,
    updateScore,
    updateScoreStrike,
} from "../logic/logic";
import { random, randomState } from "../logic/random";
import { RootState } from "../logic/models";
import { AppDispatch } from "./store";
import { saveGameStatistics } from "./statistics";

export interface GameData {
    currentState: GameState;
    readyState: {
        names: PlayerName[];
        invalidNames: number[];
    };
    players: Player[];
    currentPlayerIndex: number;
    dice: Die[];
    rollCount: number;
    winningPlayerIndex: number;
    randomState: number;
}

export function initialGameState(): GameData {
    return {
        readyState: {
            names: [
                { name: "Alice", isAI: false },
                { name: "Bob", isAI: false },
            ],
            invalidNames: [],
        },
        currentState: "ready",
        players: [],
        currentPlayerIndex: 0,
        winningPlayerIndex: 0,
        dice: initDice(),
        rollCount: 0,
        randomState: randomState(new Date().toISOString()),
    };
}

interface GameReducers {
    [K: string]: CaseReducer<GameData, any>;

    addPlayerName: CaseReducer<GameData, PayloadAction<PlayerName>>;
    removePlayerName: CaseReducer<GameData, PayloadAction<number>>;
    updatePlayerName: CaseReducer<
        GameData,
        PayloadAction<{ index: number; player: PlayerName }>
    >;
    addInvalidPlayerName: CaseReducer<GameData, PayloadAction<number>>;
    removeInvalidPlayerName: CaseReducer<GameData, PayloadAction<number>>;
    startGame: CaseReducer<GameData>;
    newGame: CaseReducer<GameData>;
    endGame: CaseReducer<GameData>;
    endTurn: CaseReducer<
        GameData,
        PayloadAction<{ option: ScoreKey; strike: boolean }>
    >;
    doDiceRoll: CaseReducer<GameData>;
    onDieLockChange: CaseReducer<GameData, PayloadAction<number>>;
}

async function timeout(t: number, func: () => void): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            func();
            resolve();
        }, t);
    });
}

export function endTurnThunk(payload: { option: ScoreKey; strike: boolean }) {
    return (dispatch: AppDispatch, getState: () => RootState) => {
        dispatch(gameSlice.actions.endTurn(payload));

        const state = getState();
        if (state.game.currentState === "finished") {
            dispatch(
                saveGameStatistics({
                    hasBeenCompleted: true,
                    playerStates: state.game.players,
                })
            );
        }

        dispatch(doAiTurnThunk());
    };
}

function doAiTurnThunk() {
    return async (dispatch: AppDispatch, getState: () => RootState) => {
        const { game } = getState();
        const currentPlayer = game.players[game.currentPlayerIndex];
        if (!currentPlayer.isAI) {
            return;
        }

        for (let i = 0; i < 3; i++) {
            await timeout(1000, () => {
                dispatch(gameSlice.actions.doDiceRoll());
            });

            let hasEndedTurn = false;
            await timeout(1000, () => {
                // TODO implement proper AI here
                const { game } = getState();
                const currentPlayer = game.players[game.currentPlayerIndex];
                const availableOptions = getAvailableOptions(
                    currentPlayer,
                    game.dice
                );
                if (availableOptions.length !== 0) {
                    dispatch(
                        endTurnThunk({
                            option: availableOptions[0],
                            strike: false,
                        })
                    );
                    hasEndedTurn = true;
                } else {
                    const strikeOptions = AllScoreKeys.filter((option) =>
                        playerCanStrike(currentPlayer, option)
                    );
                    dispatch(
                        endTurnThunk({
                            option: strikeOptions[0],
                            strike: true,
                        })
                    );
                    hasEndedTurn = true;
                }
            });
            if (hasEndedTurn) {
                break;
            }
        }
    };
}

function endTurnFunc(
    state: GameData,
    payload: { option: ScoreKey; strike: boolean }
) {
    const { option, strike } = payload;

    if (strike) {
        updateScoreStrike(state.players[state.currentPlayerIndex], option);
    } else {
        updateScore(
            state.players[state.currentPlayerIndex],
            option,
            state.dice
        );
    }

    state.dice = initDice();
    state.rollCount = 0;
    let tmp = state.currentPlayerIndex;
    tmp++;
    tmp %= state.players.length;
    state.currentPlayerIndex = tmp;

    const winningPlayer = getWinningPlayerIndex(state.players);
    if (winningPlayer !== null) {
        state.winningPlayerIndex = winningPlayer;
        state.currentState = "finished";
        return;
    }
}

export function startGameThunk() {
    return (dispatch: AppDispatch) => {
        dispatch(gameSlice.actions.startGame());
        dispatch(doAiTurnThunk());
    };
}

export function tryStartGameThunk() {
    return (dispatch: AppDispatch, getState: () => RootState) => {
        const state = getState().game.readyState;

        if (state.names.length === 0) {
            return;
        }

        let allNamesValid = true;
        for (let i = 0; i < state.names.length; i++) {
            if (state.names[i].name === "") {
                dispatch(addInvalidPlayerName(i));
                allNamesValid = false;
            }
        }
        if (!allNamesValid) {
            return;
        }

        dispatch(startGameThunk());
    };
}

export function endGameThunk() {
    return (dispatch: AppDispatch, getState: () => RootState) => {
        dispatch(gameSlice.actions.endGame());

        const state = getState();
        dispatch(
            saveGameStatistics({
                hasBeenCompleted: false,
                playerStates: state.game.players,
            })
        );
    };
}

const gameSlice = createSlice<GameData, GameReducers, "game">({
    name: "game",
    initialState: initialGameState(),
    reducers: {
        addPlayerName: (state, action: PayloadAction<PlayerName>) => {
            state.readyState.names.push(action.payload);
        },
        removePlayerName: (state, action: PayloadAction<number>) => {
            state.readyState.names.splice(action.payload, 1);
        },
        updatePlayerName: (
            state,
            action: PayloadAction<{ index: number; player: PlayerName }>
        ) => {
            state.readyState.names[action.payload.index] =
                action.payload.player;
        },
        addInvalidPlayerName: (state, action: PayloadAction<number>) => {
            for (let i of state.readyState.invalidNames) {
                if (i === action.payload) {
                    return;
                }
            }
            state.readyState.invalidNames.push(action.payload);
        },
        removeInvalidPlayerName: (state, action: PayloadAction<number>) => {
            state.readyState.invalidNames = removeIndexAndUpdateLaterIndices(
                state.readyState.invalidNames,
                action.payload
            );
        },
        startGame: (state) => {
            state.currentState = "playing";
            state.players = initPlayers(state.readyState.names);
        },
        newGame: (state) => {
            state.currentState = "ready";
            state.readyState.invalidNames = [];
            state.winningPlayerIndex = 0;
            state.rollCount = 0;
            state.currentPlayerIndex = 0;
            state.randomState = randomState(new Date().toISOString());
            state.dice = initDice();
        },
        endGame: (state) => {
            const leadingPlayerIndex = getLeadingPlayerIndex(state.players);
            state.winningPlayerIndex = leadingPlayerIndex!;
            state.currentState = "finished";
        },
        endTurn: (
            state: GameData,
            action: PayloadAction<{ option: ScoreKey; strike: boolean }>
        ) => {
            endTurnFunc(state, action.payload);
        },
        doDiceRoll: (state) => {
            state.rollCount += 1;

            function getRandomNumber() {
                const [newRandomState, randomNumber] = random(
                    state.randomState
                );
                state.randomState = newRandomState;
                return randomNumber;
            }

            state.dice = rollDice(state.dice, state.rollCount, getRandomNumber);
        },
        onDieLockChange: (state, action: PayloadAction<number>) => {
            state.dice = toggleLock(
                state.rollCount,
                state.dice,
                action.payload
            );
        },
    },
});

export const gameReducer = gameSlice.reducer;
export const {
    addPlayerName,
    removePlayerName,
    updatePlayerName,
    addInvalidPlayerName,
    removeInvalidPlayerName,
    // startGame,
    newGame,
    // endGame,
    endTurn,
    doDiceRoll,
    onDieLockChange,
} = gameSlice.actions;
