import {Tile} from "./tile";
import {isUndefined, matrix} from "./utils";
import {options} from "tsconfig-paths/lib/options";

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

type CellOptions = {
    color: string;
    text: string;
    pointsMultiplier: number;
}

const normalCell: CellOptions = {
    color: "transparent",
    text: "",
    pointsMultiplier: 1,
}

const doublePoints: CellOptions = {
    color: "lightblue",
    text: "Double Points",
    pointsMultiplier: 2,
}


const triplePoints: CellOptions = {
    color: "gold",
    text: "Triple Points",
    pointsMultiplier: 3,
}

export class Cell {
    constructor(readonly x: number, readonly y: number, private _contents: Tile | undefined, private _options = normalCell) {}

    get contents() {
        return this._contents;
    }

    get options() {
        return this._options;
    }

    setOptions(options: CellOptions) {
        this._options = options;
    }

    setContents(contents: Tile | undefined) {
        this._contents = contents;
    }

    isOccupied() {
        return !!this.contents;
    }

    static Empty(x: number, y: number) {
        return new Cell(x, y, undefined);
    }
}

export class Game {
    private readonly _board: Cell[];
    readonly players: Player[];
    private currentPlayerIndex: number = 0;
    private drawPile: Tile[];

    constructor(players: Player[]) {
        if (players.length < 2) throw new Error("Minimum 2 players!");
        if (players.length > 4) throw new Error("Maximum 4 players!");
        this._board = this.createBoard();
        this.drawPile = new Array(64)
            .fill(0)
            .map((val, i) => i)
            // .slice(1) // remove 0 value tile to put in middle of board
            .sort(() => Math.random() - 0.5) // shuffle
            .map(val => new Tile(val));
        this.players = players;
        this.distributeTiles(4);
    }

    createBoard(): Cell[] {
        return new Array(64)
            .fill(0)
            .map((cell, i) => Cell.Empty(i % 8, Math.floor(i / 8)))
            .map(cell => {
                if (cell.x === 3 && cell.y === 1) cell.setOptions(doublePoints);
                if (cell.x === 4 && cell.y === 6) cell.setOptions(doublePoints);
                if (cell.x === 2 && cell.y === 4) cell.setOptions(triplePoints);
                if (cell.x === 5 && cell.y === 3) cell.setOptions(triplePoints);
                return cell;
            });
    }

    setupBoard() {
        this.setupBoardPerimeter();
        this.setupBoardCentre();
    }

    private setupBoardCentre() {
        this.setTileAt(this.drawPile.pop(), 2, 2)
        this.setTileAt(this.drawPile.pop(), 5, 2)
        this.setTileAt(this.drawPile.pop(), 2, 5)
        this.setTileAt(this.drawPile.pop(), 5, 5)
        this.setTileAt(this.drawPile.pop(), 3, 3)
        this.setTileAt(this.drawPile.pop(), 4, 4)
    }

    private setupBoardPerimeter() {
        const gridWidth = 8;
        const farRowIdx = gridWidth -1;
        for (let i = 0; i < gridWidth; i++) {
            this.setTileAt(this.drawPile.pop(), i, 0)
            this.setTileAt(this.drawPile.pop(), i, farRowIdx);
        }
        for (let i = 1; i < gridWidth-1; i++) {
            this.setTileAt(this.drawPile.pop(), 0, i);
            this.setTileAt(this.drawPile.pop(), farRowIdx, i);
        }
    }

    get tilesRemaining() {
        return this.drawPile.length;
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
        const everyoneIsOutOfTiles = this.players.every(player => player.tiles.length === 0);
        const boardIsFull = this.board.every(cell => cell.isOccupied());
        if (boardIsFull || everyoneIsOutOfTiles) {
            alert(`Game over, final points: ${this.players.map(player => player.toString()).join(", ")}`)
        }
        this.currentPlayerIndex += 1;
        this.currentPlayerIndex = this.currentPlayerIndex % this.players.length;
    }

    private calculatePointsForTile(x: number, y: number): number {
        const cell = this.getCellAt(x,y);
        const tile = cell?.contents;
        if (!tile) throw new Error("No tile to calculate!");
        const neighbourValues = this.getNeighbouringValuesTo(x,y);
        return tile.sides.reduce((points, sideValue, sideIndex) => {
            const neighbouringSideValue = neighbourValues[sideIndex];
            if (neighbouringSideValue === sideValue) return points +1;
            if (!isUndefined(neighbouringSideValue)) return points -1;
            return points;
        }, 0) * cell.options.pointsMultiplier;
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
        return this.getCellAt(x,y)?.contents;
    }

    setTileAt(tile: Tile | undefined, x: number, y: number) {
        this.getCellAt(x,y)?.setContents(tile);
    }

    private getCellAt(x: number, y: number) {
        return this._board.find(cell => cell.x === x && cell.y === y);
    }

    private isValidPosition(x: number, y: number) {
        return !!this.getCellAt(x, y);
    }
}