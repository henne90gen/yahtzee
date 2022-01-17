import React, {useState} from 'react';
import './App.css';
import {Die, GameState, Player, PlayerName} from './models';
import {
    getAvailableOptions,
    hasPlayerUpperBonus,
    initDice,
    initPlayers,
    isUpperBonusAchievable,
    rollDice,
    toggleLock,
    totalLowerScore,
    totalScore,
    totalUpperScore,
    upperScore,
} from './logic';

function TableHeader() {
    return (
        <>
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
                gridTemplateRows: 'repeat(21, minmax(0, 1fr))',
            }}
        >
            <TableHeader/>
            {players.map((p) => (
                <Scores key={p.name} player={p}/>
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
                <div>
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

function PlayArea(props: { currentPlayer: Player }) {
    const {currentPlayer} = props;
    const [dice, setDice] = useState<Die[]>(initDice());
    const [rollCount, setRollCount] = useState<number>(0);

    const onRollDiceClick = (event: React.MouseEvent) => {
        event.preventDefault();
        const newRollCount = rollCount + 1;
        setDice(rollDice(dice, newRollCount));
        setRollCount(newRollCount);
    };

    const renderedOptions = getAvailableOptions(currentPlayer, dice)
        .map(option => {
            return <button
                className="bg-green-400"
                onClick={(event) => {
                    event.preventDefault();
                }}
            >
                {option}
            </button>
        })
    return (
        <div>
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
        </div>
    );
}

function PlayerAvatar(props: { player: PlayerName, updatePlayer: (p: PlayerName) => void, removePlayer: () => void }) {
    const {player, updatePlayer, removePlayer} = props;
    // TODO add avatar picture
    return <div>
        <input
            className="bg-blue-200"
            value={player.name}
            onChange={(event) => {
                event.preventDefault();
                const value = event.target.value;
                updatePlayer({name: value});
            }}
        />
        <button className="p-2 rounded bg-red-300" onClick={(event) => {
            event.preventDefault();
            removePlayer();
        }}>
            -
        </button>
    </div>;
}

function ReadyState(props: { onGameStart: (players: PlayerName[]) => void }) {
    const [players, setPlayers] = useState([{name: "Alice"}, {name: "Bob"}]);
    const renderedPlayers = players.map(
        (p, index) => <PlayerAvatar
            key={index}
            player={p}
            updatePlayer={(newP) => {
                players[index] = newP;
                setPlayers([...players]);
                console.log("Updated players")
            }}
            removePlayer={() => {
                players.splice(index, 1);
                setPlayers([...players]);
                console.log("Removed player")
            }}
        />
    );
    return (
        <div className="grid gap-2 justify-center">
            {renderedPlayers}
            <button className="py-2 px-5 bg-green-300 rounded-lg"
                    onClick={(event) => {
                        event.preventDefault()
                        players.push({name: ""})
                        setPlayers([...players]);
                        console.log("Added player")
                    }}>
                +
            </button>
            <button
                onClick={(event) => {
                    event.preventDefault();
                    props.onGameStart(players);
                }}
            >
                Start Game
            </button>
        </div>
    );
}

function PlayingState(props: { players: Player[] }) {
    const {players} = props;
    const [currentPlayer, setCurrentPlayer] = useState(players[0])
    return (
        <div>
            <ScoreBoard players={players}/>
            <PlayArea currentPlayer={currentPlayer}/>
        </div>
    );
}

function FinishedState() {
    return <div></div>;
}

function App() {
    const [gameState, setGameState] = useState<GameState>('ready');
    const [players, setPlayers] = useState<Player[]>([]);

    function onGameStart(players: PlayerName[]) {
        setGameState('playing');
        setPlayers(initPlayers(players));
    }

    switch (gameState) {
        case 'ready':
            return <ReadyState onGameStart={onGameStart}/>;
        case 'playing':
            return <PlayingState players={players}/>;
        case 'finished':
            return <FinishedState/>;
    }
}

export default App;
