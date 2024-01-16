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
const client = (0, init_client_1.initClient)();
const channels = [
    {
        channel: __1.WebSocketChannelName.LEVEL2,
        product_ids: ['ETH-USD', 'BTC-USD'],
    },
    {
        channel: __1.WebSocketChannelName.TICKER,
        product_ids: ['ETH-USD', 'BTC-USD'],
    },
];
client.ws.on(__1.WebSocketEvent.ON_OPEN, () => __awaiter(void 0, void 0, void 0, function* () {
    yield client.ws.subscribe(channels);
}));
client.ws.on(__1.WebSocketEvent.ON_SUBSCRIPTION_UPDATE, (subscriptions) => __awaiter(void 0, void 0, void 0, function* () {
    const subscriptionCount = subscriptions.channels.length;
    const uniqueProductIds = new Set();
    const productIds = subscriptions.channels.map(subscription => subscription.product_ids);
    productIds.forEach(ids => (ids || []).forEach(id => uniqueProductIds.add(id)));
    console.info(`We have now "${subscriptionCount}" subscriptions for "${uniqueProductIds.size}" different products.`, JSON.stringify(subscriptions, null, 2));
    switch (subscriptionCount) {
        case 0:
            console.info(`No more subscriptions. We will disconnect.`);
            client.ws.disconnect();
            break;
        case 1:
            console.info(`We will unsubscribe from "${__1.WebSocketChannelName.LEVEL2}" channel...`);
            yield client.ws.unsubscribe(__1.WebSocketChannelName.LEVEL2);
            break;
        case 3:
            console.info(`We will unsubscribe from "${__1.WebSocketChannelName.TICKER}" channel...`);
            yield client.ws.unsubscribe(__1.WebSocketChannelName.TICKER);
            break;
    }
}));
client.ws.connect();
//# sourceMappingURL=websocket-unsubscribe-all.js.map