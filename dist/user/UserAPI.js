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
exports.UserAPI = void 0;
class UserAPI {
    constructor(apiClient) {
        this.apiClient = apiClient;
    }
    /**
     * Get current user's public information. To get user's email or private information, use permissions wallet:user:email and wallet:user:read.
     *  If current request has a wallet:transactions:send scope, then the response will contain a boolean sends_disabled field that indicates if the user's send functionality has been disabled.
     *
     * @param id - if no id is provided we are fetching user associated to current auth creds
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-users#show-current-user
     */
    fetchUserInfo(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let resource = `${UserAPI.URL.USERS}`;
            if (id) {
                resource += `/${id}`;
            }
            const response = yield this.apiClient.get(resource);
            return response.data.data;
        });
    }
    /**
     * Get current user's authorization information including granted scopes and send limits when using OAuth2 authentication.
     *
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-users#show-authorization-information
     */
    fetchAuthorizationInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = `${UserAPI.URL.USERS}/auth`;
            const response = yield this.apiClient.get(resource);
            return response.data.data;
        });
    }
}
exports.UserAPI = UserAPI;
UserAPI.URL = {
    USERS: `/user`,
};
//# sourceMappingURL=UserAPI.js.map