/// <reference types="node" />
import { AxiosInstance } from 'axios';
import { ISO_8601_MS_UTC, OrderAmount, OrderSide, PaginatedData, Pagination, UNIX_STAMP } from '../payload/common';
import { RESTClient } from '..';
export interface Product {
    auction_mode: boolean;
    base_currency_id: string;
    base_increment: string;
    base_max_size: string;
    base_min_size: string;
    base_name: string;
    cancel_only: boolean;
    is_disabled: boolean;
    limit_only: boolean;
    mid_market_price: string;
    new: boolean;
    post_only: boolean;
    price: string;
    price_percentage_change_24h: string;
    product_id: string;
    product_type: string;
    quote_currency_id: string;
    quote_increment: string;
    quote_max_size: string;
    quote_min_size: string;
    quote_name: string;
    status: string;
    trading_disabled: boolean;
    volume_24h: string;
    volume_percentage_change_24h: string;
    watched: boolean;
}
export interface ProductTicker {
    ask: string;
    bid: string;
    price: string;
    size: string;
    time: string;
    trade_id: number;
    volume: string;
}
export interface ProductStats {
    high: string;
    last: string;
    low: string;
    open: string;
    volume: string;
    volume_30day: string;
}
export interface Trade {
    ask: string;
    best_ask: string;
    best_bid: string;
    bid: string;
    price: string;
    product_id: string;
    side: OrderSide;
    size: string;
    time: ISO_8601_MS_UTC;
    trade_id: string;
}
/** Accepted granularity in seconds to group historic rates. */
export declare enum CandleGranularityNumbers {
    ONE_MINUTE = 60,
    FIVE_MINUTE = 300,
    FIFTEEN_MINUTE = 900,
    ONE_HOUR = 3600,
    SIX_HOUR = 21600,
    ONE_DAY = 86400,
    THIRTY_MINUTE = 1800,
    TWO_HOUR = 7200
}
export declare enum CandleGranularity {
    FIFTEEN_MINUTE = "FIFTEEN_MINUTE",
    FIVE_MINUTE = "FIVE_MINUTE",
    ONE_DAY = "ONE_DAY",
    ONE_HOUR = "ONE_HOUR",
    ONE_MINUTE = "ONE_MINUTE",
    SIX_HOUR = "SIX_HOUR",
    THIRTY_MINUTE = "THIRTY_MINUTE",
    TWO_HOUR = "TWO_HOUR"
}
export declare const getNumericCandleGranularity: (key: CandleGranularity) => number;
export interface BaseHistoricRateRequest {
    /** Desired time slice in seconds. */
    granularity: CandleGranularity;
}
export interface HistoricRateRequestWithTimeSpan extends BaseHistoricRateRequest {
    /** Opening time (ISO 8601) of last candle, i.e. "2020-04-28T23:00:00.000Z" */
    end: ISO_8601_MS_UTC | UNIX_STAMP;
    /** Opening time (ISO 8601) of first candle, i.e. "2020-04-28T00:00:00.000Z" */
    start: ISO_8601_MS_UTC | UNIX_STAMP;
}
export declare type HistoricRateRequest = BaseHistoricRateRequest | HistoricRateRequestWithTimeSpan;
export interface PriceBook {
    asks: OrderAmount[];
    bids: OrderAmount[];
    product_id: string;
    time: ISO_8601_MS_UTC;
}
declare type Close = number;
declare type High = number;
declare type Low = number;
declare type Open = number;
declare type Volume = number;
export interface Candle {
    /** ID of base asset */
    base: string;
    /** Closing price (last trade) in the bucket interval */
    close: Close;
    /** ID of quote asset */
    counter: string;
    /** Highest price during the bucket interval */
    high: High;
    /** Lowest price during the bucket interval */
    low: Low;
    /** Opening price (first trade) in the bucket interval */
    open: Open;
    /** Bucket start time in simplified extended ISO 8601 format */
    openTimeInISO: ISO_8601_MS_UTC;
    /** Bucket start time converted to milliseconds (note: Coinbase Pro actually uses seconds) */
    openTimeInMillis: number;
    /** Product ID / Symbol */
    productId: string;
    /** Candle size in milliseconds */
    sizeInMillis: number;
    /** Volume of trading activity during the bucket interval */
    volume: Volume;
}
declare type CandleWatcherConfig = {
    expectedISO: ISO_8601_MS_UTC;
    intervalId: NodeJS.Timeout;
};
export declare enum ProductEvent {
    NEW_CANDLE = "ProductEvent.NEW_CANDLE"
}
export interface ProductsQueryParams {
    contract_expiry_type?: string;
    limit?: number;
    offset?: number;
    product_ids?: string[];
    product_type?: string;
}
export interface MarketTradesResponse extends PaginatedData<Trade> {
    best_ask: string;
    best_bid: string;
}
export declare class ProductAPI {
    private readonly apiClient;
    private readonly restClient;
    static readonly URL: {
        PRODUCTS: string;
    };
    private watchCandlesConfig;
    constructor(apiClient: AxiosInstance, restClient: RESTClient);
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
    getCandles(productId: string, params: HistoricRateRequest): Promise<Candle[]>;
    private composeCandleWatcherKey;
    getCandleWatcherConfig(productId: string, granularity: CandleGranularity): CandleWatcherConfig;
    /**
     * Watch a specific product ID for new candles. Candles will be emitted through the `ProductEvent.NEW_CANDLE` event.
     *
     * @param productId - Representation for base and counter
     * @param granularity - Desired candle size
     * @param lastCandleTime - Timestamp (ISO 8601) of last candle received
     * @returns Handle to stop the watch interval
     */
    watchCandles(productId: string, granularity: CandleGranularity, lastCandleTime: ISO_8601_MS_UTC): void;
    /**
     * Stop watching a specific candle interval.
     *
     * @param productId - Representation for base and counter
     * @param granularity - Desired candle size
     */
    unwatchCandles(productId: string, granularity: CandleGranularity): void;
    /**
     * Get trading details for a specified product.
     *
     * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getproduct
     */
    getProduct(productId: string): Promise<Product | undefined>;
    /**
     * Get trading details of all available products.
     *
     * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getproducts
     */
    getProducts(params?: ProductsQueryParams): Promise<Product[]>;
    /**
     * Get the latest trades for a product.
     *
     * @param productId - Representation for base and counter
     * @param pagination - Pagination field
     * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getmarkettrades
     */
    getTrades(productId: string, pagination?: Pagination): Promise<MarketTradesResponse>;
    /**
     * Get latest 24 hours of movement data for a product.
     *
     * @param productId - Representation for base and counter
     * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_getproductstats
     */
    getProductStats(productId: string): Promise<ProductStats>;
    /**
     * Get Best Bid/Ask
     *
     * @param productIds - Products to get asks/bids for
     * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getbestbidask
     */
    getBestAsksAndBids(productIds: string[]): Promise<PriceBook[]>;
    /**
     * Get Product Book
     *
     * @param productId - Products to get asks/bids for
     * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getproductbook
     */
    getProductBook(productId: string, limit?: number): Promise<PriceBook>;
    private emitCandle;
    private checkNewCandles;
    private startCandleInterval;
}
export {};
