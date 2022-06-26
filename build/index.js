/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/game.ts":
/*!*********************!*\
  !*** ./src/game.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Game = exports.Player = void 0;
var tile_1 = __webpack_require__(/*! ./tile */ "./src/tile.ts");
var utils_1 = __webpack_require__(/*! ./utils */ "./src/utils.ts");
var Player = /** @class */ (function () {
    function Player(name) {
        this.name = name;
        this._tiles = [];
        this._points = 0;
    }
    Player.prototype.giveTile = function (tile) {
        this._tiles.push(tile);
    };
    Player.prototype.takeTile = function (index) {
        var err = new Error("No tile in that position!");
        if (index >= this._tiles.length)
            throw err;
        if (index < 0)
            throw err;
        var tile = this._tiles.splice(index, 1)[0];
        if (!tile)
            throw err;
        return tile;
    };
    Player.prototype.awardPoints = function (points) {
        this._points += points;
    };
    Object.defineProperty(Player.prototype, "tiles", {
        get: function () {
            return this._tiles.slice();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "points", {
        get: function () {
            return this._points;
        },
        enumerable: false,
        configurable: true
    });
    Player.prototype.toString = function () {
        return "".concat(this.name, ": ").concat(this.points, " points");
    };
    return Player;
}());
exports.Player = Player;
var Game = /** @class */ (function () {
    function Game(players) {
        this.currentPlayerIndex = 0;
        if (players.length < 2)
            throw new Error("Minimum 2 players!");
        if (players.length > 4)
            throw new Error("Maximum 4 players!");
        this._board = (0, utils_1.matrix)(8, 8, undefined);
        this.drawPile = new Array(64)
            .fill(0)
            .map(function (val, i) { return i; })
            // .slice(1) // remove 0 value tile to put in middle of board
            .sort(function () { return Math.random() - 0.5; }) // shuffle
            .map(function (val) { return new tile_1.Tile(val); });
        this.players = players;
        this.distributeTiles(4);
    }
    Game.prototype.setupBoard = function () {
        this.setupBoardPerimeter();
        this.setupBoardCentre();
    };
    Game.prototype.setupBoardCentre = function () {
        this.setTileAt(this.drawPile.pop(), 2, 2);
        this.setTileAt(this.drawPile.pop(), 5, 2);
        this.setTileAt(this.drawPile.pop(), 2, 5);
        this.setTileAt(this.drawPile.pop(), 5, 5);
        this.setTileAt(this.drawPile.pop(), 3, 3);
        this.setTileAt(this.drawPile.pop(), 4, 4);
    };
    Game.prototype.setupBoardPerimeter = function () {
        var farRowIdx = this._board.length - 1;
        for (var i = 0; i < this._board.length; i++) {
            this.setTileAt(this.drawPile.pop(), i, 0);
            this.setTileAt(this.drawPile.pop(), i, farRowIdx);
        }
        for (var i = 1; i < this._board.length - 1; i++) {
            this.setTileAt(this.drawPile.pop(), 0, i);
            this.setTileAt(this.drawPile.pop(), farRowIdx, i);
        }
    };
    Object.defineProperty(Game.prototype, "tilesRemaining", {
        get: function () {
            return this.drawPile.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "board", {
        get: function () {
            return this._board.slice();
        },
        enumerable: false,
        configurable: true
    });
    Game.prototype.distributeTiles = function (count) {
        var _this = this;
        this.players.forEach(function (player) {
            while (player.tiles.length < count) {
                var tile = _this.drawPile.pop();
                if (!tile)
                    throw new Error("Out of tiles!");
                player.giveTile(tile);
            }
        });
    };
    Game.prototype.placeTile = function (player, tileIdx, x, y) {
        if (!this.isValidPosition(x, y))
            throw new Error("Position out of bounds!");
        var existingTile = this.getTileAt(x, y);
        if (existingTile)
            throw new Error("Space already occupied!");
        if (this.neighbourCount(x, y) === 0)
            throw new Error("Must place a tile against another one");
        if (player !== this.currentPlayer)
            throw new Error("Not ".concat(player.name, "'s turn!"));
        var tile = player.takeTile(tileIdx);
        this.setTileAt(tile, x, y);
        var points = this.calculatePointsForTile(x, y);
        this.currentPlayer.awardPoints(points);
        var drawnTile = this.drawPile.pop();
        if (drawnTile)
            this.currentPlayer.giveTile(drawnTile);
        var everyoneIsOutOfTiles = this.players.every(function (player) { return player.tiles.length === 0; });
        var boardIsFull = this.board.every(function (row) { return row.every(function (cell) { return !!cell; }); });
        if (boardIsFull || everyoneIsOutOfTiles) {
            alert("Game over, final points: ".concat(this.players.map(function (player) { return player.toString(); }).join(", ")));
        }
        this.currentPlayerIndex += 1;
        this.currentPlayerIndex = this.currentPlayerIndex % this.players.length;
    };
    Game.prototype.calculatePointsForTile = function (x, y) {
        var tile = this.getTileAt(x, y);
        if (!tile)
            throw new Error("No tile to calculate!");
        var neighbourValues = this.getNeighbouringValuesTo(x, y);
        return tile.sides.reduce(function (points, sideValue, sideIndex) {
            var neighbouringSideValue = neighbourValues[sideIndex];
            if (neighbouringSideValue === sideValue)
                return points + 1;
            if (!(0, utils_1.isUndefined)(neighbouringSideValue))
                return points - 1;
            return points;
        }, 0);
    };
    Game.prototype.getNeighbouringValuesTo = function (x, y) {
        var tiles = this.getNeighbouringTilesTo(x, y);
        return tiles.map(function (tile, faceIndex) {
            return tile === null || tile === void 0 ? void 0 : tile.getOpposingFaceValueTo(faceIndex);
        });
    };
    Game.prototype.neighbourCount = function (x, y) {
        return this.getNeighbouringTilesTo(x, y)
            .reduce(function (count, tile) {
            if (tile)
                return count + 1;
            return count;
        }, 0);
    };
    Game.prototype.getNeighbouringTilesTo = function (x, y) {
        var isEvenRow = y % 2 === 0;
        var rowOffset = isEvenRow ? -1 : 0;
        return [
            this.getTileAt(x + rowOffset, y - 1),
            this.getTileAt(x + 1 + rowOffset, y - 1),
            this.getTileAt(x + 1, y),
            this.getTileAt(x + 1 + rowOffset, y + 1),
            this.getTileAt(x + rowOffset, y + 1),
            this.getTileAt(x - 1, y) // left
        ];
    };
    Object.defineProperty(Game.prototype, "currentPlayer", {
        get: function () {
            return this.players[this.currentPlayerIndex];
        },
        enumerable: false,
        configurable: true
    });
    Game.prototype.getTileAt = function (x, y) {
        if (!this.isValidPosition(x, y))
            return;
        return this._board[y][x];
    };
    Game.prototype.setTileAt = function (tile, x, y) {
        this._board[y][x] = tile;
    };
    Game.prototype.isValidPosition = function (x, y) {
        if (x < 0)
            return false;
        if (y < 0)
            return false;
        if (y >= this.board.length)
            return false;
        if (x >= this.board[0].length)
            return false;
        return true;
    };
    Game.prototype.print = function () {
        this.players.forEach(function (player) { return console.log(player.toString()); });
        this._board.map(function (row, rowIndex) {
            var isOdd = rowIndex % 2 === 1;
            var spacing = isOdd ? " " : "";
            console.log("".concat(spacing).concat(row.map(function (tile) { return !!tile ? 1 : 0; }).join(".")));
        });
    };
    return Game;
}());
exports.Game = Game;


/***/ }),

/***/ "./src/renderer.ts":
/*!*************************!*\
  !*** ./src/renderer.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Renderer = void 0;
var utils_1 = __webpack_require__(/*! ./utils */ "./src/utils.ts");
var deg60 = Math.PI / 3;
var deg30 = Math.PI / 6;
var Renderer = /** @class */ (function () {
    function Renderer() {
        var _this = this;
        this.canvas = document.getElementById('main');
        this.ctx = this.canvas.getContext('2d');
        this.hexRadius = 40;
        this.mousePosition = { x: 0, y: 0 };
        window.onkeydown = function (e) {
            var _a, _b;
            if (_this.focussedTile && e.key === "q" || e.key === "Q") {
                (_a = _this.focussedTile) === null || _a === void 0 ? void 0 : _a.rotateCounterClockwise();
            }
            else if (_this.focussedTile && e.key === "e" || e.key === "E") {
                (_b = _this.focussedTile) === null || _b === void 0 ? void 0 : _b.rotateClockwise();
            }
        };
        this.canvas.onmousemove = function (e) {
            var rect = _this.canvas.getBoundingClientRect();
            _this.mousePosition.x = e.clientX - rect.left;
            _this.mousePosition.y = e.clientY - rect.top;
        };
        this.canvas.onclick = function (e) {
            if (!_this.game)
                return;
            var elements = _this.getElements(_this.game);
            var rect = _this.canvas.getBoundingClientRect();
            _this.mousePosition.x = e.clientX - rect.left;
            _this.mousePosition.y = e.clientY - rect.top;
            var clickedElement = elements.find(function (element) { return element.isWithinBounds(_this.mousePosition); });
            if (clickedElement) {
                _this.handleClickOnElement(clickedElement);
            }
            else {
                _this.unfocus();
            }
        };
    }
    Renderer.prototype.setSize = function () {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    };
    Renderer.prototype.render = function (game) {
        var _this = this;
        this.game = game;
        this.setSize();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.font = "24px Ariel";
        // render points
        this.ctx.fillText("Points", this.canvas.width - 200, 20);
        game.players.forEach(function (player, i) {
            var x = _this.canvas.width - 200;
            var y = 70 + 30 * i;
            if (player === game.currentPlayer)
                _this.ctx.fillStyle = "red";
            else
                _this.ctx.fillStyle = "black";
            _this.ctx.fillText("".concat(player.name, ": ").concat(player.points), x, y);
        });
        this.ctx.fillStyle = "black";
        this.ctx.fillText("Tiles remaining: ".concat(game.tilesRemaining), this.canvas.width - 450, 20);
        this.ctx.strokeStyle = "slateGrey";
        this.getElements(game).forEach(function (element) { return element.draw(_this.ctx); });
    };
    Renderer.prototype.handleClickOnElement = function (element) {
        if (!this.game)
            return;
        var _a = element, tile = _a.tile, tileIdx = _a.tileIdx;
        var _b = element, gridX = _b.gridX, gridY = _b.gridY;
        if (tile && !(0, utils_1.isUndefined)(tileIdx)) {
            // clicking on an unplayed tile
            this.focussedTile = tile;
            this.focussedTileIdx = tileIdx;
        }
        else if (!(0, utils_1.isUndefined)(gridX) && !(0, utils_1.isUndefined)(gridY)) {
            // clicking on a hexagon
            if (this.focussedTile && !(0, utils_1.isUndefined)(this.focussedTileIdx)) {
                this.game.placeTile(this.game.currentPlayer, this.focussedTileIdx, gridX, gridY);
                this.unfocus();
            }
        }
        else {
            this.unfocus();
        }
    };
    Renderer.prototype.unfocus = function () {
        this.focussedTile = undefined;
        this.focussedTileIdx = undefined;
    };
    Renderer.prototype.getElements = function (game) {
        var _this = this;
        var grid = game.board;
        var hexRadius = this.hexRadius;
        // render board
        var elements = [];
        for (var gridY = 0; gridY < grid.length; gridY++) {
            for (var gridX = 0; gridX < grid[0].length; gridX++) {
                var tile = game.getTileAt(gridX, gridY);
                if (tile) {
                    elements.push(new PlayedTileRenderer(gridX, gridY, hexRadius, tile));
                }
                else {
                    var element = new HexagonRenderer(gridX, gridY, hexRadius);
                    if (element.isWithinBounds(this.mousePosition)) {
                        element.setFill("red");
                    }
                    elements.push(element);
                }
            }
        }
        // render tiles for current player
        game.currentPlayer.tiles.forEach(function (tile, idx) {
            var element = new UnplayedTileRenderer(idx, game.board.length + 2, hexRadius, tile);
            if (tile === _this.focussedTile) {
                element.setFill("blue");
            }
            else if (element.isWithinBounds(_this.mousePosition)) {
                element.setFill("grey");
            }
            elements.push(element);
        });
        return elements;
    };
    return Renderer;
}());
exports.Renderer = Renderer;
var HexagonRenderer = /** @class */ (function () {
    function HexagonRenderer(gridX, gridY, hexRadius) {
        this.gridX = gridX;
        this.gridY = gridY;
        this.hexRadius = hexRadius;
        this.fill = "transparent";
    }
    HexagonRenderer.prototype.setFill = function (fill) {
        this.fill = fill;
    };
    HexagonRenderer.prototype.draw = function (ctx) {
        var _a = this.getMidpoint(), x = _a[0], y = _a[1];
        var hexRadius = this.hexRadius;
        ctx.beginPath();
        for (var i = 0; i < 6; i++) {
            var angleToPoint = deg30 + deg60 * i;
            var xOffset = hexRadius * Math.cos(angleToPoint);
            var yOffset = hexRadius * Math.sin(angleToPoint);
            ctx.lineTo(x + xOffset, y + yOffset);
        }
        ctx.fillStyle = this.fill;
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
    };
    HexagonRenderer.prototype.isWithinBounds = function (point) {
        var _a = this.getMidpoint(), x = _a[0], y = _a[1];
        var vec = { x: point.x - x, y: point.y - y }; // vec from centre of the hex to point;
        var magnitude = Math.sqrt(Math.pow(vec.x, 2) + Math.pow(vec.y, 2));
        var angleRad = Math.atan2(vec.y, vec.x);
        var perpendicularHeight = Math.sin(deg60) * this.hexRadius;
        var angleRadPos = angleRad;
        while (angleRadPos < 0)
            angleRadPos += 2 * Math.PI;
        var angleRadNorm = angleRadPos % deg30;
        var distanceToEdge = perpendicularHeight / Math.cos(angleRadNorm);
        return magnitude < distanceToEdge;
    };
    HexagonRenderer.prototype.getMidpoint = function () {
        var perpendicularHeight = Math.sin(deg60) * this.hexRadius;
        var halfEdgeLength = Math.cos(deg60) * this.hexRadius;
        var xOffset = perpendicularHeight;
        var x = (this.gridX + 1) * perpendicularHeight * 2;
        var y = (this.gridY + 1) * (this.hexRadius + halfEdgeLength);
        if (this.gridY % 2 === 0) {
            return [x, y];
        }
        else {
            return [x + xOffset, y];
        }
    };
    return HexagonRenderer;
}());
var PlayedTileRenderer = /** @class */ (function () {
    function PlayedTileRenderer(gridX, gridY, hexRadius, tile) {
        this.gridX = gridX;
        this.gridY = gridY;
        this.hexRadius = hexRadius;
        this.tile = tile;
        this.hexagonRenderer = new HexagonRenderer(gridX, gridY, hexRadius);
        this.hexagonRenderer.setFill("black");
    }
    PlayedTileRenderer.prototype.setFill = function (fill) {
        this.hexagonRenderer.setFill(fill);
    };
    PlayedTileRenderer.prototype.draw = function (ctx) {
        this.hexagonRenderer.draw(ctx);
        var hexRadius = this.hexRadius;
        var _a = this.hexagonRenderer.getMidpoint(), x = _a[0], y = _a[1];
        var dotRadius = hexRadius * 0.1;
        this.tile.sides.forEach(function (side, idx) {
            if (side !== 1)
                return;
            var angleToPoint = deg60 * idx - deg60 * 2;
            var xOffset = 0.7 * hexRadius * Math.cos(angleToPoint);
            var yOffset = 0.7 * hexRadius * Math.sin(angleToPoint);
            ctx.beginPath();
            ctx.ellipse(x + xOffset, y + yOffset, dotRadius, dotRadius, 0, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fillStyle = "white";
            ctx.fill();
            ctx.closePath();
        });
    };
    PlayedTileRenderer.prototype.isWithinBounds = function (point) {
        return this.hexagonRenderer.isWithinBounds(point);
    };
    return PlayedTileRenderer;
}());
var UnplayedTileRenderer = /** @class */ (function () {
    function UnplayedTileRenderer(tileIdx, lastRow, hexRadius, tile) {
        this.tileIdx = tileIdx;
        this.lastRow = lastRow;
        this.hexRadius = hexRadius;
        this.tile = tile;
        this.hexagonRenderer = new HexagonRenderer(tileIdx, lastRow, hexRadius);
        this.hexagonRenderer.setFill("black");
    }
    UnplayedTileRenderer.prototype.setFill = function (fill) {
        this.hexagonRenderer.setFill(fill);
    };
    UnplayedTileRenderer.prototype.draw = function (ctx) {
        this.hexagonRenderer.draw(ctx);
        var hexRadius = this.hexRadius;
        var _a = this.hexagonRenderer.getMidpoint(), x = _a[0], y = _a[1];
        var dotRadius = hexRadius * 0.1;
        this.tile.sides.forEach(function (side, idx) {
            if (side !== 1)
                return;
            var angleToPoint = deg60 * idx - deg60 * 2;
            var xOffset = 0.7 * hexRadius * Math.cos(angleToPoint);
            var yOffset = 0.7 * hexRadius * Math.sin(angleToPoint);
            ctx.beginPath();
            ctx.ellipse(x + xOffset, y + yOffset, dotRadius, dotRadius, 0, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fillStyle = "white";
            ctx.fill();
            ctx.closePath();
        });
    };
    UnplayedTileRenderer.prototype.isWithinBounds = function (point) {
        return this.hexagonRenderer.isWithinBounds(point);
    };
    return UnplayedTileRenderer;
}());


/***/ }),

/***/ "./src/tile.ts":
/*!*********************!*\
  !*** ./src/tile.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Tile = void 0;
var Tile = /** @class */ (function () {
    function Tile(value) {
        if (value > 63)
            throw new Error("Tile value ".concat(value, " too high!"));
        if (value < 0)
            throw new Error("Tile value ".concat(value, " too low!"));
        var paddedValue = value + 64;
        this._sides = paddedValue
            .toString(2)
            .split("")
            .map(function (digit) { return parseInt(digit, 10); })
            .slice(1)
            .reverse();
    }
    Object.defineProperty(Tile.prototype, "sides", {
        get: function () {
            return this._sides;
        },
        enumerable: false,
        configurable: true
    });
    Tile.prototype.getFaceValue = function (faceIndex) {
        return this.sides[faceIndex];
    };
    Tile.prototype.getOpposingFaceValueTo = function (faceIndex) {
        var opposingFaceIndex = (faceIndex + 3) % 6;
        return this.getFaceValue(opposingFaceIndex);
    };
    Tile.prototype.toString = function () {
        var s = this._sides;
        return "\n             /".concat(s[0], "  ").concat(s[1], "\\\n            |").concat(s[5], "    ").concat(s[2], "|\n             \\").concat(s[4], "  ").concat(s[3], "/\n        ");
    };
    Tile.prototype.rotateClockwise = function () {
        var last = this._sides.pop();
        this._sides.unshift(last);
    };
    Tile.prototype.rotateCounterClockwise = function () {
        var last = this._sides.shift();
        this._sides.push(last);
    };
    return Tile;
}());
exports.Tile = Tile;


/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isUndefined = exports.matrix = void 0;
function matrix(m, n, defaultValue) {
    return Array.from({
        // generate array of length m
        length: m
        // inside map function generate array of size n
        // and fill it with `0`
    }, function () { return new Array(n).fill(defaultValue); });
}
exports.matrix = matrix;
;
function isUndefined(arg) {
    return typeof arg === "undefined";
}
exports.isUndefined = isUndefined;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
var game_1 = __webpack_require__(/*! ./game */ "./src/game.ts");
var renderer_1 = __webpack_require__(/*! ./renderer */ "./src/renderer.ts");
var renderer = new renderer_1.Renderer();
var p1 = new game_1.Player("Player 1");
var p2 = new game_1.Player("Player 2");
var game = new game_1.Game([p1, p2]);
game.setupBoard();
var main = function () {
    renderer.render(game);
    requestAnimationFrame(main);
};
alert("The aim of the game is to score the most points. \nYou gain a point for every edge that matches its neighbours, and lose a point for every edge that does not.\nYou have to play tiles up against at least one other tile.\nYou always have 4 tiles, and get a new one every time you put one down.\nThe game ends when there are no spaces left to play.\nThe current score is in the top right, and the current player is shown in red.\nClick a tile in the row at the bottom to select it. Use Q and E to rotate the tile, then click on the grid to place the tile.\nGood luck!\n");
main();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0FBQyw2QkFBUTtBQUM3QixpQkFBaUIsbUJBQU8sQ0FBQyxxQ0FBWTtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbmVvZG9taW5vLy4vc3JjL2dhbWUudHMiLCJ3ZWJwYWNrOi8vbmVvZG9taW5vLy4vc3JjL3JlbmRlcmVyLnRzIiwid2VicGFjazovL25lb2RvbWluby8uL3NyYy90aWxlLnRzIiwid2VicGFjazovL25lb2RvbWluby8uL3NyYy91dGlscy50cyIsIndlYnBhY2s6Ly9uZW9kb21pbm8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbmVvZG9taW5vLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5HYW1lID0gZXhwb3J0cy5QbGF5ZXIgPSB2b2lkIDA7XG52YXIgdGlsZV8xID0gcmVxdWlyZShcIi4vdGlsZVwiKTtcbnZhciB1dGlsc18xID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XG52YXIgUGxheWVyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFBsYXllcihuYW1lKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuX3RpbGVzID0gW107XG4gICAgICAgIHRoaXMuX3BvaW50cyA9IDA7XG4gICAgfVxuICAgIFBsYXllci5wcm90b3R5cGUuZ2l2ZVRpbGUgPSBmdW5jdGlvbiAodGlsZSkge1xuICAgICAgICB0aGlzLl90aWxlcy5wdXNoKHRpbGUpO1xuICAgIH07XG4gICAgUGxheWVyLnByb3RvdHlwZS50YWtlVGlsZSA9IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICB2YXIgZXJyID0gbmV3IEVycm9yKFwiTm8gdGlsZSBpbiB0aGF0IHBvc2l0aW9uIVwiKTtcbiAgICAgICAgaWYgKGluZGV4ID49IHRoaXMuX3RpbGVzLmxlbmd0aClcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgaWYgKGluZGV4IDwgMClcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgdmFyIHRpbGUgPSB0aGlzLl90aWxlcy5zcGxpY2UoaW5kZXgsIDEpWzBdO1xuICAgICAgICBpZiAoIXRpbGUpXG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIHJldHVybiB0aWxlO1xuICAgIH07XG4gICAgUGxheWVyLnByb3RvdHlwZS5hd2FyZFBvaW50cyA9IGZ1bmN0aW9uIChwb2ludHMpIHtcbiAgICAgICAgdGhpcy5fcG9pbnRzICs9IHBvaW50cztcbiAgICB9O1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQbGF5ZXIucHJvdG90eXBlLCBcInRpbGVzXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGlsZXMuc2xpY2UoKTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQbGF5ZXIucHJvdG90eXBlLCBcInBvaW50c1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BvaW50cztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIFBsYXllci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBcIlwiLmNvbmNhdCh0aGlzLm5hbWUsIFwiOiBcIikuY29uY2F0KHRoaXMucG9pbnRzLCBcIiBwb2ludHNcIik7XG4gICAgfTtcbiAgICByZXR1cm4gUGxheWVyO1xufSgpKTtcbmV4cG9ydHMuUGxheWVyID0gUGxheWVyO1xudmFyIEdhbWUgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gR2FtZShwbGF5ZXJzKSB7XG4gICAgICAgIHRoaXMuY3VycmVudFBsYXllckluZGV4ID0gMDtcbiAgICAgICAgaWYgKHBsYXllcnMubGVuZ3RoIDwgMilcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1pbmltdW0gMiBwbGF5ZXJzIVwiKTtcbiAgICAgICAgaWYgKHBsYXllcnMubGVuZ3RoID4gNClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1heGltdW0gNCBwbGF5ZXJzIVwiKTtcbiAgICAgICAgdGhpcy5fYm9hcmQgPSAoMCwgdXRpbHNfMS5tYXRyaXgpKDgsIDgsIHVuZGVmaW5lZCk7XG4gICAgICAgIHRoaXMuZHJhd1BpbGUgPSBuZXcgQXJyYXkoNjQpXG4gICAgICAgICAgICAuZmlsbCgwKVxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbiAodmFsLCBpKSB7IHJldHVybiBpOyB9KVxuICAgICAgICAgICAgLy8gLnNsaWNlKDEpIC8vIHJlbW92ZSAwIHZhbHVlIHRpbGUgdG8gcHV0IGluIG1pZGRsZSBvZiBib2FyZFxuICAgICAgICAgICAgLnNvcnQoZnVuY3Rpb24gKCkgeyByZXR1cm4gTWF0aC5yYW5kb20oKSAtIDAuNTsgfSkgLy8gc2h1ZmZsZVxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbiAodmFsKSB7IHJldHVybiBuZXcgdGlsZV8xLlRpbGUodmFsKTsgfSk7XG4gICAgICAgIHRoaXMucGxheWVycyA9IHBsYXllcnM7XG4gICAgICAgIHRoaXMuZGlzdHJpYnV0ZVRpbGVzKDQpO1xuICAgIH1cbiAgICBHYW1lLnByb3RvdHlwZS5zZXR1cEJvYXJkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnNldHVwQm9hcmRQZXJpbWV0ZXIoKTtcbiAgICAgICAgdGhpcy5zZXR1cEJvYXJkQ2VudHJlKCk7XG4gICAgfTtcbiAgICBHYW1lLnByb3RvdHlwZS5zZXR1cEJvYXJkQ2VudHJlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnNldFRpbGVBdCh0aGlzLmRyYXdQaWxlLnBvcCgpLCAyLCAyKTtcbiAgICAgICAgdGhpcy5zZXRUaWxlQXQodGhpcy5kcmF3UGlsZS5wb3AoKSwgNSwgMik7XG4gICAgICAgIHRoaXMuc2V0VGlsZUF0KHRoaXMuZHJhd1BpbGUucG9wKCksIDIsIDUpO1xuICAgICAgICB0aGlzLnNldFRpbGVBdCh0aGlzLmRyYXdQaWxlLnBvcCgpLCA1LCA1KTtcbiAgICAgICAgdGhpcy5zZXRUaWxlQXQodGhpcy5kcmF3UGlsZS5wb3AoKSwgMywgMyk7XG4gICAgICAgIHRoaXMuc2V0VGlsZUF0KHRoaXMuZHJhd1BpbGUucG9wKCksIDQsIDQpO1xuICAgIH07XG4gICAgR2FtZS5wcm90b3R5cGUuc2V0dXBCb2FyZFBlcmltZXRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGZhclJvd0lkeCA9IHRoaXMuX2JvYXJkLmxlbmd0aCAtIDE7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fYm9hcmQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuc2V0VGlsZUF0KHRoaXMuZHJhd1BpbGUucG9wKCksIGksIDApO1xuICAgICAgICAgICAgdGhpcy5zZXRUaWxlQXQodGhpcy5kcmF3UGlsZS5wb3AoKSwgaSwgZmFyUm93SWR4KTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IHRoaXMuX2JvYXJkLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5zZXRUaWxlQXQodGhpcy5kcmF3UGlsZS5wb3AoKSwgMCwgaSk7XG4gICAgICAgICAgICB0aGlzLnNldFRpbGVBdCh0aGlzLmRyYXdQaWxlLnBvcCgpLCBmYXJSb3dJZHgsIGkpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoR2FtZS5wcm90b3R5cGUsIFwidGlsZXNSZW1haW5pbmdcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRyYXdQaWxlLmxlbmd0aDtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShHYW1lLnByb3RvdHlwZSwgXCJib2FyZFwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JvYXJkLnNsaWNlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBHYW1lLnByb3RvdHlwZS5kaXN0cmlidXRlVGlsZXMgPSBmdW5jdGlvbiAoY291bnQpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5wbGF5ZXJzLmZvckVhY2goZnVuY3Rpb24gKHBsYXllcikge1xuICAgICAgICAgICAgd2hpbGUgKHBsYXllci50aWxlcy5sZW5ndGggPCBjb3VudCkge1xuICAgICAgICAgICAgICAgIHZhciB0aWxlID0gX3RoaXMuZHJhd1BpbGUucG9wKCk7XG4gICAgICAgICAgICAgICAgaWYgKCF0aWxlKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJPdXQgb2YgdGlsZXMhXCIpO1xuICAgICAgICAgICAgICAgIHBsYXllci5naXZlVGlsZSh0aWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBHYW1lLnByb3RvdHlwZS5wbGFjZVRpbGUgPSBmdW5jdGlvbiAocGxheWVyLCB0aWxlSWR4LCB4LCB5KSB7XG4gICAgICAgIGlmICghdGhpcy5pc1ZhbGlkUG9zaXRpb24oeCwgeSkpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJQb3NpdGlvbiBvdXQgb2YgYm91bmRzIVwiKTtcbiAgICAgICAgdmFyIGV4aXN0aW5nVGlsZSA9IHRoaXMuZ2V0VGlsZUF0KHgsIHkpO1xuICAgICAgICBpZiAoZXhpc3RpbmdUaWxlKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3BhY2UgYWxyZWFkeSBvY2N1cGllZCFcIik7XG4gICAgICAgIGlmICh0aGlzLm5laWdoYm91ckNvdW50KHgsIHkpID09PSAwKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTXVzdCBwbGFjZSBhIHRpbGUgYWdhaW5zdCBhbm90aGVyIG9uZVwiKTtcbiAgICAgICAgaWYgKHBsYXllciAhPT0gdGhpcy5jdXJyZW50UGxheWVyKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IFwiLmNvbmNhdChwbGF5ZXIubmFtZSwgXCIncyB0dXJuIVwiKSk7XG4gICAgICAgIHZhciB0aWxlID0gcGxheWVyLnRha2VUaWxlKHRpbGVJZHgpO1xuICAgICAgICB0aGlzLnNldFRpbGVBdCh0aWxlLCB4LCB5KTtcbiAgICAgICAgdmFyIHBvaW50cyA9IHRoaXMuY2FsY3VsYXRlUG9pbnRzRm9yVGlsZSh4LCB5KTtcbiAgICAgICAgdGhpcy5jdXJyZW50UGxheWVyLmF3YXJkUG9pbnRzKHBvaW50cyk7XG4gICAgICAgIHZhciBkcmF3blRpbGUgPSB0aGlzLmRyYXdQaWxlLnBvcCgpO1xuICAgICAgICBpZiAoZHJhd25UaWxlKVxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UGxheWVyLmdpdmVUaWxlKGRyYXduVGlsZSk7XG4gICAgICAgIHZhciBldmVyeW9uZUlzT3V0T2ZUaWxlcyA9IHRoaXMucGxheWVycy5ldmVyeShmdW5jdGlvbiAocGxheWVyKSB7IHJldHVybiBwbGF5ZXIudGlsZXMubGVuZ3RoID09PSAwOyB9KTtcbiAgICAgICAgdmFyIGJvYXJkSXNGdWxsID0gdGhpcy5ib2FyZC5ldmVyeShmdW5jdGlvbiAocm93KSB7IHJldHVybiByb3cuZXZlcnkoZnVuY3Rpb24gKGNlbGwpIHsgcmV0dXJuICEhY2VsbDsgfSk7IH0pO1xuICAgICAgICBpZiAoYm9hcmRJc0Z1bGwgfHwgZXZlcnlvbmVJc091dE9mVGlsZXMpIHtcbiAgICAgICAgICAgIGFsZXJ0KFwiR2FtZSBvdmVyLCBmaW5hbCBwb2ludHM6IFwiLmNvbmNhdCh0aGlzLnBsYXllcnMubWFwKGZ1bmN0aW9uIChwbGF5ZXIpIHsgcmV0dXJuIHBsYXllci50b1N0cmluZygpOyB9KS5qb2luKFwiLCBcIikpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN1cnJlbnRQbGF5ZXJJbmRleCArPSAxO1xuICAgICAgICB0aGlzLmN1cnJlbnRQbGF5ZXJJbmRleCA9IHRoaXMuY3VycmVudFBsYXllckluZGV4ICUgdGhpcy5wbGF5ZXJzLmxlbmd0aDtcbiAgICB9O1xuICAgIEdhbWUucHJvdG90eXBlLmNhbGN1bGF0ZVBvaW50c0ZvclRpbGUgPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICB2YXIgdGlsZSA9IHRoaXMuZ2V0VGlsZUF0KHgsIHkpO1xuICAgICAgICBpZiAoIXRpbGUpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyB0aWxlIHRvIGNhbGN1bGF0ZSFcIik7XG4gICAgICAgIHZhciBuZWlnaGJvdXJWYWx1ZXMgPSB0aGlzLmdldE5laWdoYm91cmluZ1ZhbHVlc1RvKHgsIHkpO1xuICAgICAgICByZXR1cm4gdGlsZS5zaWRlcy5yZWR1Y2UoZnVuY3Rpb24gKHBvaW50cywgc2lkZVZhbHVlLCBzaWRlSW5kZXgpIHtcbiAgICAgICAgICAgIHZhciBuZWlnaGJvdXJpbmdTaWRlVmFsdWUgPSBuZWlnaGJvdXJWYWx1ZXNbc2lkZUluZGV4XTtcbiAgICAgICAgICAgIGlmIChuZWlnaGJvdXJpbmdTaWRlVmFsdWUgPT09IHNpZGVWYWx1ZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gcG9pbnRzICsgMTtcbiAgICAgICAgICAgIGlmICghKDAsIHV0aWxzXzEuaXNVbmRlZmluZWQpKG5laWdoYm91cmluZ1NpZGVWYWx1ZSkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBvaW50cyAtIDE7XG4gICAgICAgICAgICByZXR1cm4gcG9pbnRzO1xuICAgICAgICB9LCAwKTtcbiAgICB9O1xuICAgIEdhbWUucHJvdG90eXBlLmdldE5laWdoYm91cmluZ1ZhbHVlc1RvID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgdmFyIHRpbGVzID0gdGhpcy5nZXROZWlnaGJvdXJpbmdUaWxlc1RvKHgsIHkpO1xuICAgICAgICByZXR1cm4gdGlsZXMubWFwKGZ1bmN0aW9uICh0aWxlLCBmYWNlSW5kZXgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aWxlID09PSBudWxsIHx8IHRpbGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHRpbGUuZ2V0T3Bwb3NpbmdGYWNlVmFsdWVUbyhmYWNlSW5kZXgpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIEdhbWUucHJvdG90eXBlLm5laWdoYm91ckNvdW50ID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0TmVpZ2hib3VyaW5nVGlsZXNUbyh4LCB5KVxuICAgICAgICAgICAgLnJlZHVjZShmdW5jdGlvbiAoY291bnQsIHRpbGUpIHtcbiAgICAgICAgICAgIGlmICh0aWxlKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb3VudCArIDE7XG4gICAgICAgICAgICByZXR1cm4gY291bnQ7XG4gICAgICAgIH0sIDApO1xuICAgIH07XG4gICAgR2FtZS5wcm90b3R5cGUuZ2V0TmVpZ2hib3VyaW5nVGlsZXNUbyA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgICAgIHZhciBpc0V2ZW5Sb3cgPSB5ICUgMiA9PT0gMDtcbiAgICAgICAgdmFyIHJvd09mZnNldCA9IGlzRXZlblJvdyA/IC0xIDogMDtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIHRoaXMuZ2V0VGlsZUF0KHggKyByb3dPZmZzZXQsIHkgLSAxKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0VGlsZUF0KHggKyAxICsgcm93T2Zmc2V0LCB5IC0gMSksXG4gICAgICAgICAgICB0aGlzLmdldFRpbGVBdCh4ICsgMSwgeSksXG4gICAgICAgICAgICB0aGlzLmdldFRpbGVBdCh4ICsgMSArIHJvd09mZnNldCwgeSArIDEpLFxuICAgICAgICAgICAgdGhpcy5nZXRUaWxlQXQoeCArIHJvd09mZnNldCwgeSArIDEpLFxuICAgICAgICAgICAgdGhpcy5nZXRUaWxlQXQoeCAtIDEsIHkpIC8vIGxlZnRcbiAgICAgICAgXTtcbiAgICB9O1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShHYW1lLnByb3RvdHlwZSwgXCJjdXJyZW50UGxheWVyXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wbGF5ZXJzW3RoaXMuY3VycmVudFBsYXllckluZGV4XTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIEdhbWUucHJvdG90eXBlLmdldFRpbGVBdCA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgICAgIGlmICghdGhpcy5pc1ZhbGlkUG9zaXRpb24oeCwgeSkpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHJldHVybiB0aGlzLl9ib2FyZFt5XVt4XTtcbiAgICB9O1xuICAgIEdhbWUucHJvdG90eXBlLnNldFRpbGVBdCA9IGZ1bmN0aW9uICh0aWxlLCB4LCB5KSB7XG4gICAgICAgIHRoaXMuX2JvYXJkW3ldW3hdID0gdGlsZTtcbiAgICB9O1xuICAgIEdhbWUucHJvdG90eXBlLmlzVmFsaWRQb3NpdGlvbiA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgICAgIGlmICh4IDwgMClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKHkgPCAwKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiAoeSA+PSB0aGlzLmJvYXJkLmxlbmd0aClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKHggPj0gdGhpcy5ib2FyZFswXS5sZW5ndGgpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG4gICAgR2FtZS5wcm90b3R5cGUucHJpbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMucGxheWVycy5mb3JFYWNoKGZ1bmN0aW9uIChwbGF5ZXIpIHsgcmV0dXJuIGNvbnNvbGUubG9nKHBsYXllci50b1N0cmluZygpKTsgfSk7XG4gICAgICAgIHRoaXMuX2JvYXJkLm1hcChmdW5jdGlvbiAocm93LCByb3dJbmRleCkge1xuICAgICAgICAgICAgdmFyIGlzT2RkID0gcm93SW5kZXggJSAyID09PSAxO1xuICAgICAgICAgICAgdmFyIHNwYWNpbmcgPSBpc09kZCA/IFwiIFwiIDogXCJcIjtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiXCIuY29uY2F0KHNwYWNpbmcpLmNvbmNhdChyb3cubWFwKGZ1bmN0aW9uICh0aWxlKSB7IHJldHVybiAhIXRpbGUgPyAxIDogMDsgfSkuam9pbihcIi5cIikpKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICByZXR1cm4gR2FtZTtcbn0oKSk7XG5leHBvcnRzLkdhbWUgPSBHYW1lO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlJlbmRlcmVyID0gdm9pZCAwO1xudmFyIHV0aWxzXzEgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbnZhciBkZWc2MCA9IE1hdGguUEkgLyAzO1xudmFyIGRlZzMwID0gTWF0aC5QSSAvIDY7XG52YXIgUmVuZGVyZXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gUmVuZGVyZXIoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4nKTtcbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICB0aGlzLmhleFJhZGl1cyA9IDQwO1xuICAgICAgICB0aGlzLm1vdXNlUG9zaXRpb24gPSB7IHg6IDAsIHk6IDAgfTtcbiAgICAgICAgd2luZG93Lm9ua2V5ZG93biA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICAgICAgaWYgKF90aGlzLmZvY3Vzc2VkVGlsZSAmJiBlLmtleSA9PT0gXCJxXCIgfHwgZS5rZXkgPT09IFwiUVwiKSB7XG4gICAgICAgICAgICAgICAgKF9hID0gX3RoaXMuZm9jdXNzZWRUaWxlKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Eucm90YXRlQ291bnRlckNsb2Nrd2lzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoX3RoaXMuZm9jdXNzZWRUaWxlICYmIGUua2V5ID09PSBcImVcIiB8fCBlLmtleSA9PT0gXCJFXCIpIHtcbiAgICAgICAgICAgICAgICAoX2IgPSBfdGhpcy5mb2N1c3NlZFRpbGUpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5yb3RhdGVDbG9ja3dpc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5jYW52YXMub25tb3VzZW1vdmUgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgdmFyIHJlY3QgPSBfdGhpcy5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICBfdGhpcy5tb3VzZVBvc2l0aW9uLnggPSBlLmNsaWVudFggLSByZWN0LmxlZnQ7XG4gICAgICAgICAgICBfdGhpcy5tb3VzZVBvc2l0aW9uLnkgPSBlLmNsaWVudFkgLSByZWN0LnRvcDtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5jYW52YXMub25jbGljayA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBpZiAoIV90aGlzLmdhbWUpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgdmFyIGVsZW1lbnRzID0gX3RoaXMuZ2V0RWxlbWVudHMoX3RoaXMuZ2FtZSk7XG4gICAgICAgICAgICB2YXIgcmVjdCA9IF90aGlzLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIF90aGlzLm1vdXNlUG9zaXRpb24ueCA9IGUuY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgICAgICAgICAgIF90aGlzLm1vdXNlUG9zaXRpb24ueSA9IGUuY2xpZW50WSAtIHJlY3QudG9wO1xuICAgICAgICAgICAgdmFyIGNsaWNrZWRFbGVtZW50ID0gZWxlbWVudHMuZmluZChmdW5jdGlvbiAoZWxlbWVudCkgeyByZXR1cm4gZWxlbWVudC5pc1dpdGhpbkJvdW5kcyhfdGhpcy5tb3VzZVBvc2l0aW9uKTsgfSk7XG4gICAgICAgICAgICBpZiAoY2xpY2tlZEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5oYW5kbGVDbGlja09uRWxlbWVudChjbGlja2VkRWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBfdGhpcy51bmZvY3VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIFJlbmRlcmVyLnByb3RvdHlwZS5zZXRTaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgfTtcbiAgICBSZW5kZXJlci5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKGdhbWUpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5zZXRTaXplKCk7XG4gICAgICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgdGhpcy5jdHguZm9udCA9IFwiMjRweCBBcmllbFwiO1xuICAgICAgICAvLyByZW5kZXIgcG9pbnRzXG4gICAgICAgIHRoaXMuY3R4LmZpbGxUZXh0KFwiUG9pbnRzXCIsIHRoaXMuY2FudmFzLndpZHRoIC0gMjAwLCAyMCk7XG4gICAgICAgIGdhbWUucGxheWVycy5mb3JFYWNoKGZ1bmN0aW9uIChwbGF5ZXIsIGkpIHtcbiAgICAgICAgICAgIHZhciB4ID0gX3RoaXMuY2FudmFzLndpZHRoIC0gMjAwO1xuICAgICAgICAgICAgdmFyIHkgPSA3MCArIDMwICogaTtcbiAgICAgICAgICAgIGlmIChwbGF5ZXIgPT09IGdhbWUuY3VycmVudFBsYXllcilcbiAgICAgICAgICAgICAgICBfdGhpcy5jdHguZmlsbFN0eWxlID0gXCJyZWRcIjtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBfdGhpcy5jdHguZmlsbFN0eWxlID0gXCJibGFja1wiO1xuICAgICAgICAgICAgX3RoaXMuY3R4LmZpbGxUZXh0KFwiXCIuY29uY2F0KHBsYXllci5uYW1lLCBcIjogXCIpLmNvbmNhdChwbGF5ZXIucG9pbnRzKSwgeCwgeSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XG4gICAgICAgIHRoaXMuY3R4LmZpbGxUZXh0KFwiVGlsZXMgcmVtYWluaW5nOiBcIi5jb25jYXQoZ2FtZS50aWxlc1JlbWFpbmluZyksIHRoaXMuY2FudmFzLndpZHRoIC0gNDUwLCAyMCk7XG4gICAgICAgIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gXCJzbGF0ZUdyZXlcIjtcbiAgICAgICAgdGhpcy5nZXRFbGVtZW50cyhnYW1lKS5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7IHJldHVybiBlbGVtZW50LmRyYXcoX3RoaXMuY3R4KTsgfSk7XG4gICAgfTtcbiAgICBSZW5kZXJlci5wcm90b3R5cGUuaGFuZGxlQ2xpY2tPbkVsZW1lbnQgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICBpZiAoIXRoaXMuZ2FtZSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdmFyIF9hID0gZWxlbWVudCwgdGlsZSA9IF9hLnRpbGUsIHRpbGVJZHggPSBfYS50aWxlSWR4O1xuICAgICAgICB2YXIgX2IgPSBlbGVtZW50LCBncmlkWCA9IF9iLmdyaWRYLCBncmlkWSA9IF9iLmdyaWRZO1xuICAgICAgICBpZiAodGlsZSAmJiAhKDAsIHV0aWxzXzEuaXNVbmRlZmluZWQpKHRpbGVJZHgpKSB7XG4gICAgICAgICAgICAvLyBjbGlja2luZyBvbiBhbiB1bnBsYXllZCB0aWxlXG4gICAgICAgICAgICB0aGlzLmZvY3Vzc2VkVGlsZSA9IHRpbGU7XG4gICAgICAgICAgICB0aGlzLmZvY3Vzc2VkVGlsZUlkeCA9IHRpbGVJZHg7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoISgwLCB1dGlsc18xLmlzVW5kZWZpbmVkKShncmlkWCkgJiYgISgwLCB1dGlsc18xLmlzVW5kZWZpbmVkKShncmlkWSkpIHtcbiAgICAgICAgICAgIC8vIGNsaWNraW5nIG9uIGEgaGV4YWdvblxuICAgICAgICAgICAgaWYgKHRoaXMuZm9jdXNzZWRUaWxlICYmICEoMCwgdXRpbHNfMS5pc1VuZGVmaW5lZCkodGhpcy5mb2N1c3NlZFRpbGVJZHgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnBsYWNlVGlsZSh0aGlzLmdhbWUuY3VycmVudFBsYXllciwgdGhpcy5mb2N1c3NlZFRpbGVJZHgsIGdyaWRYLCBncmlkWSk7XG4gICAgICAgICAgICAgICAgdGhpcy51bmZvY3VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnVuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUmVuZGVyZXIucHJvdG90eXBlLnVuZm9jdXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuZm9jdXNzZWRUaWxlID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLmZvY3Vzc2VkVGlsZUlkeCA9IHVuZGVmaW5lZDtcbiAgICB9O1xuICAgIFJlbmRlcmVyLnByb3RvdHlwZS5nZXRFbGVtZW50cyA9IGZ1bmN0aW9uIChnYW1lKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBncmlkID0gZ2FtZS5ib2FyZDtcbiAgICAgICAgdmFyIGhleFJhZGl1cyA9IHRoaXMuaGV4UmFkaXVzO1xuICAgICAgICAvLyByZW5kZXIgYm9hcmRcbiAgICAgICAgdmFyIGVsZW1lbnRzID0gW107XG4gICAgICAgIGZvciAodmFyIGdyaWRZID0gMDsgZ3JpZFkgPCBncmlkLmxlbmd0aDsgZ3JpZFkrKykge1xuICAgICAgICAgICAgZm9yICh2YXIgZ3JpZFggPSAwOyBncmlkWCA8IGdyaWRbMF0ubGVuZ3RoOyBncmlkWCsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRpbGUgPSBnYW1lLmdldFRpbGVBdChncmlkWCwgZ3JpZFkpO1xuICAgICAgICAgICAgICAgIGlmICh0aWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzLnB1c2gobmV3IFBsYXllZFRpbGVSZW5kZXJlcihncmlkWCwgZ3JpZFksIGhleFJhZGl1cywgdGlsZSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBuZXcgSGV4YWdvblJlbmRlcmVyKGdyaWRYLCBncmlkWSwgaGV4UmFkaXVzKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuaXNXaXRoaW5Cb3VuZHModGhpcy5tb3VzZVBvc2l0aW9uKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zZXRGaWxsKFwicmVkXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzLnB1c2goZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIHJlbmRlciB0aWxlcyBmb3IgY3VycmVudCBwbGF5ZXJcbiAgICAgICAgZ2FtZS5jdXJyZW50UGxheWVyLnRpbGVzLmZvckVhY2goZnVuY3Rpb24gKHRpbGUsIGlkeCkge1xuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBuZXcgVW5wbGF5ZWRUaWxlUmVuZGVyZXIoaWR4LCBnYW1lLmJvYXJkLmxlbmd0aCArIDIsIGhleFJhZGl1cywgdGlsZSk7XG4gICAgICAgICAgICBpZiAodGlsZSA9PT0gX3RoaXMuZm9jdXNzZWRUaWxlKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zZXRGaWxsKFwiYmx1ZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGVsZW1lbnQuaXNXaXRoaW5Cb3VuZHMoX3RoaXMubW91c2VQb3NpdGlvbikpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnNldEZpbGwoXCJncmV5XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxlbWVudHMucHVzaChlbGVtZW50KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBlbGVtZW50cztcbiAgICB9O1xuICAgIHJldHVybiBSZW5kZXJlcjtcbn0oKSk7XG5leHBvcnRzLlJlbmRlcmVyID0gUmVuZGVyZXI7XG52YXIgSGV4YWdvblJlbmRlcmVyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEhleGFnb25SZW5kZXJlcihncmlkWCwgZ3JpZFksIGhleFJhZGl1cykge1xuICAgICAgICB0aGlzLmdyaWRYID0gZ3JpZFg7XG4gICAgICAgIHRoaXMuZ3JpZFkgPSBncmlkWTtcbiAgICAgICAgdGhpcy5oZXhSYWRpdXMgPSBoZXhSYWRpdXM7XG4gICAgICAgIHRoaXMuZmlsbCA9IFwidHJhbnNwYXJlbnRcIjtcbiAgICB9XG4gICAgSGV4YWdvblJlbmRlcmVyLnByb3RvdHlwZS5zZXRGaWxsID0gZnVuY3Rpb24gKGZpbGwpIHtcbiAgICAgICAgdGhpcy5maWxsID0gZmlsbDtcbiAgICB9O1xuICAgIEhleGFnb25SZW5kZXJlci5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uIChjdHgpIHtcbiAgICAgICAgdmFyIF9hID0gdGhpcy5nZXRNaWRwb2ludCgpLCB4ID0gX2FbMF0sIHkgPSBfYVsxXTtcbiAgICAgICAgdmFyIGhleFJhZGl1cyA9IHRoaXMuaGV4UmFkaXVzO1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNjsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYW5nbGVUb1BvaW50ID0gZGVnMzAgKyBkZWc2MCAqIGk7XG4gICAgICAgICAgICB2YXIgeE9mZnNldCA9IGhleFJhZGl1cyAqIE1hdGguY29zKGFuZ2xlVG9Qb2ludCk7XG4gICAgICAgICAgICB2YXIgeU9mZnNldCA9IGhleFJhZGl1cyAqIE1hdGguc2luKGFuZ2xlVG9Qb2ludCk7XG4gICAgICAgICAgICBjdHgubGluZVRvKHggKyB4T2Zmc2V0LCB5ICsgeU9mZnNldCk7XG4gICAgICAgIH1cbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZmlsbDtcbiAgICAgICAgY3R4LmZpbGwoKTtcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfTtcbiAgICBIZXhhZ29uUmVuZGVyZXIucHJvdG90eXBlLmlzV2l0aGluQm91bmRzID0gZnVuY3Rpb24gKHBvaW50KSB7XG4gICAgICAgIHZhciBfYSA9IHRoaXMuZ2V0TWlkcG9pbnQoKSwgeCA9IF9hWzBdLCB5ID0gX2FbMV07XG4gICAgICAgIHZhciB2ZWMgPSB7IHg6IHBvaW50LnggLSB4LCB5OiBwb2ludC55IC0geSB9OyAvLyB2ZWMgZnJvbSBjZW50cmUgb2YgdGhlIGhleCB0byBwb2ludDtcbiAgICAgICAgdmFyIG1hZ25pdHVkZSA9IE1hdGguc3FydChNYXRoLnBvdyh2ZWMueCwgMikgKyBNYXRoLnBvdyh2ZWMueSwgMikpO1xuICAgICAgICB2YXIgYW5nbGVSYWQgPSBNYXRoLmF0YW4yKHZlYy55LCB2ZWMueCk7XG4gICAgICAgIHZhciBwZXJwZW5kaWN1bGFySGVpZ2h0ID0gTWF0aC5zaW4oZGVnNjApICogdGhpcy5oZXhSYWRpdXM7XG4gICAgICAgIHZhciBhbmdsZVJhZFBvcyA9IGFuZ2xlUmFkO1xuICAgICAgICB3aGlsZSAoYW5nbGVSYWRQb3MgPCAwKVxuICAgICAgICAgICAgYW5nbGVSYWRQb3MgKz0gMiAqIE1hdGguUEk7XG4gICAgICAgIHZhciBhbmdsZVJhZE5vcm0gPSBhbmdsZVJhZFBvcyAlIGRlZzMwO1xuICAgICAgICB2YXIgZGlzdGFuY2VUb0VkZ2UgPSBwZXJwZW5kaWN1bGFySGVpZ2h0IC8gTWF0aC5jb3MoYW5nbGVSYWROb3JtKTtcbiAgICAgICAgcmV0dXJuIG1hZ25pdHVkZSA8IGRpc3RhbmNlVG9FZGdlO1xuICAgIH07XG4gICAgSGV4YWdvblJlbmRlcmVyLnByb3RvdHlwZS5nZXRNaWRwb2ludCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHBlcnBlbmRpY3VsYXJIZWlnaHQgPSBNYXRoLnNpbihkZWc2MCkgKiB0aGlzLmhleFJhZGl1cztcbiAgICAgICAgdmFyIGhhbGZFZGdlTGVuZ3RoID0gTWF0aC5jb3MoZGVnNjApICogdGhpcy5oZXhSYWRpdXM7XG4gICAgICAgIHZhciB4T2Zmc2V0ID0gcGVycGVuZGljdWxhckhlaWdodDtcbiAgICAgICAgdmFyIHggPSAodGhpcy5ncmlkWCArIDEpICogcGVycGVuZGljdWxhckhlaWdodCAqIDI7XG4gICAgICAgIHZhciB5ID0gKHRoaXMuZ3JpZFkgKyAxKSAqICh0aGlzLmhleFJhZGl1cyArIGhhbGZFZGdlTGVuZ3RoKTtcbiAgICAgICAgaWYgKHRoaXMuZ3JpZFkgJSAyID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gW3gsIHldO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFt4ICsgeE9mZnNldCwgeV07XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBIZXhhZ29uUmVuZGVyZXI7XG59KCkpO1xudmFyIFBsYXllZFRpbGVSZW5kZXJlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBQbGF5ZWRUaWxlUmVuZGVyZXIoZ3JpZFgsIGdyaWRZLCBoZXhSYWRpdXMsIHRpbGUpIHtcbiAgICAgICAgdGhpcy5ncmlkWCA9IGdyaWRYO1xuICAgICAgICB0aGlzLmdyaWRZID0gZ3JpZFk7XG4gICAgICAgIHRoaXMuaGV4UmFkaXVzID0gaGV4UmFkaXVzO1xuICAgICAgICB0aGlzLnRpbGUgPSB0aWxlO1xuICAgICAgICB0aGlzLmhleGFnb25SZW5kZXJlciA9IG5ldyBIZXhhZ29uUmVuZGVyZXIoZ3JpZFgsIGdyaWRZLCBoZXhSYWRpdXMpO1xuICAgICAgICB0aGlzLmhleGFnb25SZW5kZXJlci5zZXRGaWxsKFwiYmxhY2tcIik7XG4gICAgfVxuICAgIFBsYXllZFRpbGVSZW5kZXJlci5wcm90b3R5cGUuc2V0RmlsbCA9IGZ1bmN0aW9uIChmaWxsKSB7XG4gICAgICAgIHRoaXMuaGV4YWdvblJlbmRlcmVyLnNldEZpbGwoZmlsbCk7XG4gICAgfTtcbiAgICBQbGF5ZWRUaWxlUmVuZGVyZXIucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbiAoY3R4KSB7XG4gICAgICAgIHRoaXMuaGV4YWdvblJlbmRlcmVyLmRyYXcoY3R4KTtcbiAgICAgICAgdmFyIGhleFJhZGl1cyA9IHRoaXMuaGV4UmFkaXVzO1xuICAgICAgICB2YXIgX2EgPSB0aGlzLmhleGFnb25SZW5kZXJlci5nZXRNaWRwb2ludCgpLCB4ID0gX2FbMF0sIHkgPSBfYVsxXTtcbiAgICAgICAgdmFyIGRvdFJhZGl1cyA9IGhleFJhZGl1cyAqIDAuMTtcbiAgICAgICAgdGhpcy50aWxlLnNpZGVzLmZvckVhY2goZnVuY3Rpb24gKHNpZGUsIGlkeCkge1xuICAgICAgICAgICAgaWYgKHNpZGUgIT09IDEpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgdmFyIGFuZ2xlVG9Qb2ludCA9IGRlZzYwICogaWR4IC0gZGVnNjAgKiAyO1xuICAgICAgICAgICAgdmFyIHhPZmZzZXQgPSAwLjcgKiBoZXhSYWRpdXMgKiBNYXRoLmNvcyhhbmdsZVRvUG9pbnQpO1xuICAgICAgICAgICAgdmFyIHlPZmZzZXQgPSAwLjcgKiBoZXhSYWRpdXMgKiBNYXRoLnNpbihhbmdsZVRvUG9pbnQpO1xuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgY3R4LmVsbGlwc2UoeCArIHhPZmZzZXQsIHkgKyB5T2Zmc2V0LCBkb3RSYWRpdXMsIGRvdFJhZGl1cywgMCwgMCwgMiAqIE1hdGguUEkpO1xuICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwid2hpdGVcIjtcbiAgICAgICAgICAgIGN0eC5maWxsKCk7XG4gICAgICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgUGxheWVkVGlsZVJlbmRlcmVyLnByb3RvdHlwZS5pc1dpdGhpbkJvdW5kcyA9IGZ1bmN0aW9uIChwb2ludCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oZXhhZ29uUmVuZGVyZXIuaXNXaXRoaW5Cb3VuZHMocG9pbnQpO1xuICAgIH07XG4gICAgcmV0dXJuIFBsYXllZFRpbGVSZW5kZXJlcjtcbn0oKSk7XG52YXIgVW5wbGF5ZWRUaWxlUmVuZGVyZXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gVW5wbGF5ZWRUaWxlUmVuZGVyZXIodGlsZUlkeCwgbGFzdFJvdywgaGV4UmFkaXVzLCB0aWxlKSB7XG4gICAgICAgIHRoaXMudGlsZUlkeCA9IHRpbGVJZHg7XG4gICAgICAgIHRoaXMubGFzdFJvdyA9IGxhc3RSb3c7XG4gICAgICAgIHRoaXMuaGV4UmFkaXVzID0gaGV4UmFkaXVzO1xuICAgICAgICB0aGlzLnRpbGUgPSB0aWxlO1xuICAgICAgICB0aGlzLmhleGFnb25SZW5kZXJlciA9IG5ldyBIZXhhZ29uUmVuZGVyZXIodGlsZUlkeCwgbGFzdFJvdywgaGV4UmFkaXVzKTtcbiAgICAgICAgdGhpcy5oZXhhZ29uUmVuZGVyZXIuc2V0RmlsbChcImJsYWNrXCIpO1xuICAgIH1cbiAgICBVbnBsYXllZFRpbGVSZW5kZXJlci5wcm90b3R5cGUuc2V0RmlsbCA9IGZ1bmN0aW9uIChmaWxsKSB7XG4gICAgICAgIHRoaXMuaGV4YWdvblJlbmRlcmVyLnNldEZpbGwoZmlsbCk7XG4gICAgfTtcbiAgICBVbnBsYXllZFRpbGVSZW5kZXJlci5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uIChjdHgpIHtcbiAgICAgICAgdGhpcy5oZXhhZ29uUmVuZGVyZXIuZHJhdyhjdHgpO1xuICAgICAgICB2YXIgaGV4UmFkaXVzID0gdGhpcy5oZXhSYWRpdXM7XG4gICAgICAgIHZhciBfYSA9IHRoaXMuaGV4YWdvblJlbmRlcmVyLmdldE1pZHBvaW50KCksIHggPSBfYVswXSwgeSA9IF9hWzFdO1xuICAgICAgICB2YXIgZG90UmFkaXVzID0gaGV4UmFkaXVzICogMC4xO1xuICAgICAgICB0aGlzLnRpbGUuc2lkZXMuZm9yRWFjaChmdW5jdGlvbiAoc2lkZSwgaWR4KSB7XG4gICAgICAgICAgICBpZiAoc2lkZSAhPT0gMSlcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB2YXIgYW5nbGVUb1BvaW50ID0gZGVnNjAgKiBpZHggLSBkZWc2MCAqIDI7XG4gICAgICAgICAgICB2YXIgeE9mZnNldCA9IDAuNyAqIGhleFJhZGl1cyAqIE1hdGguY29zKGFuZ2xlVG9Qb2ludCk7XG4gICAgICAgICAgICB2YXIgeU9mZnNldCA9IDAuNyAqIGhleFJhZGl1cyAqIE1hdGguc2luKGFuZ2xlVG9Qb2ludCk7XG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBjdHguZWxsaXBzZSh4ICsgeE9mZnNldCwgeSArIHlPZmZzZXQsIGRvdFJhZGl1cywgZG90UmFkaXVzLCAwLCAwLCAyICogTWF0aC5QSSk7XG4gICAgICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJ3aGl0ZVwiO1xuICAgICAgICAgICAgY3R4LmZpbGwoKTtcbiAgICAgICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBVbnBsYXllZFRpbGVSZW5kZXJlci5wcm90b3R5cGUuaXNXaXRoaW5Cb3VuZHMgPSBmdW5jdGlvbiAocG9pbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGV4YWdvblJlbmRlcmVyLmlzV2l0aGluQm91bmRzKHBvaW50KTtcbiAgICB9O1xuICAgIHJldHVybiBVbnBsYXllZFRpbGVSZW5kZXJlcjtcbn0oKSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuVGlsZSA9IHZvaWQgMDtcbnZhciBUaWxlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFRpbGUodmFsdWUpIHtcbiAgICAgICAgaWYgKHZhbHVlID4gNjMpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaWxlIHZhbHVlIFwiLmNvbmNhdCh2YWx1ZSwgXCIgdG9vIGhpZ2ghXCIpKTtcbiAgICAgICAgaWYgKHZhbHVlIDwgMClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRpbGUgdmFsdWUgXCIuY29uY2F0KHZhbHVlLCBcIiB0b28gbG93IVwiKSk7XG4gICAgICAgIHZhciBwYWRkZWRWYWx1ZSA9IHZhbHVlICsgNjQ7XG4gICAgICAgIHRoaXMuX3NpZGVzID0gcGFkZGVkVmFsdWVcbiAgICAgICAgICAgIC50b1N0cmluZygyKVxuICAgICAgICAgICAgLnNwbGl0KFwiXCIpXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChkaWdpdCkgeyByZXR1cm4gcGFyc2VJbnQoZGlnaXQsIDEwKTsgfSlcbiAgICAgICAgICAgIC5zbGljZSgxKVxuICAgICAgICAgICAgLnJldmVyc2UoKTtcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFRpbGUucHJvdG90eXBlLCBcInNpZGVzXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2lkZXM7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBUaWxlLnByb3RvdHlwZS5nZXRGYWNlVmFsdWUgPSBmdW5jdGlvbiAoZmFjZUluZGV4KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNpZGVzW2ZhY2VJbmRleF07XG4gICAgfTtcbiAgICBUaWxlLnByb3RvdHlwZS5nZXRPcHBvc2luZ0ZhY2VWYWx1ZVRvID0gZnVuY3Rpb24gKGZhY2VJbmRleCkge1xuICAgICAgICB2YXIgb3Bwb3NpbmdGYWNlSW5kZXggPSAoZmFjZUluZGV4ICsgMykgJSA2O1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRGYWNlVmFsdWUob3Bwb3NpbmdGYWNlSW5kZXgpO1xuICAgIH07XG4gICAgVGlsZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzID0gdGhpcy5fc2lkZXM7XG4gICAgICAgIHJldHVybiBcIlxcbiAgICAgICAgICAgICAvXCIuY29uY2F0KHNbMF0sIFwiICBcIikuY29uY2F0KHNbMV0sIFwiXFxcXFxcbiAgICAgICAgICAgIHxcIikuY29uY2F0KHNbNV0sIFwiICAgIFwiKS5jb25jYXQoc1syXSwgXCJ8XFxuICAgICAgICAgICAgIFxcXFxcIikuY29uY2F0KHNbNF0sIFwiICBcIikuY29uY2F0KHNbM10sIFwiL1xcbiAgICAgICAgXCIpO1xuICAgIH07XG4gICAgVGlsZS5wcm90b3R5cGUucm90YXRlQ2xvY2t3aXNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbGFzdCA9IHRoaXMuX3NpZGVzLnBvcCgpO1xuICAgICAgICB0aGlzLl9zaWRlcy51bnNoaWZ0KGxhc3QpO1xuICAgIH07XG4gICAgVGlsZS5wcm90b3R5cGUucm90YXRlQ291bnRlckNsb2Nrd2lzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGxhc3QgPSB0aGlzLl9zaWRlcy5zaGlmdCgpO1xuICAgICAgICB0aGlzLl9zaWRlcy5wdXNoKGxhc3QpO1xuICAgIH07XG4gICAgcmV0dXJuIFRpbGU7XG59KCkpO1xuZXhwb3J0cy5UaWxlID0gVGlsZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5pc1VuZGVmaW5lZCA9IGV4cG9ydHMubWF0cml4ID0gdm9pZCAwO1xuZnVuY3Rpb24gbWF0cml4KG0sIG4sIGRlZmF1bHRWYWx1ZSkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHtcbiAgICAgICAgLy8gZ2VuZXJhdGUgYXJyYXkgb2YgbGVuZ3RoIG1cbiAgICAgICAgbGVuZ3RoOiBtXG4gICAgICAgIC8vIGluc2lkZSBtYXAgZnVuY3Rpb24gZ2VuZXJhdGUgYXJyYXkgb2Ygc2l6ZSBuXG4gICAgICAgIC8vIGFuZCBmaWxsIGl0IHdpdGggYDBgXG4gICAgfSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IEFycmF5KG4pLmZpbGwoZGVmYXVsdFZhbHVlKTsgfSk7XG59XG5leHBvcnRzLm1hdHJpeCA9IG1hdHJpeDtcbjtcbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICAgIHJldHVybiB0eXBlb2YgYXJnID09PSBcInVuZGVmaW5lZFwiO1xufVxuZXhwb3J0cy5pc1VuZGVmaW5lZCA9IGlzVW5kZWZpbmVkO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIGdhbWVfMSA9IHJlcXVpcmUoXCIuL2dhbWVcIik7XG52YXIgcmVuZGVyZXJfMSA9IHJlcXVpcmUoXCIuL3JlbmRlcmVyXCIpO1xudmFyIHJlbmRlcmVyID0gbmV3IHJlbmRlcmVyXzEuUmVuZGVyZXIoKTtcbnZhciBwMSA9IG5ldyBnYW1lXzEuUGxheWVyKFwiUGxheWVyIDFcIik7XG52YXIgcDIgPSBuZXcgZ2FtZV8xLlBsYXllcihcIlBsYXllciAyXCIpO1xudmFyIGdhbWUgPSBuZXcgZ2FtZV8xLkdhbWUoW3AxLCBwMl0pO1xuZ2FtZS5zZXR1cEJvYXJkKCk7XG52YXIgbWFpbiA9IGZ1bmN0aW9uICgpIHtcbiAgICByZW5kZXJlci5yZW5kZXIoZ2FtZSk7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKG1haW4pO1xufTtcbmFsZXJ0KFwiVGhlIGFpbSBvZiB0aGUgZ2FtZSBpcyB0byBzY29yZSB0aGUgbW9zdCBwb2ludHMuIFxcbllvdSBnYWluIGEgcG9pbnQgZm9yIGV2ZXJ5IGVkZ2UgdGhhdCBtYXRjaGVzIGl0cyBuZWlnaGJvdXJzLCBhbmQgbG9zZSBhIHBvaW50IGZvciBldmVyeSBlZGdlIHRoYXQgZG9lcyBub3QuXFxuWW91IGhhdmUgdG8gcGxheSB0aWxlcyB1cCBhZ2FpbnN0IGF0IGxlYXN0IG9uZSBvdGhlciB0aWxlLlxcbllvdSBhbHdheXMgaGF2ZSA0IHRpbGVzLCBhbmQgZ2V0IGEgbmV3IG9uZSBldmVyeSB0aW1lIHlvdSBwdXQgb25lIGRvd24uXFxuVGhlIGdhbWUgZW5kcyB3aGVuIHRoZXJlIGFyZSBubyBzcGFjZXMgbGVmdCB0byBwbGF5LlxcblRoZSBjdXJyZW50IHNjb3JlIGlzIGluIHRoZSB0b3AgcmlnaHQsIGFuZCB0aGUgY3VycmVudCBwbGF5ZXIgaXMgc2hvd24gaW4gcmVkLlxcbkNsaWNrIGEgdGlsZSBpbiB0aGUgcm93IGF0IHRoZSBib3R0b20gdG8gc2VsZWN0IGl0LiBVc2UgUSBhbmQgRSB0byByb3RhdGUgdGhlIHRpbGUsIHRoZW4gY2xpY2sgb24gdGhlIGdyaWQgdG8gcGxhY2UgdGhlIHRpbGUuXFxuR29vZCBsdWNrIVxcblwiKTtcbm1haW4oKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==