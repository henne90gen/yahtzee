export type GameState = 'ready' | 'playing' | 'finished';

export type PlayerName = {
    name: string;
    isAI: boolean;
}
export type PlayerState = {
    ones: number | null;
    twos: number | null;
    threes: number | null;
    fours: number | null;
    fives: number | null;
    sixes: number | null;

    threeOfAKind: number | null;
    fourOfAKind: number | null;
    fullHouse: number | null;
    smallStraight: number | null;
    largeStraight: number | null;

    chance: number | null;
    yahtzee: number | null;
};
export type Player = PlayerName & PlayerState;

export type Die = {
    value: number;
    locked: 'unlocked' | 'locked' | 'permanently-locked';
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
export const AllEndTurnOptions: EndTurnOption[] = ["ones"
    , "twos"
    , "threes"
    , "fours"
    , "fives"
    , "sixes"
    , "threeOfAKind"
    , "fourOfAKind"
    , "fullHouse"
    , "smallStraight"
    , "largeStraight"
    , "yahtzee"
    , "chance"];
