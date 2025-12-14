import React, { useEffect, useState } from 'react';
import { 
  Search, AlertTriangle, TrendingUp, Calendar, Info, List, 
  CheckCircle2, Loader2, Layers, ChevronRight,
  Vote, Coins, Users, Trophy, Music, Globe, Megaphone
} from 'lucide-react';
import { analyzeMediaTrends } from '../services/geminiService';
import { NarrativeReport, MONITORED_SOURCES, CategorizedFlow } from '../types';
import TrendCharts from './TrendChart';
import NewsFeed from './NewsFeed';
import MethodologyModal from './MethodologyModal';
import SourcesModal from './SourcesModal';

const Dashboard: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<NarrativeReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showMethodology, setShowMethodology] = useState(false);
  const [showSources, setShowSources] = useState(false);
  
  // Source Selection State
  const [selectedSources, setSelectedSources] = useState<string[]>([
     ...MONITORED_SOURCES.domestic,
     ...MONITORED_SOURCES.international,
     ...MONITORED_SOURCES.social
  ]);
  
  // Scanning Simulation State
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [scanProgress, setScanProgress] = useState(0);

  const fetchData = async (searchTopic?: string, searchDate?: string, sources?: string[]) => {
    setLoading(true);
    setError(null);
    setScanLogs([]);
    setScanProgress(0);

    const sourcesToScan = sources || selectedSources;

    // Simulation Timer for UI effect
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 5) + 2;
      if (progress > 95) progress = 95; 
      setScanProgress(progress);
      
      if (sourcesToScan.length > 0) {
        const randomSource = sourcesToScan[Math.floor(Math.random() * sourcesToScan.length)];
        setScanLogs(prev => {
          const newLogs = [...prev, `Connecting to source: ${randomSource}... [OK]`];
          if (newLogs.length > 8) return newLogs.slice(newLogs.length - 8);
          return newLogs;
        });
      }
    }, 250);

    try {
      const data = await analyzeMediaTrends(searchTopic, searchDate, sourcesToScan);
      clearInterval(interval);
      setScanProgress(100);
      setScanLogs(prev => [...prev, "Data aggregation complete.", "Generating analytics report..."]);
      
      setTimeout(() => {
        setReport(data);
        setLoading(false);
      }, 800);
      
    } catch (err) {
      clearInterval(interval);
      setError('خطا در ارتباط با موتور هوش مصنوعی. لطفاً دوباره تلاش کنید.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData(topic, selectedDate, selectedSources);
  };

  const handleSourceUpdate = (sources: string[]) => {
    setSelectedSources(sources);
  };

  // Icon Mapper for Categories
  const getCategoryIcon = (iconName: string) => {
    const props = { className: "w-6 h-6 text-slate-300" };
    switch (iconName) {
      case 'Vote': return <Vote {...props} className="w-6 h-6 text-blue-400" />;
      case 'Coins': return <Coins {...props} className="w-6 h-6 text-yellow-400" />;
      case 'Users': return <Users {...props} className="w-6 h-6 text-green-400" />;
      case 'Trophy': return <Trophy {...props} className="w-6 h-6 text-orange-400" />;
      case 'Music': return <Music {...props} className="w-6 h-6 text-pink-400" />;
      case 'Globe': return <Globe {...props} className="w-6 h-6 text-indigo-400" />;
      default: return <Layers {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] pb-12 font-sans">
      <MethodologyModal isOpen={showMethodology} onClose={() => setShowMethodology(false)} />
      <SourcesModal 
        isOpen={showSources} 
        onClose={() => setShowSources(false)} 
        selectedSources={selectedSources}
        onUpdateSelection={handleSourceUpdate}
      />

      {/* Navbar */}
      <nav className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-900/20">
                <TrendingUp className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">رصد جریان مدیا</h1>
                <p className="text-xs text-slate-400 hidden sm:block">سامانه هوشمند پایش اخبار و شبکه‌های اجتماعی</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowSources(true)}
                className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-700 px-3 py-2 rounded-lg transition-all"
              >
                <List className="w-4 h-4" />
                منابع: <span className="text-blue-400">{selectedSources.length}</span>
              </button>
               <button 
                onClick={() => setShowMethodology(true)}
                className="hidden md:flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <Info className="w-4 h-4" />
                شفافیت
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Search & Filter Toolbar */}
        <div className="bg-slate-800 p-1 rounded-2xl border border-slate-700 shadow-2xl mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2 p-4">
            
            {/* Date Picker */}
            <div className="relative group md:w-1/4">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Calendar className="w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block pr-10 pl-3 py-3 shadow-inner transition-all"
              />
            </div>

            {/* Topic Input */}
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Search className="w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="موضوع خاصی مد نظر دارید؟ (مثلاً: انتخابات، بورس، فوتبال...)"
                className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block pr-10 pl-3 py-3 shadow-inner transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="md:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'شروع تحلیل'}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-950/50 border border-red-900 text-red-200 p-4 rounded-xl mb-8 flex items-center gap-3 animate-pulse">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            {error}
          </div>
        )}

        {loading ? (
          /* SCANNING TERMINAL VISUALIZATION */
          <div className="max-w-3xl mx-auto mt-12">
            <div className="bg-slate-950 rounded-lg border border-slate-800 shadow-2xl overflow-hidden font-mono text-sm">
              <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-2 text-slate-500 text-xs">Rasad Core System --v2.5</span>
              </div>
              <div className="p-6 text-green-400 min-h-[300px] flex flex-col justify-end">
                {scanLogs.map((log, i) => (
                  <div key={i} className="mb-1 opacity-80 animate-in slide-in-from-left-2 fade-in duration-300">
                    <span className="text-blue-500 mr-2">➜</span>
                    {log}
                  </div>
                ))}
                <div className="mt-4 pt-4 border-t border-slate-800/50">
                  <div className="flex justify-between text-xs text-slate-500 mb-2">
                    <span>PROGRESS</span>
                    <span>{scanProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-green-500 h-1.5 rounded-full transition-all duration-300 ease-out relative"
                      style={{ width: `${scanProgress}%` }}
                    >
                      <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-slate-500 mt-4 text-sm">
              در حال جستجو و تحلیل منابع انتخابی ({selectedSources.length} منبع)...
            </p>
          </div>
        ) : report ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Header Status */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
               <div>
                  <h2 className="text-2xl font-bold text-white">گزارش وضعیت رسانه‌ای</h2>
                  <p className="text-slate-400 text-sm mt-1">تاریخ تحلیل: {report.date}</p>
               </div>
               <div className="flex gap-4">
                 <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 flex flex-col items-center">
                    <span className="text-xs text-slate-500">محتوای پردازش شده</span>
                    <span className="text-xl font-bold text-blue-400 font-mono">{report.totalMonitored.toLocaleString()}</span>
                 </div>
                 <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 flex flex-col items-center">
                    <span className="text-xs text-slate-500">منابع فعال</span>
                    <span className="text-xl font-bold text-emerald-400 font-mono">{report.activeSources}</span>
                 </div>
               </div>
            </div>

            {/* Dominant Narrative Card */}
            <div className="bg-gradient-to-r from-blue-900/40 to-slate-900 border border-blue-500/30 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Megaphone className="w-32 h-32 text-white" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                    جریان اصلی (Main Stream)
                  </span>
                </div>
                <h2 className="text-2xl md:text-4xl font-black text-white mb-6 leading-tight">
                  {report.dominantNarrative}
                </h2>
                <div className="prose prose-invert max-w-none text-slate-300 leading-8">
                  <p>{report.summary}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Charts */}
              <div className="lg:col-span-1">
                 <TrendCharts 
                   sentimentData={report.sentimentBreakdown} 
                   sourceData={report.sourceDistribution} 
                 />
              </div>

              {/* Middle Column: Categorized Flows (New) */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                   <Layers className="w-5 h-5 text-blue-400" />
                   <h3 className="text-xl font-bold text-white">دسته‌بندی موضوعی جریان‌ها</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {report.detailedFlows?.map((flow, idx) => (
                    <div key={idx} className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-all group">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-900 rounded-lg border border-slate-700 group-hover:border-slate-500 transition-colors">
                            {getCategoryIcon(flow.icon)}
                          </div>
                          <h4 className="font-bold text-lg text-slate-200">{flow.category}</h4>
                        </div>
                      </div>
                      
                      <p className="text-sm text-slate-400 leading-6 mb-4 line-clamp-3">
                        {flow.summary}
                      </p>
                      
                      <div className="space-y-2">
                         {flow.keyHeadlines.slice(0, 2).map((headline, hIdx) => (
                           <div key={hIdx} className="flex items-center gap-2 text-xs text-slate-500">
                             <ChevronRight className="w-3 h-3 text-blue-500" />
                             <span className="line-clamp-1">{headline}</span>
                           </div>
                         ))}
                      </div>
                    </div>
                  ))}
                  
                  {(!report.detailedFlows || report.detailedFlows.length === 0) && (
                     <div className="col-span-2 p-8 text-center border border-dashed border-slate-700 rounded-xl text-slate-500">
                        اطلاعات دسته‌بندی شده برای این بازه زمانی موجود نیست.
                     </div>
                  )}
                </div>

                {/* Top Items Feed */}
                <div className="mt-8">
                  <NewsFeed items={report.topItems} />
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default Dashboard;