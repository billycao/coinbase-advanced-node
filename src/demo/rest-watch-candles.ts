import {initClient} from './init-client';
import {Candle, CandleGranularity, ProductEvent} from '..';

async function main(): Promise<void> {
  // 1. Base configuration
  const productId = 'BTC-USD';
  const granularity = CandleGranularity.ONE_MINUTE;

  // 2. Setup candle subscription
  const client = initClient();

  client.rest.on(ProductEvent.NEW_CANDLE, (productId: string, granularity: CandleGranularity, candle: Candle) => {
    console.info(
      'Latest candle',
      productId,
      granularity,
      candle.openTimeInISO,
      'candle open: ',
      candle.open,
      'candle close: ',
      candle.close
    );
  });

  // 3. Get latest candle
  const base = {
    end: Math.floor(Date.now() / 1000),
    granularity,
    start: Math.floor(Date.now() / 1000 - 60),
  };
  const candles = await client.rest.product.getCandles(productId, base);
  const latestCandle = candles[candles.length - 1];
  const latestOpen = latestCandle.openTimeInISO;
  console.info(
    'Initial candle',
    productId,
    granularity,
    latestOpen,
    'candle open: ',
    latestCandle.open,
    'candle close: ',
    latestCandle.close
  );

  // 4. Subscribe to upcoming candles
  client.rest.product.watchCandles(productId, granularity, latestOpen);
}

main().catch(console.error);
