
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Download, BarChart3, Activity, Target, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import TrafficChart from '@/components/TrafficChart';
import MetricCard from '@/components/MetricCard';
import ForecastToggle from '@/components/ForecastToggle';
import { generateMockData, calculateForecast } from '@/lib/gscData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Dashboard = () => {
  const [trafficData, setTrafficData] = useState([]);
  const [forecastDays, setForecastDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [gscSites, setGscSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState('');
  const [metrics, setMetrics] = useState({
    totalClicks: 0,
    avgCTR: 'N/A',
    avgPosition: 'N/A',
    totalImpressions: 'N/A'
  });
  const { toast } = useToast();

  const fullChartData = useMemo(() => {
    if (!trafficData.length) return [];
    const historicalData = trafficData.map(item => ({ ...item, isForecast: false }));
    const forecast = calculateForecast(historicalData, forecastDays);
    return [...historicalData, ...forecast];
  }, [trafficData, forecastDays]);
  
  const fetchSiteData = useCallback(async (siteUrl) => {
    if (!siteUrl) {
      toast({
        title: "No Property Selected",
        description: "Please select a GSC property first.",
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`https://gsc-auth-backend.onrender.com/api/gsc-data?site=${encodeURIComponent(siteUrl)}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const liveData = await response.json();
        const data = liveData.data || [];
        setTrafficData(data);
        const totalClicks = data.reduce((sum, item) => sum + item.clicks, 0);
        setMetrics({
          totalClicks: totalClicks,
          avgCTR: 'N/A', 
          avgPosition: 'N/A',
          totalImpressions: liveData.impressions || 'N/A',
        });
        toast({
          title: "✅ Data Loaded!",
          description: `Displaying GSC data for ${siteUrl}.`,
          className: "bg-green-600 text-white"
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        setTrafficData([]);
        setMetrics({ totalClicks: 0, avgCTR: 'N/A', avgPosition: 'N/A', totalImpressions: 'N/A' });
        toast({
          title: "Error Loading Site Data",
          description: errorData.message || `Failed to fetch data for ${siteUrl}. Status: ${response.status}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      setTrafficData([]);
      setMetrics({ totalClicks: 0, avgCTR: 'N/A', avgPosition: 'N/A', totalImpressions: 'N/A' });
      toast({
        title: "Connection Error",
        description: "Could not fetch site data from backend.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);
  
  useEffect(() => {
    const checkAuthAndFetchSites = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://gsc-auth-backend.onrender.com/api/gsc-sites', {
          credentials: 'include'
        });
  
        if (response.ok) {
          const { sites, email } = await response.json();
          setIsLoggedIn(true);
          setUserEmail(email);
          setGscSites(sites || []);
          toast({
            title: "Successfully Authenticated!",
            description: `Logged in as ${email}.`,
            className: "bg-blue-600 text-white"
          });
          if (sites && sites.length > 0) {
            const firstSite = sites[0];
            setSelectedSite(firstSite);
            await fetchSiteData(firstSite);
          } else {
             setTrafficData([]);
             setMetrics({ totalClicks: 0, avgCTR: 'N/A', avgPosition: 'N/A', totalImpressions: 'N/A' });
             toast({
               title: "No Verified Sites Found",
               description: "No verified sites found in your GSC account. Please verify your domain in Google Search Console.",
               variant: "destructive"
             });
             setLoading(false);
          }
        } else {
          setIsLoggedIn(false);
          const mock = generateMockData();
          setTrafficData(mock);
          const totalClicks = mock.reduce((sum, item) => sum + item.clicks, 0);
          setMetrics({ totalClicks, avgCTR: 'N/A', avgPosition: 'N/A', totalImpressions: 'N/A' });
          setLoading(false);
        }
      } catch (error) {
        setIsLoggedIn(false);
        const mock = generateMockData();
        setTrafficData(mock);
        const totalClicks = mock.reduce((sum, item) => sum + item.clicks, 0);
        setMetrics({ totalClicks, avgCTR: 'N/A', avgPosition: 'N/A', totalImpressions: 'N/A' });
        toast({
          title: "Could Not Reach Server",
          description: "Showing demo data. Please check your connection or try again.",
          variant: "destructive"
        });
        setLoading(false);
      } finally {
        setAuthChecked(true);
      }
    };
  
    checkAuthAndFetchSites();
  }, [toast, fetchSiteData]);

  const handleSiteChange = (newSite) => {
    if (newSite !== selectedSite) {
        setSelectedSite(newSite);
    }
  };

  const handleDownload = () => {
    toast({
      title: "🚧 Download Feature",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl md:text-6xl font-bold gradient-text">
            GSC Traffic Forecast
          </h1>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            AI-powered Google Search Console analytics with predictive traffic forecasting
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-4 mt-6">
            <a href="https://gsc-auth-backend.onrender.com/auth/google">
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 glow-effect"
              >
                <Activity className="w-5 h-5 mr-2" />
                {isLoggedIn ? 'Reconnect GSC' : 'Connect GSC'}
              </Button>
            </a>
            <Button 
              onClick={handleDownload}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 px-6 py-3 rounded-xl font-semibold"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Report
            </Button>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {!isLoggedIn && authChecked && (
            <div className="glass-effect p-4 rounded-xl flex items-center justify-center gap-4 border-yellow-500/50">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
              <p className="font-semibold text-yellow-300">You are viewing demo data. Please connect your GSC account for live insights.</p>
            </div>
          )}
           {isLoggedIn && (
            <div className="glass-effect p-4 rounded-xl flex flex-col md:flex-row items-center justify-center gap-4 border-green-500/50">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <p className="font-semibold text-green-300">Connected as: <span className="font-bold">{userEmail}</span></p>
              </div>
              {gscSites.length > 0 ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-green-300 font-semibold">Property:</span>
                    <Select onValueChange={handleSiteChange} value={selectedSite}>
                      <SelectTrigger className="w-[280px] bg-slate-800/50 border-slate-600 text-white">
                        <SelectValue placeholder="Select a property" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600 text-white">
                        {gscSites.map(site => (
                          <SelectItem key={site} value={site}>{site}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={() => fetchSiteData(selectedSite)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md"
                  >
                    Predict
                  </Button>
                </div>
              ) : (
                 <div className="flex items-center gap-2 text-yellow-300 font-semibold">
                   <AlertTriangle className="w-5 h-5"/>
                   <p>No verified GSC sites found for this account.</p>
                 </div>
              )}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <MetricCard
            title="Total Clicks"
            value={metrics.totalClicks.toLocaleString()}
            icon={<TrendingUp className="w-6 h-6" />}
            color="from-blue-500 to-cyan-500"
            loading={loading}
          />
          <MetricCard
            title="Avg CTR"
            value={metrics.avgCTR}
            icon={<Target className="w-6 h-6" />}
            color="from-purple-500 to-pink-500"
            loading={loading}
          />
          <MetricCard
            title="Avg Position"
            value={metrics.avgPosition}
            icon={<BarChart3 className="w-6 h-6" />}
            color="from-green-500 to-emerald-500"
            loading={loading}
          />
          <MetricCard
            title="Total Impressions"
            value={metrics.totalImpressions}
            icon={<Calendar className="w-6 h-6" />}
            color="from-orange-500 to-red-500"
            loading={loading}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center"
        >
          <ForecastToggle 
            forecastDays={forecastDays}
            onForecastChange={setForecastDays}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="chart-container rounded-3xl p-8"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Traffic Forecast Analysis</h2>
            <p className="text-blue-200">
              Historical data with {forecastDays}-day AI prediction
            </p>
          </div>
          
          <TrafficChart 
            data={fullChartData} 
            loading={loading}
            forecastDays={forecastDays}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center text-blue-300 space-y-2"
        >
          <p className="text-sm">
            <span className="font-semibold">Backend Endpoint:</span> https://gsc-auth-backend.onrender.com
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
