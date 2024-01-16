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
exports.ProductAPI = exports.ProductEvent = exports.getNumericCandleGranularity = exports.CandleGranularity = exports.CandleGranularityNumbers = void 0;
const CandleBucketUtil_1 = require("./CandleBucketUtil");
const shared_request_1 = require("../util/shared-request");
/** Accepted granularity in seconds to group historic rates. */
var CandleGranularityNumbers;
(function (CandleGranularityNumbers) {
    CandleGranularityNumbers[CandleGranularityNumbers["ONE_MINUTE"] = 60] = "ONE_MINUTE";
    CandleGranularityNumbers[CandleGranularityNumbers["FIVE_MINUTE"] = 300] = "FIVE_MINUTE";
    CandleGranularityNumbers[CandleGranularityNumbers["FIFTEEN_MINUTE"] = 900] = "FIFTEEN_MINUTE";
    CandleGranularityNumbers[CandleGranularityNumbers["ONE_HOUR"] = 3600] = "ONE_HOUR";
    CandleGranularityNumbers[CandleGranularityNumbers["SIX_HOUR"] = 21600] = "SIX_HOUR";
    CandleGranularityNumbers[CandleGranularityNumbers["ONE_DAY"] = 86400] = "ONE_DAY";
    CandleGranularityNumbers[CandleGranularityNumbers["THIRTY_MINUTE"] = 1800] = "THIRTY_MINUTE";
    CandleGranularityNumbers[CandleGranularityNumbers["TWO_HOUR"] = 7200] = "TWO_HOUR";
})(CandleGranularityNumbers = exports.CandleGranularityNumbers || (exports.CandleGranularityNumbers = {}));
var CandleGranularity;
(function (CandleGranularity) {
    CandleGranularity["FIFTEEN_MINUTE"] = "FIFTEEN_MINUTE";
    CandleGranularity["FIVE_MINUTE"] = "FIVE_MINUTE";
    CandleGranularity["ONE_DAY"] = "ONE_DAY";
    CandleGranularity["ONE_HOUR"] = "ONE_HOUR";
    CandleGranularity["ONE_MINUTE"] = "ONE_MINUTE";
    CandleGranularity["SIX_HOUR"] = "SIX_HOUR";
    CandleGranularity["THIRTY_MINUTE"] = "THIRTY_MINUTE";
    CandleGranularity["TWO_HOUR"] = "TWO_HOUR";
})(CandleGranularity = exports.CandleGranularity || (exports.CandleGranularity = {}));
const getNumericCandleGranularity = (key) => {
    return CandleGranularityNumbers[key];
};
exports.getNumericCandleGranularity = getNumericCandleGranularity;
var ProductEvent;
(function (ProductEvent) {
    ProductEvent["NEW_CANDLE"] = "ProductEvent.NEW_CANDLE";
})(ProductEvent = exports.ProductEvent || (exports.ProductEvent = {}));
class ProductAPI {
    constructor(apiClient, restClient) {
        this.apiClient = apiClient;
        this.restClient = restClient;
        this.watchCandlesConfig = new Map();
    }
    /**
     * Get historic rates for a product. Rates are returned in grouped buckets (candlesticks) based on requested
     * granularity.
     *
     * Note: The maximum number of data points for a single request is 300 candles. If your selection of start/end time
     * and granularity will result in more than 300 data points, your request will be rejected. If you wish to retrieve
     * fine granularity data over a larger time range, you will need to make multiple requests with new start/end ranges.
     *
     * @param productId - Representation for base and counter
     * @param [params] - Desired timespan
     * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getcandles
     */
    getCandles(productId, params) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const resource = `${ProductAPI.URL.PRODUCTS}/${productId}/candles`;
            const candleSizeInMillis = (0, exports.getNumericCandleGranularity)(params.granularity) * 1000;
            const potentialParams = params;
            let rawCandles = [];
            if (potentialParams.start && potentialParams.end) {
                const fromInMillis = typeof potentialParams.start === 'number'
                    ? potentialParams.start * 1000
                    : new Date(potentialParams.start).getTime();
                const toInMillis = typeof potentialParams.end === 'number' ? potentialParams.end * 1000 : new Date(potentialParams.end).getTime();
                const bucketsInMillis = CandleBucketUtil_1.CandleBucketUtil.getBucketsInMillis(fromInMillis, toInMillis, candleSizeInMillis);
                const bucketsInISO = CandleBucketUtil_1.CandleBucketUtil.getBucketsInISO(bucketsInMillis);
                for (let index = 0; index < bucketsInISO.length; index++) {
                    const bucket = bucketsInISO[index];
                    const response = yield this.apiClient.get(resource, {
                        params: {
                            end: Math.floor(new Date(bucket.stop).getTime() / 1000),
                            granularity: params.granularity,
                            start: Math.floor(new Date(bucket.start).getTime() / 1000),
                        },
                    });
                    rawCandles.push(...response.data.candles);
                }
            }
            else {
                if (!potentialParams.end) {
                    potentialParams.end = potentialParams.start
                        ? Math.floor(new Date(potentialParams.start).getTime() + (candleSizeInMillis * 300) / 1000)
                        : Math.floor(Date.now() / 1000);
                }
                if (!potentialParams.start) {
                    potentialParams.start = Math.floor(new Date(potentialParams.end).getTime() - (candleSizeInMillis * 300) / 1000);
                }
                const response = yield this.apiClient.get(resource, { params: potentialParams });
                const c = ((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.candles) || [];
                rawCandles = rawCandles.concat([...c]);
            }
            return rawCandles
                .map(candle => CandleBucketUtil_1.CandleBucketUtil.mapCandle(candle, candleSizeInMillis, productId))
                .sort((a, b) => a.openTimeInMillis - b.openTimeInMillis);
        });
    }
    composeCandleWatcherKey(productId, granularity) {
        return `${productId}@${granularity}`;
    }
    getCandleWatcherConfig(productId, granularity) {
        const key = this.composeCandleWatcherKey(productId, granularity);
        const config = this.watchCandlesConfig.get(key);
        if (config) {
            return config;
        }
        throw new Error(`There is no candle watching config with key "${key}".`);
    }
    /**
     * Watch a specific product ID for new candles. Candles will be emitted through the `ProductEvent.NEW_CANDLE` event.
     *
     * @param productId - Representation for base and counter
     * @param granularity - Desired candle size
     * @param lastCandleTime - Timestamp (ISO 8601) of last candle received
     * @returns Handle to stop the watch interval
     */
    watchCandles(productId, granularity, lastCandleTime) {
        const key = this.composeCandleWatcherKey(productId, granularity);
        if (this.watchCandlesConfig.get(key)) {
            throw new Error(`You are already watching "${productId}" with an interval of "${granularity}" seconds. Please clear this interval before creating a new one.`);
        }
        else {
            const expectedISO = CandleBucketUtil_1.CandleBucketUtil.addUnitISO(lastCandleTime, granularity, 1);
            const intervalId = this.startCandleInterval(productId, granularity);
            this.watchCandlesConfig.set(key, {
                expectedISO,
                intervalId,
            });
        }
    }
    /**
     * Stop watching a specific candle interval.
     *
     * @param productId - Representation for base and counter
     * @param granularity - Desired candle size
     */
    unwatchCandles(productId, granularity) {
        const key = this.composeCandleWatcherKey(productId, granularity);
        const config = this.watchCandlesConfig.get(key);
        if (config) {
            clearInterval(config.intervalId);
            this.watchCandlesConfig.delete(key);
        }
    }
    /**
     * Get trading details for a specified product.
     *
     * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getproduct
     */
    getProduct(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = `${ProductAPI.URL.PRODUCTS}/${productId}`;
            const response = yield this.apiClient.get(resource);
            return response.data;
        });
    }
    /**
     * Get trading details of all available products.
     *
     * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getproducts
     */
    getProducts(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = ProductAPI.URL.PRODUCTS;
            const response = yield this.apiClient.get(resource, { params: Object.assign({ limit: 999 }, (params || {})) });
            return response.data.products;
        });
    }
    /**
     * Get the latest trades for a product.
     *
     * @param productId - Representation for base and counter
     * @param pagination - Pagination field
     * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getmarkettrades
     */
    getTrades(productId, pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = `${ProductAPI.URL.PRODUCTS}/${productId}/ticker`;
            let params = { limit: (pagination === null || pagination === void 0 ? void 0 : pagination.limit) || 999 };
            if (pagination) {
                params = (0, shared_request_1.formatPaginationIntoParams)(pagination, false, params);
            }
            const response = yield this.apiClient.get(resource, { params });
            return {
                best_ask: response.data.best_ask,
                best_bid: response.data.best_bid,
                data: response.data.trades,
                pagination: {
                    after: ((pagination === null || pagination === void 0 ? void 0 : pagination.after) || 0).toString(),
                    before: response.data.num_products,
                    has_next: false,
                },
            };
        });
    }
    /**
     * Get latest 24 hours of movement data for a product.
     *
     * @param productId - Representation for base and counter
     * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_getproductstats
     */
    getProductStats(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const dateOffset = 24 * 60 * 1000;
            return this.getCandles(productId, {
                end: Date.now() / 1000,
                granularity: CandleGranularity.ONE_DAY,
                start: Math.floor(Date.now() / 1000 - dateOffset),
            }).then((res) => {
                var _a, _b, _c, _d;
                const latest = res[res.length - 1];
                return {
                    high: (_a = latest === null || latest === void 0 ? void 0 : latest.high) === null || _a === void 0 ? void 0 : _a.toString(),
                    last: (_b = latest === null || latest === void 0 ? void 0 : latest.close) === null || _b === void 0 ? void 0 : _b.toString(),
                    low: (_c = latest === null || latest === void 0 ? void 0 : latest.low) === null || _c === void 0 ? void 0 : _c.toString(),
                    open: latest.open.toString(),
                    volume: (_d = latest === null || latest === void 0 ? void 0 : latest.volume) === null || _d === void 0 ? void 0 : _d.toString(),
                    volume_30day: 'unknown',
                };
            });
        });
    }
    /**
     * Get Best Bid/Ask
     *
     * @param productIds - Products to get asks/bids for
     * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getbestbidask
     */
    getBestAsksAndBids(productIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = `/brokerage/best_bid_ask`;
            const response = yield this.apiClient.get(resource, { params: { product_ids: productIds } });
            return response.data.pricebooks;
        });
    }
    /**
     * Get Product Book
     *
     * @param productId - Products to get asks/bids for
     * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getproductbook
     */
    getProductBook(productId, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = `/brokerage/product_book`;
            const params = { limit: limit || 250, product_id: productId };
            const response = yield this.apiClient.get(resource, { params });
            return response.data.pricebook;
        });
    }
    emitCandle(productId, granularity, candle) {
        const config = this.getCandleWatcherConfig(productId, granularity);
        // Emit matched candle
        this.restClient.emit(ProductEvent.NEW_CANDLE, productId, granularity, candle);
        // Cache timestamp of upcoming candle
        const nextOpenTime = CandleBucketUtil_1.CandleBucketUtil.addUnitISO(candle.openTimeInMillis, granularity, 1);
        config.expectedISO = nextOpenTime;
    }
    checkNewCandles(productId, granularity) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = this.getCandleWatcherConfig(productId, granularity);
            const expectedTimestampISO = config.expectedISO;
            const candles = yield this.getCandles(productId, {
                granularity,
                start: expectedTimestampISO,
            });
            const matches = candles.filter(candle => candle.openTimeInMillis >= new Date(expectedTimestampISO).getTime());
            if (matches.length > 0) {
                const matchedCandle = matches[0];
                this.emitCandle(productId, granularity, matchedCandle);
            }
        });
    }
    startCandleInterval(productId, granularity) {
        // Check for new candles in the smallest candle interval possible, which is 1 minute
        const updateInterval = CandleGranularityNumbers.ONE_MINUTE * 1000;
        return global.setInterval(() => __awaiter(this, void 0, void 0, function* () {
            yield this.checkNewCandles(productId, granularity);
        }), updateInterval);
    }
}
exports.ProductAPI = ProductAPI;
ProductAPI.URL = {
    PRODUCTS: `/brokerage/products`,
};
//# sourceMappingURL=ProductAPI.js.map