import React from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { TrendData } from '../types';

interface Props {
  sentimentData: TrendData[];
  sourceData: TrendData[];
}

const TrendCharts: React.FC<Props> = ({ sentimentData, sourceData }) => {
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
          <p className="text-slate-200 font-bold mb-1">{label || payload[0].name}</p>
          <p className="text-blue-400 text-sm">
            {`${payload[0].value}% سهم`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* Sentiment Analysis - Donut Chart */}
      <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-xl">
        <div className="flex justify-between items-center mb-4">
           <h3 className="text-sm font-bold text-slate-300">تحلیل احساسات</h3>
           <div className="text-[10px] bg-slate-700 px-2 py-1 rounded text-slate-400">Sentiment</div>
        </div>
        <div className="h-[180px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                 verticalAlign="middle" 
                 layout="vertical" 
                 align="right"
                 iconSize={8}
                 wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none pr-14">
             <div className="text-center">
               <span className="text-2xl font-bold text-white block">100%</span>
               <span className="text-[10px] text-slate-500">مجموع</span>
             </div>
          </div>
        </div>
      </div>

      {/* Source Distribution - Bar Chart */}
      <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-xl">
        <div className="flex justify-between items-center mb-4">
           <h3 className="text-sm font-bold text-slate-300">توزیع منابع خبری</h3>
           <div className="text-[10px] bg-slate-700 px-2 py-1 rounded text-slate-400">Sources</div>
        </div>
        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sourceData}
              layout="vertical"
              margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
              barSize={12}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                stroke="#94a3b8" 
                width={70} 
                tick={{fontSize: 10, fill: '#94a3b8'}}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {sourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default TrendCharts;