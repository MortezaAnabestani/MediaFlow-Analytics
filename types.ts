export interface NewsItem {
  id: string;
  title: string;
  source: string;
  type: 'News' | 'Twitter' | 'Instagram';
  url?: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  views: number;
  shares: number;
  publishTime: string;
}

export interface TrendData {
  name: string;
  value: number; // Percentage or count
  color: string;
}

export interface CategorizedFlow {
  category: string; // e.g., "Politics", "Economy", "Sports"
  icon: string; // logic to map text to icon later
  summary: string;
  keyHeadlines: string[];
}

export interface NarrativeReport {
  date: string;
  dominantNarrative: string;
  summary: string;
  totalMonitored: number;
  activeSources: number;
  sentimentBreakdown: TrendData[];
  sourceDistribution: TrendData[];
  detailedFlows: CategorizedFlow[]; // New field for comprehensive report
  topItems: NewsItem[];
}

export interface SearchParams {
  topic?: string;
}

export const MONITORED_SOURCES = {
  domestic: [
    "خبرگزاری فارس (Fars News)",
    "خبرگزاری تسنیم (Tasnim)",
    "ایرنا (IRNA)",
    "ایسنا (ISNA)",
    "خبرگزاری مهر (Mehr News)",
    "انتخاب (Entekhab)",
    "روزنامه قدس (Quds Daily)",
    "عصر ایران (Asriran)",
    "تابناک (Tabnak)",
    "همشهری آنلاین",
    "روزنامه شرق"
  ],
  international: [
    "بی‌بی‌سی فارسی (BBC Persian)",
    "ایران اینترنشنال (Iran Intl)",
    "رادیو فردا (Radio Farda)",
    "یورونیوز فارسی (Euronews)",
    "صدای آمریکا (VOA Farsi)",
    "دویچه‌وله فارسی (DW)"
  ],
  social: [
    "توییتر: اکانت‌های رسمی خبرگزاری‌ها",
    "توییتر: روزنامه‌نگاران و تحلیل‌گران",
    "اینستاگرام: صفحات خبری پربازدید",
    "اینستاگرام: صفحات سبک زندگی و اجتماعی",
    "کانال‌های تلگرامی خبری برجسته"
  ]
};