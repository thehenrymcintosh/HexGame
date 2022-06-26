import {matrix} from "./utils";
import {expect} from "chai";

describe("Utils", () => {
    describe("matrix", () => {
        it("Should create matrix with correct size", () => {
            const height = 5;
            const width = 10;
            const defaultValue = 0;
            const m = matrix(height, width, defaultValue);
            expect(m.length).to.equal(height);
            m.forEach(row => {
                expect(row.length).to.equal(width);
            })
        })

        it("Should fill matrix with default value", () => {
            const side = 5;
            const defaultValue = 429;
            const m = matrix(side, side, defaultValue);
            m.forEach(row => {
                row.forEach(cell => {
                    expect(cell).to.equal(defaultValue);
                })
            })
        })
    })
})