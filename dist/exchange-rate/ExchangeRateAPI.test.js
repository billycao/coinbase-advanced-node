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
const GET_200_json_1 = __importDefault(require("../test/fixtures/rest/v2/exchange-rates/GET-200.json"));
const GET_200_EUR_json_1 = __importDefault(require("../test/fixtures/rest/v2/exchange-rates/GET-200-EUR.json"));
const ExchangeRateAPI_1 = require("./ExchangeRateAPI");
describe('ExchangeRateAPI', () => {
    afterEach(() => nock_1.default.cleanAll());
    beforeEach(() => {
        nock_1.default.cleanAll();
    });
    describe('getExchangeRates', () => {
        it('returns the exchange rates based on USD by default', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, nock_1.default)('https://api.coinbase.com')
                .get(ExchangeRateAPI_1.ExchangeRateAPI.URL.V2_EXCHANGE_RATES)
                .query({ currency: 'USD' })
                .reply(200, JSON.stringify(GET_200_json_1.default));
            const rates = yield global.client.rest.exchangeRate.getExchangeRates();
            expect(rates.currency).toBe('USD');
            expect(rates.rates['EUR']).toBe('1.0208');
        }));
        it('returns the exchange rates for a specific currency', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, nock_1.default)('https://api.coinbase.com')
                .get(ExchangeRateAPI_1.ExchangeRateAPI.URL.V2_EXCHANGE_RATES)
                .query({ currency: 'EUR' })
                .reply(200, JSON.stringify(GET_200_EUR_json_1.default));
            const rates = yield global.client.rest.exchangeRate.getExchangeRates('EUR');
            expect(rates.currency).toBe('EUR');
            expect(rates.rates['IOTX']).toBe('29.4767870302137067');
        }));
    });
});
//# sourceMappingURL=ExchangeRateAPI.test.js.map