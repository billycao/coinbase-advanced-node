import { ClientConnection, Coinbase } from '../../Coinbase';
declare global {
    var client: Coinbase;
    var REST_URL: string;
    var SIWC_REST_URL: string;
    var clientConnection: ClientConnection;
}
