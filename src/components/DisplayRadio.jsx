/* eslint-disable react/prop-types */
import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import RadioPlayer from "./RadioPlayer";
import FilterSection from "./FilterSection";
import LazyImage from "./LazyImage";

function DisplayRadio({
  filteredRadio,
  toggleAudio,
  audioPlayer,
  playNextStation,
  playPreviousStation,
  currentStationIndex,
  setCurrentStationIndex,
  isLoading,
  searchValue,
  setSearchValue,
  styleSearchValue,
  setStyleSearchValue,
  countrySearchValue,
  setCountrySearchValue,
  isVisible,
  setIsVisible,
}) {
  const [openModal, setOpenModal] = useState(false);

  const handleStationClick = useCallback((selectedIndex) => {
    setCurrentStationIndex(selectedIndex);
    setOpenModal(true);
    
    // Démarrer l'audio automatiquement
    if (filteredRadio[selectedIndex]) {
      const station = filteredRadio[selectedIndex];
      audioPlayer.play(station.url);
    }
  }, [setCurrentStationIndex, filteredRadio, audioPlayer]);
  return (
    <div className="container-display-radio">
      <FilterSection
        styleSearchValue={styleSearchValue}
        countrySearchValue={countrySearchValue}
        setStyleSearchValue={setStyleSearchValue}
        setCountrySearchValue={setCountrySearchValue}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
      />
      <div className={`display_radios ${!isLoading ? "loaded" : ""}`}>
        {filteredRadio.length === 0 ? (
          <p className="no-results">No results found</p>
        ) : (
          filteredRadio.map((station, selectedCurrentStationIndex) => (
            <div className="space4" key={station.stationuuid}>
              <div className="rond">
                <button
                  onClick={() => handleStationClick(selectedCurrentStationIndex)}
                  type="button"
                  className="radio"
                >
                  <LazyImage
                    src={station.favicon}
                    alt="favicon"
                    className="favicon"
                  />
                  <p>{station.name}</p>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {filteredRadio.length > 0 && openModal && (
        <RadioPlayer
          closeModal={setOpenModal}
          stations={filteredRadio}
          audioPlayer={audioPlayer}
          currentStationIndex={currentStationIndex}
          toggleAudio={toggleAudio}
          playNextStation={playNextStation}
          playPreviousStation={playPreviousStation}
        />
      )}
    </div>
  );
}

DisplayRadio.propTypes = {
  filteredRadio: PropTypes.array.isRequired,
  audioPlayer: PropTypes.object.isRequired,
  currentStationIndex: PropTypes.number.isRequired,
  toggleAudio: PropTypes.func.isRequired,
  playNextStation: PropTypes.func.isRequired,
  playPreviousStation: PropTypes.func.isRequired,
  setCurrentStationIndex: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  searchValue: PropTypes.string.isRequired,
  setSearchValue: PropTypes.func.isRequired,
  styleSearchValue: PropTypes.string.isRequired,
  setStyleSearchValue: PropTypes.func.isRequired,
  countrySearchValue: PropTypes.string.isRequired,
  setCountrySearchValue: PropTypes.func.isRequired,
  isVisible: PropTypes.number.isRequired,
  setIsVisible: PropTypes.func.isRequired,
};

export default DisplayRadio;
