import React from "react";
import {Player} from "./models";
import {
    hasPlayerUpperBonus,
    isUpperBonusAchievable,
    totalLowerScore,
    totalScore,
    totalUpperScore,
    upperScore
} from "./logic";
import t from "./translations";

function TableHeader() {
    const classes = "overflow-ellipsis overflow-hidden whitespace-nowrap border-black";
    return (
        <>
            <div className="w-full h-full border-b-2 border-black"/>
            <div className={classes}>{t("ones")}</div>
            <div className={classes}>{t("twos")}</div>
            <div className={classes}>{t("threes")}</div>
            <div className={classes}>{t("fours")}</div>
            <div className={classes}>{t("fives")}</div>
            <div className={classes + " border-b-2"}>{t("sixes")}</div>
            <div className={classes}>{t("scoreBoard_UpperScore")}</div>
            <div className={classes}>{t("scoreBoard_UpperBonus")}</div>
            <div className={classes + " border-b-2"}>{t("scoreBoard_TotalUpperScore")}</div>
            <div className={classes}>{t("threeOfAKind")}</div>
            <div className={classes}>{t("fourOfAKind")}</div>
            <div className={classes}>{t("fullHouse")}</div>
            <div className={classes}>{t("smallStraight")}</div>
            <div className={classes}>{t("largeStraight")}</div>
            <div className={classes}>{t("chance")}</div>
            <div className={classes + " border-b-2"}>{t("yahtzee")}</div>
            <div className={classes}>{t("scoreBoard_TotalLowerSection")}</div>
            <div className={classes + " border-b-2"}>{t("scoreBoard_TotalUpperSection")}</div>
            <div className={classes}>{t("scoreBoard_GrandTotal")}</div>
        </>
    );
}

function Scores(props: { player: Player }) {
    const {player} = props;
    const classes = "justify-self-center border-l-2 h-full w-full text-center flex justify-center items-center border-black";
    return (
        <>
            <div className={classes + " border-b-2"}>{player.name}</div>
            <div className={classes}>{player.ones}</div>
            <div className={classes}>{player.twos}</div>
            <div className={classes}>{player.threes}</div>
            <div className={classes}>{player.fours}</div>
            <div className={classes}>{player.fives}</div>
            <div className={classes + " border-b-2"}>{player.sixes}</div>
            <div className={classes}>{upperScore(player)}</div>
            <div
                className={classes}>{isUpperBonusAchievable(player) ? (hasPlayerUpperBonus(player) ? '35' : '') : '0'}</div>
            <div className={classes + " border-b-2"}>{totalUpperScore(player)}</div>
            <div className={classes}>{player.threeOfAKind}</div>
            <div className={classes}>{player.fourOfAKind}</div>
            <div className={classes}>{player.fullHouse}</div>
            <div className={classes}>{player.smallStraight}</div>
            <div className={classes}>{player.largeStraight}</div>
            <div className={classes}>{player.chance}</div>
            <div className={classes + " border-b-2"}>{player.yahtzee}</div>
            <div className={classes}>{totalLowerScore(player)}</div>
            <div className={classes + " border-b-2"}>{totalUpperScore(player)}</div>
            <div className={classes}>{totalScore(player)}</div>
        </>
    );
}

export default function ScoreBoard(props: { players: Player[] }) {
    const {players} = props;
    return (
        <div
            className="flex-1 grid grid-flow-col bg-white items-center w-full sm:w-7/8 sm:w-3/4 p-1 md:p-10 rounded md:rounded-lg shadow-lg"
            style={{
                gridTemplateRows: '4em repeat(19, minmax(0, 1fr))',
                gridTemplateColumns: '10em',
            }}
        >
            <TableHeader/>
            {players.map((p, i) => (
                <Scores key={i} player={p}/>
            ))}
        </div>
    );
}
