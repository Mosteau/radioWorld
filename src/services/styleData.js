import radioService from "./radioService";

async function getStyleData() {
  try {
    return await radioService.getTags();
  } catch (error) {
    console.error("Erreur lors de la récupération des tags:", error);
    return [];
  }
}

export default getStyleData;
