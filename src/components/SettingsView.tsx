import { useAppDispatch, useAppSelector } from "../store/store";
import t, { Language } from "../translations";
import {
    closeSettings,
    openSettings,
    updateLanguageSetting,
} from "../store/settings";
import { AllScoreKeys, Player, PlayerScores, ScoreKey } from "../logic/models";
import { useState } from "react";

function LanguageSettings() {
    const dispatch = useAppDispatch();
    const language = useAppSelector((state) => state.settings.language);
    return (
        <div className="grid gap-20 grid-cols-2 justify-center rounded-lg shadow-lg p-5 sm:p-10 md:p-12 bg-white">
            <div>{t("settings_Language")}</div>
            <div className="grid justify-center">
                <select
                    value={language}
                    className="p-2 rounded bg-blue-500 text-white"
                    onChange={(event) =>
                        dispatch(
                            updateLanguageSetting(
                                event.currentTarget.value as Language
                            )
                        )
                    }
                >
                    <option value="de">DE</option>
                    <option value="en">EN</option>
                </select>
            </div>
        </div>
    );
}

function collectStats(playerScores: PlayerScores[], property: ScoreKey) {
    let set = 0;
    let notSet = 0;
    let strikes = 0;
    let totalScore = 0;

    for (const playerScore of playerScores) {
        if (typeof playerScore[property] === "number") {
            set++;
            totalScore += playerScore[property] as number;
        }
        if (playerScore[property] === "not-set") {
            notSet++;
        }
        if (playerScore[property] === "strike") {
            strikes++;
        }
    }

    return {
        set,
        notSet,
        strikes,
        totalScore,
    };
}

function PlayerScoreSummary(props: { playerScores: PlayerScores[] }) {
    const classes = "text-ellipsis whitespace-nowrap overflow-hidden";
    return (
        <>
            <div />
            <div className={classes}>
                {t("settings_statistics_FilledCount")}
            </div>
            <div className={classes}>
                {t("settings_statistics_NotFilledCount")}
            </div>
            <div className={classes}>
                {t("settings_statistics_StrikesCount")}
            </div>
            <div className={classes}>{t("settings_statistics_TotalScore")}</div>
            <div className={classes}>
                {t("settings_statistics_AverageScore")}
            </div>
            {AllScoreKeys.map((sk) => {
                const stats = collectStats(props.playerScores, sk);
                return (
                    <>
                        <div>{t(sk)}</div>
                        <div>{stats.set}</div>
                        <div>{stats.notSet}</div>
                        <div>{stats.strikes}</div>
                        <div>{stats.totalScore}</div>
                        <div>
                            {stats.set !== 0
                                ? (stats.totalScore / stats.set).toFixed(1)
                                : "-"}
                        </div>
                    </>
                );
            })}
        </>
    );
}

function getSelectedPlayer(playerStates: Player[], selectedNameIndex: number) {
    const playerNamesToStatesMap = new Map<string, PlayerScores[]>();
    for (const playerState of playerStates) {
        if (!playerNamesToStatesMap.has(playerState.name)) {
            playerNamesToStatesMap.set(playerState.name, []);
        }
        playerNamesToStatesMap.get(playerState.name)?.push(playerState);
    }
    const playerNames = Array.from(playerNamesToStatesMap.keys());

    if (selectedNameIndex === 0) {
        return {
            playerNames,
            selectedPlayer: playerStates,
        };
    }

    const selectedPlayerName = playerNames[selectedNameIndex - 1];
    const selectedPlayer = playerNamesToStatesMap.get(selectedPlayerName)!;
    return { playerNames, selectedPlayer };
}

function Statistics() {
    const games = useAppSelector((state) => state.statistics.games);
    const playerStates = games.flatMap((g) => g.playerStates);
    const [selectedNameIndex, setSelectedNameIndex] = useState(0);

    const { playerNames, selectedPlayer } = getSelectedPlayer(
        playerStates,
        selectedNameIndex
    );

    return (
        <div className="p-1 sm:p-2 md:p-4 rounded-lg shadow-lg bg-white grid justify-center grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] gap-2 sm:gap-4 md:gap-5">
            <div className="col-span-4">{t("settings_statistics_GamesCompleted")}</div>
            <div className="col-span-2">
                {games.filter((g) => g.hasBeenCompleted).length}/{games.length}
            </div>
            <select
                className="col-span-6"
                value={selectedNameIndex}
                onChange={(event) => {
                    event.preventDefault();
                    setSelectedNameIndex(parseInt(event.target.value));
                }}
            >
                <option value={0}>
                    {t("settings_statistics_TotalScores")}
                </option>
                {playerNames.map((name, index) => (
                    <option value={index + 1}>{name}</option>
                ))}
            </select>
            <PlayerScoreSummary playerScores={selectedPlayer} />
        </div>
    );
}

