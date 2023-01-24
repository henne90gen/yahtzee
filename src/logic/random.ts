// https://stackoverflow.com/a/47593316/2840827
function xmur3(str: string) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
        h = (h << 13) | (h >>> 19);
    }

    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^ (h >>> 16)) >>> 0;
}

// https://stackoverflow.com/a/47593316/2840827
function mulberry32(a: number): [number, number] {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return [a, ((t ^ (t >>> 14)) >>> 0) / 4294967296];
}

/**
 * Generates an initial random state from a seed string.
 * @param seed
 */
export function randomState(seed: string): number {
    return xmur3(seed);
}

/**
 * Returns the new state and a random number.
 */
export function random(randomState: number): [number, number] {
    return mulberry32(randomState);
}
