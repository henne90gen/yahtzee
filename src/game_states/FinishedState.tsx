import {totalScore} from "../logic";
import React from "react";
import ScoreBoard from "../ScoreBoard";
import {useDispatch, useSelector} from "react-redux";
import {newGame, RootState} from "../store";

function WinnerCard() {
    const dispatch = useDispatch();
    const players = useSelector((state: RootState) => state.game.players)
    const winningPlayerIndex = useSelector((state: RootState) => state.game.winningPlayerIndex!)
    const winningPlayer = players[winningPlayerIndex];
    return <div>
        <div>{winningPlayer.name} with {totalScore(winningPlayer)} points</div>
        <button onClick={() => dispatch(newGame())}>New Game</button>
    </div>
}

export default function FinishedState() {
    const players = useSelector((state: RootState) => state.game.players!)
    return (
        <div className="flex flex-col items-center p-2 sm:p-0 sm:py-5 md:py-10">
            <WinnerCard/>
            <ScoreBoard players={players}/>
        </div>
    );
}
