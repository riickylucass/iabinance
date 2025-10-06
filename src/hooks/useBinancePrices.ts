import { useState, useEffect } from 'react';

export type CryptoPrice = {
  symbol: string;
  price: string;
  priceChange: string;
  priceChangePercent: string;
};

const SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT'];

export function useBinancePrices() {
  const [prices, setPrices] = useState<Record<string, CryptoPrice>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialPrices = async () => {
      try {
        const response = await fetch(
          'https://api.binance.com/api/v3/ticker/24hr'
        );
        const data = await response.json();

        const pricesMap: Record<string, CryptoPrice> = {};
        SYMBOLS.forEach(symbol => {
          const ticker = data.find((t: any) => t.symbol === symbol);
          if (ticker) {
            pricesMap[symbol] = {
              symbol: ticker.symbol,
              price: parseFloat(ticker.lastPrice).toFixed(2),
              priceChange: parseFloat(ticker.priceChange).toFixed(2),
              priceChangePercent: parseFloat(ticker.priceChangePercent).toFixed(2)
            };
          }
        });

        setPrices(pricesMap);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar preços iniciais:', error);
        setLoading(false);
      }
    };

    fetchInitialPrices();

    const streams = SYMBOLS.map(s => `${s.toLowerCase()}@ticker`).join('/');
    const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.data) {
          const ticker = message.data;
          const symbol = ticker.s;

          setPrices(prev => ({
            ...prev,
            [symbol]: {
              symbol: ticker.s,
              price: parseFloat(ticker.c).toFixed(2),
              priceChange: parseFloat(ticker.p).toFixed(2),
              priceChangePercent: parseFloat(ticker.P).toFixed(2)
            }
          }));
        }
      } catch (error) {
        console.error('Erro ao processar mensagem do WebSocket:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('Erro no WebSocket:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  return { prices, loading };
}
