import radioService from "./radioService";

async function getDataCountry() {
  try {
    return await radioService.getCountries();
  } catch (error) {
    console.error("Erreur lors de la récupération des pays:", error);
    return [];
  }
}

export default getDataCountry;
