import PropTypes from "prop-types";

function SearchBar({ searchValue, setSearchValue }) {
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
          placeholder="Search for a radio station name"
          value={searchValue}
          onChange={handleSearchBarChange}
        />
      </div>
    </div>
  );
}

export default SearchBar;
