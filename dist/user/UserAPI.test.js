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
const nock_1 = __importDefault(require("nock"));
const GET_200_json_1 = __importDefault(require("../test/fixtures/rest/users/self/verify/GET-200.json"));
const UserAPI_1 = require("./UserAPI");
describe('UserAPI', () => {
    afterAll(() => nock_1.default.cleanAll());
    beforeAll(() => {
        (0, nock_1.default)(global.SIWC_REST_URL)
            .persist()
            .get(`${UserAPI_1.UserAPI.URL.USERS}/9da7a204-544e-5fd1-9a12-61176c5d4cd8`)
            .query(true)
            .reply(() => {
            return [200, JSON.stringify(GET_200_json_1.default)];
        });
        (0, nock_1.default)(global.SIWC_REST_URL)
            .persist()
            .get(`${UserAPI_1.UserAPI.URL.USERS}/auth`)
            .query(true)
            .reply(() => {
            return [
                200,
                JSON.stringify({
                    data: {
                        method: 'oauth',
                        oauth_meta: {},
                        scopes: ['wallet:user:read', 'wallet:user:email'],
                    },
                }),
            ];
        });
    });
    describe('fetchUserInfo', () => {
        it('verifies the authentication data', () => __awaiter(void 0, void 0, void 0, function* () {
            const verifiedUser = yield global.client.rest.user.fetchUserInfo('9da7a204-544e-5fd1-9a12-61176c5d4cd8');
            expect(verifiedUser.name).toBe('User One');
        }));
    });
    describe('fetchAuthorizationInfo', () => {
        it('verifies the authentication data', () => __awaiter(void 0, void 0, void 0, function* () {
            const verifiedUser = yield global.client.rest.user.fetchAuthorizationInfo();
            expect(verifiedUser.scopes.length).toBeGreaterThan(1);
        }));
    });
});
//# sourceMappingURL=UserAPI.test.js.map