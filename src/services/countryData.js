import axios from "axios";

const BASE_URL = "https://de1.api.radio-browser.info/json/countries";

async function getDataCountry() {
  return axios
    .get(BASE_URL)
    .then((response) => response.data)
    .catch((error) => console.error(error));
}

export default getDataCountry;
