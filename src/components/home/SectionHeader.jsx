import { ChevronRight } from 'lucide-react';

/**
 * SectionHeader - Tiêu đề cho mỗi section
 * Chữ trắng bold 28-32px, icon arrow tròn bên phải
 */
export const SectionHeader = ({ title, onArrowClick }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
        {title}
      </h2>
      
      {/* Icon arrow tròn - hover sáng lên */}
      <button
        onClick={onArrowClick}
        className="
          flex-shrink-0 w-9 h-9 md:w-10 md:h-10
          flex items-center justify-center
          rounded-full
          border border-white
          text-white
          transition-all duration-300
          hover:bg-white hover:text-black hover:scale-110
          hover:shadow-lg
        "
        aria-label="View more"
      >
        <ChevronRight size={20} className="md:w-6 md:h-6" />
      </button>
    </div>
  );
};
