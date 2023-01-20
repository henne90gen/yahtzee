import { EndTurnOption, Player } from "./models";
import {
    getAvailableOptions,
    hasPlayerUpperBonus,
    isUpperBonusAchievable,
    totalLowerScore,
    totalScore,
    totalUpperScore,
    upperScore,
} from "./logic";
import t from "./translations";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store/store";
import { endTurnThunk } from "./store/game";
import { selectCurrentPlayer, selectWinner } from "./store/selectors";

function TableHeader() {
    let classes =
        "overflow-ellipsis overflow-hidden whitespace-nowrap border-black";
    return (
        <>
            <div className="w-full h-full border-b-2 border-black" />
            <div className={classes}>{t("ones")}</div>
            <div className={classes}>{t("twos")}</div>
            <div className={classes}>{t("threes")}</div>
            <div className={classes}>{t("fours")}</div>
            <div className={classes}>{t("fives")}</div>
            <div className={classes + " border-b-2"}>{t("sixes")}</div>
            <div className={classes}>{t("scoreBoard_UpperScore")}</div>
            <div className={classes}>{t("scoreBoard_UpperBonus")}</div>
            <div className={classes + " border-b-2"}>
                {t("scoreBoard_TotalUpperScore")}
            </div>
            <div className={classes}>{t("threeOfAKind")}</div>
            <div className={classes}>{t("fourOfAKind")}</div>
            <div className={classes}>{t("fullHouse")}</div>
            <div className={classes}>{t("smallStraight")}</div>
            <div className={classes}>{t("largeStraight")}</div>
            <div className={classes}>{t("chance")}</div>
            <div className={classes + " border-b-2"}>{t("yahtzee")}</div>
            <div className={classes}>{t("scoreBoard_TotalLowerSection")}</div>
            <div className={classes + " border-b-2"}>
                {t("scoreBoard_TotalUpperSection")}
            </div>
            <div className={classes}>{t("scoreBoard_GrandTotal")}</div>
        </>
    );
}

function Scores(props: { player: Player }) {
    const { player } = props;
    const dispatch = useDispatch();
    const currentPlayer = useSelector(selectCurrentPlayer);
    const winner = useSelector(selectWinner);
    const dice = useSelector((state: RootState) => state.game.dice);
    const rollCount = useSelector((state: RootState) => state.game.rollCount);
    const availableOptions = getAvailableOptions(currentPlayer, dice);
    let classes =
        "justify-self-center border-l-2 h-full w-full text-center flex justify-center items-center border-black";

    if (player === winner) {
        classes += " bg-green-100";
    }

    function selectedOption(option: EndTurnOption, strike: boolean) {
        dispatch(endTurnThunk({ option, strike }));
    }

    function ScoreCell(props: {
        score: number | null;
        endTurnOption: EndTurnOption;
    }) {
        if (props.score !== null) {
            return <>{props.score}</>;
        }

        if (player !== currentPlayer || player === winner) {
            return null;
        }

        const showEnterButton =
            availableOptions.find((opt) => opt === props.endTurnOption) !==
            undefined;
        if (rollCount === 0) {
            return null;
        }

        return (
            <>
                {showEnterButton ? (
                    <button
                        className={"bg-green-500 text-white rounded px-3 mr-2"}
                        onClick={() =>
                            selectedOption(props.endTurnOption, false)
                        }
                    >
                        Enter
                    </button>
                ) : null}
                <button
                    className={"bg-red-400 text-white rounded px-3 ml-2"}
                    onClick={() => selectedOption(props.endTurnOption, true)}
                >
                    Strike
                </button>
            </>
        );
    }

    return (
        <>
            <div className={classes + " border-b-2"}>{player.name}</div>
            <div className={classes}>
                <ScoreCell score={player.ones} endTurnOption={"ones"} />
            </div>
            <div className={classes}>
                <ScoreCell score={player.twos} endTurnOption={"twos"} />
            </div>
            <div className={classes}>
                <ScoreCell score={player.threes} endTurnOption={"threes"} />
            </div>
            <div className={classes}>
                <ScoreCell score={player.fours} endTurnOption={"fours"} />
            </div>
            <div className={classes}>
                <ScoreCell score={player.fives} endTurnOption={"fives"} />
            </div>
            <div className={classes + " border-b-2"}>
                <ScoreCell score={player.sixes} endTurnOption={"sixes"} />
            </div>
            <div className={classes}>{upperScore(player)}</div>
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
            <div className={classes}>
                <ScoreCell
                    score={player.threeOfAKind}
                    endTurnOption={"threeOfAKind"}
                />
            </div>
            <div className={classes}>
                <ScoreCell
                    score={player.fourOfAKind}
                    endTurnOption={"fourOfAKind"}
                />
            </div>
            <div className={classes}>
                <ScoreCell
                    score={player.fullHouse}
                    endTurnOption={"fullHouse"}
                />
            </div>
            <div className={classes}>
                <ScoreCell
                    score={player.smallStraight}
                    endTurnOption={"smallStraight"}
                />
            </div>
            <div className={classes}>
                <ScoreCell
                    score={player.largeStraight}
                    endTurnOption={"largeStraight"}
                />
            </div>
            <div className={classes}>
                <ScoreCell score={player.chance} endTurnOption={"chance"} />
            </div>
            <div className={classes + " border-b-2"}>
                <ScoreCell score={player.yahtzee} endTurnOption={"yahtzee"} />
            </div>
            <div className={classes}>{totalLowerScore(player)}</div>
            <div className={classes + " border-b-2"}>
                {totalUpperScore(player)}
            </div>
            <div className={classes}>{totalScore(player)}</div>
        </>
    );
}

export default function ScoreBoard(props: { winner?: Player }) {
    const players = useSelector((state: RootState) => state.game.players);
    return (
        <div
            className="flex-1 grid grid-flow-col bg-white items-center w-full sm:w-7/8 sm:w-3/4 p-1 md:p-10 rounded md:rounded-lg shadow-lg"
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
