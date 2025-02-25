import './marketanalysis.css'
import { Line } from "react-chartjs-2";
import  { useState, useEffect } from "react";
import CommodityPriceSlider from '../commoditypriceslider/CommodityPriceSlider';




export default function MarketAnalysis() {
  const getRandomDateForMonth = (month, year) => {
    const date = new Date(year, month, 1); // First day of the month
    const lastDay = new Date(year, month + 1, 0).getDate(); // Last day of the month
    const randomDay = Math.floor(Math.random() * lastDay) + 1; // Random day in the month
    date.setDate(randomDay);
    return date.toISOString().split("T")[0]; // Return as YYYY-MM-DD
  };
  
  const getPastYearDates = () => {
    const currentDate = new Date();
    const pastYearDates = [];
    const minDate = new Date(currentDate);
    minDate.setDate(minDate.getDate() - 10); // The cutoff date (10 days before today)
    const minDateISO = minDate.toISOString().split("T")[0]; // Convert to ISO format
  
    for (let i = 0; i < 12; i++) {
      const tempDate = new Date(currentDate);
      tempDate.setMonth(tempDate.getMonth() - i); // Go back one month at a time
      const month = tempDate.getMonth();
      const year = tempDate.getFullYear();
  
      // Skip generating dates for 2025
      if (year >= 2025) continue;
  
      const generatedDate = getRandomDateForMonth(month, year);
  
      // Add the date if it's earlier than the cutoff date and not from 2025
      if (generatedDate < minDateISO && !generatedDate.startsWith("2025")) {
        pastYearDates.push(generatedDate);
      }
    }
  
    return pastYearDates.reverse(); // Dates in chronological order
  };
  
  // console.log(getPastYearDates());
  

  const [filters, setFilters] = useState({
    commodity: "Soyabean",
    region: "Maharashtra",
    arrival_date: "12-11-2024",
    date: getPastYearDates(),
    district : "",
  });
  const [data, setData] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commodities, setCommodities] = useState([
    "Wheat", "Rice", "Maize", "Barley", "Pulses", "Sugarcane", "Cotton", "Groundnut", "Mustard", "Soyabean",
    "Potato", "Onion", "Tomato", "Banana", "Mango", "Apple", "Tea", "Coffee", "Jute", "Rubber", "Spices",
    "Turmeric", "Cardamom", "Pepper", "Ginger", "Garlic", "Chilli", "Millets", "Coconut", "Arecanut",
    "Cashew Nut", "Sesame", "Linseed", "Sunflower", "Tobacco", "Paddy", "Coriander", "Clove", "Nutmeg",
    "Cumin", "Fenugreek", "Black Gram", "Green Gram", "Red Gram", "Horse Gram", "Safflower", "Neem Seeds",
    "Silk Cocoon", "Honey", "Milk", "Eggs", "Poultry", "Fish", "Shrimp", "Buffalo Meat", "Goat Meat",
    "Sheep Meat", "Bamboo", "Wood", "Flowers", "Pineapple", "Cabbage", "Cauliflower", "Pumpkin", "Brinjal",
    "Lettuce", "Peas", "Carrot", "Radish", "Beetroot", "Spinach", "Okra", "Bitter Gourd", "Cucumber",
    "Pumpkin", "Green Chilli", "Coriander Leaves", "Fenugreek Leaves","Grapes"
  ]);
  const [regions, setRegions] = useState([
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
    "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
    "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Lakshadweep", "Puducherry", "Andaman and Nicobar Islands"
  ]);
  const [districts, setDistricts] = useState([
    "Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Nellore",
    "Prakasam", "Srikakulam", "Visakhapatnam", "West Godavari", "YSR Kadapa", 
    "Anjaw", "Changlang", "Dibang Valley", "East Kameng", "East Siang", "Kurung Kumey", 
    "Lohit", "Longding", "Namsai", "Tawang", "Tirap", "West Kameng", "West Siang", 
    "Baksa", "Barpeta", "Bongaigaon", "Cachar", "Charaideo", "Darrang", "Dibrugarh", 
    "Diphu", "Goalpara", "Golaghat", "Hailakandi", "Jorhat", "Kamrup", "Karbi Anglong", 
    "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", 
    "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tinsukia", "Udalguri", "West Karbi Anglong", 
    "Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", 
    "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar", 
    "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", 
    "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", 
    "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran", "Balod", "Baloda Bazar", 
    "Balrampur", "Bastar", "Bilaspur", "Dhamtari", "Durg", "Gariaband", "Janjgir-Champa", "Jashpur", 
    "Korba", "Koria", "Mahasamund", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", 
    "Surajpur", "Surguja", "North Goa", "South Goa", "Ahmedabad", "Amreli", "Anand", "Aravalli", 
    "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udepur", "Dahod", "Dang", "Gandhinagar", 
    "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", "Morbi", "Narmada", 
    "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", 
    "Tapi", "Vadodara", "Valsad", "Alappuzha", "Ernakulam", "Idukki", "Kottayam", "Kozhikode", "Malappuram", 
    "Palakkad", "Pathanamthitta", "Thrissur", "Wayanad", "Bhopal", "Indore", "Ujjain", "Gwalior", "Jabalpur", 
    "Sagar", "Satna", "Rewa", "Khandwa", "Ratlam", "Shahdol", "Shivpuri", "Sehore", "Vidisha", "Mandla", 
    "Seoni", "Hoshangabad", "Chhindwara", "Dewas", "Damoh", "Balaghat", "Betul", "Mandsaur", "Tikamgarh", 
    "Neemuch", "Shahdol", "Panna", "Alirajpur", "Barwani", "Bhind", "Bhopal", "Chhattisgarh", "Indore", 
    "Jabalpur", "Dewas", 
    // Maharashtra Districts
    "Ahmednagar", "Akola", "Amarawati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", 
    "Dhule", "Gadchiroli", "Gandhinagar", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", 
    "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nasik", "Osmanabad", "Parbhani", "Pune", "Raigad", 
    "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Vashim", "Yavatmal"
]);

  

  const [chartData, setChartData] = useState(null);
  const [chartLoading, setChartLoading] = useState(true);

  useEffect(() => {
    fetchMarketData();
    fetchMarketNews();
    fetchPriceData();
  }, [filters]);

  const fetchMarketData = async () => {
    try {
      // Fetch data for the selected arrival_date only
      if(filters.district===""){
        const response = await fetch(
          `https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24?api-key=579b464db66ec23bdd0000017d0a1836aae8413f684719456ea46cdd&format=json&filters%5BState.keyword%5D=${filters.region}&filters%5BCommodity.keyword%5D=${filters.commodity}&filters%5BArrival_Date%5D=${filters.arrival_date}`
        );
  
        if (!response.ok) throw new Error(`Failed to fetch market data: ${response.statusText}`);
        const result = await response.json();
        setData(result.records || []);
        setLoading(false);
      }else{
        const response = await fetch(
          `https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24?api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b&format=json&filters%5BState.keyword%5D=${filters.region}&filters%5BDistrict.keyword%5D=${filters.district}&filters%5BCommodity.keyword%5D=${filters.commodity}&filters%5BArrival_Date%5D=${filters.arrival_date}`
        );
  
        if (!response.ok) throw new Error(`Failed to fetch market data: ${response.statusText}`);
        const result = await response.json();
        setData(result.records || []);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching market data:", error);
      setLoading(false);
    }
  }
  const fetchMarketNews = async () => {
    try {
      const currentDate = new Date();
      let adjustedMonth = currentDate.getMonth() - 1;
      let adjustedYear = currentDate.getFullYear();
      if (adjustedMonth < 0) {
        adjustedMonth = 11; // December
        adjustedYear -= 1;
      }
      const adjustedDate = new Date(adjustedYear, adjustedMonth, currentDate.getDate() + 1);
      const formattedDate = adjustedDate.toISOString().split("T")[0];
      // console.log(formattedDate);


      //Api = 57071cbb61b94e9c9f7308f4f8a13c35
      const url = `https://newsapi.org/v2/everything?q=market&from=${formattedDate}&sortBy=publishedAt&apiKey=c35&pageSize=5`;
      const response = await fetch(url);
      const parsedData = await response.json();
      setNews(parsedData.articles || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching market news:", error);
      setLoading(false);
    }
  };
  const fetchPriceData = async () => {
    try {
      // Iterate over all dates in filters.arrival_date and fetch data
      if(filters.district===""){
        const requests = filters.date.map((date) =>
          fetch(
            `https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24?api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b&format=json&filters%5BState.keyword%5D=Maharashtra&filters%5BCommodity.keyword%5D=${filters.commodity}&filters%5BArrival_Date%5D=${date}`
          )
        );
  
        // Wait for all the fetch requests to complete
        const responses = await Promise.all(requests);
        const results = await Promise.all(responses.map((res) => res.json()));
  
        // Combine all the fetched data
        const allData = results.flatMap((result) => result.records || []);
        setChartLoading(false);
        const preparedData = prepareChartData(allData);
        setChartData(preparedData);
      }else{
        
          const requests = filters.date.map((date) =>
            fetch(
              `https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24?api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b&format=json&filters%5BState.keyword%5D=Maharashtra&filters%5BDistrict.keyword%5D=${filters.district}&filters%5BCommodity.keyword%5D=${filters.commodity}&filters%5BArrival_Date%5D=${date}`
            )
          );
    
          // Wait for all the fetch requests to complete
          const responses = await Promise.all(requests);
          const results = await Promise.all(responses.map((res) => res.json()));
    
          // Combine all the fetched data
          const allData = results.flatMap((result) => result.records || []);
          setChartLoading(false);
          const preparedData = prepareChartData(allData);
          setChartData(preparedData);
      
    } }catch (error) {
      console.error("Error fetching price data:", error);
      setChartLoading(false);
    }
  };

  const prepareChartData = (commodityData) => {
    const validData = commodityData.filter((item) => item.Modal_Price && item.Arrival_Date);

    // Extract unique dates and markets
    const dates = [...new Set(validData.map((item) => item.Arrival_Date))].sort();
    const markets = [...new Set(validData.map((item) => item.Market))];

    // Prepare datasets for each market
    const datasets = markets.map((market) => {
      const marketDataForDates = dates.map((date) => {
        // Filter data for the given market and date
        const dataForDate = validData.filter((item) => item.Market === market && item.Arrival_Date === date);
        if (dataForDate.length > 0) {
          const prices = dataForDate.map((item) => parseFloat(item.Modal_Price) || 0);
          return {
            minPrice: Math.min(...prices),
            maxPrice: Math.max(...prices),
          };
        } else {
          return {
            minPrice: null,
            maxPrice: null,
          };
        }
      });

      return {
        label: market,
        data: marketDataForDates,
        borderColor: getRandomColor(), // To differentiate markets with different colors
        fill: false,
        borderWidth: 2,
        pointRadius: 4,
      };
    });

    // Combine the min and max prices into separate datasets for the chart
    const maxPriceData = datasets.map((dataset) => {
      return {
        label: `${dataset.label} Max Price`,
        data: dataset.data.map((item) => item.maxPrice),
        borderColor: dataset.borderColor,
        fill: false,
        borderWidth: 2,
        pointRadius: 4,
      };
    });

    const minPriceData = datasets.map((dataset) => {
      return {
        label: `${dataset.label} Min Price`,
        data: dataset.data.map((item) => item.minPrice),
        borderColor: dataset.borderColor,
        fill: false,
        borderWidth: 2,
        pointRadius: 4,
      };
    });

    return {
      labels: dates,
      datasets: [...maxPriceData, ...minPriceData],
    };
  };

  // Helper function to generate random colors for different markets
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  return (
    <divc className="market">
         
         <CommodityPriceSlider />
    <div className="market-analysis-wrapper">
   
      <section className="market-analysis-filters">
        <h2>Filter Options</h2>
        <form>
          <label htmlFor="commodity">Commodity:</label>
          <select id="commodity" name="commodity" onChange={handleChange}>
            <option value="">Soyabean</option>
            {commodities.map((commodity, index) => (
              <option key={index} value={commodity}>{commodity}</option>
            ))}
          </select>

          <label htmlFor="region">Region:</label>

          <select id="region" name="region" onChange={handleChange}>
            <option value="">Maharashtra</option>
            {regions.map((region, index) => (
              <option key={index} value={region}>{region}</option>
            ))}
          </select>
          <label htmlFor="District">District:</label>
          <select id="district" name="district" onChange={handleChange}>
            <option value="">Pune</option>
            {districts.map((district, index) => (
              <option key={index} value={district}>{district}</option>
            ))}
          </select>
          <label htmlFor="arrival_date">Arrival Date:</label>
          <input
            type="date"
            id="arrival_date"
            name="arrival_date"
            value={filters.arrival_date}
            onChange={handleChange}

          />

        </form>
      </section>
      <section className="market-analysis-prices">
        <h2>Market Prices</h2>
        {loading ? (
          <p>Loading data...</p>
        ) : data.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Commodity</th>
                <th>Market</th>
                <th>District</th>
                <th>State</th>
                <th>Arrival Date</th> {/* Added column for Arrival Date */}
                <th>Modal Price (₹)</th>
                <th>Min Price (₹)</th>
                <th>Max Price (₹)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.Commodity}</td>
                  <td>{item.Market}</td>
                  <td>{item.District}</td>
                  <td>{item.State}</td>
                  <td>{item.Arrival_Date}</td> {/* Added Arrival Date in the row */}
                  <td>{item.Modal_Price}</td>
                  <td>{item.Min_Price || "N/A"}</td>
                  <td>{item.Max_Price || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No data available.</p>
        )}
      </section>


      <section className="market-analysis-chart">
        <h2>Price Trend Chart</h2>
        {chartLoading ? (
          <p>Loading chart data...</p>
        ) : chartData ? (
          <Line data={chartData} />
        ) : (
          <p>No data available for chart.</p>
        )}
      </section>

      <section className="market-analysis-news">
        <h2>Latest Market News</h2>
        {news.length > 0 ? (
          <ul>
            {news.map((article, index) => (
              <li key={index}>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {article.title}
                </a>
                <p>{article.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No news available.</p>
        )}
      </section>

    </div>
    </divc>
  );
}
