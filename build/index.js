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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsNkJBQTZCO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsWUFBWTs7Ozs7Ozs7Ozs7QUM3Q0M7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUssZ0JBQWdCLHlDQUF5QztBQUM5RDtBQUNBLGNBQWM7QUFDZDs7Ozs7OztVQ1pBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7Ozs7QUN0QmE7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsYUFBYSxtQkFBTyxDQUFDLDZCQUFRO0FBQzdCLGlCQUFpQixtQkFBTyxDQUFDLHFDQUFZO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL25lb2RvbWluby8uL3NyYy9nYW1lLnRzIiwid2VicGFjazovL25lb2RvbWluby8uL3NyYy9yZW5kZXJlci50cyIsIndlYnBhY2s6Ly9uZW9kb21pbm8vLi9zcmMvdGlsZS50cyIsIndlYnBhY2s6Ly9uZW9kb21pbm8vLi9zcmMvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vbmVvZG9taW5vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL25lb2RvbWluby8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuR2FtZSA9IGV4cG9ydHMuUGxheWVyID0gdm9pZCAwO1xudmFyIHRpbGVfMSA9IHJlcXVpcmUoXCIuL3RpbGVcIik7XG52YXIgdXRpbHNfMSA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xudmFyIFBsYXllciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBQbGF5ZXIobmFtZSkge1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLl90aWxlcyA9IFtdO1xuICAgICAgICB0aGlzLl9wb2ludHMgPSAwO1xuICAgIH1cbiAgICBQbGF5ZXIucHJvdG90eXBlLmdpdmVUaWxlID0gZnVuY3Rpb24gKHRpbGUpIHtcbiAgICAgICAgdGhpcy5fdGlsZXMucHVzaCh0aWxlKTtcbiAgICB9O1xuICAgIFBsYXllci5wcm90b3R5cGUudGFrZVRpbGUgPSBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcihcIk5vIHRpbGUgaW4gdGhhdCBwb3NpdGlvbiFcIik7XG4gICAgICAgIGlmIChpbmRleCA+PSB0aGlzLl90aWxlcy5sZW5ndGgpXG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIGlmIChpbmRleCA8IDApXG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIHZhciB0aWxlID0gdGhpcy5fdGlsZXMuc3BsaWNlKGluZGV4LCAxKVswXTtcbiAgICAgICAgaWYgKCF0aWxlKVxuICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICByZXR1cm4gdGlsZTtcbiAgICB9O1xuICAgIFBsYXllci5wcm90b3R5cGUuYXdhcmRQb2ludHMgPSBmdW5jdGlvbiAocG9pbnRzKSB7XG4gICAgICAgIHRoaXMuX3BvaW50cyArPSBwb2ludHM7XG4gICAgfTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUGxheWVyLnByb3RvdHlwZSwgXCJ0aWxlc1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RpbGVzLnNsaWNlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUGxheWVyLnByb3RvdHlwZSwgXCJwb2ludHNcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wb2ludHM7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBQbGF5ZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gXCJcIi5jb25jYXQodGhpcy5uYW1lLCBcIjogXCIpLmNvbmNhdCh0aGlzLnBvaW50cywgXCIgcG9pbnRzXCIpO1xuICAgIH07XG4gICAgcmV0dXJuIFBsYXllcjtcbn0oKSk7XG5leHBvcnRzLlBsYXllciA9IFBsYXllcjtcbnZhciBHYW1lID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEdhbWUocGxheWVycykge1xuICAgICAgICB0aGlzLmN1cnJlbnRQbGF5ZXJJbmRleCA9IDA7XG4gICAgICAgIGlmIChwbGF5ZXJzLmxlbmd0aCA8IDIpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNaW5pbXVtIDIgcGxheWVycyFcIik7XG4gICAgICAgIGlmIChwbGF5ZXJzLmxlbmd0aCA+IDQpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNYXhpbXVtIDQgcGxheWVycyFcIik7XG4gICAgICAgIHRoaXMuX2JvYXJkID0gKDAsIHV0aWxzXzEubWF0cml4KSg4LCA4LCB1bmRlZmluZWQpO1xuICAgICAgICB0aGlzLmRyYXdQaWxlID0gbmV3IEFycmF5KDY0KVxuICAgICAgICAgICAgLmZpbGwoMClcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKHZhbCwgaSkgeyByZXR1cm4gaTsgfSlcbiAgICAgICAgICAgIC8vIC5zbGljZSgxKSAvLyByZW1vdmUgMCB2YWx1ZSB0aWxlIHRvIHB1dCBpbiBtaWRkbGUgb2YgYm9hcmRcbiAgICAgICAgICAgIC5zb3J0KGZ1bmN0aW9uICgpIHsgcmV0dXJuIE1hdGgucmFuZG9tKCkgLSAwLjU7IH0pIC8vIHNodWZmbGVcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKHZhbCkgeyByZXR1cm4gbmV3IHRpbGVfMS5UaWxlKHZhbCk7IH0pO1xuICAgICAgICB0aGlzLl9ib2FyZFszXVszXSA9IHRoaXMuZHJhd1BpbGUucG9wKCk7XG4gICAgICAgIHRoaXMucGxheWVycyA9IHBsYXllcnM7XG4gICAgICAgIHRoaXMuZGlzdHJpYnV0ZVRpbGVzKDQpO1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoR2FtZS5wcm90b3R5cGUsIFwiYm9hcmRcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ib2FyZC5zbGljZSgpO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgR2FtZS5wcm90b3R5cGUuZGlzdHJpYnV0ZVRpbGVzID0gZnVuY3Rpb24gKGNvdW50KSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMucGxheWVycy5mb3JFYWNoKGZ1bmN0aW9uIChwbGF5ZXIpIHtcbiAgICAgICAgICAgIHdoaWxlIChwbGF5ZXIudGlsZXMubGVuZ3RoIDwgY291bnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGlsZSA9IF90aGlzLmRyYXdQaWxlLnBvcCgpO1xuICAgICAgICAgICAgICAgIGlmICghdGlsZSlcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiT3V0IG9mIHRpbGVzIVwiKTtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuZ2l2ZVRpbGUodGlsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgR2FtZS5wcm90b3R5cGUucGxhY2VUaWxlID0gZnVuY3Rpb24gKHBsYXllciwgdGlsZUlkeCwgeCwgeSkge1xuICAgICAgICBpZiAoIXRoaXMuaXNWYWxpZFBvc2l0aW9uKHgsIHkpKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUG9zaXRpb24gb3V0IG9mIGJvdW5kcyFcIik7XG4gICAgICAgIHZhciBleGlzdGluZ1RpbGUgPSB0aGlzLmdldFRpbGVBdCh4LCB5KTtcbiAgICAgICAgaWYgKGV4aXN0aW5nVGlsZSlcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNwYWNlIGFscmVhZHkgb2NjdXBpZWQhXCIpO1xuICAgICAgICBpZiAodGhpcy5uZWlnaGJvdXJDb3VudCh4LCB5KSA9PT0gMClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgcGxhY2UgYSB0aWxlIGFnYWluc3QgYW5vdGhlciBvbmVcIik7XG4gICAgICAgIGlmIChwbGF5ZXIgIT09IHRoaXMuY3VycmVudFBsYXllcilcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBcIi5jb25jYXQocGxheWVyLm5hbWUsIFwiJ3MgdHVybiFcIikpO1xuICAgICAgICB2YXIgdGlsZSA9IHBsYXllci50YWtlVGlsZSh0aWxlSWR4KTtcbiAgICAgICAgdGhpcy5zZXRUaWxlQXQodGlsZSwgeCwgeSk7XG4gICAgICAgIHZhciBwb2ludHMgPSB0aGlzLmNhbGN1bGF0ZVBvaW50c0ZvclRpbGUoeCwgeSk7XG4gICAgICAgIHRoaXMuY3VycmVudFBsYXllci5hd2FyZFBvaW50cyhwb2ludHMpO1xuICAgICAgICB2YXIgZHJhd25UaWxlID0gdGhpcy5kcmF3UGlsZS5wb3AoKTtcbiAgICAgICAgaWYgKGRyYXduVGlsZSlcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBsYXllci5naXZlVGlsZShkcmF3blRpbGUpO1xuICAgICAgICBpZiAodGhpcy5wbGF5ZXJzLmV2ZXJ5KGZ1bmN0aW9uIChwbGF5ZXIpIHsgcmV0dXJuIHBsYXllci50aWxlcy5sZW5ndGggPT09IDA7IH0pKSB7XG4gICAgICAgICAgICBhbGVydChcIkdhbWUgb3ZlciwgZmluYWwgcG9pbnRzOiBcIi5jb25jYXQodGhpcy5wbGF5ZXJzLm1hcChmdW5jdGlvbiAocGxheWVyKSB7IHJldHVybiBwbGF5ZXIudG9TdHJpbmcoKTsgfSkuam9pbihcIiwgXCIpKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdXJyZW50UGxheWVySW5kZXggKz0gMTtcbiAgICAgICAgdGhpcy5jdXJyZW50UGxheWVySW5kZXggPSB0aGlzLmN1cnJlbnRQbGF5ZXJJbmRleCAlIHRoaXMucGxheWVycy5sZW5ndGg7XG4gICAgfTtcbiAgICBHYW1lLnByb3RvdHlwZS5jYWxjdWxhdGVQb2ludHNGb3JUaWxlID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgdmFyIHRpbGUgPSB0aGlzLmdldFRpbGVBdCh4LCB5KTtcbiAgICAgICAgaWYgKCF0aWxlKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gdGlsZSB0byBjYWxjdWxhdGUhXCIpO1xuICAgICAgICB2YXIgbmVpZ2hib3VyVmFsdWVzID0gdGhpcy5nZXROZWlnaGJvdXJpbmdWYWx1ZXNUbyh4LCB5KTtcbiAgICAgICAgcmV0dXJuIHRpbGUuc2lkZXMucmVkdWNlKGZ1bmN0aW9uIChwb2ludHMsIHNpZGVWYWx1ZSwgc2lkZUluZGV4KSB7XG4gICAgICAgICAgICBpZiAobmVpZ2hib3VyVmFsdWVzW3NpZGVJbmRleF0gPT09IHNpZGVWYWx1ZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gcG9pbnRzICsgMTtcbiAgICAgICAgICAgIHJldHVybiBwb2ludHM7XG4gICAgICAgIH0sIDApO1xuICAgIH07XG4gICAgR2FtZS5wcm90b3R5cGUuZ2V0TmVpZ2hib3VyaW5nVmFsdWVzVG8gPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICB2YXIgdGlsZXMgPSB0aGlzLmdldE5laWdoYm91cmluZ1RpbGVzVG8oeCwgeSk7XG4gICAgICAgIHJldHVybiB0aWxlcy5tYXAoZnVuY3Rpb24gKHRpbGUsIGZhY2VJbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuIHRpbGUgPT09IG51bGwgfHwgdGlsZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogdGlsZS5nZXRPcHBvc2luZ0ZhY2VWYWx1ZVRvKGZhY2VJbmRleCk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgR2FtZS5wcm90b3R5cGUubmVpZ2hib3VyQ291bnQgPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXROZWlnaGJvdXJpbmdUaWxlc1RvKHgsIHkpXG4gICAgICAgICAgICAucmVkdWNlKGZ1bmN0aW9uIChjb3VudCwgdGlsZSkge1xuICAgICAgICAgICAgaWYgKHRpbGUpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvdW50ICsgMTtcbiAgICAgICAgICAgIHJldHVybiBjb3VudDtcbiAgICAgICAgfSwgMCk7XG4gICAgfTtcbiAgICBHYW1lLnByb3RvdHlwZS5nZXROZWlnaGJvdXJpbmdUaWxlc1RvID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgdmFyIGlzRXZlblJvdyA9IHkgJSAyID09PSAwO1xuICAgICAgICB2YXIgcm93T2Zmc2V0ID0gaXNFdmVuUm93ID8gLTEgOiAwO1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgdGhpcy5nZXRUaWxlQXQoeCArIHJvd09mZnNldCwgeSAtIDEpLFxuICAgICAgICAgICAgdGhpcy5nZXRUaWxlQXQoeCArIDEgKyByb3dPZmZzZXQsIHkgLSAxKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0VGlsZUF0KHggKyAxLCB5KSxcbiAgICAgICAgICAgIHRoaXMuZ2V0VGlsZUF0KHggKyAxICsgcm93T2Zmc2V0LCB5ICsgMSksXG4gICAgICAgICAgICB0aGlzLmdldFRpbGVBdCh4ICsgcm93T2Zmc2V0LCB5ICsgMSksXG4gICAgICAgICAgICB0aGlzLmdldFRpbGVBdCh4IC0gMSwgeSkgLy8gbGVmdFxuICAgICAgICBdO1xuICAgIH07XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEdhbWUucHJvdG90eXBlLCBcImN1cnJlbnRQbGF5ZXJcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBsYXllcnNbdGhpcy5jdXJyZW50UGxheWVySW5kZXhdO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgR2FtZS5wcm90b3R5cGUuZ2V0VGlsZUF0ID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWRQb3NpdGlvbih4LCB5KSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2JvYXJkW3ldW3hdO1xuICAgIH07XG4gICAgR2FtZS5wcm90b3R5cGUuc2V0VGlsZUF0ID0gZnVuY3Rpb24gKHRpbGUsIHgsIHkpIHtcbiAgICAgICAgdGhpcy5fYm9hcmRbeV1beF0gPSB0aWxlO1xuICAgIH07XG4gICAgR2FtZS5wcm90b3R5cGUuaXNWYWxpZFBvc2l0aW9uID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgaWYgKHggPCAwKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiAoeSA8IDApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmICh5ID49IHRoaXMuYm9hcmQubGVuZ3RoKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiAoeCA+PSB0aGlzLmJvYXJkWzBdLmxlbmd0aClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcbiAgICBHYW1lLnByb3RvdHlwZS5wcmludCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5wbGF5ZXJzLmZvckVhY2goZnVuY3Rpb24gKHBsYXllcikgeyByZXR1cm4gY29uc29sZS5sb2cocGxheWVyLnRvU3RyaW5nKCkpOyB9KTtcbiAgICAgICAgdGhpcy5fYm9hcmQubWFwKGZ1bmN0aW9uIChyb3csIHJvd0luZGV4KSB7XG4gICAgICAgICAgICB2YXIgaXNPZGQgPSByb3dJbmRleCAlIDIgPT09IDE7XG4gICAgICAgICAgICB2YXIgc3BhY2luZyA9IGlzT2RkID8gXCIgXCIgOiBcIlwiO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJcIi5jb25jYXQoc3BhY2luZykuY29uY2F0KHJvdy5tYXAoZnVuY3Rpb24gKHRpbGUpIHsgcmV0dXJuICEhdGlsZSA/IDEgOiAwOyB9KS5qb2luKFwiLlwiKSkpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIHJldHVybiBHYW1lO1xufSgpKTtcbmV4cG9ydHMuR2FtZSA9IEdhbWU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUmVuZGVyZXIgPSB2b2lkIDA7XG52YXIgZGVnNjAgPSBNYXRoLlBJIC8gMztcbnZhciBkZWczMCA9IE1hdGguUEkgLyA2O1xudmFyIFJlbmRlcmVyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFJlbmRlcmVyKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluJyk7XG4gICAgICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgdGhpcy5oZXhSYWRpdXMgPSA0MDtcbiAgICAgICAgdGhpcy5tb3VzZVBvc2l0aW9uID0geyB4OiAwLCB5OiAwIH07XG4gICAgICAgIHdpbmRvdy5vbmtleWRvd24gPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICAgICAgaWYgKF90aGlzLmZvY3Vzc2VkVGlsZSAmJiBlLmtleSA9PT0gXCJxXCIgfHwgZS5rZXkgPT09IFwiUVwiKSB7XG4gICAgICAgICAgICAgICAgKF9hID0gX3RoaXMuZm9jdXNzZWRUaWxlKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Eucm90YXRlQ291bnRlckNsb2Nrd2lzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoX3RoaXMuZm9jdXNzZWRUaWxlICYmIGUua2V5ID09PSBcImVcIiB8fCBlLmtleSA9PT0gXCJFXCIpIHtcbiAgICAgICAgICAgICAgICAoX2IgPSBfdGhpcy5mb2N1c3NlZFRpbGUpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5yb3RhdGVDbG9ja3dpc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5jYW52YXMub25tb3VzZW1vdmUgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgdmFyIHJlY3QgPSBfdGhpcy5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICBfdGhpcy5tb3VzZVBvc2l0aW9uLnggPSBlLmNsaWVudFggLSByZWN0LmxlZnQ7XG4gICAgICAgICAgICBfdGhpcy5tb3VzZVBvc2l0aW9uLnkgPSBlLmNsaWVudFkgLSByZWN0LnRvcDtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5jYW52YXMub25jbGljayA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBpZiAoIV90aGlzLmdhbWUpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgdmFyIGVsZW1lbnRzID0gX3RoaXMuZ2V0RWxlbWVudHMoX3RoaXMuZ2FtZSk7XG4gICAgICAgICAgICB2YXIgcmVjdCA9IF90aGlzLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIF90aGlzLm1vdXNlUG9zaXRpb24ueCA9IGUuY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgICAgICAgICAgIF90aGlzLm1vdXNlUG9zaXRpb24ueSA9IGUuY2xpZW50WSAtIHJlY3QudG9wO1xuICAgICAgICAgICAgdmFyIGNsaWNrZWRFbGVtZW50ID0gZWxlbWVudHMuZmluZChmdW5jdGlvbiAoZWxlbWVudCkgeyByZXR1cm4gZWxlbWVudC5pc1dpdGhpbkJvdW5kcyhfdGhpcy5tb3VzZVBvc2l0aW9uKTsgfSk7XG4gICAgICAgICAgICBpZiAoY2xpY2tlZEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgX2EgPSBjbGlja2VkRWxlbWVudCwgdGlsZSA9IF9hLnRpbGUsIHRpbGVJZHggPSBfYS50aWxlSWR4O1xuICAgICAgICAgICAgICAgIHZhciBfYiA9IGNsaWNrZWRFbGVtZW50LCBncmlkWCA9IF9iLmdyaWRYLCBncmlkWSA9IF9iLmdyaWRZO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHsgdGlsZTogdGlsZSwgdGlsZUlkeDogdGlsZUlkeCwgZ3JpZFg6IGdyaWRYLCBncmlkWTogZ3JpZFkgfSk7XG4gICAgICAgICAgICAgICAgaWYgKHRpbGUgJiYgdHlwZW9mIHRpbGVJZHggIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuZm9jdXNzZWRUaWxlID0gdGlsZTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuZm9jdXNzZWRUaWxlSWR4ID0gdGlsZUlkeDtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coeyB0aWxlOiB0aWxlLCB0aWxlSWR4OiB0aWxlSWR4IH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgZ3JpZFggIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIGdyaWRZICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG11c3QgYmUgaGV4YWdvbjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF90aGlzLmZvY3Vzc2VkVGlsZSAmJiB0eXBlb2YgX3RoaXMuZm9jdXNzZWRUaWxlSWR4ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhfdGhpcy5nYW1lLmN1cnJlbnRQbGF5ZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuZ2FtZS5wbGFjZVRpbGUoX3RoaXMuZ2FtZS5jdXJyZW50UGxheWVyLCBfdGhpcy5mb2N1c3NlZFRpbGVJZHgsIGdyaWRYLCBncmlkWSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5mb2N1c3NlZFRpbGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5mb2N1c3NlZFRpbGVJZHggPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5mb2N1c3NlZFRpbGVJZHggPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgX3RoaXMuZm9jdXNzZWRUaWxlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICBSZW5kZXJlci5wcm90b3R5cGUuc2V0U2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIH07XG4gICAgUmVuZGVyZXIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIChnYW1lKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMuc2V0U2l6ZSgpO1xuICAgICAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XG4gICAgICAgIHRoaXMuY3R4LmZvbnQgPSBcIjI0cHggQXJpZWxcIjtcbiAgICAgICAgLy8gcmVuZGVyIHBvaW50c1xuICAgICAgICB0aGlzLmN0eC5maWxsVGV4dChcIlBvaW50c1wiLCB0aGlzLmNhbnZhcy53aWR0aCAtIDIwMCwgMjApO1xuICAgICAgICBnYW1lLnBsYXllcnMuZm9yRWFjaChmdW5jdGlvbiAocGxheWVyLCBpKSB7XG4gICAgICAgICAgICB2YXIgeCA9IF90aGlzLmNhbnZhcy53aWR0aCAtIDIwMDtcbiAgICAgICAgICAgIHZhciB5ID0gNzAgKyAzMCAqIGk7XG4gICAgICAgICAgICBpZiAocGxheWVyID09PSBnYW1lLmN1cnJlbnRQbGF5ZXIpXG4gICAgICAgICAgICAgICAgX3RoaXMuY3R4LmZpbGxTdHlsZSA9IFwicmVkXCI7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgX3RoaXMuY3R4LmZpbGxTdHlsZSA9IFwiYmxhY2tcIjtcbiAgICAgICAgICAgIF90aGlzLmN0eC5maWxsVGV4dChcIlwiLmNvbmNhdChwbGF5ZXIubmFtZSwgXCI6IFwiKS5jb25jYXQocGxheWVyLnBvaW50cyksIHgsIHkpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBcInNsYXRlR3JleVwiO1xuICAgICAgICB0aGlzLmdldEVsZW1lbnRzKGdhbWUpLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHsgcmV0dXJuIGVsZW1lbnQuZHJhdyhfdGhpcy5jdHgpOyB9KTtcbiAgICB9O1xuICAgIFJlbmRlcmVyLnByb3RvdHlwZS5nZXRFbGVtZW50cyA9IGZ1bmN0aW9uIChnYW1lKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBncmlkID0gZ2FtZS5ib2FyZDtcbiAgICAgICAgdmFyIGhleFJhZGl1cyA9IHRoaXMuaGV4UmFkaXVzO1xuICAgICAgICAvLyByZW5kZXIgYm9hcmRcbiAgICAgICAgdmFyIGVsZW1lbnRzID0gW107XG4gICAgICAgIGZvciAodmFyIGdyaWRZID0gMDsgZ3JpZFkgPCBncmlkLmxlbmd0aDsgZ3JpZFkrKykge1xuICAgICAgICAgICAgZm9yICh2YXIgZ3JpZFggPSAwOyBncmlkWCA8IGdyaWRbMF0ubGVuZ3RoOyBncmlkWCsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRpbGUgPSBnYW1lLmdldFRpbGVBdChncmlkWCwgZ3JpZFkpO1xuICAgICAgICAgICAgICAgIGlmICh0aWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzLnB1c2gobmV3IFBsYXllZFRpbGVSZW5kZXJlcihncmlkWCwgZ3JpZFksIGhleFJhZGl1cywgdGlsZSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBuZXcgSGV4YWdvblJlbmRlcmVyKGdyaWRYLCBncmlkWSwgaGV4UmFkaXVzKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuaXNXaXRoaW5Cb3VuZHModGhpcy5tb3VzZVBvc2l0aW9uKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zZXRGaWxsKFwicmVkXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzLnB1c2goZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIHJlbmRlciB0aWxlcyBmb3IgY3VycmVudCBwbGF5ZXJcbiAgICAgICAgZ2FtZS5jdXJyZW50UGxheWVyLnRpbGVzLmZvckVhY2goZnVuY3Rpb24gKHRpbGUsIGlkeCkge1xuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBuZXcgVW5wbGF5ZWRUaWxlUmVuZGVyZXIoaWR4LCBnYW1lLmJvYXJkLmxlbmd0aCArIDIsIGhleFJhZGl1cywgdGlsZSk7XG4gICAgICAgICAgICBpZiAodGlsZSA9PT0gX3RoaXMuZm9jdXNzZWRUaWxlKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zZXRGaWxsKFwiYmx1ZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGVsZW1lbnQuaXNXaXRoaW5Cb3VuZHMoX3RoaXMubW91c2VQb3NpdGlvbikpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnNldEZpbGwoXCJncmV5XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxlbWVudHMucHVzaChlbGVtZW50KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBlbGVtZW50cztcbiAgICB9O1xuICAgIHJldHVybiBSZW5kZXJlcjtcbn0oKSk7XG5leHBvcnRzLlJlbmRlcmVyID0gUmVuZGVyZXI7XG52YXIgSGV4YWdvblJlbmRlcmVyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEhleGFnb25SZW5kZXJlcihncmlkWCwgZ3JpZFksIGhleFJhZGl1cykge1xuICAgICAgICB0aGlzLmdyaWRYID0gZ3JpZFg7XG4gICAgICAgIHRoaXMuZ3JpZFkgPSBncmlkWTtcbiAgICAgICAgdGhpcy5oZXhSYWRpdXMgPSBoZXhSYWRpdXM7XG4gICAgICAgIHRoaXMuZmlsbCA9IFwidHJhbnNwYXJlbnRcIjtcbiAgICB9XG4gICAgSGV4YWdvblJlbmRlcmVyLnByb3RvdHlwZS5zZXRGaWxsID0gZnVuY3Rpb24gKGZpbGwpIHtcbiAgICAgICAgdGhpcy5maWxsID0gZmlsbDtcbiAgICB9O1xuICAgIEhleGFnb25SZW5kZXJlci5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uIChjdHgpIHtcbiAgICAgICAgdmFyIF9hID0gdGhpcy5nZXRNaWRwb2ludCgpLCB4ID0gX2FbMF0sIHkgPSBfYVsxXTtcbiAgICAgICAgdmFyIGhleFJhZGl1cyA9IHRoaXMuaGV4UmFkaXVzO1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNjsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYW5nbGVUb1BvaW50ID0gZGVnMzAgKyBkZWc2MCAqIGk7XG4gICAgICAgICAgICB2YXIgeE9mZnNldCA9IGhleFJhZGl1cyAqIE1hdGguY29zKGFuZ2xlVG9Qb2ludCk7XG4gICAgICAgICAgICB2YXIgeU9mZnNldCA9IGhleFJhZGl1cyAqIE1hdGguc2luKGFuZ2xlVG9Qb2ludCk7XG4gICAgICAgICAgICBjdHgubGluZVRvKHggKyB4T2Zmc2V0LCB5ICsgeU9mZnNldCk7XG4gICAgICAgIH1cbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZmlsbDtcbiAgICAgICAgY3R4LmZpbGwoKTtcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfTtcbiAgICBIZXhhZ29uUmVuZGVyZXIucHJvdG90eXBlLmlzV2l0aGluQm91bmRzID0gZnVuY3Rpb24gKHBvaW50KSB7XG4gICAgICAgIHZhciBfYSA9IHRoaXMuZ2V0TWlkcG9pbnQoKSwgeCA9IF9hWzBdLCB5ID0gX2FbMV07XG4gICAgICAgIHZhciB2ZWMgPSB7IHg6IHBvaW50LnggLSB4LCB5OiBwb2ludC55IC0geSB9OyAvLyB2ZWMgZnJvbSBjZW50cmUgb2YgdGhlIGhleCB0byBwb2ludDtcbiAgICAgICAgdmFyIG1hZ25pdHVkZSA9IE1hdGguc3FydChNYXRoLnBvdyh2ZWMueCwgMikgKyBNYXRoLnBvdyh2ZWMueSwgMikpO1xuICAgICAgICB2YXIgYW5nbGVSYWQgPSBNYXRoLmF0YW4yKHZlYy55LCB2ZWMueCk7XG4gICAgICAgIHZhciBwZXJwZW5kaWN1bGFySGVpZ2h0ID0gTWF0aC5zaW4oZGVnNjApICogdGhpcy5oZXhSYWRpdXM7XG4gICAgICAgIHZhciBhbmdsZVJhZFBvcyA9IGFuZ2xlUmFkO1xuICAgICAgICB3aGlsZSAoYW5nbGVSYWRQb3MgPCAwKVxuICAgICAgICAgICAgYW5nbGVSYWRQb3MgKz0gMiAqIE1hdGguUEk7XG4gICAgICAgIHZhciBhbmdsZVJhZE5vcm0gPSBhbmdsZVJhZFBvcyAlIGRlZzMwO1xuICAgICAgICB2YXIgZGlzdGFuY2VUb0VkZ2UgPSBwZXJwZW5kaWN1bGFySGVpZ2h0IC8gTWF0aC5jb3MoYW5nbGVSYWROb3JtKTtcbiAgICAgICAgcmV0dXJuIG1hZ25pdHVkZSA8IGRpc3RhbmNlVG9FZGdlO1xuICAgIH07XG4gICAgSGV4YWdvblJlbmRlcmVyLnByb3RvdHlwZS5nZXRNaWRwb2ludCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHBlcnBlbmRpY3VsYXJIZWlnaHQgPSBNYXRoLnNpbihkZWc2MCkgKiB0aGlzLmhleFJhZGl1cztcbiAgICAgICAgdmFyIGhhbGZFZGdlTGVuZ3RoID0gTWF0aC5jb3MoZGVnNjApICogdGhpcy5oZXhSYWRpdXM7XG4gICAgICAgIHZhciB4T2Zmc2V0ID0gcGVycGVuZGljdWxhckhlaWdodDtcbiAgICAgICAgdmFyIHggPSAodGhpcy5ncmlkWCArIDEpICogcGVycGVuZGljdWxhckhlaWdodCAqIDI7XG4gICAgICAgIHZhciB5ID0gKHRoaXMuZ3JpZFkgKyAxKSAqICh0aGlzLmhleFJhZGl1cyArIGhhbGZFZGdlTGVuZ3RoKTtcbiAgICAgICAgaWYgKHRoaXMuZ3JpZFkgJSAyID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gW3gsIHldO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFt4ICsgeE9mZnNldCwgeV07XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBIZXhhZ29uUmVuZGVyZXI7XG59KCkpO1xudmFyIFBsYXllZFRpbGVSZW5kZXJlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBQbGF5ZWRUaWxlUmVuZGVyZXIoZ3JpZFgsIGdyaWRZLCBoZXhSYWRpdXMsIHRpbGUpIHtcbiAgICAgICAgdGhpcy5ncmlkWCA9IGdyaWRYO1xuICAgICAgICB0aGlzLmdyaWRZID0gZ3JpZFk7XG4gICAgICAgIHRoaXMuaGV4UmFkaXVzID0gaGV4UmFkaXVzO1xuICAgICAgICB0aGlzLnRpbGUgPSB0aWxlO1xuICAgICAgICB0aGlzLmhleGFnb25SZW5kZXJlciA9IG5ldyBIZXhhZ29uUmVuZGVyZXIoZ3JpZFgsIGdyaWRZLCBoZXhSYWRpdXMpO1xuICAgICAgICB0aGlzLmhleGFnb25SZW5kZXJlci5zZXRGaWxsKFwiYmxhY2tcIik7XG4gICAgfVxuICAgIFBsYXllZFRpbGVSZW5kZXJlci5wcm90b3R5cGUuc2V0RmlsbCA9IGZ1bmN0aW9uIChmaWxsKSB7XG4gICAgICAgIHRoaXMuaGV4YWdvblJlbmRlcmVyLnNldEZpbGwoZmlsbCk7XG4gICAgfTtcbiAgICBQbGF5ZWRUaWxlUmVuZGVyZXIucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbiAoY3R4KSB7XG4gICAgICAgIHRoaXMuaGV4YWdvblJlbmRlcmVyLmRyYXcoY3R4KTtcbiAgICAgICAgdmFyIGhleFJhZGl1cyA9IHRoaXMuaGV4UmFkaXVzO1xuICAgICAgICB2YXIgX2EgPSB0aGlzLmhleGFnb25SZW5kZXJlci5nZXRNaWRwb2ludCgpLCB4ID0gX2FbMF0sIHkgPSBfYVsxXTtcbiAgICAgICAgdmFyIGRvdFJhZGl1cyA9IGhleFJhZGl1cyAqIDAuMTtcbiAgICAgICAgdGhpcy50aWxlLnNpZGVzLmZvckVhY2goZnVuY3Rpb24gKHNpZGUsIGlkeCkge1xuICAgICAgICAgICAgaWYgKHNpZGUgIT09IDEpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgdmFyIGFuZ2xlVG9Qb2ludCA9IGRlZzYwICogaWR4IC0gZGVnNjAgKiAyO1xuICAgICAgICAgICAgdmFyIHhPZmZzZXQgPSAwLjcgKiBoZXhSYWRpdXMgKiBNYXRoLmNvcyhhbmdsZVRvUG9pbnQpO1xuICAgICAgICAgICAgdmFyIHlPZmZzZXQgPSAwLjcgKiBoZXhSYWRpdXMgKiBNYXRoLnNpbihhbmdsZVRvUG9pbnQpO1xuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgY3R4LmVsbGlwc2UoeCArIHhPZmZzZXQsIHkgKyB5T2Zmc2V0LCBkb3RSYWRpdXMsIGRvdFJhZGl1cywgMCwgMCwgMiAqIE1hdGguUEkpO1xuICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwid2hpdGVcIjtcbiAgICAgICAgICAgIGN0eC5maWxsKCk7XG4gICAgICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgUGxheWVkVGlsZVJlbmRlcmVyLnByb3RvdHlwZS5pc1dpdGhpbkJvdW5kcyA9IGZ1bmN0aW9uIChwb2ludCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oZXhhZ29uUmVuZGVyZXIuaXNXaXRoaW5Cb3VuZHMocG9pbnQpO1xuICAgIH07XG4gICAgcmV0dXJuIFBsYXllZFRpbGVSZW5kZXJlcjtcbn0oKSk7XG52YXIgVW5wbGF5ZWRUaWxlUmVuZGVyZXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gVW5wbGF5ZWRUaWxlUmVuZGVyZXIodGlsZUlkeCwgbGFzdFJvdywgaGV4UmFkaXVzLCB0aWxlKSB7XG4gICAgICAgIHRoaXMudGlsZUlkeCA9IHRpbGVJZHg7XG4gICAgICAgIHRoaXMubGFzdFJvdyA9IGxhc3RSb3c7XG4gICAgICAgIHRoaXMuaGV4UmFkaXVzID0gaGV4UmFkaXVzO1xuICAgICAgICB0aGlzLnRpbGUgPSB0aWxlO1xuICAgICAgICB0aGlzLmhleGFnb25SZW5kZXJlciA9IG5ldyBIZXhhZ29uUmVuZGVyZXIodGlsZUlkeCwgbGFzdFJvdywgaGV4UmFkaXVzKTtcbiAgICAgICAgdGhpcy5oZXhhZ29uUmVuZGVyZXIuc2V0RmlsbChcImJsYWNrXCIpO1xuICAgIH1cbiAgICBVbnBsYXllZFRpbGVSZW5kZXJlci5wcm90b3R5cGUuc2V0RmlsbCA9IGZ1bmN0aW9uIChmaWxsKSB7XG4gICAgICAgIHRoaXMuaGV4YWdvblJlbmRlcmVyLnNldEZpbGwoZmlsbCk7XG4gICAgfTtcbiAgICBVbnBsYXllZFRpbGVSZW5kZXJlci5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uIChjdHgpIHtcbiAgICAgICAgdGhpcy5oZXhhZ29uUmVuZGVyZXIuZHJhdyhjdHgpO1xuICAgICAgICB2YXIgaGV4UmFkaXVzID0gdGhpcy5oZXhSYWRpdXM7XG4gICAgICAgIHZhciBfYSA9IHRoaXMuaGV4YWdvblJlbmRlcmVyLmdldE1pZHBvaW50KCksIHggPSBfYVswXSwgeSA9IF9hWzFdO1xuICAgICAgICB2YXIgZG90UmFkaXVzID0gaGV4UmFkaXVzICogMC4xO1xuICAgICAgICB0aGlzLnRpbGUuc2lkZXMuZm9yRWFjaChmdW5jdGlvbiAoc2lkZSwgaWR4KSB7XG4gICAgICAgICAgICBpZiAoc2lkZSAhPT0gMSlcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB2YXIgYW5nbGVUb1BvaW50ID0gZGVnNjAgKiBpZHggLSBkZWc2MCAqIDI7XG4gICAgICAgICAgICB2YXIgeE9mZnNldCA9IDAuNyAqIGhleFJhZGl1cyAqIE1hdGguY29zKGFuZ2xlVG9Qb2ludCk7XG4gICAgICAgICAgICB2YXIgeU9mZnNldCA9IDAuNyAqIGhleFJhZGl1cyAqIE1hdGguc2luKGFuZ2xlVG9Qb2ludCk7XG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBjdHguZWxsaXBzZSh4ICsgeE9mZnNldCwgeSArIHlPZmZzZXQsIGRvdFJhZGl1cywgZG90UmFkaXVzLCAwLCAwLCAyICogTWF0aC5QSSk7XG4gICAgICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJ3aGl0ZVwiO1xuICAgICAgICAgICAgY3R4LmZpbGwoKTtcbiAgICAgICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBVbnBsYXllZFRpbGVSZW5kZXJlci5wcm90b3R5cGUuaXNXaXRoaW5Cb3VuZHMgPSBmdW5jdGlvbiAocG9pbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGV4YWdvblJlbmRlcmVyLmlzV2l0aGluQm91bmRzKHBvaW50KTtcbiAgICB9O1xuICAgIHJldHVybiBVbnBsYXllZFRpbGVSZW5kZXJlcjtcbn0oKSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuVGlsZSA9IHZvaWQgMDtcbnZhciBUaWxlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFRpbGUodmFsdWUpIHtcbiAgICAgICAgaWYgKHZhbHVlID4gNjMpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaWxlIHZhbHVlIFwiLmNvbmNhdCh2YWx1ZSwgXCIgdG9vIGhpZ2ghXCIpKTtcbiAgICAgICAgaWYgKHZhbHVlIDwgMClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRpbGUgdmFsdWUgXCIuY29uY2F0KHZhbHVlLCBcIiB0b28gbG93IVwiKSk7XG4gICAgICAgIHZhciBwYWRkZWRWYWx1ZSA9IHZhbHVlICsgNjQ7XG4gICAgICAgIHRoaXMuX3NpZGVzID0gcGFkZGVkVmFsdWVcbiAgICAgICAgICAgIC50b1N0cmluZygyKVxuICAgICAgICAgICAgLnNwbGl0KFwiXCIpXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChkaWdpdCkgeyByZXR1cm4gcGFyc2VJbnQoZGlnaXQsIDEwKTsgfSlcbiAgICAgICAgICAgIC5zbGljZSgxKVxuICAgICAgICAgICAgLnJldmVyc2UoKTtcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFRpbGUucHJvdG90eXBlLCBcInNpZGVzXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2lkZXM7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBUaWxlLnByb3RvdHlwZS5nZXRGYWNlVmFsdWUgPSBmdW5jdGlvbiAoZmFjZUluZGV4KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNpZGVzW2ZhY2VJbmRleF07XG4gICAgfTtcbiAgICBUaWxlLnByb3RvdHlwZS5nZXRPcHBvc2luZ0ZhY2VWYWx1ZVRvID0gZnVuY3Rpb24gKGZhY2VJbmRleCkge1xuICAgICAgICB2YXIgb3Bwb3NpbmdGYWNlSW5kZXggPSAoZmFjZUluZGV4ICsgMykgJSA2O1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRGYWNlVmFsdWUob3Bwb3NpbmdGYWNlSW5kZXgpO1xuICAgIH07XG4gICAgVGlsZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzID0gdGhpcy5fc2lkZXM7XG4gICAgICAgIHJldHVybiBcIlxcbiAgICAgICAgICAgICAvXCIuY29uY2F0KHNbMF0sIFwiICBcIikuY29uY2F0KHNbMV0sIFwiXFxcXFxcbiAgICAgICAgICAgIHxcIikuY29uY2F0KHNbNV0sIFwiICAgIFwiKS5jb25jYXQoc1syXSwgXCJ8XFxuICAgICAgICAgICAgIFxcXFxcIikuY29uY2F0KHNbNF0sIFwiICBcIikuY29uY2F0KHNbM10sIFwiL1xcbiAgICAgICAgXCIpO1xuICAgIH07XG4gICAgVGlsZS5wcm90b3R5cGUucm90YXRlQ2xvY2t3aXNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbGFzdCA9IHRoaXMuX3NpZGVzLnBvcCgpO1xuICAgICAgICB0aGlzLl9zaWRlcy51bnNoaWZ0KGxhc3QpO1xuICAgIH07XG4gICAgVGlsZS5wcm90b3R5cGUucm90YXRlQ291bnRlckNsb2Nrd2lzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGxhc3QgPSB0aGlzLl9zaWRlcy5zaGlmdCgpO1xuICAgICAgICB0aGlzLl9zaWRlcy5wdXNoKGxhc3QpO1xuICAgIH07XG4gICAgcmV0dXJuIFRpbGU7XG59KCkpO1xuZXhwb3J0cy5UaWxlID0gVGlsZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5tYXRyaXggPSB2b2lkIDA7XG5mdW5jdGlvbiBtYXRyaXgobSwgbiwgZGVmYXVsdFZhbHVlKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20oe1xuICAgICAgICAvLyBnZW5lcmF0ZSBhcnJheSBvZiBsZW5ndGggbVxuICAgICAgICBsZW5ndGg6IG1cbiAgICAgICAgLy8gaW5zaWRlIG1hcCBmdW5jdGlvbiBnZW5lcmF0ZSBhcnJheSBvZiBzaXplIG5cbiAgICAgICAgLy8gYW5kIGZpbGwgaXQgd2l0aCBgMGBcbiAgICB9LCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgQXJyYXkobikuZmlsbChkZWZhdWx0VmFsdWUpOyB9KTtcbn1cbmV4cG9ydHMubWF0cml4ID0gbWF0cml4O1xuO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIGdhbWVfMSA9IHJlcXVpcmUoXCIuL2dhbWVcIik7XG52YXIgcmVuZGVyZXJfMSA9IHJlcXVpcmUoXCIuL3JlbmRlcmVyXCIpO1xudmFyIHJlbmRlcmVyID0gbmV3IHJlbmRlcmVyXzEuUmVuZGVyZXIoKTtcbnZhciBwMSA9IG5ldyBnYW1lXzEuUGxheWVyKFwiUGxheWVyIDFcIik7XG52YXIgcDIgPSBuZXcgZ2FtZV8xLlBsYXllcihcIlBsYXllciAyXCIpO1xudmFyIGdhbWUgPSBuZXcgZ2FtZV8xLkdhbWUoW3AxLCBwMl0pO1xudmFyIG1haW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmVuZGVyZXIucmVuZGVyKGdhbWUpO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShtYWluKTtcbn07XG5tYWluKCk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=