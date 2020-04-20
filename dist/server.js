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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var http = require("http");
var config = require("./config");
var paramController = require("./controllers/param");
var wishlistItemController = require("./controllers/wishlistItem");
var csgoController = require("./controllers/csgo");
var logController = require("./controllers/log");
var withdrawController = require("./controllers/withdraw");
var telegram = require("./helpers/telegram");
var PORT = process.env.PORT || 3000;
mongoose.Promise = global.Promise;
// Connecting to the database
mongoose.connect(config.DB_URL, {
    useNewUrlParser: true
}).then(function () {
    console.log("Successfully connected to the database");
}).catch(function (err) {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});
http.createServer(function (request, response) {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    // Send the response body as "Hello World"
    response.end('Hello World\n');
}).listen(PORT);
// Console will print the message
console.log("Server is listening on port " + PORT);
var bot = telegram.getBot();
bot.onText(/\/help/, function (msg) {
    var lines = ['/service: Manage service', '/period: Wait period', '/profile: Profile operations', '/wishlist: Wishlist manager', '/pinUpdate [PIN]: Update pin code', '/log: Read logs'];
    var message = lines.join('\n');
    sendValidatedMessage(msg.chat.id, message);
});
bot.onText(/\/service/, function (msg) {
    sendValidatedMessage(msg.chat.id, 'Manage service', {
        reply_markup: {
            inline_keyboard: [[
                    {
                        text: 'Start',
                        callback_data: 'service.start'
                    }, {
                        text: 'Stop',
                        callback_data: 'service.stop'
                    }, {
                        text: 'Status',
                        callback_data: 'service.status'
                    }
                ]]
        }
    });
});
bot.onText(/\/period/, function (msg) {
    sendValidatedMessage(msg.chat.id, 'Wait time between iterations', {
        reply_markup: {
            inline_keyboard: [[
                    {
                        text: '1 mS',
                        callback_data: 'period.1ms'
                    }, {
                        text: '10 mS',
                        callback_data: 'period.10mS'
                    }, {
                        text: '100 mS',
                        callback_data: 'period.100mS'
                    }
                ], [{
                        text: '1 Second',
                        callback_data: 'period.1s'
                    }, {
                        text: '2 Seconds',
                        callback_data: 'period.2s'
                    }
                ]]
        }
    });
});
bot.onText(/\/pinUpdate (.+)/, function (msg, match) { return __awaiter(_this, void 0, void 0, function () {
    var newPin;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!match) {
                    sendValidatedMessage(msg.chat.id, 'Please provide a pin');
                    return [2 /*return*/];
                }
                newPin = match[1];
                return [4 /*yield*/, paramController.updateCode(newPin)];
            case 1:
                _a.sent();
                sendValidatedMessage(msg.chat.id, "New pin code: " + newPin);
                return [2 /*return*/];
        }
    });
}); });
bot.onText(/\/profile/, function (msg) {
    sendValidatedMessage(msg.chat.id, 'Profile operations', {
        reply_markup: {
            inline_keyboard: [[
                    {
                        text: 'Steam Name',
                        callback_data: 'profile.steamName'
                    }
                ], [{
                        text: 'Balance',
                        callback_data: 'profile.balance'
                    }], [{
                        text: 'Pin',
                        callback_data: 'profile.pin'
                    }
                ]]
        }
    });
});
bot.onText(/\/wishlist/, function (msg) {
    sendValidatedMessage(msg.chat.id, 'Wishlist manager', {
        reply_markup: {
            inline_keyboard: [[
                    {
                        text: 'List',
                        callback_data: 'wishlist.list'
                    }
                ]]
        }
    });
});
bot.onText(/\/log/, function (msg) {
    sendValidatedMessage(msg.chat.id, 'Get logs', {
        reply_markup: {
            inline_keyboard: [[
                    {
                        text: 'All',
                        callback_data: 'log.all'
                    }, {
                        text: 'Withdraw',
                        callback_data: 'log.withdraw'
                    }, {
                        text: 'Delete',
                        callback_data: 'log.delete'
                    }
                ]]
        }
    });
});
bot.on('callback_query', function onCallbackQuery(callbackQuery) {
    return __awaiter(this, void 0, void 0, function () {
        var action, chatId, splittedActions, mainAction, subAction;
        return __generator(this, function (_a) {
            if (!callbackQuery)
                return [2 /*return*/];
            action = callbackQuery.data;
            if (!callbackQuery.message)
                return [2 /*return*/];
            chatId = callbackQuery.message.chat.id;
            if (!action)
                return [2 /*return*/];
            splittedActions = action.split('.');
            if (splittedActions.length !== 2)
                throw new Error("Unknown action");
            mainAction = splittedActions[0];
            subAction = splittedActions[1];
            switch (mainAction) {
                case 'service':
                    onServiceCallbackQuery(chatId, subAction);
                    break;
                case 'period':
                    onPeriodCallbackQuery(chatId, subAction);
                    break;
                case 'profile':
                    onProfileCallbackQuery(chatId, subAction);
                    break;
                case 'wishlist':
                    onWishlistCallbackQuery(chatId, subAction);
                    break;
                case 'log':
                    onLogCallbackQuery(chatId, subAction);
                    break;
                default:
                    throw new Error('Unknown main action');
            }
            return [2 /*return*/];
        });
    });
});
function sendValidatedMessage(chatId, text, options) {
    if (chatId == config.TELEGRAM_CHAT_ID) {
        return bot.sendMessage(chatId, text, options);
    }
    else {
        return bot.sendMessage(chatId, "This is not allowed area.");
    }
}
function onServiceCallbackQuery(chatId, subAction) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, status, message;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = subAction;
                    switch (_a) {
                        case 'start': return [3 /*break*/, 1];
                        case 'stop': return [3 /*break*/, 3];
                        case 'status': return [3 /*break*/, 5];
                    }
                    return [3 /*break*/, 7];
                case 1: return [4 /*yield*/, paramController.startWorker()];
                case 2:
                    _b.sent();
                    sendValidatedMessage(chatId, 'Worker Started');
                    return [3 /*break*/, 8];
                case 3: return [4 /*yield*/, paramController.stopWorker()];
                case 4:
                    _b.sent();
                    sendValidatedMessage(chatId, "Worker Stopped");
                    return [3 /*break*/, 8];
                case 5: return [4 /*yield*/, paramController.getWorkerStatus()];
                case 6:
                    status = _b.sent();
                    if (status && status.value === true) {
                        message = "It is working";
                    }
                    else {
                        message = "Not working";
                    }
                    sendValidatedMessage(chatId, message);
                    return [3 /*break*/, 8];
                case 7: throw new Error('Unknown sub action');
                case 8: return [2 /*return*/];
            }
        });
    });
}
function onPeriodCallbackQuery(chatId, subAction) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = subAction;
                    switch (_a) {
                        case '1ms': return [3 /*break*/, 1];
                        case '10mS': return [3 /*break*/, 3];
                        case '100mS': return [3 /*break*/, 5];
                        case '1s': return [3 /*break*/, 7];
                        case '2s': return [3 /*break*/, 9];
                    }
                    return [3 /*break*/, 11];
                case 1: return [4 /*yield*/, paramController.updatePeriod(1)];
                case 2:
                    _b.sent();
                    sendValidatedMessage(chatId, 'Updated to 1 mS');
                    return [3 /*break*/, 12];
                case 3: return [4 /*yield*/, paramController.updatePeriod(10)];
                case 4:
                    _b.sent();
                    sendValidatedMessage(chatId, 'Updated to 10 mS');
                    return [3 /*break*/, 12];
                case 5: return [4 /*yield*/, paramController.updatePeriod(100)];
                case 6:
                    _b.sent();
                    sendValidatedMessage(chatId, 'Updated to 100 mS');
                    return [3 /*break*/, 12];
                case 7: return [4 /*yield*/, paramController.updatePeriod(1000)];
                case 8:
                    _b.sent();
                    sendValidatedMessage(chatId, 'Updated to 1 Second');
                    return [3 /*break*/, 12];
                case 9: return [4 /*yield*/, paramController.updatePeriod(2000)];
                case 10:
                    _b.sent();
                    sendValidatedMessage(chatId, 'Updated to 2 Seconds');
                    return [3 /*break*/, 12];
                case 11: throw new Error('Unknown sub action');
                case 12: return [2 /*return*/];
            }
        });
    });
}
function onProfileCallbackQuery(chatId, subAction) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, profile, profile, pinParam;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = subAction;
                    switch (_a) {
                        case 'steamName': return [3 /*break*/, 1];
                        case 'balance': return [3 /*break*/, 3];
                        case 'pin': return [3 /*break*/, 5];
                    }
                    return [3 /*break*/, 7];
                case 1: return [4 /*yield*/, csgoController.profile()];
                case 2:
                    profile = _b.sent();
                    sendValidatedMessage(chatId, "Steam Name: " + profile.steam_name);
                    return [3 /*break*/, 8];
                case 3: return [4 /*yield*/, csgoController.profile()];
                case 4:
                    profile = _b.sent();
                    sendValidatedMessage(chatId, "Balance: " + profile.balance / 100 + "$");
                    return [3 /*break*/, 8];
                case 5: return [4 /*yield*/, paramController.getCode()];
                case 6:
                    pinParam = _b.sent();
                    if (!pinParam) {
                        sendValidatedMessage(chatId, 'Pin not found');
                        return [2 /*return*/];
                    }
                    sendValidatedMessage(chatId, "Pin code: " + pinParam.value);
                    return [3 /*break*/, 8];
                case 7: throw new Error('Unknown sub action');
                case 8: return [2 /*return*/];
            }
        });
    });
}
function onWishlistCallbackQuery(chatId, subAction) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, wishlistItems, texts, text;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = subAction;
                    switch (_a) {
                        case 'list': return [3 /*break*/, 1];
                    }
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, wishlistItemController.findAll()];
                case 2:
                    wishlistItems = _b.sent();
                    texts = wishlistItems.map(function (wi) {
                        return wi.name + ": " + wi.max_price / 100 + "$";
                    });
                    text = texts.join('\n');
                    sendValidatedMessage(chatId, text);
                    return [3 /*break*/, 4];
                case 3: throw new Error('Unknown sub action');
                case 4: return [2 /*return*/];
            }
        });
    });
}
function onLogCallbackQuery(chatId, subAction) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, logs, texts, text, withdraws, texts, text;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = subAction;
                    switch (_a) {
                        case 'all': return [3 /*break*/, 1];
                        case 'withdraw': return [3 /*break*/, 3];
                        case 'delete': return [3 /*break*/, 5];
                    }
                    return [3 /*break*/, 7];
                case 1: return [4 /*yield*/, logController.findLastTen()];
                case 2:
                    logs = _b.sent();
                    texts = ['Last 10 logs:'];
                    logs.forEach(function (l) {
                        texts.push(l.created_at + ": " + l.message);
                    });
                    text = texts.join('\n');
                    sendValidatedMessage(chatId, text);
                    return [3 /*break*/, 8];
                case 3: return [4 /*yield*/, withdrawController.findLastTen()];
                case 4:
                    withdraws = _b.sent();
                    texts = ['Last 10 withdraws:'];
                    withdraws.forEach(function (wd) {
                        texts.push(wd.created_at + ": " + wd.market_name + " bought for " + wd.market_value / 100 + "$ which is below " + wd.max_price / 100 + "$");
                    });
                    text = texts.join('\n');
                    sendValidatedMessage(chatId, text);
                    return [3 /*break*/, 8];
                case 5: return [4 /*yield*/, logController.deleteAll()];
                case 6:
                    _b.sent();
                    sendValidatedMessage(chatId, "Logs deleted");
                    return [3 /*break*/, 8];
                case 7: throw new Error('Unknown sub action');
                case 8: return [2 /*return*/];
            }
        });
    });
}
