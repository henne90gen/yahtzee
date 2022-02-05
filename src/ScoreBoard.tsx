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

function TableHeader() {
    const classes = "overflow-ellipsis overflow-hidden whitespace-nowrap";
    return (
        <>
            <div className="w-full h-full border-b-2 border-black"/>
            <div className={classes}>Upper Section</div>
            <div className={classes}>Ones</div>
            <div className={classes}>Twos</div>
            <div className={classes}>Threes</div>
            <div className={classes}>Fours</div>
            <div className={classes}>Fives</div>
            <div className={classes}>Sixes</div>
            <div className={classes}>Total Score</div>
            <div className={classes}>Bonus</div>
            <div className={classes}>Total Upper Section</div>
            <div className={classes}>Lower Section</div>
            <div className={classes}>3 of a kind</div>
            <div className={classes}>4 of a kind</div>
            <div className={classes}>Full House</div>
            <div className={classes}>SM Straight</div>
            <div className={classes}>LG Straight</div>
            <div className={classes}>Chance</div>
            <div className={classes}>Yahtzee</div>
            <div className={classes}>Total Lower Section</div>
            <div className={classes}>Total Upper Section</div>
            <div className={classes}>Grand Total</div>
        </>
    );
}

function Scores(props: { player: Player }) {
    const {player} = props;
    const classes = "justify-self-center border-l-2 h-full w-full text-center flex justify-center items-center border-black";
    return (
        <>
            <div className={classes + " border-b-2"}>{player.name}</div>
            <div className={classes}/>
            <div className={classes}>{player.ones}</div>
            <div className={classes}>{player.twos}</div>
            <div className={classes}>{player.threes}</div>
            <div className={classes}>{player.fours}</div>
            <div className={classes}>{player.fives}</div>
            <div className={classes}>{player.sixes}</div>
            <div className={classes}>{upperScore(player)}</div>
            <div
                className={classes}>{isUpperBonusAchievable(player) ? (hasPlayerUpperBonus(player) ? '35' : '') : '0'}</div>
            <div className={classes}>{totalUpperScore(player)}</div>
            <div className={classes}/>
            <div className={classes}>{player.threeOfAKind}</div>
            <div className={classes}>{player.fourOfAKind}</div>
            <div className={classes}>{player.fullHouse}</div>
            <div className={classes}>{player.smallStraight}</div>
            <div className={classes}>{player.largeStraight}</div>
            <div className={classes}>{player.chance}</div>
            <div className={classes}>{player.yahtzee}</div>
            <div className={classes}>{totalLowerScore(player)}</div>
            <div className={classes}>{totalUpperScore(player)}</div>
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
                gridTemplateRows: '4em repeat(21, minmax(0, 1fr))',
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
