import { Language } from "../translations";

export const AllScoreKeys = [
    "ones",
    "twos",
    "threes",
    "fours",
    "fives",
    "sixes",
    "threeOfAKind",
    "fourOfAKind",
    "fullHouse",
    "smallStraight",
    "largeStraight",
    "chance",
    "yahtzee",
] as const;
export type ScoreKey = ScoreKeyV0;
export type ScoreValue = ScoreValueV0;
export type GameState = GameStateV0;
export type PlayerName = PlayerNameV0;
export type PlayerScores = PlayerScoresV0;
export type Player = PlayerV0;
export type Die = DieV0;
export type Theme = ThemeV1;
export type GameStatistics = GameStatisticsV0;
export type SettingsData = SettingsDataV1;
export type StatisticsData = StatisticsDataV0;
export type RootState = RootStateV1;

export type ScoreKeyV0 = typeof AllScoreKeys[number];
export type ScoreValueV0 = number | "not-set" | "strike";
export type PlayerScoresV0 = {
    [K in ScoreKeyV0]: ScoreValueV0;
};
export type PlayerNameV0 = {
    name: string;
    isAI: boolean;
};
export type PlayerV0 = PlayerScoresV0 & PlayerNameV0;
export type GameStatisticsV0 = {
    playerStates: PlayerV0[];
    hasBeenCompleted: boolean;
};
export type StatisticsDataV0 = {
    games: GameStatisticsV0[];
};
export type SettingsDataV0 = {
    isSettingsOpen: boolean;
    language: Language;
};
export type ThemeV1 = "light" | "dark";
export type SettingsDataV1 = SettingsDataV0 & {
    theme: ThemeV1;
};
export type DieV0 = {
    value: number;
    locked: "unlocked" | "locked" | "permanently-locked";
};
export type GameStateV0 = "ready" | "playing" | "finished";
export type GameDataV0 = {
    currentState: GameStateV0;
    readyState: {
        names: PlayerNameV0[];
        invalidNames: number[];
    };
    players: PlayerV0[];
    currentPlayerIndex: number;
    dice: DieV0[];
    rollCount: number;
    winningPlayerIndex: number;
    randomState: number;
};
export type RootStateV0 = {
    game: GameDataV0;
    settings: SettingsDataV0;
    statistics: StatisticsDataV0;
};
export type RootStateV1 = {
    game: GameDataV0;
    settings: SettingsDataV1;
    statistics: StatisticsDataV0;
};
