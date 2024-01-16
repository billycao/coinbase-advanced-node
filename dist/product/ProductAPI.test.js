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
const _1 = require(".");
const GET_200_json_1 = __importDefault(require("../test/fixtures/rest/products/BTC-EUR/trades/GET-200.json"));
// import CandlesBTCUSD from '../test/fixtures/rest/products/BTC-USD/candles/GET-200.json';
// import FirstCandleBatch from '../test/fixtures/rest/products/BTC-USD/candles/2020-03-20-00-00.json';
// import SecondCandleBatch from '../test/fixtures/rest/products/BTC-USD/candles/2020-03-20-05-00.json';
const mockPriceBookInfo = [
    {
        asks: [{ price: '24222.21', size: '1.2' }],
        bids: [{ price: '23750.26', size: '1.27' }],
        product_id: 'BTC-USD',
        time: new Date().toISOString(),
    },
];
describe('ProductAPI', () => {
    afterEach(() => nock_1.default.cleanAll());
    describe('getProduct', () => {
        it('returns trading details for a specified product', () => __awaiter(void 0, void 0, void 0, function* () {
            const productId = 'BTC-EUR';
            (0, nock_1.default)(global.REST_URL)
                .get(`${_1.ProductAPI.URL.PRODUCTS}/${productId}`)
                .query(true)
                .reply(200, JSON.stringify({
                auction_mode: true,
                base_currency_id: 'BTC',
                base_increment: '0.00000001',
                base_max_size: '1000',
                base_min_size: '0.00000001',
                base_name: 'Bitcoin',
                cancel_only: true,
                is_disabled: 'boolean',
                limit_only: true,
                mid_market_price: '140.22',
                new: true,
                post_only: true,
                price: '140.21',
                price_percentage_change_24h: '9.43%',
                product_id: 'BTC-USD',
                product_type: 'string',
                quote_currency_id: 'USD',
                quote_increment: '0.00000001',
                quote_max_size: '1000',
                quote_min_size: '0.00000001',
                quote_name: 'US Dollar',
                status: 'string',
                trading_disabled: 'boolean',
                volume_24h: '1908432',
                volume_percentage_change_24h: '9.43%',
                watched: true,
            }));
            const product = yield global.client.rest.product.getProduct(productId);
            expect(product.quote_currency_id).toBe('USD');
        }));
    });
    describe('getProducts', () => {
        it('returns trading details for all available products', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, nock_1.default)(global.REST_URL)
                .get(_1.ProductAPI.URL.PRODUCTS)
                .query(true)
                .reply(200, JSON.stringify({
                num_products: 100,
                products: [
                    {
                        auction_mode: true,
                        base_currency_id: 'BTC',
                        base_increment: '0.00000001',
                        base_max_size: '1000',
                        base_min_size: '0.00000001',
                        base_name: 'Bitcoin',
                        cancel_only: true,
                        is_disabled: false,
                        limit_only: true,
                        mid_market_price: '140.22',
                        new: true,
                        post_only: true,
                        price: '140.21',
                        price_percentage_change_24h: '9.43%',
                        product_id: 'BTC-USD',
                        product_type: 'SPOT',
                        quote_currency_id: 'USD',
                        quote_increment: '0.00000001',
                        quote_max_size: '1000',
                        quote_min_size: '0.00000001',
                        quote_name: 'US Dollar',
                        status: 'string',
                        trading_disabled: false,
                        volume_24h: '1908432',
                        volume_percentage_change_24h: '9.43%',
                        watched: true,
                    },
                ],
            }));
            const products = yield global.client.rest.product.getProducts();
            expect(products.length).toBe(1);
            expect(products[0].product_id).toBe('BTC-USD');
        }));
    });
    describe('getTrades', () => {
        it('lists the latest public trades for a product', () => __awaiter(void 0, void 0, void 0, function* () {
            const productId = 'BTC-EUR';
            (0, nock_1.default)(global.REST_URL)
                .get(`${_1.ProductAPI.URL.PRODUCTS}/${productId}/ticker`)
                .query(true)
                .reply(200, JSON.stringify(GET_200_json_1.default));
            const trades = yield global.client.rest.product.getTrades(productId);
            expect(trades.data.length).toBe(2);
        }));
    });
    describe('getBestAsksAndBids', () => {
        it('lists an array of responses', () => __awaiter(void 0, void 0, void 0, function* () {
            const productId = ['BTC-USD'];
            (0, nock_1.default)(global.REST_URL)
                .get(`/brokerage/best_bid_ask`)
                .query(true)
                .reply(200, JSON.stringify({ pricebooks: mockPriceBookInfo }));
            const res = yield global.client.rest.product.getBestAsksAndBids(productId);
            expect(res.length).toBe(1);
        }));
    });
    describe('getBestAsksAndBids', () => {
        it('lists an array of responses', () => __awaiter(void 0, void 0, void 0, function* () {
            const productId = 'BTC-USD';
            (0, nock_1.default)(global.REST_URL)
                .get(`/brokerage/product_book`)
                .query(true)
                .reply(200, JSON.stringify({ pricebook: mockPriceBookInfo[0] }));
            const res = yield global.client.rest.product.getProductBook(productId);
            expect(res.product_id).toBe(productId);
        }));
    });
    describe('getCandleWatcherConfig', () => {
        it('throws an error when supplying an invalid product ID', () => {
            const test = () => {
                global.client.rest.product.getCandleWatcherConfig('invalid-product-id', _1.CandleGranularity.ONE_DAY);
            };
            expect(test).toThrowError();
        });
    });
    describe('getCandles', () => {
        it('returns the latest candles when not giving any parameters', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, nock_1.default)(global.REST_URL)
                .get(`${_1.ProductAPI.URL.PRODUCTS}/BTC-USD/candles`)
                .query(() => true)
                .reply(200, JSON.stringify({
                candles: [
                    {
                        close: '140.21',
                        high: '140.21',
                        low: '140.21',
                        open: '140.21',
                        start: '1639508050',
                        volume: '56437345',
                    },
                ],
            }));
            const candles = yield global.client.rest.product.getCandles('BTC-USD', {
                granularity: _1.CandleGranularity.ONE_MINUTE,
            });
            expect(candles.length).toEqual(1);
        }));
        // it('sorts candles ascending by timestamp', async () => {
        //   const from = '2020-03-09T00:00:00.000Z';
        //   const to = '2020-03-15T23:59:59.999Z';
        //   const productId = 'BTC-USD';
        //   nock(global.REST_URL)
        //     .get(`${ProductAPI.URL.PRODUCTS}/${productId}/candles`)
        //     .query(true)
        //     .reply(() => {
        //       const min = new Date(from).getTime();
        //       const max = new Date(to).getTime();
        //       // Note: Fixture test set is larger than the requested time slice, so we have to filter:
        //       const data = CandlesBTCUSD.filter((candle: any) => {
        //         // const {time} = candle;
        //         const timeInMillis = candle.start * 1000;
        //         return timeInMillis >= min && timeInMillis <= max;
        //       });
        //       return [200, JSON.stringify({candles: data})];
        //     });
        //   const candles = await global.client.rest.product.getCandles(productId, {
        //     end: to,
        //     granularity: CandleGranularity.ONE_HOUR,
        //     start: from,
        //   });
        //   expect(candles.length).toBe(19);
        // });
        // it('makes multiple requests when the selection of start/end time and granularity will result in more than 300 data points', async () => {
        //   const from = '2020-03-20T00:00:00.000Z';
        //   const to = '2020-03-20T09:59:59.999Z';
        //   nock(global.REST_URL)
        //     .persist()
        //     .get(`${ProductAPI.URL.PRODUCTS}/BTC-USD/candles`)
        //     .query(true)
        //     .reply(uri => {
        //       if (uri.includes('start=1584662400')) {
        //         return [200, JSON.stringify({candles: FirstCandleBatch})];
        //       } else if (uri.includes('start=2020-03-20T05:00:00.000Z')) {
        //         return [200, JSON.stringify({candles: SecondCandleBatch})];
        //       }
        //       return [500];
        //     });
        //   const candles = await global.client.rest.product.getCandles('BTC-USD', {
        //     end: to,
        //     granularity: CandleGranularity.ONE_MINUTE,
        //     start: from,
        //   });
        //   expect(candles.length).withContext('10 hours are 600 minutes').toBe(600);
        // });
    });
    // describe('watchCandles', () => {
    //   beforeEach(() => jasmine.clock().install());
    //   afterEach(() => jasmine.clock().uninstall());
    //   it('starts an interval to check for new candles', async () => {
    //     const productId = 'BTC-USD';
    //     const granularity = CandleGranularity.ONE_HOUR;
    //     const updateInterval = 60000;
    //     nock(global.REST_URL)
    //       .get(`${ProductAPI.URL.PRODUCTS}/${productId}/candles`)
    //       .query(true)
    //       .reply(200, JSON.stringify({candles: CandlesBTCUSD}));
    //     const spy = spyOn<any>(global.client.rest.product, 'checkNewCandles').and.callThrough();
    //     global.client.rest.product.watchCandles(productId, granularity, '2020-03-08T23:00:00.000Z');
    //     jasmine.clock().tick(updateInterval);
    //     expect(spy).toHaveBeenCalledWith(productId, granularity);
    //   });
    //   it('throws an error when trying to watch a candle setup multiple times', () => {
    //     const productId = 'BTC-USD';
    //     const granularity = CandleGranularity.ONE_HOUR;
    //     nock(global.REST_URL)
    //       .get(`${ProductAPI.URL.PRODUCTS}/${productId}/candles`)
    //       .query(true)
    //       .reply(200, JSON.stringify({candles: CandlesBTCUSD}));
    //     global.client.rest.product.watchCandles(productId, granularity, '2020-03-08T23:00:00.000Z');
    //     try {
    //       global.client.rest.product.watchCandles(productId, granularity, '2020-03-08T23:00:00.000Z');
    //       fail('No error has been thrown');
    //     } catch (error) {}
    //   });
    //   it('emits new candles', done => {
    //     const productId = 'BTC-USD';
    //     const granularity = CandleGranularity.ONE_HOUR;
    //     const updateInterval = 60000;
    //     const expectedISO = '2020-03-09T00:00:00.000Z';
    //     const responses = [JSON.stringify({candles: []}), JSON.stringify({candles: CandlesBTCUSD})];
    //     nock(global.REST_URL)
    //       .persist(true)
    //       .get(`${ProductAPI.URL.PRODUCTS}/${productId}/candles`)
    //       .query(true)
    //       .reply(() => [200, responses.shift()]);
    //     global.client.rest.on(
    //       ProductEvent.NEW_CANDLE,
    //       (emittedProductId: string, emittedGranularity: CandleGranularity, candle: Candle) => {
    //         expect(emittedProductId).toBe(productId);
    //         expect(emittedGranularity).toBe(granularity);
    //         const {openTimeInISO} = candle;
    //         if (openTimeInISO === expectedISO) {
    //           done();
    //         } else {
    //           fail(`Received "${openTimeInISO}" but expected "${expectedISO}".`);
    //         }
    //       }
    //     );
    //     global.client.rest.product.watchCandles(productId, granularity, '2020-03-08T23:00:00.000Z');
    //     jasmine.clock().tick(updateInterval);
    //     jasmine.clock().tick(updateInterval);
    //   });
    // });
    // describe('unwatchCandles', () => {
    //   it('does not remove an unregistered interval', () => {
    //     const test = (): void => {
    //       global.client.rest.product.unwatchCandles('invalid-product-id', CandleGranularity.ONE_DAY);
    //     };
    //     expect(test).not.toThrowError();
    //   });
    //   it('removes running candle watching intervals', async () => {
    //     const productId = 'BTC-USD';
    //     nock(global.REST_URL)
    //       .persist(true)
    //       .get(`${ProductAPI.URL.PRODUCTS}/${productId}/candles`)
    //       .query(true)
    //       .reply(200, JSON.stringify({candles: CandlesBTCUSD}));
    //     global.client.rest.product.watchCandles(productId, CandleGranularity.ONE_HOUR, '2020-03-08T23:00:00.000Z');
    //     global.client.rest.product.watchCandles(productId, CandleGranularity.SIX_HOUR, '2020-03-09T00:00:00.000Z');
    //     global.client.rest.product.unwatchCandles(productId, CandleGranularity.ONE_HOUR);
    //     global.client.rest.product.unwatchCandles(productId, CandleGranularity.SIX_HOUR);
    //   });
    // });
});
//# sourceMappingURL=ProductAPI.test.js.map