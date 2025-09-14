import React from 'react';
import { motion } from 'framer-motion';

const MetricCard = ({ title, value, icon, color, loading }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="metric-card"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${color} bg-opacity-20`}>
          {icon}
        </div>
        {loading && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
          />
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-300">{title}</h3>
        {loading ? (
          <div className="h-8 bg-white/10 rounded animate-pulse"></div>
        ) : (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-white"
          >
            {value}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

export default MetricCard;