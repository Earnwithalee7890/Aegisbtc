import { useState, useEffect } from 'react';

export default function PriceFeed() {
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=blockstack&vs_currencies=usd');
        const data = await response.json();
        setPrice(data.blockstack.usd);
      } catch (error) {
        console.error("Failed to fetch STX price");
      }
    };
    fetchPrice();
    const interval = setInterval(fetchPrice, 60000); // 1 minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="stx-price flex items-center gap-2">
      <span className="font-bold text-orange-500">STX:</span>
      <span>{price ? `$${price.toFixed(3)}` : 'Loading...'}</span>
    </div>
  );
}
