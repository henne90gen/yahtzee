import {AllEndTurnOptions, Die, EndTurnOption, GameState, Player, PlayerName} from "../models";
import {
    getAvailableOptions,
    getLeadingPlayerIndex, getWinningPlayerIndex,
    initDice,
    initPlayers, playerCanStrike,
    removeIndexAndUpdateLaterIndices, rollDice, toggleLock, updateScore,
    updateScoreStrike
} from "../logic";
import {CaseReducer} from "@reduxjs/toolkit/src/createReducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {random, randomState} from "../random";

export interface GameData {
    currentState: GameState
    readyState: {
        names: PlayerName[]
        invalidNames: number[]
    }
    players: Player[]
    currentPlayerIndex: number
    dice: Die[]
    rollCount: number
    winningPlayerIndex: number
    randomState: number
}

export function initialState(): GameData {
    return {
        readyState: {names: [{name: "Alice", isAI: false}, {name: "Bob", isAI: false}], invalidNames: []},
        currentState: "ready",
        players: [],
        currentPlayerIndex: 0,
        winningPlayerIndex: 0,
        dice: initDice(),
        rollCount: 0,
        randomState: randomState(new Date().toISOString()),
    }
}

interface GameReducers {
    [K: string]: CaseReducer<GameData, any>

    addPlayerName: CaseReducer<GameData, PayloadAction<PlayerName>>
    removePlayerName: CaseReducer<GameData, PayloadAction<number>>
    updatePlayerName: CaseReducer<GameData, PayloadAction<{ index: number, player: PlayerName }>>
    addInvalidPlayerName: CaseReducer<GameData, PayloadAction<number>>
    removeInvalidPlayerName: CaseReducer<GameData, PayloadAction<number>>
    startGame: CaseReducer<GameData>
    newGame: CaseReducer<GameData>
    endGame: CaseReducer<GameData>
    endTurn: CaseReducer<GameData, PayloadAction<{ option: EndTurnOption, strike: boolean }>>
    doDiceRoll: CaseReducer<GameData>
    onDieLockChange: CaseReducer<GameData, PayloadAction<number>>
}

function doAiTurn(state: GameData) {
    const currentPlayer = state.players[state.currentPlayerIndex];
    if (!currentPlayer.isAI) {
        return;
    }

    function getRandomNumber() {
        const [newRandomState, randomNumber] = random(state.randomState);
        state.randomState = newRandomState;
        return randomNumber;
    }

    for (let i = 0; i < 3; i++) {
        state.dice = rollDice(state.dice, state.rollCount, getRandomNumber);

        const availableOptions = getAvailableOptions(currentPlayer, state.dice);
        if (availableOptions.length !== 0) {
            endTurnFunc(state, {
                option: availableOptions[0],
                strike: false,
            });
            break;
        } else {
            const strikeOptions = AllEndTurnOptions.filter(option => playerCanStrike(currentPlayer, option));
            endTurnFunc(state, {
                option: strikeOptions[0],
                strike: true,
            });
            break;
        }
    }
}

function endTurnFunc(state: GameData, payload: { option: EndTurnOption, strike: boolean }) {
    const {option, strike} = payload;

    if (strike) {
        updateScoreStrike(state.players[state.currentPlayerIndex], option)
    } else {
        updateScore(state.players[state.currentPlayerIndex], option, state.dice);
    }

    state.dice = initDice();
    state.rollCount = 0;
    let tmp = state.currentPlayerIndex
    tmp++;
    tmp %= state.players.length;
    state.currentPlayerIndex = tmp;

    const winningPlayer = getWinningPlayerIndex(state.players);
    if (winningPlayer !== null) {
        state.winningPlayerIndex = winningPlayer;
        state.currentState = "finished";
        return;
    }

    doAiTurn(state);
}

const gameSlice = createSlice<GameData, GameReducers, "game">({
    name: "game",
    initialState: initialState(),
    reducers: {
        addPlayerName: (state, action: PayloadAction<PlayerName>) => {
            state.readyState.names.push(action.payload)
        },
        removePlayerName: (state, action: PayloadAction<number>) => {
            state.readyState.names.splice(action.payload, 1);
        },
        updatePlayerName: (state, action: PayloadAction<{ index: number, player: PlayerName }>) => {
            state.readyState.names[action.payload.index] = action.payload.player;
        },
        addInvalidPlayerName: (state, action: PayloadAction<number>) => {
            for (let i of state.readyState.invalidNames) {
                if (i === action.payload) {
                    return
                }
            }
            state.readyState.invalidNames.push(action.payload);
        },
        removeInvalidPlayerName: (state, action: PayloadAction<number>) => {
            state.readyState.invalidNames = removeIndexAndUpdateLaterIndices(state.readyState.invalidNames, action.payload);
        },
        startGame: (state) => {
            state.currentState = "playing";
            state.players = initPlayers(state.readyState.names);

            doAiTurn(state);
        },
        newGame: (state) => {
            state.currentState = "ready";
            state.readyState.invalidNames = [];
            state.winningPlayerIndex = 0;
            state.rollCount = 0;
            state.currentPlayerIndex = 0;
            state.randomState = randomState(new Date().toISOString());
        },
        endGame: (state) => {
            const leadingPlayerIndex = getLeadingPlayerIndex(state.players);
            state.winningPlayerIndex = leadingPlayerIndex!;
            state.currentState = "finished";
        },
        endTurn: (state: GameData, action: PayloadAction<{ option: EndTurnOption, strike: boolean }>) => {
            endTurnFunc(state, action.payload);
        },
        doDiceRoll: (state) => {
            state.rollCount += 1;

            function getRandomNumber() {
                const [newRandomState, randomNumber] = random(state.randomState);
                state.randomState = newRandomState;
                return randomNumber;
            }

            state.dice = rollDice(state.dice, state.rollCount, getRandomNumber);
        },
        onDieLockChange: (state, action: PayloadAction<number>) => {
            state.dice = toggleLock(state.dice, action.payload);
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
    startGame,
    newGame,
    endGame,
    endTurn,
    doDiceRoll,
    onDieLockChange,
} = gameSlice.actions
