import {PlayerName} from "./models";
import React, {useState} from "react";

function PlayerAvatar(props: { player: PlayerName, invalid: boolean, updatePlayer: (p: PlayerName) => void, removePlayer: () => void }) {
    const {player, invalid, updatePlayer, removePlayer} = props;
    // TODO add avatar picture
    let bgColor = "bg-blue-200 ";
    if (invalid) {
        bgColor = "bg-red-200 ";
    }

    function getInvalidNameMessage() {
        if (invalid) {
            return <div className="text-xs text-red-700 pt-0.5">Invalid name</div>;
        }
        return "";
    }

    return <div>
        <div className="grid gap-3" style={{gridTemplateColumns: "80% 15%"}}>
            <input
                className={bgColor + "px-3 rounded"}
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
        </div>
        {getInvalidNameMessage()}
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
        setInvalidPlayerNames(s => {
            s.add(index);
            return new Set(s);
        });
    }

    function removeInvalidName(index: number) {
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
        <div className="pt-10 sm:pt-14 md:pt-20 flex justify-center">
            <div
                className="grid gap-3 justify-center lg:w-1/2 xl:w-1/3 rounded shadow-lg p-5 sm:p-10 md:p-20 bg-white"
                style={{gridTemplateColumns: "1fr"}}
            >
                {renderedPlayers}
                <div className="grid gap-4 pt-3" style={{gridTemplateColumns:"25% 70%"}}>
                    <button className="py-2 px-5 bg-blue-400 rounded-lg text-white"
                            onClick={(event) => {
                                event.preventDefault()
                                players.push({name: ""})
                                setPlayers([...players]);
                            }}>
                        +
                    </button>
                    <button
                        className="py-2 px-3 bg-green-500 rounded-lg text-white"
                        onClick={(event) => {
                            event.preventDefault();
                            startGameClicked()
                        }}
                    >
                        Start Game
                    </button>
                </div>
            </div>
        </div>
    );
}
