import { totalScore } from "../logic/logic";
import ScoreBoard from "../components/ScoreBoard";
import { newGame } from "../store/game";
import { useAppDispatch, useAppSelector } from "../store/store";
import { selectWinner } from "../store/selectors";
import t from "../translations";

function WinnerCard() {
    const winner = useAppSelector(selectWinner)!;
    return (
        <div className="flex-1 grid grid-flow-row gap-4 justify-center bg-white items-center w-full sm:w-7/8 sm:w-3/4 mb-3 p-3 md:p-10 rounded md:rounded-lg shadow-lg">
            <div className="text-center text-3xl font-bold">
                {winner.name} {t("finished_Wins")}
            </div>
            <div className="text-center">
                {totalScore(winner)} {t("finished_Points")}
            </div>
        </div>
    );
}

function NewGameCard() {
    const dispatch = useAppDispatch();
    return (
        <div className="grid justify-items-center bg-white items-center w-full sm:w-3/4 mt-3 p-1 sm:p-2 md:p-4 rounded md:rounded-lg shadow-lg">
            <button
                className="bg-green-500 text-white rounded px-3 py-2 my-3"
                onClick={() => dispatch(newGame())}
            >
                {t("finished_NewGame")}
            </button>
        </div>
    );
}

export default function FinishedState() {
    return (
        <div className="flex flex-col items-center p-2 sm:p-0 sm:py-5 md:py-10">
            <WinnerCard />
            <ScoreBoard />
            <NewGameCard />
        </div>
    );
}
