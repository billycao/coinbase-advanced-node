"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const BTC_USD_1581292800000_60_json_1 = __importDefault(require("../test/fixtures/rest/products/BTC-USD/candles/BTC-USD-1581292800000-60.json"));
describe('CandleBucketUtil', () => {
    beforeAll(() => {
        expect(BTC_USD_1581292800000_60_json_1.default.length).toBe(10080);
    });
    describe('getIntervals', () => {
        it('returns valid granularity values as numbers', () => {
            const expected = [60, 300, 900, 3600, 21600, 86400];
            const actual = _1.CandleBucketUtil.getIntervals();
            expect(actual).toEqual(expected);
        });
    });
    describe('addUnitISO', () => {
        it('calculates the next timestamp', () => {
            const time = '2020-04-20T11:38:00.000Z';
            const granularity = _1.CandleGranularity.ONE_HOUR;
            const expected = '2020-04-20T12:38:00.000Z';
            const actual = _1.CandleBucketUtil.addUnitISO(time, granularity, 1);
            expect(actual).toBe(expected);
        });
        it('works with numbers', () => {
            const time = new Date('2020-04-20T11:38:00.000Z').getTime();
            const granularity = _1.CandleGranularity.ONE_HOUR;
            const expected = '2020-04-20T12:38:00.000Z';
            const actual = _1.CandleBucketUtil.addUnitISO(time, granularity, 1);
            expect(actual).toBe(expected);
        });
        it('works with multiple units', () => {
            const time = '2020-04-20T11:38:00.000Z';
            const granularity = _1.CandleGranularity.ONE_MINUTE;
            const expected = '2020-04-20T11:40:00.000Z';
            const actual = _1.CandleBucketUtil.addUnitISO(time, granularity, 2);
            expect(actual).toBe(expected);
        });
    });
    describe('removeUnitISO', () => {
        it('calculates the previous timestamp', () => {
            const time = '2020-04-20T11:38:00.000Z';
            const granularity = _1.CandleGranularity.ONE_HOUR;
            const expected = '2020-04-20T10:38:00.000Z';
            const actual = _1.CandleBucketUtil.removeUnitISO(time, granularity, 1);
            expect(actual).toBe(expected);
        });
        it('works with numbers', () => {
            const time = new Date('2020-04-20T11:38:00.000Z').getTime();
            const granularity = _1.CandleGranularity.ONE_HOUR;
            const expected = '2020-04-20T10:38:00.000Z';
            const actual = _1.CandleBucketUtil.removeUnitISO(time, granularity, 1);
            expect(actual).toBe(expected);
        });
        it('works with multiple units', () => {
            const time = '2020-04-20T11:38:00.000Z';
            const granularity = _1.CandleGranularity.ONE_MINUTE;
            const expected = '2020-04-20T11:36:00.000Z';
            const actual = _1.CandleBucketUtil.removeUnitISO(time, granularity, 2);
            expect(actual).toBe(expected);
        });
    });
    describe('mapInterval', () => {
        it('matches a value within a range', () => {
            const range = [60, 300, 900, 3600, 21600, 86400];
            const value = 3600;
            expect(_1.CandleBucketUtil.mapInterval(range, value)).toBe(3600);
        });
        it('caps a value at the maximum', () => {
            const range = [60, 300, 900, 3600, 21600, 86400];
            const value = 100000;
            expect(_1.CandleBucketUtil.mapInterval(range, value)).toBe(86400);
        });
        it('caps a value at the minimum', () => {
            const range = [60, 300, 900, 3600, 21600, 86400];
            const value = 10;
            expect(_1.CandleBucketUtil.mapInterval(range, value)).toBe(60);
        });
        it('gets the closest matching value', () => {
            const range = [60, 300, 900, 3600, 21600, 86400];
            const value = 700;
            expect(_1.CandleBucketUtil.mapInterval(range, value)).toBe(900);
        });
    });
    describe('mapGranularity', () => {
        it('maps a number to granularity', () => {
            const number = 60;
            const granularity = _1.CandleBucketUtil.mapGranularity(number);
            expect(granularity).toBe(_1.CandleGranularityNumbers.ONE_MINUTE);
        });
    });
    describe('expectedBuckets', () => {
        it('calculates the amount of required candles for a week', () => {
            const fromInMillis = new Date('2020-02-03T00:00:00.000Z').getTime();
            const toInMillis = new Date('2020-02-10T00:00:00.000Z').getTime();
            const candleSizeInMillis = _1.CandleGranularityNumbers.ONE_DAY * 1000;
            const candles = _1.CandleBucketUtil.expectedBuckets(fromInMillis, toInMillis, candleSizeInMillis);
            expect(candles).toBe(7);
        });
        it('calculates the amount of required candles for a year', () => {
            const fromInMillis = new Date('2019-01-01T00:00:00.000Z').getTime();
            const toInMillis = new Date('2020-01-01T00:00:00.000Z').getTime();
            const candleSizeInMillis = _1.CandleGranularityNumbers.ONE_DAY * 1000;
            const candles = _1.CandleBucketUtil.expectedBuckets(fromInMillis, toInMillis, candleSizeInMillis);
            expect(candles).toBe(365);
        });
    });
    describe('getBucketsInMillis', () => {
        it('returns the intervals in milliseconds if historic rates API requests must be batched', () => {
            const expected = [1546300800000, 1572220799999, 1572220800000, 1577836800000];
            const fromInMillis = new Date('2019-01-01T00:00:00.000Z').getTime();
            const toInMillis = new Date('2020-01-01T00:00:00.000Z').getTime();
            const candleSizeInMillis = _1.CandleGranularityNumbers.ONE_DAY * 1000;
            const actual = _1.CandleBucketUtil.getBucketsInMillis(fromInMillis, toInMillis, candleSizeInMillis);
            expect(actual).toEqual(expected);
        });
    });
    describe('getBucketsInISO', () => {
        it('converts millisecond buckets into ISO string buckets', () => {
            const bucketsInMillis = [1546300800000, 1572220799999, 1572220800000, 1577836800000];
            const bucketsInISO = _1.CandleBucketUtil.getBucketsInISO(bucketsInMillis);
            expect(bucketsInISO).toEqual([
                {
                    start: '2019-01-01T00:00:00.000Z',
                    stop: '2019-10-27T23:59:59.999Z',
                },
                {
                    start: '2019-10-28T00:00:00.000Z',
                    stop: '2020-01-01T00:00:00.000Z',
                },
            ]);
        });
    });
    describe('getMaxPrice', () => {
        it('gets the maximum closing price by default', () => {
            const maximum = _1.CandleBucketUtil.getMaxPrice(BTC_USD_1581292800000_60_json_1.default);
            expect(maximum).toBe(10519.83);
        });
        it('gets the maximum opening price', () => {
            const maximum = _1.CandleBucketUtil.getMaxPrice(BTC_USD_1581292800000_60_json_1.default, 'open');
            expect(maximum).toBe(10519.84);
        });
    });
    describe('getMinPrice', () => {
        it('gets the minimum closing price by default', () => {
            const maximum = _1.CandleBucketUtil.getMinPrice(BTC_USD_1581292800000_60_json_1.default);
            expect(maximum).toBe(9626);
        });
        it('gets the minimum opening price', () => {
            const maximum = _1.CandleBucketUtil.getMinPrice(BTC_USD_1581292800000_60_json_1.default, 'open');
            expect(maximum).toBe(9625.99);
        });
    });
});
//# sourceMappingURL=CandleBucketUtil.test.js.map