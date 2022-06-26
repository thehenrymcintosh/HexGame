import {Game, Player} from "./game";
import {expect} from "chai";
import {Tile} from "./tile";

describe("Game", ()=> {
    it("Should give players 16 tiles to start the game", () => {
        const player1 = new Player("Henry");
        const player2 = new Player("Jeff");
        const game = new Game([player1, player2]);
        expect(player1.tiles).to.have.length(16);
        expect(player2.tiles).to.have.length(16);
    })

    it("Should let players place a tile in the grid if spot is empty, and alternate players", () => {
        const player1 = new Player("Henry");
        const player2 = new Player("Jeff");
        const game = new Game([player1, player2]);
        const x = 2;
        const y = 3;
        const tileIdx = 0;
        game.placeTile(player1, tileIdx, x, y);
        expect(game.currentPlayer).to.eq(player2);
    })

    it("Should give me zero points if no sides match", () => {
        const player1 = new Player("Henry");
        const player2 = new Player("Jeff");
        const game = new Game([player1, player2]);
        const x = 4;
        const y = 4;
        const tile = new Tile(13);
        player1.giveTile(tile);
        game.placeTile(player1, player1.tiles.length - 1, x, y);
        expect(player1.points).to.eq(0);
    })

    it("Should give me one point if one side matches", () => {
        const player1 = new Player("Henry");
        const player2 = new Player("Jeff");
        const game = new Game([player1, player2]);
        const x = 4;
        const y = 4;
        const tile = new Tile(12);
        player1.giveTile(tile);
        game.placeTile(player1, player1.tiles.length - 1, x, y);
        expect(player1.points).to.eq(1);
    })

    it("Should give me 6 points if all sides match", () => {
        const player1 = new Player("Henry");
        const player2 = new Player("Jeff");
        const game = new Game([player1, player2]);
        const x = 4;
        const y = 4;
        const tile = new Tile(0);
        game.setTileAt(tile, 3, 4);
        game.setTileAt(tile, 4, 3);
        game.setTileAt(tile, 3, 5);
        game.setTileAt(tile, 4, 5);
        game.setTileAt(tile, 5, 4);
        player1.giveTile(tile);
        game.placeTile(player1, player1.tiles.length - 1, x, y);
        expect(player1.points).to.eq(6);
    })

    it("Should not let me place tiles in the same spot", () => {
        const player1 = new Player("Henry");
        const player2 = new Player("Jeff");
        const game = new Game([player1, player2]);
        const x = 2;
        const y = 3;
        const tileIdx = 0;
        game.placeTile(player1, tileIdx, x, y);
        expect( () => game.placeTile(player2, tileIdx, x, y)).to.throw()
    })

    it("Should not let me place tiles if it's not my turn", () => {
        const player1 = new Player("Henry");
        const player2 = new Player("Jeff");
        const game = new Game([player1, player2]);
        const x = 2;
        const y = 3;
        const tileIdx = 0;
        expect( () => game.placeTile(player2, tileIdx, x, y)).to.throw()
    })

    it("Should have the 0 value tile at the middle of the board to start", () => {
        const player1 = new Player("Henry");
        const player2 = new Player("Jeff");
        const game = new Game([player1, player2]);
        const x = 3;
        const y = 3;
        expect(game.board[y][x]).to.deep.eq(new Tile(0));
    });

    it("Should not allow you to place a tile in free space", () => {
        const player1 = new Player("Henry");
        const player2 = new Player("Jeff");
        const game = new Game([player1, player2]);
        const x = 0;
        const y = 0;
        const tileIdx = 0;
        expect( () => game.placeTile(player1, tileIdx, x, y)).to.throw();
    })
})