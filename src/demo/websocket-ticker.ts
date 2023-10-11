import {initClient} from './init-client';
import {WebSocketChannelName, WebSocketEvent, WebSocketTickerMessageEvent} from '..';

// 1. Setup Coinbase Pro client
const client = initClient();

// 2. Setup WebSocket channel info
const channel = {
  channel: WebSocketChannelName.TICKER,
  product_ids: ['BTC-USD'],
};

// 3. Wait for open WebSocket to send messages
client.ws.on(WebSocketEvent.ON_OPEN, async () => {
  // 7. Subscribe to WebSocket channel
  await client.ws.subscribe([channel]);
});

// 4. Listen to WebSocket subscription updates
client.ws.on(WebSocketEvent.ON_SUBSCRIPTION_UPDATE, subscriptions => {
  // When there are no more subscriptions...
  const obj = subscriptions.events ? subscriptions.events[0].subscriptions : {};
  if (Object.keys(obj).length === 0) {
    client.ws.disconnect();
  }
});

// 5. Listen to WebSocket channel updates
client.ws.on(WebSocketEvent.ON_MESSAGE_TICKER, async tickerMessage => {
  // 8. Receive message from WebSocket channel
  console.info(`Received message of type "${tickerMessage.type}" with ${tickerMessage.events.length} events`);
  tickerMessage.events.forEach((e: WebSocketTickerMessageEvent) => {
    console.info('Tickers payload: ', e.tickers);
  });
  // 9. Unsubscribe from WebSocket channel
  await client.ws.unsubscribe([
    {
      channel: WebSocketChannelName.TICKER,
      product_ids: [tickerMessage.events[0].tickers[0].product_id],
    },
  ]);
});

client.ws.on(WebSocketEvent.ON_ERROR, async err => {
  // 8. Receive message from WebSocket channel
  console.info(`Received error of type ".`, err.error);
});

// 6. Connect to WebSocket
client.ws.connect({debug: true});
