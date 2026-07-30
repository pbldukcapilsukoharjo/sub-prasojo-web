import React from 'react';

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export default function Tabs({ tabs, activeTab, onChange, className = '' }: TabsProps) {
  return (
    <div className={`flex items-center gap-8 border-b border-neutral overflow-x-auto no-scrollbar ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`whitespace-nowrap py-4 text-xs font-bold tracking-wider uppercase transition-colors relative ${
              isActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-secondary'
            }`}
          >
            {tab.label}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gray-900 dark:bg-white rounded-t-md"></div>
            )}
          </button>
        );
      })}
    </div>
  );
}
