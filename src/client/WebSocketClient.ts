import {EventEmitter} from 'events';
import ReconnectingWebSocket, {Event, ErrorEvent, Options, CloseEvent} from 'reconnecting-websocket';
import WebSocket from 'ws';
import {ISO_8601_MS_UTC, OrderSide, RESTClient} from '..';
import {RequestSetup, SignedRequest} from '../auth/RequestSigner';

export interface WebSocketChannel {
  channel: WebSocketChannelName;
  product_ids?: string[];
}

export enum WebSocketChannelName {
  /** The easiest way to keep a snapshot of the order book is to use the level2 channel. It guarantees delivery of all updates, which reduce a lot of the overhead required when consuming the full channel. */
  LEVEL2 = 'level2',
  /** The status channel will send all products and currencies on a preset interval. */
  STATUS = 'status',
  /** The ticker channel provides real-time price updates every time a match happens. It batches updates in case of cascading matches, greatly reducing bandwidth requirements. */
  TICKER = 'ticker',
  /** A special version of the ticker channel that only provides a ticker update about every 5 seconds. */
  TICKER_1000 = 'ticker_batch',
  /** A special version of the ticker channel that only provides a ticker update about every 5 seconds. */
  TICKER_BATCH = 'ticker_batch',
  /** This channel is a version of the full channel that only contains messages that include the authenticated user. Consequently, you need to be authenticated to receive any messages. */
  /** This connection accepts multiple product IDs in a product_ids array. If none are provided, the websocket subscription is open to all product IDs.  */
  USER = 'user',
}

export interface WebSocketRequest extends WebSocketChannel {
  // channels: WebSocketChannel[] | string[];
  type: WebSocketRequestType;
}

export enum WebSocketRequestType {
  SUBSCRIBE = 'subscribe',
  UNSUBSCRIBE = 'unsubscribe',
}

export enum WebSocketResponseType {
  /** Most failure cases will cause an error message (a message with the type "error") to be emitted. */
  ERROR = 'error',
  /** When subscribing to the 'level2' channel it will send an initial snapshot message with the corresponding product ids, bids and asks to represent the entire order book. */
  LEVEL2_SNAPSHOT = 'l2snapshot',
  /** Subsequent updates of a 'level2' subscription. The `time` property of `l2update` is the time of the event as recorded by our trading engine. Please note that `size` is the updated size at that price level, not a delta. A size of "0" indicates the price level can be removed. */
  LEVEL2_UPDATE = 'l2update',
  /** is of the type snapshot or update, and contains an array of market trades. Each market trade belongs to a side, which can be of type BUY, or SELL */
  MARKET_TRADES = 'market_trades',
  /** The status channel will send all products and currencies on a preset interval. */
  STATUS = 'status',
  /** Once a subscribe or unsubscribe message is received, the server will respond with a subscriptions message that lists all channels you are subscribed to. */
  SUBSCRIPTIONS = 'subscriptions',
  /** The ticker channel provides real-time price updates every time a match happens. */
  TICKER = 'ticker',
}

export type WebSocketResponse = WebSocketMessage & {type: WebSocketResponseType};

// Not exported because it will become "WebSocketResponse" once complete
type WebSocketMessage =
  | Record<string, string | number | boolean>
  | WebSocketStatusMessage
  | WebSocketTickerMessage
  | WebSocketErrorMessage
  | WebsocketMarketTradesMessage;

export interface WebSocketErrorMessage {
  message: string;
  reason: string;
  type: WebSocketResponseType.ERROR;
}

export interface WebSocketStatusMessage {
  products: {
    base_currency: string;
    base_increment: string;
    base_max_size: string;
    base_min_size: string;
    display_name: string;
    id: string;
    max_market_funds: string;
    min_market_funds: string;
    quote_currency: string;
    quote_increment: string;
    status: string;
    status_message: string;
  }[];
  type: WebSocketResponseType.STATUS;
}

export interface WebSocketTickerMessage {
  high_24h: string;
  low_24h: string;
  price: string;
  product_id: string;
  sequence: number;
  type: WebSocketResponseType.TICKER;
  volume_24h: string;
}

export interface WebsocketMarketTrade {
  price: string;
  product_id: string;
  side: OrderSide;
  size: string;
  trade_id: string;
}

