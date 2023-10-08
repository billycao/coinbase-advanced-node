import {initClient} from './init-client';
import {WebSocketChannelName, WebSocketEvent, WebsocketResponseData} from '..';

const client = initClient();

const channel = {
  channel: WebSocketChannelName.USER,
  product_ids: ['BTC-USD'],
};

client.ws.on(WebSocketEvent.ON_MESSAGE, message => {
  console.info(`Received message of type "${message.type}".`);
  (message as WebsocketResponseData).events?.forEach((e: any) => {
    console.info(`${message.type} payload`, e);
  });
});

client.ws.on(WebSocketEvent.ON_SUBSCRIPTION_UPDATE, async subUpdate => {
  // 8. Receive message from WebSocket channel
  console.info(
    `Received message of type "${subUpdate.type}" with ${subUpdate.channels} channels`,
    subUpdate.events[0].subscriptions
  );
});

client.ws.on(WebSocketEvent.ON_MESSAGE_ERROR, errorMessage => {
  throw new Error(`${errorMessage.message}: ${errorMessage.reason}`);
});

client.ws.on(WebSocketEvent.ON_OPEN, async () => {
  await client.ws.subscribe(channel);
});

client.ws.connect();
