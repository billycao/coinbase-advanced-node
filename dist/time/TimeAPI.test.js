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
const TimeAPI_1 = require("./TimeAPI");
const nock_1 = __importDefault(require("nock"));
describe('TimeAPI', () => {
    describe('getTime', () => {
        afterEach(() => nock_1.default.cleanAll());
        beforeEach(() => {
            nock_1.default.cleanAll();
            (0, nock_1.default)(global.SIWC_REST_URL)
                .persist()
                .get(TimeAPI_1.TimeAPI.URL.TIME)
                .query(true)
                .reply(() => {
                const date = new Date('2015-01-07T23:47:25.201Z');
                return [
                    200,
                    JSON.stringify({
                        data: {
                            epoch: date.getTime() / 1000,
                            iso: date.toISOString(),
                        },
                    }),
                ];
            });
        });
        it('returns decimal seconds since Unix Epoch', () => __awaiter(void 0, void 0, void 0, function* () {
            const time = yield new TimeAPI_1.TimeAPI(global.SIWC_REST_URL).getTime();
            const expected = {
                epoch: 1420674445.201,
                iso: '2015-01-07T23:47:25.201Z',
            };
            expect(time).toEqual(expected);
        }));
    });
});
//# sourceMappingURL=TimeAPI.test.js.map