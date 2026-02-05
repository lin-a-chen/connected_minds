'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './AutocompleteInput.module.scss';
import standartStyles from "@/styles/Styles.module.scss";

const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const Search = ({ onChange, dataToSearch, defaultValue, className, placeholder, searchFields }) => {
  const dropdownRef = useRef(null);
  const mainInputRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const handleInputChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    debounceSearch(value);
  };

  const handleSelection = (result) => {
    setSearchTerm(result[searchFields[0]]); 
    onChange(result);
    setDropdownVisible(false);
  };

  const search = (term) => {
    if (term.length === 0) {
      setResults([]);
      setDropdownVisible(false);
      return;
    }

    const filteredResults = dataToSearch.filter(el => 
      searchFields.some(field => el[field]?.toLowerCase().includes(term.toLowerCase()))
    );
    setResults(filteredResults.slice(0, 10)); 
    setDropdownVisible(filteredResults.length > 0);
  };

  const debounceSearch = debounce(search, 300);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target) && mainInputRef.current !== event.target) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (defaultValue) setSearchTerm(defaultValue);
  }, [defaultValue]);

  return (
    <div className={`${styles.secCenter} ${className}`} ref={dropdownRef}>
      <input
        className={`${standartStyles.inputRegular} ${styles.dropdownInput}`}
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        ref={mainInputRef}
      />
      {isDropdownVisible && (
        <div className={styles.sectionDropdown}>
          {results.map((result, index) => (
            <div key={index}>
              <span onClick={() => handleSelection(result)} className={styles.a}>
                {searchFields.map(field => result[field]).filter(Boolean).join(' ')}
                <i className="uil uil-arrow-right"></i>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
