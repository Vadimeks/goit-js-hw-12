import axios from 'axios';

const API_KEY = '50377156-76a0d970257c0a39042cd42de';
const BASE_URL = 'https://pixabay.com/api/';

// Delay for spiner (for testing only)
// function delay(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

export async function getImagesByQuery(query) {
  try {
    // await delay(2000);

    const response = await axios.get(`${BASE_URL}`, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
}
