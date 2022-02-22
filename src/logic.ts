import {Die, EndTurnOption, Player, PlayerName, PlayerState} from './models';
import "./random"

export function isUpperBonusAchievable(player: PlayerState): boolean {
    if (hasPlayerUpperBonus(player)) {
        return true;
    }

    let possibleResult = 0;
    possibleResult += player.ones !== null ? player.ones : 5;
    possibleResult += player.twos !== null ? player.twos : 10;
    possibleResult += player.threes !== null ? player.threes : 15;
    possibleResult += player.fours !== null ? player.fours : 20;
    possibleResult += player.fives !== null ? player.fives : 25;
    possibleResult += player.sixes !== null ? player.sixes : 30;
    return possibleResult >= 63;
}

export function hasPlayerUpperBonus(player: PlayerState): boolean {
    return upperScore(player) >= 63;
}

export function upperScore(player: PlayerState): number {
    let result = 0;
    if (player.ones !== null) {
        result += player.ones;
    }
    if (player.twos !== null) {
        result += player.twos;
    }
    if (player.threes !== null) {
        result += player.threes;
    }
    if (player.fours !== null) {
        result += player.fours;
    }
    if (player.fives !== null) {
        result += player.fives;
    }
    if (player.sixes !== null) {
        result += player.sixes;
    }
    return result;
}

export function totalUpperScore(player: PlayerState): number {
    let result = upperScore(player);
    if (hasPlayerUpperBonus(player)) {
        result += 35;
    }
    return result;
}

export function totalLowerScore(player: PlayerState): number {
    let result = 0;
    if (player.threeOfAKind !== null) {
        result += player.threeOfAKind;
    }
    if (player.fourOfAKind !== null) {
        result += player.fourOfAKind;
    }
    if (player.fullHouse !== null) {
        result += player.fullHouse;
    }
    if (player.smallStraight !== null) {
        result += player.smallStraight;
    }
    if (player.largeStraight !== null) {
        result += player.largeStraight;
    }
    if (player.chance !== null) {
        result += player.chance;
    }
    if (player.yahtzee !== null) {
        result += player.yahtzee;
    }
    return result;
}

export function totalScore(player: PlayerState): number {
    return totalLowerScore(player) + totalUpperScore(player);
}

export function initPlayers(playerNames: PlayerName[]): Player[] {
    const players: Player[] = [];
    for (let playerName of playerNames) {
        players.push({
            ...playerName,

            ones: null,
            twos: null,
            threes: null,
            fours: null,
            fives: null,
            sixes: null,

            threeOfAKind: null,
            fourOfAKind: null,
            fullHouse: null,
            smallStraight: null,
            largeStraight: null,

            chance: null,
            yahtzee: null,
        });
    }
    return players;
}

export function initDice() {
    const dice: Die[] = [];
    for (let i = 0; i < 5; i++) {
        dice.push({value: 0, locked: 'unlocked'});
    }
    return dice;
}

export function rollDice(dice: Die[], rollCount: number, getRandomNumber: () => number): Die[] {
    const result = [];
    for (const die of dice) {
        if (die.locked === 'unlocked') {
            const num = getRandomNumber();
            let value = Math.ceil(num * 6);
            if (value === 0) {
                value = 1;
            }
            die.value = value;
        }
        if (rollCount === 3) {
            die.locked = 'permanently-locked';
        }
        result.push(die);
    }
    return result;
}

export function toggleLock(dice: Die[], index: number) {
    const result = [];
    for (let i = 0; i < dice.length; i++) {
        if (i === index) {
            if (dice[i].locked === 'unlocked') {
                dice[i].locked = 'locked';
            } else if (dice[i].locked === 'locked') {
                dice[i].locked = 'unlocked';
            }
        }
        result.push(dice[i]);
    }
    return result;
}

export function getAvailableOptions(player: PlayerState, dice: Die[]): EndTurnOption[] {
    const options: EndTurnOption[] = []
    if (dice.filter(d => d.value === 1).length > 0 && player.ones === null) {
        options.push("ones");
    }
    if (dice.filter(d => d.value === 2).length > 0 && player.twos === null) {
        options.push("twos");
    }
    if (dice.filter(d => d.value === 3).length > 0 && player.threes === null) {
        options.push("threes");
    }
    if (dice.filter(d => d.value === 4).length > 0 && player.fours === null) {
        options.push("fours");
    }
    if (dice.filter(d => d.value === 5).length > 0 && player.fives === null) {
        options.push("fives");
    }
    if (dice.filter(d => d.value === 6).length > 0 && player.sixes === null) {
        options.push("sixes");
    }

    // three/four of a kind and yahtzee
    const numberCounts = [0, 0, 0, 0, 0, 0];
    for (let die of dice) {
        numberCounts[die.value - 1]++;
    }
    for (let numCount of numberCounts) {
        if (numCount >= 3 && player.threeOfAKind === null) {
            options.push("threeOfAKind")
        }
        if (numCount >= 4 && player.fourOfAKind === null) {
            options.push("fourOfAKind")
        }
        if (numCount >= 5 && player.yahtzee === null) {
            options.push("yahtzee")
        }
    }

    // full house
    const twoCount = numberCounts.filter(v => v === 2);
    const threeCount = numberCounts.filter(v => v === 3);
    if (twoCount.length === 1 && threeCount.length === 1 && player.fullHouse === null) {
        options.push("fullHouse");
    }

    // small/large straight
    const sorted = Array.from(new Set(dice.map(d => d.value))).sort();
    let longestRun = 0;
    let currentRun = 0;
    for (let i = 1; i < sorted.length; i++) {
        if (sorted[i] - sorted[i - 1] === 1) {
            currentRun += 1;
        } else {
            if (currentRun > longestRun) {
                longestRun = currentRun
            }
            currentRun = 0;
        }
    }
    if (currentRun > longestRun) {
        longestRun = currentRun
    }
    if (longestRun >= 3 && player.smallStraight === null) {
        options.push("smallStraight");
    }
    if (longestRun >= 4 && player.largeStraight === null) {
        options.push("largeStraight");
    }

    if (dice.map(d => d.value).filter(v => v === 0).length === 0 && player.chance === null) {
        options.push("chance");
    }

    return options;
}

