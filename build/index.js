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
        this._board[3][3] = this.drawPile.pop();
        this.players = players;
        this.distributeTiles(4);
    }
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
        if (this.players.every(function (player) { return player.tiles.length === 0; })) {
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
            if (neighbourValues[sideIndex] === sideValue)
                return points + 1;
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
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Renderer = void 0;
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
            console.log(e);
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
                var _a = clickedElement, tile = _a.tile, tileIdx = _a.tileIdx;
                var _b = clickedElement, gridX = _b.gridX, gridY = _b.gridY;
                console.log({ tile: tile, tileIdx: tileIdx, gridX: gridX, gridY: gridY });
                if (tile && typeof tileIdx !== "undefined") {
                    _this.focussedTile = tile;
                    _this.focussedTileIdx = tileIdx;
                    console.log({ tile: tile, tileIdx: tileIdx });
                }
                else if (typeof gridX !== "undefined" && typeof gridY !== "undefined") {
                    // must be hexagon;
                    if (_this.focussedTile && typeof _this.focussedTileIdx !== "undefined") {
                        console.log(_this.game.currentPlayer);
                        _this.game.placeTile(_this.game.currentPlayer, _this.focussedTileIdx, gridX, gridY);
                        _this.focussedTile = undefined;
                        _this.focussedTileIdx = undefined;
                    }
                }
            }
            else {
                _this.focussedTileIdx = undefined;
                _this.focussedTile = undefined;
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
exports.matrix = void 0;
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
var main = function () {
    renderer.render(game);
    requestAnimationFrame(main);
};
main();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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VDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7Ozs7QUN2UFk7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLDZCQUE2QjtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELFlBQVk7Ozs7Ozs7Ozs7O0FDN0NDO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLLGdCQUFnQix5Q0FBeUM7QUFDOUQ7QUFDQSxjQUFjO0FBQ2Q7Ozs7Ozs7VUNaQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7Ozs7Ozs7O0FDdEJhO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGFBQWEsbUJBQU8sQ0FBQyw2QkFBUTtBQUM3QixpQkFBaUIsbUJBQU8sQ0FBQyxxQ0FBWTtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9uZW9kb21pbm8vLi9zcmMvZ2FtZS50cyIsIndlYnBhY2s6Ly9uZW9kb21pbm8vLi9zcmMvcmVuZGVyZXIudHMiLCJ3ZWJwYWNrOi8vbmVvZG9taW5vLy4vc3JjL3RpbGUudHMiLCJ3ZWJwYWNrOi8vbmVvZG9taW5vLy4vc3JjL3V0aWxzLnRzIiwid2VicGFjazovL25lb2RvbWluby93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9uZW9kb21pbm8vLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkdhbWUgPSBleHBvcnRzLlBsYXllciA9IHZvaWQgMDtcbnZhciB0aWxlXzEgPSByZXF1aXJlKFwiLi90aWxlXCIpO1xudmFyIHV0aWxzXzEgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbnZhciBQbGF5ZXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gUGxheWVyKG5hbWUpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5fdGlsZXMgPSBbXTtcbiAgICAgICAgdGhpcy5fcG9pbnRzID0gMDtcbiAgICB9XG4gICAgUGxheWVyLnByb3RvdHlwZS5naXZlVGlsZSA9IGZ1bmN0aW9uICh0aWxlKSB7XG4gICAgICAgIHRoaXMuX3RpbGVzLnB1c2godGlsZSk7XG4gICAgfTtcbiAgICBQbGF5ZXIucHJvdG90eXBlLnRha2VUaWxlID0gZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoXCJObyB0aWxlIGluIHRoYXQgcG9zaXRpb24hXCIpO1xuICAgICAgICBpZiAoaW5kZXggPj0gdGhpcy5fdGlsZXMubGVuZ3RoKVxuICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICBpZiAoaW5kZXggPCAwKVxuICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB2YXIgdGlsZSA9IHRoaXMuX3RpbGVzLnNwbGljZShpbmRleCwgMSlbMF07XG4gICAgICAgIGlmICghdGlsZSlcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgcmV0dXJuIHRpbGU7XG4gICAgfTtcbiAgICBQbGF5ZXIucHJvdG90eXBlLmF3YXJkUG9pbnRzID0gZnVuY3Rpb24gKHBvaW50cykge1xuICAgICAgICB0aGlzLl9wb2ludHMgKz0gcG9pbnRzO1xuICAgIH07XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFBsYXllci5wcm90b3R5cGUsIFwidGlsZXNcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90aWxlcy5zbGljZSgpO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFBsYXllci5wcm90b3R5cGUsIFwicG9pbnRzXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcG9pbnRzO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgUGxheWVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFwiXCIuY29uY2F0KHRoaXMubmFtZSwgXCI6IFwiKS5jb25jYXQodGhpcy5wb2ludHMsIFwiIHBvaW50c1wiKTtcbiAgICB9O1xuICAgIHJldHVybiBQbGF5ZXI7XG59KCkpO1xuZXhwb3J0cy5QbGF5ZXIgPSBQbGF5ZXI7XG52YXIgR2FtZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBHYW1lKHBsYXllcnMpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50UGxheWVySW5kZXggPSAwO1xuICAgICAgICBpZiAocGxheWVycy5sZW5ndGggPCAyKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWluaW11bSAyIHBsYXllcnMhXCIpO1xuICAgICAgICBpZiAocGxheWVycy5sZW5ndGggPiA0KVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWF4aW11bSA0IHBsYXllcnMhXCIpO1xuICAgICAgICB0aGlzLl9ib2FyZCA9ICgwLCB1dGlsc18xLm1hdHJpeCkoOCwgOCwgdW5kZWZpbmVkKTtcbiAgICAgICAgdGhpcy5kcmF3UGlsZSA9IG5ldyBBcnJheSg2NClcbiAgICAgICAgICAgIC5maWxsKDApXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uICh2YWwsIGkpIHsgcmV0dXJuIGk7IH0pXG4gICAgICAgICAgICAvLyAuc2xpY2UoMSkgLy8gcmVtb3ZlIDAgdmFsdWUgdGlsZSB0byBwdXQgaW4gbWlkZGxlIG9mIGJvYXJkXG4gICAgICAgICAgICAuc29ydChmdW5jdGlvbiAoKSB7IHJldHVybiBNYXRoLnJhbmRvbSgpIC0gMC41OyB9KSAvLyBzaHVmZmxlXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uICh2YWwpIHsgcmV0dXJuIG5ldyB0aWxlXzEuVGlsZSh2YWwpOyB9KTtcbiAgICAgICAgdGhpcy5fYm9hcmRbM11bM10gPSB0aGlzLmRyYXdQaWxlLnBvcCgpO1xuICAgICAgICB0aGlzLnBsYXllcnMgPSBwbGF5ZXJzO1xuICAgICAgICB0aGlzLmRpc3RyaWJ1dGVUaWxlcyg0KTtcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEdhbWUucHJvdG90eXBlLCBcInRpbGVzUmVtYWluaW5nXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kcmF3UGlsZS5sZW5ndGg7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoR2FtZS5wcm90b3R5cGUsIFwiYm9hcmRcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ib2FyZC5zbGljZSgpO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgR2FtZS5wcm90b3R5cGUuZGlzdHJpYnV0ZVRpbGVzID0gZnVuY3Rpb24gKGNvdW50KSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMucGxheWVycy5mb3JFYWNoKGZ1bmN0aW9uIChwbGF5ZXIpIHtcbiAgICAgICAgICAgIHdoaWxlIChwbGF5ZXIudGlsZXMubGVuZ3RoIDwgY291bnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGlsZSA9IF90aGlzLmRyYXdQaWxlLnBvcCgpO1xuICAgICAgICAgICAgICAgIGlmICghdGlsZSlcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiT3V0IG9mIHRpbGVzIVwiKTtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuZ2l2ZVRpbGUodGlsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgR2FtZS5wcm90b3R5cGUucGxhY2VUaWxlID0gZnVuY3Rpb24gKHBsYXllciwgdGlsZUlkeCwgeCwgeSkge1xuICAgICAgICBpZiAoIXRoaXMuaXNWYWxpZFBvc2l0aW9uKHgsIHkpKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUG9zaXRpb24gb3V0IG9mIGJvdW5kcyFcIik7XG4gICAgICAgIHZhciBleGlzdGluZ1RpbGUgPSB0aGlzLmdldFRpbGVBdCh4LCB5KTtcbiAgICAgICAgaWYgKGV4aXN0aW5nVGlsZSlcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwYWNlIGFscmVhZHkgb2NjdXBpZWQhXCIpO1xuICAgICAgICBpZiAodGhpcy5uZWlnaGJvdXJDb3VudCh4LCB5KSA9PT0gMClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgcGxhY2UgYSB0aWxlIGFnYWluc3QgYW5vdGhlciBvbmVcIik7XG4gICAgICAgIGlmIChwbGF5ZXIgIT09IHRoaXMuY3VycmVudFBsYXllcilcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBcIi5jb25jYXQocGxheWVyLm5hbWUsIFwiJ3MgdHVybiFcIikpO1xuICAgICAgICB2YXIgdGlsZSA9IHBsYXllci50YWtlVGlsZSh0aWxlSWR4KTtcbiAgICAgICAgdGhpcy5zZXRUaWxlQXQodGlsZSwgeCwgeSk7XG4gICAgICAgIHZhciBwb2ludHMgPSB0aGlzLmNhbGN1bGF0ZVBvaW50c0ZvclRpbGUoeCwgeSk7XG4gICAgICAgIHRoaXMuY3VycmVudFBsYXllci5hd2FyZFBvaW50cyhwb2ludHMpO1xuICAgICAgICB2YXIgZHJhd25UaWxlID0gdGhpcy5kcmF3UGlsZS5wb3AoKTtcbiAgICAgICAgaWYgKGRyYXduVGlsZSlcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBsYXllci5naXZlVGlsZShkcmF3blRpbGUpO1xuICAgICAgICBpZiAodGhpcy5wbGF5ZXJzLmV2ZXJ5KGZ1bmN0aW9uIChwbGF5ZXIpIHsgcmV0dXJuIHBsYXllci50aWxlcy5sZW5ndGggPT09IDA7IH0pKSB7XG4gICAgICAgICAgICBhbGVydChcIkdhbWUgb3ZlciwgZmluYWwgcG9pbnRzOiBcIi5jb25jYXQodGhpcy5wbGF5ZXJzLm1hcChmdW5jdGlvbiAocGxheWVyKSB7IHJldHVybiBwbGF5ZXIudG9TdHJpbmcoKTsgfSkuam9pbihcIiwgXCIpKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdXJyZW50UGxheWVySW5kZXggKz0gMTtcbiAgICAgICAgdGhpcy5jdXJyZW50UGxheWVySW5kZXggPSB0aGlzLmN1cnJlbnRQbGF5ZXJJbmRleCAlIHRoaXMucGxheWVycy5sZW5ndGg7XG4gICAgfTtcbiAgICBHYW1lLnByb3RvdHlwZS5jYWxjdWxhdGVQb2ludHNGb3JUaWxlID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgdmFyIHRpbGUgPSB0aGlzLmdldFRpbGVBdCh4LCB5KTtcbiAgICAgICAgaWYgKCF0aWxlKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gdGlsZSB0byBjYWxjdWxhdGUhXCIpO1xuICAgICAgICB2YXIgbmVpZ2hib3VyVmFsdWVzID0gdGhpcy5nZXROZWlnaGJvdXJpbmdWYWx1ZXNUbyh4LCB5KTtcbiAgICAgICAgcmV0dXJuIHRpbGUuc2lkZXMucmVkdWNlKGZ1bmN0aW9uIChwb2ludHMsIHNpZGVWYWx1ZSwgc2lkZUluZGV4KSB7XG4gICAgICAgICAgICBpZiAobmVpZ2hib3VyVmFsdWVzW3NpZGVJbmRleF0gPT09IHNpZGVWYWx1ZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gcG9pbnRzICsgMTtcbiAgICAgICAgICAgIHJldHVybiBwb2ludHM7XG4gICAgICAgIH0sIDApO1xuICAgIH07XG4gICAgR2FtZS5wcm90b3R5cGUuZ2V0TmVpZ2hib3VyaW5nVmFsdWVzVG8gPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICB2YXIgdGlsZXMgPSB0aGlzLmdldE5laWdoYm91cmluZ1RpbGVzVG8oeCwgeSk7XG4gICAgICAgIHJldHVybiB0aWxlcy5tYXAoZnVuY3Rpb24gKHRpbGUsIGZhY2VJbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuIHRpbGUgPT09IG51bGwgfHwgdGlsZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogdGlsZS5nZXRPcHBvc2luZ0ZhY2VWYWx1ZVRvKGZhY2VJbmRleCk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgR2FtZS5wcm90b3R5cGUubmVpZ2hib3VyQ291bnQgPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXROZWlnaGJvdXJpbmdUaWxlc1RvKHgsIHkpXG4gICAgICAgICAgICAucmVkdWNlKGZ1bmN0aW9uIChjb3VudCwgdGlsZSkge1xuICAgICAgICAgICAgaWYgKHRpbGUpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvdW50ICsgMTtcbiAgICAgICAgICAgIHJldHVybiBjb3VudDtcbiAgICAgICAgfSwgMCk7XG4gICAgfTtcbiAgICBHYW1lLnByb3RvdHlwZS5nZXROZWlnaGJvdXJpbmdUaWxlc1RvID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgdmFyIGlzRXZlblJvdyA9IHkgJSAyID09PSAwO1xuICAgICAgICB2YXIgcm93T2Zmc2V0ID0gaXNFdmVuUm93ID8gLTEgOiAwO1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgdGhpcy5nZXRUaWxlQXQoeCArIHJvd09mZnNldCwgeSAtIDEpLFxuICAgICAgICAgICAgdGhpcy5nZXRUaWxlQXQoeCArIDEgKyByb3dPZmZzZXQsIHkgLSAxKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0VGlsZUF0KHggKyAxLCB5KSxcbiAgICAgICAgICAgIHRoaXMuZ2V0VGlsZUF0KHggKyAxICsgcm93T2Zmc2V0LCB5ICsgMSksXG4gICAgICAgICAgICB0aGlzLmdldFRpbGVBdCh4ICsgcm93T2Zmc2V0LCB5ICsgMSksXG4gICAgICAgICAgICB0aGlzLmdldFRpbGVBdCh4IC0gMSwgeSkgLy8gbGVmdFxuICAgICAgICBdO1xuICAgIH07XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEdhbWUucHJvdG90eXBlLCBcImN1cnJlbnRQbGF5ZXJcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBsYXllcnNbdGhpcy5jdXJyZW50UGxheWVySW5kZXhdO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgR2FtZS5wcm90b3R5cGUuZ2V0VGlsZUF0ID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWRQb3NpdGlvbih4LCB5KSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2JvYXJkW3ldW3hdO1xuICAgIH07XG4gICAgR2FtZS5wcm90b3R5cGUuc2V0VGlsZUF0ID0gZnVuY3Rpb24gKHRpbGUsIHgsIHkpIHtcbiAgICAgICAgdGhpcy5fYm9hcmRbeV1beF0gPSB0aWxlO1xuICAgIH07XG4gICAgR2FtZS5wcm90b3R5cGUuaXNWYWxpZFBvc2l0aW9uID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgaWYgKHggPCAwKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiAoeSA8IDApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmICh5ID49IHRoaXMuYm9hcmQubGVuZ3RoKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiAoeCA+PSB0aGlzLmJvYXJkWzBdLmxlbmd0aClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcbiAgICBHYW1lLnByb3RvdHlwZS5wcmludCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5wbGF5ZXJzLmZvckVhY2goZnVuY3Rpb24gKHBsYXllcikgeyByZXR1cm4gY29uc29sZS5sb2cocGxheWVyLnRvU3RyaW5nKCkpOyB9KTtcbiAgICAgICAgdGhpcy5fYm9hcmQubWFwKGZ1bmN0aW9uIChyb3csIHJvd0luZGV4KSB7XG4gICAgICAgICAgICB2YXIgaXNPZGQgPSByb3dJbmRleCAlIDIgPT09IDE7XG4gICAgICAgICAgICB2YXIgc3BhY2luZyA9IGlzT2RkID8gXCIgXCIgOiBcIlwiO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJcIi5jb25jYXQoc3BhY2luZykuY29uY2F0KHJvdy5tYXAoZnVuY3Rpb24gKHRpbGUpIHsgcmV0dXJuICEhdGlsZSA/IDEgOiAwOyB9KS5qb2luKFwiLlwiKSkpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIHJldHVybiBHYW1lO1xufSgpKTtcbmV4cG9ydHMuR2FtZSA9IEdhbWU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUmVuZGVyZXIgPSB2b2lkIDA7XG52YXIgZGVnNjAgPSBNYXRoLlBJIC8gMztcbnZhciBkZWczMCA9IE1hdGguUEkgLyA2O1xudmFyIFJlbmRlcmVyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFJlbmRlcmVyKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluJyk7XG4gICAgICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgdGhpcy5oZXhSYWRpdXMgPSA0MDtcbiAgICAgICAgdGhpcy5tb3VzZVBvc2l0aW9uID0geyB4OiAwLCB5OiAwIH07XG4gICAgICAgIHdpbmRvdy5vbmtleWRvd24gPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICAgICAgaWYgKF90aGlzLmZvY3Vzc2VkVGlsZSAmJiBlLmtleSA9PT0gXCJxXCIgfHwgZS5rZXkgPT09IFwiUVwiKSB7XG4gICAgICAgICAgICAgICAgKF9hID0gX3RoaXMuZm9jdXNzZWRUaWxlKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Eucm90YXRlQ291bnRlckNsb2Nrd2lzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoX3RoaXMuZm9jdXNzZWRUaWxlICYmIGUua2V5ID09PSBcImVcIiB8fCBlLmtleSA9PT0gXCJFXCIpIHtcbiAgICAgICAgICAgICAgICAoX2IgPSBfdGhpcy5mb2N1c3NlZFRpbGUpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5yb3RhdGVDbG9ja3dpc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5jYW52YXMub25tb3VzZW1vdmUgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgdmFyIHJlY3QgPSBfdGhpcy5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICBfdGhpcy5tb3VzZVBvc2l0aW9uLnggPSBlLmNsaWVudFggLSByZWN0LmxlZnQ7XG4gICAgICAgICAgICBfdGhpcy5tb3VzZVBvc2l0aW9uLnkgPSBlLmNsaWVudFkgLSByZWN0LnRvcDtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5jYW52YXMub25jbGljayA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBpZiAoIV90aGlzLmdhbWUpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgdmFyIGVsZW1lbnRzID0gX3RoaXMuZ2V0RWxlbWVudHMoX3RoaXMuZ2FtZSk7XG4gICAgICAgICAgICB2YXIgcmVjdCA9IF90aGlzLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIF90aGlzLm1vdXNlUG9zaXRpb24ueCA9IGUuY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgICAgICAgICAgIF90aGlzLm1vdXNlUG9zaXRpb24ueSA9IGUuY2xpZW50WSAtIHJlY3QudG9wO1xuICAgICAgICAgICAgdmFyIGNsaWNrZWRFbGVtZW50ID0gZWxlbWVudHMuZmluZChmdW5jdGlvbiAoZWxlbWVudCkgeyByZXR1cm4gZWxlbWVudC5pc1dpdGhpbkJvdW5kcyhfdGhpcy5tb3VzZVBvc2l0aW9uKTsgfSk7XG4gICAgICAgICAgICBpZiAoY2xpY2tlZEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgX2EgPSBjbGlja2VkRWxlbWVudCwgdGlsZSA9IF9hLnRpbGUsIHRpbGVJZHggPSBfYS50aWxlSWR4O1xuICAgICAgICAgICAgICAgIHZhciBfYiA9IGNsaWNrZWRFbGVtZW50LCBncmlkWCA9IF9iLmdyaWRYLCBncmlkWSA9IF9iLmdyaWRZO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHsgdGlsZTogdGlsZSwgdGlsZUlkeDogdGlsZUlkeCwgZ3JpZFg6IGdyaWRYLCBncmlkWTogZ3JpZFkgfSk7XG4gICAgICAgICAgICAgICAgaWYgKHRpbGUgJiYgdHlwZW9mIHRpbGVJZHggIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuZm9jdXNzZWRUaWxlID0gdGlsZTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuZm9jdXNzZWRUaWxlSWR4ID0gdGlsZUlkeDtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coeyB0aWxlOiB0aWxlLCB0aWxlSWR4OiB0aWxlSWR4IH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgZ3JpZFggIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIGdyaWRZICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG11c3QgYmUgaGV4YWdvbjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF90aGlzLmZvY3Vzc2VkVGlsZSAmJiB0eXBlb2YgX3RoaXMuZm9jdXNzZWRUaWxlSWR4ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhfdGhpcy5nYW1lLmN1cnJlbnRQbGF5ZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuZ2FtZS5wbGFjZVRpbGUoX3RoaXMuZ2FtZS5jdXJyZW50UGxheWVyLCBfdGhpcy5mb2N1c3NlZFRpbGVJZHgsIGdyaWRYLCBncmlkWSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5mb2N1c3NlZFRpbGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5mb2N1c3NlZFRpbGVJZHggPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5mb2N1c3NlZFRpbGVJZHggPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgX3RoaXMuZm9jdXNzZWRUaWxlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICBSZW5kZXJlci5wcm90b3R5cGUuc2V0U2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIH07XG4gICAgUmVuZGVyZXIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIChnYW1lKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMuc2V0U2l6ZSgpO1xuICAgICAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XG4gICAgICAgIHRoaXMuY3R4LmZvbnQgPSBcIjI0cHggQXJpZWxcIjtcbiAgICAgICAgLy8gcmVuZGVyIHBvaW50c1xuICAgICAgICB0aGlzLmN0eC5maWxsVGV4dChcIlBvaW50c1wiLCB0aGlzLmNhbnZhcy53aWR0aCAtIDIwMCwgMjApO1xuICAgICAgICBnYW1lLnBsYXllcnMuZm9yRWFjaChmdW5jdGlvbiAocGxheWVyLCBpKSB7XG4gICAgICAgICAgICB2YXIgeCA9IF90aGlzLmNhbnZhcy53aWR0aCAtIDIwMDtcbiAgICAgICAgICAgIHZhciB5ID0gNzAgKyAzMCAqIGk7XG4gICAgICAgICAgICBpZiAocGxheWVyID09PSBnYW1lLmN1cnJlbnRQbGF5ZXIpXG4gICAgICAgICAgICAgICAgX3RoaXMuY3R4LmZpbGxTdHlsZSA9IFwicmVkXCI7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgX3RoaXMuY3R4LmZpbGxTdHlsZSA9IFwiYmxhY2tcIjtcbiAgICAgICAgICAgIF90aGlzLmN0eC5maWxsVGV4dChcIlwiLmNvbmNhdChwbGF5ZXIubmFtZSwgXCI6IFwiKS5jb25jYXQocGxheWVyLnBvaW50cyksIHgsIHkpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gXCJibGFja1wiO1xuICAgICAgICB0aGlzLmN0eC5maWxsVGV4dChcIlRpbGVzIHJlbWFpbmluZzogXCIuY29uY2F0KGdhbWUudGlsZXNSZW1haW5pbmcpLCB0aGlzLmNhbnZhcy53aWR0aCAtIDQ1MCwgMjApO1xuICAgICAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IFwic2xhdGVHcmV5XCI7XG4gICAgICAgIHRoaXMuZ2V0RWxlbWVudHMoZ2FtZSkuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkgeyByZXR1cm4gZWxlbWVudC5kcmF3KF90aGlzLmN0eCk7IH0pO1xuICAgIH07XG4gICAgUmVuZGVyZXIucHJvdG90eXBlLmdldEVsZW1lbnRzID0gZnVuY3Rpb24gKGdhbWUpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIGdyaWQgPSBnYW1lLmJvYXJkO1xuICAgICAgICB2YXIgaGV4UmFkaXVzID0gdGhpcy5oZXhSYWRpdXM7XG4gICAgICAgIC8vIHJlbmRlciBib2FyZFxuICAgICAgICB2YXIgZWxlbWVudHMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgZ3JpZFkgPSAwOyBncmlkWSA8IGdyaWQubGVuZ3RoOyBncmlkWSsrKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBncmlkWCA9IDA7IGdyaWRYIDwgZ3JpZFswXS5sZW5ndGg7IGdyaWRYKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgdGlsZSA9IGdhbWUuZ2V0VGlsZUF0KGdyaWRYLCBncmlkWSk7XG4gICAgICAgICAgICAgICAgaWYgKHRpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudHMucHVzaChuZXcgUGxheWVkVGlsZVJlbmRlcmVyKGdyaWRYLCBncmlkWSwgaGV4UmFkaXVzLCB0aWxlKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZWxlbWVudCA9IG5ldyBIZXhhZ29uUmVuZGVyZXIoZ3JpZFgsIGdyaWRZLCBoZXhSYWRpdXMpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5pc1dpdGhpbkJvdW5kcyh0aGlzLm1vdXNlUG9zaXRpb24pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnNldEZpbGwoXCJyZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudHMucHVzaChlbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmVuZGVyIHRpbGVzIGZvciBjdXJyZW50IHBsYXllclxuICAgICAgICBnYW1lLmN1cnJlbnRQbGF5ZXIudGlsZXMuZm9yRWFjaChmdW5jdGlvbiAodGlsZSwgaWR4KSB7XG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IG5ldyBVbnBsYXllZFRpbGVSZW5kZXJlcihpZHgsIGdhbWUuYm9hcmQubGVuZ3RoICsgMiwgaGV4UmFkaXVzLCB0aWxlKTtcbiAgICAgICAgICAgIGlmICh0aWxlID09PSBfdGhpcy5mb2N1c3NlZFRpbGUpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnNldEZpbGwoXCJibHVlXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoZWxlbWVudC5pc1dpdGhpbkJvdW5kcyhfdGhpcy5tb3VzZVBvc2l0aW9uKSkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0RmlsbChcImdyZXlcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbGVtZW50cy5wdXNoKGVsZW1lbnQpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnRzO1xuICAgIH07XG4gICAgcmV0dXJuIFJlbmRlcmVyO1xufSgpKTtcbmV4cG9ydHMuUmVuZGVyZXIgPSBSZW5kZXJlcjtcbnZhciBIZXhhZ29uUmVuZGVyZXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gSGV4YWdvblJlbmRlcmVyKGdyaWRYLCBncmlkWSwgaGV4UmFkaXVzKSB7XG4gICAgICAgIHRoaXMuZ3JpZFggPSBncmlkWDtcbiAgICAgICAgdGhpcy5ncmlkWSA9IGdyaWRZO1xuICAgICAgICB0aGlzLmhleFJhZGl1cyA9IGhleFJhZGl1cztcbiAgICAgICAgdGhpcy5maWxsID0gXCJ0cmFuc3BhcmVudFwiO1xuICAgIH1cbiAgICBIZXhhZ29uUmVuZGVyZXIucHJvdG90eXBlLnNldEZpbGwgPSBmdW5jdGlvbiAoZmlsbCkge1xuICAgICAgICB0aGlzLmZpbGwgPSBmaWxsO1xuICAgIH07XG4gICAgSGV4YWdvblJlbmRlcmVyLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24gKGN0eCkge1xuICAgICAgICB2YXIgX2EgPSB0aGlzLmdldE1pZHBvaW50KCksIHggPSBfYVswXSwgeSA9IF9hWzFdO1xuICAgICAgICB2YXIgaGV4UmFkaXVzID0gdGhpcy5oZXhSYWRpdXM7XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA2OyBpKyspIHtcbiAgICAgICAgICAgIHZhciBhbmdsZVRvUG9pbnQgPSBkZWczMCArIGRlZzYwICogaTtcbiAgICAgICAgICAgIHZhciB4T2Zmc2V0ID0gaGV4UmFkaXVzICogTWF0aC5jb3MoYW5nbGVUb1BvaW50KTtcbiAgICAgICAgICAgIHZhciB5T2Zmc2V0ID0gaGV4UmFkaXVzICogTWF0aC5zaW4oYW5nbGVUb1BvaW50KTtcbiAgICAgICAgICAgIGN0eC5saW5lVG8oeCArIHhPZmZzZXQsIHkgKyB5T2Zmc2V0KTtcbiAgICAgICAgfVxuICAgICAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5maWxsO1xuICAgICAgICBjdHguZmlsbCgpO1xuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9O1xuICAgIEhleGFnb25SZW5kZXJlci5wcm90b3R5cGUuaXNXaXRoaW5Cb3VuZHMgPSBmdW5jdGlvbiAocG9pbnQpIHtcbiAgICAgICAgdmFyIF9hID0gdGhpcy5nZXRNaWRwb2ludCgpLCB4ID0gX2FbMF0sIHkgPSBfYVsxXTtcbiAgICAgICAgdmFyIHZlYyA9IHsgeDogcG9pbnQueCAtIHgsIHk6IHBvaW50LnkgLSB5IH07IC8vIHZlYyBmcm9tIGNlbnRyZSBvZiB0aGUgaGV4IHRvIHBvaW50O1xuICAgICAgICB2YXIgbWFnbml0dWRlID0gTWF0aC5zcXJ0KE1hdGgucG93KHZlYy54LCAyKSArIE1hdGgucG93KHZlYy55LCAyKSk7XG4gICAgICAgIHZhciBhbmdsZVJhZCA9IE1hdGguYXRhbjIodmVjLnksIHZlYy54KTtcbiAgICAgICAgdmFyIHBlcnBlbmRpY3VsYXJIZWlnaHQgPSBNYXRoLnNpbihkZWc2MCkgKiB0aGlzLmhleFJhZGl1cztcbiAgICAgICAgdmFyIGFuZ2xlUmFkUG9zID0gYW5nbGVSYWQ7XG4gICAgICAgIHdoaWxlIChhbmdsZVJhZFBvcyA8IDApXG4gICAgICAgICAgICBhbmdsZVJhZFBvcyArPSAyICogTWF0aC5QSTtcbiAgICAgICAgdmFyIGFuZ2xlUmFkTm9ybSA9IGFuZ2xlUmFkUG9zICUgZGVnMzA7XG4gICAgICAgIHZhciBkaXN0YW5jZVRvRWRnZSA9IHBlcnBlbmRpY3VsYXJIZWlnaHQgLyBNYXRoLmNvcyhhbmdsZVJhZE5vcm0pO1xuICAgICAgICByZXR1cm4gbWFnbml0dWRlIDwgZGlzdGFuY2VUb0VkZ2U7XG4gICAgfTtcbiAgICBIZXhhZ29uUmVuZGVyZXIucHJvdG90eXBlLmdldE1pZHBvaW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcGVycGVuZGljdWxhckhlaWdodCA9IE1hdGguc2luKGRlZzYwKSAqIHRoaXMuaGV4UmFkaXVzO1xuICAgICAgICB2YXIgaGFsZkVkZ2VMZW5ndGggPSBNYXRoLmNvcyhkZWc2MCkgKiB0aGlzLmhleFJhZGl1cztcbiAgICAgICAgdmFyIHhPZmZzZXQgPSBwZXJwZW5kaWN1bGFySGVpZ2h0O1xuICAgICAgICB2YXIgeCA9ICh0aGlzLmdyaWRYICsgMSkgKiBwZXJwZW5kaWN1bGFySGVpZ2h0ICogMjtcbiAgICAgICAgdmFyIHkgPSAodGhpcy5ncmlkWSArIDEpICogKHRoaXMuaGV4UmFkaXVzICsgaGFsZkVkZ2VMZW5ndGgpO1xuICAgICAgICBpZiAodGhpcy5ncmlkWSAlIDIgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBbeCwgeV07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gW3ggKyB4T2Zmc2V0LCB5XTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIEhleGFnb25SZW5kZXJlcjtcbn0oKSk7XG52YXIgUGxheWVkVGlsZVJlbmRlcmVyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFBsYXllZFRpbGVSZW5kZXJlcihncmlkWCwgZ3JpZFksIGhleFJhZGl1cywgdGlsZSkge1xuICAgICAgICB0aGlzLmdyaWRYID0gZ3JpZFg7XG4gICAgICAgIHRoaXMuZ3JpZFkgPSBncmlkWTtcbiAgICAgICAgdGhpcy5oZXhSYWRpdXMgPSBoZXhSYWRpdXM7XG4gICAgICAgIHRoaXMudGlsZSA9IHRpbGU7XG4gICAgICAgIHRoaXMuaGV4YWdvblJlbmRlcmVyID0gbmV3IEhleGFnb25SZW5kZXJlcihncmlkWCwgZ3JpZFksIGhleFJhZGl1cyk7XG4gICAgICAgIHRoaXMuaGV4YWdvblJlbmRlcmVyLnNldEZpbGwoXCJibGFja1wiKTtcbiAgICB9XG4gICAgUGxheWVkVGlsZVJlbmRlcmVyLnByb3RvdHlwZS5zZXRGaWxsID0gZnVuY3Rpb24gKGZpbGwpIHtcbiAgICAgICAgdGhpcy5oZXhhZ29uUmVuZGVyZXIuc2V0RmlsbChmaWxsKTtcbiAgICB9O1xuICAgIFBsYXllZFRpbGVSZW5kZXJlci5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uIChjdHgpIHtcbiAgICAgICAgdGhpcy5oZXhhZ29uUmVuZGVyZXIuZHJhdyhjdHgpO1xuICAgICAgICB2YXIgaGV4UmFkaXVzID0gdGhpcy5oZXhSYWRpdXM7XG4gICAgICAgIHZhciBfYSA9IHRoaXMuaGV4YWdvblJlbmRlcmVyLmdldE1pZHBvaW50KCksIHggPSBfYVswXSwgeSA9IF9hWzFdO1xuICAgICAgICB2YXIgZG90UmFkaXVzID0gaGV4UmFkaXVzICogMC4xO1xuICAgICAgICB0aGlzLnRpbGUuc2lkZXMuZm9yRWFjaChmdW5jdGlvbiAoc2lkZSwgaWR4KSB7XG4gICAgICAgICAgICBpZiAoc2lkZSAhPT0gMSlcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB2YXIgYW5nbGVUb1BvaW50ID0gZGVnNjAgKiBpZHggLSBkZWc2MCAqIDI7XG4gICAgICAgICAgICB2YXIgeE9mZnNldCA9IDAuNyAqIGhleFJhZGl1cyAqIE1hdGguY29zKGFuZ2xlVG9Qb2ludCk7XG4gICAgICAgICAgICB2YXIgeU9mZnNldCA9IDAuNyAqIGhleFJhZGl1cyAqIE1hdGguc2luKGFuZ2xlVG9Qb2ludCk7XG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBjdHguZWxsaXBzZSh4ICsgeE9mZnNldCwgeSArIHlPZmZzZXQsIGRvdFJhZGl1cywgZG90UmFkaXVzLCAwLCAwLCAyICogTWF0aC5QSSk7XG4gICAgICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJ3aGl0ZVwiO1xuICAgICAgICAgICAgY3R4LmZpbGwoKTtcbiAgICAgICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBQbGF5ZWRUaWxlUmVuZGVyZXIucHJvdG90eXBlLmlzV2l0aGluQm91bmRzID0gZnVuY3Rpb24gKHBvaW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhleGFnb25SZW5kZXJlci5pc1dpdGhpbkJvdW5kcyhwb2ludCk7XG4gICAgfTtcbiAgICByZXR1cm4gUGxheWVkVGlsZVJlbmRlcmVyO1xufSgpKTtcbnZhciBVbnBsYXllZFRpbGVSZW5kZXJlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBVbnBsYXllZFRpbGVSZW5kZXJlcih0aWxlSWR4LCBsYXN0Um93LCBoZXhSYWRpdXMsIHRpbGUpIHtcbiAgICAgICAgdGhpcy50aWxlSWR4ID0gdGlsZUlkeDtcbiAgICAgICAgdGhpcy5sYXN0Um93ID0gbGFzdFJvdztcbiAgICAgICAgdGhpcy5oZXhSYWRpdXMgPSBoZXhSYWRpdXM7XG4gICAgICAgIHRoaXMudGlsZSA9IHRpbGU7XG4gICAgICAgIHRoaXMuaGV4YWdvblJlbmRlcmVyID0gbmV3IEhleGFnb25SZW5kZXJlcih0aWxlSWR4LCBsYXN0Um93LCBoZXhSYWRpdXMpO1xuICAgICAgICB0aGlzLmhleGFnb25SZW5kZXJlci5zZXRGaWxsKFwiYmxhY2tcIik7XG4gICAgfVxuICAgIFVucGxheWVkVGlsZVJlbmRlcmVyLnByb3RvdHlwZS5zZXRGaWxsID0gZnVuY3Rpb24gKGZpbGwpIHtcbiAgICAgICAgdGhpcy5oZXhhZ29uUmVuZGVyZXIuc2V0RmlsbChmaWxsKTtcbiAgICB9O1xuICAgIFVucGxheWVkVGlsZVJlbmRlcmVyLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24gKGN0eCkge1xuICAgICAgICB0aGlzLmhleGFnb25SZW5kZXJlci5kcmF3KGN0eCk7XG4gICAgICAgIHZhciBoZXhSYWRpdXMgPSB0aGlzLmhleFJhZGl1cztcbiAgICAgICAgdmFyIF9hID0gdGhpcy5oZXhhZ29uUmVuZGVyZXIuZ2V0TWlkcG9pbnQoKSwgeCA9IF9hWzBdLCB5ID0gX2FbMV07XG4gICAgICAgIHZhciBkb3RSYWRpdXMgPSBoZXhSYWRpdXMgKiAwLjE7XG4gICAgICAgIHRoaXMudGlsZS5zaWRlcy5mb3JFYWNoKGZ1bmN0aW9uIChzaWRlLCBpZHgpIHtcbiAgICAgICAgICAgIGlmIChzaWRlICE9PSAxKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIHZhciBhbmdsZVRvUG9pbnQgPSBkZWc2MCAqIGlkeCAtIGRlZzYwICogMjtcbiAgICAgICAgICAgIHZhciB4T2Zmc2V0ID0gMC43ICogaGV4UmFkaXVzICogTWF0aC5jb3MoYW5nbGVUb1BvaW50KTtcbiAgICAgICAgICAgIHZhciB5T2Zmc2V0ID0gMC43ICogaGV4UmFkaXVzICogTWF0aC5zaW4oYW5nbGVUb1BvaW50KTtcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGN0eC5lbGxpcHNlKHggKyB4T2Zmc2V0LCB5ICsgeU9mZnNldCwgZG90UmFkaXVzLCBkb3RSYWRpdXMsIDAsIDAsIDIgKiBNYXRoLlBJKTtcbiAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBcIndoaXRlXCI7XG4gICAgICAgICAgICBjdHguZmlsbCgpO1xuICAgICAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFVucGxheWVkVGlsZVJlbmRlcmVyLnByb3RvdHlwZS5pc1dpdGhpbkJvdW5kcyA9IGZ1bmN0aW9uIChwb2ludCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oZXhhZ29uUmVuZGVyZXIuaXNXaXRoaW5Cb3VuZHMocG9pbnQpO1xuICAgIH07XG4gICAgcmV0dXJuIFVucGxheWVkVGlsZVJlbmRlcmVyO1xufSgpKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5UaWxlID0gdm9pZCAwO1xudmFyIFRpbGUgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gVGlsZSh2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUgPiA2MylcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRpbGUgdmFsdWUgXCIuY29uY2F0KHZhbHVlLCBcIiB0b28gaGlnaCFcIikpO1xuICAgICAgICBpZiAodmFsdWUgPCAwKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGlsZSB2YWx1ZSBcIi5jb25jYXQodmFsdWUsIFwiIHRvbyBsb3chXCIpKTtcbiAgICAgICAgdmFyIHBhZGRlZFZhbHVlID0gdmFsdWUgKyA2NDtcbiAgICAgICAgdGhpcy5fc2lkZXMgPSBwYWRkZWRWYWx1ZVxuICAgICAgICAgICAgLnRvU3RyaW5nKDIpXG4gICAgICAgICAgICAuc3BsaXQoXCJcIilcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKGRpZ2l0KSB7IHJldHVybiBwYXJzZUludChkaWdpdCwgMTApOyB9KVxuICAgICAgICAgICAgLnNsaWNlKDEpXG4gICAgICAgICAgICAucmV2ZXJzZSgpO1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVGlsZS5wcm90b3R5cGUsIFwic2lkZXNcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zaWRlcztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIFRpbGUucHJvdG90eXBlLmdldEZhY2VWYWx1ZSA9IGZ1bmN0aW9uIChmYWNlSW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2lkZXNbZmFjZUluZGV4XTtcbiAgICB9O1xuICAgIFRpbGUucHJvdG90eXBlLmdldE9wcG9zaW5nRmFjZVZhbHVlVG8gPSBmdW5jdGlvbiAoZmFjZUluZGV4KSB7XG4gICAgICAgIHZhciBvcHBvc2luZ0ZhY2VJbmRleCA9IChmYWNlSW5kZXggKyAzKSAlIDY7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEZhY2VWYWx1ZShvcHBvc2luZ0ZhY2VJbmRleCk7XG4gICAgfTtcbiAgICBUaWxlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHMgPSB0aGlzLl9zaWRlcztcbiAgICAgICAgcmV0dXJuIFwiXFxuICAgICAgICAgICAgIC9cIi5jb25jYXQoc1swXSwgXCIgIFwiKS5jb25jYXQoc1sxXSwgXCJcXFxcXFxuICAgICAgICAgICAgfFwiKS5jb25jYXQoc1s1XSwgXCIgICAgXCIpLmNvbmNhdChzWzJdLCBcInxcXG4gICAgICAgICAgICAgXFxcXFwiKS5jb25jYXQoc1s0XSwgXCIgIFwiKS5jb25jYXQoc1szXSwgXCIvXFxuICAgICAgICBcIik7XG4gICAgfTtcbiAgICBUaWxlLnByb3RvdHlwZS5yb3RhdGVDbG9ja3dpc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBsYXN0ID0gdGhpcy5fc2lkZXMucG9wKCk7XG4gICAgICAgIHRoaXMuX3NpZGVzLnVuc2hpZnQobGFzdCk7XG4gICAgfTtcbiAgICBUaWxlLnByb3RvdHlwZS5yb3RhdGVDb3VudGVyQ2xvY2t3aXNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbGFzdCA9IHRoaXMuX3NpZGVzLnNoaWZ0KCk7XG4gICAgICAgIHRoaXMuX3NpZGVzLnB1c2gobGFzdCk7XG4gICAgfTtcbiAgICByZXR1cm4gVGlsZTtcbn0oKSk7XG5leHBvcnRzLlRpbGUgPSBUaWxlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLm1hdHJpeCA9IHZvaWQgMDtcbmZ1bmN0aW9uIG1hdHJpeChtLCBuLCBkZWZhdWx0VmFsdWUpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh7XG4gICAgICAgIC8vIGdlbmVyYXRlIGFycmF5IG9mIGxlbmd0aCBtXG4gICAgICAgIGxlbmd0aDogbVxuICAgICAgICAvLyBpbnNpZGUgbWFwIGZ1bmN0aW9uIGdlbmVyYXRlIGFycmF5IG9mIHNpemUgblxuICAgICAgICAvLyBhbmQgZmlsbCBpdCB3aXRoIGAwYFxuICAgIH0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBBcnJheShuKS5maWxsKGRlZmF1bHRWYWx1ZSk7IH0pO1xufVxuZXhwb3J0cy5tYXRyaXggPSBtYXRyaXg7XG47XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgZ2FtZV8xID0gcmVxdWlyZShcIi4vZ2FtZVwiKTtcbnZhciByZW5kZXJlcl8xID0gcmVxdWlyZShcIi4vcmVuZGVyZXJcIik7XG52YXIgcmVuZGVyZXIgPSBuZXcgcmVuZGVyZXJfMS5SZW5kZXJlcigpO1xudmFyIHAxID0gbmV3IGdhbWVfMS5QbGF5ZXIoXCJQbGF5ZXIgMVwiKTtcbnZhciBwMiA9IG5ldyBnYW1lXzEuUGxheWVyKFwiUGxheWVyIDJcIik7XG52YXIgZ2FtZSA9IG5ldyBnYW1lXzEuR2FtZShbcDEsIHAyXSk7XG52YXIgbWFpbiA9IGZ1bmN0aW9uICgpIHtcbiAgICByZW5kZXJlci5yZW5kZXIoZ2FtZSk7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKG1haW4pO1xufTtcbm1haW4oKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==