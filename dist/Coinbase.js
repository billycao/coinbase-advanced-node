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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coinbase = void 0;
const RESTClient_1 = require("./client/RESTClient");
const WebSocketClient_1 = require("./client/WebSocketClient");
const RequestSigner_1 = require("./auth/RequestSigner");
class Coinbase {
    constructor(auth = {
        apiKey: '',
        apiSecret: '',
        oauthToken: undefined,
    }) {
        this.clockSkew = -1;
        const { siwcHttpUrl, advTradeHttpUrl, wsUrl } = auth;
        this.url = {
            REST_ADV_TRADE: advTradeHttpUrl || Coinbase.SETUP.PRODUCTION.REST_ADV_TRADE,
            REST_SIWC: siwcHttpUrl || Coinbase.SETUP.PRODUCTION.REST_SIWC,
            WebSocket: wsUrl || Coinbase.SETUP.PRODUCTION.WebSocket,
        };
        const signRequest = (setup) => __awaiter(this, void 0, void 0, function* () {
            /**
             * Cache clock skew to reduce the amount of API requests:
             * https://github.com/bennycode/coinbase-advanced-node/issues/368#issuecomment-762122575
             */
            if (this.clockSkew === -1) {
                const time = yield this.rest.time.getTime();
                this.clockSkew = this.rest.time.getClockSkew(time);
            }
            return RequestSigner_1.RequestSigner.signRequest(auth, setup, this.clockSkew);
        });
        this.rest = new RESTClient_1.RESTClient(this.url, signRequest);
        this.ws = new WebSocketClient_1.WebSocketClient(this.url.WebSocket, signRequest, this.rest);
    }
}
exports.Coinbase = Coinbase;
Coinbase.SETUP = {
    PRODUCTION: {
        REST_ADV_TRADE: 'https://api.coinbase.com/api/v3',
        REST_SIWC: 'https://api.coinbase.com/v2',
        WebSocket: 'wss://advanced-trade-ws.coinbase.com',
    },
};
//# sourceMappingURL=Coinbase.js.map