export enum WebSocketL2OrderSide {
  BID = 'bid',
  OFFER = 'offer',
}

export interface WebSocketL2UpdateInfo {
  event_time: ISO_8601_MS_UTC;
  new_quantity: string;
  price_level: string;
  side: WebSocketL2OrderSide;
}

export interface WebSocketL2Message {
  product_id: string;
  type: WebSocketResponseType.LEVEL2_UPDATE;
  updates: WebSocketL2UpdateInfo[];
}

export interface WebSocketSubscription {
  channels: WebSocketChannel[];
  type: WebSocketResponseType.SUBSCRIPTIONS;
}

export interface WebsocketMarketTradesMessage {
  trades: WebsocketMarketTrade[];
  type: WebSocketResponseType.MARKET_TRADES;
}

export enum WebSocketEvent {
  ON_CLOSE = 'WebSocketEvent.ON_CLOSE',
  ON_ERROR = 'WebSocketEvent.ON_ERROR',
  ON_MESSAGE = 'WebSocketEvent.ON_MESSAGE',
  ON_MESSAGE_ERROR = 'WebSocketEvent.ON_MESSAGE_ERROR',
  ON_MESSAGE_L2SNAPSHOT = 'WebSocketEvent.ON_MESSAGE_L2SNAPSHOT',
  ON_MESSAGE_L2UPDATE = 'WebSocketEvent.ON_MESSAGE_L2UPDATE',
  ON_MESSAGE_MARKET_TRADES = 'WebSocketEvent.ON_MESSAGE_MARKET_TRADES',
  ON_MESSAGE_STATUS = 'WebSocketEvent.ON_MESSAGE_STATUS',
  ON_MESSAGE_TICKER = 'WebSocketEvent.ON_MESSAGE_TICKER',
  ON_OPEN = 'WebSocketEvent.ON_OPEN',
  ON_SUBSCRIPTION_UPDATE = 'WebSocketEvent.ON_SUBSCRIPTION_UPDATE',
}

export interface WebSocketClient {
  on(event: WebSocketEvent.ON_CLOSE, listener: (event: CloseEvent) => void): this;

  on(event: WebSocketEvent.ON_ERROR, listener: (event: ErrorEvent) => void): this;

  on(event: WebSocketEvent.ON_MESSAGE, listener: (response: WebSocketResponse) => void): this;

  on(event: WebSocketEvent.ON_MESSAGE_ERROR, listener: (errorMessage: WebSocketErrorMessage) => void): this;

  on(event: WebSocketEvent.ON_MESSAGE_STATUS, listener: (statusMessage: WebSocketStatusMessage) => void): this;

  on(event: WebSocketEvent.ON_MESSAGE_TICKER, listener: (tickerMessage: WebSocketTickerMessage) => void): this;

  on(event: WebSocketEvent.ON_SUBSCRIPTION_UPDATE, listener: (subscriptions: WebSocketSubscription) => void): this;

  on(event: WebSocketEvent.ON_MESSAGE_L2SNAPSHOT, listener: (l2Snapshot: WebSocketL2Message) => void): this;

  on(event: WebSocketEvent.ON_MESSAGE_L2UPDATE, listener: (l2update: WebSocketL2Message) => void): this;

  on(event: WebSocketEvent.ON_MESSAGE_MARKET_TRADES, listener: (marketTrades: WebsocketMarketTrade) => void): this;

  on(event: WebSocketEvent.ON_OPEN, listener: (event: Event) => void): this;
}

// eslint-disable-next-line no-redeclare
export class WebSocketClient extends EventEmitter {
  static CLOSE_EVENT_CODE = {
    GOING_AWAY: 1001,
    NORMAL_CLOSURE: 1000,
    PROTOCOL_ERROR: 1002,
    UNSUPPORTED_DATA: 1003,
  };

  private readonly baseURL: string;
  public socket: ReconnectingWebSocket | undefined;

  private pingInterval?: NodeJS.Timeout;
  private pongTimeout?: NodeJS.Timeout;

  private pingTime: number;
  private readonly pongTime: number;
  private userID: string | undefined;

