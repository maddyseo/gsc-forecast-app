import React from 'react';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import Dashboard from '@/components/Dashboard';

function App() {
  return (
    <>
      <Helmet>
        <title>GSC Traffic Forecast - AI-Powered Analytics Dashboard</title>
        <meta name="description" content="Advanced Google Search Console traffic forecasting with AI-powered predictions and beautiful data visualization." />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <Dashboard />
        <Toaster />
      </div>
    </>
  );
}

export default App;