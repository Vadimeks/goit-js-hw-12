import SimpleLightbox from 'simplelightbox'; // Імпартуем бібліятэку SimpleLightbox
import 'simplelightbox/dist/simple-lightbox.min.css'; // Імпартуем стылі SimpleLightbox

// Атрымліваем спасылкі на DOM-элементы
const galleryContainer = document.querySelector('.gallery');
const loaderContainer = document.querySelector('.loader-container');
const loadMoreButton = document.querySelector('.load-more-button');

let lightboxInstance = null; // Зменная для захоўвання экзэмпляра SimpleLightbox, назва зменена для яснасці

/**
 * Стварае HTML-разметку для галерэі малюнкаў і дадае яе ў DOM.
 * Ініцыялізуе або абнаўляе SimpleLightbox.
 * @param {Array<object>} images - Масіў аб'ектаў малюнкаў з Pixabay API.
 * @param {boolean} [append=false] - Калі true, дадае новыя выявы да існуючых.
 * Калі false, ачышчае галерэю перад даданнем.
 */
export function createGallery(images, append = false) {
  // Ствараем HTML-разметку для кожнага малюнка
  const markup = images
    .map(
      ({
        webformatURL, // URL маленькай версіі выявы
        largeImageURL, // URL вялікай версіі выявы для SimpleLightbox
        tags, // Тэгі (выкарыстоўваюцца як alt-тэкст)
        likes, // Колькасць лайкаў
        views, // Колькасць праглядаў
        comments, // Колькасць каментароў
        downloads, // Колькасць загрузак
      }) => `
            <li class="gallery-item">
                <a href="${largeImageURL}">
                    <img class="gallery-image" src="${webformatURL}" alt="${tags}" loading="lazy" />
                    <div class="info">
                        <p class="info-item"><b>Likes</b> ${likes}</p>
                        <p class="info-item"><b>Views</b> ${views}</p>
                        <p class="info-item"><b>Comments</b> ${comments}</p>
                        <p class="info-item"><b>Downloads</b> ${downloads}</p>
                    </div>
                </a>
            </li>
        `
    )
    .join(''); // Аб'ядноўваем усе радкі ў адзін вялікі радок HTML

  if (append) {
    // Калі append=true, дадаем разметку ў канец існуючай галерэі
    galleryContainer.insertAdjacentHTML('beforeend', markup);
    // Калі SimpleLightbox ужо ініцыялізаваны, абнаўляем яго
    if (lightboxInstance) {
      lightboxInstance.refresh();
    }
  } else {
    // Калі append=false, замяняем усю існуючую разметку новай
    galleryContainer.innerHTML = markup;
    // Паколькі мы цалкам замянілі HTML, трэба пераініцыялізаваць SimpleLightbox
    // Спачатку знішчаем стары экзэмпляр, калі ён ёсць
    if (lightboxInstance) {
      lightboxInstance.destroy();
    }
    // Затым ствараем новы экзэмпляр SimpleLightbox
    lightboxInstance = new SimpleLightbox('.gallery a', {
      captionsData: 'alt', // Выкарыстоўваем атрыбут alt выявы для подпісу ў лайтбоксе
      captionDelay: 250, // Затрымка перад з'яўленнем подпісу
    });
  }
}

/**
 * Ачышчае змесціва кантэйнера галерэі.
 * Таксама знішчае экзэмпляр SimpleLightbox, каб прадухіліць праблемы
 * пры наступнай ініцыялізацыі.
 */
export function clearGallery() {
  galleryContainer.innerHTML = '';
  // Калі экзэмпляр SimpleLightbox існуе, знішчаем яго
  if (lightboxInstance) {
    lightboxInstance.destroy(); // Выклікаем метад destroy() для ачысткі SimpleLightbox
    lightboxInstance = null; // Скідваем зменную, каб яна была null для наступнай ініцыялізацыі
  }
}

/**
 * Паказвае лоадер, дадаючы клас 'is-loading'.
 */
export function showLoader() {
  loaderContainer.classList.add('is-loading');
}

/**
 * Хавае лоадер, прыбіраючы клас 'is-loading'.
 */
export function hideLoader() {
  loaderContainer.classList.remove('is-loading');
}

/**
 * Паказвае кнопку "Загрузіць больш", прыбіраючы клас 'is-hidden'.
 */
export function showLoadMoreButton() {
  loadMoreButton.classList.remove('is-hidden');
}

/**
 * Хавае кнопку "Загрузіць больш", дадаючы клас 'is-hidden'.
 */
export function hideLoadMoreButton() {
  loadMoreButton.classList.add('is-hidden');
}
