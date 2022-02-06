import {getAvailableOptions, removeIndexAndUpdateLaterIndices, updateScore} from "./logic";
import {Die} from "./models";

function d(v: number): Die {
    return {value: v, locked: "unlocked"};
}

function p(v: any) {
    return Object.assign({
        ones: null,
        twos: null,
        threes: null,
        fours: null,
        fives: null,
        sixes: null,
        threeOfAKind: null,
        fourOfAKind: null,
        smallStraight: null,
        largeStraight: null,
        fullHouse: null,
        chance: null,
        yahtzee: null,
    }, v);
}

describe('getAvailableOptions', () => {
    it("does not suggest option that is set already", () => {
        let result = getAvailableOptions(p({ones: 1}), [d(1), d(2), d(2), d(2), d(2)]);
        expect(result).toEqual(["twos", "threeOfAKind", "fourOfAKind", "chance"]);

        result = getAvailableOptions(p({twos: 1}), [d(1), d(2), d(2), d(2), d(2)]);
        expect(result).toEqual(["ones", "threeOfAKind", "fourOfAKind", "chance"]);

        result = getAvailableOptions(p({threes: 1}), [d(3), d(2), d(2), d(2), d(2)]);
        expect(result).toEqual(["twos", "threeOfAKind", "fourOfAKind", "chance"]);

        result = getAvailableOptions(p({fours: 1}), [d(4), d(2), d(2), d(2), d(2)]);
        expect(result).toEqual(["twos", "threeOfAKind", "fourOfAKind", "chance"]);

        result = getAvailableOptions(p({fives: 1}), [d(5), d(2), d(2), d(2), d(2)]);
        expect(result).toEqual(["twos", "threeOfAKind", "fourOfAKind", "chance"]);

        result = getAvailableOptions(p({sixes: 1}), [d(6), d(2), d(2), d(2), d(2)]);
        expect(result).toEqual(["twos", "threeOfAKind", "fourOfAKind", "chance"]);

        result = getAvailableOptions(p({threeOfAKind: 1}), [d(1), d(2), d(2), d(2), d(2)]);
        expect(result).toEqual(["ones", "twos", "fourOfAKind", "chance"]);

        result = getAvailableOptions(p({fourOfAKind: 1}), [d(1), d(2), d(2), d(2), d(2)]);
        expect(result).toEqual(["ones", "twos", "threeOfAKind", "chance"]);

        result = getAvailableOptions(p({fullHouse: 1}), [d(1), d(1), d(2), d(2), d(2)]);
        expect(result).toEqual(["ones", "twos", "threeOfAKind", "chance"]);

        result = getAvailableOptions(p({smallStraight: 1}), [d(1), d(2), d(3), d(4), d(2)]);
        expect(result).toEqual(["ones", "twos", "threes", "fours", "chance"]);

        result = getAvailableOptions(p({largeStraight: 1}), [d(1), d(2), d(3), d(4), d(5)]);
        expect(result).toEqual(["ones", "twos", "threes", "fours", "fives", "smallStraight", "chance"]);

        result = getAvailableOptions(p({yahtzee: 1}), [d(1), d(1), d(1), d(1), d(1)]);
        expect(result).toEqual(["ones", "threeOfAKind", "fourOfAKind", "chance"]);

        result = getAvailableOptions(p({chance: 1}), [d(1), d(1), d(1), d(1), d(1)]);
        expect(result).toEqual(["ones", "threeOfAKind", "fourOfAKind", "yahtzee"]);
    });

    it("correctly detects full house", () => {
        let result = getAvailableOptions(p({}), [d(1), d(1), d(2), d(2), d(2)]);
        expect(result).toEqual(["ones", "twos", "threeOfAKind", "fullHouse", "chance"]);
    });

    it("correctly detects straights", () => {
        let result = getAvailableOptions(p({}), [d(1), d(2), d(3), d(4), d(5)]);
        expect(result).toEqual(["ones", "twos", "threes", "fours", "fives", "smallStraight", "largeStraight", "chance"]);

        result = getAvailableOptions(p({}), [d(2), d(3), d(4), d(5), d(6)]);
        expect(result).toEqual(["twos", "threes", "fours", "fives", "sixes", "smallStraight", "largeStraight", "chance"]);

        result = getAvailableOptions(p({}), [d(3), d(4), d(5), d(2), d(3)]);
        expect(result).toEqual(["twos", "threes", "fours", "fives", "smallStraight", "chance"]);
    });
});

describe("updateScore", () => {
    it("updates numbers correctly: ones", () => {
        const player = updateScore(p({}), "ones", [d(1), d(1), d(2), d(5), d(4)])
        expect(player.ones).toEqual(2);
    });
    it("updates numbers correctly: twos", () => {
        const player = updateScore(p({}), "twos", [d(1), d(2), d(2), d(5), d(4)])
        expect(player.twos).toEqual(4);
    });
    it("updates numbers correctly: threes", () => {
        const player = updateScore(p({}), "threes", [d(1), d(3), d(3), d(5), d(4)])
        expect(player.threes).toEqual(6);
    });
    it("updates numbers correctly: fours", () => {
        const player = updateScore(p({}), "fours", [d(1), d(2), d(4), d(5), d(4)])
        expect(player.fours).toEqual(8);
    });
    it("updates numbers correctly: fives", () => {
        const player = updateScore(p({}), "fives", [d(1), d(2), d(5), d(5), d(4)])
        expect(player.fives).toEqual(10);
    });
    it("updates numbers correctly: sixes", () => {
        const player = updateScore(p({}), "sixes", [d(1), d(6), d(6), d(5), d(4)])
        expect(player.sixes).toEqual(12);
    });
    it("updates three of a kind correctly", () => {
        const player = updateScore(p({}), "threeOfAKind", [d(1), d(6), d(6), d(6), d(4)])
        expect(player.threeOfAKind).toEqual(23);
    });
    it("updates four of a kind correctly", () => {
        const player = updateScore(p({}), "fourOfAKind", [d(1), d(6), d(6), d(6), d(6)])
        expect(player.fourOfAKind).toEqual(25);
    });
    it("updates full house correctly", () => {
        const player = updateScore(p({}), "fullHouse", [d(2), d(2), d(3), d(3), d(3)])
        expect(player.fullHouse).toEqual(25);
    });
    it("updates small straight correctly", () => {
        const player = updateScore(p({}), "smallStraight", [d(1), d(2), d(3), d(4), d(6)])
        expect(player.smallStraight).toEqual(30);
    });
    it("updates large straight correctly", () => {
        const player = updateScore(p({}), "largeStraight", [d(1), d(2), d(3), d(4), d(5)])
        expect(player.largeStraight).toEqual(40);
    });
    it("updates yahtzee correctly", () => {
        const player = updateScore(p({}), "yahtzee", [d(1), d(1), d(1), d(1), d(1)])
        expect(player.yahtzee).toEqual(50);
    });
    it("updates chance correctly", () => {
        const player = updateScore(p({}), "chance", [d(1), d(2), d(3), d(4), d(6)])
        expect(player.chance).toEqual(16);
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
