export type GameState = 'ready' | 'playing' | 'finished';

export type PlayerName = { name: string }
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
    position: number;
    value: number;
    locked: 'unlocked' | 'locked' | 'permanently-locked';
};
