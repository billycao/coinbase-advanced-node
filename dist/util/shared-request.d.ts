import { AxiosInstance } from 'axios';
import { NewSIWCTransaction, PaginatedData, Pagination } from '../payload';
export declare const formatPaginationIntoParams: (pagination: Pagination, siwc?: boolean, params?: {}) => object;
export declare class SharedRequestService {
    private readonly apiClient;
    private readonly operation;
    static readonly BASE_URL = "/accounts";
    constructor(apiClient: AxiosInstance, operation: string);
    queryAll<T>(account: string, pagination?: Pagination, customPath?: string): Promise<PaginatedData<T>>;
    getById<T>(accountId: string, transactionID: string): Promise<T>;
    createNew<T>(data: NewSIWCTransaction): Promise<T>;
    commitPending<T>(accountId: string, transactionId: string): Promise<T>;
}