  constructor(
    baseURL: string,
    private readonly signRequest: (setup: RequestSetup) => Promise<SignedRequest>,
    private readonly restClient: RESTClient
  ) {
    super();
    this.baseURL = baseURL;
    this.pingTime = 10_000;
    this.pongTime = this.pingTime * 1.5;
  }

  /**
   * The websocket feed is publicly available, but connections to it are rate-limited to 1 per 4 seconds per IP.
   *
   * @param reconnectOptions - Reconnect options to be used with the "reconnecting-websocket" package. Note: Options
   *   will be merged with sensible default values.
   * @see https://docs.cloud.coinbase.com/exchange/docs/websocket-overview
   */
  connect(reconnectOptions?: Options): ReconnectingWebSocket {
    if (this.socket) {
      throw Error(
        `You established already a WebSocket connection. Please call "disconnect" first before creating a new one.`
      );
    }

    const options = this.mergeOptions(reconnectOptions);
    this.socket = new ReconnectingWebSocket(this.baseURL, [], options);

    this.socket.onclose = (event: CloseEvent): void => {
      this.cleanupListener();
      this.emit(WebSocketEvent.ON_CLOSE, event);
    };

    this.socket.onerror = (event: ErrorEvent): void => {
      this.cleanupListener();
      this.emit(WebSocketEvent.ON_ERROR, event);
    };

    this.socket.onmessage = (event: MessageEvent): void => {
      let response: any = JSON.parse(event.data);

      if (response.events) {
        response = response.events[0];
      }

      if (response.tickers) {
        response.type = WebSocketResponseType.TICKER;
      }

      if (response.type === 'snapshot' && response.products) {
        response.type = WebSocketResponseType.STATUS;
      }

      if (response.subcriptions) {
        response.type = WebSocketResponseType.SUBSCRIPTIONS;
      }

      if (response.type === 'snapshot' && response.trades) {
        response.type = WebSocketResponseType.MARKET_TRADES;
      }

      if (response.product_id && response.updates) {
        response.type = response.type?.includes('update')
          ? WebSocketResponseType.LEVEL2_UPDATE
          : WebSocketResponseType.LEVEL2_SNAPSHOT;
      }

      // Emit generic event
      this.emit(WebSocketEvent.ON_MESSAGE, response);

      // console.log('response type is now ', response.type);

      // console.log('what is response type: ', response.type);
      // Emit specific event
      switch (response.type) {
        case WebSocketResponseType.ERROR:
          this.emit(WebSocketEvent.ON_MESSAGE_ERROR, response);
          break;
        case WebSocketResponseType.STATUS:
          this.emit(WebSocketEvent.ON_MESSAGE_STATUS, response);
          break;
        case WebSocketResponseType.SUBSCRIPTIONS:
          this.emit(WebSocketEvent.ON_SUBSCRIPTION_UPDATE, response);
          break;
        case WebSocketResponseType.TICKER:
          this.emit(WebSocketEvent.ON_MESSAGE_TICKER, response.tickers[0]);
          break;
        case WebSocketResponseType.LEVEL2_SNAPSHOT:
          this.emit(WebSocketEvent.ON_MESSAGE_L2SNAPSHOT, response);
          break;
        case WebSocketResponseType.LEVEL2_UPDATE:
          this.emit(WebSocketEvent.ON_MESSAGE_L2UPDATE, response);
          break;
        case WebSocketResponseType.MARKET_TRADES:
          this.emit(WebSocketEvent.ON_MESSAGE_MARKET_TRADES, response);
          break;
      }
    };

    this.socket.onopen = (): void => {
      this.emit(WebSocketEvent.ON_OPEN);
      /**
       * The 'ws' package for Node.js exposes a "ping" function, but the WebSocket API in browsers doesn't. Since
       * "coinbase-advanced-node" can run in both environments (Node.js & web browsers), we have to check for the existence
       * of "ping".
       *
       * Unfortunately, the "real" WebSocket connection isn't exposed from the "reconnecting-websocket" package:
       * https://github.com/pladaria/reconnecting-websocket/pull/148
       */
      const realWebSocket = this.socket?.['_ws'];
      const hasPingSupport = realWebSocket && typeof realWebSocket.ping === 'function';
      this.setupHeartbeat(hasPingSupport, realWebSocket);
    };

    return this.socket;
  }

