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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
const Coinbase_1 = require("./Coinbase");
exports.default = Coinbase_1.Coinbase;
__exportStar(require("./account"), exports);
__exportStar(require("./addresses"), exports);
__exportStar(require("./client"), exports);
__exportStar(require("./Coinbase"), exports);
__exportStar(require("./currency"), exports);
__exportStar(require("./deposit"), exports);
__exportStar(require("./fee"), exports);
__exportStar(require("./fill"), exports);
__exportStar(require("./order"), exports);
__exportStar(require("./payload"), exports);
__exportStar(require("./product"), exports);
__exportStar(require("./sell"), exports);
__exportStar(require("./time"), exports);
__exportStar(require("./transaction"), exports);
__exportStar(require("./user"), exports);
__exportStar(require("./withdraw"), exports);
//# sourceMappingURL=index.js.map