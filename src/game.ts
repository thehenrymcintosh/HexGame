import {Tile} from "./tile";
import {matrix} from "./utils";

export class Player {
    private _tiles: Tile[] = [];
    private _points: number = 0;

    constructor(readonly name: string) {}

    giveTile(tile: Tile) {
        this._tiles.push(tile);
    }

    takeTile(index: number) {
        const err = new Error("No tile in that position!");
        if (index >= this._tiles.length) throw err;
        if (index < 0) throw err;

        const tile = this._tiles.splice(index, 1)[0];
        if (!tile) throw err;
        return tile
    }

    awardPoints(points: number) {
        this._points += points;
    }

    get tiles() {
        return this._tiles.slice();
    }

    get points() {
        return this._points;
    }

    toString() {
        return `${this.name}: ${this.points} points`
    }
}

export class Game {
    private readonly _board: (Tile | undefined)[][];
    readonly players: Player[];
    private currentPlayerIndex: number = 0;
    private drawPile: Tile[];

    constructor(players: Player[]) {
        if (players.length < 2) throw new Error("Minimum 2 players!");
        if (players.length > 4) throw new Error("Maximum 4 players!");
        this._board = matrix(8, 8, undefined);
        this.drawPile = new Array(64)
            .fill(0)
            .map((val, i) => i)
            // .slice(1) // remove 0 value tile to put in middle of board
            .sort(() => Math.random() - 0.5) // shuffle
            .map(val => new Tile(val));
        this._board[3][3] = this.drawPile.pop();
        this.players = players;
        this.distributeTiles(4);
    }

    get board() {
        return this._board.slice();
    }

    private distributeTiles(count: number) {
        this.players.forEach((player) => {
            while (player.tiles.length < count) {
                const tile = this.drawPile.pop();
                if (!tile) throw new Error("Out of tiles!");
                player.giveTile(tile);
            }
        })
    }

    placeTile(player: Player, tileIdx: number, x: number, y: number) {
        if(!this.isValidPosition(x,y)) throw new Error("Position out of bounds!");
        const existingTile = this.getTileAt(x,y);
        if (existingTile) throw new Error("Space already occupied!");
        if (this.neighbourCount(x,y) === 0) throw new Error("Must place a tile against another one");

        if (player !== this.currentPlayer) throw new Error(`Not ${player.name}'s turn!`);
        const tile = player.takeTile(tileIdx);
        this.setTileAt(tile, x, y);
        const points = this.calculatePointsForTile(x,y);
        this.currentPlayer.awardPoints(points);
        const drawnTile = this.drawPile.pop();
        if (drawnTile) this.currentPlayer.giveTile(drawnTile);
        if (this.players.every(player => player.tiles.length === 0)) {
            alert(`Game over, final points: ${this.players.map(player => player.toString()).join(", ")}`)
        }
        this.currentPlayerIndex += 1;
        this.currentPlayerIndex = this.currentPlayerIndex % this.players.length;
    }

    private calculatePointsForTile(x: number, y: number): number {
        const tile = this.getTileAt(x,y);
        if (!tile) throw new Error("No tile to calculate!");
        const neighbourValues = this.getNeighbouringValuesTo(x,y);
        return tile.sides.reduce((points, sideValue, sideIndex) => {
            if (neighbourValues[sideIndex] === sideValue) return points +1;
            return points;
        }, 0)
    }

    private getNeighbouringValuesTo(x: number, y: number): (number|undefined)[] {
        const tiles = this.getNeighbouringTilesTo(x,y);
        return tiles.map((tile, faceIndex) => {
           return tile?.getOpposingFaceValueTo(faceIndex);
        })
    }

    private neighbourCount(x: number, y:number) {
        return this.getNeighbouringTilesTo(x,y)
            .reduce((count, tile) => {
                if (tile) return count + 1;
                return count;
            }, 0)

    }

    private getNeighbouringTilesTo(x: number, y: number) {
        const isEvenRow = y % 2 === 0;
        const rowOffset = isEvenRow ? -1 : 0;
        return [
            this.getTileAt(x + rowOffset, y-1), // top left
            this.getTileAt(x+1 + rowOffset, y-1), // top right
            this.getTileAt(x+1, y), // right
            this.getTileAt(x+1 + rowOffset, y+1), // bottom right
            this.getTileAt(x + rowOffset, y+1), // bottom left
            this.getTileAt(x-1, y) // left
        ]
    }

    get currentPlayer(): Player {
        return this.players[this.currentPlayerIndex];
    }

    getTileAt(x: number, y: number) {
        if (!this.isValidPosition(x,y)) return;
        return this._board[y][x];
    }

    setTileAt(tile: Tile, x: number, y: number) {
        this._board[y][x] = tile;
    }

    private isValidPosition(x: number, y: number) {
        if (x < 0) return false;
        if (y < 0) return false;
        if (y >= this.board.length) return false;
        if (x >= this.board[0].length) return false;
        return true;
    }

    print() {
        this.players.forEach(player => console.log(player.toString()));

        this._board.map((row, rowIndex) => {
            const isOdd = rowIndex % 2 === 1;
            const spacing = isOdd ? " " : "";
            console.log(`${spacing}${row.map(tile => !!tile ? 1 : 0).join(".")}`);
        })
    }
}