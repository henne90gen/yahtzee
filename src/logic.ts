import { Player, Die } from './models';

export function hasPlayerUpperBonus(player: Player): boolean {
    return upperScore(player) >= 63;
}

export function upperScore(player: Player): number {
    return (
        player.ones +
        player.twos +
        player.threes +
        player.fours +
        player.fives +
        player.sixes
    );
}

export function totalUpperScore(player: Player): number {
    let result = upperScore(player);
    if (hasPlayerUpperBonus(player)) {
        result += 35;
    }
    return result;
}

export function totalLowerScore(player: Player): number {
    return (
        player.threeOfAKind +
        player.fourOfAKind +
        player.fullHouse +
        player.smallStraight +
        player.largeStraight +
        player.chance +
        player.yahtzee
    );
}

export function totalScore(player: Player): number {
    return totalLowerScore(player) + totalUpperScore(player);
}

export function initPlayers(playerCount: number): Player[] {
    const players: Player[] = [];
    for (let i = 0; i < playerCount; i++) {
        players.push({
            name: Math.random().toFixed(2),
            ones: 0,
            twos: 0,
            threes: 0,
            fours: 0,
            fives: 0,
            sixes: 0,

            threeOfAKind: 0,
            fourOfAKind: 0,
            fullHouse: 0,
            smallStraight: 0,
            largeStraight: 0,

            chance: 0,
            yahtzee: 0,
        });
    }
    return players;
}

export function initDice() {
    const dice: Die[] = [];
    for (let i = 0; i < 5; i++) {
        dice.push({ position: i, value: 0, locked: 'unlocked' });
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
