import { SLR } from 'ml-regression';
import { format, subDays, addDays, parseISO } from 'date-fns';

// Generate mock GSC data for fallback
export const generateMockData = () => {
  const data = [];
  const startDate = subDays(new Date(), 480); // ~16 months ago
  const endDate = new Date();
  
  let baseClicks = 1200;
  let trend = 0.02; // Small upward trend
  
  for (let date = new Date(startDate); date <= endDate; date = addDays(date, 1)) {
    // Add some seasonality and randomness
    const dayOfYear = date.getDay();
    const seasonality = Math.sin((dayOfYear / 365) * 2 * Math.PI) * 200;
    const randomVariation = (Math.random() - 0.5) * 400;
    const weekendEffect = (dayOfYear === 0 || dayOfYear === 6) ? -150 : 0;
    
    const clicks = Math.max(100, Math.round(
      baseClicks + seasonality + randomVariation + weekendEffect
    ));
    
    data.push({
      date: format(date, 'yyyy-MM-dd'),
      clicks,
      isForecast: false
    });
    
    // Gradually increase base clicks for trend
    baseClicks += trend;
  }
  
  return data;
};

// Calculate forecast using simple linear regression
export const calculateForecast = (historicalData, forecastDays) => {
  if (!historicalData || historicalData.length < 30) {
    return [];
  }
  
  // Prepare data for regression (use last 90 days for better accuracy)
  const recentData = historicalData.slice(-90);
  const x = recentData.map((_, index) => index);
  const y = recentData.map(item => item.clicks);
  
  // Create and train the linear regression model
  const regression = new SLR(x, y);
  
  const forecastData = [];
  const lastDate = parseISO(historicalData[historicalData.length - 1].date);
  
  for (let i = 1; i <= forecastDays; i++) {
    const futureDate = addDays(lastDate, i);
    const predictedClicks = Math.max(100, Math.round(
      regression.predict(recentData.length + i - 1) + 
      (Math.random() - 0.5) * 100 // Add some variation
    ));
    
    forecastData.push({
      date: format(futureDate, 'yyyy-MM-dd'),
      clicks: null, // Don't show on historical line
      forecastClicks: predictedClicks, // Show on forecast line
      isForecast: true
    });
  }
  
  return forecastData;
};