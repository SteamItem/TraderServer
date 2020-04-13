"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var wishlistItemController = require("./wishlistItem");
var paramController = require("./param");
var csgoController = require("./csgo");
var withdrawController = require("./withdraw");
var logController = require("./log");
var helpers = require("../helpers");
var workerHelper = require("../helpers/worker");
var Worker = /** @class */ (function () {
    function Worker() {
        this.itemsToBuy = [];
    }
    Worker.prototype.getCookie = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cookieParam;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, paramController.getCookie()];
                    case 1:
                        cookieParam = _a.sent();
                        if (!cookieParam)
                            throw new Error("Cookie not found");
                        return [2 /*return*/, cookieParam.value.toString()];
                }
            });
        });
    };
    Worker.prototype.getPeriod = function () {
        return __awaiter(this, void 0, void 0, function () {
            var periodParam, period;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, paramController.getPeriod()];
                    case 1:
                        periodParam = _a.sent();
                        if (!periodParam)
                            throw new Error("Period not found");
                        period = Number(periodParam.value);
                        if (!period)
                            throw new Error("Period is invalid");
                        return [2 /*return*/, period];
                }
            });
        });
    };
    Worker.prototype.getWorkerStatus = function () {
        return __awaiter(this, void 0, void 0, function () {
            var workerStatusParam, workerStatus;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, paramController.getWorkerStatus()];
                    case 1:
                        workerStatusParam = _a.sent();
                        if (!workerStatusParam)
                            throw new Error("Worker status not found");
                        workerStatus = Boolean(workerStatusParam.value);
                        return [2 /*return*/, workerStatus];
                }
            });
        });
    };
    Worker.prototype.getWishlistItems = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, wishlistItemController.findAll()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Worker.prototype.getToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, csgoController.getToken()];
                    case 1:
                        token = _a.sent();
                        return [2 /*return*/, token.token.toString()];
                }
            });
        });
    };
    Object.defineProperty(Worker.prototype, "requestConfig", {
        get: function () {
            return {
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': this.cookie,
                    'Host': 'csgoempire.gg'
                }
            };
        },
        enumerable: true,
        configurable: true
    });
    /**
     * work
     */
    Worker.prototype.work = function () {
        return __awaiter(this, void 0, void 0, function () {
            var that, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Started");
                        that = this;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 9, 11, 12]);
                        return [4 /*yield*/, that.prepare()];
                    case 2:
                        _a.sent();
                        if (!(this.workerStatus === true)) return [3 /*break*/, 6];
                        console.log("Working");
                        return [4 /*yield*/, that.getItems()];
                    case 3:
                        _a.sent();
                        that.itemsToBuy = workerHelper.generateItemsToBuy(that.storeItems, that.wishlistItems);
                        return [4 /*yield*/, that.tryToWithdrawAll()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, helpers.sleep(that.period)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 6:
                        console.log("Not Working");
                        return [4 /*yield*/, helpers.sleep(1000)];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8: return [3 /*break*/, 12];
                    case 9:
                        e_1 = _a.sent();
                        that.handleError(e_1.message);
                        return [4 /*yield*/, helpers.sleep(1000)];
                    case 10:
                        _a.sent();
                        return [3 /*break*/, 12];
                    case 11:
                        that.work();
                        return [7 /*endfinally*/];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    Worker.prototype.prepare = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cookiePromise, periodPromise, wishlistItemsPromise, tokenPromise, workerStatusPromise, promiseResults;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cookiePromise = this.getCookie();
                        periodPromise = this.getPeriod();
                        wishlistItemsPromise = this.getWishlistItems();
                        tokenPromise = this.getToken();
                        workerStatusPromise = this.getWorkerStatus();
                        return [4 /*yield*/, Promise.all([cookiePromise, periodPromise, wishlistItemsPromise, tokenPromise, workerStatusPromise])];
                    case 1:
                        promiseResults = _a.sent();
                        this.cookie = promiseResults[0];
                        this.period = promiseResults[1];
                        this.wishlistItems = promiseResults[2];
                        this.token = promiseResults[3];
                        this.workerStatus = Boolean(promiseResults[4]);
                        return [2 /*return*/];
                }
            });
        });
    };
    Worker.prototype.getItems = function () {
        return __awaiter(this, void 0, void 0, function () {
            var items;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get('https://csgoempire.gg/api/v2/p2p/inventory/instant', this.requestConfig)];
                    case 1:
                        items = _a.sent();
                        this.storeItems = items.data;
                        return [2 /*return*/];
                }
            });
        });
    };
    Worker.prototype.tryToWithdrawAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var promises;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises = [];
                        this.itemsToBuy.forEach(function (ib) { return promises.push(_this.tryToWithdraw(ib)); });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Worker.prototype.tryToWithdraw = function (ib) {
        return __awaiter(this, void 0, void 0, function () {
            var that, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        that = this;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, that.withdraw(ib.bot_id, ib.store_item_id)];
                    case 2:
                        _a.sent();
                        that.handleSuccessWithdraw(ib);
                        return [2 /*return*/, true];
                    case 3:
                        e_2 = _a.sent();
                        that.handleError(JSON.stringify(e_2.response.data));
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Worker.prototype.withdraw = function (bot_id, item_id) {
        return __awaiter(this, void 0, void 0, function () {
            var data, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = JSON.stringify({
                            "security_token": this.token,
                            "bot_id": bot_id,
                            "item_ids": [item_id]
                        });
                        return [4 /*yield*/, axios_1.default.post('https://csgoempire.gg/api/v2/trade/withdraw', data, this.requestConfig)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.data];
                }
            });
        });
    };
    Worker.prototype.handleSuccessWithdraw = function (ib) {
        var message = ib.market_name + " bought for " + ib.market_value / 100 + "$ which is below " + ib.max_price / 100 + "$";
        this.log(message);
        return withdrawController.create(ib);
    };
    Worker.prototype.handleError = function (message) {
        this.log("Error: " + message);
    };
    Worker.prototype.log = function (message) {
        console.log(message);
        return logController.create(message);
    };
    return Worker;
}());
exports.Worker = Worker;
