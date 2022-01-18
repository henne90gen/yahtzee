import {PlayerName} from "./models";
import React, {useState} from "react";

function PlayerAvatar(props: { player: PlayerName, invalid: boolean, updatePlayer: (p: PlayerName) => void, removePlayer: () => void }) {
    const {player, invalid, updatePlayer, removePlayer} = props;
    // TODO add avatar picture
    let bgColor = "bg-blue-200";
    if (invalid) {
        bgColor = "bg-red-200";
    }
    return <div>
        <input
            className={bgColor}
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
    const [invalidPlayerNames, setInvalidPlayerNames] = useState<Set<number>>(new Set());

    function startGameClicked() {
        let allNamesValid = true;
        for (let i = 0; i < players.length; i++) {
            if (players[i].name === "") {
                addInvalidName(i);
                allNamesValid = false;
            }
        }
        if (!allNamesValid) {
            return;
        }

        onGameStart(players);
    }

    function addInvalidName(index: number) {
        console.log("Adding", index);
        setInvalidPlayerNames(s => {
            s.add(index);
            return new Set(s);
        });
    }

    function removeInvalidName(index: number) {
        console.log("Removing", index);
        setInvalidPlayerNames(s => {
            s.delete(index);
            return new Set(s);
        });
    }

    const renderedPlayers = players.map(
        (p, index) => <PlayerAvatar
            key={index}
            player={p}
            invalid={invalidPlayerNames.has(index)}
            updatePlayer={(newP) => {
                players[index] = newP;
                setPlayers([...players]);
                if (newP.name === "") {
                    addInvalidName(index);
                } else {
                    removeInvalidName(index);
                }
            }}
            removePlayer={() => {
                players.splice(index, 1);
                setPlayers([...players]);
                removeInvalidName(index);
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
                    startGameClicked()
                }}
            >
                Start Game
            </button>
        </div>
    );
}
