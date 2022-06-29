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
            .map(function (cell, i) { return Cell.Empty(i % 8, Math.floor(i / 8)); })
            .map(function (cell) {
            if (cell.x === 3 && cell.y === 1)
                cell.setOptions(triplePoints);
            if (cell.x === 4 && cell.y === 6)
                cell.setOptions(triplePoints);
            if (cell.x === 2 && cell.y === 4)
                cell.setOptions(doublePoints);
            if (cell.x === 5 && cell.y === 3)
                cell.setOptions(doublePoints);
            return cell;
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
var main = function () {
    renderer.render(game);
    requestAnimationFrame(main);
};
alert("The aim of the game is to score the most points. \nYou gain a point for every edge that matches its neighbours, and lose a point for every edge that does not.\nYou have to play tiles up against at least one other tile.\nYou always have 4 tiles, and get a new one every time you put one down.\nThe game ends when there are no spaces left to play.\nThe current score is in the top right, and the current player is shown in red.\nClick a tile in the row at the bottom to select it. Use Q and E to rotate the tile, then click on the grid to place the tile.\nGood luck!\n");
main();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELFlBQVk7Ozs7Ozs7Ozs7O0FDN0NDO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELG1CQUFtQixHQUFHLGNBQWM7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSyxnQkFBZ0IseUNBQXlDO0FBQzlEO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1COzs7Ozs7O1VDaEJuQjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7Ozs7Ozs7O0FDdEJhO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGFBQWEsbUJBQU8sQ0FBQyw2QkFBUTtBQUM3QixpQkFBaUIsbUJBQU8sQ0FBQyxxQ0FBWTtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbmVvZG9taW5vLy4vc3JjL2dhbWUudHMiLCJ3ZWJwYWNrOi8vbmVvZG9taW5vLy4vc3JjL3JlbmRlcmVyLnRzIiwid2VicGFjazovL25lb2RvbWluby8uL3NyYy90aWxlLnRzIiwid2VicGFjazovL25lb2RvbWluby8uL3NyYy91dGlscy50cyIsIndlYnBhY2s6Ly9uZW9kb21pbm8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbmVvZG9taW5vLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5HYW1lID0gZXhwb3J0cy5DZWxsID0gZXhwb3J0cy5QbGF5ZXIgPSB2b2lkIDA7XG52YXIgdGlsZV8xID0gcmVxdWlyZShcIi4vdGlsZVwiKTtcbnZhciB1dGlsc18xID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XG52YXIgUGxheWVyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFBsYXllcihuYW1lKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuX3RpbGVzID0gW107XG4gICAgICAgIHRoaXMuX3BvaW50cyA9IDA7XG4gICAgfVxuICAgIFBsYXllci5wcm90b3R5cGUuZ2l2ZVRpbGUgPSBmdW5jdGlvbiAodGlsZSkge1xuICAgICAgICB0aGlzLl90aWxlcy5wdXNoKHRpbGUpO1xuICAgIH07XG4gICAgUGxheWVyLnByb3RvdHlwZS50YWtlVGlsZSA9IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICB2YXIgZXJyID0gbmV3IEVycm9yKFwiTm8gdGlsZSBpbiB0aGF0IHBvc2l0aW9uIVwiKTtcbiAgICAgICAgaWYgKGluZGV4ID49IHRoaXMuX3RpbGVzLmxlbmd0aClcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgaWYgKGluZGV4IDwgMClcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgdmFyIHRpbGUgPSB0aGlzLl90aWxlcy5zcGxpY2UoaW5kZXgsIDEpWzBdO1xuICAgICAgICBpZiAoIXRpbGUpXG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIHJldHVybiB0aWxlO1xuICAgIH07XG4gICAgUGxheWVyLnByb3RvdHlwZS5hd2FyZFBvaW50cyA9IGZ1bmN0aW9uIChwb2ludHMpIHtcbiAgICAgICAgdGhpcy5fcG9pbnRzICs9IHBvaW50cztcbiAgICB9O1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQbGF5ZXIucHJvdG90eXBlLCBcInRpbGVzXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGlsZXMuc2xpY2UoKTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQbGF5ZXIucHJvdG90eXBlLCBcInBvaW50c1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BvaW50cztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIFBsYXllci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBcIlwiLmNvbmNhdCh0aGlzLm5hbWUsIFwiOiBcIikuY29uY2F0KHRoaXMucG9pbnRzLCBcIiBwb2ludHNcIik7XG4gICAgfTtcbiAgICByZXR1cm4gUGxheWVyO1xufSgpKTtcbmV4cG9ydHMuUGxheWVyID0gUGxheWVyO1xudmFyIG5vcm1hbENlbGwgPSB7XG4gICAgY29sb3I6IFwidHJhbnNwYXJlbnRcIixcbiAgICB0ZXh0OiBcIlwiLFxuICAgIHBvaW50c011bHRpcGxpZXI6IDEsXG59O1xudmFyIGRvdWJsZVBvaW50cyA9IHtcbiAgICBjb2xvcjogXCJsaWdodGJsdWVcIixcbiAgICB0ZXh0OiBcIkRvdWJsZSBQb2ludHNcIixcbiAgICBwb2ludHNNdWx0aXBsaWVyOiAyLFxufTtcbnZhciB0cmlwbGVQb2ludHMgPSB7XG4gICAgY29sb3I6IFwiZ29sZFwiLFxuICAgIHRleHQ6IFwiVHJpcGxlIFBvaW50c1wiLFxuICAgIHBvaW50c011bHRpcGxpZXI6IDMsXG59O1xudmFyIENlbGwgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ2VsbCh4LCB5LCBfY29udGVudHMsIF9vcHRpb25zKSB7XG4gICAgICAgIGlmIChfb3B0aW9ucyA9PT0gdm9pZCAwKSB7IF9vcHRpb25zID0gbm9ybWFsQ2VsbDsgfVxuICAgICAgICB0aGlzLnggPSB4O1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgICAgICB0aGlzLl9jb250ZW50cyA9IF9jb250ZW50cztcbiAgICAgICAgdGhpcy5fb3B0aW9ucyA9IF9vcHRpb25zO1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQ2VsbC5wcm90b3R5cGUsIFwiY29udGVudHNcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250ZW50cztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDZWxsLnByb3RvdHlwZSwgXCJvcHRpb25zXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb3B0aW9ucztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIENlbGwucHJvdG90eXBlLnNldE9wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICB0aGlzLl9vcHRpb25zID0gb3B0aW9ucztcbiAgICB9O1xuICAgIENlbGwucHJvdG90eXBlLnNldENvbnRlbnRzID0gZnVuY3Rpb24gKGNvbnRlbnRzKSB7XG4gICAgICAgIHRoaXMuX2NvbnRlbnRzID0gY29udGVudHM7XG4gICAgfTtcbiAgICBDZWxsLnByb3RvdHlwZS5pc09jY3VwaWVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLmNvbnRlbnRzO1xuICAgIH07XG4gICAgQ2VsbC5FbXB0eSA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgICAgIHJldHVybiBuZXcgQ2VsbCh4LCB5LCB1bmRlZmluZWQpO1xuICAgIH07XG4gICAgcmV0dXJuIENlbGw7XG59KCkpO1xuZXhwb3J0cy5DZWxsID0gQ2VsbDtcbnZhciBHYW1lID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEdhbWUocGxheWVycykge1xuICAgICAgICB0aGlzLmN1cnJlbnRQbGF5ZXJJbmRleCA9IDA7XG4gICAgICAgIGlmIChwbGF5ZXJzLmxlbmd0aCA8IDIpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNaW5pbXVtIDIgcGxheWVycyFcIik7XG4gICAgICAgIGlmIChwbGF5ZXJzLmxlbmd0aCA+IDQpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNYXhpbXVtIDQgcGxheWVycyFcIik7XG4gICAgICAgIHRoaXMuX2JvYXJkID0gdGhpcy5jcmVhdGVCb2FyZCgpO1xuICAgICAgICB0aGlzLmRyYXdQaWxlID0gbmV3IEFycmF5KDY0KVxuICAgICAgICAgICAgLmZpbGwoMClcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKHZhbCwgaSkgeyByZXR1cm4gaTsgfSlcbiAgICAgICAgICAgIC8vIC5zbGljZSgxKSAvLyByZW1vdmUgMCB2YWx1ZSB0aWxlIHRvIHB1dCBpbiBtaWRkbGUgb2YgYm9hcmRcbiAgICAgICAgICAgIC5zb3J0KGZ1bmN0aW9uICgpIHsgcmV0dXJuIE1hdGgucmFuZG9tKCkgLSAwLjU7IH0pIC8vIHNodWZmbGVcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKHZhbCkgeyByZXR1cm4gbmV3IHRpbGVfMS5UaWxlKHZhbCk7IH0pO1xuICAgICAgICB0aGlzLnBsYXllcnMgPSBwbGF5ZXJzO1xuICAgICAgICB0aGlzLmRpc3RyaWJ1dGVUaWxlcyg0KTtcbiAgICB9XG4gICAgR2FtZS5wcm90b3R5cGUuY3JlYXRlQm9hcmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgQXJyYXkoNjQpXG4gICAgICAgICAgICAuZmlsbCgwKVxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbiAoY2VsbCwgaSkgeyByZXR1cm4gQ2VsbC5FbXB0eShpICUgOCwgTWF0aC5mbG9vcihpIC8gOCkpOyB9KVxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbiAoY2VsbCkge1xuICAgICAgICAgICAgaWYgKGNlbGwueCA9PT0gMyAmJiBjZWxsLnkgPT09IDEpXG4gICAgICAgICAgICAgICAgY2VsbC5zZXRPcHRpb25zKHRyaXBsZVBvaW50cyk7XG4gICAgICAgICAgICBpZiAoY2VsbC54ID09PSA0ICYmIGNlbGwueSA9PT0gNilcbiAgICAgICAgICAgICAgICBjZWxsLnNldE9wdGlvbnModHJpcGxlUG9pbnRzKTtcbiAgICAgICAgICAgIGlmIChjZWxsLnggPT09IDIgJiYgY2VsbC55ID09PSA0KVxuICAgICAgICAgICAgICAgIGNlbGwuc2V0T3B0aW9ucyhkb3VibGVQb2ludHMpO1xuICAgICAgICAgICAgaWYgKGNlbGwueCA9PT0gNSAmJiBjZWxsLnkgPT09IDMpXG4gICAgICAgICAgICAgICAgY2VsbC5zZXRPcHRpb25zKGRvdWJsZVBvaW50cyk7XG4gICAgICAgICAgICByZXR1cm4gY2VsbDtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBHYW1lLnByb3RvdHlwZS5zZXR1cEJvYXJkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnNldHVwQm9hcmRQZXJpbWV0ZXIoKTtcbiAgICAgICAgdGhpcy5zZXR1cEJvYXJkQ2VudHJlKCk7XG4gICAgfTtcbiAgICBHYW1lLnByb3RvdHlwZS5zZXR1cEJvYXJkQ2VudHJlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnNldFRpbGVBdCh0aGlzLmRyYXdQaWxlLnBvcCgpLCAyLCAyKTtcbiAgICAgICAgdGhpcy5zZXRUaWxlQXQodGhpcy5kcmF3UGlsZS5wb3AoKSwgNSwgMik7XG4gICAgICAgIHRoaXMuc2V0VGlsZUF0KHRoaXMuZHJhd1BpbGUucG9wKCksIDIsIDUpO1xuICAgICAgICB0aGlzLnNldFRpbGVBdCh0aGlzLmRyYXdQaWxlLnBvcCgpLCA1LCA1KTtcbiAgICAgICAgdGhpcy5zZXRUaWxlQXQodGhpcy5kcmF3UGlsZS5wb3AoKSwgMywgMyk7XG4gICAgICAgIHRoaXMuc2V0VGlsZUF0KHRoaXMuZHJhd1BpbGUucG9wKCksIDQsIDQpO1xuICAgIH07XG4gICAgR2FtZS5wcm90b3R5cGUuc2V0dXBCb2FyZFBlcmltZXRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGdyaWRXaWR0aCA9IDg7XG4gICAgICAgIHZhciBmYXJSb3dJZHggPSBncmlkV2lkdGggLSAxO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGdyaWRXaWR0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLnNldFRpbGVBdCh0aGlzLmRyYXdQaWxlLnBvcCgpLCBpLCAwKTtcbiAgICAgICAgICAgIHRoaXMuc2V0VGlsZUF0KHRoaXMuZHJhd1BpbGUucG9wKCksIGksIGZhclJvd0lkeCk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBncmlkV2lkdGggLSAxOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuc2V0VGlsZUF0KHRoaXMuZHJhd1BpbGUucG9wKCksIDAsIGkpO1xuICAgICAgICAgICAgdGhpcy5zZXRUaWxlQXQodGhpcy5kcmF3UGlsZS5wb3AoKSwgZmFyUm93SWR4LCBpKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEdhbWUucHJvdG90eXBlLCBcInRpbGVzUmVtYWluaW5nXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kcmF3UGlsZS5sZW5ndGg7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoR2FtZS5wcm90b3R5cGUsIFwiYm9hcmRcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ib2FyZC5zbGljZSgpO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgR2FtZS5wcm90b3R5cGUuZGlzdHJpYnV0ZVRpbGVzID0gZnVuY3Rpb24gKGNvdW50KSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMucGxheWVycy5mb3JFYWNoKGZ1bmN0aW9uIChwbGF5ZXIpIHtcbiAgICAgICAgICAgIHdoaWxlIChwbGF5ZXIudGlsZXMubGVuZ3RoIDwgY291bnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGlsZSA9IF90aGlzLmRyYXdQaWxlLnBvcCgpO1xuICAgICAgICAgICAgICAgIGlmICghdGlsZSlcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiT3V0IG9mIHRpbGVzIVwiKTtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuZ2l2ZVRpbGUodGlsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgR2FtZS5wcm90b3R5cGUucGxhY2VUaWxlID0gZnVuY3Rpb24gKHBsYXllciwgdGlsZUlkeCwgeCwgeSkge1xuICAgICAgICBpZiAoIXRoaXMuaXNWYWxpZFBvc2l0aW9uKHgsIHkpKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUG9zaXRpb24gb3V0IG9mIGJvdW5kcyFcIik7XG4gICAgICAgIHZhciBleGlzdGluZ1RpbGUgPSB0aGlzLmdldFRpbGVBdCh4LCB5KTtcbiAgICAgICAgaWYgKGV4aXN0aW5nVGlsZSlcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwYWNlIGFscmVhZHkgb2NjdXBpZWQhXCIpO1xuICAgICAgICBpZiAodGhpcy5uZWlnaGJvdXJDb3VudCh4LCB5KSA9PT0gMClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgcGxhY2UgYSB0aWxlIGFnYWluc3QgYW5vdGhlciBvbmVcIik7XG4gICAgICAgIGlmIChwbGF5ZXIgIT09IHRoaXMuY3VycmVudFBsYXllcilcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBcIi5jb25jYXQocGxheWVyLm5hbWUsIFwiJ3MgdHVybiFcIikpO1xuICAgICAgICB2YXIgdGlsZSA9IHBsYXllci50YWtlVGlsZSh0aWxlSWR4KTtcbiAgICAgICAgdGhpcy5zZXRUaWxlQXQodGlsZSwgeCwgeSk7XG4gICAgICAgIHZhciBwb2ludHMgPSB0aGlzLmNhbGN1bGF0ZVBvaW50c0ZvclRpbGUoeCwgeSk7XG4gICAgICAgIHRoaXMuY3VycmVudFBsYXllci5hd2FyZFBvaW50cyhwb2ludHMpO1xuICAgICAgICB2YXIgZHJhd25UaWxlID0gdGhpcy5kcmF3UGlsZS5wb3AoKTtcbiAgICAgICAgaWYgKGRyYXduVGlsZSlcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBsYXllci5naXZlVGlsZShkcmF3blRpbGUpO1xuICAgICAgICB2YXIgZXZlcnlvbmVJc091dE9mVGlsZXMgPSB0aGlzLnBsYXllcnMuZXZlcnkoZnVuY3Rpb24gKHBsYXllcikgeyByZXR1cm4gcGxheWVyLnRpbGVzLmxlbmd0aCA9PT0gMDsgfSk7XG4gICAgICAgIHZhciBib2FyZElzRnVsbCA9IHRoaXMuYm9hcmQuZXZlcnkoZnVuY3Rpb24gKGNlbGwpIHsgcmV0dXJuIGNlbGwuaXNPY2N1cGllZCgpOyB9KTtcbiAgICAgICAgaWYgKGJvYXJkSXNGdWxsIHx8IGV2ZXJ5b25lSXNPdXRPZlRpbGVzKSB7XG4gICAgICAgICAgICBhbGVydChcIkdhbWUgb3ZlciwgZmluYWwgcG9pbnRzOiBcIi5jb25jYXQodGhpcy5wbGF5ZXJzLm1hcChmdW5jdGlvbiAocGxheWVyKSB7IHJldHVybiBwbGF5ZXIudG9TdHJpbmcoKTsgfSkuam9pbihcIiwgXCIpKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdXJyZW50UGxheWVySW5kZXggKz0gMTtcbiAgICAgICAgdGhpcy5jdXJyZW50UGxheWVySW5kZXggPSB0aGlzLmN1cnJlbnRQbGF5ZXJJbmRleCAlIHRoaXMucGxheWVycy5sZW5ndGg7XG4gICAgfTtcbiAgICBHYW1lLnByb3RvdHlwZS5jYWxjdWxhdGVQb2ludHNGb3JUaWxlID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgdmFyIGNlbGwgPSB0aGlzLmdldENlbGxBdCh4LCB5KTtcbiAgICAgICAgdmFyIHRpbGUgPSBjZWxsID09PSBudWxsIHx8IGNlbGwgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGNlbGwuY29udGVudHM7XG4gICAgICAgIGlmICghdGlsZSlcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIHRpbGUgdG8gY2FsY3VsYXRlIVwiKTtcbiAgICAgICAgdmFyIG5laWdoYm91clZhbHVlcyA9IHRoaXMuZ2V0TmVpZ2hib3VyaW5nVmFsdWVzVG8oeCwgeSk7XG4gICAgICAgIHJldHVybiB0aWxlLnNpZGVzLnJlZHVjZShmdW5jdGlvbiAocG9pbnRzLCBzaWRlVmFsdWUsIHNpZGVJbmRleCkge1xuICAgICAgICAgICAgdmFyIG5laWdoYm91cmluZ1NpZGVWYWx1ZSA9IG5laWdoYm91clZhbHVlc1tzaWRlSW5kZXhdO1xuICAgICAgICAgICAgaWYgKG5laWdoYm91cmluZ1NpZGVWYWx1ZSA9PT0gc2lkZVZhbHVlKVxuICAgICAgICAgICAgICAgIHJldHVybiBwb2ludHMgKyAxO1xuICAgICAgICAgICAgaWYgKCEoMCwgdXRpbHNfMS5pc1VuZGVmaW5lZCkobmVpZ2hib3VyaW5nU2lkZVZhbHVlKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gcG9pbnRzIC0gMTtcbiAgICAgICAgICAgIHJldHVybiBwb2ludHM7XG4gICAgICAgIH0sIDApICogY2VsbC5vcHRpb25zLnBvaW50c011bHRpcGxpZXI7XG4gICAgfTtcbiAgICBHYW1lLnByb3RvdHlwZS5nZXROZWlnaGJvdXJpbmdWYWx1ZXNUbyA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgICAgIHZhciB0aWxlcyA9IHRoaXMuZ2V0TmVpZ2hib3VyaW5nVGlsZXNUbyh4LCB5KTtcbiAgICAgICAgcmV0dXJuIHRpbGVzLm1hcChmdW5jdGlvbiAodGlsZSwgZmFjZUluZGV4KSB7XG4gICAgICAgICAgICByZXR1cm4gdGlsZSA9PT0gbnVsbCB8fCB0aWxlID09PSB2b2lkIDAgPyB2b2lkIDAgOiB0aWxlLmdldE9wcG9zaW5nRmFjZVZhbHVlVG8oZmFjZUluZGV4KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBHYW1lLnByb3RvdHlwZS5uZWlnaGJvdXJDb3VudCA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldE5laWdoYm91cmluZ1RpbGVzVG8oeCwgeSlcbiAgICAgICAgICAgIC5yZWR1Y2UoZnVuY3Rpb24gKGNvdW50LCB0aWxlKSB7XG4gICAgICAgICAgICBpZiAodGlsZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gY291bnQgKyAxO1xuICAgICAgICAgICAgcmV0dXJuIGNvdW50O1xuICAgICAgICB9LCAwKTtcbiAgICB9O1xuICAgIEdhbWUucHJvdG90eXBlLmdldE5laWdoYm91cmluZ1RpbGVzVG8gPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICB2YXIgaXNFdmVuUm93ID0geSAlIDIgPT09IDA7XG4gICAgICAgIHZhciByb3dPZmZzZXQgPSBpc0V2ZW5Sb3cgPyAtMSA6IDA7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICB0aGlzLmdldFRpbGVBdCh4ICsgcm93T2Zmc2V0LCB5IC0gMSksXG4gICAgICAgICAgICB0aGlzLmdldFRpbGVBdCh4ICsgMSArIHJvd09mZnNldCwgeSAtIDEpLFxuICAgICAgICAgICAgdGhpcy5nZXRUaWxlQXQoeCArIDEsIHkpLFxuICAgICAgICAgICAgdGhpcy5nZXRUaWxlQXQoeCArIDEgKyByb3dPZmZzZXQsIHkgKyAxKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0VGlsZUF0KHggKyByb3dPZmZzZXQsIHkgKyAxKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0VGlsZUF0KHggLSAxLCB5KSAvLyBsZWZ0XG4gICAgICAgIF07XG4gICAgfTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoR2FtZS5wcm90b3R5cGUsIFwiY3VycmVudFBsYXllclwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGxheWVyc1t0aGlzLmN1cnJlbnRQbGF5ZXJJbmRleF07XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBHYW1lLnByb3RvdHlwZS5nZXRUaWxlQXQgPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiAoX2EgPSB0aGlzLmdldENlbGxBdCh4LCB5KSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNvbnRlbnRzO1xuICAgIH07XG4gICAgR2FtZS5wcm90b3R5cGUuc2V0VGlsZUF0ID0gZnVuY3Rpb24gKHRpbGUsIHgsIHkpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICAoX2EgPSB0aGlzLmdldENlbGxBdCh4LCB5KSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnNldENvbnRlbnRzKHRpbGUpO1xuICAgIH07XG4gICAgR2FtZS5wcm90b3R5cGUuZ2V0Q2VsbEF0ID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2JvYXJkLmZpbmQoZnVuY3Rpb24gKGNlbGwpIHsgcmV0dXJuIGNlbGwueCA9PT0geCAmJiBjZWxsLnkgPT09IHk7IH0pO1xuICAgIH07XG4gICAgR2FtZS5wcm90b3R5cGUuaXNWYWxpZFBvc2l0aW9uID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5nZXRDZWxsQXQoeCwgeSk7XG4gICAgfTtcbiAgICByZXR1cm4gR2FtZTtcbn0oKSk7XG5leHBvcnRzLkdhbWUgPSBHYW1lO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlJlbmRlcmVyID0gdm9pZCAwO1xudmFyIHV0aWxzXzEgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbnZhciBkZWc2MCA9IE1hdGguUEkgLyAzO1xudmFyIGRlZzMwID0gTWF0aC5QSSAvIDY7XG52YXIgaGV4UmFkaXVzID0gNDA7XG52YXIgUmVuZGVyZXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gUmVuZGVyZXIoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4nKTtcbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICB0aGlzLm1vdXNlUG9zaXRpb24gPSB7IHg6IDAsIHk6IDAgfTtcbiAgICAgICAgd2luZG93Lm9ua2V5ZG93biA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICAgICAgaWYgKF90aGlzLmZvY3Vzc2VkVGlsZSAmJiBlLmtleSA9PT0gXCJxXCIgfHwgZS5rZXkgPT09IFwiUVwiKSB7XG4gICAgICAgICAgICAgICAgKF9hID0gX3RoaXMuZm9jdXNzZWRUaWxlKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Eucm90YXRlQ291bnRlckNsb2Nrd2lzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoX3RoaXMuZm9jdXNzZWRUaWxlICYmIGUua2V5ID09PSBcImVcIiB8fCBlLmtleSA9PT0gXCJFXCIpIHtcbiAgICAgICAgICAgICAgICAoX2IgPSBfdGhpcy5mb2N1c3NlZFRpbGUpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5yb3RhdGVDbG9ja3dpc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5jYW52YXMub25tb3VzZW1vdmUgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgdmFyIHJlY3QgPSBfdGhpcy5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICBfdGhpcy5tb3VzZVBvc2l0aW9uLnggPSBlLmNsaWVudFggLSByZWN0LmxlZnQ7XG4gICAgICAgICAgICBfdGhpcy5tb3VzZVBvc2l0aW9uLnkgPSBlLmNsaWVudFkgLSByZWN0LnRvcDtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5jYW52YXMub25jbGljayA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBpZiAoIV90aGlzLmdhbWUpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgdmFyIGVsZW1lbnRzID0gX3RoaXMuZ2V0RWxlbWVudHMoX3RoaXMuZ2FtZSk7XG4gICAgICAgICAgICB2YXIgcmVjdCA9IF90aGlzLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIF90aGlzLm1vdXNlUG9zaXRpb24ueCA9IGUuY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgICAgICAgICAgIF90aGlzLm1vdXNlUG9zaXRpb24ueSA9IGUuY2xpZW50WSAtIHJlY3QudG9wO1xuICAgICAgICAgICAgdmFyIGNsaWNrZWRFbGVtZW50ID0gZWxlbWVudHMuZmluZChmdW5jdGlvbiAoZWxlbWVudCkgeyByZXR1cm4gZWxlbWVudC5pc1dpdGhpbkJvdW5kcyhfdGhpcy5tb3VzZVBvc2l0aW9uKTsgfSk7XG4gICAgICAgICAgICBpZiAoY2xpY2tlZEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5oYW5kbGVDbGlja09uRWxlbWVudChjbGlja2VkRWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBfdGhpcy51bmZvY3VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIFJlbmRlcmVyLnByb3RvdHlwZS5zZXRTaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgfTtcbiAgICBSZW5kZXJlci5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKGdhbWUpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5zZXRTaXplKCk7XG4gICAgICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgdGhpcy5jdHguZm9udCA9IFwiMjRweCBBcmllbFwiO1xuICAgICAgICAvLyByZW5kZXIgcG9pbnRzXG4gICAgICAgIHRoaXMuY3R4LmZpbGxUZXh0KFwiUG9pbnRzXCIsIHRoaXMuY2FudmFzLndpZHRoIC0gMjAwLCAyMCk7XG4gICAgICAgIGdhbWUucGxheWVycy5mb3JFYWNoKGZ1bmN0aW9uIChwbGF5ZXIsIGkpIHtcbiAgICAgICAgICAgIHZhciB4ID0gX3RoaXMuY2FudmFzLndpZHRoIC0gMjAwO1xuICAgICAgICAgICAgdmFyIHkgPSA3MCArIDMwICogaTtcbiAgICAgICAgICAgIGlmIChwbGF5ZXIgPT09IGdhbWUuY3VycmVudFBsYXllcilcbiAgICAgICAgICAgICAgICBfdGhpcy5jdHguZmlsbFN0eWxlID0gXCJyZWRcIjtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBfdGhpcy5jdHguZmlsbFN0eWxlID0gXCJibGFja1wiO1xuICAgICAgICAgICAgX3RoaXMuY3R4LmZpbGxUZXh0KFwiXCIuY29uY2F0KHBsYXllci5uYW1lLCBcIjogXCIpLmNvbmNhdChwbGF5ZXIucG9pbnRzKSwgeCwgeSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XG4gICAgICAgIHRoaXMuY3R4LmZpbGxUZXh0KFwiVGlsZXMgcmVtYWluaW5nOiBcIi5jb25jYXQoZ2FtZS50aWxlc1JlbWFpbmluZyksIHRoaXMuY2FudmFzLndpZHRoIC0gNDUwLCAyMCk7XG4gICAgICAgIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gXCJzbGF0ZUdyZXlcIjtcbiAgICAgICAgdGhpcy5nZXRFbGVtZW50cyhnYW1lKS5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7IHJldHVybiBlbGVtZW50LmRyYXcoX3RoaXMuY3R4KTsgfSk7XG4gICAgfTtcbiAgICBSZW5kZXJlci5wcm90b3R5cGUuaGFuZGxlQ2xpY2tPbkVsZW1lbnQgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICBpZiAoIXRoaXMuZ2FtZSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdmFyIF9hID0gZWxlbWVudCwgdGlsZSA9IF9hLnRpbGUsIHRpbGVJZHggPSBfYS50aWxlSWR4O1xuICAgICAgICB2YXIgY2VsbCA9IGVsZW1lbnQuY2VsbDtcbiAgICAgICAgaWYgKHRpbGUgJiYgISgwLCB1dGlsc18xLmlzVW5kZWZpbmVkKSh0aWxlSWR4KSkge1xuICAgICAgICAgICAgLy8gY2xpY2tpbmcgb24gYW4gdW5wbGF5ZWQgdGlsZVxuICAgICAgICAgICAgdGhpcy5mb2N1c3NlZFRpbGUgPSB0aWxlO1xuICAgICAgICAgICAgdGhpcy5mb2N1c3NlZFRpbGVJZHggPSB0aWxlSWR4O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCEoMCwgdXRpbHNfMS5pc1VuZGVmaW5lZCkoY2VsbCkpIHtcbiAgICAgICAgICAgIC8vIGNsaWNraW5nIG9uIGEgaGV4YWdvblxuICAgICAgICAgICAgaWYgKHRoaXMuZm9jdXNzZWRUaWxlICYmICEoMCwgdXRpbHNfMS5pc1VuZGVmaW5lZCkodGhpcy5mb2N1c3NlZFRpbGVJZHgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnBsYWNlVGlsZSh0aGlzLmdhbWUuY3VycmVudFBsYXllciwgdGhpcy5mb2N1c3NlZFRpbGVJZHgsIGNlbGwueCwgY2VsbC55KTtcbiAgICAgICAgICAgICAgICB0aGlzLnVuZm9jdXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudW5mb2N1cygpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBSZW5kZXJlci5wcm90b3R5cGUudW5mb2N1cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5mb2N1c3NlZFRpbGUgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuZm9jdXNzZWRUaWxlSWR4ID0gdW5kZWZpbmVkO1xuICAgIH07XG4gICAgUmVuZGVyZXIucHJvdG90eXBlLmdldEVsZW1lbnRzID0gZnVuY3Rpb24gKGdhbWUpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIGdyaWQgPSBnYW1lLmJvYXJkO1xuICAgICAgICAvLyByZW5kZXIgYm9hcmRcbiAgICAgICAgdmFyIGVsZW1lbnRzID0gW107XG4gICAgICAgIGdhbWUuYm9hcmQuZm9yRWFjaChmdW5jdGlvbiAoY2VsbCkge1xuICAgICAgICAgICAgdmFyIGNvbnRlbnRzID0gY2VsbC5jb250ZW50cywgeCA9IGNlbGwueCwgeSA9IGNlbGwueTtcbiAgICAgICAgICAgIGlmIChjb250ZW50cykge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRzLnB1c2gobmV3IFBsYXllZFRpbGVSZW5kZXJlcih4LCB5LCBjb250ZW50cykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBuZXcgQ2VsbFJlbmRlcmVyKGNlbGwpO1xuICAgICAgICAgICAgICAgIHZhciBpc0hvdmVyaW5nID0gZWxlbWVudC5pc1dpdGhpbkJvdW5kcyhfdGhpcy5tb3VzZVBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnNldElzSG92ZXJpbmcoaXNIb3ZlcmluZyk7XG4gICAgICAgICAgICAgICAgZWxlbWVudHMucHVzaChlbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIC8vIHJlbmRlciB0aWxlcyBmb3IgY3VycmVudCBwbGF5ZXJcbiAgICAgICAgZ2FtZS5jdXJyZW50UGxheWVyLnRpbGVzLmZvckVhY2goZnVuY3Rpb24gKHRpbGUsIGlkeCkge1xuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBuZXcgVW5wbGF5ZWRUaWxlUmVuZGVyZXIoaWR4LCA4ICsgMiwgdGlsZSk7XG4gICAgICAgICAgICBpZiAodGlsZSA9PT0gX3RoaXMuZm9jdXNzZWRUaWxlKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zZXRGaWxsKFwiYmx1ZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGVsZW1lbnQuaXNXaXRoaW5Cb3VuZHMoX3RoaXMubW91c2VQb3NpdGlvbikpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnNldEZpbGwoXCJncmV5XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxlbWVudHMucHVzaChlbGVtZW50KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBlbGVtZW50cztcbiAgICB9O1xuICAgIHJldHVybiBSZW5kZXJlcjtcbn0oKSk7XG5leHBvcnRzLlJlbmRlcmVyID0gUmVuZGVyZXI7XG52YXIgQ2VsbFJlbmRlcmVyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENlbGxSZW5kZXJlcihjZWxsKSB7XG4gICAgICAgIHRoaXMuY2VsbCA9IGNlbGw7XG4gICAgICAgIHRoaXMuaGV4YWdvblJlbmRlcmVyID0gbmV3IEhleGFnb25SZW5kZXJlcih0aGlzLmNlbGwueCwgdGhpcy5jZWxsLnkpO1xuICAgIH1cbiAgICBDZWxsUmVuZGVyZXIucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbiAoY3R4KSB7XG4gICAgICAgIHRoaXMuaGV4YWdvblJlbmRlcmVyLmRyYXcoY3R4KTtcbiAgICAgICAgdmFyIHRleHQgPSB0aGlzLmNlbGwub3B0aW9ucy50ZXh0O1xuICAgICAgICBpZiAodGV4dCkge1xuICAgICAgICAgICAgdmFyIF9hID0gdGhpcy5oZXhhZ29uUmVuZGVyZXIuZ2V0TWlkcG9pbnQoKSwgeCA9IF9hWzBdLCB5ID0gX2FbMV07XG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gKHRleHQubGVuZ3RoIC8gMikgKiAzLjU7IC8vIHB4IHRvIG1vdmUgbGVmdFxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwiYmxhY2tcIjtcbiAgICAgICAgICAgIGN0eC5mb250ID0gXCI4cHggQXJpZWxcIjtcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dCh0ZXh0LCB4IC0gb2Zmc2V0LCB5ICsgMyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIENlbGxSZW5kZXJlci5wcm90b3R5cGUuaXNXaXRoaW5Cb3VuZHMgPSBmdW5jdGlvbiAocG9pbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGV4YWdvblJlbmRlcmVyLmlzV2l0aGluQm91bmRzKHBvaW50KTtcbiAgICB9O1xuICAgIENlbGxSZW5kZXJlci5wcm90b3R5cGUuc2V0SXNIb3ZlcmluZyA9IGZ1bmN0aW9uIChpc0hvdmVyaW5nKSB7XG4gICAgICAgIGlmIChpc0hvdmVyaW5nKSB7XG4gICAgICAgICAgICB0aGlzLmhleGFnb25SZW5kZXJlci5zZXRGaWxsKFwicmVkXCIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5oZXhhZ29uUmVuZGVyZXIuc2V0RmlsbCh0aGlzLmNlbGwub3B0aW9ucy5jb2xvcik7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBDZWxsUmVuZGVyZXI7XG59KCkpO1xudmFyIEhleGFnb25SZW5kZXJlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBIZXhhZ29uUmVuZGVyZXIoZ3JpZFgsIGdyaWRZKSB7XG4gICAgICAgIHRoaXMuZ3JpZFggPSBncmlkWDtcbiAgICAgICAgdGhpcy5ncmlkWSA9IGdyaWRZO1xuICAgICAgICB0aGlzLmZpbGwgPSBcInRyYW5zcGFyZW50XCI7XG4gICAgfVxuICAgIEhleGFnb25SZW5kZXJlci5wcm90b3R5cGUuc2V0RmlsbCA9IGZ1bmN0aW9uIChmaWxsKSB7XG4gICAgICAgIHRoaXMuZmlsbCA9IGZpbGw7XG4gICAgfTtcbiAgICBIZXhhZ29uUmVuZGVyZXIucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbiAoY3R4KSB7XG4gICAgICAgIHZhciBfYSA9IHRoaXMuZ2V0TWlkcG9pbnQoKSwgeCA9IF9hWzBdLCB5ID0gX2FbMV07XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA2OyBpKyspIHtcbiAgICAgICAgICAgIHZhciBhbmdsZVRvUG9pbnQgPSBkZWczMCArIGRlZzYwICogaTtcbiAgICAgICAgICAgIHZhciB4T2Zmc2V0ID0gaGV4UmFkaXVzICogTWF0aC5jb3MoYW5nbGVUb1BvaW50KTtcbiAgICAgICAgICAgIHZhciB5T2Zmc2V0ID0gaGV4UmFkaXVzICogTWF0aC5zaW4oYW5nbGVUb1BvaW50KTtcbiAgICAgICAgICAgIGN0eC5saW5lVG8oeCArIHhPZmZzZXQsIHkgKyB5T2Zmc2V0KTtcbiAgICAgICAgfVxuICAgICAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5maWxsO1xuICAgICAgICBjdHguZmlsbCgpO1xuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9O1xuICAgIEhleGFnb25SZW5kZXJlci5wcm90b3R5cGUuaXNXaXRoaW5Cb3VuZHMgPSBmdW5jdGlvbiAocG9pbnQpIHtcbiAgICAgICAgdmFyIF9hID0gdGhpcy5nZXRNaWRwb2ludCgpLCB4ID0gX2FbMF0sIHkgPSBfYVsxXTtcbiAgICAgICAgdmFyIHZlYyA9IHsgeDogcG9pbnQueCAtIHgsIHk6IHBvaW50LnkgLSB5IH07IC8vIHZlYyBmcm9tIGNlbnRyZSBvZiB0aGUgaGV4IHRvIHBvaW50O1xuICAgICAgICB2YXIgbWFnbml0dWRlID0gTWF0aC5zcXJ0KE1hdGgucG93KHZlYy54LCAyKSArIE1hdGgucG93KHZlYy55LCAyKSk7XG4gICAgICAgIHZhciBhbmdsZVJhZCA9IE1hdGguYXRhbjIodmVjLnksIHZlYy54KTtcbiAgICAgICAgdmFyIHBlcnBlbmRpY3VsYXJIZWlnaHQgPSBNYXRoLnNpbihkZWc2MCkgKiBoZXhSYWRpdXM7XG4gICAgICAgIHZhciBhbmdsZVJhZFBvcyA9IGFuZ2xlUmFkO1xuICAgICAgICB3aGlsZSAoYW5nbGVSYWRQb3MgPCAwKVxuICAgICAgICAgICAgYW5nbGVSYWRQb3MgKz0gMiAqIE1hdGguUEk7XG4gICAgICAgIHZhciBhbmdsZVJhZE5vcm0gPSBhbmdsZVJhZFBvcyAlIGRlZzMwO1xuICAgICAgICB2YXIgZGlzdGFuY2VUb0VkZ2UgPSBwZXJwZW5kaWN1bGFySGVpZ2h0IC8gTWF0aC5jb3MoYW5nbGVSYWROb3JtKTtcbiAgICAgICAgcmV0dXJuIG1hZ25pdHVkZSA8IGRpc3RhbmNlVG9FZGdlO1xuICAgIH07XG4gICAgSGV4YWdvblJlbmRlcmVyLnByb3RvdHlwZS5nZXRNaWRwb2ludCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHBlcnBlbmRpY3VsYXJIZWlnaHQgPSBNYXRoLnNpbihkZWc2MCkgKiBoZXhSYWRpdXM7XG4gICAgICAgIHZhciBoYWxmRWRnZUxlbmd0aCA9IE1hdGguY29zKGRlZzYwKSAqIGhleFJhZGl1cztcbiAgICAgICAgdmFyIHhPZmZzZXQgPSBwZXJwZW5kaWN1bGFySGVpZ2h0O1xuICAgICAgICB2YXIgeCA9ICh0aGlzLmdyaWRYICsgMSkgKiBwZXJwZW5kaWN1bGFySGVpZ2h0ICogMjtcbiAgICAgICAgdmFyIHkgPSAodGhpcy5ncmlkWSArIDEpICogKGhleFJhZGl1cyArIGhhbGZFZGdlTGVuZ3RoKTtcbiAgICAgICAgaWYgKHRoaXMuZ3JpZFkgJSAyID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gW3gsIHldO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFt4ICsgeE9mZnNldCwgeV07XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBIZXhhZ29uUmVuZGVyZXI7XG59KCkpO1xudmFyIFBsYXllZFRpbGVSZW5kZXJlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBQbGF5ZWRUaWxlUmVuZGVyZXIoZ3JpZFgsIGdyaWRZLCB0aWxlKSB7XG4gICAgICAgIHRoaXMuZ3JpZFggPSBncmlkWDtcbiAgICAgICAgdGhpcy5ncmlkWSA9IGdyaWRZO1xuICAgICAgICB0aGlzLnRpbGUgPSB0aWxlO1xuICAgICAgICB0aGlzLmhleGFnb25SZW5kZXJlciA9IG5ldyBIZXhhZ29uUmVuZGVyZXIoZ3JpZFgsIGdyaWRZKTtcbiAgICAgICAgdGhpcy5oZXhhZ29uUmVuZGVyZXIuc2V0RmlsbChcImJsYWNrXCIpO1xuICAgIH1cbiAgICBQbGF5ZWRUaWxlUmVuZGVyZXIucHJvdG90eXBlLnNldEZpbGwgPSBmdW5jdGlvbiAoZmlsbCkge1xuICAgICAgICB0aGlzLmhleGFnb25SZW5kZXJlci5zZXRGaWxsKGZpbGwpO1xuICAgIH07XG4gICAgUGxheWVkVGlsZVJlbmRlcmVyLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24gKGN0eCkge1xuICAgICAgICB0aGlzLmhleGFnb25SZW5kZXJlci5kcmF3KGN0eCk7XG4gICAgICAgIHZhciBfYSA9IHRoaXMuaGV4YWdvblJlbmRlcmVyLmdldE1pZHBvaW50KCksIHggPSBfYVswXSwgeSA9IF9hWzFdO1xuICAgICAgICB2YXIgZG90UmFkaXVzID0gaGV4UmFkaXVzICogMC4xO1xuICAgICAgICB0aGlzLnRpbGUuc2lkZXMuZm9yRWFjaChmdW5jdGlvbiAoc2lkZSwgaWR4KSB7XG4gICAgICAgICAgICBpZiAoc2lkZSAhPT0gMSlcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB2YXIgYW5nbGVUb1BvaW50ID0gZGVnNjAgKiBpZHggLSBkZWc2MCAqIDI7XG4gICAgICAgICAgICB2YXIgeE9mZnNldCA9IDAuNyAqIGhleFJhZGl1cyAqIE1hdGguY29zKGFuZ2xlVG9Qb2ludCk7XG4gICAgICAgICAgICB2YXIgeU9mZnNldCA9IDAuNyAqIGhleFJhZGl1cyAqIE1hdGguc2luKGFuZ2xlVG9Qb2ludCk7XG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBjdHguZWxsaXBzZSh4ICsgeE9mZnNldCwgeSArIHlPZmZzZXQsIGRvdFJhZGl1cywgZG90UmFkaXVzLCAwLCAwLCAyICogTWF0aC5QSSk7XG4gICAgICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJ3aGl0ZVwiO1xuICAgICAgICAgICAgY3R4LmZpbGwoKTtcbiAgICAgICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBQbGF5ZWRUaWxlUmVuZGVyZXIucHJvdG90eXBlLmlzV2l0aGluQm91bmRzID0gZnVuY3Rpb24gKHBvaW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhleGFnb25SZW5kZXJlci5pc1dpdGhpbkJvdW5kcyhwb2ludCk7XG4gICAgfTtcbiAgICByZXR1cm4gUGxheWVkVGlsZVJlbmRlcmVyO1xufSgpKTtcbnZhciBVbnBsYXllZFRpbGVSZW5kZXJlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBVbnBsYXllZFRpbGVSZW5kZXJlcih0aWxlSWR4LCBsYXN0Um93LCB0aWxlKSB7XG4gICAgICAgIHRoaXMudGlsZUlkeCA9IHRpbGVJZHg7XG4gICAgICAgIHRoaXMubGFzdFJvdyA9IGxhc3RSb3c7XG4gICAgICAgIHRoaXMudGlsZSA9IHRpbGU7XG4gICAgICAgIHRoaXMuaGV4YWdvblJlbmRlcmVyID0gbmV3IEhleGFnb25SZW5kZXJlcih0aWxlSWR4LCBsYXN0Um93KTtcbiAgICAgICAgdGhpcy5oZXhhZ29uUmVuZGVyZXIuc2V0RmlsbChcImJsYWNrXCIpO1xuICAgIH1cbiAgICBVbnBsYXllZFRpbGVSZW5kZXJlci5wcm90b3R5cGUuc2V0RmlsbCA9IGZ1bmN0aW9uIChmaWxsKSB7XG4gICAgICAgIHRoaXMuaGV4YWdvblJlbmRlcmVyLnNldEZpbGwoZmlsbCk7XG4gICAgfTtcbiAgICBVbnBsYXllZFRpbGVSZW5kZXJlci5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uIChjdHgpIHtcbiAgICAgICAgdGhpcy5oZXhhZ29uUmVuZGVyZXIuZHJhdyhjdHgpO1xuICAgICAgICB2YXIgX2EgPSB0aGlzLmhleGFnb25SZW5kZXJlci5nZXRNaWRwb2ludCgpLCB4ID0gX2FbMF0sIHkgPSBfYVsxXTtcbiAgICAgICAgdmFyIGRvdFJhZGl1cyA9IGhleFJhZGl1cyAqIDAuMTtcbiAgICAgICAgdGhpcy50aWxlLnNpZGVzLmZvckVhY2goZnVuY3Rpb24gKHNpZGUsIGlkeCkge1xuICAgICAgICAgICAgaWYgKHNpZGUgIT09IDEpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgdmFyIGFuZ2xlVG9Qb2ludCA9IGRlZzYwICogaWR4IC0gZGVnNjAgKiAyO1xuICAgICAgICAgICAgdmFyIHhPZmZzZXQgPSAwLjcgKiBoZXhSYWRpdXMgKiBNYXRoLmNvcyhhbmdsZVRvUG9pbnQpO1xuICAgICAgICAgICAgdmFyIHlPZmZzZXQgPSAwLjcgKiBoZXhSYWRpdXMgKiBNYXRoLnNpbihhbmdsZVRvUG9pbnQpO1xuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgY3R4LmVsbGlwc2UoeCArIHhPZmZzZXQsIHkgKyB5T2Zmc2V0LCBkb3RSYWRpdXMsIGRvdFJhZGl1cywgMCwgMCwgMiAqIE1hdGguUEkpO1xuICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwid2hpdGVcIjtcbiAgICAgICAgICAgIGN0eC5maWxsKCk7XG4gICAgICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgVW5wbGF5ZWRUaWxlUmVuZGVyZXIucHJvdG90eXBlLmlzV2l0aGluQm91bmRzID0gZnVuY3Rpb24gKHBvaW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhleGFnb25SZW5kZXJlci5pc1dpdGhpbkJvdW5kcyhwb2ludCk7XG4gICAgfTtcbiAgICByZXR1cm4gVW5wbGF5ZWRUaWxlUmVuZGVyZXI7XG59KCkpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlRpbGUgPSB2b2lkIDA7XG52YXIgVGlsZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBUaWxlKHZhbHVlKSB7XG4gICAgICAgIGlmICh2YWx1ZSA+IDYzKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGlsZSB2YWx1ZSBcIi5jb25jYXQodmFsdWUsIFwiIHRvbyBoaWdoIVwiKSk7XG4gICAgICAgIGlmICh2YWx1ZSA8IDApXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaWxlIHZhbHVlIFwiLmNvbmNhdCh2YWx1ZSwgXCIgdG9vIGxvdyFcIikpO1xuICAgICAgICB2YXIgcGFkZGVkVmFsdWUgPSB2YWx1ZSArIDY0O1xuICAgICAgICB0aGlzLl9zaWRlcyA9IHBhZGRlZFZhbHVlXG4gICAgICAgICAgICAudG9TdHJpbmcoMilcbiAgICAgICAgICAgIC5zcGxpdChcIlwiKVxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbiAoZGlnaXQpIHsgcmV0dXJuIHBhcnNlSW50KGRpZ2l0LCAxMCk7IH0pXG4gICAgICAgICAgICAuc2xpY2UoMSlcbiAgICAgICAgICAgIC5yZXZlcnNlKCk7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShUaWxlLnByb3RvdHlwZSwgXCJzaWRlc1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NpZGVzO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgVGlsZS5wcm90b3R5cGUuZ2V0RmFjZVZhbHVlID0gZnVuY3Rpb24gKGZhY2VJbmRleCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zaWRlc1tmYWNlSW5kZXhdO1xuICAgIH07XG4gICAgVGlsZS5wcm90b3R5cGUuZ2V0T3Bwb3NpbmdGYWNlVmFsdWVUbyA9IGZ1bmN0aW9uIChmYWNlSW5kZXgpIHtcbiAgICAgICAgdmFyIG9wcG9zaW5nRmFjZUluZGV4ID0gKGZhY2VJbmRleCArIDMpICUgNjtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RmFjZVZhbHVlKG9wcG9zaW5nRmFjZUluZGV4KTtcbiAgICB9O1xuICAgIFRpbGUucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcyA9IHRoaXMuX3NpZGVzO1xuICAgICAgICByZXR1cm4gXCJcXG4gICAgICAgICAgICAgL1wiLmNvbmNhdChzWzBdLCBcIiAgXCIpLmNvbmNhdChzWzFdLCBcIlxcXFxcXG4gICAgICAgICAgICB8XCIpLmNvbmNhdChzWzVdLCBcIiAgICBcIikuY29uY2F0KHNbMl0sIFwifFxcbiAgICAgICAgICAgICBcXFxcXCIpLmNvbmNhdChzWzRdLCBcIiAgXCIpLmNvbmNhdChzWzNdLCBcIi9cXG4gICAgICAgIFwiKTtcbiAgICB9O1xuICAgIFRpbGUucHJvdG90eXBlLnJvdGF0ZUNsb2Nrd2lzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGxhc3QgPSB0aGlzLl9zaWRlcy5wb3AoKTtcbiAgICAgICAgdGhpcy5fc2lkZXMudW5zaGlmdChsYXN0KTtcbiAgICB9O1xuICAgIFRpbGUucHJvdG90eXBlLnJvdGF0ZUNvdW50ZXJDbG9ja3dpc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBsYXN0ID0gdGhpcy5fc2lkZXMuc2hpZnQoKTtcbiAgICAgICAgdGhpcy5fc2lkZXMucHVzaChsYXN0KTtcbiAgICB9O1xuICAgIHJldHVybiBUaWxlO1xufSgpKTtcbmV4cG9ydHMuVGlsZSA9IFRpbGU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaXNVbmRlZmluZWQgPSBleHBvcnRzLm1hdHJpeCA9IHZvaWQgMDtcbmZ1bmN0aW9uIG1hdHJpeChtLCBuLCBkZWZhdWx0VmFsdWUpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh7XG4gICAgICAgIC8vIGdlbmVyYXRlIGFycmF5IG9mIGxlbmd0aCBtXG4gICAgICAgIGxlbmd0aDogbVxuICAgICAgICAvLyBpbnNpZGUgbWFwIGZ1bmN0aW9uIGdlbmVyYXRlIGFycmF5IG9mIHNpemUgblxuICAgICAgICAvLyBhbmQgZmlsbCBpdCB3aXRoIGAwYFxuICAgIH0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBBcnJheShuKS5maWxsKGRlZmF1bHRWYWx1ZSk7IH0pO1xufVxuZXhwb3J0cy5tYXRyaXggPSBtYXRyaXg7XG47XG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gXCJ1bmRlZmluZWRcIjtcbn1cbmV4cG9ydHMuaXNVbmRlZmluZWQgPSBpc1VuZGVmaW5lZDtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBnYW1lXzEgPSByZXF1aXJlKFwiLi9nYW1lXCIpO1xudmFyIHJlbmRlcmVyXzEgPSByZXF1aXJlKFwiLi9yZW5kZXJlclwiKTtcbnZhciByZW5kZXJlciA9IG5ldyByZW5kZXJlcl8xLlJlbmRlcmVyKCk7XG52YXIgcDEgPSBuZXcgZ2FtZV8xLlBsYXllcihcIlBsYXllciAxXCIpO1xudmFyIHAyID0gbmV3IGdhbWVfMS5QbGF5ZXIoXCJQbGF5ZXIgMlwiKTtcbnZhciBnYW1lID0gbmV3IGdhbWVfMS5HYW1lKFtwMSwgcDJdKTtcbmdhbWUuc2V0dXBCb2FyZCgpO1xudmFyIG1haW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmVuZGVyZXIucmVuZGVyKGdhbWUpO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShtYWluKTtcbn07XG5hbGVydChcIlRoZSBhaW0gb2YgdGhlIGdhbWUgaXMgdG8gc2NvcmUgdGhlIG1vc3QgcG9pbnRzLiBcXG5Zb3UgZ2FpbiBhIHBvaW50IGZvciBldmVyeSBlZGdlIHRoYXQgbWF0Y2hlcyBpdHMgbmVpZ2hib3VycywgYW5kIGxvc2UgYSBwb2ludCBmb3IgZXZlcnkgZWRnZSB0aGF0IGRvZXMgbm90LlxcbllvdSBoYXZlIHRvIHBsYXkgdGlsZXMgdXAgYWdhaW5zdCBhdCBsZWFzdCBvbmUgb3RoZXIgdGlsZS5cXG5Zb3UgYWx3YXlzIGhhdmUgNCB0aWxlcywgYW5kIGdldCBhIG5ldyBvbmUgZXZlcnkgdGltZSB5b3UgcHV0IG9uZSBkb3duLlxcblRoZSBnYW1lIGVuZHMgd2hlbiB0aGVyZSBhcmUgbm8gc3BhY2VzIGxlZnQgdG8gcGxheS5cXG5UaGUgY3VycmVudCBzY29yZSBpcyBpbiB0aGUgdG9wIHJpZ2h0LCBhbmQgdGhlIGN1cnJlbnQgcGxheWVyIGlzIHNob3duIGluIHJlZC5cXG5DbGljayBhIHRpbGUgaW4gdGhlIHJvdyBhdCB0aGUgYm90dG9tIHRvIHNlbGVjdCBpdC4gVXNlIFEgYW5kIEUgdG8gcm90YXRlIHRoZSB0aWxlLCB0aGVuIGNsaWNrIG9uIHRoZSBncmlkIHRvIHBsYWNlIHRoZSB0aWxlLlxcbkdvb2QgbHVjayFcXG5cIik7XG5tYWluKCk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=