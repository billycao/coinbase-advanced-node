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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeAPI = void 0;
const axios_1 = __importDefault(require("axios"));
class TimeAPI {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }
    /**
     * Get the server time from Coinbase Pro API. It has been reported that sometimes the return value is a string:
     * https://github.com/bennycode/coinbase-pro-node/issues/354
     *
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-time
     */
    getTime() {
        return __awaiter(this, void 0, void 0, function* () {
            const client = axios_1.default.create({
                baseURL: this.baseURL,
                timeout: 50000,
            });
            client.interceptors.request.use(config => {
                config.headers = {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                };
                return config;
            });
            const response = yield client.get(`${this.baseURL}${TimeAPI.URL.TIME}`, {});
            return response.data.data;
        });
    }
    /**
     * Get the absolute difference between server time and local time.
     */
    getClockSkew(time) {
        const now = Math.floor(Date.now() / 1000);
        return (time === null || time === void 0 ? void 0 : time.epoch) - now;
    }
}
exports.TimeAPI = TimeAPI;
TimeAPI.URL = {
    TIME: `/time`,
};
//# sourceMappingURL=TimeAPI.js.map