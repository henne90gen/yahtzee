import { it, describe, expect } from 'vitest';
import {random, randomState} from "./random";

describe("random", () => {
    it("randomState", () => {
        const state = randomState("test");
        expect(state).toEqual(2974430664);
    });
    it("random", () => {
        const [newState, num] = random(1337);
        expect(newState).toEqual(1831567150);
        expect(num).toEqual(0.1844118325971067);
    });
});
