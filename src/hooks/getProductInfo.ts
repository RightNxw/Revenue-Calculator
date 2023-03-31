import axios from "axios";

async function getProductInfo(asin: string, countryCode: string) {
  console.log(asin, countryCode);
  const url = `/api?asin=${asin}&countryCode=${countryCode}`;

  try {
    const response = await axios.get(url, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching product data:", error);
    return null;
  }
}

export default getProductInfo;
