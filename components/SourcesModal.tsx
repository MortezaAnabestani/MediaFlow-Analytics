import React, { useState, useEffect } from 'react';
import { X, Globe, Check, Save } from 'lucide-react';
import { MONITORED_SOURCES } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedSources: string[];
  onUpdateSelection: (sources: string[]) => void;
}

const SourcesModal: React.FC<Props> = ({ isOpen, onClose, selectedSources, onUpdateSelection }) => {
  const [tempSelection, setTempSelection] = useState<string[]>([]);

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      setTempSelection(selectedSources);
    }
  }, [isOpen, selectedSources]);

  if (!isOpen) return null;

  const toggleSource = (source: string) => {
    setTempSelection(prev => 
      prev.includes(source) 
        ? prev.filter(s => s !== source)
        : [...prev, source]
    );
  };

  const selectAll = () => {
    const all = [
      ...MONITORED_SOURCES.domestic, 
      ...MONITORED_SOURCES.international, 
      ...MONITORED_SOURCES.social
    ];
    setTempSelection(all);
  };

  const deselectAll = () => {
    setTempSelection([]);
  };

  const handleSave = () => {
    onUpdateSelection(tempSelection);
    onClose();
  };

  const renderSection = (title: string, sources: string[], colorClass: string) => (
    <div className="space-y-4">
      <div className={`flex items-center gap-2 font-bold text-lg border-b border-slate-800 pb-2 ${colorClass}`}>
        {title}
      </div>
      <div className="space-y-2">
        {sources.map((source, idx) => {
          const isSelected = tempSelection.includes(source);
          return (
            <div 
              key={idx} 
              onClick={() => toggleSource(source)}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                isSelected 
                  ? 'bg-slate-800 border-blue-500/50 text-white' 
                  : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'
              }`}
            >
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-600'
              }`}>
                {isSelected && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="text-sm">{source}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-5xl w-full shadow-2xl relative animate-in fade-in zoom-in duration-200 my-8 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900 rounded-t-2xl shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Globe className="w-7 h-7 text-blue-500" />
              مدیریت منابع رصد
            </h2>
            <p className="text-slate-400 text-sm mt-1">منابع مورد نظر خود را برای تحلیل انتخاب کنید</p>
          </div>
          <button onClick={onClose} className="bg-slate-800 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3 bg-slate-900/50 border-b border-slate-800 flex gap-4 shrink-0">
          <button onClick={selectAll} className="text-xs text-blue-400 hover:text-blue-300">انتخاب همه</button>
          <button onClick={deselectAll} className="text-xs text-slate-400 hover:text-slate-300">لغو همه</button>
          <span className="text-xs text-slate-500 mr-auto">{tempSelection.length} منبع انتخاب شده</span>
        </div>

        {/* Content */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 overflow-y-auto">
          {renderSection("خبرگزاری‌های داخلی", MONITORED_SOURCES.domestic, "text-emerald-400")}
          {renderSection("منابع بین‌المللی", MONITORED_SOURCES.international, "text-purple-400")}
          {renderSection("شبکه‌های اجتماعی", MONITORED_SOURCES.social, "text-sky-400")}
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-900 border-t border-slate-800 rounded-b-2xl flex justify-end shrink-0">
           <button 
             onClick={handleSave}
             className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all active:scale-95"
           >
             <Save className="w-4 h-4" />
             ذخیره و اعمال تغییرات
           </button>
        </div>
      </div>
    </div>
  );
};

export default SourcesModal;