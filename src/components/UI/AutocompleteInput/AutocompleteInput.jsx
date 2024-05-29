import React, { useEffect, useRef, useState } from 'react';
import styles from './AutocompleteInput.module.scss';
import standartStyles from "@/styles/Styles.module.scss";

const AutocompleteInput = ({ onChange, dataToSearch, defaultValue, className }) => {
  const dropdownRef = useRef(null);
  const mainInputRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const handleInputChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    search(value);
  };

  const handleSelection = (result) => {
      setSearchTerm(result);
      onChange(result);
      setDropdownVisible(false);
  };

  const search = (term) => {
    const filteredResults = dataToSearch
      .map((el) => {
        if (term.length !== 0) {
          
          if (el.toLowerCase().includes(term.toLowerCase())) {
            return el;
          }
        }
        return null;
      })
      .filter(Boolean);

    setResults(filteredResults);
    setDropdownVisible(filteredResults.length > 0);
  };

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
        placeholder="Search..."
        value={searchTerm}
        onChange={handleInputChange}
        ref={mainInputRef}
      />
      {isDropdownVisible && (
        <div className={styles.sectionDropdown}>
          {results.map((result, index) => (
            <div key={index}>
              <span onClick={() => handleSelection(result)} className={styles.a}>
                {result} <i className="uil uil-arrow-right"></i>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutocompleteInput;
