import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const CATEGORIES = [
  { id: 'hanh-dong', name: 'Hành Động', color: 'from-red-500 to-orange-600' },
  { id: 'tinh-cam', name: 'Tình Cảm', color: 'from-pink-500 to-rose-600' },
  { id: 'tai-lieu', name: 'Tài Liệu', color: 'from-amber-500 to-yellow-600' },
  { id: 'gia-dinh', name: 'Gia Đình', color: 'from-blue-500 to-cyan-600' },
  { id: 'kinh-di', name: 'Kinh Dị', color: 'from-purple-600 to-indigo-600' },
  { id: 'hai-huoc', name: 'Hài Hước', color: 'from-green-500 to-emerald-600' },
  { id: 'vien-tuong', name: 'Viễn Tưởng', color: 'from-indigo-500 to-blue-600' },
  { id: 'tam-ly', name: 'Tâm Lý', color: 'from-teal-500 to-green-600' },
];

export const CategoryRail = () => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between mb-4 px-4">
        <h2 className="text-xl font-bold text-slate-100">Bạn đang quan tâm gì?</h2>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4 px-4 scrollbar-hide snap-x">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            to={`/explore?category=${cat.id}`}
            className={`relative flex-shrink-0 w-40 h-24 rounded-xl overflow-hidden group snap-start transition-all hover:scale-105`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-90 group-hover:opacity-100 transition-opacity`} />
            
            <div className="absolute inset-0 p-3 flex flex-col justify-between">
              <span className="font-bold text-white text-lg drop-shadow-md">
                {cat.name}
              </span>
              <div className="flex items-center text-white/80 text-xs font-medium group-hover:text-white transition-colors">
                Xem ngay <ChevronRight className="h-3 w-3" />
              </div>
            </div>
            
            {/* Decorative Circle */}
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
          </Link>
        ))}
        
        <Link
          to="/explore"
          className="relative flex-shrink-0 w-32 h-24 rounded-xl bg-slate-800 flex items-center justify-center group hover:bg-slate-700 transition-colors"
        >
          <span className="text-slate-300 font-medium group-hover:text-white">
            + Khám phá
          </span>
        </Link>
      </div>
    </div>
  );
};
