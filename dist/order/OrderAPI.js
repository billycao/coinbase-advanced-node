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
exports.OrderAPI = exports.CancelOrderFailureReasons = exports.StopDirection = exports.TriggerStatus = exports.OrderStatus = exports.TimeInForce = exports.OrderType = void 0;
var OrderType;
(function (OrderType) {
    OrderType["LIMIT"] = "LIMIT";
    OrderType["MARKET"] = "MARKET";
    OrderType["STOP"] = "STOP";
    OrderType["STOP_LIMIT"] = "STOP_LIMIT";
    OrderType["UNKNOWN_ORDER_TYPE"] = "UNKNOWN_ORDER_TYPE";
})(OrderType = exports.OrderType || (exports.OrderType = {}));
var TimeInForce;
(function (TimeInForce) {
    TimeInForce["FILL_OR_KILL"] = "FILL_OR_KILL";
    TimeInForce["GOOD_UNTIL_CANCELLED"] = "GOOD_UNTIL_CANCELLED";
    TimeInForce["GOOD_UNTIL_DATE_TIME"] = "GOOD_UNTIL_DATE_TIME";
    TimeInForce["IMMEDIATE_OR_CANCEL"] = "IMMEDIATE_OR_CANCEL";
    TimeInForce["UNKNOWN_TIME_IN_FORCE"] = "UNKNOWN_TIME_IN_FORCE";
})(TimeInForce = exports.TimeInForce || (exports.TimeInForce = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["CANCELLED"] = "CANCELLED";
    OrderStatus["EXPIRED"] = "EXPIRED";
    OrderStatus["FAILED"] = "FAILED";
    OrderStatus["FILLED"] = "FILLED";
    OrderStatus["OPEN"] = "OPEN";
    OrderStatus["PENDING"] = "PENDING";
    OrderStatus["UNKNOWN_ORDER_STATUS"] = "UNKNOWN_ORDER_STATUS";
})(OrderStatus = exports.OrderStatus || (exports.OrderStatus = {}));
var TriggerStatus;
(function (TriggerStatus) {
    TriggerStatus["INVALID_ORDER_TYPE"] = "INVALID_ORDER_TYPE";
    TriggerStatus["STOP_PENDING"] = "STOP_PENDING";
    TriggerStatus["STOP_TRIGGERED"] = "STOP_TRIGGERED";
    TriggerStatus["UNKNOWN_TRIGGER_STATUS"] = "UNKNOWN_TRIGGER_STATUS";
})(TriggerStatus = exports.TriggerStatus || (exports.TriggerStatus = {}));
var StopDirection;
(function (StopDirection) {
    StopDirection["STOP_DIRECTION_STOP_DOWN"] = "STOP_DIRECTION_STOP_DOWN";
    StopDirection["STOP_DIRECTION_STOP_UP"] = "STOP_DIRECTION_STOP_UP";
    StopDirection["UNKNOWN_STOP_DIRECTION"] = "UNKNOWN_STOP_DIRECTION";
})(StopDirection = exports.StopDirection || (exports.StopDirection = {}));
var CancelOrderFailureReasons;
(function (CancelOrderFailureReasons) {
    CancelOrderFailureReasons["COMMANDER_REJECTED_CANCEL_ORDER"] = "COMMANDER_REJECTED_CANCEL_ORDER";
    CancelOrderFailureReasons["DUPLICATE_CANCEL_REQUEST"] = "DUPLICATE_CANCEL_REQUEST";
    CancelOrderFailureReasons["INVALID_CANCEL_REQUEST"] = "INVALID_CANCEL_REQUEST";
    CancelOrderFailureReasons["UNKNOWN_CANCEL_FAILURE_REASON"] = "UNKNOWN_CANCEL_FAILURE_REASON";
    CancelOrderFailureReasons["UNKNOWN_CANCEL_ORDER"] = "UNKNOWN_CANCEL_ORDER";
})(CancelOrderFailureReasons = exports.CancelOrderFailureReasons || (exports.CancelOrderFailureReasons = {}));
class OrderAPI {
    constructor(apiClient) {
        this.apiClient = apiClient;
    }
    /**
     * Cancel these orders
     *
     * @param orderIds - Representation for base and counter
     * @returns A list of ids of the canceled orders
     * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_cancelorders
     */
    cancelOpenOrders(orderIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = OrderAPI.URL.ORDERS + '/batch_cancel';
            const response = yield this.apiClient.post(resource, {
                order_ids: Array.isArray(orderIds) ? orderIds : [orderIds],
            });
            return response.data.results;
        });
    }
    /**
     * Cancel a previously placed order. Order must belong to the profile that the API key belongs to.
     *
     * @param orderId - ID of the order to cancel
     * @param productId - deprecated
     * @returns The ID of the canceled order
     * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_deleteorder
     */
    cancelOrder(orderId, _productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const x = yield this.cancelOpenOrders(orderId);
            return x[0];
        });
    }
    /**
     * List your orders from the profile that the API key belongs to. Only open or un-settled orders are returned. As
     * soon as an order is no longer open and settled, it will no longer appear in the default request.
     *
     * @note Depending on your activity, fetching all data from this endpoint can take very long (measured already 25
     *   seconds!)
     * @param query - Available query parameters (Pagination, Product ID and/or Order Status)
     * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_gethistoricalorders
     */
    getOrders(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = OrderAPI.URL.ORDERS + '/historical/batch';
            if (!query) {
                query = {};
            }
            if (!(query === null || query === void 0 ? void 0 : query.limit)) {
                query.limit = 25;
            }
            const response = yield this.apiClient.get(`${resource}`, {
                params: query,
            });
            const position = response.data.cursor && response.data.cursor !== '' ? response.data.cursor : response.data.orders.length;
            return {
                data: response.data.orders,
                pagination: {
                    after: (Number(position) - response.data.orders.length).toString(),
                    before: position.toString(),
                    has_next: response.data.has_next || false,
                },
            };
        });
    }
    /**
     * Get a single order by order id from the profile that the API key belongs to.
     *
     * @param orderId - ID of previously placed order
     * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_gethistoricalorder
     */
    getOrder(orderId) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const resource = `${OrderAPI.URL.ORDERS}/historical/${orderId}`;
            try {
                const response = yield this.apiClient.get(resource);
                const order = ((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.order) || ((_b = response === null || response === void 0 ? void 0 : response.data) === null || _b === void 0 ? void 0 : _b.data) || response.data;
                return order;
            }
            catch (error) {
                /**
                 * If the order is canceled the response may
                 * have status code 404 if the order had no matches.
                 */
                if (error.response.status === 404) {
                    return null;
                }
                throw error;
            }
        });
    }
    /**
     * You can place two types of orders: limit and market. Orders can only be placed if your account has sufficient
     * funds. Once an order is placed, your account funds will be put on hold for the duration of the order.
     *
     * @param newOrder - Order type and parameters
     * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_postorder
     */
    placeOrder(newOrder) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = OrderAPI.URL.ORDERS;
            const response = yield this.apiClient.post(resource, newOrder);
            return response.data;
        });
    }
}
exports.OrderAPI = OrderAPI;
OrderAPI.URL = {
    ORDERS: `/brokerage/orders`,
};
//# sourceMappingURL=OrderAPI.js.map