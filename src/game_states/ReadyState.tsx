import { PlayerName } from "../logic/models";
import {
    addInvalidPlayerName,
    addPlayerName,
    removeInvalidPlayerName,
    removePlayerName,
    tryStartGameThunk,
    updatePlayerName,
} from "../store/game";
import t from "../translations";
import { useAppDispatch, useAppSelector } from "../store/store";

function PlayerAvatar(props: {
    player: PlayerName;
    invalid: boolean;
    updatePlayer: (p: PlayerName) => void;
    removePlayer: () => void;
}) {
    const { player, invalid, updatePlayer, removePlayer } = props;
    let bgColor = "bg-blue-200 dark:bg-blue-500 dark:text-gray-100 ";
    if (invalid) {
        bgColor = "bg-red-200 dark:bg-red-500 ";
    }

    function getInvalidNameMessage() {
        if (!invalid) {
            return "";
        }

        return (
            <div className="col-span-3 text-xs pt-0.5 text-red-700 dark:text-red-400">
                {t("ready_InvalidNameMessage")}
            </div>
        );
    }

    return (
        <div
            className="grid items-center"
            style={{ gridTemplateColumns: "3fr 0.7fr 0.6fr" }}
        >
            <input
                className={bgColor + "h-full px-3 mr-3 rounded"}
                value={player.name}
                onChange={(event) => {
                    const value = event.target.value;
                    updatePlayer({ ...player, name: value });
                }}
            />
            <div
                className="grid grid-cols-2"
                style={{ gridTemplateColumns: "1fr 2fr" }}
            >
                <input
                    type="checkbox"
                    className="w-3.5"
                    checked={player.isAI}
                    onChange={(event) => {
                        const value = event.target.checked;
                        updatePlayer({ ...player, isAI: value });
                    }}
                />
                <span className="ml-1 w-5 dark:text-gray-200">{t("ready_AI")}</span>
            </div>
            <button
                title={t("ready_RemovePlayerTooltip")}
                className="p-2 w-8 h-8 text-center rounded bg-red-300 dark:bg-red-500 dark:text-white"
                onClick={() => {
                    removePlayer();
                }}
            >
                <span className="relative bottom-1">-</span>
            </button>
            {getInvalidNameMessage()}
        </div>
    );
}

export default function ReadyState() {
    const state = useAppSelector((state) => state.game.readyState);
    const dispatch = useAppDispatch();

    function startGameClicked() {
        dispatch(tryStartGameThunk());
    }

    let notEnoughPlayersMsg = null;
    if (state.names.length === 0) {
        notEnoughPlayersMsg = (
            <div className="col-span-2 text-red-700 text-center dark:text-red-400">
                {t("ready_NotEnoughPlayers")}
            </div>
        );
    }

    const renderedPlayers = state.names.map((p, index) => (
        <PlayerAvatar
            key={index}
            player={p}
            invalid={state.invalidNames.find((i) => i === index) !== undefined}
            updatePlayer={(newP) => {
                dispatch(
                    updatePlayerName({
                        index,
                        player: newP,
                    })
                );
                if (newP.name === "") {
                    dispatch(addInvalidPlayerName(index));
                } else {
                    dispatch(removeInvalidPlayerName(index));
                }
            }}
            removePlayer={() => {
                dispatch(removePlayerName(index));
                dispatch(removeInvalidPlayerName(index));
            }}
        />
    ));
    return (
        <div
            className="grid gap-3 justify-center rounded shadow-lg p-5 sm:p-10 md:p-20 bg-white dark:bg-gray-600"
            style={{ gridTemplateColumns: "1fr" }}
        >
            {renderedPlayers}
            <div
                className="grid gap-4 pt-3"
                style={{ gridTemplateColumns: "1fr 3fr" }}
            >
                {notEnoughPlayersMsg}
                <button
                    title={t("ready_AddPlayerTooltip")}
                    className="py-2 px-5 bg-blue-400 dark:bg-blue-500 rounded-lg text-white"
                    onClick={() => {
                        dispatch(addPlayerName({ name: "", isAI: false }));
                    }}
                >
                    +
                </button>
                <button
                    className="py-2 px-3 bg-green-500 dark:bg-green-600 rounded-lg text-white dark:text-gray-100 disabled:cursor-not-allowed disabled:bg-green-300 dark:disabled:bg-green-800 dark:disabled:text-gray-400"
                    onClick={() => {
                        startGameClicked();
                    }}
                    disabled={state.names.length === 0}
                >
                    {t("ready_StartGame")}
                </button>
            </div>
        </div>
    );
}
