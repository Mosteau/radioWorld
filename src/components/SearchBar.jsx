import PropTypes from "prop-types";
import { useState, useEffect } from "react";

function SearchBar({ searchValue, setSearchValue }) {
  const [placeholder, setPlaceholder] = useState("Search for a radio station name");

  useEffect(() => {
    const updatePlaceholder = () => {
      const width = window.innerWidth;
      if (width <= 320) {
        setPlaceholder("Search...");
      } else if (width <= 480) {
        setPlaceholder("Search radio...");
      } else if (width <= 640) {
        setPlaceholder("Search stations...");
      } else if (width <= 768) {
        setPlaceholder("Search radio stations");
      } else {
        setPlaceholder("Search for a radio station name");
      }
    };

    updatePlaceholder();
    window.addEventListener('resize', updatePlaceholder);
    
    return () => window.removeEventListener('resize', updatePlaceholder);
  }, []);

  function handleSearchBarChange(event) {
    setSearchValue(event.target.value);
  }

  return (
    <div className="container-search-bar">
      <div className="search-bar">
        <input
          className="search-bar__input"
          type="search"
          name="search-bar"
          placeholder={placeholder}
          value={searchValue}
          onChange={handleSearchBarChange}
        />
      </div>
    </div>
  );
}

export default SearchBar;
