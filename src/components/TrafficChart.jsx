import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';

const TrafficChart = ({ data, loading, forecastDays }) => {
  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const formatTooltipDate = (value) => {
    try {
      return format(parseISO(value), 'MMM dd, yyyy');
    } catch {
      return value;
    }
  };

  const formatXAxisDate = (value) => {
    try {
      return format(parseISO(value), 'MMM yy');
    } catch {
      return value;
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const isHistorical = !payload[0].payload.isForecast;
      return (
        <div className="bg-slate-800/95 backdrop-blur-sm border border-white/20 rounded-lg p-4 shadow-xl">
          <p className="text-white font-semibold mb-2">
            {formatTooltipDate(label)}
          </p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-300">
                {entry.name}: {entry.value.toLocaleString()}
                {!isHistorical && <span className="text-orange-400 ml-1">(predicted)</span>}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    if (payload.isForecast) {
      return (
        <circle
          cx={cx}
          cy={cy}
          r={3}
          fill="#f97316"
          stroke="#fff"
          strokeWidth={2}
          opacity={0.8}
        />
      );
    }
    return null;
  };

  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatXAxisDate}
            stroke="#94a3b8"
            fontSize={12}
          />
          <YAxis 
            stroke="#94a3b8"
            fontSize={12}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ color: '#94a3b8' }}
            iconType="line"
          />
          
          {/* Historical Data Line */}
          <Line
            type="monotone"
            dataKey="clicks"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={false}
            name="Historical Clicks"
            connectNulls={false}
            strokeDasharray={(entry) => entry?.isForecast ? "5,5" : "0"}
          />
          
          {/* Forecast Data Line */}
          <Line
            type="monotone"
            dataKey="forecastClicks"
            stroke="#f97316"
            strokeWidth={3}
            strokeDasharray="8,4"
            dot={<CustomDot />}
            name="Predicted Clicks"
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
      
      {/* Legend */}
      <div className="flex justify-center gap-8 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-blue-500"></div>
          <span className="text-blue-200">Historical Data</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-orange-500" style={{ backgroundImage: 'repeating-linear-gradient(to right, #f97316 0, #f97316 4px, transparent 4px, transparent 8px)' }}></div>
          <span className="text-orange-200">AI Forecast ({forecastDays} days)</span>
        </div>
      </div>
    </div>
  );
};

export default TrafficChart;