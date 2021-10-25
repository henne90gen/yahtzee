export type GameState = 'ready' | 'playing' | 'finished';

export type Player = {
    name: string;

    ones: number;
    twos: number;
    threes: number;
    fours: number;
    fives: number;
    sixes: number;

    threeOfAKind: number;
    fourOfAKind: number;
    fullHouse: number;
    smallStraight: number;
    largeStraight: number;

    chance: number;
    yahtzee: number;
};

export type Die = {
    position: number;
    value: number;
    locked: 'unlocked' | 'locked' | 'permanently-locked';
};
