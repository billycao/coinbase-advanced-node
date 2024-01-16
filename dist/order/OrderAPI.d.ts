import { AxiosInstance } from 'axios';
import { ISO_8601_MS_UTC, OrderSide, PaginatedData } from '../payload';
export declare enum OrderType {
    LIMIT = "LIMIT",
    MARKET = "MARKET",
    STOP = "STOP",
    STOP_LIMIT = "STOP_LIMIT",
    UNKNOWN_ORDER_TYPE = "UNKNOWN_ORDER_TYPE"
}
export declare enum TimeInForce {
    FILL_OR_KILL = "FILL_OR_KILL",
    GOOD_UNTIL_CANCELLED = "GOOD_UNTIL_CANCELLED",
    GOOD_UNTIL_DATE_TIME = "GOOD_UNTIL_DATE_TIME",
    IMMEDIATE_OR_CANCEL = "IMMEDIATE_OR_CANCEL",
    UNKNOWN_TIME_IN_FORCE = "UNKNOWN_TIME_IN_FORCE"
}
export declare enum OrderStatus {
    CANCELLED = "CANCELLED",
    EXPIRED = "EXPIRED",
    FAILED = "FAILED",
    FILLED = "FILLED",
    OPEN = "OPEN",
    PENDING = "PENDING",
    UNKNOWN_ORDER_STATUS = "UNKNOWN_ORDER_STATUS"
}
export declare enum TriggerStatus {
    INVALID_ORDER_TYPE = "INVALID_ORDER_TYPE",
    STOP_PENDING = "STOP_PENDING",
    STOP_TRIGGERED = "STOP_TRIGGERED",
    UNKNOWN_TRIGGER_STATUS = "UNKNOWN_TRIGGER_STATUS"
}
export declare enum StopDirection {
    STOP_DIRECTION_STOP_DOWN = "STOP_DIRECTION_STOP_DOWN",
    STOP_DIRECTION_STOP_UP = "STOP_DIRECTION_STOP_UP",
    UNKNOWN_STOP_DIRECTION = "UNKNOWN_STOP_DIRECTION"
}
export interface LimitOrderGTC {
    limit_limit_gtc: {
        base_size: string;
        limit_price: string;
        post_only: boolean;
    };
}
export interface LimitOrderGTD {
    limit_limit_gtd: {
        base_size: string;
        end_time: ISO_8601_MS_UTC;
        limit_price: string;
        post_only: boolean;
    };
}
export interface StopOrderGTC {
    stop_limit_stop_limit_gtc: {
        base_size: string;
        limit_price: string;
        stop_direction: StopDirection;
        stop_price: string;
    };
}
export interface StopOrderGTD {
    stop_limit_stop_limit_gtc: {
        base_size: string;
        end_time: ISO_8601_MS_UTC;
        limit_price: string;
        stop_direction: StopDirection;
        stop_price: string;
    };
}
export interface MarketOrder {
    market_market_ioc: {
        base_size?: string;
        quote_size?: string;
    };
}
export declare type OrderConfiguration = MarketOrder | LimitOrderGTC | LimitOrderGTD | StopOrderGTC | StopOrderGTD;
export interface NewOrder {
    client_order_id: string;
    order_configuration: OrderConfiguration;
    product_id: string;
    side: OrderSide;
}
export declare enum CancelOrderFailureReasons {
    COMMANDER_REJECTED_CANCEL_ORDER = "COMMANDER_REJECTED_CANCEL_ORDER",
    DUPLICATE_CANCEL_REQUEST = "DUPLICATE_CANCEL_REQUEST",
    INVALID_CANCEL_REQUEST = "INVALID_CANCEL_REQUEST",
    UNKNOWN_CANCEL_FAILURE_REASON = "UNKNOWN_CANCEL_FAILURE_REASON",
    UNKNOWN_CANCEL_ORDER = "UNKNOWN_CANCEL_ORDER"
}
export interface CancelOrderResponse {
    failure_reason?: CancelOrderFailureReasons;
    order_id: string;
    success?: boolean;
}
/** @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_gethistoricalorders */
export interface OrderListQueryParam {
    end_date?: ISO_8601_MS_UTC;
    limit?: number;
    order_side?: OrderSide;
    /** Limit list of orders to these statuses. Passing "all" returns orders of all statuses. Default: [open, pending, active] */
    order_status?: (OrderStatus | 'all')[];
    order_type?: OrderType;
    /** Only list orders for a specific product. */
    product_id?: string;
    product_type?: string;
    start_date?: ISO_8601_MS_UTC;
    user_native_currency?: string;
}
export interface Order {
    average_filled_price: string;
    cancel_message: string;
    client_order_id: string;
    completion_percentage: string;
    created_time: ISO_8601_MS_UTC;
    fee: string;
    filled_size: string;
    filled_value: string;
    id(id: any): unknown;
    number_of_fills: string;
    order_configuration: OrderConfiguration;
    order_id: string;
    order_type: OrderType;
    pending_cancel: boolean;
    product_id: string;
    product_type: string;
    reject_message: string;
    reject_reason: string;
    settled: boolean;
    side: OrderSide;
    size_in_quote: boolean;
    size_inclusive_of_fees: boolean;
    status: OrderStatus;
    time_in_force: TimeInForce;
    total_fees: string;
    total_value_after_fees: string;
    trigger_status: TriggerStatus;
    user_id: string;
}
export interface CreateOrderResponse {
    error_response?: {
        error: string;
        error_details: string;
        message: string;
        new_order_failure_reason: string;
        preview_failure_reason: string;
    };
    failure_reason?: string;
    order_configuration?: OrderConfiguration;
    order_id: string;
    success: boolean;
    success_response?: {
        client_order_id: string;
        order_id: string;
        product_id: string;
        side: OrderSide;
    };
}
export declare class OrderAPI {
    private readonly apiClient;
    static readonly URL: {
        ORDERS: string;
    };
    constructor(apiClient: AxiosInstance);
    /**
     * Cancel these orders
     *
     * @param orderIds - Representation for base and counter
     * @returns A list of ids of the canceled orders
     * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_cancelorders
     */
    cancelOpenOrders(orderIds?: string | string[]): Promise<CancelOrderResponse[]>;
    /**
     * Cancel a previously placed order. Order must belong to the profile that the API key belongs to.
     *
     * @param orderId - ID of the order to cancel
     * @param productId - deprecated
     * @returns The ID of the canceled order
     * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_deleteorder
     */
    cancelOrder(orderId: string, _productId?: string): Promise<CancelOrderResponse>;
    /**
     * List your orders from the profile that the API key belongs to. Only open or un-settled orders are returned. As
     * soon as an order is no longer open and settled, it will no longer appear in the default request.
     *
     * @note Depending on your activity, fetching all data from this endpoint can take very long (measured already 25
     *   seconds!)
     * @param query - Available query parameters (Pagination, Product ID and/or Order Status)
     * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_gethistoricalorders
     */
    getOrders(query?: OrderListQueryParam): Promise<PaginatedData<Order>>;
    /**
     * Get a single order by order id from the profile that the API key belongs to.
     *
     * @param orderId - ID of previously placed order
     * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_gethistoricalorder
     */
    getOrder(orderId: string): Promise<Order | null>;
    /**
     * You can place two types of orders: limit and market. Orders can only be placed if your account has sufficient
     * funds. Once an order is placed, your account funds will be put on hold for the duration of the order.
     *
     * @param newOrder - Order type and parameters
     * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_postorder
     */
    placeOrder(newOrder: NewOrder): Promise<CreateOrderResponse>;
}
