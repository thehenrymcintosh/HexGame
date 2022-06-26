import {Game, Player} from "./game";
import {Renderer} from "./renderer";

const renderer = new Renderer();

const p1 = new Player("Player 1");
const p2 = new Player("Player 2");
const game = new Game([p1, p2]);
game.setupBoard();
const main = () => {
    renderer.render(game);
    requestAnimationFrame(main);
}

alert(`The aim of the game is to score the most points. 
You gain a point for every edge that matches its neighbours, and lose a point for every edge that does not.
You have to play tiles up against at least one other tile.
You always have 4 tiles, and get a new one every time you put one down.
The game ends when there are no spaces left to play.
The current score is in the top right, and the current player is shown in red.
Click a tile in the row at the bottom to select it. Use Q and E to rotate the tile, then click on the grid to place the tile.
Good luck!
`)

main();