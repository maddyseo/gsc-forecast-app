import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const ForecastToggle = ({ forecastDays, onForecastChange }) => {
  const options = [
    { days: 30, label: '30 Days' },
    { days: 60, label: '60 Days' }
  ];

  return (
    <div className="glass-effect rounded-2xl p-2 flex gap-2">
      {options.map((option) => (
        <motion.div key={option.days} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => onForecastChange(option.days)}
            variant={forecastDays === option.days ? "default" : "ghost"}
            className={`
              px-6 py-3 rounded-xl font-semibold transition-all duration-300
              ${forecastDays === option.days 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                : 'text-gray-300 hover:text-white hover:bg-white/10'
              }
            `}
          >
            {option.label}
          </Button>
        </motion.div>
      ))}
    </div>
  );
};

export default ForecastToggle;