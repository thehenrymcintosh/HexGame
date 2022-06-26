export class Tile {
    private readonly _sides: number[];

    constructor(value: number) {
        if (value > 63) throw new Error(`Tile value ${value} too high!`);
        if (value < 0) throw new Error(`Tile value ${value} too low!`);
        const paddedValue = value + 64;
        this._sides = paddedValue
            .toString(2)
            .split("")
            .map((digit) => parseInt(digit, 10))
            .slice(1)
            .reverse();
    }

    get sides() {
        return this._sides;
    }

    getFaceValue(faceIndex: number) {
        return this.sides[faceIndex];
    }

    getOpposingFaceValueTo(faceIndex: number) {
        const opposingFaceIndex = (faceIndex + 3) % 6;
        return this.getFaceValue(opposingFaceIndex);
    }

    toString() {
        const s = this._sides;
        return`
             /${s[0]}  ${s[1]}\\
            |${s[5]}    ${s[2]}|
             \\${s[4]}  ${s[3]}/
        `;
    }
    rotateClockwise() {
        const last = this._sides.pop() as number;
        this._sides.unshift(last);
    }
    rotateCounterClockwise() {
        const last = this._sides.shift() as number;
        this._sides.push(last);
    }
}