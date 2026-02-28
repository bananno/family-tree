import clsx from 'clsx';
import React from 'react';

export default function ButtonSelector({ value, onChange, options }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(option => {
        const isSelected = String(value) === String(option.value);
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={clsx(
              'px-3 py-1.5 text-sm rounded border transition-colors',
              isSelected
                ? 'bg-gray-700 text-white border-gray-700'
                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
