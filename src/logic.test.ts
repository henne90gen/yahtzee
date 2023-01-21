import { it, describe, expect } from 'vitest';
import {getAvailableOptions, removeIndexAndUpdateLaterIndices, updateScore} from "./logic";
import {Die, ScoreKey} from "./models";

function d(v: number): Die {
    return {value: v, locked: "unlocked"};
}

function p(v: any) {
    return Object.assign({
        ones: "not-set",
        twos: "not-set",
        threes: "not-set",
        fours: "not-set",
        fives: "not-set",
        sixes: "not-set",
        threeOfAKind: "not-set",
        fourOfAKind: "not-set",
        smallStraight: "not-set",
        largeStraight: "not-set",
        fullHouse: "not-set",
        chance: "not-set",
        yahtzee: "not-set",
    }, v);
}

describe('getAvailableOptions', () => {
    it.each([
        [p({ones: 1}), [d(1), d(2), d(2), d(2), d(2)], ["twos", "threeOfAKind", "fourOfAKind", "chance"]],
        [p({twos: 1}), [d(1), d(2), d(2), d(2), d(2)], ["ones", "threeOfAKind", "fourOfAKind", "chance"]],
        [p({threes: 1}), [d(3), d(2), d(2), d(2), d(2)], ["twos", "threeOfAKind", "fourOfAKind", "chance"]],
        [p({fours: 1}), [d(4), d(2), d(2), d(2), d(2)], ["twos", "threeOfAKind", "fourOfAKind", "chance"]],
        [p({fives: 1}), [d(5), d(2), d(2), d(2), d(2)], ["twos", "threeOfAKind", "fourOfAKind", "chance"]],
        [p({sixes: 1}), [d(6), d(2), d(2), d(2), d(2)], ["twos", "threeOfAKind", "fourOfAKind", "chance"]],
        [p({threeOfAKind: 1}), [d(1), d(2), d(2), d(2), d(2)], ["ones", "twos", "fourOfAKind", "chance"]],
        [p({fourOfAKind: 1}), [d(1), d(2), d(2), d(2), d(2)], ["ones", "twos", "threeOfAKind", "chance"]],
        [p({fullHouse: 1}), [d(1), d(1), d(2), d(2), d(2)], ["ones", "twos", "threeOfAKind", "chance"]],
        [p({smallStraight: 1}), [d(1), d(2), d(3), d(4), d(2)], ["ones", "twos", "threes", "fours", "chance"]],
        [p({largeStraight: 1}), [d(1), d(2), d(3), d(4), d(5)], ["ones", "twos", "threes", "fours", "fives", "smallStraight", "chance"]],
        [p({yahtzee: 1}), [d(1), d(1), d(1), d(1), d(1)], ["ones", "threeOfAKind", "fourOfAKind", "chance"]],
        [p({chance: 1}), [d(1), d(1), d(1), d(1), d(1)], ["ones", "threeOfAKind", "fourOfAKind", "yahtzee"]],
    ])("does not suggest option that is set already", (player, dice, expected) => {
        const result = getAvailableOptions(player, dice);
        expect(result).toEqual(expected);
    })

    it.each([
        [p({}), [d(1), d(1), d(2), d(2), d(2)], ["ones", "twos", "threeOfAKind", "fullHouse", "chance"]],
    ])("correctly detects full house", (player, dice, expected) => {
        const result = getAvailableOptions(player, dice);
        expect(result).toEqual(expected);
    });

    it.each([
        [p({}), [d(1), d(2), d(3), d(4), d(5)], ["ones", "twos", "threes", "fours", "fives", "smallStraight", "largeStraight", "chance"]],
        [p({}), [d(2), d(3), d(4), d(5), d(6)], ["twos", "threes", "fours", "fives", "sixes", "smallStraight", "largeStraight", "chance"]],
        [p({}), [d(3), d(4), d(5), d(2), d(3)], ["twos", "threes", "fours", "fives", "smallStraight", "chance"]],
    ])("correctly detects straights", (player, dice, expected) => {
        const result = getAvailableOptions(player, dice);
        expect(result).toEqual(expected);
    });
});

describe("updateScore", () => {
    it.each([
        ["ones" as ScoreKey, [d(1), d(1), d(2), d(5), d(4)], 2],
        ["twos" as ScoreKey, [d(1), d(2), d(2), d(5), d(4)], 4],
        ["threes" as ScoreKey, [d(1), d(3), d(3), d(5), d(4)], 6],
        ["fours" as ScoreKey, [d(1), d(2), d(4), d(5), d(4)], 8],
        ["fives" as ScoreKey, [d(1), d(2), d(5), d(5), d(4)], 10],
        ["sixes" as ScoreKey, [d(1), d(6), d(6), d(5), d(4)], 12],
        ["threeOfAKind" as ScoreKey, [d(1), d(6), d(6), d(6), d(4)], 23],
        ["fourOfAKind" as ScoreKey, [d(1), d(6), d(6), d(6), d(6)], 25],
        ["fullHouse" as ScoreKey, [d(2), d(2), d(3), d(3), d(3)], 25],
        ["smallStraight" as ScoreKey, [d(1), d(2), d(3), d(4), d(6)], 30],
        ["largeStraight" as ScoreKey, [d(1), d(2), d(3), d(4), d(5)], 40],
        ["yahtzee" as ScoreKey, [d(1), d(1), d(1), d(1), d(1)], 50],
        ["chance" as ScoreKey, [d(1), d(2), d(3), d(4), d(6)], 16],
    ])("updates numbers correctly: %s", (nameOfNumber: ScoreKey, dice: Die[], expected: number) => {
        const player = updateScore(p({}), nameOfNumber, dice)
        expect(player[nameOfNumber]).toEqual(expected);
    });
});

describe("removeIndexAndUpdateLaterIndices", () => {
    it("removes element correctly", () => {
        const a = [2, 3, 4];
        const result = removeIndexAndUpdateLaterIndices(a, 4);
        expect(result).toEqual([2, 3])
    });
    it("removes middle element correctly", () => {
        const a = [2, 3, 4];
        const result = removeIndexAndUpdateLaterIndices(a, 3);
        expect(result).toEqual([2, 3]);
    });
});
