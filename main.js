import { getImagesByQuery, getRandomImages } from './js/unsplash.js';
import { renderGallery, clearGallery, showLoader, hideLoader, showLoadMoreBtn, hideLoadMoreBtn, disableLoadMoreBtn, enableLoadMoreBtn } from './js/renderGallery.js';




const gallery = document.querySelector('.gallery-container');
const form = document.querySelector('.form');
const input = document.querySelector('[name="search-text"]');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.load-more');

Notiflix.Notify.init({
  position: 'right-top',
  timeout: 3000,
  clickToClose: true,
  fontSize: '16px',
});


function smoothScrollAfterLoad() {
    const firstItem = gallery.firstElementChild;
    if (!firstItem) return;
  
    const { height: cardHeight } = firstItem.getBoundingClientRect();
  
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }


document.addEventListener('DOMContentLoaded', async () => {
    showLoader();
  
    try {
      const randomImages = await getRandomImages();
      renderGallery(randomImages, true);
    } catch (error) {
      console.error('Error loading random images:', error);
    } finally {
      hideLoader();
    }
  });




let currentQuery = '';
let currentPage = 1;
const PER_PAGE = 24;

hideLoadMoreBtn();

form.addEventListener('submit', async function (event) {
  event.preventDefault();
  const inputValue = input.value.trim();

  if (inputValue === '') {
    iziToast.warning({
      title: 'Caution',
      message: 'You forgot important data',
    });
    return;
  }

  currentQuery = inputValue;
  currentPage = 1;

  clearGallery();
  showLoader();
  hideLoadMoreBtn();

  try {
    const res = await getImagesByQuery(currentQuery, currentPage);
    console.log('Search results:', res);

    if (res.length === 0) {
      iziToast.warning({
        title: 'Caution',
        message: 'Sorry, no images matching your search query.',
      });
      return;
    }

    renderGallery(res, true);

    showLoadMoreBtn();
    enableLoadMoreBtn(); // 🟢 Включаем кнопку

    currentPage++;
  } catch (error) {
    console.error('Error: ', error);
    iziToast.error({
      title: 'Error',
      message: 'Error fetching images.',
    });
  } finally {
    hideLoader();
  }
});


loadMoreBtn.addEventListener('click', async () => {
  disableLoadMoreBtn(); // 🔒 Блокируем кнопку
  showLoader();

  try {
    const res = await getImagesByQuery(currentQuery, currentPage);
    console.log('More results:', res);

    if (res.length === 0) {
      iziToast.info({
        title: 'Info',
        message: 'No more images to load.',
      });
      hideLoadMoreBtn();
      return;
    }

    renderGallery(res); 
    smoothScrollAfterLoad();

    showLoadMoreBtn(); // На всякий случай
    enableLoadMoreBtn(); // 🔓 Разблокируем кнопку

    currentPage++; 
  } catch (error) {
    console.error('Error: ', error);
    iziToast.error({
      title: 'Error',
      message: 'Could not load more images',
    });
  } finally {
    hideLoader();
  }
});










