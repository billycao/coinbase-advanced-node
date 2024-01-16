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
const channel = {
    channel: __1.WebSocketChannelName.USER,
    product_ids: ['BTC-USD'],
};
client.ws.on(__1.WebSocketEvent.ON_MESSAGE, message => {
    var _a;
    console.info(`Received message of type "${message.type}".`);
    (_a = message.events) === null || _a === void 0 ? void 0 : _a.forEach((e) => {
        console.info(`${message.type} payload`, e);
    });
});
client.ws.on(__1.WebSocketEvent.ON_SUBSCRIPTION_UPDATE, (subUpdate) => __awaiter(void 0, void 0, void 0, function* () {
    // 8. Receive message from WebSocket channel
    console.info(`Received message of type "${subUpdate.type}" with ${subUpdate.channels} channels`, subUpdate.events[0].subscriptions);
}));
client.ws.on(__1.WebSocketEvent.ON_MESSAGE_ERROR, errorMessage => {
    throw new Error(`${errorMessage.message}: ${errorMessage.reason}`);
});
client.ws.on(__1.WebSocketEvent.ON_OPEN, () => __awaiter(void 0, void 0, void 0, function* () {
    yield client.ws.subscribe(channel);
}));
client.ws.connect();
//# sourceMappingURL=websocket-user.js.map