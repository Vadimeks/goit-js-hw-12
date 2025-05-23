import { getImagesByQuery } from './js/pixabay-api';

import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const searchForm = document.querySelector('.search-form');
const searchInput = searchForm.querySelector('input[name="search-text"]');
const loadMoreButton = document.querySelector('.load-more-button');
const gallery = document.querySelector('.gallery');

let currentPage = 1;
let currentQuery = '';
const perPage = 15;

searchForm.addEventListener('submit', async event => {
  event.preventDefault();

  currentQuery = searchInput.value.trim();
  currentPage = 1;

  clearGallery();
  hideLoadMoreButton();
  showLoader();

  if (!currentQuery) {
    iziToast.warning({
      title: 'Папярэджанне',
      message: 'Калі ласка, увядзіце пошукавы запыт.',
      position: 'topRight',
    });
    hideLoader();
    searchForm.reset();
    return;
  }

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    hideLoader();

    if (data.hits.length > 0) {
      createGallery(data.hits);

      if (data.totalHits > perPage) {
        showLoadMoreButton();
      } else {
        iziToast.info({
          message: 'This is the End.',
          position: 'bottomCenter',
        });
      }
    } else {
      iziToast.info({
        title: 'Інфармацыя',
        message:
          'На жаль, няма малюнкаў, якія адпавядаюць вашаму пошукаваму запыту. Калі ласка, паспрабуйце яшчэ раз!',
        position: 'topRight',
      });
    }
  } catch (error) {
    hideLoader();
    iziToast.error({
      title: 'Памылка',
      message:
        'Не атрымалася загрузіць малюнкі. Калі ласка, паспрабуйце пазней.',
      position: 'topRight',
    });
    console.error(error);
  } finally {
    searchForm.reset();
  }
});

loadMoreButton.addEventListener('click', async () => {
  currentPage += 1;
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    hideLoader();

    createGallery(data.hits, true);

    const firstGalleryItem = gallery.querySelector('.gallery-item');
    if (firstGalleryItem) {
      const { height: cardHeight } = firstGalleryItem.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }

    const loadedImagesCount = currentPage * perPage;
    if (loadedImagesCount >= data.totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        message: 'Мы шкадуем, але вы дасягнулі канца вынікаў пошуку.',
        position: 'bottomCenter',
      });
    }
  } catch (error) {
    hideLoader();
    iziToast.error({
      title: 'Памылка',
      message:
        'Не атрымалася загрузіць больш малюнкаў. Калі ласка, паспрабуйце пазней.',
      position: 'topRight',
    });
    console.error(error);
  }
});
