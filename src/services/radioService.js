import axios from "axios";

const BASE_URL = "https://de1.api.radio-browser.info/json";
const CACHE_KEY = "radio_stations_cache";
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

class RadioService {
  constructor() {
    this.cache = this.loadFromCache();
  }

  loadFromCache() {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          return data;
        }
      }
    } catch (error) {
      console.warn("Cache loading failed:", error);
    }
    return null;
  }

  saveToCache(data) {
    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.warn("Cache saving failed:", error);
    }
  }

  async getOptimizedStations(limit = 500) {
    if (this.cache) {
      return this.cache;
    }

    try {
      const response = await axios.get(`${BASE_URL}/stations/search`, {
        params: {
          limit: 2000,
          has_extended_info: true,
          codec: "MP3",
          is_https: true,
          order: "clickcount",
          reverse: true,
        },
      });

      const filteredStations = this.filterValidStations(response.data, limit);
      this.saveToCache(filteredStations);
      return filteredStations;
    } catch (error) {
      console.error("Erreur lors de la récupération des stations:", error);
      throw error;
    }
  }

  filterValidStations(stations, limit) {
    const validStations = [];
    const seenNames = new Set();
    const seenUUIDs = new Set();

    // Domaines connus pour avoir moins de problèmes CORS
    const corsFreeDomains = [
      "stream.radiojar.com",
      "ice.radio-canada.ca",
      "live.franceinter.fr",
      "direct.franceinfo.fr",
      "chai5she.cdn.dvmr.fr",
      "streaming.radio.co",
      "stream.rcs.revma.com",
    ];

    // Trier les stations : d'abord celles avec des domaines CORS-friendly
    const sortedStations = stations.sort((a, b) => {
      const urlA = a.url_resolved || a.url || "";
      const urlB = b.url_resolved || b.url || "";

      const aHasFriendlyDomain = corsFreeDomains.some((domain) =>
        urlA.includes(domain)
      );
      const bHasFriendlyDomain = corsFreeDomains.some((domain) =>
        urlB.includes(domain)
      );

      if (aHasFriendlyDomain && !bHasFriendlyDomain) return -1;
      if (!aHasFriendlyDomain && bHasFriendlyDomain) return 1;
      return 0;
    });

    for (const station of sortedStations) {
      if (validStations.length >= limit) break;

      const finalUrl = station.url_resolved || station.url;
      
      // Validation d'URL plus stricte
      let hasValidUrl = false;
      try {
        if (finalUrl && typeof finalUrl === 'string') {
          const urlObj = new URL(finalUrl);
          hasValidUrl = (urlObj.protocol === 'https:' || urlObj.protocol === 'http:') && 
                       urlObj.hostname && 
                       urlObj.hostname.length > 0;
        }
      } catch (e) {
        hasValidUrl = false;
      }

      // Éviter les domaines connus pour avoir des problèmes CORS
      const problematicDomains = [
        "icecast.walmradio.com",
        "stream.zeno.fm",
        "listen.radioking.com",
      ];

      const hasProblematicDomain = problematicDomains.some((domain) =>
        finalUrl?.includes(domain)
      );

      if (
        station.name &&
        station.name.trim().length > 0 &&
        station.stationuuid &&
        station.codec === "MP3" &&
        hasValidUrl &&
        finalUrl &&
        finalUrl.length > 10 && // URL minimum valide
        !hasProblematicDomain &&
        !seenNames.has(station.name) &&
        !seenUUIDs.has(station.stationuuid)
      ) {
        seenNames.add(station.name);
        seenUUIDs.add(station.stationuuid);

        const isCORSFriendly = corsFreeDomains.some((domain) =>
          finalUrl.includes(domain)
        );

        validStations.push({
          ...station,
          url: finalUrl,
          tags: station.tags || "",
          country: station.country || "",
          corsFreindly: isCORSFriendly,
        });
      }
    }

    return validStations;
  }

  async getCountries() {
    try {
      const response = await axios.get(`${BASE_URL}/countries`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des pays:", error);
      return [];
    }
  }

  async getTags() {
    try {
      const response = await axios.get(`${BASE_URL}/tags`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des tags:", error);
      return [];
    }
  }

  clearCache() {
    localStorage.removeItem(CACHE_KEY);
    this.cache = null;
  }
}

export default new RadioService();