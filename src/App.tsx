import React, {useState} from 'react';
import './App.css';
import {GameState, Player, PlayerName} from './models';
import ReadyState from "./ReadyState";
import PlayingState from "./PlayingState";
import FinishedState from "./FinishedState";

function App() {
    const [gameState, setGameState] = useState<GameState>('ready');
    const [playerNames, setPlayerNames] = useState<PlayerName[]>([{name: "Alice"}, {name: "Bob"}]);
    const [winningPlayer, setWinningPlayer] = useState<Player | null>(null)

    function onGameStart(playerNames: PlayerName[]) {
        setGameState('playing');
        setPlayerNames(playerNames);
    }

    switch (gameState) {
        case 'ready':
            return <ReadyState playerNames={playerNames} onGameStart={onGameStart}/>;
        case 'playing':
            return <PlayingState playerNames={playerNames} playerHasWon={(player) => {
                setWinningPlayer(player);
                setGameState("finished");
            }}/>;
        case 'finished':
            return <FinishedState winningPlayer={winningPlayer!} newGame={() => setGameState("ready")}/>;
    }
}

export default App;
