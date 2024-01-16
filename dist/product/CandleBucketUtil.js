"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandleBucketUtil = void 0;
const _1 = require(".");
/** The maximum number of data points for a single historic rates API request on Coinbase Pro is 300 candles: https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_getproductcandles */
const MAXIMUM_HISTORIC_DATA_POINTS = 300;
class CandleBucketUtil {
    static mapCandle(payload, sizeInMillis, productId) {
        const { start, low, high, open, close, volume } = payload;
        const [base, counter] = productId.split('-');
        const openTimeInMillis = parseFloat(start) * 1000; // Map seconds to milliseconds
        return {
            base,
            close,
            counter,
            high,
            low,
            open,
            openTimeInISO: new Date(openTimeInMillis).toISOString(),
            openTimeInMillis,
            productId: productId,
            sizeInMillis,
            volume,
        };
    }
    static getMinPrice(candles, property = 'close') {
        const values = candles.map(candle => candle[property]);
        return Math.min(...values);
    }
    static getMaxPrice(candles, property = 'close') {
        const values = candles.map(candle => candle[property]);
        return Math.max(...values);
    }
    static addUnitMillis(openTime, granularity, amount) {
        const granularityInMillis = (0, _1.getNumericCandleGranularity)(granularity) * 1000;
        const units = amount * granularityInMillis;
        return new Date(openTime).getTime() + units;
    }
    static addUnitISO(openTime, granularityInSeconds, amount) {
        const nextTimestamp = CandleBucketUtil.addUnitMillis(openTime, granularityInSeconds, amount);
        return new Date(nextTimestamp).toISOString();
    }
    static removeUnitMillis(openTime, granularity, amount) {
        const granularityInMillis = (0, _1.getNumericCandleGranularity)(granularity) * 1000;
        const units = amount * granularityInMillis;
        return new Date(openTime).getTime() - units;
    }
    static removeUnitISO(openTime, granularityInSeconds, amount) {
        const nextTimestamp = CandleBucketUtil.removeUnitMillis(openTime, granularityInSeconds, amount);
        return new Date(nextTimestamp).toISOString();
    }
    static getIntervals() {
        return [60, 300, 900, 3600, 21600, 86400];
    }
    static mapInterval(intervals, interval) {
        return intervals.reduce((previous, current) => {
            return Math.abs(current - interval) < Math.abs(previous - interval) ? current : previous;
        });
    }
    static mapGranularity(candleSizeInMillis) {
        return this.mapInterval(CandleBucketUtil.getIntervals(), candleSizeInMillis);
    }
    static expectedBuckets(fromInMillis, toInMillis, candleSize) {
        const timeSpanInMillis = toInMillis - fromInMillis;
        return timeSpanInMillis / candleSize;
    }
    static getBucketsInMillis(fromInMillis, toInMillis, candleSizeInMillis) {
        const bucketsInMillis = [];
        const batch = MAXIMUM_HISTORIC_DATA_POINTS * candleSizeInMillis;
        let current = fromInMillis;
        bucketsInMillis.push(current); // push initial start
        current = current + batch;
        while (current < toInMillis) {
            bucketsInMillis.push(current - 1); // intermediate stop
            bucketsInMillis.push(current); // intermediate start
            current = current + batch;
        }
        bucketsInMillis.push(toInMillis); // push initial stop
        return bucketsInMillis;
    }
    static getBucketsInISO(bucketsInMillis) {
        const bucketsInISO = [];
        for (let i = 0; i < bucketsInMillis.length - 1; i += 2) {
            const start = new Date(bucketsInMillis[i]).toISOString();
            const stop = new Date(bucketsInMillis[i + 1]).toISOString();
            bucketsInISO.push({
                start,
                stop,
            });
        }
        return bucketsInISO;
    }
}
exports.CandleBucketUtil = CandleBucketUtil;
//# sourceMappingURL=CandleBucketUtil.js.map