import {totalScore} from "../logic";
import React from "react";
import ScoreBoard from "../ScoreBoard";
import {useDispatch, useSelector} from "react-redux";
import {newGame, RootState} from "../store";
import t from "../translations";

function WinnerCard() {
    const dispatch = useDispatch();
    const players = useSelector((state: RootState) => state.game.players)
    const winningPlayerIndex = useSelector((state: RootState) => state.game.winningPlayerIndex!)
    const winningPlayer = players[winningPlayerIndex];
    return <div
        className="flex-1 grid grid-flow-row gap-4 justify-center bg-white items-center w-full sm:w-7/8 sm:w-3/4 mb-3 p-1 md:p-10 rounded md:rounded-lg shadow-lg">
        <div className="text-center text-3xl font-bold">{winningPlayer.name} {t("finished_Wins")}</div>
        <div className="text-center">{totalScore(winningPlayer)} {t("finished_Points")}</div>
        <div className="flex justify-center">
            <button
                className="bg-green-500 text-white rounded px-3 py-2"
                onClick={() => dispatch(newGame())}
            >
                {t("finished_NewGame")}
            </button>
        </div>
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
