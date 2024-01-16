"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketClient = exports.WebSocketEvent = exports.WebSocketL2OrderSide = exports.MessageEventType = exports.WebSocketResponseType = exports.WebSocketRequestType = exports.WebSocketChannelName = void 0;
const events_1 = require("events");
const reconnecting_websocket_1 = __importDefault(require("reconnecting-websocket"));
const ws_1 = __importDefault(require("ws"));
const __1 = require("..");
var WebSocketChannelName;
(function (WebSocketChannelName) {
    /** Subscribe to the candles channel to receive candles messages for specific products with updates every second. Candles are grouped into buckets (granularities) of five minutes. */
    WebSocketChannelName["CANDLES"] = "candles";
    /** Real-time server pings to keep all connections open */
    WebSocketChannelName["HEARTBEAT"] = "heartbeats";
    /** The easiest way to keep a snapshot of the order book is to use the level2 channel. It guarantees delivery of all updates, which reduce a lot of the overhead required when consuming the full channel. */
    WebSocketChannelName["LEVEL2"] = "level2";
    /** The market_trades channel sends market trades for a specified product on a preset interval. */
    WebSocketChannelName["MARKET_TRADES"] = "market_trades";
    /** The status channel will send all products and currencies on a preset interval. */
    WebSocketChannelName["STATUS"] = "status";
    /** The ticker channel provides real-time price updates every time a match happens. It batches updates in case of cascading matches, greatly reducing bandwidth requirements. */
    WebSocketChannelName["TICKER"] = "ticker";
    /** A special version of the ticker channel that only provides a ticker update about every 5 seconds. */
    WebSocketChannelName["TICKER_BATCH"] = "ticker_batch";
    /** The user channel sends updates on all of a user's open orders, including all subsequent updates of those orders. */
    WebSocketChannelName["USER"] = "user";
})(WebSocketChannelName = exports.WebSocketChannelName || (exports.WebSocketChannelName = {}));
var WebSocketRequestType;
(function (WebSocketRequestType) {
    WebSocketRequestType["SUBSCRIBE"] = "subscribe";
    WebSocketRequestType["UNSUBSCRIBE"] = "unsubscribe";
})(WebSocketRequestType = exports.WebSocketRequestType || (exports.WebSocketRequestType = {}));
var WebSocketResponseType;
(function (WebSocketResponseType) {
    /** When candles message */
    WebSocketResponseType["CANDLES"] = "candles";
    /** Most failure cases will cause an error message (a message with the type "error") to be emitted. */
    WebSocketResponseType["ERROR"] = "error";
    /** Subscribing to the heartbeats channel, alongside other channels, ensures that all subscriptions stay open when updates are sparse. This is useful, for example, when fetching market data for illiquid pairs. */
    WebSocketResponseType["HEARTBEAT"] = "heartbeats";
    /** When subscribing to the 'level2' channel it will send an initial snapshot message with the corresponding product ids, bids and asks to represent the entire order book. */
    WebSocketResponseType["LEVEL2"] = "l2_data";
    /** is of the type snapshot or update, and contains an array of market trades. Each market trade belongs to a side, which can be of type BUY, or SELL */
    WebSocketResponseType["MARKET_TRADES"] = "market_trades";
    /** The status channel will send all products and currencies on a preset interval. */
    WebSocketResponseType["STATUS"] = "status";
    /** Once a subscribe or unsubscribe message is received, the server will respond with a subscriptions message that lists all channels you are subscribed to. */
    WebSocketResponseType["SUBSCRIPTIONS"] = "subscriptions";
    /** The ticker channel provides real-time price updates every time a match happens. */
    WebSocketResponseType["TICKER"] = "ticker";
    /** The user channel sends updates on all of a user's open orders, including all subsequent updates of those orders. */
    WebSocketResponseType["USER"] = "user";
})(WebSocketResponseType = exports.WebSocketResponseType || (exports.WebSocketResponseType = {}));
var MessageEventType;
(function (MessageEventType) {
    MessageEventType["SNAPSHOT"] = "snapshot";
    MessageEventType["UPDATE"] = "update";
})(MessageEventType = exports.MessageEventType || (exports.MessageEventType = {}));
var WebSocketL2OrderSide;
(function (WebSocketL2OrderSide) {
    WebSocketL2OrderSide["BID"] = "bid";
    WebSocketL2OrderSide["OFFER"] = "offer";
})(WebSocketL2OrderSide = exports.WebSocketL2OrderSide || (exports.WebSocketL2OrderSide = {}));
var WebSocketEvent;
(function (WebSocketEvent) {
    WebSocketEvent["ON_CLOSE"] = "WebSocketEvent.ON_CLOSE";
    WebSocketEvent["ON_ERROR"] = "WebSocketEvent.ON_ERROR";
    WebSocketEvent["ON_MESSAGE"] = "WebSocketEvent.ON_MESSAGE";
    WebSocketEvent["ON_MESSAGE_CANDLES"] = "WebSocketEvent.ON_MESSAGE_CANDLES";
    WebSocketEvent["ON_MESSAGE_ERROR"] = "WebSocketEvent.ON_MESSAGE_ERROR";
    WebSocketEvent["ON_MESSAGE_HEARTBEAT"] = "WebSocketEvent.ON_MESSAGE_HEARTBEAT";
    WebSocketEvent["ON_MESSAGE_LEVEL2"] = "WebSocketEvent.ON_MESSAGE_LEVEL2";
    WebSocketEvent["ON_MESSAGE_MARKET_TRADES"] = "WebSocketEvent.ON_MESSAGE_MARKET_TRADES";
    WebSocketEvent["ON_MESSAGE_STATUS"] = "WebSocketEvent.ON_MESSAGE_STATUS";
    WebSocketEvent["ON_MESSAGE_TICKER"] = "WebSocketEvent.ON_MESSAGE_TICKER";
    WebSocketEvent["ON_OPEN"] = "WebSocketEvent.ON_OPEN";
    WebSocketEvent["ON_SUBSCRIPTION_UPDATE"] = "WebSocketEvent.ON_SUBSCRIPTION_UPDATE";
    WebSocketEvent["ON_USER_UPDATE"] = "WebSocketEvent.ON_USER_UPDATE";
})(WebSocketEvent = exports.WebSocketEvent || (exports.WebSocketEvent = {}));
// eslint-disable-next-line no-redeclare
class WebSocketClient extends events_1.EventEmitter {
    constructor(baseURL, signRequest, restClient) {
        super();
        this.signRequest = signRequest;
        this.restClient = restClient;
        this.baseURL = baseURL;
        this.pingTime = 10000;
        this.pongTime = this.pingTime * 1.5;
    }
    /**
     * The websocket feed is publicly available, but connections to it are rate-limited to 1 per 4 seconds per IP.
     *
     * @param reconnectOptions - Reconnect options to be used with the "reconnecting-websocket" package. Note: Options
     *   will be merged with sensible default values.
     * @see https://docs.cloud.coinbase.com/exchange/docs/websocket-overview
     */
    connect(reconnectOptions) {
        if (this.socket) {
            throw Error(`You established already a WebSocket connection. Please call "disconnect" first before creating a new one.`);
        }
        const options = this.mergeOptions(reconnectOptions);
        this.socket = new reconnecting_websocket_1.default(this.baseURL, [], options);
        this.socket.onclose = (event) => {
            this.cleanupListener();
            this.emit(WebSocketEvent.ON_CLOSE, event);
        };
        this.socket.onerror = (event) => {
            this.cleanupListener();
            this.emit(WebSocketEvent.ON_ERROR, event);
        };
        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const target = (data === null || data === void 0 ? void 0 : data.channel) || (data === null || data === void 0 ? void 0 : data.type);
            switch (target) {
                case WebSocketResponseType.ERROR:
                    data.type = WebSocketResponseType.ERROR;
                    this.emit(WebSocketEvent.ON_MESSAGE_ERROR, data);
                    break;
                case WebSocketChannelName.STATUS:
                    data.type = WebSocketResponseType.STATUS;
                    this.emit(WebSocketEvent.ON_MESSAGE_STATUS, data);
                    break;
                case WebSocketChannelName.CANDLES:
                    data.events.forEach(e => {
                        e.candles = e.candles
                            .sort((a, b) => a.start - b.start)
                            .map(c => __1.CandleBucketUtil.mapCandle(c, __1.CandleGranularityNumbers.FIVE_MINUTE, c.product_id));
                    });
                    data.type = WebSocketResponseType.CANDLES;
                    this.emit(WebSocketEvent.ON_MESSAGE_CANDLES, data);
                    break;
                case WebSocketChannelName.HEARTBEAT:
                    data.type = WebSocketResponseType.HEARTBEAT;
                    this.emit(WebSocketEvent.ON_MESSAGE_HEARTBEAT, data);
                    break;
                case WebSocketResponseType.SUBSCRIPTIONS:
                    data.type = WebSocketResponseType.SUBSCRIPTIONS;
                    if (!data.channels) {
                        data.channels = Object.keys(data.events[0].subscriptions).map(k => {
                            const x = {
                                channel: k,
                            };
                            if (!k.includes(WebSocketChannelName.USER)) {
                                x['product_ids'] = data.events[0].subscriptions[k];
                            }
                            return x;
                        });
                    }
                    this.emit(WebSocketEvent.ON_SUBSCRIPTION_UPDATE, data);
                    break;
                case WebSocketChannelName.TICKER:
                case WebSocketChannelName.TICKER_BATCH:
                    data.type = WebSocketResponseType.TICKER;
                    this.emit(WebSocketEvent.ON_MESSAGE_TICKER, data);
                    break;
                case WebSocketChannelName.LEVEL2:
                case WebSocketResponseType.LEVEL2:
                    data.channel = WebSocketChannelName.LEVEL2;
                    data.type = WebSocketResponseType.LEVEL2;
                    this.emit(WebSocketEvent.ON_MESSAGE_LEVEL2, data);
                    break;
                case WebSocketChannelName.MARKET_TRADES:
                    data.type = WebSocketResponseType.MARKET_TRADES;
                    this.emit(WebSocketEvent.ON_MESSAGE_MARKET_TRADES, data);
                    break;
                case WebSocketChannelName.USER:
                    data.type = WebSocketResponseType.USER;
                    this.emit(WebSocketEvent.ON_USER_UPDATE, data);
                    break;
            }
            // Emit generic event
            this.emit(WebSocketEvent.ON_MESSAGE, data);
        };
        this.socket.onopen = () => {
            var _a;
            this.emit(WebSocketEvent.ON_OPEN);
            /**
             * The 'ws' package for Node.js exposes a "ping" function, but the WebSocket API in browsers doesn't. Since
             * "coinbase-advanced-node" can run in both environments (Node.js & web browsers), we have to check for the existence
             * of "ping".
             *
             * Unfortunately, the "real" WebSocket connection isn't exposed from the "reconnecting-websocket" package:
             * https://github.com/pladaria/reconnecting-websocket/pull/148
             */
            const realWebSocket = (_a = this.socket) === null || _a === void 0 ? void 0 : _a['_ws'];
            const hasPingSupport = realWebSocket && typeof realWebSocket.ping === 'function';
            this.setupHeartbeat(hasPingSupport, realWebSocket);
        };
        return this.socket;
    }
    disconnect(reason = 'Unknown reason') {
        if (this.socket) {
            this.socket.close(WebSocketClient.CLOSE_EVENT_CODE.NORMAL_CLOSURE, reason);
            this.socket = undefined;
        }
    }
    /**
     * A simple function to determine if the websocket appears to be open.
     *
     * @returns True if the websocket has been opened and has not closed.
     */
    get connected() {
        return undefined !== this.socket;
    }
    sendMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            /**
             * You gotta auth for user
             * @see https://docs.cloud.coinbase.com/advanced-trade-api/docs/ws-channels
             */
            const signature = yield this.signRequest({
                httpMethod: '',
                payload: (message.product_ids || []).join(','),
                requestPath: message.channel,
                ws: true,
            });
            if (message.channel === WebSocketChannelName.USER) {
                if (!this.userID && signature.key) {
                    const user = yield this.restClient.user.fetchUserInfo().catch(() => {
                        return null;
                    });
                    this.userID = user === null || user === void 0 ? void 0 : user.id;
                }
                Object.assign(signature, { user_id: this.userID });
            }
            // i really don't like that REST needs int and WS needs string
            signature.timestamp = signature.timestamp.toString();
            if (signature === null || signature === void 0 ? void 0 : signature.key) {
                Object.assign(signature, {
                    api_key: signature.key.toString(),
                });
                delete signature.key;
                if (signature.oauth) {
                    delete signature.signature;
                }
            }
            Object.assign(message, signature);
            if (!this.socket) {
                throw new Error(`Failed to send message of type "${message.type}": You need to connect to the WebSocket first.`);
            }
            this.socket.send(JSON.stringify(message));
        });
    }
    subscribe(channel) {
        return __awaiter(this, void 0, void 0, function* () {
            const targets = Array.isArray(channel) ? channel : [channel];
            const proms = targets.map((t) => this.sendMessage(Object.assign(Object.assign({}, t), { type: WebSocketRequestType.SUBSCRIBE })));
            yield Promise.allSettled(proms);
        });
    }
    unsubscribe(channel) {
        return __awaiter(this, void 0, void 0, function* () {
            const targets = this.mapChannels(channel);
            const proms = targets.map((t) => this.sendMessage(Object.assign(Object.assign({}, t), { type: WebSocketRequestType.UNSUBSCRIBE })));
            yield Promise.allSettled(proms);
        });
    }
    cleanupListener() {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
        }
        if (this.pongTimeout) {
            clearTimeout(this.pongTimeout);
        }
    }
    heartbeat() {
        if (this.pongTimeout) {
            clearTimeout(this.pongTimeout);
        }
        /**
         * Enforce reconnect when not receiving any 'pong' from Coinbase Pro in time.
         * @see https://github.com/bennycode/coinbase-advanced-node/issues/374
         */
        this.pongTimeout = setTimeout(this.onPongTimeout.bind(this), this.pongTime);
    }
    onPongTimeout() {
        var _a;
        (_a = this.socket) === null || _a === void 0 ? void 0 : _a.reconnect();
    }
    /**
     * Setup a heartbeat with ping/pong interval to avoid broken WebSocket connections:
     * @see https://github.com/websockets/ws#how-to-detect-and-close-broken-connections
     */
    setupHeartbeat(hasPingSupport, webSocket) {
        if (hasPingSupport) {
            // Subscribe to pongs
            webSocket.on('pong', this.heartbeat.bind(this));
            // Send pings
            this.pingInterval = setInterval(() => {
                webSocket.ping(() => { });
            }, this.pingTime);
        }
    }
    mergeOptions(reconnectOptions) {
        const defaultOptions = {
            WebSocket: ws_1.default,
            connectionTimeout: 2000,
            debug: false,
            maxReconnectionDelay: 4000,
            maxRetries: Infinity,
            minReconnectionDelay: 1000,
            reconnectionDelayGrowFactor: 1,
        };
        return Object.assign(Object.assign({}, defaultOptions), reconnectOptions);
    }
    mapChannels(input) {
        if (Array.isArray(input)) {
            return input;
        }
        else if (typeof input === 'string') {
            return [
                {
                    channel: input,
                    product_ids: [],
                },
            ];
        }
        return [input];
    }
}
exports.WebSocketClient = WebSocketClient;
WebSocketClient.CLOSE_EVENT_CODE = {
    GOING_AWAY: 1001,
    NORMAL_CLOSURE: 1000,
    PROTOCOL_ERROR: 1002,
    UNSUPPORTED_DATA: 1003,
};
//# sourceMappingURL=WebSocketClient.js.map