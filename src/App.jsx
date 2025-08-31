import React, { useEffect, useState, useMemo, useCallback } from "react";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import DisplayRadio from "./components/DisplayRadio";
import radioService from "./services/radioService";
import { useAudioPlayer } from "./hooks/useAudioPlayer";
import { useDebounce } from "./hooks/useDebounce";

function App() {
  const [stations, setStations] = useState([]);
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [styleSearchValue, setStyleSearchValue] = useState("");
  const [countrySearchValue, setCountrySearchValue] = useState("");
  const [isVisible, setIsVisible] = useState(0);
  const [error, setError] = useState(null);

  const audioPlayer = useAudioPlayer();

  const debouncedSearch = useDebounce(searchValue, 300);
  const debouncedStyle = useDebounce(styleSearchValue, 300);
  const debouncedCountry = useDebounce(countrySearchValue, 300);

  const filteredRadio = useMemo(() => {
    if (!stations.length) return [];

    return stations.filter((radio) => {
      const nameMatch =
        !debouncedSearch ||
        radio.name.toLowerCase().includes(debouncedSearch.toLowerCase());
      const styleMatch =
        !debouncedStyle ||
        radio.tags.toLowerCase().includes(debouncedStyle.toLowerCase());
      const countryMatch =
        !debouncedCountry ||
        radio.country.toLowerCase().includes(debouncedCountry.toLowerCase());

      return nameMatch && styleMatch && countryMatch;
    });
  }, [stations, debouncedSearch, debouncedStyle, debouncedCountry]);

  useEffect(() => {
    const loadStations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const stationsData = await radioService.getOptimizedStations();
        setStations(stationsData);
      } catch (err) {
        setError("Erreur lors du chargement des stations");
      } finally {
        setIsLoading(false);
      }
    };

    loadStations();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      audioPlayer.stop();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      audioPlayer.stop();
    };
  }, []);

  const toggleAudio = useCallback(() => {
    if (filteredRadio.length > 0 && filteredRadio[currentStationIndex]) {
      const station = filteredRadio[currentStationIndex];
      audioPlayer.toggle(station.url);
    }
  }, [audioPlayer, filteredRadio, currentStationIndex]);

  const playNextStation = useCallback(() => {
    if (filteredRadio.length === 0) return;

    const nextIndex =
      currentStationIndex < filteredRadio.length - 1
        ? currentStationIndex + 1
        : 0;

    setCurrentStationIndex(nextIndex);
    audioPlayer.play(filteredRadio[nextIndex].url);
  }, [currentStationIndex, filteredRadio, audioPlayer]);

  const playPreviousStation = useCallback(() => {
    if (filteredRadio.length === 0) return;

    const prevIndex =
      currentStationIndex > 0
        ? currentStationIndex - 1
        : filteredRadio.length - 1;

    setCurrentStationIndex(prevIndex);
    audioPlayer.play(filteredRadio[prevIndex].url);
  }, [currentStationIndex, filteredRadio, audioPlayer]);

  return (
    <div className="main">
      <NavBar
        setSearchValue={setSearchValue}
        setStyleSearchValue={setStyleSearchValue}
        setCountrySearchValue={setCountrySearchValue}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
      />
      {isLoading && (
        <div className="container-loading-logo">
          <img src="/Radio_World.png" alt="logo" className="loadingLogo" />
        </div>
      )}
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <div>
        <DisplayRadio
          filteredRadio={filteredRadio}
          toggleAudio={toggleAudio}
          audioPlayer={audioPlayer}
          currentStationIndex={currentStationIndex}
          playPreviousStation={playPreviousStation}
          playNextStation={playNextStation}
          setCurrentStationIndex={setCurrentStationIndex}
          isLoading={isLoading}
          searchValue={searchValue}
          styleSearchValue={styleSearchValue}
          countrySearchValue={countrySearchValue}
          setSearchValue={setSearchValue}
          setStyleSearchValue={setStyleSearchValue}
          setCountrySearchValue={setCountrySearchValue}
          isVisible={isVisible}
          setIsVisible={setIsVisible}
        />
      </div>
      <Footer />
    </div>
  );
}

export default App;
