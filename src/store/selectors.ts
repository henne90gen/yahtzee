import { Player } from "../logic/models";
import { RootState } from "./store";

export function selectCurrentPlayer(state: RootState): Player {
    const players = state.game.players;
    const currentPlayerIndex = state.game.currentPlayerIndex;
    return players[currentPlayerIndex];
}

export function selectWinner(state: RootState): Player | null {
    if (state.game.currentState !== "finished") {
        return null;
    }

    const players = state.game.players;
    const winningPlayerIndex = state.game.winningPlayerIndex;
    return players[winningPlayerIndex];
}
