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
exports.SharedRequestService = exports.formatPaginationIntoParams = void 0;
const formatPaginationIntoParams = (pagination, siwc = false, params = {}) => {
    if (pagination.after) {
        const d = siwc ? { starting_after: pagination.after } : { cursor: pagination.after };
        Object.assign(params, d);
    }
    if (pagination.before) {
        const d = siwc ? { ending_before: pagination.before } : { cursor: pagination.before };
        Object.assign(params, d);
    }
    if (pagination.limit) {
        Object.assign(params, { limit: pagination.limit });
    }
    else {
        Object.assign(params, { limit: 250 });
    }
    return params;
};
exports.formatPaginationIntoParams = formatPaginationIntoParams;
class SharedRequestService {
    constructor(apiClient, operation) {
        this.apiClient = apiClient;
        this.operation = operation;
    }
    queryAll(account, pagination, customPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = customPath || `/accounts/${account}/${this.operation}`;
            let params = {};
            if (pagination) {
                params = (0, exports.formatPaginationIntoParams)(params, true);
            }
            const response = yield this.apiClient.get(resource, {
                params,
            });
            return {
                data: response.data.data,
                pagination: {
                    after: response.data.pagination.starting_after || '0',
                    before: response.data.pagination.ending_before || '0',
                    has_next: response.data.has_next || false,
                },
            };
        });
    }
    getById(accountId, transactionID) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = `/accounts/${accountId}/${this.operation}/${transactionID}`;
            const response = yield this.apiClient.get(resource);
            return response.data.data;
        });
    }
    createNew(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = `/accounts/${data.accountId}/${this.operation}`;
            const response = yield this.apiClient.post(resource, data);
            return response.data.data;
        });
    }
    commitPending(accountId, transactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = `/accounts/${accountId}/${this.operation}/${transactionId}/commit`;
            const response = yield this.apiClient.post(resource, null);
            return response.data.data;
        });
    }
}
exports.SharedRequestService = SharedRequestService;
SharedRequestService.BASE_URL = '/accounts';
//# sourceMappingURL=shared-request.js.map