import React from 'react';
import { X, Server, Globe, Database, Cpu } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const MethodologyModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-2xl w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Server className="w-6 h-6 text-blue-400" />
            شفافیت در فرآیند جمع‌آوری داده‌ها
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-slate-300 text-sm leading-7">
          
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
            <h3 className="font-bold text-blue-300 mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              گستره رصد (Scope)
            </h3>
            <p>
              این سامانه به صورت بلادرنگ ۲۰ منبع خبری اصلی شامل خبرگزاری‌های داخلی (فارس، تسنیم، ایرنا) و منابع بین‌المللی را پایش می‌کند. همچنین با استفاده از کلمات کلیدی داغ، محتوای عمومی توییتر و صفحات عمومی اینستاگرام مرتبط با اخبار ایران را اسکن می‌کند.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
              <h3 className="font-bold text-emerald-300 mb-2 flex items-center gap-2">
                <Database className="w-4 h-4" />
                معیارهای سنجش
              </h3>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>تعداد بازدید (Views/Impressions)</li>
                <li>ضریب بازنشر (Retweet/Share)</li>
                <li>تحلیل احساسات (Sentiment Analysis)</li>
                <li>حجم تولید محتوا در ساعت</li>
              </ul>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
              <h3 className="font-bold text-purple-300 mb-2 flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                موتور هوش مصنوعی
              </h3>
              <p>
                داده‌های خام توسط مدل زبانی Gemini 2.5 پردازش می‌شوند تا "روایت غالب" استخراج شود. این مدل با دسترسی به Google Search، صحت اخبار را با منابع معتبر تطبیق می‌دهد.
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-500 border-t border-slate-700 pt-4 mt-2">
            <strong>سلب مسئولیت فنی:</strong> در این نسخه نمایشی (Demo)، به دلیل محدودیت‌های دسترسی مستقیم به APIهای توییتر و اینستاگرام (که نیازمند مجوزهای تجاری Enterprise هستند)، داده‌ها با استفاده از هوش مصنوعی و جستجوی زنده شبیه‌سازی شده‌اند تا قابلیت‌های تحلیلی داشبورد نمایش داده شود.
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900/50 rounded-b-xl flex justify-end">
          <button 
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition-colors font-medium"
          >
            متوجه شدم
          </button>
        </div>
      </div>
    </div>
  );
};

export default MethodologyModal;