  disconnect(reason: string = 'Unknown reason'): void {
    if (this.socket) {
      this.socket.close(WebSocketClient.CLOSE_EVENT_CODE.NORMAL_CLOSURE, reason);
      this.socket = undefined;
    }
  }

  /**
   * A simple function to determine if the websocket appears to be open.
   *
   * @returns True if the websocket has been opened and has not closed.
   */
  get connected(): boolean {
    return undefined !== this.socket;
  }

  async sendMessage(message: WebSocketRequest): Promise<void> {
    /**
     * You gotta auth for user
     * @see https://docs.cloud.coinbase.com/advanced-trade-api/docs/ws-channels
     */
    const signature = await this.signRequest({
      httpMethod: '',
      payload: (message.product_ids || []).join(','),
      requestPath: message.channel,
      ws: true,
    });

    if (message.channel === WebSocketChannelName.USER) {
      if (!this.userID && signature.key) {
        const user = await this.restClient.user.fetchUserInfo().catch(() => {
          return null;
        });
        this.userID = user?.id;
      }
      Object.assign(signature, {user_id: this.userID});
    }

    // TODO: figure out how to do oauth on websockets
    (signature as any).timestamp = signature.timestamp.toString();
    Object.assign(signature, {
      api_key: signature?.key?.toString(), // i really don't like that REST needs int and WS needs string
    });
    delete (signature as any).key;
    Object.assign(message, signature);

    if (!this.socket) {
      throw new Error(`Failed to send message of type "${message.type}": You need to connect to the WebSocket first.`);
    }

    this.socket.send(JSON.stringify(message));
  }

  async subscribe(channel: WebSocketChannel | WebSocketChannel[]): Promise<void> {
    const targets = Array.isArray(channel) ? channel : [channel];
    const proms = targets.map((t: WebSocketChannel) =>
      this.sendMessage({...t, ...{type: WebSocketRequestType.SUBSCRIBE}})
    );
    await Promise.allSettled(proms);
  }

  async unsubscribe(channel: WebSocketChannelName | WebSocketChannel | WebSocketChannel[]): Promise<void> {
    const targets = this.mapChannels(channel);
    const proms = targets.map((t: WebSocketChannel) =>
      this.sendMessage({...t, ...{type: WebSocketRequestType.UNSUBSCRIBE}})
    );
    await Promise.allSettled(proms);
  }

  private cleanupListener(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }

    if (this.pongTimeout) {
      clearTimeout(this.pongTimeout);
    }
  }

  private heartbeat(): void {
    if (this.pongTimeout) {
      clearTimeout(this.pongTimeout);
    }

    /**
     * Enforce reconnect when not receiving any 'pong' from Coinbase Pro in time.
     * @see https://github.com/bennycode/coinbase-advanced-node/issues/374
     */
    this.pongTimeout = setTimeout(this.onPongTimeout.bind(this), this.pongTime);
  }

  private onPongTimeout(): void {
    this.socket?.reconnect();
  }

  /**
   * Setup a heartbeat with ping/pong interval to avoid broken WebSocket connections:
   * @see https://github.com/websockets/ws#how-to-detect-and-close-broken-connections
   */
  private setupHeartbeat(hasPingSupport: boolean, webSocket: WebSocket): void {
    if (hasPingSupport) {
      // Subscribe to pongs
      webSocket.on('pong', this.heartbeat.bind(this));

      // Send pings
      this.pingInterval = setInterval(() => {
        webSocket.ping(() => {});
      }, this.pingTime) as unknown as NodeJS.Timeout;
    }
  }

  private mergeOptions(reconnectOptions?: Options): Options {
    const defaultOptions: Options = {
      WebSocket,
      connectionTimeout: 2000,
      debug: false,
      maxReconnectionDelay: 4000,
      maxRetries: Infinity,
      minReconnectionDelay: 1000,
      reconnectionDelayGrowFactor: 1,
    };

    return {...defaultOptions, ...reconnectOptions};
  }

  private mapChannels(input: WebSocketChannelName | WebSocketChannel | WebSocketChannel[]): WebSocketChannel[] {
    if (Array.isArray(input)) {
      return input;
    } else if (typeof input === 'string') {
      return [
        {
          channel: input,
          product_ids: [],
        },
      ];
    }
    return [input];
  }
}
