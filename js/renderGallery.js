const loader = document.querySelector('.loader');
const gallery = document.querySelector('.gallery-grid');
const loadMoreBtn = document.querySelector('.load-more');


let msnry;
function initMasonry() {
  msnry = new Masonry(gallery, {
    itemSelector: '.grid-item',
    columnWidth: '.grid-sizer',
    percentPosition: true,
    gutter: 10,
  });
}

export function renderGallery(images, isFirstLoad = false) {
  if (!images.length) {
    hideLoader();
    hideLoadMoreBtn();
    iziToast.info({
      title: 'Oops!',
      message: 'No images found.',
      position: 'topRight',
    });
    return;

  }

  if (isFirstLoad) {
    clearGallery();
  }

  const shouldInsertSizer = isFirstLoad || gallery.querySelectorAll('.grid-sizer').length === 0;
  const sizerMarkup = shouldInsertSizer ? '<div class="grid-sizer"></div>' : '';

  const markup = sizerMarkup + images
    .map(({ urls, alt_description }) => `
      <div class="grid-item">
      <a data-fancybox="gallery" data-src="${urls.full}" data-caption="${alt_description || 'Photo'}" href="javascript:;">
  <img src="${urls.regular}" alt="${alt_description || 'Photo'}" loading="lazy" />
</a>
      </div>`)
    .join('');
    
  gallery.insertAdjacentHTML('beforeend', markup);
  
  
  
  imagesLoaded(gallery, () => {
    if (!msnry) {
      initMasonry();
    } else {
      msnry.reloadItems();
      msnry.layout();
      setTimeout(() => msnry.layout(), 100);
    }

  });

  gallery.classList.remove('is-hidden');
  hideLoader();
  
}

export function clearGallery() {
  const items = gallery.querySelectorAll('.grid-item');
  items.forEach(item => item.remove());

  if (msnry) {
    msnry.destroy();
    msnry = null;
  }
}

export function showLoader() {
  loader.classList.remove('is-hidden');
}
export function hideLoader() {
  loader.classList.add('is-hidden');
}
export function showLoadMoreBtn() {
  loadMoreBtn.classList.remove('is-hidden');
}
export function hideLoadMoreBtn() {
  loadMoreBtn.classList.add('is-hidden');
}
export function disableLoadMoreBtn() {
  loadMoreBtn.disabled = true;
}
export function enableLoadMoreBtn() {
  loadMoreBtn.disabled = false;
}
