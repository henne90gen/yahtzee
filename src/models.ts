export type GameState = "ready" | "playing" | "finished";

export type PlayerName = {
    name: string;
    isAI: boolean;
};

export type ScoreValue = number | "not-set" | "strike";

export type PlayerState = {
    ones: ScoreValue;
    twos: ScoreValue;
    threes: ScoreValue;
    fours: ScoreValue;
    fives: ScoreValue;
    sixes: ScoreValue;

    threeOfAKind: ScoreValue;
    fourOfAKind: ScoreValue;
    fullHouse: ScoreValue;
    smallStraight: ScoreValue;
    largeStraight: ScoreValue;

    chance: ScoreValue;
    yahtzee: ScoreValue;
};
export type Player = PlayerName & PlayerState;

export type Die = {
    value: number;
    locked: "unlocked" | "locked" | "permanently-locked";
};

export type EndTurnOption =
    | "ones"
    | "twos"
    | "threes"
    | "fours"
    | "fives"
    | "sixes"
    | "threeOfAKind"
    | "fourOfAKind"
    | "fullHouse"
    | "smallStraight"
    | "largeStraight"
    | "yahtzee"
    | "chance";
export const AllEndTurnOptions: EndTurnOption[] = [
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
    "yahtzee",
    "chance",
];
