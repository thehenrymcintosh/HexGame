import {expect} from "chai";
import {Tile} from "./tile";

describe("Tile", () => {
    it("Value 0 should have blank sides", () => {
        const tile = new Tile(0);
        expect(tile.sides).to.deep.eq([0,0,0,0,0,0]);
    })

    it("Value 1 should have a dot on first side", () => {
        const tile = new Tile(1);
        expect(tile.sides).to.deep.eq([1,0,0,0,0,0]);
    })

    it("Value 5 should have a dot on first and third side", () => {
        const tile = new Tile(5);
        expect(tile.sides).to.deep.eq([1,0,1,0,0,0]);
    })

    it("Value 32 should have a dot on last side", () => {
        const tile = new Tile(32);
        expect(tile.sides).to.deep.eq([0,0,0,0,0,1]);
    })

    it("Value 32 should have a 1 at face index 5", () =>{
        const tile = new Tile(32);
        expect(tile.getFaceValue(5)).to.eq(1);
    })

    it("Value 32 should have a 1 opposite face 2", () =>{
        const tile = new Tile(32);
        expect(tile.getOpposingFaceValueTo(2)).to.eq(1);
    })

    it("Value 63 should have a dot on all sides", () => {
        const tile = new Tile(63);
        expect(tile.sides).to.deep.eq([1,1,1,1,1,1]);
    })

    it("Value above 63 should throw an error", () => {
        expect( () => new Tile(64)).to.throw();
    })

    it("Value blow 0 should throw an error", () => {
        expect( () => new Tile(-1)).to.throw();
    })

    it("Can rotate clockwise", () => {
        const tile = new Tile(5);
        tile.rotateClockwise();
        expect(tile.sides).to.deep.eq([0,1,0,1,0,0]);
    })
    it("Can rotate counter clockwise", () => {
        const tile = new Tile(5);
        tile.rotateCounterClockwise();
        expect(tile.sides).to.deep.eq([0,1,0,0,0,1]);
    })
})