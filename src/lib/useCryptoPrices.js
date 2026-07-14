import { useEffect, useState } from "react";

export function useCryptoPrices() {
  const [crypto, setCrypto] = useState([]);

  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=6&page=1&sparkline=false&price_change_percentage=24h")
      .then(r => r.json())
      .then(d => Array.isArray(d) && setCrypto(d))
      .catch(() => {});
  }, []);

  return crypto;
}
