/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/game.ts":
/*!*********************!*\
  !*** ./src/game.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Game = exports.Cell = exports.Player = void 0;
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
var Cell = /** @class */ (function () {
    function Cell(x, y, _contents) {
        this.x = x;
        this.y = y;
        this._contents = _contents;
    }
    Object.defineProperty(Cell.prototype, "contents", {
        get: function () {
            return this._contents;
        },
        enumerable: false,
        configurable: true
    });
    Cell.prototype.setContents = function (contents) {
        this._contents = contents;
    };
    Cell.prototype.isOccupied = function () {
        return !!this.contents;
    };
    Cell.Empty = function (x, y) {
        return new Cell(x, y, undefined);
    };
    return Cell;
}());
exports.Cell = Cell;
var Game = /** @class */ (function () {
    function Game(players) {
        this.currentPlayerIndex = 0;
        if (players.length < 2)
            throw new Error("Minimum 2 players!");
        if (players.length > 4)
            throw new Error("Maximum 4 players!");
        this._board = new Array(64).fill(0).map(function (cell, i) { return Cell.Empty(i % 8, Math.floor(i / 8)); });
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
        var gridWidth = 8;
        var farRowIdx = gridWidth - 1;
        for (var i = 0; i < gridWidth; i++) {
            this.setTileAt(this.drawPile.pop(), i, 0);
            this.setTileAt(this.drawPile.pop(), i, farRowIdx);
        }
        for (var i = 1; i < gridWidth - 1; i++) {
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
        var boardIsFull = this.board.every(function (cell) { return cell.isOccupied(); });
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
        var _a;
        return (_a = this.getCellAt(x, y)) === null || _a === void 0 ? void 0 : _a.contents;
    };
    Game.prototype.setTileAt = function (tile, x, y) {
        var _a;
        (_a = this.getCellAt(x, y)) === null || _a === void 0 ? void 0 : _a.setContents(tile);
    };
    Game.prototype.getCellAt = function (x, y) {
        return this._board.find(function (cell) { return cell.x === x && cell.y === y; });
    };
    Game.prototype.isValidPosition = function (x, y) {
        return !!this.getCellAt(x, y);
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
var hexRadius = 40;
var Renderer = /** @class */ (function () {
    function Renderer() {
        var _this = this;
        this.canvas = document.getElementById('main');
        this.ctx = this.canvas.getContext('2d');
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
        var cell = element.cell;
        if (tile && !(0, utils_1.isUndefined)(tileIdx)) {
            // clicking on an unplayed tile
            this.focussedTile = tile;
            this.focussedTileIdx = tileIdx;
        }
        else if (!(0, utils_1.isUndefined)(cell)) {
            // clicking on a hexagon
            if (this.focussedTile && !(0, utils_1.isUndefined)(this.focussedTileIdx)) {
                this.game.placeTile(this.game.currentPlayer, this.focussedTileIdx, cell.x, cell.y);
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
        // render board
        var elements = [];
        game.board.forEach(function (cell) {
            var contents = cell.contents, x = cell.x, y = cell.y;
            if (contents) {
                elements.push(new PlayedTileRenderer(x, y, contents));
            }
            else {
                var element = new CellRenderer(cell);
                var isHovering = element.isWithinBounds(_this.mousePosition);
                element.setIsHovering(isHovering);
                elements.push(element);
            }
        });
        // render tiles for current player
        game.currentPlayer.tiles.forEach(function (tile, idx) {
            var element = new UnplayedTileRenderer(idx, 8 + 2, tile);
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
var CellRenderer = /** @class */ (function () {
    function CellRenderer(cell) {
        this.cell = cell;
        this.hexagonRenderer = new HexagonRenderer(this.cell.x, this.cell.y);
    }
    CellRenderer.prototype.draw = function (ctx) {
        this.hexagonRenderer.draw(ctx);
    };
    CellRenderer.prototype.isWithinBounds = function (point) {
        return this.hexagonRenderer.isWithinBounds(point);
    };
    CellRenderer.prototype.setIsHovering = function (isHovering) {
        if (isHovering) {
            this.hexagonRenderer.setFill("red");
        }
        else {
            this.hexagonRenderer.setFill("transparent");
        }
    };
    return CellRenderer;
}());
var HexagonRenderer = /** @class */ (function () {
    function HexagonRenderer(gridX, gridY) {
        this.gridX = gridX;
        this.gridY = gridY;
        this.fill = "transparent";
    }
    HexagonRenderer.prototype.setFill = function (fill) {
        this.fill = fill;
    };
    HexagonRenderer.prototype.draw = function (ctx) {
        var _a = this.getMidpoint(), x = _a[0], y = _a[1];
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
        var perpendicularHeight = Math.sin(deg60) * hexRadius;
        var angleRadPos = angleRad;
        while (angleRadPos < 0)
            angleRadPos += 2 * Math.PI;
        var angleRadNorm = angleRadPos % deg30;
        var distanceToEdge = perpendicularHeight / Math.cos(angleRadNorm);
        return magnitude < distanceToEdge;
    };
    HexagonRenderer.prototype.getMidpoint = function () {
        var perpendicularHeight = Math.sin(deg60) * hexRadius;
        var halfEdgeLength = Math.cos(deg60) * hexRadius;
        var xOffset = perpendicularHeight;
        var x = (this.gridX + 1) * perpendicularHeight * 2;
        var y = (this.gridY + 1) * (hexRadius + halfEdgeLength);
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
    function PlayedTileRenderer(gridX, gridY, tile) {
        this.gridX = gridX;
        this.gridY = gridY;
        this.tile = tile;
        this.hexagonRenderer = new HexagonRenderer(gridX, gridY);
        this.hexagonRenderer.setFill("black");
    }
    PlayedTileRenderer.prototype.setFill = function (fill) {
        this.hexagonRenderer.setFill(fill);
    };
    PlayedTileRenderer.prototype.draw = function (ctx) {
        this.hexagonRenderer.draw(ctx);
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
    function UnplayedTileRenderer(tileIdx, lastRow, tile) {
        this.tileIdx = tileIdx;
        this.lastRow = lastRow;
        this.tile = tile;
        this.hexagonRenderer = new HexagonRenderer(tileIdx, lastRow);
        this.hexagonRenderer.setFill("black");
    }
    UnplayedTileRenderer.prototype.setFill = function (fill) {
        this.hexagonRenderer.setFill(fill);
    };
    UnplayedTileRenderer.prototype.draw = function (ctx) {
        this.hexagonRenderer.draw(ctx);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7Ozs7Ozs7O0FDdEJhO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGFBQWEsbUJBQU8sQ0FBQyw2QkFBUTtBQUM3QixpQkFBaUIsbUJBQU8sQ0FBQyxxQ0FBWTtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbmVvZG9taW5vLy4vc3JjL2dhbWUudHMiLCJ3ZWJwYWNrOi8vbmVvZG9taW5vLy4vc3JjL3JlbmRlcmVyLnRzIiwid2VicGFjazovL25lb2RvbWluby8uL3NyYy90aWxlLnRzIiwid2VicGFjazovL25lb2RvbWluby8uL3NyYy91dGlscy50cyIsIndlYnBhY2s6Ly9uZW9kb21pbm8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbmVvZG9taW5vLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5HYW1lID0gZXhwb3J0cy5DZWxsID0gZXhwb3J0cy5QbGF5ZXIgPSB2b2lkIDA7XG52YXIgdGlsZV8xID0gcmVxdWlyZShcIi4vdGlsZVwiKTtcbnZhciB1dGlsc18xID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XG52YXIgUGxheWVyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFBsYXllcihuYW1lKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuX3RpbGVzID0gW107XG4gICAgICAgIHRoaXMuX3BvaW50cyA9IDA7XG4gICAgfVxuICAgIFBsYXllci5wcm90b3R5cGUuZ2l2ZVRpbGUgPSBmdW5jdGlvbiAodGlsZSkge1xuICAgICAgICB0aGlzLl90aWxlcy5wdXNoKHRpbGUpO1xuICAgIH07XG4gICAgUGxheWVyLnByb3RvdHlwZS50YWtlVGlsZSA9IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICB2YXIgZXJyID0gbmV3IEVycm9yKFwiTm8gdGlsZSBpbiB0aGF0IHBvc2l0aW9uIVwiKTtcbiAgICAgICAgaWYgKGluZGV4ID49IHRoaXMuX3RpbGVzLmxlbmd0aClcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgaWYgKGluZGV4IDwgMClcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgdmFyIHRpbGUgPSB0aGlzLl90aWxlcy5zcGxpY2UoaW5kZXgsIDEpWzBdO1xuICAgICAgICBpZiAoIXRpbGUpXG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIHJldHVybiB0aWxlO1xuICAgIH07XG4gICAgUGxheWVyLnByb3RvdHlwZS5hd2FyZFBvaW50cyA9IGZ1bmN0aW9uIChwb2ludHMpIHtcbiAgICAgICAgdGhpcy5fcG9pbnRzICs9IHBvaW50cztcbiAgICB9O1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQbGF5ZXIucHJvdG90eXBlLCBcInRpbGVzXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGlsZXMuc2xpY2UoKTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQbGF5ZXIucHJvdG90eXBlLCBcInBvaW50c1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BvaW50cztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIFBsYXllci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBcIlwiLmNvbmNhdCh0aGlzLm5hbWUsIFwiOiBcIikuY29uY2F0KHRoaXMucG9pbnRzLCBcIiBwb2ludHNcIik7XG4gICAgfTtcbiAgICByZXR1cm4gUGxheWVyO1xufSgpKTtcbmV4cG9ydHMuUGxheWVyID0gUGxheWVyO1xudmFyIENlbGwgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ2VsbCh4LCB5LCBfY29udGVudHMpIHtcbiAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICAgICAgdGhpcy5fY29udGVudHMgPSBfY29udGVudHM7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDZWxsLnByb3RvdHlwZSwgXCJjb250ZW50c1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRlbnRzO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgQ2VsbC5wcm90b3R5cGUuc2V0Q29udGVudHMgPSBmdW5jdGlvbiAoY29udGVudHMpIHtcbiAgICAgICAgdGhpcy5fY29udGVudHMgPSBjb250ZW50cztcbiAgICB9O1xuICAgIENlbGwucHJvdG90eXBlLmlzT2NjdXBpZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuY29udGVudHM7XG4gICAgfTtcbiAgICBDZWxsLkVtcHR5ID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBDZWxsKHgsIHksIHVuZGVmaW5lZCk7XG4gICAgfTtcbiAgICByZXR1cm4gQ2VsbDtcbn0oKSk7XG5leHBvcnRzLkNlbGwgPSBDZWxsO1xudmFyIEdhbWUgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gR2FtZShwbGF5ZXJzKSB7XG4gICAgICAgIHRoaXMuY3VycmVudFBsYXllckluZGV4ID0gMDtcbiAgICAgICAgaWYgKHBsYXllcnMubGVuZ3RoIDwgMilcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1pbmltdW0gMiBwbGF5ZXJzIVwiKTtcbiAgICAgICAgaWYgKHBsYXllcnMubGVuZ3RoID4gNClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1heGltdW0gNCBwbGF5ZXJzIVwiKTtcbiAgICAgICAgdGhpcy5fYm9hcmQgPSBuZXcgQXJyYXkoNjQpLmZpbGwoMCkubWFwKGZ1bmN0aW9uIChjZWxsLCBpKSB7IHJldHVybiBDZWxsLkVtcHR5KGkgJSA4LCBNYXRoLmZsb29yKGkgLyA4KSk7IH0pO1xuICAgICAgICB0aGlzLmRyYXdQaWxlID0gbmV3IEFycmF5KDY0KVxuICAgICAgICAgICAgLmZpbGwoMClcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKHZhbCwgaSkgeyByZXR1cm4gaTsgfSlcbiAgICAgICAgICAgIC8vIC5zbGljZSgxKSAvLyByZW1vdmUgMCB2YWx1ZSB0aWxlIHRvIHB1dCBpbiBtaWRkbGUgb2YgYm9hcmRcbiAgICAgICAgICAgIC5zb3J0KGZ1bmN0aW9uICgpIHsgcmV0dXJuIE1hdGgucmFuZG9tKCkgLSAwLjU7IH0pIC8vIHNodWZmbGVcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKHZhbCkgeyByZXR1cm4gbmV3IHRpbGVfMS5UaWxlKHZhbCk7IH0pO1xuICAgICAgICB0aGlzLnBsYXllcnMgPSBwbGF5ZXJzO1xuICAgICAgICB0aGlzLmRpc3RyaWJ1dGVUaWxlcyg0KTtcbiAgICB9XG4gICAgR2FtZS5wcm90b3R5cGUuc2V0dXBCb2FyZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5zZXR1cEJvYXJkUGVyaW1ldGVyKCk7XG4gICAgICAgIHRoaXMuc2V0dXBCb2FyZENlbnRyZSgpO1xuICAgIH07XG4gICAgR2FtZS5wcm90b3R5cGUuc2V0dXBCb2FyZENlbnRyZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5zZXRUaWxlQXQodGhpcy5kcmF3UGlsZS5wb3AoKSwgMiwgMik7XG4gICAgICAgIHRoaXMuc2V0VGlsZUF0KHRoaXMuZHJhd1BpbGUucG9wKCksIDUsIDIpO1xuICAgICAgICB0aGlzLnNldFRpbGVBdCh0aGlzLmRyYXdQaWxlLnBvcCgpLCAyLCA1KTtcbiAgICAgICAgdGhpcy5zZXRUaWxlQXQodGhpcy5kcmF3UGlsZS5wb3AoKSwgNSwgNSk7XG4gICAgICAgIHRoaXMuc2V0VGlsZUF0KHRoaXMuZHJhd1BpbGUucG9wKCksIDMsIDMpO1xuICAgICAgICB0aGlzLnNldFRpbGVBdCh0aGlzLmRyYXdQaWxlLnBvcCgpLCA0LCA0KTtcbiAgICB9O1xuICAgIEdhbWUucHJvdG90eXBlLnNldHVwQm9hcmRQZXJpbWV0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBncmlkV2lkdGggPSA4O1xuICAgICAgICB2YXIgZmFyUm93SWR4ID0gZ3JpZFdpZHRoIC0gMTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBncmlkV2lkdGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5zZXRUaWxlQXQodGhpcy5kcmF3UGlsZS5wb3AoKSwgaSwgMCk7XG4gICAgICAgICAgICB0aGlzLnNldFRpbGVBdCh0aGlzLmRyYXdQaWxlLnBvcCgpLCBpLCBmYXJSb3dJZHgpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgZ3JpZFdpZHRoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLnNldFRpbGVBdCh0aGlzLmRyYXdQaWxlLnBvcCgpLCAwLCBpKTtcbiAgICAgICAgICAgIHRoaXMuc2V0VGlsZUF0KHRoaXMuZHJhd1BpbGUucG9wKCksIGZhclJvd0lkeCwgaSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShHYW1lLnByb3RvdHlwZSwgXCJ0aWxlc1JlbWFpbmluZ1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZHJhd1BpbGUubGVuZ3RoO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEdhbWUucHJvdG90eXBlLCBcImJvYXJkXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYm9hcmQuc2xpY2UoKTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIEdhbWUucHJvdG90eXBlLmRpc3RyaWJ1dGVUaWxlcyA9IGZ1bmN0aW9uIChjb3VudCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLnBsYXllcnMuZm9yRWFjaChmdW5jdGlvbiAocGxheWVyKSB7XG4gICAgICAgICAgICB3aGlsZSAocGxheWVyLnRpbGVzLmxlbmd0aCA8IGNvdW50KSB7XG4gICAgICAgICAgICAgICAgdmFyIHRpbGUgPSBfdGhpcy5kcmF3UGlsZS5wb3AoKTtcbiAgICAgICAgICAgICAgICBpZiAoIXRpbGUpXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk91dCBvZiB0aWxlcyFcIik7XG4gICAgICAgICAgICAgICAgcGxheWVyLmdpdmVUaWxlKHRpbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIEdhbWUucHJvdG90eXBlLnBsYWNlVGlsZSA9IGZ1bmN0aW9uIChwbGF5ZXIsIHRpbGVJZHgsIHgsIHkpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWRQb3NpdGlvbih4LCB5KSlcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlBvc2l0aW9uIG91dCBvZiBib3VuZHMhXCIpO1xuICAgICAgICB2YXIgZXhpc3RpbmdUaWxlID0gdGhpcy5nZXRUaWxlQXQoeCwgeSk7XG4gICAgICAgIGlmIChleGlzdGluZ1RpbGUpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcGFjZSBhbHJlYWR5IG9jY3VwaWVkIVwiKTtcbiAgICAgICAgaWYgKHRoaXMubmVpZ2hib3VyQ291bnQoeCwgeSkgPT09IDApXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IHBsYWNlIGEgdGlsZSBhZ2FpbnN0IGFub3RoZXIgb25lXCIpO1xuICAgICAgICBpZiAocGxheWVyICE9PSB0aGlzLmN1cnJlbnRQbGF5ZXIpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgXCIuY29uY2F0KHBsYXllci5uYW1lLCBcIidzIHR1cm4hXCIpKTtcbiAgICAgICAgdmFyIHRpbGUgPSBwbGF5ZXIudGFrZVRpbGUodGlsZUlkeCk7XG4gICAgICAgIHRoaXMuc2V0VGlsZUF0KHRpbGUsIHgsIHkpO1xuICAgICAgICB2YXIgcG9pbnRzID0gdGhpcy5jYWxjdWxhdGVQb2ludHNGb3JUaWxlKHgsIHkpO1xuICAgICAgICB0aGlzLmN1cnJlbnRQbGF5ZXIuYXdhcmRQb2ludHMocG9pbnRzKTtcbiAgICAgICAgdmFyIGRyYXduVGlsZSA9IHRoaXMuZHJhd1BpbGUucG9wKCk7XG4gICAgICAgIGlmIChkcmF3blRpbGUpXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQbGF5ZXIuZ2l2ZVRpbGUoZHJhd25UaWxlKTtcbiAgICAgICAgdmFyIGV2ZXJ5b25lSXNPdXRPZlRpbGVzID0gdGhpcy5wbGF5ZXJzLmV2ZXJ5KGZ1bmN0aW9uIChwbGF5ZXIpIHsgcmV0dXJuIHBsYXllci50aWxlcy5sZW5ndGggPT09IDA7IH0pO1xuICAgICAgICB2YXIgYm9hcmRJc0Z1bGwgPSB0aGlzLmJvYXJkLmV2ZXJ5KGZ1bmN0aW9uIChjZWxsKSB7IHJldHVybiBjZWxsLmlzT2NjdXBpZWQoKTsgfSk7XG4gICAgICAgIGlmIChib2FyZElzRnVsbCB8fCBldmVyeW9uZUlzT3V0T2ZUaWxlcykge1xuICAgICAgICAgICAgYWxlcnQoXCJHYW1lIG92ZXIsIGZpbmFsIHBvaW50czogXCIuY29uY2F0KHRoaXMucGxheWVycy5tYXAoZnVuY3Rpb24gKHBsYXllcikgeyByZXR1cm4gcGxheWVyLnRvU3RyaW5nKCk7IH0pLmpvaW4oXCIsIFwiKSkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3VycmVudFBsYXllckluZGV4ICs9IDE7XG4gICAgICAgIHRoaXMuY3VycmVudFBsYXllckluZGV4ID0gdGhpcy5jdXJyZW50UGxheWVySW5kZXggJSB0aGlzLnBsYXllcnMubGVuZ3RoO1xuICAgIH07XG4gICAgR2FtZS5wcm90b3R5cGUuY2FsY3VsYXRlUG9pbnRzRm9yVGlsZSA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgICAgIHZhciB0aWxlID0gdGhpcy5nZXRUaWxlQXQoeCwgeSk7XG4gICAgICAgIGlmICghdGlsZSlcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIHRpbGUgdG8gY2FsY3VsYXRlIVwiKTtcbiAgICAgICAgdmFyIG5laWdoYm91clZhbHVlcyA9IHRoaXMuZ2V0TmVpZ2hib3VyaW5nVmFsdWVzVG8oeCwgeSk7XG4gICAgICAgIHJldHVybiB0aWxlLnNpZGVzLnJlZHVjZShmdW5jdGlvbiAocG9pbnRzLCBzaWRlVmFsdWUsIHNpZGVJbmRleCkge1xuICAgICAgICAgICAgdmFyIG5laWdoYm91cmluZ1NpZGVWYWx1ZSA9IG5laWdoYm91clZhbHVlc1tzaWRlSW5kZXhdO1xuICAgICAgICAgICAgaWYgKG5laWdoYm91cmluZ1NpZGVWYWx1ZSA9PT0gc2lkZVZhbHVlKVxuICAgICAgICAgICAgICAgIHJldHVybiBwb2ludHMgKyAxO1xuICAgICAgICAgICAgaWYgKCEoMCwgdXRpbHNfMS5pc1VuZGVmaW5lZCkobmVpZ2hib3VyaW5nU2lkZVZhbHVlKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gcG9pbnRzIC0gMTtcbiAgICAgICAgICAgIHJldHVybiBwb2ludHM7XG4gICAgICAgIH0sIDApO1xuICAgIH07XG4gICAgR2FtZS5wcm90b3R5cGUuZ2V0TmVpZ2hib3VyaW5nVmFsdWVzVG8gPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICB2YXIgdGlsZXMgPSB0aGlzLmdldE5laWdoYm91cmluZ1RpbGVzVG8oeCwgeSk7XG4gICAgICAgIHJldHVybiB0aWxlcy5tYXAoZnVuY3Rpb24gKHRpbGUsIGZhY2VJbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuIHRpbGUgPT09IG51bGwgfHwgdGlsZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogdGlsZS5nZXRPcHBvc2luZ0ZhY2VWYWx1ZVRvKGZhY2VJbmRleCk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgR2FtZS5wcm90b3R5cGUubmVpZ2hib3VyQ291bnQgPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXROZWlnaGJvdXJpbmdUaWxlc1RvKHgsIHkpXG4gICAgICAgICAgICAucmVkdWNlKGZ1bmN0aW9uIChjb3VudCwgdGlsZSkge1xuICAgICAgICAgICAgaWYgKHRpbGUpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvdW50ICsgMTtcbiAgICAgICAgICAgIHJldHVybiBjb3VudDtcbiAgICAgICAgfSwgMCk7XG4gICAgfTtcbiAgICBHYW1lLnByb3RvdHlwZS5nZXROZWlnaGJvdXJpbmdUaWxlc1RvID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgdmFyIGlzRXZlblJvdyA9IHkgJSAyID09PSAwO1xuICAgICAgICB2YXIgcm93T2Zmc2V0ID0gaXNFdmVuUm93ID8gLTEgOiAwO1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgdGhpcy5nZXRUaWxlQXQoeCArIHJvd09mZnNldCwgeSAtIDEpLFxuICAgICAgICAgICAgdGhpcy5nZXRUaWxlQXQoeCArIDEgKyByb3dPZmZzZXQsIHkgLSAxKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0VGlsZUF0KHggKyAxLCB5KSxcbiAgICAgICAgICAgIHRoaXMuZ2V0VGlsZUF0KHggKyAxICsgcm93T2Zmc2V0LCB5ICsgMSksXG4gICAgICAgICAgICB0aGlzLmdldFRpbGVBdCh4ICsgcm93T2Zmc2V0LCB5ICsgMSksXG4gICAgICAgICAgICB0aGlzLmdldFRpbGVBdCh4IC0gMSwgeSkgLy8gbGVmdFxuICAgICAgICBdO1xuICAgIH07XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEdhbWUucHJvdG90eXBlLCBcImN1cnJlbnRQbGF5ZXJcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBsYXllcnNbdGhpcy5jdXJyZW50UGxheWVySW5kZXhdO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgR2FtZS5wcm90b3R5cGUuZ2V0VGlsZUF0ID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gKF9hID0gdGhpcy5nZXRDZWxsQXQoeCwgeSkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jb250ZW50cztcbiAgICB9O1xuICAgIEdhbWUucHJvdG90eXBlLnNldFRpbGVBdCA9IGZ1bmN0aW9uICh0aWxlLCB4LCB5KSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgKF9hID0gdGhpcy5nZXRDZWxsQXQoeCwgeSkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5zZXRDb250ZW50cyh0aWxlKTtcbiAgICB9O1xuICAgIEdhbWUucHJvdG90eXBlLmdldENlbGxBdCA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9ib2FyZC5maW5kKGZ1bmN0aW9uIChjZWxsKSB7IHJldHVybiBjZWxsLnggPT09IHggJiYgY2VsbC55ID09PSB5OyB9KTtcbiAgICB9O1xuICAgIEdhbWUucHJvdG90eXBlLmlzVmFsaWRQb3NpdGlvbiA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuZ2V0Q2VsbEF0KHgsIHkpO1xuICAgIH07XG4gICAgcmV0dXJuIEdhbWU7XG59KCkpO1xuZXhwb3J0cy5HYW1lID0gR2FtZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5SZW5kZXJlciA9IHZvaWQgMDtcbnZhciB1dGlsc18xID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XG52YXIgZGVnNjAgPSBNYXRoLlBJIC8gMztcbnZhciBkZWczMCA9IE1hdGguUEkgLyA2O1xudmFyIGhleFJhZGl1cyA9IDQwO1xudmFyIFJlbmRlcmVyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFJlbmRlcmVyKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluJyk7XG4gICAgICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgdGhpcy5tb3VzZVBvc2l0aW9uID0geyB4OiAwLCB5OiAwIH07XG4gICAgICAgIHdpbmRvdy5vbmtleWRvd24gPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgICAgIGlmIChfdGhpcy5mb2N1c3NlZFRpbGUgJiYgZS5rZXkgPT09IFwicVwiIHx8IGUua2V5ID09PSBcIlFcIikge1xuICAgICAgICAgICAgICAgIChfYSA9IF90aGlzLmZvY3Vzc2VkVGlsZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnJvdGF0ZUNvdW50ZXJDbG9ja3dpc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKF90aGlzLmZvY3Vzc2VkVGlsZSAmJiBlLmtleSA9PT0gXCJlXCIgfHwgZS5rZXkgPT09IFwiRVwiKSB7XG4gICAgICAgICAgICAgICAgKF9iID0gX3RoaXMuZm9jdXNzZWRUaWxlKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Iucm90YXRlQ2xvY2t3aXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuY2FudmFzLm9ubW91c2Vtb3ZlID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHZhciByZWN0ID0gX3RoaXMuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgX3RoaXMubW91c2VQb3NpdGlvbi54ID0gZS5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuICAgICAgICAgICAgX3RoaXMubW91c2VQb3NpdGlvbi55ID0gZS5jbGllbnRZIC0gcmVjdC50b3A7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuY2FudmFzLm9uY2xpY2sgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgaWYgKCFfdGhpcy5nYW1lKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IF90aGlzLmdldEVsZW1lbnRzKF90aGlzLmdhbWUpO1xuICAgICAgICAgICAgdmFyIHJlY3QgPSBfdGhpcy5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICBfdGhpcy5tb3VzZVBvc2l0aW9uLnggPSBlLmNsaWVudFggLSByZWN0LmxlZnQ7XG4gICAgICAgICAgICBfdGhpcy5tb3VzZVBvc2l0aW9uLnkgPSBlLmNsaWVudFkgLSByZWN0LnRvcDtcbiAgICAgICAgICAgIHZhciBjbGlja2VkRWxlbWVudCA9IGVsZW1lbnRzLmZpbmQoZnVuY3Rpb24gKGVsZW1lbnQpIHsgcmV0dXJuIGVsZW1lbnQuaXNXaXRoaW5Cb3VuZHMoX3RoaXMubW91c2VQb3NpdGlvbik7IH0pO1xuICAgICAgICAgICAgaWYgKGNsaWNrZWRFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuaGFuZGxlQ2xpY2tPbkVsZW1lbnQoY2xpY2tlZEVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgX3RoaXMudW5mb2N1cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICBSZW5kZXJlci5wcm90b3R5cGUuc2V0U2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIH07XG4gICAgUmVuZGVyZXIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIChnYW1lKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMuc2V0U2l6ZSgpO1xuICAgICAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XG4gICAgICAgIHRoaXMuY3R4LmZvbnQgPSBcIjI0cHggQXJpZWxcIjtcbiAgICAgICAgLy8gcmVuZGVyIHBvaW50c1xuICAgICAgICB0aGlzLmN0eC5maWxsVGV4dChcIlBvaW50c1wiLCB0aGlzLmNhbnZhcy53aWR0aCAtIDIwMCwgMjApO1xuICAgICAgICBnYW1lLnBsYXllcnMuZm9yRWFjaChmdW5jdGlvbiAocGxheWVyLCBpKSB7XG4gICAgICAgICAgICB2YXIgeCA9IF90aGlzLmNhbnZhcy53aWR0aCAtIDIwMDtcbiAgICAgICAgICAgIHZhciB5ID0gNzAgKyAzMCAqIGk7XG4gICAgICAgICAgICBpZiAocGxheWVyID09PSBnYW1lLmN1cnJlbnRQbGF5ZXIpXG4gICAgICAgICAgICAgICAgX3RoaXMuY3R4LmZpbGxTdHlsZSA9IFwicmVkXCI7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgX3RoaXMuY3R4LmZpbGxTdHlsZSA9IFwiYmxhY2tcIjtcbiAgICAgICAgICAgIF90aGlzLmN0eC5maWxsVGV4dChcIlwiLmNvbmNhdChwbGF5ZXIubmFtZSwgXCI6IFwiKS5jb25jYXQocGxheWVyLnBvaW50cyksIHgsIHkpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gXCJibGFja1wiO1xuICAgICAgICB0aGlzLmN0eC5maWxsVGV4dChcIlRpbGVzIHJlbWFpbmluZzogXCIuY29uY2F0KGdhbWUudGlsZXNSZW1haW5pbmcpLCB0aGlzLmNhbnZhcy53aWR0aCAtIDQ1MCwgMjApO1xuICAgICAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IFwic2xhdGVHcmV5XCI7XG4gICAgICAgIHRoaXMuZ2V0RWxlbWVudHMoZ2FtZSkuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkgeyByZXR1cm4gZWxlbWVudC5kcmF3KF90aGlzLmN0eCk7IH0pO1xuICAgIH07XG4gICAgUmVuZGVyZXIucHJvdG90eXBlLmhhbmRsZUNsaWNrT25FbGVtZW50ID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmdhbWUpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHZhciBfYSA9IGVsZW1lbnQsIHRpbGUgPSBfYS50aWxlLCB0aWxlSWR4ID0gX2EudGlsZUlkeDtcbiAgICAgICAgdmFyIGNlbGwgPSBlbGVtZW50LmNlbGw7XG4gICAgICAgIGlmICh0aWxlICYmICEoMCwgdXRpbHNfMS5pc1VuZGVmaW5lZCkodGlsZUlkeCkpIHtcbiAgICAgICAgICAgIC8vIGNsaWNraW5nIG9uIGFuIHVucGxheWVkIHRpbGVcbiAgICAgICAgICAgIHRoaXMuZm9jdXNzZWRUaWxlID0gdGlsZTtcbiAgICAgICAgICAgIHRoaXMuZm9jdXNzZWRUaWxlSWR4ID0gdGlsZUlkeDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghKDAsIHV0aWxzXzEuaXNVbmRlZmluZWQpKGNlbGwpKSB7XG4gICAgICAgICAgICAvLyBjbGlja2luZyBvbiBhIGhleGFnb25cbiAgICAgICAgICAgIGlmICh0aGlzLmZvY3Vzc2VkVGlsZSAmJiAhKDAsIHV0aWxzXzEuaXNVbmRlZmluZWQpKHRoaXMuZm9jdXNzZWRUaWxlSWR4KSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGFjZVRpbGUodGhpcy5nYW1lLmN1cnJlbnRQbGF5ZXIsIHRoaXMuZm9jdXNzZWRUaWxlSWR4LCBjZWxsLngsIGNlbGwueSk7XG4gICAgICAgICAgICAgICAgdGhpcy51bmZvY3VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnVuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUmVuZGVyZXIucHJvdG90eXBlLnVuZm9jdXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuZm9jdXNzZWRUaWxlID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLmZvY3Vzc2VkVGlsZUlkeCA9IHVuZGVmaW5lZDtcbiAgICB9O1xuICAgIFJlbmRlcmVyLnByb3RvdHlwZS5nZXRFbGVtZW50cyA9IGZ1bmN0aW9uIChnYW1lKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBncmlkID0gZ2FtZS5ib2FyZDtcbiAgICAgICAgLy8gcmVuZGVyIGJvYXJkXG4gICAgICAgIHZhciBlbGVtZW50cyA9IFtdO1xuICAgICAgICBnYW1lLmJvYXJkLmZvckVhY2goZnVuY3Rpb24gKGNlbGwpIHtcbiAgICAgICAgICAgIHZhciBjb250ZW50cyA9IGNlbGwuY29udGVudHMsIHggPSBjZWxsLngsIHkgPSBjZWxsLnk7XG4gICAgICAgICAgICBpZiAoY29udGVudHMpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50cy5wdXNoKG5ldyBQbGF5ZWRUaWxlUmVuZGVyZXIoeCwgeSwgY29udGVudHMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBlbGVtZW50ID0gbmV3IENlbGxSZW5kZXJlcihjZWxsKTtcbiAgICAgICAgICAgICAgICB2YXIgaXNIb3ZlcmluZyA9IGVsZW1lbnQuaXNXaXRoaW5Cb3VuZHMoX3RoaXMubW91c2VQb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zZXRJc0hvdmVyaW5nKGlzSG92ZXJpbmcpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnRzLnB1c2goZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAvLyByZW5kZXIgdGlsZXMgZm9yIGN1cnJlbnQgcGxheWVyXG4gICAgICAgIGdhbWUuY3VycmVudFBsYXllci50aWxlcy5mb3JFYWNoKGZ1bmN0aW9uICh0aWxlLCBpZHgpIHtcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gbmV3IFVucGxheWVkVGlsZVJlbmRlcmVyKGlkeCwgOCArIDIsIHRpbGUpO1xuICAgICAgICAgICAgaWYgKHRpbGUgPT09IF90aGlzLmZvY3Vzc2VkVGlsZSkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0RmlsbChcImJsdWVcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChlbGVtZW50LmlzV2l0aGluQm91bmRzKF90aGlzLm1vdXNlUG9zaXRpb24pKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zZXRGaWxsKFwiZ3JleVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsZW1lbnRzLnB1c2goZWxlbWVudCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZWxlbWVudHM7XG4gICAgfTtcbiAgICByZXR1cm4gUmVuZGVyZXI7XG59KCkpO1xuZXhwb3J0cy5SZW5kZXJlciA9IFJlbmRlcmVyO1xudmFyIENlbGxSZW5kZXJlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDZWxsUmVuZGVyZXIoY2VsbCkge1xuICAgICAgICB0aGlzLmNlbGwgPSBjZWxsO1xuICAgICAgICB0aGlzLmhleGFnb25SZW5kZXJlciA9IG5ldyBIZXhhZ29uUmVuZGVyZXIodGhpcy5jZWxsLngsIHRoaXMuY2VsbC55KTtcbiAgICB9XG4gICAgQ2VsbFJlbmRlcmVyLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24gKGN0eCkge1xuICAgICAgICB0aGlzLmhleGFnb25SZW5kZXJlci5kcmF3KGN0eCk7XG4gICAgfTtcbiAgICBDZWxsUmVuZGVyZXIucHJvdG90eXBlLmlzV2l0aGluQm91bmRzID0gZnVuY3Rpb24gKHBvaW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhleGFnb25SZW5kZXJlci5pc1dpdGhpbkJvdW5kcyhwb2ludCk7XG4gICAgfTtcbiAgICBDZWxsUmVuZGVyZXIucHJvdG90eXBlLnNldElzSG92ZXJpbmcgPSBmdW5jdGlvbiAoaXNIb3ZlcmluZykge1xuICAgICAgICBpZiAoaXNIb3ZlcmluZykge1xuICAgICAgICAgICAgdGhpcy5oZXhhZ29uUmVuZGVyZXIuc2V0RmlsbChcInJlZFwiKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaGV4YWdvblJlbmRlcmVyLnNldEZpbGwoXCJ0cmFuc3BhcmVudFwiKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIENlbGxSZW5kZXJlcjtcbn0oKSk7XG52YXIgSGV4YWdvblJlbmRlcmVyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEhleGFnb25SZW5kZXJlcihncmlkWCwgZ3JpZFkpIHtcbiAgICAgICAgdGhpcy5ncmlkWCA9IGdyaWRYO1xuICAgICAgICB0aGlzLmdyaWRZID0gZ3JpZFk7XG4gICAgICAgIHRoaXMuZmlsbCA9IFwidHJhbnNwYXJlbnRcIjtcbiAgICB9XG4gICAgSGV4YWdvblJlbmRlcmVyLnByb3RvdHlwZS5zZXRGaWxsID0gZnVuY3Rpb24gKGZpbGwpIHtcbiAgICAgICAgdGhpcy5maWxsID0gZmlsbDtcbiAgICB9O1xuICAgIEhleGFnb25SZW5kZXJlci5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uIChjdHgpIHtcbiAgICAgICAgdmFyIF9hID0gdGhpcy5nZXRNaWRwb2ludCgpLCB4ID0gX2FbMF0sIHkgPSBfYVsxXTtcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDY7IGkrKykge1xuICAgICAgICAgICAgdmFyIGFuZ2xlVG9Qb2ludCA9IGRlZzMwICsgZGVnNjAgKiBpO1xuICAgICAgICAgICAgdmFyIHhPZmZzZXQgPSBoZXhSYWRpdXMgKiBNYXRoLmNvcyhhbmdsZVRvUG9pbnQpO1xuICAgICAgICAgICAgdmFyIHlPZmZzZXQgPSBoZXhSYWRpdXMgKiBNYXRoLnNpbihhbmdsZVRvUG9pbnQpO1xuICAgICAgICAgICAgY3R4LmxpbmVUbyh4ICsgeE9mZnNldCwgeSArIHlPZmZzZXQpO1xuICAgICAgICB9XG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmZpbGw7XG4gICAgICAgIGN0eC5maWxsKCk7XG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH07XG4gICAgSGV4YWdvblJlbmRlcmVyLnByb3RvdHlwZS5pc1dpdGhpbkJvdW5kcyA9IGZ1bmN0aW9uIChwb2ludCkge1xuICAgICAgICB2YXIgX2EgPSB0aGlzLmdldE1pZHBvaW50KCksIHggPSBfYVswXSwgeSA9IF9hWzFdO1xuICAgICAgICB2YXIgdmVjID0geyB4OiBwb2ludC54IC0geCwgeTogcG9pbnQueSAtIHkgfTsgLy8gdmVjIGZyb20gY2VudHJlIG9mIHRoZSBoZXggdG8gcG9pbnQ7XG4gICAgICAgIHZhciBtYWduaXR1ZGUgPSBNYXRoLnNxcnQoTWF0aC5wb3codmVjLngsIDIpICsgTWF0aC5wb3codmVjLnksIDIpKTtcbiAgICAgICAgdmFyIGFuZ2xlUmFkID0gTWF0aC5hdGFuMih2ZWMueSwgdmVjLngpO1xuICAgICAgICB2YXIgcGVycGVuZGljdWxhckhlaWdodCA9IE1hdGguc2luKGRlZzYwKSAqIGhleFJhZGl1cztcbiAgICAgICAgdmFyIGFuZ2xlUmFkUG9zID0gYW5nbGVSYWQ7XG4gICAgICAgIHdoaWxlIChhbmdsZVJhZFBvcyA8IDApXG4gICAgICAgICAgICBhbmdsZVJhZFBvcyArPSAyICogTWF0aC5QSTtcbiAgICAgICAgdmFyIGFuZ2xlUmFkTm9ybSA9IGFuZ2xlUmFkUG9zICUgZGVnMzA7XG4gICAgICAgIHZhciBkaXN0YW5jZVRvRWRnZSA9IHBlcnBlbmRpY3VsYXJIZWlnaHQgLyBNYXRoLmNvcyhhbmdsZVJhZE5vcm0pO1xuICAgICAgICByZXR1cm4gbWFnbml0dWRlIDwgZGlzdGFuY2VUb0VkZ2U7XG4gICAgfTtcbiAgICBIZXhhZ29uUmVuZGVyZXIucHJvdG90eXBlLmdldE1pZHBvaW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcGVycGVuZGljdWxhckhlaWdodCA9IE1hdGguc2luKGRlZzYwKSAqIGhleFJhZGl1cztcbiAgICAgICAgdmFyIGhhbGZFZGdlTGVuZ3RoID0gTWF0aC5jb3MoZGVnNjApICogaGV4UmFkaXVzO1xuICAgICAgICB2YXIgeE9mZnNldCA9IHBlcnBlbmRpY3VsYXJIZWlnaHQ7XG4gICAgICAgIHZhciB4ID0gKHRoaXMuZ3JpZFggKyAxKSAqIHBlcnBlbmRpY3VsYXJIZWlnaHQgKiAyO1xuICAgICAgICB2YXIgeSA9ICh0aGlzLmdyaWRZICsgMSkgKiAoaGV4UmFkaXVzICsgaGFsZkVkZ2VMZW5ndGgpO1xuICAgICAgICBpZiAodGhpcy5ncmlkWSAlIDIgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBbeCwgeV07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gW3ggKyB4T2Zmc2V0LCB5XTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIEhleGFnb25SZW5kZXJlcjtcbn0oKSk7XG52YXIgUGxheWVkVGlsZVJlbmRlcmVyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFBsYXllZFRpbGVSZW5kZXJlcihncmlkWCwgZ3JpZFksIHRpbGUpIHtcbiAgICAgICAgdGhpcy5ncmlkWCA9IGdyaWRYO1xuICAgICAgICB0aGlzLmdyaWRZID0gZ3JpZFk7XG4gICAgICAgIHRoaXMudGlsZSA9IHRpbGU7XG4gICAgICAgIHRoaXMuaGV4YWdvblJlbmRlcmVyID0gbmV3IEhleGFnb25SZW5kZXJlcihncmlkWCwgZ3JpZFkpO1xuICAgICAgICB0aGlzLmhleGFnb25SZW5kZXJlci5zZXRGaWxsKFwiYmxhY2tcIik7XG4gICAgfVxuICAgIFBsYXllZFRpbGVSZW5kZXJlci5wcm90b3R5cGUuc2V0RmlsbCA9IGZ1bmN0aW9uIChmaWxsKSB7XG4gICAgICAgIHRoaXMuaGV4YWdvblJlbmRlcmVyLnNldEZpbGwoZmlsbCk7XG4gICAgfTtcbiAgICBQbGF5ZWRUaWxlUmVuZGVyZXIucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbiAoY3R4KSB7XG4gICAgICAgIHRoaXMuaGV4YWdvblJlbmRlcmVyLmRyYXcoY3R4KTtcbiAgICAgICAgdmFyIF9hID0gdGhpcy5oZXhhZ29uUmVuZGVyZXIuZ2V0TWlkcG9pbnQoKSwgeCA9IF9hWzBdLCB5ID0gX2FbMV07XG4gICAgICAgIHZhciBkb3RSYWRpdXMgPSBoZXhSYWRpdXMgKiAwLjE7XG4gICAgICAgIHRoaXMudGlsZS5zaWRlcy5mb3JFYWNoKGZ1bmN0aW9uIChzaWRlLCBpZHgpIHtcbiAgICAgICAgICAgIGlmIChzaWRlICE9PSAxKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIHZhciBhbmdsZVRvUG9pbnQgPSBkZWc2MCAqIGlkeCAtIGRlZzYwICogMjtcbiAgICAgICAgICAgIHZhciB4T2Zmc2V0ID0gMC43ICogaGV4UmFkaXVzICogTWF0aC5jb3MoYW5nbGVUb1BvaW50KTtcbiAgICAgICAgICAgIHZhciB5T2Zmc2V0ID0gMC43ICogaGV4UmFkaXVzICogTWF0aC5zaW4oYW5nbGVUb1BvaW50KTtcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGN0eC5lbGxpcHNlKHggKyB4T2Zmc2V0LCB5ICsgeU9mZnNldCwgZG90UmFkaXVzLCBkb3RSYWRpdXMsIDAsIDAsIDIgKiBNYXRoLlBJKTtcbiAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBcIndoaXRlXCI7XG4gICAgICAgICAgICBjdHguZmlsbCgpO1xuICAgICAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFBsYXllZFRpbGVSZW5kZXJlci5wcm90b3R5cGUuaXNXaXRoaW5Cb3VuZHMgPSBmdW5jdGlvbiAocG9pbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGV4YWdvblJlbmRlcmVyLmlzV2l0aGluQm91bmRzKHBvaW50KTtcbiAgICB9O1xuICAgIHJldHVybiBQbGF5ZWRUaWxlUmVuZGVyZXI7XG59KCkpO1xudmFyIFVucGxheWVkVGlsZVJlbmRlcmVyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFVucGxheWVkVGlsZVJlbmRlcmVyKHRpbGVJZHgsIGxhc3RSb3csIHRpbGUpIHtcbiAgICAgICAgdGhpcy50aWxlSWR4ID0gdGlsZUlkeDtcbiAgICAgICAgdGhpcy5sYXN0Um93ID0gbGFzdFJvdztcbiAgICAgICAgdGhpcy50aWxlID0gdGlsZTtcbiAgICAgICAgdGhpcy5oZXhhZ29uUmVuZGVyZXIgPSBuZXcgSGV4YWdvblJlbmRlcmVyKHRpbGVJZHgsIGxhc3RSb3cpO1xuICAgICAgICB0aGlzLmhleGFnb25SZW5kZXJlci5zZXRGaWxsKFwiYmxhY2tcIik7XG4gICAgfVxuICAgIFVucGxheWVkVGlsZVJlbmRlcmVyLnByb3RvdHlwZS5zZXRGaWxsID0gZnVuY3Rpb24gKGZpbGwpIHtcbiAgICAgICAgdGhpcy5oZXhhZ29uUmVuZGVyZXIuc2V0RmlsbChmaWxsKTtcbiAgICB9O1xuICAgIFVucGxheWVkVGlsZVJlbmRlcmVyLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24gKGN0eCkge1xuICAgICAgICB0aGlzLmhleGFnb25SZW5kZXJlci5kcmF3KGN0eCk7XG4gICAgICAgIHZhciBfYSA9IHRoaXMuaGV4YWdvblJlbmRlcmVyLmdldE1pZHBvaW50KCksIHggPSBfYVswXSwgeSA9IF9hWzFdO1xuICAgICAgICB2YXIgZG90UmFkaXVzID0gaGV4UmFkaXVzICogMC4xO1xuICAgICAgICB0aGlzLnRpbGUuc2lkZXMuZm9yRWFjaChmdW5jdGlvbiAoc2lkZSwgaWR4KSB7XG4gICAgICAgICAgICBpZiAoc2lkZSAhPT0gMSlcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB2YXIgYW5nbGVUb1BvaW50ID0gZGVnNjAgKiBpZHggLSBkZWc2MCAqIDI7XG4gICAgICAgICAgICB2YXIgeE9mZnNldCA9IDAuNyAqIGhleFJhZGl1cyAqIE1hdGguY29zKGFuZ2xlVG9Qb2ludCk7XG4gICAgICAgICAgICB2YXIgeU9mZnNldCA9IDAuNyAqIGhleFJhZGl1cyAqIE1hdGguc2luKGFuZ2xlVG9Qb2ludCk7XG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBjdHguZWxsaXBzZSh4ICsgeE9mZnNldCwgeSArIHlPZmZzZXQsIGRvdFJhZGl1cywgZG90UmFkaXVzLCAwLCAwLCAyICogTWF0aC5QSSk7XG4gICAgICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJ3aGl0ZVwiO1xuICAgICAgICAgICAgY3R4LmZpbGwoKTtcbiAgICAgICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBVbnBsYXllZFRpbGVSZW5kZXJlci5wcm90b3R5cGUuaXNXaXRoaW5Cb3VuZHMgPSBmdW5jdGlvbiAocG9pbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGV4YWdvblJlbmRlcmVyLmlzV2l0aGluQm91bmRzKHBvaW50KTtcbiAgICB9O1xuICAgIHJldHVybiBVbnBsYXllZFRpbGVSZW5kZXJlcjtcbn0oKSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuVGlsZSA9IHZvaWQgMDtcbnZhciBUaWxlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFRpbGUodmFsdWUpIHtcbiAgICAgICAgaWYgKHZhbHVlID4gNjMpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaWxlIHZhbHVlIFwiLmNvbmNhdCh2YWx1ZSwgXCIgdG9vIGhpZ2ghXCIpKTtcbiAgICAgICAgaWYgKHZhbHVlIDwgMClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRpbGUgdmFsdWUgXCIuY29uY2F0KHZhbHVlLCBcIiB0b28gbG93IVwiKSk7XG4gICAgICAgIHZhciBwYWRkZWRWYWx1ZSA9IHZhbHVlICsgNjQ7XG4gICAgICAgIHRoaXMuX3NpZGVzID0gcGFkZGVkVmFsdWVcbiAgICAgICAgICAgIC50b1N0cmluZygyKVxuICAgICAgICAgICAgLnNwbGl0KFwiXCIpXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChkaWdpdCkgeyByZXR1cm4gcGFyc2VJbnQoZGlnaXQsIDEwKTsgfSlcbiAgICAgICAgICAgIC5zbGljZSgxKVxuICAgICAgICAgICAgLnJldmVyc2UoKTtcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFRpbGUucHJvdG90eXBlLCBcInNpZGVzXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2lkZXM7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBUaWxlLnByb3RvdHlwZS5nZXRGYWNlVmFsdWUgPSBmdW5jdGlvbiAoZmFjZUluZGV4KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNpZGVzW2ZhY2VJbmRleF07XG4gICAgfTtcbiAgICBUaWxlLnByb3RvdHlwZS5nZXRPcHBvc2luZ0ZhY2VWYWx1ZVRvID0gZnVuY3Rpb24gKGZhY2VJbmRleCkge1xuICAgICAgICB2YXIgb3Bwb3NpbmdGYWNlSW5kZXggPSAoZmFjZUluZGV4ICsgMykgJSA2O1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRGYWNlVmFsdWUob3Bwb3NpbmdGYWNlSW5kZXgpO1xuICAgIH07XG4gICAgVGlsZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzID0gdGhpcy5fc2lkZXM7XG4gICAgICAgIHJldHVybiBcIlxcbiAgICAgICAgICAgICAvXCIuY29uY2F0KHNbMF0sIFwiICBcIikuY29uY2F0KHNbMV0sIFwiXFxcXFxcbiAgICAgICAgICAgIHxcIikuY29uY2F0KHNbNV0sIFwiICAgIFwiKS5jb25jYXQoc1syXSwgXCJ8XFxuICAgICAgICAgICAgIFxcXFxcIikuY29uY2F0KHNbNF0sIFwiICBcIikuY29uY2F0KHNbM10sIFwiL1xcbiAgICAgICAgXCIpO1xuICAgIH07XG4gICAgVGlsZS5wcm90b3R5cGUucm90YXRlQ2xvY2t3aXNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbGFzdCA9IHRoaXMuX3NpZGVzLnBvcCgpO1xuICAgICAgICB0aGlzLl9zaWRlcy51bnNoaWZ0KGxhc3QpO1xuICAgIH07XG4gICAgVGlsZS5wcm90b3R5cGUucm90YXRlQ291bnRlckNsb2Nrd2lzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGxhc3QgPSB0aGlzLl9zaWRlcy5zaGlmdCgpO1xuICAgICAgICB0aGlzLl9zaWRlcy5wdXNoKGxhc3QpO1xuICAgIH07XG4gICAgcmV0dXJuIFRpbGU7XG59KCkpO1xuZXhwb3J0cy5UaWxlID0gVGlsZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5pc1VuZGVmaW5lZCA9IGV4cG9ydHMubWF0cml4ID0gdm9pZCAwO1xuZnVuY3Rpb24gbWF0cml4KG0sIG4sIGRlZmF1bHRWYWx1ZSkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHtcbiAgICAgICAgLy8gZ2VuZXJhdGUgYXJyYXkgb2YgbGVuZ3RoIG1cbiAgICAgICAgbGVuZ3RoOiBtXG4gICAgICAgIC8vIGluc2lkZSBtYXAgZnVuY3Rpb24gZ2VuZXJhdGUgYXJyYXkgb2Ygc2l6ZSBuXG4gICAgICAgIC8vIGFuZCBmaWxsIGl0IHdpdGggYDBgXG4gICAgfSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IEFycmF5KG4pLmZpbGwoZGVmYXVsdFZhbHVlKTsgfSk7XG59XG5leHBvcnRzLm1hdHJpeCA9IG1hdHJpeDtcbjtcbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICAgIHJldHVybiB0eXBlb2YgYXJnID09PSBcInVuZGVmaW5lZFwiO1xufVxuZXhwb3J0cy5pc1VuZGVmaW5lZCA9IGlzVW5kZWZpbmVkO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIGdhbWVfMSA9IHJlcXVpcmUoXCIuL2dhbWVcIik7XG52YXIgcmVuZGVyZXJfMSA9IHJlcXVpcmUoXCIuL3JlbmRlcmVyXCIpO1xudmFyIHJlbmRlcmVyID0gbmV3IHJlbmRlcmVyXzEuUmVuZGVyZXIoKTtcbnZhciBwMSA9IG5ldyBnYW1lXzEuUGxheWVyKFwiUGxheWVyIDFcIik7XG52YXIgcDIgPSBuZXcgZ2FtZV8xLlBsYXllcihcIlBsYXllciAyXCIpO1xudmFyIGdhbWUgPSBuZXcgZ2FtZV8xLkdhbWUoW3AxLCBwMl0pO1xuZ2FtZS5zZXR1cEJvYXJkKCk7XG52YXIgbWFpbiA9IGZ1bmN0aW9uICgpIHtcbiAgICByZW5kZXJlci5yZW5kZXIoZ2FtZSk7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKG1haW4pO1xufTtcbmFsZXJ0KFwiVGhlIGFpbSBvZiB0aGUgZ2FtZSBpcyB0byBzY29yZSB0aGUgbW9zdCBwb2ludHMuIFxcbllvdSBnYWluIGEgcG9pbnQgZm9yIGV2ZXJ5IGVkZ2UgdGhhdCBtYXRjaGVzIGl0cyBuZWlnaGJvdXJzLCBhbmQgbG9zZSBhIHBvaW50IGZvciBldmVyeSBlZGdlIHRoYXQgZG9lcyBub3QuXFxuWW91IGhhdmUgdG8gcGxheSB0aWxlcyB1cCBhZ2FpbnN0IGF0IGxlYXN0IG9uZSBvdGhlciB0aWxlLlxcbllvdSBhbHdheXMgaGF2ZSA0IHRpbGVzLCBhbmQgZ2V0IGEgbmV3IG9uZSBldmVyeSB0aW1lIHlvdSBwdXQgb25lIGRvd24uXFxuVGhlIGdhbWUgZW5kcyB3aGVuIHRoZXJlIGFyZSBubyBzcGFjZXMgbGVmdCB0byBwbGF5LlxcblRoZSBjdXJyZW50IHNjb3JlIGlzIGluIHRoZSB0b3AgcmlnaHQsIGFuZCB0aGUgY3VycmVudCBwbGF5ZXIgaXMgc2hvd24gaW4gcmVkLlxcbkNsaWNrIGEgdGlsZSBpbiB0aGUgcm93IGF0IHRoZSBib3R0b20gdG8gc2VsZWN0IGl0LiBVc2UgUSBhbmQgRSB0byByb3RhdGUgdGhlIHRpbGUsIHRoZW4gY2xpY2sgb24gdGhlIGdyaWQgdG8gcGxhY2UgdGhlIHRpbGUuXFxuR29vZCBsdWNrIVxcblwiKTtcbm1haW4oKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==