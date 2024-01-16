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
exports.FillAPI = exports.FillTradeType = exports.LiquidityIndicatorTypes = exports.Liquidity = void 0;
const shared_request_1 = require("../util/shared-request");
var Liquidity;
(function (Liquidity) {
    Liquidity["MAKER"] = "M";
    Liquidity["TAKER"] = "T";
})(Liquidity = exports.Liquidity || (exports.Liquidity = {}));
var LiquidityIndicatorTypes;
(function (LiquidityIndicatorTypes) {
    LiquidityIndicatorTypes["MAKER"] = "MAKER";
    LiquidityIndicatorTypes["TAKER"] = "TAKER";
    LiquidityIndicatorTypes["UNKNOWN_LIQUIDITY_INDICATOR"] = "UNKNOWN_LIQUIDITY_INDICATOR";
})(LiquidityIndicatorTypes = exports.LiquidityIndicatorTypes || (exports.LiquidityIndicatorTypes = {}));
var FillTradeType;
(function (FillTradeType) {
    FillTradeType["CORRECTION"] = "CORRECTION";
    FillTradeType["FILL"] = "FILL";
    FillTradeType["REVERSAL"] = "REVERSAL";
    FillTradeType["SYNTHETIC"] = "SYNTHETIC";
})(FillTradeType = exports.FillTradeType || (exports.FillTradeType = {}));
class FillAPI {
    constructor(apiClient) {
        this.apiClient = apiClient;
    }
    /**
     * Get a list of recent fills for a given Order of the API key.
     *
     * @param orderId - ID of previously placed order
     * @param queryParams - Pagination instance provides legacy cb-pro interface, use FillApiQueryParams for additional options
     */
    getFillsByOrderId(orderId, queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            if (queryParams && (queryParams.before || queryParams.after)) {
                queryParams = (0, shared_request_1.formatPaginationIntoParams)(queryParams);
            }
            Object.assign(queryParams || {}, { order_id: orderId });
            return this.getFills(queryParams);
        });
    }
    /**
     * Get a list of recent fills for a given Product of the API key
     *
     * @param productId - Representation for base and counter
     * @param queryParams - Pagination instance provides legacy cb-pro interface, use FillApiQueryParams for additional options
     */
    getFillsByProductId(productId, queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            if (queryParams && (queryParams.before || queryParams.after)) {
                queryParams = (0, shared_request_1.formatPaginationIntoParams)(queryParams);
            }
            Object.assign(queryParams || {}, { product_id: productId });
            return this.getFills(queryParams);
        });
    }
    /**
     * Get a list of recent fills associated to the API key
     *
     * @param query - query to filter results
     * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getfills
     */
    getFills(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = FillAPI.URL.FILLS;
            const response = yield this.apiClient.get(resource, { params: query });
            const position = response.data.cursor && response.data.cursor !== '' ? response.data.cursor : response.data.fills.length;
            return {
                data: response.data.fills,
                pagination: {
                    after: (Number(position) - response.data.fills.length).toString(),
                    before: position.toString(),
                    has_next: response.data.has_next || false,
                },
            };
        });
    }
}
exports.FillAPI = FillAPI;
FillAPI.URL = {
    FILLS: `/brokerage/orders/historical/fills`,
};
//# sourceMappingURL=FillAPI.js.map