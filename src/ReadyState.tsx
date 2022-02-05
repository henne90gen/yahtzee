import {PlayerName} from "./models";
import React from "react";
import {useSelector, useDispatch} from 'react-redux'
import {
    addInvalidPlayerName,
    addPlayerName,
    removeInvalidPlayerName,
    removePlayerName,
    RootState,
    startGame,
    updatePlayerName
} from "./store";

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

export default function ReadyState() {
    const state = useSelector((state: RootState) => state.game.readyState);
    const dispatch = useDispatch();

    function startGameClicked() {
        let allNamesValid = true;
        for (let i = 0; i < state.names.length; i++) {
            if (state.names[i].name === "") {
                addInvalidPlayerName(i);
                allNamesValid = false;
            }
        }
        if (!allNamesValid) {
            return;
        }

        dispatch(startGame())
    }

    const renderedPlayers = state.names.map(
        (p, index) => <PlayerAvatar
            key={index}
            player={p}
            invalid={state.invalidNames.has(index)}
            updatePlayer={(newP) => {
                dispatch(updatePlayerName({
                    index, player: newP
                }))
                if (newP.name === "") {
                    dispatch(addInvalidPlayerName(index))
                } else {
                    dispatch(removeInvalidPlayerName(index))
                }
            }}
            removePlayer={() => {
                dispatch(removePlayerName(index))
                dispatch(removeInvalidPlayerName(index));
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
                <div className="grid gap-4 pt-3" style={{gridTemplateColumns: "25% 70%"}}>
                    <button className="py-2 px-5 bg-blue-400 rounded-lg text-white"
                            onClick={(event) => {
                                event.preventDefault()
                                dispatch(addPlayerName({name: ""}))
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
