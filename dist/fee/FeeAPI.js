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
exports.FeeAPI = exports.GoodsAndServicesTypes = void 0;
var GoodsAndServicesTypes;
(function (GoodsAndServicesTypes) {
    GoodsAndServicesTypes["EXCLUSIVE"] = "EXCLUSIVE";
    GoodsAndServicesTypes["INCLUSIVE"] = "INCLUSIVE";
})(GoodsAndServicesTypes = exports.GoodsAndServicesTypes || (exports.GoodsAndServicesTypes = {}));
class FeeAPI {
    constructor(apiClient) {
        this.apiClient = apiClient;
    }
    /**
     * Get your current maker & taker fee rates, as well as your 30-day trailing volume. Quoted rates are subject to
     * change.
     *
     * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_gettransactionsummary
     */
    getCurrentFees() {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = FeeAPI.URL.FEES;
            const response = yield this.apiClient.get(resource);
            return response.data;
        });
    }
}
exports.FeeAPI = FeeAPI;
FeeAPI.URL = {
    FEES: `/brokerage/transaction_summary`,
};
//# sourceMappingURL=FeeAPI.js.map