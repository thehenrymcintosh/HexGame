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
var normalCell = {
    color: "transparent",
    text: "",
    pointsMultiplier: 1,
};
var doublePoints = {
    color: "lightblue",
    text: "Double Points",
    pointsMultiplier: 2,
};
var triplePoints = {
    color: "gold",
    text: "Triple Points",
    pointsMultiplier: 3,
};
var Cell = /** @class */ (function () {
    function Cell(x, y, _contents, _options) {
        if (_options === void 0) { _options = normalCell; }
        this.x = x;
        this.y = y;
        this._contents = _contents;
        this._options = _options;
    }
    Object.defineProperty(Cell.prototype, "contents", {
        get: function () {
            return this._contents;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Cell.prototype, "options", {
        get: function () {
            return this._options;
        },
        enumerable: false,
        configurable: true
    });
    Cell.prototype.setOptions = function (options) {
        this._options = options;
    };
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
        this._board = this.createBoard();
        this.drawPile = new Array(64)
            .fill(0)
            .map(function (val, i) { return i; })
            // .slice(1) // remove 0 value tile to put in middle of board
            .sort(function () { return Math.random() - 0.5; }) // shuffle
            .map(function (val) { return new tile_1.Tile(val); });
        this.players = players;
        this.distributeTiles(4);
    }
    Game.prototype.createBoard = function () {
        return new Array(64)
            .fill(0)
            .map(function (cell, i) { return Cell.Empty(i % 8, Math.floor(i / 8)); });
    };
    Game.prototype.addBoardModifiers = function () {
        this._board.forEach(function (cell) {
            if (cell.x === 3 && cell.y === 1)
                cell.setOptions(doublePoints);
            if (cell.x === 4 && cell.y === 6)
                cell.setOptions(doublePoints);
            if (cell.x === 2 && cell.y === 4)
                cell.setOptions(triplePoints);
            if (cell.x === 5 && cell.y === 3)
                cell.setOptions(triplePoints);
        });
    };
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
        var cell = this.getCellAt(x, y);
        var tile = cell === null || cell === void 0 ? void 0 : cell.contents;
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
        }, 0) * cell.options.pointsMultiplier;
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
        var text = this.cell.options.text;
        if (text) {
            var _a = this.hexagonRenderer.getMidpoint(), x = _a[0], y = _a[1];
            var offset = (text.length / 2) * 3.5; // px to move left
            ctx.fillStyle = "black";
            ctx.font = "8px Ariel";
            ctx.fillText(text, x - offset, y + 3);
        }
    };
    CellRenderer.prototype.isWithinBounds = function (point) {
        return this.hexagonRenderer.isWithinBounds(point);
    };
    CellRenderer.prototype.setIsHovering = function (isHovering) {
        if (isHovering) {
            this.hexagonRenderer.setFill("red");
        }
        else {
            this.hexagonRenderer.setFill(this.cell.options.color);
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
game.addBoardModifiers();
var main = function () {
    renderer.render(game);
    requestAnimationFrame(main);
};
alert("The aim of the game is to score the most points. \nYou gain a point for every edge that matches its neighbours, and lose a point for every edge that does not.\nYou have to play tiles up against at least one other tile.\nYou always have 4 tiles, and get a new one every time you put one down.\nThe game ends when there are no spaces left to play.\nThe current score is in the top right, and the current player is shown in red.\nClick a tile in the row at the bottom to select it. Use Q and E to rotate the tile, then click on the grid to place the tile.\nGood luck!\n");
main();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsWUFBWTs7Ozs7Ozs7Ozs7QUM3Q0M7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsbUJBQW1CLEdBQUcsY0FBYztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLLGdCQUFnQix5Q0FBeUM7QUFDOUQ7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7Ozs7Ozs7VUNoQm5CO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7Ozs7QUN0QmE7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsYUFBYSxtQkFBTyxDQUFDLDZCQUFRO0FBQzdCLGlCQUFpQixtQkFBTyxDQUFDLHFDQUFZO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL25lb2RvbWluby8uL3NyYy9nYW1lLnRzIiwid2VicGFjazovL25lb2RvbWluby8uL3NyYy9yZW5kZXJlci50cyIsIndlYnBhY2s6Ly9uZW9kb21pbm8vLi9zcmMvdGlsZS50cyIsIndlYnBhY2s6Ly9uZW9kb21pbm8vLi9zcmMvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vbmVvZG9taW5vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL25lb2RvbWluby8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuR2FtZSA9IGV4cG9ydHMuQ2VsbCA9IGV4cG9ydHMuUGxheWVyID0gdm9pZCAwO1xudmFyIHRpbGVfMSA9IHJlcXVpcmUoXCIuL3RpbGVcIik7XG52YXIgdXRpbHNfMSA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xudmFyIFBsYXllciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBQbGF5ZXIobmFtZSkge1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLl90aWxlcyA9IFtdO1xuICAgICAgICB0aGlzLl9wb2ludHMgPSAwO1xuICAgIH1cbiAgICBQbGF5ZXIucHJvdG90eXBlLmdpdmVUaWxlID0gZnVuY3Rpb24gKHRpbGUpIHtcbiAgICAgICAgdGhpcy5fdGlsZXMucHVzaCh0aWxlKTtcbiAgICB9O1xuICAgIFBsYXllci5wcm90b3R5cGUudGFrZVRpbGUgPSBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcihcIk5vIHRpbGUgaW4gdGhhdCBwb3NpdGlvbiFcIik7XG4gICAgICAgIGlmIChpbmRleCA+PSB0aGlzLl90aWxlcy5sZW5ndGgpXG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIGlmIChpbmRleCA8IDApXG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIHZhciB0aWxlID0gdGhpcy5fdGlsZXMuc3BsaWNlKGluZGV4LCAxKVswXTtcbiAgICAgICAgaWYgKCF0aWxlKVxuICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICByZXR1cm4gdGlsZTtcbiAgICB9O1xuICAgIFBsYXllci5wcm90b3R5cGUuYXdhcmRQb2ludHMgPSBmdW5jdGlvbiAocG9pbnRzKSB7XG4gICAgICAgIHRoaXMuX3BvaW50cyArPSBwb2ludHM7XG4gICAgfTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUGxheWVyLnByb3RvdHlwZSwgXCJ0aWxlc1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RpbGVzLnNsaWNlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUGxheWVyLnByb3RvdHlwZSwgXCJwb2ludHNcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wb2ludHM7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBQbGF5ZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gXCJcIi5jb25jYXQodGhpcy5uYW1lLCBcIjogXCIpLmNvbmNhdCh0aGlzLnBvaW50cywgXCIgcG9pbnRzXCIpO1xuICAgIH07XG4gICAgcmV0dXJuIFBsYXllcjtcbn0oKSk7XG5leHBvcnRzLlBsYXllciA9IFBsYXllcjtcbnZhciBub3JtYWxDZWxsID0ge1xuICAgIGNvbG9yOiBcInRyYW5zcGFyZW50XCIsXG4gICAgdGV4dDogXCJcIixcbiAgICBwb2ludHNNdWx0aXBsaWVyOiAxLFxufTtcbnZhciBkb3VibGVQb2ludHMgPSB7XG4gICAgY29sb3I6IFwibGlnaHRibHVlXCIsXG4gICAgdGV4dDogXCJEb3VibGUgUG9pbnRzXCIsXG4gICAgcG9pbnRzTXVsdGlwbGllcjogMixcbn07XG52YXIgdHJpcGxlUG9pbnRzID0ge1xuICAgIGNvbG9yOiBcImdvbGRcIixcbiAgICB0ZXh0OiBcIlRyaXBsZSBQb2ludHNcIixcbiAgICBwb2ludHNNdWx0aXBsaWVyOiAzLFxufTtcbnZhciBDZWxsID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENlbGwoeCwgeSwgX2NvbnRlbnRzLCBfb3B0aW9ucykge1xuICAgICAgICBpZiAoX29wdGlvbnMgPT09IHZvaWQgMCkgeyBfb3B0aW9ucyA9IG5vcm1hbENlbGw7IH1cbiAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICAgICAgdGhpcy5fY29udGVudHMgPSBfY29udGVudHM7XG4gICAgICAgIHRoaXMuX29wdGlvbnMgPSBfb3B0aW9ucztcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KENlbGwucHJvdG90eXBlLCBcImNvbnRlbnRzXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY29udGVudHM7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQ2VsbC5wcm90b3R5cGUsIFwib3B0aW9uc1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX29wdGlvbnM7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBDZWxsLnByb3RvdHlwZS5zZXRPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgfTtcbiAgICBDZWxsLnByb3RvdHlwZS5zZXRDb250ZW50cyA9IGZ1bmN0aW9uIChjb250ZW50cykge1xuICAgICAgICB0aGlzLl9jb250ZW50cyA9IGNvbnRlbnRzO1xuICAgIH07XG4gICAgQ2VsbC5wcm90b3R5cGUuaXNPY2N1cGllZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5jb250ZW50cztcbiAgICB9O1xuICAgIENlbGwuRW1wdHkgPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICByZXR1cm4gbmV3IENlbGwoeCwgeSwgdW5kZWZpbmVkKTtcbiAgICB9O1xuICAgIHJldHVybiBDZWxsO1xufSgpKTtcbmV4cG9ydHMuQ2VsbCA9IENlbGw7XG52YXIgR2FtZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBHYW1lKHBsYXllcnMpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50UGxheWVySW5kZXggPSAwO1xuICAgICAgICBpZiAocGxheWVycy5sZW5ndGggPCAyKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWluaW11bSAyIHBsYXllcnMhXCIpO1xuICAgICAgICBpZiAocGxheWVycy5sZW5ndGggPiA0KVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWF4aW11bSA0IHBsYXllcnMhXCIpO1xuICAgICAgICB0aGlzLl9ib2FyZCA9IHRoaXMuY3JlYXRlQm9hcmQoKTtcbiAgICAgICAgdGhpcy5kcmF3UGlsZSA9IG5ldyBBcnJheSg2NClcbiAgICAgICAgICAgIC5maWxsKDApXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uICh2YWwsIGkpIHsgcmV0dXJuIGk7IH0pXG4gICAgICAgICAgICAvLyAuc2xpY2UoMSkgLy8gcmVtb3ZlIDAgdmFsdWUgdGlsZSB0byBwdXQgaW4gbWlkZGxlIG9mIGJvYXJkXG4gICAgICAgICAgICAuc29ydChmdW5jdGlvbiAoKSB7IHJldHVybiBNYXRoLnJhbmRvbSgpIC0gMC41OyB9KSAvLyBzaHVmZmxlXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uICh2YWwpIHsgcmV0dXJuIG5ldyB0aWxlXzEuVGlsZSh2YWwpOyB9KTtcbiAgICAgICAgdGhpcy5wbGF5ZXJzID0gcGxheWVycztcbiAgICAgICAgdGhpcy5kaXN0cmlidXRlVGlsZXMoNCk7XG4gICAgfVxuICAgIEdhbWUucHJvdG90eXBlLmNyZWF0ZUJvYXJkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IEFycmF5KDY0KVxuICAgICAgICAgICAgLmZpbGwoMClcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKGNlbGwsIGkpIHsgcmV0dXJuIENlbGwuRW1wdHkoaSAlIDgsIE1hdGguZmxvb3IoaSAvIDgpKTsgfSk7XG4gICAgfTtcbiAgICBHYW1lLnByb3RvdHlwZS5hZGRCb2FyZE1vZGlmaWVycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fYm9hcmQuZm9yRWFjaChmdW5jdGlvbiAoY2VsbCkge1xuICAgICAgICAgICAgaWYgKGNlbGwueCA9PT0gMyAmJiBjZWxsLnkgPT09IDEpXG4gICAgICAgICAgICAgICAgY2VsbC5zZXRPcHRpb25zKGRvdWJsZVBvaW50cyk7XG4gICAgICAgICAgICBpZiAoY2VsbC54ID09PSA0ICYmIGNlbGwueSA9PT0gNilcbiAgICAgICAgICAgICAgICBjZWxsLnNldE9wdGlvbnMoZG91YmxlUG9pbnRzKTtcbiAgICAgICAgICAgIGlmIChjZWxsLnggPT09IDIgJiYgY2VsbC55ID09PSA0KVxuICAgICAgICAgICAgICAgIGNlbGwuc2V0T3B0aW9ucyh0cmlwbGVQb2ludHMpO1xuICAgICAgICAgICAgaWYgKGNlbGwueCA9PT0gNSAmJiBjZWxsLnkgPT09IDMpXG4gICAgICAgICAgICAgICAgY2VsbC5zZXRPcHRpb25zKHRyaXBsZVBvaW50cyk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgR2FtZS5wcm90b3R5cGUuc2V0dXBCb2FyZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5zZXR1cEJvYXJkUGVyaW1ldGVyKCk7XG4gICAgICAgIHRoaXMuc2V0dXBCb2FyZENlbnRyZSgpO1xuICAgIH07XG4gICAgR2FtZS5wcm90b3R5cGUuc2V0dXBCb2FyZENlbnRyZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5zZXRUaWxlQXQodGhpcy5kcmF3UGlsZS5wb3AoKSwgMiwgMik7XG4gICAgICAgIHRoaXMuc2V0VGlsZUF0KHRoaXMuZHJhd1BpbGUucG9wKCksIDUsIDIpO1xuICAgICAgICB0aGlzLnNldFRpbGVBdCh0aGlzLmRyYXdQaWxlLnBvcCgpLCAyLCA1KTtcbiAgICAgICAgdGhpcy5zZXRUaWxlQXQodGhpcy5kcmF3UGlsZS5wb3AoKSwgNSwgNSk7XG4gICAgICAgIHRoaXMuc2V0VGlsZUF0KHRoaXMuZHJhd1BpbGUucG9wKCksIDMsIDMpO1xuICAgICAgICB0aGlzLnNldFRpbGVBdCh0aGlzLmRyYXdQaWxlLnBvcCgpLCA0LCA0KTtcbiAgICB9O1xuICAgIEdhbWUucHJvdG90eXBlLnNldHVwQm9hcmRQZXJpbWV0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBncmlkV2lkdGggPSA4O1xuICAgICAgICB2YXIgZmFyUm93SWR4ID0gZ3JpZFdpZHRoIC0gMTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBncmlkV2lkdGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5zZXRUaWxlQXQodGhpcy5kcmF3UGlsZS5wb3AoKSwgaSwgMCk7XG4gICAgICAgICAgICB0aGlzLnNldFRpbGVBdCh0aGlzLmRyYXdQaWxlLnBvcCgpLCBpLCBmYXJSb3dJZHgpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgZ3JpZFdpZHRoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLnNldFRpbGVBdCh0aGlzLmRyYXdQaWxlLnBvcCgpLCAwLCBpKTtcbiAgICAgICAgICAgIHRoaXMuc2V0VGlsZUF0KHRoaXMuZHJhd1BpbGUucG9wKCksIGZhclJvd0lkeCwgaSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShHYW1lLnByb3RvdHlwZSwgXCJ0aWxlc1JlbWFpbmluZ1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZHJhd1BpbGUubGVuZ3RoO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEdhbWUucHJvdG90eXBlLCBcImJvYXJkXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYm9hcmQuc2xpY2UoKTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIEdhbWUucHJvdG90eXBlLmRpc3RyaWJ1dGVUaWxlcyA9IGZ1bmN0aW9uIChjb3VudCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLnBsYXllcnMuZm9yRWFjaChmdW5jdGlvbiAocGxheWVyKSB7XG4gICAgICAgICAgICB3aGlsZSAocGxheWVyLnRpbGVzLmxlbmd0aCA8IGNvdW50KSB7XG4gICAgICAgICAgICAgICAgdmFyIHRpbGUgPSBfdGhpcy5kcmF3UGlsZS5wb3AoKTtcbiAgICAgICAgICAgICAgICBpZiAoIXRpbGUpXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk91dCBvZiB0aWxlcyFcIik7XG4gICAgICAgICAgICAgICAgcGxheWVyLmdpdmVUaWxlKHRpbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIEdhbWUucHJvdG90eXBlLnBsYWNlVGlsZSA9IGZ1bmN0aW9uIChwbGF5ZXIsIHRpbGVJZHgsIHgsIHkpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWRQb3NpdGlvbih4LCB5KSlcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlBvc2l0aW9uIG91dCBvZiBib3VuZHMhXCIpO1xuICAgICAgICB2YXIgZXhpc3RpbmdUaWxlID0gdGhpcy5nZXRUaWxlQXQoeCwgeSk7XG4gICAgICAgIGlmIChleGlzdGluZ1RpbGUpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcGFjZSBhbHJlYWR5IG9jY3VwaWVkIVwiKTtcbiAgICAgICAgaWYgKHRoaXMubmVpZ2hib3VyQ291bnQoeCwgeSkgPT09IDApXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IHBsYWNlIGEgdGlsZSBhZ2FpbnN0IGFub3RoZXIgb25lXCIpO1xuICAgICAgICBpZiAocGxheWVyICE9PSB0aGlzLmN1cnJlbnRQbGF5ZXIpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgXCIuY29uY2F0KHBsYXllci5uYW1lLCBcIidzIHR1cm4hXCIpKTtcbiAgICAgICAgdmFyIHRpbGUgPSBwbGF5ZXIudGFrZVRpbGUodGlsZUlkeCk7XG4gICAgICAgIHRoaXMuc2V0VGlsZUF0KHRpbGUsIHgsIHkpO1xuICAgICAgICB2YXIgcG9pbnRzID0gdGhpcy5jYWxjdWxhdGVQb2ludHNGb3JUaWxlKHgsIHkpO1xuICAgICAgICB0aGlzLmN1cnJlbnRQbGF5ZXIuYXdhcmRQb2ludHMocG9pbnRzKTtcbiAgICAgICAgdmFyIGRyYXduVGlsZSA9IHRoaXMuZHJhd1BpbGUucG9wKCk7XG4gICAgICAgIGlmIChkcmF3blRpbGUpXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQbGF5ZXIuZ2l2ZVRpbGUoZHJhd25UaWxlKTtcbiAgICAgICAgdmFyIGV2ZXJ5b25lSXNPdXRPZlRpbGVzID0gdGhpcy5wbGF5ZXJzLmV2ZXJ5KGZ1bmN0aW9uIChwbGF5ZXIpIHsgcmV0dXJuIHBsYXllci50aWxlcy5sZW5ndGggPT09IDA7IH0pO1xuICAgICAgICB2YXIgYm9hcmRJc0Z1bGwgPSB0aGlzLmJvYXJkLmV2ZXJ5KGZ1bmN0aW9uIChjZWxsKSB7IHJldHVybiBjZWxsLmlzT2NjdXBpZWQoKTsgfSk7XG4gICAgICAgIGlmIChib2FyZElzRnVsbCB8fCBldmVyeW9uZUlzT3V0T2ZUaWxlcykge1xuICAgICAgICAgICAgYWxlcnQoXCJHYW1lIG92ZXIsIGZpbmFsIHBvaW50czogXCIuY29uY2F0KHRoaXMucGxheWVycy5tYXAoZnVuY3Rpb24gKHBsYXllcikgeyByZXR1cm4gcGxheWVyLnRvU3RyaW5nKCk7IH0pLmpvaW4oXCIsIFwiKSkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3VycmVudFBsYXllckluZGV4ICs9IDE7XG4gICAgICAgIHRoaXMuY3VycmVudFBsYXllckluZGV4ID0gdGhpcy5jdXJyZW50UGxheWVySW5kZXggJSB0aGlzLnBsYXllcnMubGVuZ3RoO1xuICAgIH07XG4gICAgR2FtZS5wcm90b3R5cGUuY2FsY3VsYXRlUG9pbnRzRm9yVGlsZSA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgICAgIHZhciBjZWxsID0gdGhpcy5nZXRDZWxsQXQoeCwgeSk7XG4gICAgICAgIHZhciB0aWxlID0gY2VsbCA9PT0gbnVsbCB8fCBjZWxsID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjZWxsLmNvbnRlbnRzO1xuICAgICAgICBpZiAoIXRpbGUpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyB0aWxlIHRvIGNhbGN1bGF0ZSFcIik7XG4gICAgICAgIHZhciBuZWlnaGJvdXJWYWx1ZXMgPSB0aGlzLmdldE5laWdoYm91cmluZ1ZhbHVlc1RvKHgsIHkpO1xuICAgICAgICByZXR1cm4gdGlsZS5zaWRlcy5yZWR1Y2UoZnVuY3Rpb24gKHBvaW50cywgc2lkZVZhbHVlLCBzaWRlSW5kZXgpIHtcbiAgICAgICAgICAgIHZhciBuZWlnaGJvdXJpbmdTaWRlVmFsdWUgPSBuZWlnaGJvdXJWYWx1ZXNbc2lkZUluZGV4XTtcbiAgICAgICAgICAgIGlmIChuZWlnaGJvdXJpbmdTaWRlVmFsdWUgPT09IHNpZGVWYWx1ZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gcG9pbnRzICsgMTtcbiAgICAgICAgICAgIGlmICghKDAsIHV0aWxzXzEuaXNVbmRlZmluZWQpKG5laWdoYm91cmluZ1NpZGVWYWx1ZSkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBvaW50cyAtIDE7XG4gICAgICAgICAgICByZXR1cm4gcG9pbnRzO1xuICAgICAgICB9LCAwKSAqIGNlbGwub3B0aW9ucy5wb2ludHNNdWx0aXBsaWVyO1xuICAgIH07XG4gICAgR2FtZS5wcm90b3R5cGUuZ2V0TmVpZ2hib3VyaW5nVmFsdWVzVG8gPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICB2YXIgdGlsZXMgPSB0aGlzLmdldE5laWdoYm91cmluZ1RpbGVzVG8oeCwgeSk7XG4gICAgICAgIHJldHVybiB0aWxlcy5tYXAoZnVuY3Rpb24gKHRpbGUsIGZhY2VJbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuIHRpbGUgPT09IG51bGwgfHwgdGlsZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogdGlsZS5nZXRPcHBvc2luZ0ZhY2VWYWx1ZVRvKGZhY2VJbmRleCk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgR2FtZS5wcm90b3R5cGUubmVpZ2hib3VyQ291bnQgPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXROZWlnaGJvdXJpbmdUaWxlc1RvKHgsIHkpXG4gICAgICAgICAgICAucmVkdWNlKGZ1bmN0aW9uIChjb3VudCwgdGlsZSkge1xuICAgICAgICAgICAgaWYgKHRpbGUpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvdW50ICsgMTtcbiAgICAgICAgICAgIHJldHVybiBjb3VudDtcbiAgICAgICAgfSwgMCk7XG4gICAgfTtcbiAgICBHYW1lLnByb3RvdHlwZS5nZXROZWlnaGJvdXJpbmdUaWxlc1RvID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgdmFyIGlzRXZlblJvdyA9IHkgJSAyID09PSAwO1xuICAgICAgICB2YXIgcm93T2Zmc2V0ID0gaXNFdmVuUm93ID8gLTEgOiAwO1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgdGhpcy5nZXRUaWxlQXQoeCArIHJvd09mZnNldCwgeSAtIDEpLFxuICAgICAgICAgICAgdGhpcy5nZXRUaWxlQXQoeCArIDEgKyByb3dPZmZzZXQsIHkgLSAxKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0VGlsZUF0KHggKyAxLCB5KSxcbiAgICAgICAgICAgIHRoaXMuZ2V0VGlsZUF0KHggKyAxICsgcm93T2Zmc2V0LCB5ICsgMSksXG4gICAgICAgICAgICB0aGlzLmdldFRpbGVBdCh4ICsgcm93T2Zmc2V0LCB5ICsgMSksXG4gICAgICAgICAgICB0aGlzLmdldFRpbGVBdCh4IC0gMSwgeSkgLy8gbGVmdFxuICAgICAgICBdO1xuICAgIH07XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEdhbWUucHJvdG90eXBlLCBcImN1cnJlbnRQbGF5ZXJcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBsYXllcnNbdGhpcy5jdXJyZW50UGxheWVySW5kZXhdO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgR2FtZS5wcm90b3R5cGUuZ2V0VGlsZUF0ID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gKF9hID0gdGhpcy5nZXRDZWxsQXQoeCwgeSkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jb250ZW50cztcbiAgICB9O1xuICAgIEdhbWUucHJvdG90eXBlLnNldFRpbGVBdCA9IGZ1bmN0aW9uICh0aWxlLCB4LCB5KSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgKF9hID0gdGhpcy5nZXRDZWxsQXQoeCwgeSkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5zZXRDb250ZW50cyh0aWxlKTtcbiAgICB9O1xuICAgIEdhbWUucHJvdG90eXBlLmdldENlbGxBdCA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9ib2FyZC5maW5kKGZ1bmN0aW9uIChjZWxsKSB7IHJldHVybiBjZWxsLnggPT09IHggJiYgY2VsbC55ID09PSB5OyB9KTtcbiAgICB9O1xuICAgIEdhbWUucHJvdG90eXBlLmlzVmFsaWRQb3NpdGlvbiA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuZ2V0Q2VsbEF0KHgsIHkpO1xuICAgIH07XG4gICAgcmV0dXJuIEdhbWU7XG59KCkpO1xuZXhwb3J0cy5HYW1lID0gR2FtZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5SZW5kZXJlciA9IHZvaWQgMDtcbnZhciB1dGlsc18xID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XG52YXIgZGVnNjAgPSBNYXRoLlBJIC8gMztcbnZhciBkZWczMCA9IE1hdGguUEkgLyA2O1xudmFyIGhleFJhZGl1cyA9IDQwO1xudmFyIFJlbmRlcmVyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFJlbmRlcmVyKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluJyk7XG4gICAgICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgdGhpcy5tb3VzZVBvc2l0aW9uID0geyB4OiAwLCB5OiAwIH07XG4gICAgICAgIHdpbmRvdy5vbmtleWRvd24gPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgICAgIGlmIChfdGhpcy5mb2N1c3NlZFRpbGUgJiYgZS5rZXkgPT09IFwicVwiIHx8IGUua2V5ID09PSBcIlFcIikge1xuICAgICAgICAgICAgICAgIChfYSA9IF90aGlzLmZvY3Vzc2VkVGlsZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnJvdGF0ZUNvdW50ZXJDbG9ja3dpc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKF90aGlzLmZvY3Vzc2VkVGlsZSAmJiBlLmtleSA9PT0gXCJlXCIgfHwgZS5rZXkgPT09IFwiRVwiKSB7XG4gICAgICAgICAgICAgICAgKF9iID0gX3RoaXMuZm9jdXNzZWRUaWxlKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Iucm90YXRlQ2xvY2t3aXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuY2FudmFzLm9ubW91c2Vtb3ZlID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHZhciByZWN0ID0gX3RoaXMuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgX3RoaXMubW91c2VQb3NpdGlvbi54ID0gZS5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuICAgICAgICAgICAgX3RoaXMubW91c2VQb3NpdGlvbi55ID0gZS5jbGllbnRZIC0gcmVjdC50b3A7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuY2FudmFzLm9uY2xpY2sgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgaWYgKCFfdGhpcy5nYW1lKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IF90aGlzLmdldEVsZW1lbnRzKF90aGlzLmdhbWUpO1xuICAgICAgICAgICAgdmFyIHJlY3QgPSBfdGhpcy5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICBfdGhpcy5tb3VzZVBvc2l0aW9uLnggPSBlLmNsaWVudFggLSByZWN0LmxlZnQ7XG4gICAgICAgICAgICBfdGhpcy5tb3VzZVBvc2l0aW9uLnkgPSBlLmNsaWVudFkgLSByZWN0LnRvcDtcbiAgICAgICAgICAgIHZhciBjbGlja2VkRWxlbWVudCA9IGVsZW1lbnRzLmZpbmQoZnVuY3Rpb24gKGVsZW1lbnQpIHsgcmV0dXJuIGVsZW1lbnQuaXNXaXRoaW5Cb3VuZHMoX3RoaXMubW91c2VQb3NpdGlvbik7IH0pO1xuICAgICAgICAgICAgaWYgKGNsaWNrZWRFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuaGFuZGxlQ2xpY2tPbkVsZW1lbnQoY2xpY2tlZEVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgX3RoaXMudW5mb2N1cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICBSZW5kZXJlci5wcm90b3R5cGUuc2V0U2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIH07XG4gICAgUmVuZGVyZXIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIChnYW1lKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMuc2V0U2l6ZSgpO1xuICAgICAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XG4gICAgICAgIHRoaXMuY3R4LmZvbnQgPSBcIjI0cHggQXJpZWxcIjtcbiAgICAgICAgLy8gcmVuZGVyIHBvaW50c1xuICAgICAgICB0aGlzLmN0eC5maWxsVGV4dChcIlBvaW50c1wiLCB0aGlzLmNhbnZhcy53aWR0aCAtIDIwMCwgMjApO1xuICAgICAgICBnYW1lLnBsYXllcnMuZm9yRWFjaChmdW5jdGlvbiAocGxheWVyLCBpKSB7XG4gICAgICAgICAgICB2YXIgeCA9IF90aGlzLmNhbnZhcy53aWR0aCAtIDIwMDtcbiAgICAgICAgICAgIHZhciB5ID0gNzAgKyAzMCAqIGk7XG4gICAgICAgICAgICBpZiAocGxheWVyID09PSBnYW1lLmN1cnJlbnRQbGF5ZXIpXG4gICAgICAgICAgICAgICAgX3RoaXMuY3R4LmZpbGxTdHlsZSA9IFwicmVkXCI7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgX3RoaXMuY3R4LmZpbGxTdHlsZSA9IFwiYmxhY2tcIjtcbiAgICAgICAgICAgIF90aGlzLmN0eC5maWxsVGV4dChcIlwiLmNvbmNhdChwbGF5ZXIubmFtZSwgXCI6IFwiKS5jb25jYXQocGxheWVyLnBvaW50cyksIHgsIHkpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gXCJibGFja1wiO1xuICAgICAgICB0aGlzLmN0eC5maWxsVGV4dChcIlRpbGVzIHJlbWFpbmluZzogXCIuY29uY2F0KGdhbWUudGlsZXNSZW1haW5pbmcpLCB0aGlzLmNhbnZhcy53aWR0aCAtIDQ1MCwgMjApO1xuICAgICAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IFwic2xhdGVHcmV5XCI7XG4gICAgICAgIHRoaXMuZ2V0RWxlbWVudHMoZ2FtZSkuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkgeyByZXR1cm4gZWxlbWVudC5kcmF3KF90aGlzLmN0eCk7IH0pO1xuICAgIH07XG4gICAgUmVuZGVyZXIucHJvdG90eXBlLmhhbmRsZUNsaWNrT25FbGVtZW50ID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmdhbWUpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHZhciBfYSA9IGVsZW1lbnQsIHRpbGUgPSBfYS50aWxlLCB0aWxlSWR4ID0gX2EudGlsZUlkeDtcbiAgICAgICAgdmFyIGNlbGwgPSBlbGVtZW50LmNlbGw7XG4gICAgICAgIGlmICh0aWxlICYmICEoMCwgdXRpbHNfMS5pc1VuZGVmaW5lZCkodGlsZUlkeCkpIHtcbiAgICAgICAgICAgIC8vIGNsaWNraW5nIG9uIGFuIHVucGxheWVkIHRpbGVcbiAgICAgICAgICAgIHRoaXMuZm9jdXNzZWRUaWxlID0gdGlsZTtcbiAgICAgICAgICAgIHRoaXMuZm9jdXNzZWRUaWxlSWR4ID0gdGlsZUlkeDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghKDAsIHV0aWxzXzEuaXNVbmRlZmluZWQpKGNlbGwpKSB7XG4gICAgICAgICAgICAvLyBjbGlja2luZyBvbiBhIGhleGFnb25cbiAgICAgICAgICAgIGlmICh0aGlzLmZvY3Vzc2VkVGlsZSAmJiAhKDAsIHV0aWxzXzEuaXNVbmRlZmluZWQpKHRoaXMuZm9jdXNzZWRUaWxlSWR4KSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGFjZVRpbGUodGhpcy5nYW1lLmN1cnJlbnRQbGF5ZXIsIHRoaXMuZm9jdXNzZWRUaWxlSWR4LCBjZWxsLngsIGNlbGwueSk7XG4gICAgICAgICAgICAgICAgdGhpcy51bmZvY3VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnVuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUmVuZGVyZXIucHJvdG90eXBlLnVuZm9jdXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuZm9jdXNzZWRUaWxlID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLmZvY3Vzc2VkVGlsZUlkeCA9IHVuZGVmaW5lZDtcbiAgICB9O1xuICAgIFJlbmRlcmVyLnByb3RvdHlwZS5nZXRFbGVtZW50cyA9IGZ1bmN0aW9uIChnYW1lKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBncmlkID0gZ2FtZS5ib2FyZDtcbiAgICAgICAgLy8gcmVuZGVyIGJvYXJkXG4gICAgICAgIHZhciBlbGVtZW50cyA9IFtdO1xuICAgICAgICBnYW1lLmJvYXJkLmZvckVhY2goZnVuY3Rpb24gKGNlbGwpIHtcbiAgICAgICAgICAgIHZhciBjb250ZW50cyA9IGNlbGwuY29udGVudHMsIHggPSBjZWxsLngsIHkgPSBjZWxsLnk7XG4gICAgICAgICAgICBpZiAoY29udGVudHMpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50cy5wdXNoKG5ldyBQbGF5ZWRUaWxlUmVuZGVyZXIoeCwgeSwgY29udGVudHMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBlbGVtZW50ID0gbmV3IENlbGxSZW5kZXJlcihjZWxsKTtcbiAgICAgICAgICAgICAgICB2YXIgaXNIb3ZlcmluZyA9IGVsZW1lbnQuaXNXaXRoaW5Cb3VuZHMoX3RoaXMubW91c2VQb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zZXRJc0hvdmVyaW5nKGlzSG92ZXJpbmcpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnRzLnB1c2goZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAvLyByZW5kZXIgdGlsZXMgZm9yIGN1cnJlbnQgcGxheWVyXG4gICAgICAgIGdhbWUuY3VycmVudFBsYXllci50aWxlcy5mb3JFYWNoKGZ1bmN0aW9uICh0aWxlLCBpZHgpIHtcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gbmV3IFVucGxheWVkVGlsZVJlbmRlcmVyKGlkeCwgOCArIDIsIHRpbGUpO1xuICAgICAgICAgICAgaWYgKHRpbGUgPT09IF90aGlzLmZvY3Vzc2VkVGlsZSkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0RmlsbChcImJsdWVcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChlbGVtZW50LmlzV2l0aGluQm91bmRzKF90aGlzLm1vdXNlUG9zaXRpb24pKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zZXRGaWxsKFwiZ3JleVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsZW1lbnRzLnB1c2goZWxlbWVudCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZWxlbWVudHM7XG4gICAgfTtcbiAgICByZXR1cm4gUmVuZGVyZXI7XG59KCkpO1xuZXhwb3J0cy5SZW5kZXJlciA9IFJlbmRlcmVyO1xudmFyIENlbGxSZW5kZXJlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDZWxsUmVuZGVyZXIoY2VsbCkge1xuICAgICAgICB0aGlzLmNlbGwgPSBjZWxsO1xuICAgICAgICB0aGlzLmhleGFnb25SZW5kZXJlciA9IG5ldyBIZXhhZ29uUmVuZGVyZXIodGhpcy5jZWxsLngsIHRoaXMuY2VsbC55KTtcbiAgICB9XG4gICAgQ2VsbFJlbmRlcmVyLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24gKGN0eCkge1xuICAgICAgICB0aGlzLmhleGFnb25SZW5kZXJlci5kcmF3KGN0eCk7XG4gICAgICAgIHZhciB0ZXh0ID0gdGhpcy5jZWxsLm9wdGlvbnMudGV4dDtcbiAgICAgICAgaWYgKHRleHQpIHtcbiAgICAgICAgICAgIHZhciBfYSA9IHRoaXMuaGV4YWdvblJlbmRlcmVyLmdldE1pZHBvaW50KCksIHggPSBfYVswXSwgeSA9IF9hWzFdO1xuICAgICAgICAgICAgdmFyIG9mZnNldCA9ICh0ZXh0Lmxlbmd0aCAvIDIpICogMy41OyAvLyBweCB0byBtb3ZlIGxlZnRcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XG4gICAgICAgICAgICBjdHguZm9udCA9IFwiOHB4IEFyaWVsXCI7XG4gICAgICAgICAgICBjdHguZmlsbFRleHQodGV4dCwgeCAtIG9mZnNldCwgeSArIDMpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBDZWxsUmVuZGVyZXIucHJvdG90eXBlLmlzV2l0aGluQm91bmRzID0gZnVuY3Rpb24gKHBvaW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhleGFnb25SZW5kZXJlci5pc1dpdGhpbkJvdW5kcyhwb2ludCk7XG4gICAgfTtcbiAgICBDZWxsUmVuZGVyZXIucHJvdG90eXBlLnNldElzSG92ZXJpbmcgPSBmdW5jdGlvbiAoaXNIb3ZlcmluZykge1xuICAgICAgICBpZiAoaXNIb3ZlcmluZykge1xuICAgICAgICAgICAgdGhpcy5oZXhhZ29uUmVuZGVyZXIuc2V0RmlsbChcInJlZFwiKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaGV4YWdvblJlbmRlcmVyLnNldEZpbGwodGhpcy5jZWxsLm9wdGlvbnMuY29sb3IpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gQ2VsbFJlbmRlcmVyO1xufSgpKTtcbnZhciBIZXhhZ29uUmVuZGVyZXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gSGV4YWdvblJlbmRlcmVyKGdyaWRYLCBncmlkWSkge1xuICAgICAgICB0aGlzLmdyaWRYID0gZ3JpZFg7XG4gICAgICAgIHRoaXMuZ3JpZFkgPSBncmlkWTtcbiAgICAgICAgdGhpcy5maWxsID0gXCJ0cmFuc3BhcmVudFwiO1xuICAgIH1cbiAgICBIZXhhZ29uUmVuZGVyZXIucHJvdG90eXBlLnNldEZpbGwgPSBmdW5jdGlvbiAoZmlsbCkge1xuICAgICAgICB0aGlzLmZpbGwgPSBmaWxsO1xuICAgIH07XG4gICAgSGV4YWdvblJlbmRlcmVyLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24gKGN0eCkge1xuICAgICAgICB2YXIgX2EgPSB0aGlzLmdldE1pZHBvaW50KCksIHggPSBfYVswXSwgeSA9IF9hWzFdO1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNjsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYW5nbGVUb1BvaW50ID0gZGVnMzAgKyBkZWc2MCAqIGk7XG4gICAgICAgICAgICB2YXIgeE9mZnNldCA9IGhleFJhZGl1cyAqIE1hdGguY29zKGFuZ2xlVG9Qb2ludCk7XG4gICAgICAgICAgICB2YXIgeU9mZnNldCA9IGhleFJhZGl1cyAqIE1hdGguc2luKGFuZ2xlVG9Qb2ludCk7XG4gICAgICAgICAgICBjdHgubGluZVRvKHggKyB4T2Zmc2V0LCB5ICsgeU9mZnNldCk7XG4gICAgICAgIH1cbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZmlsbDtcbiAgICAgICAgY3R4LmZpbGwoKTtcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfTtcbiAgICBIZXhhZ29uUmVuZGVyZXIucHJvdG90eXBlLmlzV2l0aGluQm91bmRzID0gZnVuY3Rpb24gKHBvaW50KSB7XG4gICAgICAgIHZhciBfYSA9IHRoaXMuZ2V0TWlkcG9pbnQoKSwgeCA9IF9hWzBdLCB5ID0gX2FbMV07XG4gICAgICAgIHZhciB2ZWMgPSB7IHg6IHBvaW50LnggLSB4LCB5OiBwb2ludC55IC0geSB9OyAvLyB2ZWMgZnJvbSBjZW50cmUgb2YgdGhlIGhleCB0byBwb2ludDtcbiAgICAgICAgdmFyIG1hZ25pdHVkZSA9IE1hdGguc3FydChNYXRoLnBvdyh2ZWMueCwgMikgKyBNYXRoLnBvdyh2ZWMueSwgMikpO1xuICAgICAgICB2YXIgYW5nbGVSYWQgPSBNYXRoLmF0YW4yKHZlYy55LCB2ZWMueCk7XG4gICAgICAgIHZhciBwZXJwZW5kaWN1bGFySGVpZ2h0ID0gTWF0aC5zaW4oZGVnNjApICogaGV4UmFkaXVzO1xuICAgICAgICB2YXIgYW5nbGVSYWRQb3MgPSBhbmdsZVJhZDtcbiAgICAgICAgd2hpbGUgKGFuZ2xlUmFkUG9zIDwgMClcbiAgICAgICAgICAgIGFuZ2xlUmFkUG9zICs9IDIgKiBNYXRoLlBJO1xuICAgICAgICB2YXIgYW5nbGVSYWROb3JtID0gYW5nbGVSYWRQb3MgJSBkZWczMDtcbiAgICAgICAgdmFyIGRpc3RhbmNlVG9FZGdlID0gcGVycGVuZGljdWxhckhlaWdodCAvIE1hdGguY29zKGFuZ2xlUmFkTm9ybSk7XG4gICAgICAgIHJldHVybiBtYWduaXR1ZGUgPCBkaXN0YW5jZVRvRWRnZTtcbiAgICB9O1xuICAgIEhleGFnb25SZW5kZXJlci5wcm90b3R5cGUuZ2V0TWlkcG9pbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBwZXJwZW5kaWN1bGFySGVpZ2h0ID0gTWF0aC5zaW4oZGVnNjApICogaGV4UmFkaXVzO1xuICAgICAgICB2YXIgaGFsZkVkZ2VMZW5ndGggPSBNYXRoLmNvcyhkZWc2MCkgKiBoZXhSYWRpdXM7XG4gICAgICAgIHZhciB4T2Zmc2V0ID0gcGVycGVuZGljdWxhckhlaWdodDtcbiAgICAgICAgdmFyIHggPSAodGhpcy5ncmlkWCArIDEpICogcGVycGVuZGljdWxhckhlaWdodCAqIDI7XG4gICAgICAgIHZhciB5ID0gKHRoaXMuZ3JpZFkgKyAxKSAqIChoZXhSYWRpdXMgKyBoYWxmRWRnZUxlbmd0aCk7XG4gICAgICAgIGlmICh0aGlzLmdyaWRZICUgMiA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIFt4LCB5XTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBbeCArIHhPZmZzZXQsIHldO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gSGV4YWdvblJlbmRlcmVyO1xufSgpKTtcbnZhciBQbGF5ZWRUaWxlUmVuZGVyZXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gUGxheWVkVGlsZVJlbmRlcmVyKGdyaWRYLCBncmlkWSwgdGlsZSkge1xuICAgICAgICB0aGlzLmdyaWRYID0gZ3JpZFg7XG4gICAgICAgIHRoaXMuZ3JpZFkgPSBncmlkWTtcbiAgICAgICAgdGhpcy50aWxlID0gdGlsZTtcbiAgICAgICAgdGhpcy5oZXhhZ29uUmVuZGVyZXIgPSBuZXcgSGV4YWdvblJlbmRlcmVyKGdyaWRYLCBncmlkWSk7XG4gICAgICAgIHRoaXMuaGV4YWdvblJlbmRlcmVyLnNldEZpbGwoXCJibGFja1wiKTtcbiAgICB9XG4gICAgUGxheWVkVGlsZVJlbmRlcmVyLnByb3RvdHlwZS5zZXRGaWxsID0gZnVuY3Rpb24gKGZpbGwpIHtcbiAgICAgICAgdGhpcy5oZXhhZ29uUmVuZGVyZXIuc2V0RmlsbChmaWxsKTtcbiAgICB9O1xuICAgIFBsYXllZFRpbGVSZW5kZXJlci5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uIChjdHgpIHtcbiAgICAgICAgdGhpcy5oZXhhZ29uUmVuZGVyZXIuZHJhdyhjdHgpO1xuICAgICAgICB2YXIgX2EgPSB0aGlzLmhleGFnb25SZW5kZXJlci5nZXRNaWRwb2ludCgpLCB4ID0gX2FbMF0sIHkgPSBfYVsxXTtcbiAgICAgICAgdmFyIGRvdFJhZGl1cyA9IGhleFJhZGl1cyAqIDAuMTtcbiAgICAgICAgdGhpcy50aWxlLnNpZGVzLmZvckVhY2goZnVuY3Rpb24gKHNpZGUsIGlkeCkge1xuICAgICAgICAgICAgaWYgKHNpZGUgIT09IDEpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgdmFyIGFuZ2xlVG9Qb2ludCA9IGRlZzYwICogaWR4IC0gZGVnNjAgKiAyO1xuICAgICAgICAgICAgdmFyIHhPZmZzZXQgPSAwLjcgKiBoZXhSYWRpdXMgKiBNYXRoLmNvcyhhbmdsZVRvUG9pbnQpO1xuICAgICAgICAgICAgdmFyIHlPZmZzZXQgPSAwLjcgKiBoZXhSYWRpdXMgKiBNYXRoLnNpbihhbmdsZVRvUG9pbnQpO1xuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgY3R4LmVsbGlwc2UoeCArIHhPZmZzZXQsIHkgKyB5T2Zmc2V0LCBkb3RSYWRpdXMsIGRvdFJhZGl1cywgMCwgMCwgMiAqIE1hdGguUEkpO1xuICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwid2hpdGVcIjtcbiAgICAgICAgICAgIGN0eC5maWxsKCk7XG4gICAgICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgUGxheWVkVGlsZVJlbmRlcmVyLnByb3RvdHlwZS5pc1dpdGhpbkJvdW5kcyA9IGZ1bmN0aW9uIChwb2ludCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oZXhhZ29uUmVuZGVyZXIuaXNXaXRoaW5Cb3VuZHMocG9pbnQpO1xuICAgIH07XG4gICAgcmV0dXJuIFBsYXllZFRpbGVSZW5kZXJlcjtcbn0oKSk7XG52YXIgVW5wbGF5ZWRUaWxlUmVuZGVyZXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gVW5wbGF5ZWRUaWxlUmVuZGVyZXIodGlsZUlkeCwgbGFzdFJvdywgdGlsZSkge1xuICAgICAgICB0aGlzLnRpbGVJZHggPSB0aWxlSWR4O1xuICAgICAgICB0aGlzLmxhc3RSb3cgPSBsYXN0Um93O1xuICAgICAgICB0aGlzLnRpbGUgPSB0aWxlO1xuICAgICAgICB0aGlzLmhleGFnb25SZW5kZXJlciA9IG5ldyBIZXhhZ29uUmVuZGVyZXIodGlsZUlkeCwgbGFzdFJvdyk7XG4gICAgICAgIHRoaXMuaGV4YWdvblJlbmRlcmVyLnNldEZpbGwoXCJibGFja1wiKTtcbiAgICB9XG4gICAgVW5wbGF5ZWRUaWxlUmVuZGVyZXIucHJvdG90eXBlLnNldEZpbGwgPSBmdW5jdGlvbiAoZmlsbCkge1xuICAgICAgICB0aGlzLmhleGFnb25SZW5kZXJlci5zZXRGaWxsKGZpbGwpO1xuICAgIH07XG4gICAgVW5wbGF5ZWRUaWxlUmVuZGVyZXIucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbiAoY3R4KSB7XG4gICAgICAgIHRoaXMuaGV4YWdvblJlbmRlcmVyLmRyYXcoY3R4KTtcbiAgICAgICAgdmFyIF9hID0gdGhpcy5oZXhhZ29uUmVuZGVyZXIuZ2V0TWlkcG9pbnQoKSwgeCA9IF9hWzBdLCB5ID0gX2FbMV07XG4gICAgICAgIHZhciBkb3RSYWRpdXMgPSBoZXhSYWRpdXMgKiAwLjE7XG4gICAgICAgIHRoaXMudGlsZS5zaWRlcy5mb3JFYWNoKGZ1bmN0aW9uIChzaWRlLCBpZHgpIHtcbiAgICAgICAgICAgIGlmIChzaWRlICE9PSAxKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIHZhciBhbmdsZVRvUG9pbnQgPSBkZWc2MCAqIGlkeCAtIGRlZzYwICogMjtcbiAgICAgICAgICAgIHZhciB4T2Zmc2V0ID0gMC43ICogaGV4UmFkaXVzICogTWF0aC5jb3MoYW5nbGVUb1BvaW50KTtcbiAgICAgICAgICAgIHZhciB5T2Zmc2V0ID0gMC43ICogaGV4UmFkaXVzICogTWF0aC5zaW4oYW5nbGVUb1BvaW50KTtcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGN0eC5lbGxpcHNlKHggKyB4T2Zmc2V0LCB5ICsgeU9mZnNldCwgZG90UmFkaXVzLCBkb3RSYWRpdXMsIDAsIDAsIDIgKiBNYXRoLlBJKTtcbiAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBcIndoaXRlXCI7XG4gICAgICAgICAgICBjdHguZmlsbCgpO1xuICAgICAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFVucGxheWVkVGlsZVJlbmRlcmVyLnByb3RvdHlwZS5pc1dpdGhpbkJvdW5kcyA9IGZ1bmN0aW9uIChwb2ludCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oZXhhZ29uUmVuZGVyZXIuaXNXaXRoaW5Cb3VuZHMocG9pbnQpO1xuICAgIH07XG4gICAgcmV0dXJuIFVucGxheWVkVGlsZVJlbmRlcmVyO1xufSgpKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5UaWxlID0gdm9pZCAwO1xudmFyIFRpbGUgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gVGlsZSh2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUgPiA2MylcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRpbGUgdmFsdWUgXCIuY29uY2F0KHZhbHVlLCBcIiB0b28gaGlnaCFcIikpO1xuICAgICAgICBpZiAodmFsdWUgPCAwKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGlsZSB2YWx1ZSBcIi5jb25jYXQodmFsdWUsIFwiIHRvbyBsb3chXCIpKTtcbiAgICAgICAgdmFyIHBhZGRlZFZhbHVlID0gdmFsdWUgKyA2NDtcbiAgICAgICAgdGhpcy5fc2lkZXMgPSBwYWRkZWRWYWx1ZVxuICAgICAgICAgICAgLnRvU3RyaW5nKDIpXG4gICAgICAgICAgICAuc3BsaXQoXCJcIilcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKGRpZ2l0KSB7IHJldHVybiBwYXJzZUludChkaWdpdCwgMTApOyB9KVxuICAgICAgICAgICAgLnNsaWNlKDEpXG4gICAgICAgICAgICAucmV2ZXJzZSgpO1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVGlsZS5wcm90b3R5cGUsIFwic2lkZXNcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zaWRlcztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIFRpbGUucHJvdG90eXBlLmdldEZhY2VWYWx1ZSA9IGZ1bmN0aW9uIChmYWNlSW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2lkZXNbZmFjZUluZGV4XTtcbiAgICB9O1xuICAgIFRpbGUucHJvdG90eXBlLmdldE9wcG9zaW5nRmFjZVZhbHVlVG8gPSBmdW5jdGlvbiAoZmFjZUluZGV4KSB7XG4gICAgICAgIHZhciBvcHBvc2luZ0ZhY2VJbmRleCA9IChmYWNlSW5kZXggKyAzKSAlIDY7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEZhY2VWYWx1ZShvcHBvc2luZ0ZhY2VJbmRleCk7XG4gICAgfTtcbiAgICBUaWxlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHMgPSB0aGlzLl9zaWRlcztcbiAgICAgICAgcmV0dXJuIFwiXFxuICAgICAgICAgICAgIC9cIi5jb25jYXQoc1swXSwgXCIgIFwiKS5jb25jYXQoc1sxXSwgXCJcXFxcXFxuICAgICAgICAgICAgfFwiKS5jb25jYXQoc1s1XSwgXCIgICAgXCIpLmNvbmNhdChzWzJdLCBcInxcXG4gICAgICAgICAgICAgXFxcXFwiKS5jb25jYXQoc1s0XSwgXCIgIFwiKS5jb25jYXQoc1szXSwgXCIvXFxuICAgICAgICBcIik7XG4gICAgfTtcbiAgICBUaWxlLnByb3RvdHlwZS5yb3RhdGVDbG9ja3dpc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBsYXN0ID0gdGhpcy5fc2lkZXMucG9wKCk7XG4gICAgICAgIHRoaXMuX3NpZGVzLnVuc2hpZnQobGFzdCk7XG4gICAgfTtcbiAgICBUaWxlLnByb3RvdHlwZS5yb3RhdGVDb3VudGVyQ2xvY2t3aXNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbGFzdCA9IHRoaXMuX3NpZGVzLnNoaWZ0KCk7XG4gICAgICAgIHRoaXMuX3NpZGVzLnB1c2gobGFzdCk7XG4gICAgfTtcbiAgICByZXR1cm4gVGlsZTtcbn0oKSk7XG5leHBvcnRzLlRpbGUgPSBUaWxlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmlzVW5kZWZpbmVkID0gZXhwb3J0cy5tYXRyaXggPSB2b2lkIDA7XG5mdW5jdGlvbiBtYXRyaXgobSwgbiwgZGVmYXVsdFZhbHVlKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20oe1xuICAgICAgICAvLyBnZW5lcmF0ZSBhcnJheSBvZiBsZW5ndGggbVxuICAgICAgICBsZW5ndGg6IG1cbiAgICAgICAgLy8gaW5zaWRlIG1hcCBmdW5jdGlvbiBnZW5lcmF0ZSBhcnJheSBvZiBzaXplIG5cbiAgICAgICAgLy8gYW5kIGZpbGwgaXQgd2l0aCBgMGBcbiAgICB9LCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgQXJyYXkobikuZmlsbChkZWZhdWx0VmFsdWUpOyB9KTtcbn1cbmV4cG9ydHMubWF0cml4ID0gbWF0cml4O1xuO1xuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBhcmcgPT09IFwidW5kZWZpbmVkXCI7XG59XG5leHBvcnRzLmlzVW5kZWZpbmVkID0gaXNVbmRlZmluZWQ7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgZ2FtZV8xID0gcmVxdWlyZShcIi4vZ2FtZVwiKTtcbnZhciByZW5kZXJlcl8xID0gcmVxdWlyZShcIi4vcmVuZGVyZXJcIik7XG52YXIgcmVuZGVyZXIgPSBuZXcgcmVuZGVyZXJfMS5SZW5kZXJlcigpO1xudmFyIHAxID0gbmV3IGdhbWVfMS5QbGF5ZXIoXCJQbGF5ZXIgMVwiKTtcbnZhciBwMiA9IG5ldyBnYW1lXzEuUGxheWVyKFwiUGxheWVyIDJcIik7XG52YXIgZ2FtZSA9IG5ldyBnYW1lXzEuR2FtZShbcDEsIHAyXSk7XG5nYW1lLnNldHVwQm9hcmQoKTtcbmdhbWUuYWRkQm9hcmRNb2RpZmllcnMoKTtcbnZhciBtYWluID0gZnVuY3Rpb24gKCkge1xuICAgIHJlbmRlcmVyLnJlbmRlcihnYW1lKTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobWFpbik7XG59O1xuYWxlcnQoXCJUaGUgYWltIG9mIHRoZSBnYW1lIGlzIHRvIHNjb3JlIHRoZSBtb3N0IHBvaW50cy4gXFxuWW91IGdhaW4gYSBwb2ludCBmb3IgZXZlcnkgZWRnZSB0aGF0IG1hdGNoZXMgaXRzIG5laWdoYm91cnMsIGFuZCBsb3NlIGEgcG9pbnQgZm9yIGV2ZXJ5IGVkZ2UgdGhhdCBkb2VzIG5vdC5cXG5Zb3UgaGF2ZSB0byBwbGF5IHRpbGVzIHVwIGFnYWluc3QgYXQgbGVhc3Qgb25lIG90aGVyIHRpbGUuXFxuWW91IGFsd2F5cyBoYXZlIDQgdGlsZXMsIGFuZCBnZXQgYSBuZXcgb25lIGV2ZXJ5IHRpbWUgeW91IHB1dCBvbmUgZG93bi5cXG5UaGUgZ2FtZSBlbmRzIHdoZW4gdGhlcmUgYXJlIG5vIHNwYWNlcyBsZWZ0IHRvIHBsYXkuXFxuVGhlIGN1cnJlbnQgc2NvcmUgaXMgaW4gdGhlIHRvcCByaWdodCwgYW5kIHRoZSBjdXJyZW50IHBsYXllciBpcyBzaG93biBpbiByZWQuXFxuQ2xpY2sgYSB0aWxlIGluIHRoZSByb3cgYXQgdGhlIGJvdHRvbSB0byBzZWxlY3QgaXQuIFVzZSBRIGFuZCBFIHRvIHJvdGF0ZSB0aGUgdGlsZSwgdGhlbiBjbGljayBvbiB0aGUgZ3JpZCB0byBwbGFjZSB0aGUgdGlsZS5cXG5Hb29kIGx1Y2shXFxuXCIpO1xubWFpbigpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9