import axios from 'axios'; // Імпартуем бібліятэку axios для HTTP-запытаў

// Ваш асабісты ключ Pixabay API. Заменіце яго на свой, калі ён іншы.
const API_KEY = '50377156-76a0d970257c0a39042cd42de';
const BASE_URL = 'https://pixabay.com/api/'; // Базавы URL для Pixabay API

/**
 * Ажыццяўляе HTTP-запыт да Pixabay API для атрымання малюнкаў.
 * Выкарыстоўвае async/await для асінхроннай працы.
 * @param {string} query - Пошуковае слова.
 * @param {number} page - Нумар старонкі для пагінацыі. Па змаўчанні 1.
 * @returns {Promise<object>} - Аб'ект з дадзенымі адказу (data), які змяшчае масіў hits і totalHits.
 * @throws {Error} - Выкідвае памылку, калі запыт не атрымаўся.
 */
export async function getImagesByQuery(query, page = 1) {
  try {
    const response = await axios.get(`${BASE_URL}`, {
      params: {
        key: API_KEY, // Ваш API-ключ
        q: query, // Пошукавы запыт
        image_type: 'photo', // Толькі фота
        orientation: 'horizontal', // Гарызантальная арыентацыя
        safesearch: true, // Бяспечны пошук
        per_page: 15, // Колькасць малюнкаў на старонку (УЖО ЎСТАЛЯВАНА НА 15)
        page: page, // Бягучы нумар старонкі
      },
    });
    return response.data; // Вяртаем усе дадзеныя адказу, уключаючы hits і totalHits
  } catch (error) {
    console.error('Error fetching images:', error); // Выводзім памылку ў кансоль
    throw error; // Перадаем памылку далей для апрацоўкі ў main.js
  }
}
