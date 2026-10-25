import React from 'react';
import type { EquipmentCategory } from '../types';
import { FlaskConical, Gauge, Bug, Sparkles, Microscope, Wrench, Biohazard } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: EquipmentCategory;
  onSelectCategory: (category: EquipmentCategory) => void;
  itemCounts: Record<string, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  itemCounts,
}) => {
  const categories: { label: EquipmentCategory; icon: React.ReactNode }[] = [
    { label: 'Semua', icon: <Sparkles className="w-4 h-4" /> },
    { label: 'Lab Kimia', icon: <FlaskConical className="w-4 h-4" /> },
    { label: 'Lab Fisika', icon: <Gauge className="w-4 h-4" /> },
    { label: 'Lab Mikrobiologi', icon: <Biohazard className="w-4 h-4" /> },
    { label: 'Lab Vektor', icon: <Bug className="w-4 h-4" /> },
    { label: 'Lab Parasitologi', icon: <Microscope className="w-4 h-4" /> },
    { label: 'Workshop', icon: <Wrench className="w-4 h-4" /> },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.label;
        const count = itemCounts[cat.label] || 0;

        return (
          <button
            key={cat.label}
            onClick={() => onSelectCategory(cat.label)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 ${
              isSelected
                ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20 -translate-y-0.5'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80 hover:text-slate-900 hover:-translate-y-0.5'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                isSelected
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
