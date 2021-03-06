import {Cell, Game} from "./game";
import {Tile} from "./tile";
import {isUndefined} from "./utils";

const deg60 = Math.PI / 3;
const deg30 = Math.PI / 6;
const hexRadius = 40;

interface Drawable {
    draw: (ctx: CanvasRenderingContext2D) => void;
}

interface Clickable {
    isWithinBounds(point: { x: number, y: number} ): boolean;
}

type Element = Drawable & Clickable;

export class Renderer {
    private canvas = document.getElementById('main') as HTMLCanvasElement;
    private ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    private mousePosition = {x: 0, y: 0};
    private game: Game | undefined;
    private focussedTile: Tile | undefined;
    private focussedTileIdx: number | undefined;

    constructor() {

        window.onkeydown = (e) => {
            if (this.focussedTile && e.key === "q" || e.key === "Q") {
                this.focussedTile?.rotateCounterClockwise();
            } else if (this.focussedTile && e.key === "e" || e.key === "E"){
                this.focussedTile?.rotateClockwise();
            }
        }

        this.canvas.onmousemove = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mousePosition.x = e.clientX - rect.left;
            this.mousePosition.y = e.clientY - rect.top;
        };

        this.canvas.onclick = (e) => {
            if (!this.game) return;
            const elements = this.getElements(this.game);
            const rect = this.canvas.getBoundingClientRect();
            this.mousePosition.x = e.clientX - rect.left;
            this.mousePosition.y = e.clientY - rect.top;
            const clickedElement = elements.find(element => element.isWithinBounds(this.mousePosition));
            if (clickedElement) {
                this.handleClickOnElement(clickedElement);
            } else {
                this.unfocus();
            }
        }
    }

    setSize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    render(game: Game) {
        this.game = game;
        this.setSize();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.font = "24px Ariel";

        // render points
        this.ctx.fillText("Points", this.canvas.width - 200, 20);
        game.players.forEach((player, i) => {
            const x = this.canvas.width - 200;
            const y = 70 + 30 * i;
            if (player === game.currentPlayer) this.ctx.fillStyle = "red"
            else this.ctx.fillStyle = "black";
            this.ctx.fillText(`${player.name}: ${player.points}`, x, y);
        })
        this.ctx.fillStyle = "black";
        this.ctx.fillText(`Tiles remaining: ${game.tilesRemaining}`, this.canvas.width - 450, 20);

        this.ctx.strokeStyle = "slateGrey";

        this.getElements(game).forEach(element => element.draw(this.ctx));
    }

    private handleClickOnElement(element: Element) {
        if (!this.game) return;
        const { tile, tileIdx } = (element as UnplayedTileRenderer);
        const { cell } = (element as CellRenderer);
        if (tile && !isUndefined(tileIdx)) {
            // clicking on an unplayed tile
            this.focussedTile = tile;
            this.focussedTileIdx = tileIdx;
        } else if (!isUndefined(cell)) {
            // clicking on a hexagon
            if (this.focussedTile && !isUndefined(this.focussedTileIdx)) {
                this.game.placeTile(this.game.currentPlayer, this.focussedTileIdx, cell.x, cell.y);
                this.unfocus();
            }
        } else {
            this.unfocus();
        }
    }

    private unfocus() {
        this.focussedTile = undefined;
        this.focussedTileIdx = undefined;
    }

    private getElements(game: Game): Element[] {
        const grid = game.board;
        // render board
        const elements : (Drawable & Clickable)[] = [];

        game.board.forEach(cell => {
            const {contents, x, y} = cell;
            if (contents) {
                elements.push(new PlayedTileRenderer(x,y,contents));
            } else {
                const element = new CellRenderer(cell);
                const isHovering = element.isWithinBounds(this.mousePosition);
                element.setIsHovering(isHovering);
                elements.push(element);
            }
        })

        // render tiles for current player
        game.currentPlayer.tiles.forEach((tile, idx) => {
            const element = new UnplayedTileRenderer(idx, 8 + 2, tile);
            if (tile === this.focussedTile) {
                element.setFill("blue");
            } else if (element.isWithinBounds(this.mousePosition)) {
                element.setFill("grey");
            }
            elements.push(element);
        })
        return elements;
    }
}

class CellRenderer implements Drawable, Clickable {
    private hexagonRenderer: HexagonRenderer;

    constructor(readonly cell: Cell) {
        this.hexagonRenderer = new HexagonRenderer(this.cell.x, this.cell.y);
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.hexagonRenderer.draw(ctx);
        const { text } = this.cell.options;
        if (text) {
            const [x,y] = this.hexagonRenderer.getMidpoint();
            const offset = (text.length/2) * 3.5; // px to move left
            ctx.fillStyle = "black";
            ctx.font = "8px Ariel";
            ctx.fillText(text, x - offset,y + 3)
        }
    }

