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
exports.CurrencyAPI = exports.CurrencyType = void 0;
var CurrencyType;
(function (CurrencyType) {
    CurrencyType["CRYPTO"] = "crypto";
    CurrencyType["FIAT"] = "fiat";
})(CurrencyType = exports.CurrencyType || (exports.CurrencyType = {}));
class CurrencyAPI {
    constructor(apiClient) {
        this.apiClient = apiClient;
    }
    /**
     * List known currencies.
     * Currency codes will conform to the ISO 4217 standard where possible.
     * Currencies which have or had no representation in ISO 4217 may use a custom code.
     *
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-currencies
     */
    listCurrencies() {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = CurrencyAPI.URL.CURRENCIES;
            const response = yield this.apiClient.get(resource);
            return response.data.data;
        });
    }
}
exports.CurrencyAPI = CurrencyAPI;
CurrencyAPI.URL = {
    CURRENCIES: `/currencies`,
};
//# sourceMappingURL=CurrencyAPI.js.map