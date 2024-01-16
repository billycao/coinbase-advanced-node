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
const nock_1 = __importDefault(require("nock"));
const FeeAPI_1 = require("./FeeAPI");
describe('FeeAPI', () => {
    describe('getCurrentFees', () => {
        it('returns maker & taker fee rates', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = {
                advanced_trade_only_fees: 25,
                advanced_trade_only_volume: 1000,
                coinbase_pro_fees: 25,
                coinbase_pro_volume: 1000,
                fee_tier: {
                    maker_fee_rate: '0.0020',
                    pricing_tier: '<$10k',
                    taker_fee_rate: '0.0010',
                    usd_from: '0',
                    usd_to: '10,000',
                },
                goods_and_services_tax: {
                    rate: 'string',
                    type: 'INCLUSIVE',
                },
                margin_rate: {
                    value: 'string',
                },
                total_fees: 25,
                total_volume: 1000,
            };
            (0, nock_1.default)(global.REST_URL).get(FeeAPI_1.FeeAPI.URL.FEES).reply(200, response);
            const fees = yield global.client.rest.fee.getCurrentFees();
            expect(fees.fee_tier.maker_fee_rate).toBe('0.0020');
        }));
    });
});
//# sourceMappingURL=FeeAPI.test.js.map