export function SettingsView() {
    return (
        <>
            <LanguageSettings />
            <Statistics />
        </>
    );
}

export function SettingsButton(props: { isSettingsOpen: boolean }) {
    const dispatch = useAppDispatch();
    const buttonClasses =
        "absolute top-3 right-3 sm:top-4 sm:right-7 md:top-8 md:right-10";
    if (props.isSettingsOpen) {
        return (
            <button
                className={buttonClasses}
                onClick={() => dispatch(closeSettings())}
            >
                <svg width="32px" height="32px" viewBox="0 0 50 50">
                    <circle
                        cx={25}
                        cy={25}
                        r={24}
                        fill="none"
                        stroke="black"
                        strokeWidth="1.5px"
                    />
                    <text
                        x={25}
                        y={27}
                        fill="black"
                        stroke="none"
                        textAnchor="middle"
                        dominantBaseline="middle"
                    >
                        ESC
                    </text>
                </svg>
            </button>
        );
    } else {
        return (
            <button
                className={buttonClasses}
                onClick={() => dispatch(openSettings())}
            >
                <svg width="32px" height="32px" viewBox="0 0 24 24">
                    <path
                        fill="black"
                        stroke="none"
                        d="M12 8.666c-1.838 0-3.333 1.496-3.333 3.334s1.495 3.333 3.333 3.333 3.333-1.495 3.333-3.333-1.495-3.334-3.333-3.334m0 7.667c-2.39 0-4.333-1.943-4.333-4.333s1.943-4.334 4.333-4.334 4.333 1.944 4.333 4.334c0 2.39-1.943 4.333-4.333 4.333m-1.193 6.667h2.386c.379-1.104.668-2.451 2.107-3.05 1.496-.617 2.666.196 3.635.672l1.686-1.688c-.508-1.047-1.266-2.199-.669-3.641.567-1.369 1.739-1.663 3.048-2.099v-2.388c-1.235-.421-2.471-.708-3.047-2.098-.572-1.38.057-2.395.669-3.643l-1.687-1.686c-1.117.547-2.221 1.257-3.642.668-1.374-.571-1.656-1.734-2.1-3.047h-2.386c-.424 1.231-.704 2.468-2.099 3.046-.365.153-.718.226-1.077.226-.843 0-1.539-.392-2.566-.893l-1.687 1.686c.574 1.175 1.251 2.237.669 3.643-.571 1.375-1.734 1.654-3.047 2.098v2.388c1.226.418 2.468.705 3.047 2.098.581 1.403-.075 2.432-.669 3.643l1.687 1.687c1.45-.725 2.355-1.204 3.642-.669 1.378.572 1.655 1.738 2.1 3.047m3.094 1h-3.803c-.681-1.918-.785-2.713-1.773-3.123-1.005-.419-1.731.132-3.466.952l-2.689-2.689c.873-1.837 1.367-2.465.953-3.465-.412-.991-1.192-1.087-3.123-1.773v-3.804c1.906-.678 2.712-.782 3.123-1.773.411-.991-.071-1.613-.953-3.466l2.689-2.688c1.741.828 2.466 1.365 3.465.953.992-.412 1.082-1.185 1.775-3.124h3.802c.682 1.918.788 2.714 1.774 3.123 1.001.416 1.709-.119 3.467-.952l2.687 2.688c-.878 1.847-1.361 2.477-.952 3.465.411.992 1.192 1.087 3.123 1.774v3.805c-1.906.677-2.713.782-3.124 1.773-.403.975.044 1.561.954 3.464l-2.688 2.689c-1.728-.82-2.467-1.37-3.456-.955-.988.41-1.08 1.146-1.785 3.126"
                    />
                </svg>
            </button>
        );
    }
}
