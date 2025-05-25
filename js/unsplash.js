const API_KEY = 'Zi6DTPcXUfUIZWPZKtHOdAP7hohCQmfWztbsrai3NyI';
const BASE_URL = 'https://api.unsplash.com/';

const PER_PAGE = 24;

export async function getImagesByQuery(query, page = 1) {
  const params = new URLSearchParams({
    query,
    page,
    per_page: PER_PAGE,
    client_id: API_KEY,
  });

  try {
    const response = await fetch(`${BASE_URL}search/photos?${params}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    iziToast.error({
        title: 'Error',
        message: 'Error searching images',
        position: 'topRight',
    });
    throw error;
  }
}

export async function getRandomImages(count = PER_PAGE) {
  const params = new URLSearchParams({
    count,
    client_id: API_KEY,
  });

  try {
    const response = await fetch(`${BASE_URL}photos/random?${params}`);
    const data = await response.json();
    return data; 
  } catch (error) {
    iziToast.error({
    title: 'Error',
    message: 'Error fetching random images',
    position: 'topRight',
    });
    throw error;
  }
}












