import { Candle, CandleGranularity } from '.';
import { CandleGranularityNumbers, ISO_8601_MS_UTC } from '..';
export interface CandleBatchBucket {
    start: ISO_8601_MS_UTC;
    stop: ISO_8601_MS_UTC;
}
export declare class CandleBucketUtil {
    static mapCandle(payload: any, sizeInMillis: number, productId: string): Candle;
    static getMinPrice(candles: Candle[], property?: 'close' | 'high' | 'low' | 'open'): number;
    static getMaxPrice(candles: Candle[], property?: 'close' | 'high' | 'low' | 'open'): number;
    static addUnitMillis(openTime: number | string, granularity: CandleGranularity, amount: number): number;
    static addUnitISO(openTime: number | string, granularityInSeconds: CandleGranularity, amount: number): ISO_8601_MS_UTC;
    static removeUnitMillis(openTime: number | string, granularity: CandleGranularity, amount: number): number;
    static removeUnitISO(openTime: number | string, granularityInSeconds: CandleGranularity, amount: number): ISO_8601_MS_UTC;
    static getIntervals(): number[];
    static mapInterval(intervals: number[], interval: number): number;
    static mapGranularity(candleSizeInMillis: number): CandleGranularityNumbers;
    static expectedBuckets(fromInMillis: number, toInMillis: number, candleSize: CandleGranularityNumbers): number;
    static getBucketsInMillis(fromInMillis: number, toInMillis: number, candleSizeInMillis: number): number[];
    static getBucketsInISO(bucketsInMillis: number[]): CandleBatchBucket[];
}
