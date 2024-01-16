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
const product_1 = require("../product");
const init_client_1 = require("./init-client");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = (0, init_client_1.initClient)();
        const candles = yield client.rest.product.getCandles('BTC-USD', {
            end: '2020-04-11T10:00:00.000Z',
            granularity: product_1.CandleGranularity.ONE_HOUR,
            start: '2020-04-11T08:00:00.000Z',
        });
        console.info(`Received "${candles.length}" candles to represent 3 hours (08 - 11 AM).`, candles[0]);
    });
}
main().catch(console.error);
//# sourceMappingURL=rest-get-candles.js.map