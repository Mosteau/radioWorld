import { useState } from "react";
import PropTypes from "prop-types";

function Favorite({
  selectedCurrentStationIndex,
  setCurrentStationIndex,
  radiosRandom,
  favoriteRadiosRandom,
  setFavoriteRadiosRandom,
}) {
  const [isFavorite, setIsFavorite] = useState(false);

  const addFavorite = () => {
    if (isFavorite === false) {
      setIsFavorite(true);
      setCurrentStationIndex(selectedCurrentStationIndex);
      const tabFavorite = favoriteRadiosRandom;
      tabFavorite.push(radiosRandom[selectedCurrentStationIndex]);
      setFavoriteRadiosRandom(tabFavorite);
      console.warn(tabFavorite);
    } else {
      setIsFavorite(false);
    }
  };

  return (
    <button className="favorite" type="button" onClick={addFavorite}>
      <img
        src={
          isFavorite === false
            ? "src/images/empty_heart.png"
            : "src/images/full_heart.png"
        }
        alt="favorite"
      />
    </button>
  );
}

export default Favorite;

Favorite.propTypes = {
  radiosRandom: PropTypes.arrayOf.isRequired,
  setCurrentStationIndex: PropTypes.func.isRequired,
  selectedCurrentStationIndex: PropTypes.number.isRequired,
  favoriteRadiosRandom: PropTypes.arrayOf.isRequired,
  setFavoriteRadiosRandom: PropTypes.func.isRequired,
};