function sum(prev: number, cur: number) {
    return prev + cur;
}

export function updateScore(player: PlayerState, option: EndTurnOption, dice: Die[]): PlayerState {
    const values = dice.map(d => d.value);
    if (option === "ones") {
        player.ones = values.filter(v => v === 1).reduce(sum, 0);
    }
    if (option === "twos") {
        player.twos = values.filter(v => v === 2).reduce(sum, 0);
    }
    if (option === "threes") {
        player.threes = values.filter(v => v === 3).reduce(sum, 0);
    }
    if (option === "fours") {
        player.fours = values.filter(v => v === 4).reduce(sum, 0);
    }
    if (option === "fives") {
        player.fives = values.filter(v => v === 5).reduce(sum, 0);
    }
    if (option === "sixes") {
        player.sixes = values.filter(v => v === 6).reduce(sum, 0);
    }
    if (option === "threeOfAKind") {
        player.threeOfAKind = values.reduce(sum, 0);
    }
    if (option === "fourOfAKind") {
        player.fourOfAKind = values.reduce(sum, 0);
    }
    if (option === "fullHouse") {
        player.fullHouse = 25;
    }
    if (option === "smallStraight") {
        player.smallStraight = 30;
    }
    if (option === "largeStraight") {
        player.largeStraight = 40;
    }
    if (option === "yahtzee") {
        player.yahtzee = 50;
    }
    if (option === "chance") {
        player.chance = values.reduce(sum, 0);
    }
    return player;
}

export function playerCanStrike(player: PlayerState, option: EndTurnOption): boolean {
    switch (option) {
        case "ones":
            return player.ones === null;
        case "twos":
            return player.twos === null;
        case "threes":
            return player.threes === null;
        case "fours":
            return player.fours === null;
        case "fives":
            return player.fives === null;
        case "sixes":
            return player.sixes === null;
        case "threeOfAKind":
            return player.threeOfAKind === null;
        case "fourOfAKind":
            return player.fourOfAKind === null;
        case "fullHouse":
            return player.fullHouse === null;
        case "smallStraight":
            return player.smallStraight === null;
        case "largeStraight":
            return player.largeStraight === null;
        case "yahtzee":
            return player.yahtzee === null;
        case "chance":
            return player.chance === null;
    }
}

export function updateScoreStrike(player: PlayerState, option: EndTurnOption) {
    switch (option) {
        case "ones":
            player.ones = 0;
            break;
        case "twos":
            player.twos = 0;
            break;
        case "threes":
            player.threes = 0;
            break;
        case "fours":
            player.fours = 0;
            break;
        case "fives":
            player.fives = 0;
            break;
        case "sixes":
            player.sixes = 0;
            break;
        case "threeOfAKind":
            player.threeOfAKind = 0;
            break;
        case "fourOfAKind":
            player.fourOfAKind = 0;
            break;
        case "fullHouse":
            player.fullHouse = 0;
            break;
        case "smallStraight":
            player.smallStraight = 0;
            break;
        case "largeStraight":
            player.largeStraight = 0;
            break;
        case "yahtzee":
            player.yahtzee = 0;
            break;
        case "chance":
            player.chance = 0;
            break;
    }
}

function isDonePlaying(player: Player): boolean {
    return player.ones !== null &&
        player.twos !== null &&
        player.threes !== null &&
        player.fours !== null &&
        player.fives !== null &&
        player.sixes !== null &&
        player.threeOfAKind !== null &&
        player.fourOfAKind !== null &&
        player.fullHouse !== null &&
        player.smallStraight !== null &&
        player.largeStraight !== null &&
        player.chance !== null &&
        player.yahtzee !== null;
}

export function getLeadingPlayerIndex(players: Player[]): number | null {
    let maxTotalScore = -1;
    let winningPlayerIndex = null;
    for (let i = 0; i < players.length; i++) {
        const score = totalScore(players[i]);
        if (score > maxTotalScore) {
            maxTotalScore = score;
            winningPlayerIndex = i;
        }
    }
    return winningPlayerIndex;
}

export function getWinningPlayerIndex(players: Player[]): number | null {
    let allDone = true;
    for (let player of players) {
        if (!isDonePlaying(player)) {
            allDone = false;
            break;
        }
    }
    if (!allDone) {
        return null;
    }

    return getLeadingPlayerIndex(players)
}

export function removeIndexAndUpdateLaterIndices(array: number[], index: number) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === index) {
            array.splice(i, 1);
            break
        }
    }

    for (let i = 0; i < array.length; i++) {
        if (array[i] > index) {
            array[i]--;
        }
    }

    return array
}
