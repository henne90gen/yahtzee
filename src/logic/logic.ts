import { Die, ScoreKey, Player, PlayerName, PlayerScores, ScoreValue } from "./models";
import "./random";

export function isUpperBonusAchievable(player: PlayerScores): boolean {
    if (hasPlayerUpperBonus(player)) {
        return true;
    }

    let possibleResult = 0;
    possibleResult += valueOrDefault(player.ones, 5);
    possibleResult += valueOrDefault(player.twos, 10);
    possibleResult += valueOrDefault(player.threes, 15);
    possibleResult += valueOrDefault(player.fours, 20);
    possibleResult += valueOrDefault(player.fives, 25);
    possibleResult += valueOrDefault(player.sixes, 30);
    return possibleResult >= 63;
}

export function hasPlayerUpperBonus(player: PlayerScores): boolean {
    return upperScore(player) >= 63;
}

function valueOrDefault(
    value: ScoreValue,
    defaultValue: number
): number {
    if (value === "not-set") {
        return defaultValue;
    }
    if (value === "strike") {
        return defaultValue;
    }
    return value;
}

function valueOrZero(value: ScoreValue): number {
    return valueOrDefault(value, 0);
}

export function upperScore(player: PlayerScores): number {
    let result = 0;
    result += valueOrZero(player.ones);
    result += valueOrZero(player.twos);
    result += valueOrZero(player.threes);
    result += valueOrZero(player.fours);
    result += valueOrZero(player.fives);
    result += valueOrZero(player.sixes);
    return result;
}

export function totalUpperScore(player: PlayerScores): number {
    let result = upperScore(player);
    if (hasPlayerUpperBonus(player)) {
        result += 35;
    }
    return result;
}

export function totalLowerScore(player: PlayerScores): number {
    let result = 0;
    result += valueOrZero(player.threeOfAKind);
    result += valueOrZero(player.fourOfAKind);
    result += valueOrZero(player.fullHouse);
    result += valueOrZero(player.smallStraight);
    result += valueOrZero(player.largeStraight);
    result += valueOrZero(player.chance);
    result += valueOrZero(player.yahtzee);
    return result;
}

export function totalScore(player: PlayerScores): number {
    return totalLowerScore(player) + totalUpperScore(player);
}

export function initPlayers(playerNames: PlayerName[]): Player[] {
    const players: Player[] = [];
    for (let playerName of playerNames) {
        players.push({
            ...playerName,

            ones: "not-set",
            twos: "not-set",
            threes: "not-set",
            fours: "not-set",
            fives: "not-set",
            sixes: "not-set",

            threeOfAKind: "not-set",
            fourOfAKind: "not-set",
            fullHouse: "not-set",
            smallStraight: "not-set",
            largeStraight: "not-set",

            chance: "not-set",
            yahtzee: "not-set",
        });
    }
    return players;
}

export function initDice() {
    const dice: Die[] = [];
    for (let i = 0; i < 5; i++) {
        dice.push({ value: 1, locked: "unlocked" });
    }
    return dice;
}

function rollDie(getRandomNumber: () => number) {
    const num = getRandomNumber();
    let value = Math.ceil(num * 6);
    if (value === 0) {
        value = 1;
    }
    return value;
}

export function rollDice(
    dice: Die[],
    rollCount: number,
    getRandomNumber: () => number
): Die[] {
    const result = [];
    for (const die of dice) {
        if (die.locked === "unlocked") {
            die.value = rollDie(getRandomNumber);
        }
        if (rollCount === 3) {
            die.locked = "permanently-locked";
        }
        result.push(die);
    }
    return result;
}

export function toggleLock(rollCount: number, dice: Die[], index: number) {
    if (rollCount === 0) {
        return dice;
    }

    const result = [];
    for (let i = 0; i < dice.length; i++) {
        if (i === index) {
            if (dice[i].locked === "unlocked") {
                dice[i].locked = "locked";
            } else if (dice[i].locked === "locked") {
                dice[i].locked = "unlocked";
            }
        }
        result.push(dice[i]);
    }
    return result;
}

