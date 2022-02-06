import {configureStore, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {Die, EndTurnOption, GameState, Player, PlayerName} from "./models";
import {getWinningPlayer, initDice, initPlayers, rollDice, toggleLock, updateScore, updateScoreStrike} from "./logic";
import {CaseReducer} from "@reduxjs/toolkit/src/createReducer";
import {loadFromLocalStorage, localStorageMiddleware} from "./persistence";

export interface GameData {
    currentState: GameState
    readyState: {
        names: PlayerName[]
        invalidNames: Set<number>
    }
    players: Player[]
    currentPlayerIndex: number,
    dice: Die[]
    rollCount: number
    winningPlayer: null | Player
}

export function initialState(): GameData {
    return {
        readyState: {names: [{name: "Alice"}, {name: "Bob"}], invalidNames: new Set<number>()},
        currentState: "ready",
        players: [],
        currentPlayerIndex: 0,
        winningPlayer: null,
        dice: initDice(),
        rollCount: 0,
    }
}

interface GameReducers {
    [K: string]: CaseReducer<any, any>

    addPlayerName: CaseReducer<GameData, PayloadAction<PlayerName>>
    removePlayerName: CaseReducer<GameData, PayloadAction<number>>
    updatePlayerName: CaseReducer<GameData, PayloadAction<{ index: number, player: PlayerName }>>
    addInvalidPlayerName: CaseReducer<GameData, PayloadAction<number>>
    removeInvalidPlayerName: CaseReducer<GameData, PayloadAction<number>>
    startGame: CaseReducer<GameData>
    newGame: CaseReducer<GameData>
    playerHasWon: CaseReducer<GameData, PayloadAction<Player>>
    endTurn: CaseReducer<GameData, PayloadAction<{ option: EndTurnOption, dice: Die[], strike: boolean }>>
    doDiceRoll: CaseReducer<GameData>
    onDieLockChange: CaseReducer<GameData, PayloadAction<number>>
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
            state.readyState.invalidNames.add(action.payload)
        },
        removeInvalidPlayerName: (state, action: PayloadAction<number>) => {
            state.readyState.invalidNames.delete(action.payload)
        },
        startGame: (state) => {
            state.currentState = "playing";
            state.players = initPlayers(state.readyState.names);
        },
        newGame: (state) => {
            state.currentState = "ready";
            state.readyState.invalidNames = new Set<number>();
            state.winningPlayer = null;
            state.rollCount = 0;
            state.currentPlayerIndex = 0;
        },
        playerHasWon: (state, action: PayloadAction<Player>) => {
            state.winningPlayer = action.payload;
        },
        endTurn: (state, action: PayloadAction<{ option: EndTurnOption, dice: Die[], strike: boolean }>) => {
            state.dice = initDice();
            state.rollCount = 0;

            const {option, dice, strike} = action.payload;
            if (strike) {
                updateScoreStrike(state.players[state.currentPlayerIndex], option)
            } else {
                updateScore(state.players[state.currentPlayerIndex], option, dice);
            }

            let tmp = state.currentPlayerIndex
            tmp++;
            tmp %= state.players.length;
            state.currentPlayerIndex = tmp;

            const winningPlayer = getWinningPlayer(state.players);
            if (winningPlayer !== null) {
                state.winningPlayer = winningPlayer;
                state.currentState = "finished";
            }
        },
        doDiceRoll: (state) => {
            state.rollCount += 1;
            state.dice = rollDice(state.dice, state.rollCount);
        },
        onDieLockChange: (state, action: PayloadAction<number>) => {
            state.dice = toggleLock(state.dice, action.payload);
        }
    },
});

const gameReducer = gameSlice.reducer;

export const store = configureStore({
    reducer: {
        game: gameReducer
    },
    preloadedState: loadFromLocalStorage(),
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(localStorageMiddleware)
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export const {
    addPlayerName,
    removePlayerName,
    updatePlayerName,
    addInvalidPlayerName,
    removeInvalidPlayerName,
    startGame,
    newGame,
    endTurn,
    doDiceRoll,
    onDieLockChange,
} = gameSlice.actions
