import { useState, useRef, useEffect, useCallback } from "react";

export const useAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);
  const currentUrlRef = useRef(null);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "none";
    audioRef.current = audio;

    const handleCanPlay = () => {
      setIsLoading(false);
      setError(null);
    };

    const handleError = () => {
      setIsLoading(false);
      setError("Station temporairement indisponible");
      setIsPlaying(false);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      setError(null);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleError);
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
      audio.src = "";
    };
  }, []);

  const play = useCallback(async (url) => {
    if (!audioRef.current || !url) {
      return;
    }

    if (currentUrlRef.current === url && !audioRef.current.paused) {
      return;
    }

    try {
      const audio = audioRef.current;
      
      if (!audio.paused) {
        audio.pause();
      }

      currentUrlRef.current = url;
      setError(null);

      audio.src = url;
      await audio.play();
    } catch (error) {
      setIsPlaying(false);
      setIsLoading(false);
      
      if (error.name === 'NotAllowedError') {
        setError("Cliquez pour autoriser la lecture audio");
      } else if (error.name === 'NotSupportedError') {
        setError("Format audio non supporté");
      } else {
        setError("Station temporairement indisponible");
      }
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      currentUrlRef.current = null;
      setIsPlaying(false);
      setIsLoading(false);
      setError(null);
    }
  }, []);

  const toggle = useCallback((url) => {
    if (isPlaying && currentUrlRef.current === url) {
      pause();
    } else {
      play(url);
    }
  }, [isPlaying, play, pause]);

  return {
    isPlaying,
    isLoading,
    error,
    play,
    pause,
    stop,
    toggle,
    currentUrl: currentUrlRef.current
  };
};