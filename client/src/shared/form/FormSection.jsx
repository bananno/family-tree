import React from 'react';

export default function FormSection({ label, children, style = {}, error }) {
  return (
    <div className="mb-6" style={style}>
      {label && (
        <label className="block text-sm font-semibold text-gray-600 mb-1 capitalize">
          {label}
        </label>
      )}
      {children}
      {error && <div className="text-red-600 text-sm mt-1">{error.type}</div>}
    </div>
  );
}
