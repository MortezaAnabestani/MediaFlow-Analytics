import React from 'react';
import { NewsItem } from '../types';
import { Twitter, Instagram, Globe, Eye, Share2, ExternalLink, Search, Link as LinkIcon, FileX } from 'lucide-react';

interface Props {
  items: NewsItem[];
}

const NewsFeed: React.FC<Props> = ({ items }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'Twitter': return <Twitter className="w-5 h-5 text-sky-400" />;
      case 'Instagram': return <Instagram className="w-5 h-5 text-pink-500" />;
      default: return <Globe className="w-5 h-5 text-emerald-400" />;
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fa-IR', { notation: "compact" }).format(num);
  };

  const getActionLink = (item: NewsItem) => {
    let finalUrl = item.url;
    let isSearch = false;

    // Strict validation
    const isValidUrl = finalUrl && 
                       finalUrl.trim() !== "" && 
                       !finalUrl.includes('grounding-api-redirect') && 
                       (finalUrl.startsWith('http') || finalUrl.startsWith('https'));

    if (!isValidUrl) {
      finalUrl = `https://www.google.com/search?q=${encodeURIComponent(item.title + ' ' + item.source)}`;
      isSearch = true;
    }

    return { url: finalUrl, isSearch };
  };

  if (!items || items.length === 0) {
    return (
      <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg p-12 text-center flex flex-col items-center justify-center animate-in fade-in duration-500">
        <div className="bg-slate-700/50 p-4 rounded-full mb-4">
          <FileX className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-300 mb-2">محتوایی یافت نشد</h3>
        <p className="text-slate-400 text-sm max-w-md leading-relaxed">
          با توجه به معیارهای سخت‌گیرانه راستی‌آزمایی و منابع انتخاب شده، هیچ خبر قطعی و دارای لینک معتبری برای این موضوع در تاریخ انتخابی یافت نشد.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg overflow-hidden">
      <div className="p-6 border-b border-slate-700 flex justify-between items-center">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-2 h-8 bg-orange-500 rounded-full inline-block"></span>
          مهم‌ترین محتواهای رصد شده (Top Feed)
        </h3>
        <span className="text-slate-400 text-sm">مرتب‌سازی: ضریب نفوذ</span>
      </div>
      
      <div className="divide-y divide-slate-700">
        {items.map((item) => {
          const { url, isSearch } = getActionLink(item);
          return (
            <div key={item.id} className="p-5 hover:bg-slate-700/30 transition-colors group">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-slate-900/50 p-1.5 rounded-lg border border-slate-600">
                      {getIcon(item.type)}
                    </span>
                    <span className="text-sm text-slate-400 font-medium">{item.source}</span>
                    <span className="text-xs text-slate-500 mx-1">•</span>
                    <span className="text-xs text-slate-500">{item.publishTime}</span>
                    
                    {/* Verified Badge if URL exists */}
                    {!isSearch && (
                      <span className="bg-blue-900/30 text-blue-400 text-[10px] px-2 py-0.5 rounded border border-blue-800 mr-2 flex items-center gap-1">
                         <LinkIcon className="w-3 h-3" />
                         لینک مستقیم
                      </span>
                    )}
                  </div>
                  
                  <h4 className="text-lg font-bold text-slate-100 mb-2 leading-relaxed group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h4>

                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4" />
                      <span>{formatNumber(item.views)} بازدید</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Share2 className="w-4 h-4" />
                      <span>{formatNumber(item.shares)} بازنشر</span>
                    </div>
                    <div className={`px-2 py-0.5 rounded text-xs font-medium border
                      ${item.sentiment === 'positive' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800' : 
                        item.sentiment === 'negative' ? 'bg-red-900/30 text-red-400 border-red-800' : 
                        'bg-slate-700 text-slate-300 border-slate-600'}`}>
                      {item.sentiment === 'positive' ? 'مثبت' : item.sentiment === 'negative' ? 'منفی' : 'خنثی'}
                    </div>
                  </div>
                </div>

                <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`p-2 rounded-lg transition-all border ${
                    isSearch 
                      ? 'text-yellow-500 border-transparent hover:text-yellow-100 hover:bg-yellow-900/20' 
                      : 'text-blue-400 border-slate-700 bg-slate-900 hover:bg-blue-600 hover:text-white hover:border-blue-500'
                  }`}
                  title={isSearch ? "جستجو در گوگل (لینک مستقیم موجود نیست)" : "مشاهده منبع اصلی"}
                >
                  {isSearch ? <Search className="w-5 h-5" /> : <ExternalLink className="w-5 h-5" />}
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewsFeed;