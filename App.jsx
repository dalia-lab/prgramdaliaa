import React, { useState, useEffect, useCallback } from 'react';
import { 
  Moon, Sun, RefreshCw, Activity, Shield, Users, TrendingUp, 
  Calendar, Filter, Database, Wifi, WifiOff, Zap, Bell,
  Thermometer, BarChart3, Brain, Video, Eye, AlertTriangle, Clock
} from 'lucide-react';
import EnhancedOverviewCards from './components/EnhancedOverviewCards';
import EnhancedEventTimeline from './components/EnhancedEventTimeline';
import EnhancedCharts from './components/EnhancedCharts';
import EnhancedAIInsights from './components/EnhancedAIInsights';
import { 
  generateMockData, 
  generateNewEvent, 
  generateNewTemperatureReading,
  getFilteredData 
} from './services/enhancedMockData';
import { 
  getConnectionStatus 
} from './services/firebaseService';

function App() {
  const [data, setData] = useState([]);
  const [temperatureData, setTemperatureData] = useState([]);
  const [sensorData, setSensorData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filteredTempData, setFilteredTempData] = useState([]);
  const [darkMode, setDarkMode] = useState(true); // Default to dark for professional look
  const [dateFilter, setDateFilter] = useState('month');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState('loading');
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const status = getConnectionStatus();
        const mockData = generateMockData();
        setDataSource(status.mode === 'live' ? 'firebase' : 'mock');
        setData(mockData.events);
        setTemperatureData(mockData.temperatureData);
        setSensorData(mockData.sensorData);
        setLastRefresh(new Date());
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (data.length > 0) setFilteredData(getFilteredData(data, dateFilter));
    if (temperatureData.length > 0) setFilteredTempData(getFilteredData(temperatureData, dateFilter));
  }, [data, temperatureData, dateFilter]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const freshData = generateMockData();
      setData(freshData.events);
      setTemperatureData(freshData.temperatureData);
      setLastRefresh(new Date());
      setIsRefreshing(false);
    }, 1000);
  }, [dateFilter]);

  if (isLoading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Systems...</div>;

  return (
    <div className={`${darkMode ? 'dark bg-slate-950' : 'bg-slate-50'} min-h-screen transition-colors duration-500`}>
      {/* Animated Mesh Gradient Background */}
      <div className="fixed inset-0 z-0 opacity-40 dark:opacity-60 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/30 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/40">
                <Shield className="text-white h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold dark:text-white text-slate-900 uppercase tracking-wider">
                  Smart Vision & Sensor Monitoring
                </h1>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3"/> {currentTime.toLocaleTimeString()}</span>
                  <span>•</span>
                  <span>{currentTime.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
               <div className="hidden md:flex items-center px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-500 text-xs font-bold mr-4">
                <Activity className="h-3 w-3 mr-1 animate-pulse" /> SYSTEM NORMAL
              </div>
              <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-lg bg-slate-200 dark:bg-white/5 dark:text-white text-slate-700">
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button onClick={handleRefresh} className={`p-2 rounded-lg bg-indigo-600 text-white ${isRefreshing ? 'animate-spin' : ''}`}>
                <RefreshCw size={20} />
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Overview Section */}
          <EnhancedOverviewCards data={filteredData} temperatureData={filteredTempData} sensorData={sensorData} />

          {/* Risk Assessment Table (New Section) */}
          <div className="mt-8 bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-center">
              <h3 className="text-lg font-bold dark:text-white text-slate-800 flex items-center gap-2">
                <AlertTriangle className="text-amber-500" size={20} /> Risk Assessment & Evaluation
              </h3>
              <span className="text-xs font-mono text-slate-500">Live Security Confidence</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 dark:bg-black/20 text-slate-500 text-xs uppercase font-bold">
                  <tr>
                    <th className="p-4">Detection Source</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Confidence Score</th>
                    <th className="p-4">Risk Level</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm dark:text-slate-300 text-slate-700">
                  <tr className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-4 flex items-center gap-2"><Video size={16} className="text-indigo-500"/> AI Vision Camera A1</td>
                    <td className="p-4">Person Detection</td>
                    <td className="p-4 font-mono">98.4%</td>
                    <td className="p-4"><span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-xs">LOW</span></td>
                    <td className="p-4 text-xs">Monitoring</td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5">
                    <td className="p-4 flex items-center gap-2"><Zap size={16} className="text-amber-500"/> Motion Sensor S-04</td>
                    <td className="p-4">Vibration Spike</td>
                    <td className="p-4 font-mono">72.1%</td>
                    <td className="p-4"><span className="px-2 py-1 bg-amber-500/10 text-amber-500 rounded text-xs">MEDIUM</span></td>
                    <td className="p-4 text-xs">Verifying...</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
             <EnhancedCharts data={filteredData} temperatureData={filteredTempData} />
             <div className="space-y-8">
                <EnhancedAIInsights data={filteredData} temperatureData={filteredTempData} sensorData={sensorData} />
                <EnhancedEventTimeline data={filteredData} temperatureData={filteredTempData} sensorData={sensorData} />
             </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
