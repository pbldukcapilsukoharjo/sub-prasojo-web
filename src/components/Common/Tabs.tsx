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
    <div className={`flex items-center gap-8 border-b border-gray-200 overflow-x-auto no-scrollbar ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`whitespace-nowrap py-4 text-xs font-bold tracking-wider uppercase transition-colors relative ${
              isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gray-900 rounded-t-md"></div>
            )}
          </button>
        );
      })}
    </div>
  );
}
