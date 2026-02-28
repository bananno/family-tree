import React from 'react';

export default function FormSection({ label, children, style = {} }) {
  return (
    <div className="mb-6" style={style}>
      {label && (
        <label className="block text-sm font-semibold text-gray-600 mb-1 capitalize">
          {label}
        </label>
      )}
      {children}
    </div>
  );
}
