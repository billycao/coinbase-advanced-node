import { AxiosInstance } from 'axios';
import { ISO_8601_MS_UTC, OrderSide, PaginatedData, Pagination, UUID_V4 } from '../payload/common';
export declare enum Liquidity {
    MAKER = "M",
    TAKER = "T"
}
export declare enum LiquidityIndicatorTypes {
    MAKER = "MAKER",
    TAKER = "TAKER",
    UNKNOWN_LIQUIDITY_INDICATOR = "UNKNOWN_LIQUIDITY_INDICATOR"
}
export declare enum FillTradeType {
    CORRECTION = "CORRECTION",
    FILL = "FILL",
    REVERSAL = "REVERSAL",
    SYNTHETIC = "SYNTHETIC"
}
export interface Fill {
    commission: string;
    entry_id: string;
    liquidity_indicator: LiquidityIndicatorTypes;
    order_id: UUID_V4;
    price: string;
    product_id: string;
    sequence_timestamp: ISO_8601_MS_UTC;
    side: OrderSide;
    size: string;
    size_in_quote: boolean;
    trade_id: string;
    trade_time: ISO_8601_MS_UTC;
    trade_type: FillTradeType;
    user_id: string;
}
export interface FillApiQueryParams {
    cursor?: string;
    end_sequence_timestamp?: ISO_8601_MS_UTC;
    limit?: number;
    order_id?: string;
    product_id?: string;
    start_sequence_timestamp?: ISO_8601_MS_UTC;
}
export declare class FillAPI {
    private readonly apiClient;
    static readonly URL: {
        FILLS: string;
    };
    constructor(apiClient: AxiosInstance);
    /**
     * Get a list of recent fills for a given Order of the API key.
     *
     * @param orderId - ID of previously placed order
     * @param queryParams - Pagination instance provides legacy cb-pro interface, use FillApiQueryParams for additional options
     */
    getFillsByOrderId(orderId: string, queryParams?: FillApiQueryParams | Pagination): Promise<PaginatedData<Fill>>;
    /**
     * Get a list of recent fills for a given Product of the API key
     *
     * @param productId - Representation for base and counter
     * @param queryParams - Pagination instance provides legacy cb-pro interface, use FillApiQueryParams for additional options
     */
    getFillsByProductId(productId: string, queryParams?: FillApiQueryParams | Pagination): Promise<PaginatedData<Fill>>;
    /**
     * Get a list of recent fills associated to the API key
     *
     * @param query - query to filter results
     * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getfills
     */
    getFills(query: FillApiQueryParams): Promise<PaginatedData<Fill>>;
}
