# Coinbase API

Unofficial Coinbase API for Node.js, written in TypeScript and covered by tests. Covers both the [Advanced Trade API](https://docs.cloud.coinbase.com/advanced-trade-api/docs/welcome) & [Sign In With Coinbase API](https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/welcome)

## Motivation

The purpose of this [coinbase-advanced-node][5] package is to maintain a recent Coinbase API for Node.js with type safety through TypeScript. This project began as a fork of [coinbase-pro-node](https://github.com/bennycode/coinbase-pro-node) in efforts to provide a smooth transition for anyone migrating to the [Advanced Trade API](https://docs.cloud.coinbase.com/advanced-trade-api/docs/welcome) due to the deprecation of the former [Exchange/Pro API](https://docs.cloud.coinbase.com/exchange/docs/welcome).

## Features

- **Typed.** Source code is 100% TypeScript. No need to install external typings.
- **Tested.** Code coverage is 100%. No surprises when using "coinbase-advanced-node".
- **Convenient.** Request throttling is built-in. Don't worry about rate limiting.
- **Comfortable.** More than an API client. You will get extras like [candle watching](https://github.com/joshjancula/coinbase-advanced-node/blob/main/src/demo/rest-watch-candles.ts).
- **Maintained.** Automated security updates. No threats from outdated dependencies.
- **Documented.** Get started with [demo scripts][3] and [generated documentation][4].
- **Modern.** HTTP client with Promise API. Don't lose yourself in callback hell.
- **Robust.** WebSocket reconnection is built-in. No problems if your Wi-Fi is gone.
- **Reliable.** Following [semantic versioning][8]. Get notified about breaking changes.

## Installation

**npm**

```bash
npm install coinbase-advanced-node
```

**Yarn**

```bash
yarn add coinbase-advanced-node
```

## Setup

**JavaScript**

```javascript
const {Coinbase} = require('coinbase-advanced-node');
const client = new Coinbase();
```

**TypeScript**

```typescript
import {Coinbase} from 'coinbase-advanced-node';
const client = new Coinbase();
```

## Usage

The [demo section][3] provides many examples on how to use "coinbase-advanced-node". There is also an automatically generated [API documentation][4]. For a quick start, here is a simple example for a REST request:

Both API key and OAuth2 authentication require that you obtain correct permissions (scopes) to access different API endpoints. Read more about scopes [here](https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/scopes)

For [Advanced Trade](https://docs.cloud.coinbase.com/advanced-trade-api/docs/welcome) orders, use the `order` API. The `buy` & `sell` API's exposed are part of the [Sign In With Coinbase API](https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/welcome) which have different capabilities and fee structures

### REST Example

```typescript
import {Coinbase} from 'coinbase-advanced-node';

// API key and OAuth are supported in both
// the SIWC and Advance Trade API's
// this library supports both methods of authentication

// API Keys can be generated here:
// https://www.coinbase.com/settings/api
const auth = {
  apiKey: 'ohnwkjnefasodh;',
  apiSecret: 'asdlnasdoiujkswdfsdf',
};

// or if you are using OAuth
// https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/sign-in-with-coinbase-integration#registering-oauth2-client
const oauth = {
  apiKey: '', // yes these need to be empty strings if using this pkg with oauth
  apiSecret: '',
  oauthToken: 'ej09joiunasgukddd09ujoh2i4r874nkjnk;lajs;dlfjaljhfds;sdhjfsdf='
}

const client = new Coinbase(auth);

const oauthClient = new Coinbase(oauth);

client.rest.account.listAccounts().then(accounts => {
  const message = `Advance Trade accounts "${accounts.length}".`;
  console.log(message);
});

oauthClient.rest.account.listCoinbaseAccounts().then(accounts => {
  const message = `Coinbase accounts "${accounts.length}".`;
  console.log(message);
});
```

## Two factor authentication

OAuth2 authentication requires two factor authentication when debiting funds with the wallet:transactions:send scope. When 2FA is required, the API will respond with a 402 status and two_factor_required error. To successfully complete the request, you must make the same request again with the user's 2FA token in the CB-2FA-TOKEN header together with the current access token. https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/sign-in-with-coinbase-2fa

```typescript
// Example
const client = new Coinbase(creds);
client.rest.transaction.sendTransaction(accountID, info).catch(err => {
  if (err.status == 402) {
    const token = await promptUserForMFA();
    const configID = client.rest.interceptors.request.use(config => {
      config.headers['CB-2FA-TOKEN'] = token;
      return config;
    });
    return client.rest.transaction.sendTransaction(accountID, info).finally(() => {
      client.rest.interceptors.request.eject(configID);
    });
  }
  throw err;
});
```

### WebSocket Example

If you want to listen to WebSocket messages, have a look at these demo scripts:

- [Subscribe to "ticker" channel (real-time price updates)](https://github.com/joshjancula/coinbase-advanced-node/blob/main/src/demo/websocket-ticker.ts)
- [Subscribe to authenticated "user" channel](https://github.com/joshjancula/coinbase-advanced-node/blob/main/src/demo/websocket-user.ts)

### Demos

All [demo scripts][3] are executable from the root directory. If you want to use specific credentials with a demo script, simply add a `.env` file to the root of this package to [modify environment variables](https://github.com/motdotla/dotenv/tree/v8.2.0#usage) used in [init-client.ts](https://github.com/joshjancula/coinbase-advanced-node/blob/main/src/demo/init-client.ts).

```bash
npx ts-node ./src/demo/dump-candles.ts
```

**Tip:** There is a [.env.defaults](https://github.com/joshjancula/coinbase-advanced-node/blob/main/.env.defaults) file which serves as a template. Just remove its `.defaults` extension and enter your credentials to get started. Do not commit this file (or your credentials) to any repository!

### Web Frontend Applications

The "coinbase-advanced-node" library was built to be used in Node.js environments BUT you can also make use of it in web frontend applications (using React, Vue.js, etc.). However, due to the [CORS restrictions](https://developer.mozilla.org/docs/Web/HTTP/CORS) of modern web browser, you will have to use a proxy server.

A proxy server can be setup with webpack's [DevServer proxy configuration](https://webpack.js.org/configuration/dev-server/#devserverproxy) or [http-proxy-middleware](https://www.npmjs.com/package/http-proxy-middleware).

Here is an example:

**Backend**

```typescript
import {createProxyMiddleware} from 'http-proxy-middleware';
import express from 'express';

const app = express();

app.use(
  '/api-coinbase-siwc',
  createProxyMiddleware({
    target: 'ttps://api.coinbase.com/v2',
    changeOrigin: true,
    pathRewrite: {
      [`^/api-coinbase-siwc`]: '',
    },
  })
);
app.use(
  '/api-coinbase-adv',
  createProxyMiddleware({
    target: 'ttps://api.coinbase.com/v3',
    changeOrigin: true,
    pathRewrite: {
      [`^/api-coinbase-adv`]: '',
    },
  })
);
```

Later on, you can use the proxy URLs (`/api-coinbase-adv` from above) in your web application to initialize "coinbase-advanced-node" with it:

**Frontend**

```typescript
const client = new Coinbase({
  httpUrl: '/api-coinbase-siwc',
  apiKey: '',
  apiSecret: '',
});
```

## Contributing

Contributions, issues and feature requests are welcome!

Feel free to check the [issues page](https://github.com/joshjancula/coinbase-advanced-node/issues).

The following commits will help you getting started quickly with the code base:

- [Add REST API endpoint](https://github.com/bennycode/coinbase-advanced-node/commit/9920c2f4343985c349b68e2a47d7fe2c42e23e34)
- [Add REST API endpoint (with fixtures)](https://github.com/bennycode/coinbase-advanced-node/commit/8a150fecb7d32b7b7cd39a8109985f665aaee26e)

All resources can be found in the [Coinbase Advance Trade API reference][2]. For the latest updates, check [Coinbase's API Changelog][9].

## License

This project is [MIT](./LICENSE) licensed.

## ⭐️ Show your support ⭐️

[Please leave a star](https://github.com/joshjancula/coinbase-advanced-node/stargazers) if you find this project useful.

---

## Problems with official Coinbase APIs

There are official Coinbase APIs for Node.js, but they all come with some disadvantages leading to decreased developer experience (DX):

1. [Coinbase's first Node.js API](https://github.com/coinbase/coinbase-exchange-node) has no type safety and got deprecated on [July, 19th 2016](https://github.com/coinbase/coinbase-exchange-node/commit/b8347efdb4e2589367c1395b646d283c9c391681)
2. [Coinbase's second Node.js API](https://github.com/coinbase/coinbase-advanced-node) has no type safety and got deprecated on [January, 16 2020](https://github.com/coinbase/coinbase-advanced-node/issues/393#issuecomment-574993096)
3. [Coinbase's current Node.js API](https://docs.cloud.coinbase.com/exchange/reference) ([OAS spec](https://dash.readme.com/api/v1/api-registry/qgumw1pl3iz4yut)) still lacks type safety and does not incorporate best practices like automatic reconnections and request throttling

## Official Coinbase API

Coinbase is versioning its API through [ReadMe.com](https://readme.com/), so you can generate an API client from their [OpenAPI Specification](https://dash.readme.com/api/v1/api-registry/qgumw1pl3iz4yut). ReadMe provides a Node.js package named "[api](https://www.npmjs.com/package/api)" which allows you to retrieve an automatically generated Node.js client:

### Installation

```bash
npm install api@^4.5.1
```

### Usage

```ts
import api from 'api';

const sdk = api('@coinbase-exchange/v1.0#qgumw1pl3iz4yut');

sdk['ExchangeRESTAPI_GetProductTrades']({
  product_id: 'BTC-USD',
}).then(response => {
  console.log(`Found "${response.length}" trades.`);
});
```

### Drawbacks

The current Coinbase Node.js SDK (provided by the [api package](https://www.npmjs.com/package/api)) does not support typings for response payloads:

![Official Coinbase API](./coinbase-api-screenshot.png 'Type safety problems in official Coinbase API')

[1]: https://docs.cloud.coinbase.com/advanced-trade-api/docs/welcome
[2]: https://docs.cloud.coinbase.com/advanced-trade-api/docs/welcome
[3]: https://github.com/joshjancula/coinbase-advanced-node/tree/main/src/demo
[5]: https://www.npmjs.com/package/coinbase-advanced-node
[8]: https://docs.npmjs.com/about-semantic-versioning
[9]: https://docs.cloud.coinbase.com/advanced-trade-api/docs/changelog
