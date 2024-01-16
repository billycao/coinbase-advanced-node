"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initClient = void 0;
const __1 = require("..");
require("dotenv-defaults/config");
function initClient() {
    if (process.env.COINBASE_API_KEY !== '') {
        return new __1.Coinbase({
            apiKey: process.env.COINBASE_API_KEY,
            apiSecret: process.env.COINBASE_API_SECRET,
        });
    }
    console.info('Using Coinbase without API key...');
    return new __1.Coinbase();
}
exports.initClient = initClient;
//# sourceMappingURL=init-client.js.map