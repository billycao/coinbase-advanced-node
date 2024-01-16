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
exports.ExchangeRateAPI = void 0;
const axios_1 = __importDefault(require("axios"));
/**
 * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-exchange-rates
 */
class ExchangeRateAPI {
    constructor(baseURL = 'https://api.coinbase.com') {
        this.baseURL = baseURL;
    }
    /**
     * Get current exchange rates. Default base currency is USD, but it can be defined as any supported currency.
     * Returned rates will define the exchange rate for one unit of the base currency.
     *
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-exchange-rates#get-exchange-rates
     */
    getExchangeRates(currency = 'USD') {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}${ExchangeRateAPI.URL.V2_EXCHANGE_RATES}`, { params: { currency } });
            return response.data.data;
        });
    }
}
exports.ExchangeRateAPI = ExchangeRateAPI;
ExchangeRateAPI.URL = {
    V2_EXCHANGE_RATES: `/v2/exchange-rates`,
};
//# sourceMappingURL=ExchangeRateAPI.js.map