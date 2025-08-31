const ALLOWED_PROTOCOLS = ['https:', 'http:'];
const MAX_URL_LENGTH = 500;
const MAX_NAME_LENGTH = 100;

const BLOCKED_DOMAINS = [
  'malicious-domain.com',
  'spam-radio.net'
];

export const validateUrl = (url) => {
  if (!url || typeof url !== 'string' || url.length > MAX_URL_LENGTH) {
    return false;
  }

  try {
    const urlObj = new URL(url);
    
    if (!ALLOWED_PROTOCOLS.includes(urlObj.protocol)) {
      return false;
    }

    if (BLOCKED_DOMAINS.some(domain => urlObj.hostname.includes(domain))) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

export const sanitizeText = (text) => {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  return text
    .slice(0, MAX_NAME_LENGTH)
    .replace(/[<>\"'&]/g, '')
    .trim();
};

export const validateStationData = (station) => {
  return (
    station &&
    typeof station === 'object' &&
    sanitizeText(station.name) &&
    validateUrl(station.url) &&
    station.stationuuid &&
    typeof station.stationuuid === 'string'
  );
};