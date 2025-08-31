/* Function pour faire fonctionner la radio (play,pause, next,previous) */
import PropTypes from "prop-types";
import React from "react";
import LazyImage from "./LazyImage";

function RadioPlayer({
  stations,
  audioPlayer,
  currentStationIndex,
  toggleAudio,
  playNextStation,
  playPreviousStation,
  closeModal,
}) {
  const currentStation = stations[currentStationIndex];

  if (!currentStation) {
    return null;
  }

  return (
    <div type="button" className="container-radio">
      <div type="button" className="int-content">
        <div className="container-animation">
          <div className="animation">
            <img
              src="/Cassette.png"
              alt="Cassette"
              className="c1"
              style={{
                animation: audioPlayer.isPlaying ? "loop 2s linear infinite" : "none",
              }}
            />
            <img
              src="/Cassette2.png"
              alt="Cassette2"
              className="c2"
              style={{
                animation: audioPlayer.isPlaying ? "loop 2s linear infinite" : "none",
              }}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            closeModal(false);
            toggleAudio();
          }}
          className="button"
        >
          X
        </button>
        <div className="container-button">
          <div
            className="prevStation"
            onClick={playPreviousStation}
            aria-hidden="true"
            type="button"
          >
            <img src="/precedent.png" alt="precedent" />
          </div>
          <div 
            className="playMusic" 
            onClick={() => audioPlayer.toggle(currentStation.url)} 
            aria-hidden="true"
          >
            {audioPlayer.isPlaying ? (
              <img src="/pause.png" alt="Pause" />
            ) : (
              <img src="/play.png" alt="Play" />
            )}
          </div>
          {audioPlayer.isLoading && (
            <div className="audio-loading">Chargement...</div>
          )}
          {audioPlayer.error && (
            <div className="audio-error">{audioPlayer.error}</div>
          )}
          <div
            className="nextStation"
            onClick={playNextStation}
            aria-hidden="true"
          >
            <img src="/suivant.png" alt="suivant" />
          </div>
        </div>
        <div className="radio-selection">
          <div className="radio-selection-favicon">
            <LazyImage 
              src={currentStation.favicon} 
              alt="favicon"
              className="favicon"
            />
          </div>
          <p>{currentStation.name}</p>
        </div>
        <div className="container-url-radio">
          <a
            className="url-radio"
            href={currentStation.homepage}
            target="_blank"
            rel="noreferrer"
          >
            Découvre le site de la radio
          </a>
        </div>
      </div>
      {/* L'audio est maintenant géré par le hook useAudioPlayer */}
    </div>
  );
}

RadioPlayer.propTypes = {
  stations: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      favicon: PropTypes.string.isRequired,
      homepage: PropTypes.string,
    })
  ).isRequired,
  audioPlayer: PropTypes.object.isRequired,
  currentStationIndex: PropTypes.number.isRequired,
  toggleAudio: PropTypes.func.isRequired,
  playNextStation: PropTypes.func.isRequired,
  playPreviousStation: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default RadioPlayer;
