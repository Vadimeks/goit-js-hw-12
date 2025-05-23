import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryContainer = document.querySelector('.gallery');
const loaderContainer = document.querySelector('.loader-container');
const loadMoreButton = document.querySelector('.load-more-button');

let lightboxInstance = null;

export function createGallery(images, append = false) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
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
    .join('');

  if (append) {
    galleryContainer.insertAdjacentHTML('beforeend', markup);
    if (lightboxInstance) {
      lightboxInstance.refresh();
    }
  } else {
    galleryContainer.innerHTML = markup;
    if (lightboxInstance) {
      lightboxInstance.destroy();
    }
    lightboxInstance = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
  }
}

export function clearGallery() {
  galleryContainer.innerHTML = '';
  if (lightboxInstance) {
    lightboxInstance.destroy();
    lightboxInstance = null;
  }
}

export function showLoader() {
  loaderContainer.classList.add('is-loading');
}

export function hideLoader() {
  loaderContainer.classList.remove('is-loading');
}

export function showLoadMoreButton() {
  loadMoreButton.classList.remove('is-hidden');
}

export function hideLoadMoreButton() {
  loadMoreButton.classList.add('is-hidden');
}
