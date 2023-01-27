import { ScoreKey, Player, ScoreValue } from "../logic/models";
import {
    getAvailableOptions,
    hasPlayerUpperBonus,
    isUpperBonusAchievable,
    totalLowerScore,
    totalScore,
    totalUpperScore,
    upperScore,
} from "../logic/logic";
import t from "../translations";
import { useAppDispatch, useAppSelector } from "../store/store";
import { endTurnThunk } from "../store/game";
import { selectCurrentPlayer, selectWinner } from "../store/selectors";

const UpperSectionScoreKeys: ScoreKey[] = [
    "ones",
    "twos",
    "threes",
    "fours",
    "fives",
    "sixes",
];
const LowerSectionScoreKeys: ScoreKey[] = [
    "threeOfAKind",
    "fourOfAKind",
    "fullHouse",
    "smallStraight",
    "largeStraight",
    "chance",
    "yahtzee",
];

function TableHeader() {
    let classes =
        "overflow-ellipsis overflow-hidden whitespace-nowrap border-black dark:border-gray-100";
    return (
        <>
            <div className="w-full h-full border-b-2 border-black dark:border-gray-100" />
            {UpperSectionScoreKeys.map((sk) => (
                <div className={classes}>{t(sk)}</div>
            ))}
            <div className={classes + " border-t-2"}>
                {t("scoreBoard_UpperScore")}
            </div>
            <div className={classes}>{t("scoreBoard_UpperBonus")}</div>
            <div className={classes + " border-b-2"}>
                {t("scoreBoard_TotalUpperScore")}
            </div>
            {LowerSectionScoreKeys.map((sk) => (
                <div className={classes}>{t(sk)}</div>
            ))}
            <div className={classes + " border-t-2"}>
                {t("scoreBoard_TotalLowerSection")}
            </div>
            <div className={classes + " border-b-2"}>
                {t("scoreBoard_TotalUpperSection")}
            </div>
            <div className={classes}>{t("scoreBoard_GrandTotal")}</div>
        </>
    );
}

function Scores(props: { player: Player }) {
    const { player } = props;
    const dispatch = useAppDispatch();
    const currentPlayer = useAppSelector(selectCurrentPlayer);
    const winner = useAppSelector(selectWinner);
    const dice = useAppSelector((state) => state.game.dice);
    const rollCount = useAppSelector((state) => state.game.rollCount);
    const availableOptions = getAvailableOptions(currentPlayer, dice);
    let classes =
        "justify-self-center border-l-2 h-full w-full text-center flex justify-center items-center border-black dark:border-gray-100";

    if (player === winner) {
        classes += " bg-green-100 dark:bg-green-700";
    }

    function selectedOption(option: ScoreKey, strike: boolean) {
        dispatch(endTurnThunk({ option, strike }));
    }

    function ScoreCell(props: { score: ScoreValue; endTurnOption: ScoreKey }) {
        if (props.score === "strike") {
            return <>{"-"}</>;
        }

        if (props.score !== "not-set") {
            return <>{props.score}</>;
        }

        if (player !== currentPlayer || winner !== null) {
            return null;
        }

        if (rollCount === 0) {
            return null;
        }

        const disableEnterButton =
            availableOptions.find((opt) => opt === props.endTurnOption) ===
            undefined;

        return (
            <>
                <button
                    className={
                        "enabled:bg-green-500 disabled:bg-green-200 dark:enabled:bg-green-600 dark:disabled:bg-green-300 disabled:cursor-not-allowed text-white rounded px-3 mr-2"
                    }
                    disabled={disableEnterButton}
                    onClick={() => selectedOption(props.endTurnOption, false)}
                >
                    {t("scoreBoard_Enter")}
                </button>
                <button
                    className={"bg-red-400 dark:bg-red-500 text-white rounded px-3 ml-2"}
                    onClick={() => selectedOption(props.endTurnOption, true)}
                >
                    {t("scoreBoard_Strike")}
                </button>
            </>
        );
    }

    return (
        <>
            <div className={classes + " border-b-2"}>{player.name}</div>
            {UpperSectionScoreKeys.map((sk) => (
                <div className={classes}>
                    <ScoreCell score={player[sk]} endTurnOption={sk} />
                </div>
            ))}
            <div className={classes + " border-t-2"}>{upperScore(player)}</div>
            <div className={classes}>
                {isUpperBonusAchievable(player)
                    ? hasPlayerUpperBonus(player)
                        ? "35"
                        : ""
                    : "0"}
            </div>
            <div className={classes + " border-b-2"}>
                {totalUpperScore(player)}
            </div>
            {LowerSectionScoreKeys.map((sk) => (
                <div className={classes}>
                    <ScoreCell score={player[sk]} endTurnOption={sk} />
                </div>
            ))}
            <div className={classes + " border-t-2"}>
                {totalLowerScore(player)}
            </div>
            <div className={classes + " border-b-2"}>
                {totalUpperScore(player)}
            </div>
            <div className={classes}>{totalScore(player)}</div>
        </>
    );
}

export default function ScoreBoard(props: { winner?: Player }) {
    const players = useAppSelector((state) => state.game.players);
    return (
        <div
            className="grid grid-flow-col bg-white dark:bg-gray-600 dark:text-gray-100 items-center p-1 md:p-10 rounded md:rounded-lg shadow-lg"
            style={{
                gridTemplateRows: "4em repeat(19, minmax(0, 1fr))",
                gridTemplateColumns: "10em",
            }}
        >
            <TableHeader />
            {players.map((p, i) => (
                <Scores key={i} player={p} />
            ))}
        </div>
    );
}
