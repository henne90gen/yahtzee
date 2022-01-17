import {Die, Player, PlayerName, PlayerState} from './models';

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
            name: playerName.name,

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
        dice.push({position: i, value: 0, locked: 'unlocked'});
    }
    return dice;
}

export function rollDice(dice: Die[], rollCount: number): Die[] {
    const result = [];
    for (const die of dice) {
        if (die.locked === 'unlocked') {
            die.value = Math.ceil(Math.random() * 6);
        }
        if (die.locked === 'locked' || rollCount === 3) {
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

export function getAvailableOptions(player: PlayerState, dice: Die[]): string[] {
    const options = []
    if (dice.filter(d => d.value === 1).length > 0) {
        options.push("ones");
    }
    if (dice.filter(d => d.value === 2).length > 0) {
        options.push("twos");
    }
    if (dice.filter(d => d.value === 3).length > 0) {
        options.push("threes");
    }
    if (dice.filter(d => d.value === 4).length > 0) {
        options.push("fours");
    }
    if (dice.filter(d => d.value === 5).length > 0) {
        options.push("fives");
    }
    if (dice.filter(d => d.value === 6).length > 0) {
        options.push("sixes");
    }
    return options;
}
