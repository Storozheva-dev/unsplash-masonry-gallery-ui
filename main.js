import { getImagesByQuery, getRandomImages } from './js/unsplash.js';
import {
  renderGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreBtn,
  hideLoadMoreBtn,
  disableLoadMoreBtn,
  enableLoadMoreBtn,
} from './js/renderGallery.js';

const gallery = document.querySelector('.gallery-container');
const form = document.querySelector('.form');
const input = document.querySelector('[name="search-text"]');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.load-more');

let currentQuery = '';
let currentPage = 1;
const PER_PAGE = 24;
let isRandomMode = true; 

Notiflix.Notify.init({
  position: 'right-top',
  timeout: 3000,
  clickToClose: true,
  fontSize: '16px',
});

function smoothScrollAfterLoad() {
  requestAnimationFrame(() => {
    const firstItem = gallery.firstElementChild;
    if (!firstItem) return;

    const { height: cardHeight } = firstItem.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  showLoader();

  try {
    const randomImages = await getRandomImages();
    renderGallery(randomImages, true);
    showLoadMoreBtn();
    isRandomMode = true; 
  } catch (error) {
    Notiflix.Notify.failure('Error loading random images.');
  } finally {
    hideLoader();
  }
});

hideLoadMoreBtn();

form.addEventListener('submit', async function (event) {
  event.preventDefault();
  const inputValue = input.value.trim();

  if (inputValue === '') {
    Notiflix.Notify.warning('You forgot important data');
    return;
  }

  currentQuery = inputValue;
  currentPage = 1;
  isRandomMode = false; 

  clearGallery();
  showLoader();
  hideLoadMoreBtn();

  try {
    const res = await getImagesByQuery(currentQuery, currentPage);

    if (res.length === 0) {
      Notiflix.Notify.warning('Sorry, no images matching your search query.');
      return;
    }

    renderGallery(res, true);
    showLoadMoreBtn();
    enableLoadMoreBtn();
    currentPage++;
  } catch (error) {
    Notiflix.Notify.failure('Error fetching images.');
  } finally {
    hideLoader();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  disableLoadMoreBtn();
  showLoader();

  try {
    let res;

    if (isRandomMode) {
      res = await getRandomImages(); 
    } else {
      res = await getImagesByQuery(currentQuery, currentPage);
    }

    if (!res || res.length === 0) {
      Notiflix.Notify.info('No more images to load.');
      hideLoadMoreBtn();
      return;
    }

    renderGallery(res);
    smoothScrollAfterLoad();

    if (!isRandomMode && res.length < PER_PAGE) {
      Notiflix.Notify.info('You’ve reached the end of the results.');
      hideLoadMoreBtn();
      return;
    }

    showLoadMoreBtn();
    enableLoadMoreBtn();
    if (!isRandomMode) currentPage++;
  } catch (error) {
    Notiflix.Notify.failure('Could not load more images');
  } finally {
    hideLoader();
  }
});
