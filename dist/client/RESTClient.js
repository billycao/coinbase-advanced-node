"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.RESTClient = void 0;
const axios_1 = __importDefault(require("axios"));
const account_1 = require("../account");
const order_1 = require("../order");
const product_1 = require("../product");
const user_1 = require("../user");
const fee_1 = require("../fee");
const fill_1 = require("../fill");
const querystring_1 = __importDefault(require("querystring"));
const axios_retry_1 = __importStar(require("axios-retry"));
const util_1 = __importDefault(require("util"));
const events_1 = require("events");
const ErrorUtil_1 = require("../error/ErrorUtil");
const currency_1 = require("../currency");
const withdraw_1 = require("../withdraw");
const time_1 = require("../time");
const ExchangeRateAPI_1 = require("../exchange-rate/ExchangeRateAPI");
const TransactionAPI_1 = require("../transaction/TransactionAPI");
const deposit_1 = require("../deposit");
const addresses_1 = require("../addresses");
const buy_1 = require("../buy");
const sell_1 = require("../sell");
const convert_1 = require("../convert");
// eslint-disable-next-line no-redeclare
class RESTClient extends events_1.EventEmitter {
    constructor(connectionData, signRequest) {
        super();
        this.signRequest = signRequest;
        this.logger = util_1.default.debuglog('coinbase-advanced-node');
        this.httpClient = axios_1.default.create({
            timeout: 50000,
        });
        (0, axios_retry_1.default)(this.httpClient, {
            retries: Infinity,
            retryCondition: (error) => {
                return (0, axios_retry_1.isNetworkOrIdempotentRequestError)(error) || (0, ErrorUtil_1.inAirPlaneMode)(error) || (0, ErrorUtil_1.gotRateLimited)(error);
            },
            retryDelay: (retryCount, error) => {
                var _a, _b;
                const errorMessage = (0, ErrorUtil_1.getErrorMessage)(error);
                this.logger(`#${retryCount} There was an error querying "${(_a = error === null || error === void 0 ? void 0 : error.config) === null || _a === void 0 ? void 0 : _a.baseURL}${(_b = error === null || error === void 0 ? void 0 : error.config) === null || _b === void 0 ? void 0 : _b.url}": ${errorMessage}`);
                /**
                 * Rate limits:
                 * - 3 requests per second, up to 6 requests per second in bursts for public endpoints
                 * - 5 requests per second, up to 10 requests per second in bursts for private endpoints
                 * @see https://docs.cloud.coinbase.com/exchange/docs/rate-limits
                 */
                return 1000;
            },
            shouldResetTimeout: true,
        });
        this.httpClient.interceptors.request.use((config) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const baseURL = config.baseURL ||
                String((config.url || '').search('v3|brokerage') > -1 ? connectionData.REST_ADV_TRADE : connectionData.REST_SIWC);
            config.baseURL = baseURL;
            const url = String(baseURL + config.url);
            let requestPath = url.replace(url.split(baseURL.includes('v3') ? '/api/v3/' : '/v2')[0], '');
            if ((_a = config.baseURL) === null || _a === void 0 ? void 0 : _a.includes('v3')) {
                requestPath = requestPath.replace(requestPath.split('?')[1], '');
            }
            const signedRequest = yield this.signRequest({
                httpMethod: String(config.method).toUpperCase(),
                payload: RESTClient.stringifyPayload(config, config.baseURL.includes('v3')),
                requestPath,
            });
            if (signedRequest.oauth) {
                config.headers = Object.assign(Object.assign({}, config.headers), { Authorization: `Bearer ${signedRequest.key}`, 'CB-ACCESS-TIMESTAMP': `${signedRequest.timestamp}` });
            }
            else {
                config.headers = Object.assign(Object.assign({}, config.headers), { 'CB-ACCESS-TIMESTAMP': `${signedRequest.timestamp}` });
                if (signedRequest.key !== '') {
                    config.headers['CB-ACCESS-SIGN'] = signedRequest.signature;
                    config.headers['CB-ACCESS-KEY'] = signedRequest.key;
                }
            }
            if (!((_b = config.baseURL) === null || _b === void 0 ? void 0 : _b.includes('v3'))) {
                config.headers['CB-VERSION'] = new Date().toISOString().substring(0, 10);
            }
            return config;
        }));
        this.address = new addresses_1.AddressAPI(this.httpClient);
        this.account = new account_1.AccountAPI(this.httpClient);
        this.buy = new buy_1.BuyAPI(this.httpClient);
        this.deposit = new deposit_1.DepositAPI(this.httpClient);
        this.convert = new convert_1.ConvertAPI(this.httpClient);
        this.currency = new currency_1.CurrencyAPI(this.httpClient);
        this.exchangeRate = new ExchangeRateAPI_1.ExchangeRateAPI();
        this.fee = new fee_1.FeeAPI(this.httpClient);
        this.fill = new fill_1.FillAPI(this.httpClient);
        this.order = new order_1.OrderAPI(this.httpClient);
        this.product = new product_1.ProductAPI(this.httpClient, this);
        this.sell = new sell_1.SellAPI(this.httpClient);
        this.time = new time_1.TimeAPI(connectionData.REST_SIWC);
        this.transaction = new TransactionAPI_1.TransactionAPI(this.httpClient);
        this.user = new user_1.UserAPI(this.httpClient);
        this.withdraw = new withdraw_1.WithdrawAPI(this.httpClient);
    }
    get defaults() {
        return this.httpClient.defaults;
    }
    get interceptors() {
        return this.httpClient.interceptors;
    }
    static stringifyPayload(config, excludeParams) {
        if (config.data) {
            return JSON.stringify(config.data);
        }
        const params = querystring_1.default.stringify(config.params);
        return params && !excludeParams ? `?${params}` : '';
    }
    coinbaseRequest(config) {
        return this.httpClient.request(config);
    }
}
exports.RESTClient = RESTClient;
//# sourceMappingURL=RESTClient.js.map