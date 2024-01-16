"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionType = exports.TransactionNetworkType = exports.TransactionStatus = exports.OrderSide = void 0;
var OrderSide;
(function (OrderSide) {
    OrderSide["BUY"] = "BUY";
    OrderSide["SELL"] = "SELL";
    OrderSide["UNKNOWN_ORDER_SIDE"] = "UNKNOWN_ORDER_SIDE";
})(OrderSide = exports.OrderSide || (exports.OrderSide = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["CANCELED"] = "canceled";
    TransactionStatus["COMPLETED"] = "completed";
    TransactionStatus["EXPIRED"] = "expired";
    TransactionStatus["FAILED"] = "failed";
    TransactionStatus["PENDING"] = "pending";
    TransactionStatus["WAITING_FOR_CLEARING"] = "waiting_for_clearing";
    TransactionStatus["WAITING_FOR_SIGNATURE"] = "waiting_for_signature";
})(TransactionStatus = exports.TransactionStatus || (exports.TransactionStatus = {}));
var TransactionNetworkType;
(function (TransactionNetworkType) {
    TransactionNetworkType["CONFIRMED"] = "confirmed";
    TransactionNetworkType["OFF_BLOCKCHAIN"] = "off_blockchain";
    TransactionNetworkType["PENDING"] = "pending";
    TransactionNetworkType["UNCONFIRMED"] = "unconfirmed";
})(TransactionNetworkType = exports.TransactionNetworkType || (exports.TransactionNetworkType = {}));
var TransactionType;
(function (TransactionType) {
    /** Fills for an advanced trade order */
    TransactionType["ADVANCED_TRADE_FILL"] = "advanced_trade_fill";
    /** Buy a digital asset */
    TransactionType["BUY"] = "buy";
    /** Deposit money into Coinbase */
    TransactionType["EXCHANGE_DEPOSIT"] = "exchange_deposit";
    /** Withdraw money from Coinbase */
    TransactionType["EXCHANGE_WITHDRAWAL"] = "exchange_withdrawal";
    /** Deposit funds into a fiat account from a financial institution */
    TransactionType["FIAT_DEPOSIT"] = "fiat_deposit";
    /** Withdraw funds from a fiat account */
    TransactionType["FIAT_WITHDRAWAL"] = "fiat_withdrawal";
    /** inflation rewards deposit */
    TransactionType["INFLATION_REWARD"] = "inflation_reward";
    /** transfers to/from coinbase pro */
    TransactionType["PRO_DEPOSIT"] = "pro_deposit";
    TransactionType["PRO_WITHDRAWAL"] = "pro_withdrawal";
    /** Request digital asset from a user or email */
    TransactionType["REQUEST"] = "request";
    /** Sell a digital asset */
    TransactionType["SELL"] = "sell";
    /** Send a supported digital asset to a corresponding address or email */
    TransactionType["SEND"] = "send";
    /** stating reward deposit */
    TransactionType["STAKING_REWARD"] = "staking_reward";
    /** traded one currency for another */
    TransactionType["TRADE"] = "trade";
    /** Transfer funds between two of one user’s accounts */
    TransactionType["TRANSFER"] = "transfer";
    /** Withdraw funds from a vault account */
    TransactionType["VAULT_WITHDRAWAL"] = "vault_withdrawal";
})(TransactionType = exports.TransactionType || (exports.TransactionType = {}));
//# sourceMappingURL=common.js.map