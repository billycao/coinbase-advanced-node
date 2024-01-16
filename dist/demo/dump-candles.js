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
const init_client_1 = require("./init-client");
const __1 = require("..");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = (0, init_client_1.initClient)();
        const productId = 'BTC-USD';
        const begin = '2020-04-11T00:00:00.000Z';
        const end = '2020-04-11T10:00:00.000Z';
        const granularity = __1.CandleGranularity.ONE_HOUR;
        const directory = __dirname;
        const candles = yield client.rest.product.getCandles(productId, {
            end,
            granularity,
            start: begin,
        });
        const start = candles[0].openTimeInMillis;
        const file = path_1.default.join(directory, `${productId}-${start}-${granularity}.json`);
        fs_1.default.writeFileSync(file, JSON.stringify(candles, null, 2));
        console.info(`Dumped "${candles.length}" candles in file "${file}".`);
    });
}
main().catch(console.error);
//# sourceMappingURL=dump-candles.js.map