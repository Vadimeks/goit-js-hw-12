// Імпартуем функцыі для HTTP-запытаў
import { getImagesByQuery } from './js/pixabay-api';
// Імпартуем функцыі для адлюстравання UI і кіравання лоадером/кнопкай
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions';
// Імпартуем iziToast для апавяшчэнняў і яго стылі
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// Атрымліваем спасылкі на DOM-элементы
const searchForm = document.querySelector('.search-form');
const searchInput = searchForm.querySelector('input[name="search-text"]');
const loadMoreButton = document.querySelector('.load-more-button');
const gallery = document.querySelector('.gallery'); // Спасылка на галерэю для пракруткі

// Глабальныя зменныя для кіравання станам пагінацыі і пошуку
let currentPage = 1; // Бягучы нумар старонкі, пачынаем з 1
let currentQuery = ''; // Захоўваем бягучы пошукавы запыт
const perPage = 15; // Колькасць малюнкаў на старонку, як патрабуецца задачай

// ============================================================================
// Апрацоўшчык падзей для адпраўкі формы пошуку
// ============================================================================
searchForm.addEventListener('submit', async event => {
  event.preventDefault(); // Прадухіляем стандартную адпраўку формы (перазагрузку старонкі)

  currentQuery = searchInput.value.trim(); // Атрымліваем і ачышчаем пошукавы запыт
  currentPage = 1; // Скідваем нумар старонкі да 1 пры новым пошуку

  clearGallery(); // Ачышчаем галерэю ад папярэдніх вынікаў
  hideLoadMoreButton(); // Хаваем кнопку "Загрузіць больш"
  showLoader(); // Паказваем лоадер

  // Праверка на пусты пошукавы запыт
  if (!currentQuery) {
    iziToast.warning({
      title: 'Папярэджанне',
      message: 'Калі ласка, увядзіце пошукавы запыт.',
      position: 'topRight',
    });
    hideLoader(); // Хаваем лоадер, бо запыт не адпраўляўся
    searchForm.reset(); // Ачышчаем форму
    return; // Спыняем выкананне функцыі
  }

  try {
    // Выконваем HTTP-запыт для атрымання малюнкаў
    const data = await getImagesByQuery(currentQuery, currentPage);
    hideLoader(); // Хаваем лоадер пасля атрымання адказу

    // Праверка, ці былі знойдзены малюнкі
    if (data.hits.length > 0) {
      createGallery(data.hits); // Ствараем галерэю з атрыманых малюнкаў

      // Праверка, ці ёсць яшчэ малюнкі для загрузкі (для паказу кнопкі "Загрузіць больш")
      if (data.totalHits > perPage) {
        showLoadMoreButton(); // Паказваем кнопку "Загрузіць больш"
      } else {
        // Калі ўсе малюнкі змешчаны на першай старонцы, паказваем паведамленне пра канец вынікаў
        iziToast.info({
          message: 'Мы шкадуем, але вы дасягнулі канца вынікаў пошуку.',
          position: 'bottomCenter',
        });
      }
    } else {
      // Калі па запыце нічога не знойдзена
      iziToast.info({
        title: 'Інфармацыя',
        message:
          'На жаль, няма малюнкаў, якія адпавядаюць вашаму пошукаваму запыту. Калі ласка, паспрабуйце яшчэ раз!',
        position: 'topRight',
      });
    }
  } catch (error) {
    // Апрацоўка памылак HTTP-запыту
    hideLoader();
    iziToast.error({
      title: 'Памылка',
      message:
        'Не атрымалася загрузіць малюнкі. Калі ласка, паспрабуйце пазней.',
      position: 'topRight',
    });
    console.error(error); // Выводзім памылку ў кансоль для адладкі
  } finally {
    searchForm.reset(); // Ачышчаем форму пошуку незалежна ад выніку
  }
});

// ============================================================================
// Апрацоўшчык падзей для кнопкі "Загрузіць больш"
// ============================================================================
loadMoreButton.addEventListener('click', async () => {
  currentPage += 1; // Павялічваем нумар старонкі для наступнага запыту
  showLoader(); // Паказваем лоадер

  try {
    // Выконваем HTTP-запыт для атрымання наступнай порцыі малюнкаў
    const data = await getImagesByQuery(currentQuery, currentPage);
    hideLoader(); // Хаваем лоадер

    createGallery(data.hits, true); // Дадаем новыя малюнкі да існуючых (append=true)

    // Плыўная пракрутка старонкі на дзве вышыні карткі галерэі
    const firstGalleryItem = gallery.querySelector('.gallery-item');
    if (firstGalleryItem) {
      const { height: cardHeight } = firstGalleryItem.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2, // Пракручваем на дзве вышыні карткі
        behavior: 'smooth', // Плыўная анімацыя пракруткі
      });
    }

    // Праверка, ці ёсць яшчэ малюнкі для загрузкі
    // Вылічваем колькасць ужо загружаных малюнкаў
    const loadedImagesCount = currentPage * perPage;
    // Калі колькасць загружаных малюнкаў дасягнула або перавысіла агульную колькасць вынікаў
    if (loadedImagesCount >= data.totalHits) {
      hideLoadMoreButton(); // Хаваем кнопку, бо больш няма чаго загружаць
      iziToast.info({
        message: 'Мы шкадуем, але вы дасягнулі канца вынікаў пошуку.',
        position: 'bottomCenter',
      });
    }
  } catch (error) {
    // Апрацоўка памылак пры загрузцы дадатковых малюнкаў
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
