"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const init_client_1 = require("./init-client");
const __1 = require("..");
// 1. Setup Coinbase Pro client
const client = (0, init_client_1.initClient)();
// 2. Setup WebSocket channel info
const channel = {
    channel: __1.WebSocketChannelName.TICKER,
    product_ids: ['BTC-USD'],
};
// 3. Wait for open WebSocket to send messages
client.ws.on(__1.WebSocketEvent.ON_OPEN, () => __awaiter(void 0, void 0, void 0, function* () {
    // 7. Subscribe to WebSocket channel
    yield client.ws.subscribe([channel]);
}));
// 4. Listen to WebSocket subscription updates
client.ws.on(__1.WebSocketEvent.ON_SUBSCRIPTION_UPDATE, subscriptions => {
    // When there are no more subscriptions...
    const obj = subscriptions.events ? subscriptions.events[0].subscriptions : {};
    if (Object.keys(obj).length === 0) {
        client.ws.disconnect();
    }
});
// 5. Listen to WebSocket channel updates
client.ws.on(__1.WebSocketEvent.ON_MESSAGE_TICKER, (tickerMessage) => __awaiter(void 0, void 0, void 0, function* () {
    // 8. Receive message from WebSocket channel
    console.info(`Received message of type "${tickerMessage.type}" with ${tickerMessage.events.length} events`);
    tickerMessage.events.forEach((e) => {
        console.info('Tickers payload: ', e.tickers);
    });
    // 9. Unsubscribe from WebSocket channel
    yield client.ws.unsubscribe([
        {
            channel: __1.WebSocketChannelName.TICKER,
            product_ids: [tickerMessage.events[0].tickers[0].product_id],
        },
    ]);
}));
client.ws.on(__1.WebSocketEvent.ON_ERROR, (err) => __awaiter(void 0, void 0, void 0, function* () {
    // 8. Receive message from WebSocket channel
    console.info(`Received error of type ".`, err.error);
}));
// 6. Connect to WebSocket
client.ws.connect({ debug: true });
//# sourceMappingURL=websocket-ticker.js.map