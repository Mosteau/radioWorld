import PropTypes from "prop-types";

function FilterButton({ isVisible, setIsVisible }) {
  function handleClickOnFilterButton() {
    if (!isVisible) {
      setIsVisible(1);
    }
  }

  return (
    <button
      onClick={handleClickOnFilterButton}
      type="button"
      className="filter-button"
      value={isVisible}
    >
      Filter
      <img src="/filterIcon.png" alt="Filter icon" />
    </button>
  );
}

FilterButton.propTypes = {
  isVisible: PropTypes.number.isRequired,
  setIsVisible: PropTypes.func.isRequired,
};

export default FilterButton;