    isWithinBounds(point: { x: number, y: number }): boolean {
        return this.hexagonRenderer.isWithinBounds(point);
    }

    setIsHovering(isHovering: boolean) {
        if (isHovering){
            this.hexagonRenderer.setFill("red");
        } else {
            this.hexagonRenderer.setFill(this.cell.options.color);
        }
    }
}

class HexagonRenderer implements Drawable, Clickable{
    private fill = "transparent";
    constructor(readonly gridX: number, readonly gridY: number) {}

    setFill(fill: string) {
        this.fill = fill;
    }

    draw(ctx: CanvasRenderingContext2D) {
        const [x,y] = this.getMidpoint();
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angleToPoint = deg30 + deg60 * i;
            const xOffset = hexRadius * Math.cos(angleToPoint);
            const yOffset = hexRadius * Math.sin(angleToPoint);
            ctx.lineTo(x + xOffset, y + yOffset);
        }
        ctx.fillStyle = this.fill;
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
    }

    isWithinBounds(point: { x: number, y: number} ): boolean {
        const [x,y] = this.getMidpoint();
        const vec = { x: point.x - x, y: point.y - y} // vec from centre of the hex to point;
        const magnitude = Math.sqrt(vec.x**2 + vec.y**2);
        const angleRad = Math.atan2(vec.y, vec.x) ;
        const perpendicularHeight = Math.sin(deg60 ) * hexRadius;

        let angleRadPos = angleRad;
        while(angleRadPos < 0) angleRadPos += 2* Math.PI;
        const angleRadNorm = angleRadPos % deg30;
        const distanceToEdge = perpendicularHeight/Math.cos(angleRadNorm);
        return magnitude < distanceToEdge;
    }

    getMidpoint(): [number, number] {
        const perpendicularHeight = Math.sin(deg60 ) * hexRadius;
        const halfEdgeLength = Math.cos(deg60) * hexRadius;
        const xOffset = perpendicularHeight;
        const x = (this.gridX+1)*perpendicularHeight*2;
        const y = (this.gridY+1)*(hexRadius + halfEdgeLength);
        if (this.gridY%2 === 0) {
            return [x, y]
        } else {
            return [x + xOffset, y]
        }
    }
}

class PlayedTileRenderer implements Drawable, Clickable {
    private hexagonRenderer : HexagonRenderer;
    constructor( private gridX: number, private gridY: number, readonly tile: Tile) {
       this.hexagonRenderer = new HexagonRenderer(gridX,gridY);
       this.hexagonRenderer.setFill("black");
    }

    setFill(fill: string) {
        this.hexagonRenderer.setFill(fill);
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.hexagonRenderer.draw(ctx);

        const [x,y] = this.hexagonRenderer.getMidpoint();
        const dotRadius = hexRadius * 0.1;
        this.tile.sides.forEach((side, idx) => {
            if (side !== 1) return;
            const angleToPoint = deg60 * idx - deg60*2;
            const xOffset = 0.7 * hexRadius * Math.cos(angleToPoint);
            const yOffset = 0.7 * hexRadius * Math.sin(angleToPoint);
            ctx.beginPath();
            ctx.ellipse(x + xOffset, y + yOffset, dotRadius, dotRadius, 0, 0,2*Math.PI);
            ctx.stroke();
            ctx.fillStyle = "white";
            ctx.fill();
            ctx.closePath();
        })
    }

    isWithinBounds(point: { x: number, y: number} ): boolean {
        return this.hexagonRenderer.isWithinBounds(point);
    }
}


class UnplayedTileRenderer implements Drawable, Clickable {
    private hexagonRenderer : HexagonRenderer;
    constructor( readonly tileIdx: number, private lastRow: number, readonly tile: Tile) {
        this.hexagonRenderer = new HexagonRenderer(tileIdx,lastRow);
        this.hexagonRenderer.setFill("black");
    }

    setFill(fill: string) {
        this.hexagonRenderer.setFill(fill);
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.hexagonRenderer.draw(ctx);

        const [x,y] = this.hexagonRenderer.getMidpoint();
        const dotRadius = hexRadius * 0.1;
        this.tile.sides.forEach((side, idx) => {
            if (side !== 1) return;
            const angleToPoint = deg60 * idx - deg60*2;
            const xOffset = 0.7 * hexRadius * Math.cos(angleToPoint);
            const yOffset = 0.7 * hexRadius * Math.sin(angleToPoint);
            ctx.beginPath();
            ctx.ellipse(x + xOffset, y + yOffset, dotRadius, dotRadius, 0, 0,2*Math.PI);
            ctx.stroke();
            ctx.fillStyle = "white";
            ctx.fill();
            ctx.closePath();
        })
    }

    isWithinBounds(point: { x: number, y: number} ): boolean {
        return this.hexagonRenderer.isWithinBounds(point);
    }

}