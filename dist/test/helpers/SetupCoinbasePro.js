"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Coinbase_1 = require("../../Coinbase");
const nock_1 = __importDefault(require("nock"));
const TimeAPI_1 = require("../../time/TimeAPI");
// URL to mock a server using "nock":
global.REST_URL = Coinbase_1.Coinbase.SETUP.PRODUCTION.REST_ADV_TRADE;
global.SIWC_REST_URL = Coinbase_1.Coinbase.SETUP.PRODUCTION.REST_SIWC;
global.clientConnection = Coinbase_1.Coinbase.SETUP.PRODUCTION;
beforeEach(() => {
    (0, nock_1.default)(global.SIWC_REST_URL)
        .persist()
        .get(TimeAPI_1.TimeAPI.URL.TIME)
        .query(true)
        .reply(() => {
        const date = new Date();
        return [
            200,
            JSON.stringify({
                data: {
                    epoch: date.getTime() / 1000,
                    iso: date.toISOString(),
                },
            }),
        ];
    });
    global.client = new Coinbase_1.Coinbase({
        apiKey: 'xxxxx',
        apiSecret: 'xxxxx',
    });
});
//# sourceMappingURL=SetupCoinbasePro.js.map