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
var _ = require("lodash");
var paramController = require("./param");
var logController = require("./log");
var rollbitHistory_1 = require("../models/rollbitHistory");
var enum_1 = require("../helpers/enum");
var RollbitLogger = /** @class */ (function () {
    function RollbitLogger() {
        this.items = [];
        this.normalizedItems = [];
        this.existingItems = [];
        this.itemsToInsert = [];
    }
    RollbitLogger.prototype.getCookie = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cookieParam;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, paramController.getRollbitCookie()];
                    case 1:
                        cookieParam = _a.sent();
                        if (!cookieParam)
                            throw new Error("Cookie not found");
                        return [2 /*return*/, cookieParam.value.toString()];
                }
            });
        });
    };
    Object.defineProperty(RollbitLogger.prototype, "requestConfig", {
        get: function () {
            return {
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': this.cookie,
                    'Host': 'api.rollbit.com',
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.122 Safari/537.36'
                }
            };
        },
        enumerable: true,
        configurable: true
    });
    RollbitLogger.prototype.startLogging = function () {
        return __awaiter(this, void 0, void 0, function () {
            var that, _a, allItemsPromise, existingItemsPromise, promiseResult, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        that = this;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 5, 6, 7]);
                        _a = that;
                        return [4 /*yield*/, that.getCookie()];
                    case 2:
                        _a.cookie = _b.sent();
                        allItemsPromise = that.getAllItems();
                        existingItemsPromise = that.getExistingItems();
                        return [4 /*yield*/, Promise.all([allItemsPromise, existingItemsPromise])];
                    case 3:
                        promiseResult = _b.sent();
                        that.items = promiseResult[0];
                        that.existingItems = promiseResult[1];
                        that.normalizedItems = that.normalizeItems();
                        that.itemsToInsert = that.getItemsToInsert();
                        return [4 /*yield*/, that.saveNewItems()];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 5:
                        e_1 = _b.sent();
                        that.handleError(e_1.message);
                        return [3 /*break*/, 7];
                    case 6:
                        that.startLogging();
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    RollbitLogger.prototype.getAllItems = function () {
        return __awaiter(this, void 0, void 0, function () {
            var allItems, newItemExist, maxPrice, iterationLimit, iteration, currentResult, currentItems, minItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        allItems = [];
                        newItemExist = true;
                        maxPrice = 500;
                        iterationLimit = 2;
                        iteration = 0;
                        _a.label = 1;
                    case 1:
                        if (!(newItemExist && iteration < iterationLimit)) return [3 /*break*/, 3];
                        iteration++;
                        return [4 /*yield*/, this.getItems(maxPrice)];
                    case 2:
                        currentResult = _a.sent();
                        currentItems = currentResult.items;
                        if (currentItems.length > 0) {
                            currentItems.forEach(function (i) { return allItems.push(i); });
                            minItem = _.last(allItems);
                            if (!minItem) {
                                newItemExist = false;
                            }
                            else {
                                maxPrice = minItem.price;
                            }
                        }
                        else {
                            newItemExist = false;
                        }
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/, allItems];
                }
            });
        });
    };
    RollbitLogger.prototype.getExistingItems = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, rollbitHistory_1.default.find({})];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    RollbitLogger.prototype.getItems = function (maxPrice) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get("https://api.rollbit.com/steam/market?query&order=1&showTradelocked=false&showCustomPriced=true&min=5&max=" + maxPrice, this.requestConfig)];
                    case 1: return [2 /*return*/, (_a.sent()).data];
                }
            });
        });
    };
    RollbitLogger.prototype.normalizeItems = function () {
        var normalizeItems = [];
        this.items.forEach(function (i) {
            normalizeItems.push({
                ref: i.ref,
                price: i.price,
                markup: i.markup,
                name: i.items.map(function (ii) { return ii.name; }).join("#"),
                weapon: i.items.map(function (ii) { return ii.weapon; }).join("#"),
                skin: i.items.map(function (ii) { return ii.skin; }).join("#"),
                rarity: i.items.map(function (ii) { return ii.rarity; }).join("#"),
                exterior: i.items.map(function (ii) { return ii.exterior; }).join("#"),
                baseprice: _.sumBy(i.items, function (ii) { return ii.price; }),
            });
        });
        return normalizeItems;
    };
    RollbitLogger.prototype.getItemsToInsert = function () {
        var _this = this;
        var itemsToInsert = [];
        this.normalizedItems.forEach(function (i) {
            var foundItem = _.find(_this.existingItems, function (ei) { return (ei.ref === i.ref && ei.price === i.price); });
            if (!foundItem) {
                var itemToInsert = new rollbitHistory_1.default({
                    ref: i.ref,
                    price: i.price,
                    markup: i.markup,
                    name: i.name,
                    weapon: i.weapon,
                    skin: i.skin,
                    rarity: i.rarity,
                    exterior: i.exterior,
                    baseprice: i.baseprice
                });
                itemsToInsert.push(itemToInsert);
            }
        });
        return itemsToInsert;
    };
    RollbitLogger.prototype.saveNewItems = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.itemsToInsert.length == 0)
                            return [2 /*return*/];
                        return [4 /*yield*/, rollbitHistory_1.default.insertMany(this.itemsToInsert)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    RollbitLogger.prototype.handleError = function (message) {
        this.log("Error: " + message);
    };
    RollbitLogger.prototype.log = function (message) {
        return logController.create(enum_1.siteEnum.Rollbit, message);
    };
    return RollbitLogger;
}());
exports.RollbitLogger = RollbitLogger;
