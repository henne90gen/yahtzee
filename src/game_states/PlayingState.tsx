import React from "react";
import ScoreBoard from "../components/ScoreBoard";
import { doDiceRoll, endGameThunk } from "../store/game";
import { useAppDispatch, useAppSelector } from "../store/store";
import t from "../translations";
import { selectCurrentPlayer } from "../store/selectors";
import { Dice } from "../components/Dice";

function PlayArea() {
    const dispatch = useAppDispatch();
    const dice = useAppSelector((state) => state.game.dice);
    const rollCount = useAppSelector((state) => state.game.rollCount);
    const currentPlayer = useAppSelector(selectCurrentPlayer);

    const onRollDiceClick = (event: React.MouseEvent) => {
        event.preventDefault();
        dispatch(doDiceRoll());
    };

    const disabled = rollCount === 0;
    const rollResults = (
        <>
            <div className="text-center">
                {t("playing_RollCount")} {rollCount}/3
            </div>
            <Dice dice={dice} disabled={disabled} />
        </>
    );

    const rollButtonDisabled = rollCount === 3;
    let rollButtonColor = "bg-green-500";
    if (rollButtonDisabled) {
        rollButtonColor = "bg-green-300";
    }
    return (
        <div className="grid gap-2 justify-items-center justify-center bg-white w-full sm:w-7/8 sm:w-3/4 mb-3 py-4 px-3 rounded md:rounded-lg shadow-lg">
            <div className="text-center text-2xl">{currentPlayer.name}</div>
            <button
                className={rollButtonColor + " w-48 py-2 rounded-xl text-white"}
                disabled={rollButtonDisabled}
                onClick={onRollDiceClick}
            >
                {t("playing_RollDice")}
            </button>
            {rollResults}
        </div>
    );
}

function EndGameCard() {
    const dispatch = useAppDispatch();
    return (
        <div className="grid justify-items-center justify-center bg-white w-full sm:w-3/4 mt-3 p-1 sm:p-2 md:p-4 rounded md:rounded-lg shadow-lg">
            <button
                className="bg-red-300 rounded text-gray-700 px-3 py-2 my-3"
                onClick={() => dispatch(endGameThunk())}
            >
                {t("playing_EndGame")}
            </button>
        </div>
    );
}

export default function PlayingState() {
    return (
        <div className="flex flex-col items-center p-2 sm:p-0 sm:py-5 md:py-10">
            <PlayArea />
            <ScoreBoard />
            <EndGameCard />
        </div>
    );
}
