import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

function LazyImage({ src, alt, className, fallback = "/radio-fallback.svg" }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <img
      ref={imgRef}
      className={className}
      src={isInView ? (hasError ? fallback : src) : fallback}
      alt={alt}
      onLoad={handleLoad}
      onError={handleError}
      style={{
        opacity: isLoaded ? 1 : 0,
        transition: "opacity 0.3s ease"
      }}
    />
  );
}

LazyImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  fallback: PropTypes.string
};

export default LazyImage;