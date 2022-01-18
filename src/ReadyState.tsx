import {PlayerName} from "./models";
import React, {useState} from "react";

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

export default function ReadyState(props: { playerNames: PlayerName[], onGameStart: (players: PlayerName[]) => void }) {
    const {playerNames, onGameStart} = props;
    const [players, setPlayers] = useState(playerNames);
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
                    }}>
                +
            </button>
            <button
                onClick={(event) => {
                    event.preventDefault();
                    onGameStart(players);
                }}
            >
                Start Game
            </button>
        </div>
    );
}
