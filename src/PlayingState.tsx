import {AllEndTurnOptions, Die, EndTurnOption, Player, PlayerName} from "./models";
import React, {ReactElement, useState} from "react";
import {
    getAvailableOptions,
    getWinningPlayer, hasPlayerUpperBonus,
    initDice,
    initPlayers, isUpperBonusAchievable, playerCanStrike,
    rollDice, toggleLock, totalLowerScore, totalScore, totalUpperScore,
    updateScore,
    updateScoreStrike, upperScore
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

function ScoreBoard(props: { players: Player[] }) {
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

function topLeft(value: number) {
    return value === 2 || value === 4 || value === 5 || value === 6;
}

function topRight(value: number) {
    return value === 3 || value === 4 || value === 5 || value === 6;
}

function middleLeft(value: number) {
    return value === 6;
}

function middle(value: number) {
    return value === 1 || value === 3 || value === 5;
}

function middleRight(value: number) {
    return value === 6;
}

function bottomLeft(value: number) {
    return value === 3 || value === 4 || value === 5 || value === 6;
}

function bottomRight(value: number) {
    return value === 2 || value === 4 || value === 5 || value === 6;
}

function DieSvg(props: { die: Die, onDieLockChange: () => void }) {
    const {die, onDieLockChange} = props;
    const {value, locked} = die;
    const dots: ReactElement[] = [];

    let color = "black";
    if (locked === "locked") {
        // TODO use a more beautiful shade of blue
        color = "blue";
    } else if (locked === "permanently-locked") {
        color = "gray";
    }

    if (topLeft(value)) {
        dots.push(<circle key={1} cx={25} cy={25} r={10} fill={color}/>)
    }
    if (topRight(value)) {
        dots.push(<circle key={2} cx={75} cy={25} r={10} fill={color}/>)
    }
    if (middleLeft(value)) {
        dots.push(<circle key={3} cx={25} cy={50} r={10} fill={color}/>)
    }
    if (middle(value)) {
        dots.push(<circle key={4} cx={50} cy={50} r={10} fill={color}/>)
    }
    if (middleRight(value)) {
        dots.push(<circle key={5} cx={75} cy={50} r={10} fill={color}/>)
    }
    if (bottomLeft(value)) {
        dots.push(<circle key={6} cx={25} cy={75} r={10} fill={color}/>)
    }
    if (bottomRight(value)) {
        dots.push(<circle key={7} cx={75} cy={75} r={10} fill={color}/>)
    }

    return <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24" onClick={(event => {
        event.preventDefault();
        onDieLockChange();
    })}>
        <path d="M 10 5 H 90 A 5 5 0 0 1 95 10 V 90 A 5 5 0 0 1 90 95 H 10 A 5 5 0 0 1 5 90 V 10 A 5 5 0 0 1 10 5"
              fill="white" stroke={color}/>
        {dots}
    </svg>;
}

function Dice(props: {
    dice: Die[];
    onDieLockChange: (index: number) => void;
}) {
    const {dice, onDieLockChange} = props;
    if (dice === null) {
        return null;
    }

    return (
        <div className="grid grid-cols-5">
            {dice.map((d, i) => (
                <div key={i} className="px-2">
                    {d.value === 0 ? '?' : <DieSvg die={d} onDieLockChange={() => onDieLockChange(i)}/>}
                </div>
            ))}
        </div>
    );
}

function StrikeSelector(props: { currentPlayer: Player, rollCount: number, selectedOption: (option: EndTurnOption, strike: boolean) => void }) {
    const {currentPlayer, rollCount, selectedOption} = props;
    if (rollCount === 0) {
        return null;
    }

    return <select defaultValue="" onChange={(event) => {
        event.preventDefault();
        selectedOption(event.currentTarget.value as EndTurnOption, true);
    }} className="bg-red-300 rounded p-2 m-2">
        <option value="" disabled>Strike something</option>
        {AllEndTurnOptions.filter(option => playerCanStrike(currentPlayer, option))
            .map((option, i) => {
                return <option key={i} value={option}>{option}</option>
            })
        }
    </select>;
}

function DiceOptions(props: { currentPlayer: Player, dice: Die[], selectedOption: (option: EndTurnOption, strike: boolean) => void }) {
    const {currentPlayer, dice, selectedOption} = props;
    const renderedOptions = getAvailableOptions(currentPlayer, dice)
        .map((option, i) => {
            return <button
                key={i}
                className="bg-green-400 rounded p-2 m-2"
                onClick={(event) => {
                    event.preventDefault();
                    selectedOption(option, false);
                }}
            >
                {option}
            </button>
        });

    return <div>
        {renderedOptions}
    </div>;
}

function PlayArea(props: { currentPlayer: Player, endTurn: (option: EndTurnOption, dice: Die[], strike: boolean) => void }) {
    const {currentPlayer, endTurn} = props;
    const [dice, setDice] = useState<Die[]>(initDice());
    const [rollCount, setRollCount] = useState<number>(0);

    const onRollDiceClick = (event: React.MouseEvent) => {
        event.preventDefault();
        const newRollCount = rollCount + 1;
        setDice(rollDice(dice, newRollCount));
        setRollCount(newRollCount);
    };

    function selectedOption(option: EndTurnOption, strike: boolean) {
        endTurn(option, dice, strike);
        setDice(initDice());
        setRollCount(0);
    }

    const rollResults = <>
        <div className="text-center">Roll {rollCount}</div>
        <Dice
            dice={dice}
            onDieLockChange={(index) => {
                setDice(toggleLock(dice, index));
            }}
        />
        <DiceOptions
            currentPlayer={currentPlayer}
            dice={dice}
            selectedOption={selectedOption}
        />
        <StrikeSelector
            currentPlayer={currentPlayer}
            rollCount={rollCount}
            selectedOption={selectedOption}
        />
    </>

    const rollButtonDisabled = rollCount === 3;
    let rollButtonColor = "bg-green-500";
    if (rollButtonDisabled) {
        rollButtonColor = "bg-green-300";
    }
    return (
        <div
            className="grid gap-2 justify-items-center justify-center bg-white w-full sm:w-7/8 sm:w-3/4 mt-3 py-4 px-3 rounded md:rounded-lg shadow-lg">
            <div className="text-center text-2xl">{currentPlayer.name}</div>
            <button
                className={rollButtonColor + " w-48 py-2 rounded-xl text-white"}
                disabled={rollButtonDisabled}
                onClick={onRollDiceClick}
            >
                Roll Dice
            </button>
            {rollCount === 0 ? null : rollResults}
        </div>
    );
}

export default function PlayingState(props: { playerNames: PlayerName[], playerHasWon: (player: Player) => void }) {
    const {playerNames, playerHasWon} = props;
    const [players, setPlayers] = useState(initPlayers(playerNames));
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)

    function endTurn(option: EndTurnOption, dice: Die[], strike: boolean) {
        if (strike) {
            updateScoreStrike(players[currentPlayerIndex], option)
        } else {
            updateScore(players[currentPlayerIndex], option, dice);
        }
        setPlayers(Array.of(...players));

        let tmp = currentPlayerIndex
        tmp++;
        tmp %= players.length;
        setCurrentPlayerIndex(tmp);

        const winningPlayer = getWinningPlayer(players);
        if (winningPlayer !== null) {
            playerHasWon(winningPlayer);
        }
    }

    return (
        <div className="flex flex-col items-center p-2 sm:p-0 sm:py-5 md:py-10">
            <ScoreBoard players={players}/>
            <PlayArea currentPlayer={players[currentPlayerIndex]} endTurn={endTurn}/>
        </div>
    );
}
