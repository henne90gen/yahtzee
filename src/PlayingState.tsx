import {AllEndTurnOptions, Die, EndTurnOption, Player, PlayerName} from "./models";
import React, {useState} from "react";
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
    return (
        <>
            <div/>
            <div>Upper Section</div>
            <div>Ones</div>
            <div>Twos</div>
            <div>Threes</div>
            <div>Fours</div>
            <div>Fives</div>
            <div>Sixes</div>
            <div>Total Score</div>
            <div>Bonus</div>
            <div>Total of Upper Section</div>
            <div>Lower Section</div>
            <div>3 of a kind</div>
            <div>4 of a kind</div>
            <div>Full House</div>
            <div>SM Straight</div>
            <div>LG Straight</div>
            <div>Chance</div>
            <div>Yahtzee</div>
            <div>Total of Lower Section</div>
            <div>Total of Upper Section</div>
            <div>Grand Total</div>
        </>
    );
}

function Scores(props: { player: Player }) {
    const {player} = props;
    return (
        <>
            <div>{player.name}</div>
            <div/>
            <div>{player.ones}</div>
            <div>{player.twos}</div>
            <div>{player.threes}</div>
            <div>{player.fours}</div>
            <div>{player.fives}</div>
            <div>{player.sixes}</div>
            <div>{upperScore(player)}</div>
            <div>{isUpperBonusAchievable(player) ? (hasPlayerUpperBonus(player) ? '35' : '') : '0'}</div>
            <div>{totalUpperScore(player)}</div>
            <div/>
            <div>{player.threeOfAKind}</div>
            <div>{player.fourOfAKind}</div>
            <div>{player.fullHouse}</div>
            <div>{player.smallStraight}</div>
            <div>{player.largeStraight}</div>
            <div>{player.chance}</div>
            <div>{player.yahtzee}</div>
            <div>{totalLowerScore(player)}</div>
            <div>{totalUpperScore(player)}</div>
            <div>{totalScore(player)}</div>
        </>
    );
}

function ScoreBoard(props: { players: Player[] }) {
    const {players} = props;
    return (
        <div
            className="grid grid-flow-col bg-gray-300"
            style={{
                gridTemplateRows: 'repeat(22, minmax(0, 1fr))',
            }}
        >
            <TableHeader/>
            {players.map((p, i) => (
                <Scores key={i} player={p}/>
            ))}
        </div>
    );
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
        <div>
            {dice.map((d, i) => (
                <div key={i}>
                    <input
                        type="checkbox"
                        checked={d.locked !== 'unlocked'}
                        disabled={d.locked === 'permanently-locked'}
                        onChange={() => {
                            onDieLockChange(i);
                        }}
                    />
                    {d.value === 0 ? '?' : d.value}
                </div>
            ))}
        </div>
    );
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
    const renderedStrike = <select defaultValue="" onChange={(event) => {
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

    return (
        <div>
            <div>{currentPlayer.name}</div>
            <button
                className="bg-green-400"
                disabled={rollCount === 3}
                onClick={onRollDiceClick}
            >
                Roll Dice
            </button>
            <div>{rollCount}</div>
            <Dice
                dice={dice}
                onDieLockChange={(index) => {
                    setDice(toggleLock(dice, index));
                }}
            />
            {renderedOptions}
            {rollCount === 0 ? null : renderedStrike}
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
        <div>
            <ScoreBoard players={players}/>
            <PlayArea currentPlayer={players[currentPlayerIndex]} endTurn={endTurn}/>
            <button onClick={() => {
                playerHasWon(players[currentPlayerIndex])
            }}>
                Current Player Wins
            </button>
        </div>
    );
}