export function getAvailableOptions(
    player: PlayerScores,
    dice: Die[]
): ScoreKey[] {
    const options: ScoreKey[] = [];
    if (dice.filter((d) => d.value === 1).length > 0 && player.ones === "not-set") {
        options.push("ones");
    }
    if (dice.filter((d) => d.value === 2).length > 0 && player.twos === "not-set") {
        options.push("twos");
    }
    if (
        dice.filter((d) => d.value === 3).length > 0 &&
        player.threes === "not-set"
    ) {
        options.push("threes");
    }
    if (dice.filter((d) => d.value === 4).length > 0 && player.fours === "not-set") {
        options.push("fours");
    }
    if (dice.filter((d) => d.value === 5).length > 0 && player.fives === "not-set") {
        options.push("fives");
    }
    if (dice.filter((d) => d.value === 6).length > 0 && player.sixes === "not-set") {
        options.push("sixes");
    }

    // three/four of a kind and yahtzee
    const numberCounts = [0, 0, 0, 0, 0, 0];
    for (let die of dice) {
        numberCounts[die.value - 1]++;
    }
    for (let numCount of numberCounts) {
        if (numCount >= 3 && player.threeOfAKind === "not-set") {
            options.push("threeOfAKind");
        }
        if (numCount >= 4 && player.fourOfAKind === "not-set") {
            options.push("fourOfAKind");
        }
        if (numCount >= 5 && player.yahtzee === "not-set") {
            options.push("yahtzee");
        }
    }

    // full house
    const twoCount = numberCounts.filter((v) => v === 2);
    const threeCount = numberCounts.filter((v) => v === 3);
    if (
        twoCount.length === 1 &&
        threeCount.length === 1 &&
        player.fullHouse === "not-set"
    ) {
        options.push("fullHouse");
    }

    // small/large straight
    const sorted = Array.from(new Set(dice.map((d) => d.value))).sort();
    let longestRun = 0;
    let currentRun = 0;
    for (let i = 1; i < sorted.length; i++) {
        if (sorted[i] - sorted[i - 1] === 1) {
            currentRun += 1;
        } else {
            if (currentRun > longestRun) {
                longestRun = currentRun;
            }
            currentRun = 0;
        }
    }
    if (currentRun > longestRun) {
        longestRun = currentRun;
    }
    if (longestRun >= 3 && player.smallStraight === "not-set") {
        options.push("smallStraight");
    }
    if (longestRun >= 4 && player.largeStraight === "not-set") {
        options.push("largeStraight");
    }

    if (
        dice.map((d) => d.value).filter((v) => v === 0).length === 0 &&
        player.chance === "not-set"
    ) {
        options.push("chance");
    }

    return options;
}

function sum(prev: number, cur: number) {
    return prev + cur;
}

export function updateScore(
    player: PlayerScores,
    option: ScoreKey,
    dice: Die[]
): PlayerScores {
    const values = dice.map((d) => d.value);
    if (option === "ones") {
        player.ones = values.filter((v) => v === 1).reduce(sum, 0);
    }
    if (option === "twos") {
        player.twos = values.filter((v) => v === 2).reduce(sum, 0);
    }
    if (option === "threes") {
        player.threes = values.filter((v) => v === 3).reduce(sum, 0);
    }
    if (option === "fours") {
        player.fours = values.filter((v) => v === 4).reduce(sum, 0);
    }
    if (option === "fives") {
        player.fives = values.filter((v) => v === 5).reduce(sum, 0);
    }
    if (option === "sixes") {
        player.sixes = values.filter((v) => v === 6).reduce(sum, 0);
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

export function playerCanStrike(
    player: PlayerScores,
    option: ScoreKey
): boolean {
    switch (option) {
        case "ones":
            return player.ones === "not-set";
        case "twos":
            return player.twos === "not-set";
        case "threes":
            return player.threes === "not-set";
        case "fours":
            return player.fours === "not-set";
        case "fives":
            return player.fives === "not-set";
        case "sixes":
            return player.sixes === "not-set";
        case "threeOfAKind":
            return player.threeOfAKind === "not-set";
        case "fourOfAKind":
            return player.fourOfAKind === "not-set";
        case "fullHouse":
            return player.fullHouse === "not-set";
        case "smallStraight":
            return player.smallStraight === "not-set";
        case "largeStraight":
            return player.largeStraight === "not-set";
        case "yahtzee":
            return player.yahtzee === "not-set";
        case "chance":
            return player.chance === "not-set";
    }
}

export function updateScoreStrike(player: PlayerScores, option: ScoreKey) {
    switch (option) {
        case "ones":
            player.ones = "strike";
            break;
        case "twos":
            player.twos = "strike";
            break;
        case "threes":
            player.threes = "strike";
            break;
        case "fours":
            player.fours = "strike";
            break;
        case "fives":
            player.fives = "strike";
            break;
        case "sixes":
            player.sixes = "strike";
            break;
        case "threeOfAKind":
            player.threeOfAKind = "strike";
            break;
        case "fourOfAKind":
            player.fourOfAKind = "strike";
            break;
        case "fullHouse":
            player.fullHouse = "strike";
            break;
        case "smallStraight":
            player.smallStraight = "strike";
            break;
        case "largeStraight":
            player.largeStraight = "strike";
            break;
        case "yahtzee":
            player.yahtzee = "strike";
            break;
        case "chance":
            player.chance = "strike";
            break;
    }
}

function isDonePlaying(player: Player): boolean {
    return (
        player.ones !== "not-set" &&
        player.twos !== "not-set" &&
        player.threes !== "not-set" &&
        player.fours !== "not-set" &&
        player.fives !== "not-set" &&
        player.sixes !== "not-set" &&
        player.threeOfAKind !== "not-set" &&
        player.fourOfAKind !== "not-set" &&
        player.fullHouse !== "not-set" &&
        player.smallStraight !== "not-set" &&
        player.largeStraight !== "not-set" &&
        player.chance !== "not-set" &&
        player.yahtzee !== "not-set"
    );
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

    return getLeadingPlayerIndex(players);
}

export function removeIndexAndUpdateLaterIndices(
    array: number[],
    index: number
) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === index) {
            array.splice(i, 1);
            break;
        }
    }

    for (let i = 0; i < array.length; i++) {
        if (array[i] > index) {
            array[i]--;
        }
    }

    return array;
}
