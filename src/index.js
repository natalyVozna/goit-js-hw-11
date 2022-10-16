import axios from 'axios';
import NewsApiService from './js/news-servise';
import createPhotoCard from './js/photo-card';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const options = {
  headers: {
    Authorization: '30593721-3615c14b1fd526cc46c7cd9ff',
  },
};

const refs = {
  serchForm: document.querySelector('.search-form'),
  galleryContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const newsApiService = new NewsApiService();

refs.serchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();

  clearArticlesMarkup();
  newsApiService.query = e.target.elements.searchQuery.value.trim();
  newsApiService.resetPage();
  newsApiService.fetchArticles().then(appendArticlesMarkup);
  // axios.get(url).then(console.log);
}

function onLoadMore() {
  newsApiService.fetchArticles().then(appendArticlesMarkup);
}

function appendArticlesMarkup(articles) {
  const markup = articles.map(article => createPhotoCard(article)).join('');
  refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
  new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
}

function clearArticlesMarkup() {
  refs.galleryContainer.innerHTML = '';
}

console.log('SimpleLightb', gallery);
