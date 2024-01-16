/// <reference types="node" />
import { EventEmitter } from 'events';
import ReconnectingWebSocket, { Event, ErrorEvent, Options, CloseEvent } from 'reconnecting-websocket';
import { Candle, ISO_8601_MS_UTC, OrderSide, OrderStatus, OrderType, RESTClient } from '..';
import { RequestSetup, SignedRequest } from '../auth/RequestSigner';
export interface WebSocketChannel {
    channel: WebSocketChannelName;
    product_ids?: string[];
}
export interface WebsocketResponseData {
    channel: WebSocketChannelName;
    client_id: string;
    events?: WebSocketStatusMessageEvent[] | WebSocketTickerMessageEvent[] | WebSocketL2MessageEvent[] | WebsocketMarketTradesMessageEvent[] | WebsocketHeartBeatMessageEvent[] | WebsocketUserMessageEvent[] | WebsocketCandlesMessageEvent[] | WebSocketSubscriptionEvent[];
    sequence_num: number;
    timestamp: ISO_8601_MS_UTC;
}
export declare enum WebSocketChannelName {
    /** Subscribe to the candles channel to receive candles messages for specific products with updates every second. Candles are grouped into buckets (granularities) of five minutes. */
    CANDLES = "candles",
    /** Real-time server pings to keep all connections open */
    HEARTBEAT = "heartbeats",
    /** The easiest way to keep a snapshot of the order book is to use the level2 channel. It guarantees delivery of all updates, which reduce a lot of the overhead required when consuming the full channel. */
    LEVEL2 = "level2",
    /** The market_trades channel sends market trades for a specified product on a preset interval. */
    MARKET_TRADES = "market_trades",
    /** The status channel will send all products and currencies on a preset interval. */
    STATUS = "status",
    /** The ticker channel provides real-time price updates every time a match happens. It batches updates in case of cascading matches, greatly reducing bandwidth requirements. */
    TICKER = "ticker",
    /** A special version of the ticker channel that only provides a ticker update about every 5 seconds. */
    TICKER_BATCH = "ticker_batch",
    /** The user channel sends updates on all of a user's open orders, including all subsequent updates of those orders. */
    USER = "user"
}
export interface WebSocketRequest extends WebSocketChannel {
    type: WebSocketRequestType;
}
export declare enum WebSocketRequestType {
    SUBSCRIBE = "subscribe",
    UNSUBSCRIBE = "unsubscribe"
}
export declare enum WebSocketResponseType {
    /** When candles message */
    CANDLES = "candles",
    /** Most failure cases will cause an error message (a message with the type "error") to be emitted. */
    ERROR = "error",
    /** Subscribing to the heartbeats channel, alongside other channels, ensures that all subscriptions stay open when updates are sparse. This is useful, for example, when fetching market data for illiquid pairs. */
    HEARTBEAT = "heartbeats",
    /** When subscribing to the 'level2' channel it will send an initial snapshot message with the corresponding product ids, bids and asks to represent the entire order book. */
    LEVEL2 = "l2_data",
    /** is of the type snapshot or update, and contains an array of market trades. Each market trade belongs to a side, which can be of type BUY, or SELL */
    MARKET_TRADES = "market_trades",
    /** The status channel will send all products and currencies on a preset interval. */
    STATUS = "status",
    /** Once a subscribe or unsubscribe message is received, the server will respond with a subscriptions message that lists all channels you are subscribed to. */
    SUBSCRIPTIONS = "subscriptions",
    /** The ticker channel provides real-time price updates every time a match happens. */
    TICKER = "ticker",
    /** The user channel sends updates on all of a user's open orders, including all subsequent updates of those orders. */
    USER = "user"
}
export declare type WebSocketResponse = WebSocketMessage & {
    type: WebSocketResponseType;
};
declare type WebSocketMessage = Record<string, string | number | boolean> | WebSocketStatusMessage | WebSocketTickerMessage | WebSocketErrorMessage | WebsocketUserMessage | WebsocketResponseData | WebSocketL2Message | WebsocketCandlesMessage | WebsocketMarketTradesMessage;
export interface WebSocketErrorMessage {
    message: string;
    reason: string;
    type: WebSocketResponseType.ERROR;
}
export declare enum MessageEventType {
    SNAPSHOT = "snapshot",
    UPDATE = "update"
}
export interface WebsocketProductStatus {
    base_currency: string;
    base_increment: string;
    display_name: string;
    id: string;
    min_market_funds: string;
    product_type: string;
    quote_currency: string;
    quote_increment: string;
    status: string;
    status_message: string;
}
export interface WebSocketStatusMessageEvent {
    products: WebsocketProductStatus[];
    type: MessageEventType;
}
export interface WebSocketStatusMessage extends WebsocketResponseData {
    events: WebSocketStatusMessageEvent[];
    type: WebSocketResponseType.STATUS;
}
export interface WebsocketTicker {
    high_24_h: string;
    high_52_w: string;
    low_24_h: string;
    low_52_w: string;
    price: string;
    price_percent_chg_24_h: string;
    product_id: string;
    type: string;
    volume_24_h: string;
}
export interface WebSocketTickerMessageEvent {
    tickers: WebsocketTicker[];
    type: MessageEventType;
}
export interface WebSocketTickerMessage extends WebsocketResponseData {
    events: WebSocketTickerMessageEvent[];
    type: WebSocketResponseType.TICKER;
}
export interface WebsocketMarketTrade {
    price: string;
    product_id: string;
    side: OrderSide;
    size: string;
    time: ISO_8601_MS_UTC;
    trade_id: string;
}
export declare enum WebSocketL2OrderSide {
    BID = "bid",
    OFFER = "offer"
}
export interface WebSocketL2UpdateInfo {
    event_time: ISO_8601_MS_UTC;
    new_quantity: string;
    price_level: string;
    side: WebSocketL2OrderSide;
}
export interface WebSocketL2MessageEvent {
    product_id: string;
    type: MessageEventType;
    updates: WebSocketL2UpdateInfo[];
}
export interface WebSocketL2Message extends WebsocketResponseData {
    events: WebSocketL2MessageEvent[];
    type: WebSocketResponseType.LEVEL2;
}
export interface WebSocketSubscriptionEvent {
    subscriptions: Record<WebSocketResponseType, string[]>;
}
export interface WebSocketSubscription extends WebsocketResponseData {
    channels: WebSocketChannel[];
    events: WebSocketSubscriptionEvent[];
    type: WebSocketResponseType.SUBSCRIPTIONS;
}
export interface WebsocketMarketTradesMessageEvent {
    trades: WebsocketMarketTrade[];
    type: MessageEventType;
}
export interface WebsocketMarketTradesMessage extends WebsocketResponseData {
    events: WebsocketMarketTradesMessageEvent[];
    type: WebSocketResponseType.MARKET_TRADES;
}
export interface WebsocketCandlesMessageEvent {
    candles: Candle[];
    type: MessageEventType;
}
export interface WebsocketCandlesMessage extends WebsocketResponseData {
    events: WebsocketCandlesMessageEvent[];
    type: WebSocketResponseType.CANDLES;
}
export interface WebsocketUserOrder {
    avg_price: string;
    client_order_id: string;
    creation_time: ISO_8601_MS_UTC;
    cumulative_quantity: string;
    leaves_quantity: string;
    order_id: string;
    order_side: OrderSide;
    order_type: OrderType;
    product_id: string;
    status: OrderStatus;
    total_fees: string;
}
export interface WebsocketUserMessageEvent {
    orders: WebsocketUserOrder[];
    type: MessageEventType;
}
export interface WebsocketUserMessage extends WebsocketResponseData {
    events: WebsocketUserMessageEvent[];
    type: WebSocketResponseType.USER;
}
export interface WebsocketHeartBeatMessageEvent {
    current_time: ISO_8601_MS_UTC;
    heartbeat_counter: string;
}
export interface WebsocketHeartbeatMessage extends WebsocketResponseData {
    events: WebsocketHeartBeatMessageEvent[];
    type: WebSocketResponseType.HEARTBEAT;
}
export declare enum WebSocketEvent {
    ON_CLOSE = "WebSocketEvent.ON_CLOSE",
    ON_ERROR = "WebSocketEvent.ON_ERROR",
    ON_MESSAGE = "WebSocketEvent.ON_MESSAGE",
    ON_MESSAGE_CANDLES = "WebSocketEvent.ON_MESSAGE_CANDLES",
    ON_MESSAGE_ERROR = "WebSocketEvent.ON_MESSAGE_ERROR",
    ON_MESSAGE_HEARTBEAT = "WebSocketEvent.ON_MESSAGE_HEARTBEAT",
    ON_MESSAGE_LEVEL2 = "WebSocketEvent.ON_MESSAGE_LEVEL2",
    ON_MESSAGE_MARKET_TRADES = "WebSocketEvent.ON_MESSAGE_MARKET_TRADES",
    ON_MESSAGE_STATUS = "WebSocketEvent.ON_MESSAGE_STATUS",
    ON_MESSAGE_TICKER = "WebSocketEvent.ON_MESSAGE_TICKER",
    ON_OPEN = "WebSocketEvent.ON_OPEN",
    ON_SUBSCRIPTION_UPDATE = "WebSocketEvent.ON_SUBSCRIPTION_UPDATE",
    ON_USER_UPDATE = "WebSocketEvent.ON_USER_UPDATE"
}
export interface WebSocketClient {
    on(event: WebSocketEvent.ON_CLOSE, listener: (event: CloseEvent) => void): this;
    on(event: WebSocketEvent.ON_ERROR, listener: (event: ErrorEvent) => void): this;
    on(event: WebSocketEvent.ON_MESSAGE, listener: (response: WebSocketResponse) => void): this;
    on(event: WebSocketEvent.ON_MESSAGE_ERROR, listener: (errorMessage: WebSocketErrorMessage) => void): this;
    on(event: WebSocketEvent.ON_MESSAGE_CANDLES, listener: (candleMessage: WebsocketCandlesMessage) => void): this;
    on(event: WebSocketEvent.ON_MESSAGE_HEARTBEAT, listener: (heartbeatMessage: WebsocketHeartbeatMessage) => void): this;
    on(event: WebSocketEvent.ON_MESSAGE_STATUS, listener: (statusMessage: WebSocketStatusMessage) => void): this;
    on(event: WebSocketEvent.ON_MESSAGE_TICKER, listener: (tickerMessage: WebSocketTickerMessage) => void): this;
    on(event: WebSocketEvent.ON_SUBSCRIPTION_UPDATE, listener: (subscriptions: WebSocketSubscription) => void): this;
    on(event: WebSocketEvent.ON_MESSAGE_LEVEL2, listener: (l2update: WebSocketL2Message) => void): this;
    on(event: WebSocketEvent.ON_MESSAGE_MARKET_TRADES, listener: (marketTrades: WebsocketMarketTradesMessage) => void): this;
    on(event: WebSocketEvent.ON_USER_UPDATE, listener: (userMessage: WebsocketUserMessage) => void): this;
    on(event: WebSocketEvent.ON_OPEN, listener: (event: Event) => void): this;
}
export declare class WebSocketClient extends EventEmitter {
    private readonly signRequest;
    private readonly restClient;
    static CLOSE_EVENT_CODE: {
        GOING_AWAY: number;
        NORMAL_CLOSURE: number;
        PROTOCOL_ERROR: number;
        UNSUPPORTED_DATA: number;
    };
    private readonly baseURL;
    socket: ReconnectingWebSocket | undefined;
    private pingInterval?;
    private pongTimeout?;
    private pingTime;
    private readonly pongTime;
    private userID;
    constructor(baseURL: string, signRequest: (setup: RequestSetup) => Promise<SignedRequest>, restClient: RESTClient);
    /**
     * The websocket feed is publicly available, but connections to it are rate-limited to 1 per 4 seconds per IP.
     *
     * @param reconnectOptions - Reconnect options to be used with the "reconnecting-websocket" package. Note: Options
     *   will be merged with sensible default values.
     * @see https://docs.cloud.coinbase.com/exchange/docs/websocket-overview
     */
    connect(reconnectOptions?: Options): ReconnectingWebSocket;
    disconnect(reason?: string): void;
    /**
     * A simple function to determine if the websocket appears to be open.
     *
     * @returns True if the websocket has been opened and has not closed.
     */
    get connected(): boolean;
    sendMessage(message: WebSocketRequest): Promise<void>;
    subscribe(channel: WebSocketChannel | WebSocketChannel[]): Promise<void>;
    unsubscribe(channel: WebSocketChannelName | WebSocketChannel | WebSocketChannel[]): Promise<void>;
    private cleanupListener;
    private heartbeat;
    private onPongTimeout;
    /**
     * Setup a heartbeat with ping/pong interval to avoid broken WebSocket connections:
     * @see https://github.com/websockets/ws#how-to-detect-and-close-broken-connections
     */
    private setupHeartbeat;
    private mergeOptions;
    private mapChannels;
}
export {};
