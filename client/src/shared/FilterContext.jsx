import React, { createContext, useContext, useState } from 'react';

export const FilterContext = createContext();

export function FilterProvider({ children }) {
  const [filters, setFilters] = useState({});

  function setFilterContent(filterId, content) {
    setFilters(prev => ({
      ...prev,
      [filterId]: {
        content,
        words: contentToRegExpWords(content),
      },
    }));
  }

  function getFilteredList(filterId, list, getFilterableString) {
    const filterWords = filters[filterId]?.words || [];

    if (filterWords.length === 0) {
      return list;
    }

    return list.filter(item => {
      const itemContent = getFilterableString(item);

      return filterWords.every(regExp => regExp.test(itemContent));
    });
  }

  const value = {
    setFilterContent,
    getFilteredList,
    filters,
  };

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
}

export function useFilter() {
  return useContext(FilterContext);
}

////////////////////

function contentToRegExpWords(content) {
  return content
    .trim()
    .split(' ')
    .filter(Boolean)
    .map(word => RegExp(word, 'i'));
}
