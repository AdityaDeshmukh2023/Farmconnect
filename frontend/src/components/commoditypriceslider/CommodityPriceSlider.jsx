import './commoditypriceslider.css'
import  { useState, useEffect } from 'react';
import axios from 'axios';
export default function CommodityPriceSlider() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  


 

  useEffect(() => {
   
    axios.get(`https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b&format=json&limit=200&filters%5Bstate.keyword%5D=Maharashtra`)
      .then((response) => {
        if (response.data.records && response.data.records.length > 0) {
          setPrices(response.data.records);
        } else {
          setError('No data available for the selected filters.');
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError('Error fetching data.');
        setLoading(false);
      });
  }, []); 

  return (
    <div className='commoditypriceslider'>
    <div className="commodity-slider-container">
      {loading && <div className="commodity-slider-loading">Loading...</div>}
      {error && <div className="commodity-slider-error">{error}</div>}
      {!loading && !error && prices.length > 0 && (
        <div className="commodity-slider-items">
          {prices.map((price, index) => (
            <div className="commodity-slider-item" key={index}>
              <div className="commodity-slider-item-name">{price.commodity}</div>
              <div className="commodity-slider-item-price" style={{ color: price.max_price > price.min_price ? 'green' : 'red' }}>
                Max Price: ₹{price.max_price}
              </div>
              <div className="commodity-slider-item-price" style={{ color: price.min_price < price.max_price ? 'red' : 'green' }}>
                Min Price: ₹{price.min_price}
              </div>
              <div className="commodity-slider-item-market">{price.market}</div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}
