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
const WebSocket = require("ws");
const BTC_USD_json_1 = __importDefault(require("../test/fixtures/ws/ticker/BTC-USD.json"));
const status_json_1 = __importDefault(require("../test/fixtures/ws/status/status.json"));
const snapshot_json_1 = __importDefault(require("../test/fixtures/ws/level2/snapshot.json"));
const empty_subscriptions_json_1 = __importDefault(require("../test/fixtures/ws/empty-subscriptions.json"));
const WebSocketClient_1 = require("./WebSocketClient");
const reconnecting_websocket_1 = __importDefault(require("reconnecting-websocket"));
const _1 = require(".");
const WEBSOCKET_PORT = 8087;
const WEBSOCKET_URL = `ws://localhost:${WEBSOCKET_PORT}`;
let server;
describe('WebSocketClient', () => {
    function createWebSocketClient(url = WEBSOCKET_URL) {
        const sig = () => {
            return Promise.resolve({
                key: '',
                signature: '',
                timestamp: Date.now() / 1000,
            });
        };
        return new WebSocketClient_1.WebSocketClient(url, sig, new _1.RESTClient({
            REST_ADV_TRADE: 'https://api.coinbase.com/api/v3',
            REST_SIWC: 'https://api.coinbase.com/v2',
            WebSocket: url,
        }, sig));
    }
    beforeEach(done => {
        server = new WebSocket.Server({ port: WEBSOCKET_PORT });
        server.on('listening', () => done());
    });
    afterEach(done => {
        if (server) {
            server.close(error => {
                if (error) {
                    done.fail(error);
                }
                else {
                    done();
                }
            });
        }
        else {
            done();
        }
    });
    describe('connect', () => {
        it('attaches an error listener', done => {
            const invalidUrl = 'ws://localhost:50001';
            const ws = createWebSocketClient(invalidUrl);
            ws.on(WebSocketClient_1.WebSocketEvent.ON_ERROR, () => {
                /**
                 * TODO:
                 * An asynchronous function called its 'done' callback more than once. This is a bug in the spec, beforeAll,
                 * beforeEach, afterAll, or afterEach function in question. This will be treated as an error in a future
                 * version. See:
                 * https://jasmine.github.io/tutorials/upgrading_to_Jasmine_4.0#deprecations-due-to-calling-done-multiple-times
                 */
                done();
            });
            ws.connect();
        });
        it('throws an error when trying to overwrite an existing connection', done => {
            const ws = createWebSocketClient();
            ws.connect();
            try {
                ws.connect();
                done.fail('No error has been thrown');
            }
            catch (error) {
                done();
            }
        });
        it('supports custom reconnect options', () => __awaiter(void 0, void 0, void 0, function* () {
            const ws = createWebSocketClient();
            const socket = ws.connect({ startClosed: true });
            expect(socket.readyState).toBe(reconnecting_websocket_1.default.CLOSED);
        }));
    });
    describe('connected', () => {
        it('returns false when called before the connection is created', done => {
            const ws = createWebSocketClient();
            expect(ws.connected).toBe(false);
            done();
        });
        // TODO: This test appears to be flaky
        it('returns true when called after the connection is created', done => {
            const ws = createWebSocketClient();
            ws.on(WebSocketClient_1.WebSocketEvent.ON_CLOSE, () => {
                done();
            });
            ws.on(WebSocketClient_1.WebSocketEvent.ON_OPEN, () => {
                expect(ws.connected).toBe(true);
                ws.disconnect();
            });
            ws.connect();
        });
        // TODO: This test appears to be flaky
        it('returns false when called after the connection is closed', done => {
            const ws = createWebSocketClient();
            ws.on(WebSocketClient_1.WebSocketEvent.ON_CLOSE, () => {
                expect(ws.connected).toBe(false);
                done();
            });
            ws.on(WebSocketClient_1.WebSocketEvent.ON_OPEN, () => {
                ws.disconnect();
            });
            ws.connect();
        });
    });
    describe('constructor', () => {
        it('it signals an event when the WebSocket connection is established', done => {
            const ws = createWebSocketClient();
            ws.on(WebSocketClient_1.WebSocketEvent.ON_OPEN, () => {
                ws.disconnect();
                done();
            });
            ws.connect();
        });
    });
    describe('disconnect', () => {
        it('does not do anything if there is no existing connection', () => {
            const ws = createWebSocketClient();
            const onClose = jasmine.createSpy('onClose');
            ws.on(WebSocketClient_1.WebSocketEvent.ON_CLOSE, () => {
                onClose();
            });
            ws.disconnect();
            expect(onClose).not.toHaveBeenCalled();
        });
        it('emits an event when an existing connection gets closed', done => {
            const ws = createWebSocketClient();
            ws.on(WebSocketClient_1.WebSocketEvent.ON_CLOSE, () => {
                done();
            });
            ws.on(WebSocketClient_1.WebSocketEvent.ON_OPEN, () => {
                ws.disconnect();
            });
            ws.connect();
        });
    });
    describe('sendMessage', () => {
        it('does not send a message when there is no active connection', () => __awaiter(void 0, void 0, void 0, function* () {
            const ws = createWebSocketClient();
            try {
                yield ws.sendMessage({
                    channel: WebSocketClient_1.WebSocketChannelName.TICKER,
                    type: WebSocketClient_1.WebSocketRequestType.UNSUBSCRIBE,
                });
                fail('No error has been thrown');
            }
            catch (error) {
                expect(error).toBeDefined();
            }
        }));
    });
    describe('subscribe', () => {
        function mockWebSocketResponse(done, channels, payload) {
            server.on('connection', ws => {
                ws.on('message', (message) => {
                    const request = JSON.parse(message);
                    if (request.type === WebSocketClient_1.WebSocketRequestType.SUBSCRIBE) {
                        // Send subscription confirmation
                        server.clients.forEach(client => client.send(JSON.stringify({
                            channels: request.channel,
                            type: WebSocketClient_1.WebSocketResponseType.SUBSCRIPTIONS,
                        })));
                        // Send event for subscription
                        server.clients.forEach(client => client.send(JSON.stringify(payload)));
                    }
                    if (request.type === WebSocketClient_1.WebSocketRequestType.UNSUBSCRIBE) {
                        // Send unsubscribe confirmation
                        server.clients.forEach(client => client.send(JSON.stringify(empty_subscriptions_json_1.default)));
                    }
                });
            });
            const ws = createWebSocketClient();
            ws.on(WebSocketClient_1.WebSocketEvent.ON_SUBSCRIPTION_UPDATE, subscriptions => {
                // Disconnect when there are no more open subscriptions
                const obj = subscriptions.events ? subscriptions.events[0].subscriptions : {};
                if (Object.keys(obj).length === 0) {
                    ws.disconnect();
                }
            });
            ws.on(WebSocketClient_1.WebSocketEvent.ON_CLOSE, () => {
                done();
            });
            ws.on(WebSocketClient_1.WebSocketEvent.ON_MESSAGE_ERROR, (wsError) => done.fail(wsError.message));
            // Send subscription once the WebSocket is ready
            ws.on(WebSocketClient_1.WebSocketEvent.ON_OPEN, () => ws.subscribe(channels));
            return ws;
        }
        it('receives typed messages from "status" channel', (done) => {
            const channel = {
                channel: WebSocketClient_1.WebSocketChannelName.STATUS,
            };
            const ws = mockWebSocketResponse(done, channel, status_json_1.default);
            ws.on(WebSocketClient_1.WebSocketEvent.ON_MESSAGE_STATUS, (message) => __awaiter(void 0, void 0, void 0, function* () {
                // expect(message.currencies[2].details.sort_order).toBe(48);
                // expect(message.products[72].id).toBe('XRP-USD');
                expect(message).toBeDefined();
                yield ws.unsubscribe(channel.channel);
            }));
            ws.connect();
        });
        it('receives typed messages from "ticker" channel', done => {
            const channel = {
                channel: WebSocketClient_1.WebSocketChannelName.TICKER,
                product_ids: ['BTC-USD'],
            };
            const ws = mockWebSocketResponse(done, channel, BTC_USD_json_1.default);
            ws.on(WebSocketClient_1.WebSocketEvent.ON_MESSAGE_TICKER, (tickerMessage) => __awaiter(void 0, void 0, void 0, function* () {
                expect(tickerMessage).toBeDefined();
                yield ws.unsubscribe(channel);
            }));
            ws.connect();
        });
        // TODO: This test appears to be flaky
        it('receives typed "snapshot" messages from "level2" channel', done => {
            const channel = {
                channel: WebSocketClient_1.WebSocketChannelName.LEVEL2,
                product_ids: ['BTC-USD'],
            };
            const ws = mockWebSocketResponse(done, channel, snapshot_json_1.default);
            ws.on(WebSocketClient_1.WebSocketEvent.ON_MESSAGE_LEVEL2, (snapshotMessage) => __awaiter(void 0, void 0, void 0, function* () {
                expect(snapshotMessage).toBeDefined();
                yield ws.unsubscribe(channel);
            }));
            ws.connect();
        });
        it('receives typed "ticker" messages from the special "ticker_1000" channel', done => {
            const channel = {
                channel: WebSocketClient_1.WebSocketChannelName.TICKER_BATCH,
                product_ids: ['BTC-USD'],
            };
            const ws = mockWebSocketResponse(done, channel, BTC_USD_json_1.default);
            ws.on(WebSocketClient_1.WebSocketEvent.ON_MESSAGE_TICKER, (tickerMessage) => __awaiter(void 0, void 0, void 0, function* () {
                expect(tickerMessage.events[0].tickers[0].product_id).toBe('BTC-USD');
                yield ws.unsubscribe(channel);
            }));
            ws.connect();
        });
        it('receives typed error messages', done => {
            server.on('connection', ws => {
                ws.on('message', (message) => {
                    const request = JSON.parse(message);
                    if (request.type === WebSocketClient_1.WebSocketRequestType.SUBSCRIBE) {
                        const response = JSON.stringify({
                            message: 'Failed to subscribe',
                            reason: 'user channel requires authentication',
                            type: WebSocketClient_1.WebSocketResponseType.ERROR,
                        });
                        server.clients.forEach(client => {
                            client.send(response);
                        });
                    }
                });
            });
            const ws = createWebSocketClient();
            ws.on(WebSocketClient_1.WebSocketEvent.ON_MESSAGE_ERROR, (errorMessage) => __awaiter(void 0, void 0, void 0, function* () {
                expect(errorMessage.type).toBe(WebSocketClient_1.WebSocketResponseType.ERROR);
                ws.disconnect();
                done();
            }));
            ws.on(WebSocketClient_1.WebSocketEvent.ON_OPEN, () => __awaiter(void 0, void 0, void 0, function* () {
                yield ws.subscribe({
                    channel: WebSocketClient_1.WebSocketChannelName.USER,
                    product_ids: ['BTC-USD'],
                });
            }));
            ws.connect();
        });
        it('does not throw an exception when disconnect is called immediately after an awaited subscribe', done => {
            const ws = createWebSocketClient();
            const channel = {
                channel: WebSocketClient_1.WebSocketChannelName.TICKER,
                product_ids: ['BTC-USD', 'ETH-USD'],
            };
            ws.on(WebSocketClient_1.WebSocketEvent.ON_OPEN, () => __awaiter(void 0, void 0, void 0, function* () {
                yield ws.subscribe(channel);
                expect(() => {
                    ws.disconnect();
                }).not.toThrow();
            }));
            ws.on(WebSocketClient_1.WebSocketEvent.ON_CLOSE, () => {
                done();
            });
            ws.connect();
        });
    });
    describe('unsubscribe', () => {
        // TODO: This test appears to be flaky
        it('unsubscribes from all products on a channel', done => {
            server.on('connection', socket => {
                socket.on('message', (message) => {
                    const request = JSON.parse(message);
                    if (request.type === WebSocketClient_1.WebSocketRequestType.UNSUBSCRIBE) {
                        const response = JSON.stringify(empty_subscriptions_json_1.default);
                        server.clients.forEach(client => client.send(response));
                    }
                });
            });
            const ws = createWebSocketClient();
            ws.on(WebSocketClient_1.WebSocketEvent.ON_SUBSCRIPTION_UPDATE, subscriptions => {
                const obj = subscriptions.events ? subscriptions.events[0].subscriptions : {};
                if (Object.keys(obj).length === 0) {
                    ws.disconnect();
                }
            });
            ws.on(WebSocketClient_1.WebSocketEvent.ON_CLOSE, () => {
                done();
            });
            ws.on(WebSocketClient_1.WebSocketEvent.ON_OPEN, () => ws.unsubscribe(WebSocketClient_1.WebSocketChannelName.TICKER));
            ws.connect();
        });
    });
    describe('setupHeartbeat', () => {
        // TODO: This test appears to be flaky
        it('sends ping messages within a defined interval', done => {
            server.on('connection', socket => {
                socket.on('ping', () => {
                    ws.disconnect();
                    done();
                });
            });
            const ws = createWebSocketClient();
            ws['pingTime'] = 100;
            ws.connect();
        });
    });
    describe('heartbeat', () => {
        it('resets pong timeouts', () => {
            const ws = createWebSocketClient();
            ws['pongTimeout'] = setTimeout(() => {
                fail('I should not get invoked');
            }, 1000);
            ws['heartbeat']();
        });
    });
    describe('onPongTimeout', () => {
        it('does not fail when there is no active socket', () => {
            const ws = createWebSocketClient();
            ws['onPongTimeout']();
        });
        it('reconnects a socket when the pong timeout is exceeded', () => {
            const ws = createWebSocketClient();
            ws.connect();
            ws['onPongTimeout']();
        });
    });
    describe('cleanupListener', () => {
        it('removes ping & pong listener', () => {
            const ws = createWebSocketClient();
            ws['pingInterval'] = setInterval(() => {
                fail('I should not get invoked');
            }, 1000);
            ws['pongTimeout'] = setTimeout(() => {
                fail('I should not get invoked');
            }, 1000);
            ws['cleanupListener']();
        });
    });
});
//# sourceMappingURL=WebSocketClient.test.js.map