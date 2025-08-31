/* eslint-disable no-nested-ternary */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import getDataCountry from "../services/countryData";
import getDataStyle from "../services/styleData";

function FilterSection({
  setStyleSearchValue,
  setCountrySearchValue,
  isVisible,
  setIsVisible,
}) {
  const [filterCriteriaButton, setFilterCriteriaButton] = useState(0);
  const [isActive1, setIsActive1] = useState(null);
  const [isActive2, setIsActive2] = useState(null);
  const [inputValue1, setInputValue1] = useState("");
  const [inputValue2, setInputValue2] = useState("");
  const [dataCountry, setDataCountry] = useState([]);
  const [dataStyle, setDataStyle] = useState([]);

  function getNoResultsMessage() {
    return <p className="no-results">No results found.</p>;
  }
  const noResultsMessage = getNoResultsMessage();

  function handleInputChange(event) {
    if (filterCriteriaButton) {
      setInputValue1(event.target.value);
    } else {
      setInputValue2(event.target.value);
    }
  }

  function handleClickOnCloseButton() {
    if (isVisible) {
      setIsVisible(0);
    }
  }

  function handleFilterCriteriaActiveState(event) {
    setFilterCriteriaButton(parseInt(event.target.value, 10));
  }

  function handleClickOnOptionButton(event) {
    if (filterCriteriaButton) {
      setCountrySearchValue(event.target.textContent);
      setIsActive1(parseInt(event.target.value, 10));
    } else {
      setStyleSearchValue(event.target.textContent);
      setIsActive2(parseInt(event.target.value, 10));
    }
  }

  function handleClickOnCriteriaResetButton() {
    if (filterCriteriaButton) {
      setCountrySearchValue("");
      setIsActive1(null);
    } else {
      setStyleSearchValue("");
      setIsActive2(null);
    }
  }

  function handleClickOnResetButton() {
    setCountrySearchValue("");
    setStyleSearchValue("");
    setIsActive1(null);
    setIsActive2(null);
  }

  useEffect(() => {
    getDataStyle()
      .then((styleData) => setDataStyle(styleData))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    getDataCountry()
      .then((countryData) => setDataCountry(countryData))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className={`filter-section ${isVisible ? "is-visible" : ""}`}>
      <button
        type="button"
        onClick={handleClickOnCloseButton}
        className="close-icon-wrapper"
        value={isVisible}
      >
        <img src="/closeIcon.png" alt="Close icon" />
      </button>
      <div className="filter-criteria-wrapper">
        <button
          type="button"
          onClick={handleFilterCriteriaActiveState}
          className={`filter-criteria ${!filterCriteriaButton && "is-active"}`}
          value={0}
        >
          Style
        </button>
        <button
          type="button"
          onClick={handleFilterCriteriaActiveState}
          className={`filter-criteria ${filterCriteriaButton && "is-active"}`}
          value={1}
        >
          Country
        </button>
      </div>
      <div className="filter-section-search-bar">
        <input
          type="search"
          name="filter-section-search-bar"
          placeholder={
            filterCriteriaButton ? "Search for a country" : "Search for a style"
          }
          value={filterCriteriaButton ? inputValue1 : inputValue2}
          onChange={handleInputChange}
        />
      </div>
      <div className="filter-options-wrapper">
        {!(filterCriteriaButton ? dataCountry : dataStyle).filter((element) =>
          filterCriteriaButton
            ? element.name.toLowerCase().startsWith(inputValue1.toLowerCase())
            : element.name.toLowerCase().startsWith(inputValue2.toLowerCase())
        ).length
          ? noResultsMessage
          : filterCriteriaButton
          ? dataCountry
              .filter((country) =>
                country.name.toLowerCase().startsWith(inputValue1.toLowerCase())
              )
              .map((country) => (
                <div key={dataCountry.indexOf(country)} className="options">
                  <button
                    onClick={handleClickOnOptionButton}
                    type="button"
                    className={`option${
                      isActive1 === dataCountry.indexOf(country)
                        ? " is-active"
                        : ""
                    }`}
                    value={dataCountry.indexOf(country)}
                  >
                    {country.name}
                  </button>
                </div>
              ))
          : dataStyle
              .filter((tag) =>
                tag.name.toLowerCase().startsWith(inputValue2.toLowerCase())
              )
              .map((tag) => (
                <div key={dataStyle.indexOf(tag)} className="options">
                  <button
                    onClick={handleClickOnOptionButton}
                    type="button"
                    className={`option${
                      isActive2 === dataStyle.indexOf(tag) ? " is-active" : ""
                    }`}
                    value={dataStyle.indexOf(tag)}
                  >
                    {tag.name}
                  </button>
                </div>
              ))}
      </div>
      <div className="reset-button-wrapper">
        <button
          type="button"
          className="reset-button"
          onClick={handleClickOnCriteriaResetButton}
        >
          {filterCriteriaButton ? "Reset country filter" : "Reset style filter"}
        </button>
        <button
          type="button"
          className="reset-button"
          onClick={handleClickOnResetButton}
        >
          Reset All filters
        </button>
      </div>
    </div>
  );
}

FilterSection.propTypes = {
  setStyleSearchValue: PropTypes.func.isRequired,
  setCountrySearchValue: PropTypes.func.isRequired,
  isVisible: PropTypes.number.isRequired,
  setIsVisible: PropTypes.func.isRequired,
};

export default FilterSection;
