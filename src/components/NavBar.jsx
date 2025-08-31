/* eslint-disable react/prop-types */

import React from "react";
import PropTypes from "prop-types";
import SearchBar from "./SearchBar";
import FilterButton from "./FilterButton";

function NavBar({
  searchValue,
  setSearchValue,
  radiosRandom,
  isVisible,
  setIsVisible,
}) {
  return (
    <div className="navbar">
      <div className="container-logo">
        <img src="/Radio_World.png" className="logoRW" alt="Radio World logo" />
      </div>
      <div className="search-feature">
        <div className="Searchbar">
          <SearchBar
            radiosRandom={radiosRandom}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
        </div>
        <div className="container-filter">
          <FilterButton isVisible={isVisible} setIsVisible={setIsVisible} />
        </div>
      </div>
      <div className="logoRS">
        <div className="RS1">
          <img src="/twitter.png" alt="Twitter logo" />
          <img src="/instagram.png" alt="Insta logo" />
        </div>
        <div className="RS2">
          <img src="/Facebook.png" alt="Fb logo" />
          <img src="/courrier.png" alt="Contact logo" className="courrier" />
        </div>
      </div>
    </div>
  );
}

NavBar.propTypes = {
  isVisible: PropTypes.number.isRequired,
  setIsVisible: PropTypes.func.isRequired,
};

export default NavBar;
