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
const OrderAPI_1 = require("./OrderAPI");
const payload_1 = require("../payload");
describe('OrderAPI', () => {
    afterEach(() => nock_1.default.cleanAll());
    describe('placeOrder', () => {
        it('places buy orders', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, nock_1.default)(global.REST_URL)
                .post(OrderAPI_1.OrderAPI.URL.ORDERS)
                .query(true)
                .reply((_uri, body) => {
                const newOrder = typeof body === 'string' ? JSON.parse(body) : body;
                return [
                    200,
                    JSON.stringify({
                        order_configuration: {
                            market_market_ioc: {
                                base_size: '0.001',
                                quote_size: '10.00',
                            },
                        },
                        order_id: '089797696987-97687687-96867576576',
                        success: true,
                        success_response: {
                            client_order_id: newOrder.client_order_id,
                            order_id: '089797696987-97687687-968675765760',
                            product_id: 'BTC-USD',
                            side: 'BUY',
                        },
                    }),
                ];
            });
            const placedOrder = yield global.client.rest.order.placeOrder({
                client_order_id: '224242-23232-23232323',
                order_configuration: {
                    limit_limit_gtc: {
                        base_size: '.001',
                        limit_price: '16400',
                        post_only: false,
                    },
                },
                product_id: 'BTC-USD',
                side: payload_1.OrderSide.BUY,
            });
            expect(placedOrder.order_id).toBe('089797696987-97687687-96867576576');
            expect(placedOrder.success).toBe(true);
        }));
    });
    describe('getOrders', () => {
        it('returns list of open orders', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, nock_1.default)(global.REST_URL)
                .get(OrderAPI_1.OrderAPI.URL.ORDERS + '/historical/batch')
                .query(true)
                .reply(200, (_uri) => {
                return JSON.stringify({
                    cursor: '789100',
                    has_next: true,
                    orders: [
                        {
                            average_filled_price: '50',
                            cancel_message: 'string',
                            client_order_id: '11111-000000-000000',
                            completion_percentage: '50',
                            created_time: '2021-05-31T09:59:59Z',
                            fee: 'string',
                            filled_size: '0.001',
                            filled_value: '10000',
                            number_of_fills: '2',
                            order_configuration: {
                                limit_limit_gtc: {
                                    base_size: '0.001',
                                    limit_price: '10000.00',
                                    post_only: false,
                                },
                            },
                            order_id: '0000-000000-000000',
                            order_type: 'UNKNOWN_ORDER_TYPE',
                            pending_cancel: true,
                            product_id: 'BTC-USD',
                            product_type: 'SPOT',
                            reject_message: 'string',
                            reject_reason: 'REJECT_REASON_UNSPECIFIED',
                            settled: 'boolean',
                            side: 'BUY',
                            size_in_quote: false,
                            size_inclusive_of_fees: false,
                            status: 'OPEN',
                            time_in_force: 'UNKNOWN_TIME_IN_FORCE',
                            total_fees: '5.00',
                            total_value_after_fees: 'string',
                            trigger_status: 'UNKNOWN_TRIGGER_STATUS',
                            user_id: '2222-000000-000000',
                        },
                    ],
                    sequence: 'string',
                });
            });
            const openOrders = yield global.client.rest.order.getOrders();
            expect(openOrders.data.length).toBe(1);
            expect(openOrders.data[0].side).toBe(payload_1.OrderSide.BUY);
        }));
        it('accepts a list of different order statuses', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, nock_1.default)(global.REST_URL)
                .get(OrderAPI_1.OrderAPI.URL.ORDERS + '/historical/batch')
                .query(true)
                .reply(200, (_uri) => {
                return JSON.stringify({
                    cursor: '789100',
                    has_next: true,
                    orders: [
                        {
                            average_filled_price: '50',
                            cancel_message: 'string',
                            client_order_id: '11111-000000-000000',
                            completion_percentage: '50',
                            created_time: '2021-05-31T09:59:59Z',
                            fee: 'string',
                            filled_size: '0.001',
                            filled_value: '10000',
                            number_of_fills: '2',
                            order_configuration: {
                                limit_limit_gtc: {
                                    base_size: '0.001',
                                    limit_price: '10000.00',
                                    post_only: false,
                                },
                            },
                            order_id: '0000-000000-000000',
                            order_type: 'UNKNOWN_ORDER_TYPE',
                            pending_cancel: true,
                            product_id: 'BTC-USD',
                            product_type: 'SPOT',
                            reject_message: 'string',
                            reject_reason: 'REJECT_REASON_UNSPECIFIED',
                            settled: 'boolean',
                            side: 'UNKNOWN_ORDER_SIDE',
                            size_in_quote: false,
                            size_inclusive_of_fees: false,
                            status: 'OPEN',
                            time_in_force: 'UNKNOWN_TIME_IN_FORCE',
                            total_fees: '5.00',
                            total_value_after_fees: 'string',
                            trigger_status: 'UNKNOWN_TRIGGER_STATUS',
                            user_id: '2222-000000-000000',
                        },
                    ],
                });
            });
            const openOrders = yield global.client.rest.order.getOrders({
                order_status: [OrderAPI_1.OrderStatus.OPEN, OrderAPI_1.OrderStatus.PENDING],
            });
            expect(openOrders.data.length).toBe(1);
        }));
    });
    describe('getOrder', () => {
        it('returns correct order information', () => __awaiter(void 0, void 0, void 0, function* () {
            const orderId = '0000-000000-000000';
            (0, nock_1.default)(global.REST_URL)
                .get(`${OrderAPI_1.OrderAPI.URL.ORDERS}/historical/${orderId}`)
                .query(true)
                .reply(200, JSON.stringify({
                average_filled_price: '50',
                cancel_message: 'string',
                client_order_id: '11111-000000-000000',
                completion_percentage: '50',
                created_time: '2021-05-31T09:59:59Z',
                fee: 'string',
                filled_size: '0.001',
                filled_value: '10000',
                number_of_fills: '2',
                order_configuration: {
                    limit_limit_gtc: {
                        base_size: '0.001',
                        limit_price: '10000.00',
                        post_only: false,
                    },
                },
                order_id: '0000-000000-000000',
                order_type: 'UNKNOWN_ORDER_TYPE',
                pending_cancel: true,
                product_id: 'BTC-USD',
                product_type: 'SPOT',
                reject_message: 'string',
                reject_reason: 'REJECT_REASON_UNSPECIFIED',
                settled: 'boolean',
                side: 'UNKNOWN_ORDER_SIDE',
                size_in_quote: false,
                size_inclusive_of_fees: false,
                status: 'OPEN',
                time_in_force: 'UNKNOWN_TIME_IN_FORCE',
                total_fees: '5.00',
                total_value_after_fees: 'string',
                trigger_status: 'UNKNOWN_TRIGGER_STATUS',
                user_id: '2222-000000-000000',
            }));
            const order = yield global.client.rest.order.getOrder('0000-000000-000000');
            expect(order === null || order === void 0 ? void 0 : order.order_id).toBe('0000-000000-000000');
        }));
        it('returns null if an order cannot be found', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, nock_1.default)(global.REST_URL).get(`${OrderAPI_1.OrderAPI.URL.ORDERS}/historical/123`).query(true).reply(404);
            const order = yield global.client.rest.order.getOrder('123');
            expect(order).toEqual(null);
        }));
        it('rethrows errors with status code other than 404', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, nock_1.default)(global.REST_URL).get(`${OrderAPI_1.OrderAPI.URL.ORDERS}/historical/123`).query(true).reply(403);
            try {
                yield global.client.rest.order.getOrder('123');
            }
            catch (error) {
                expect(error.response.status).toBe(403);
            }
        }));
    });
    describe('cancelOrder', () => {
        it('correctly cancels a specific order', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, nock_1.default)(global.REST_URL)
                .post(`${OrderAPI_1.OrderAPI.URL.ORDERS}/batch_cancel`)
                .query(true)
                .reply(200, JSON.stringify({ results: [{ order_id: '8eba9e7b-08d6-4667-90ca-6db445d743c1', success: true }] }));
            const o = yield global.client.rest.order.cancelOrder('8eba9e7b-08d6-4667-90ca-6db445d743c1');
            expect(o.order_id).toEqual('8eba9e7b-08d6-4667-90ca-6db445d743c1');
        }));
    });
});
//# sourceMappingURL=OrderAPI.test.js.map