import {PlayerName} from "../models";
import React from "react";
import {useDispatch, useSelector} from 'react-redux'
import {
    addInvalidPlayerName,
    addPlayerName,
    removeInvalidPlayerName,
    removePlayerName,
    startGameThunk,
    updatePlayerName
} from "../store/game";
import t from "../translations";
import {RootState} from "../store/store";

function PlayerAvatar(props: { player: PlayerName, invalid: boolean, updatePlayer: (p: PlayerName) => void, removePlayer: () => void }) {
    const {player, invalid, updatePlayer, removePlayer} = props;
    // TODO add avatar picture
    let bgColor = "bg-blue-200 ";
    if (invalid) {
        bgColor = "bg-red-200 ";
    }

    function getInvalidNameMessage() {
        if (invalid) {
            return <div className="col-span-3 text-xs text-red-700 pt-0.5">{t("ready_InvalidNameMessage")}</div>;
        }
        return "";
    }

    return <div className="grid gap-3 items-center" style={{gridTemplateColumns: "3fr 0.7fr 0.6fr"}}>
        <input
            className={bgColor + "h-full px-3 rounded"}
            value={player.name}
            onChange={(event) => {
                const value = event.target.value;
                updatePlayer({...player, name: value});
            }}
        />
        <div className="grid grid-cols-2" style={{gridTemplateColumns: "1fr 2fr"}}>
            <input
                type="checkbox"
                className="w-3.5"
                checked={player.isAI}
                onChange={(event) => {
                    const value = event.target.checked;
                    updatePlayer({...player, isAI: value})
                }}
            />
            <span className="ml-1">AI</span>
        </div>
        <button
            title={t("ready_RemovePlayerTooltip")}
            className="p-2 rounded bg-red-300"
            onClick={() => {
                removePlayer();
            }}>
            -
        </button>
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
                dispatch(addInvalidPlayerName(i));
                allNamesValid = false;
            }
        }
        if (!allNamesValid) {
            return;
        }

        dispatch(startGameThunk())
    }

    const renderedPlayers = state.names.map(
        (p, index) => <PlayerAvatar
            key={index}
            player={p}
            invalid={state.invalidNames.find(i => i === index) !== undefined}
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
                <div className="grid gap-4 pt-3" style={{gridTemplateColumns: "1fr 3fr"}}>
                    <button
                        title={t("ready_AddPlayerTooltip")}
                        className="py-2 px-5 bg-blue-400 rounded-lg text-white"
                        onClick={() => {
                            dispatch(addPlayerName({name: "", isAI: false}));
                        }}>
                        +
                    </button>
                    <button
                        className="py-2 px-3 bg-green-500 rounded-lg text-white"
                        onClick={() => {
                            startGameClicked()
                        }}
                    >
                        {t("ready_StartGame")}
                    </button>
                </div>
            </div>
        </div>
    );
}
