import {Player} from "./models";
import {totalScore} from "./logic";
import React from "react";

export default function FinishedState(props: { winningPlayer: Player, newGame: () => void }) {
    const {winningPlayer, newGame} = props;
    return <div>
        <div>{winningPlayer.name} with {totalScore(winningPlayer)} points</div>
        <button onClick={newGame}>New Game</button>
    </div>;
}
