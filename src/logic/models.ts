export type GameState = "ready" | "playing" | "finished";

export type PlayerName = {
    name: string;
    isAI: boolean;
};

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
export type ScoreKey = typeof AllScoreKeys[number];
export type ScoreValue = number | "not-set" | "strike";

export type PlayerScores = {
    [K in ScoreKey]: ScoreValue;
};
export type Player = PlayerName & PlayerScores;

export type Die = {
    value: number;
    locked: "unlocked" | "locked" | "permanently-locked";
};
