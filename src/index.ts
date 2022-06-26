import {Game, Player} from "./game";
import {Renderer} from "./renderer";

const renderer = new Renderer();

    const p1 = new Player("Player 1");
    const p2 = new Player("Player 2");
    const game = new Game([p1, p2]);
const main = () => {
    renderer.render(game);
    requestAnimationFrame(main);
}

main();