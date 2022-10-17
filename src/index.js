import NewsApiService from './js/news-servise.js';
import createPhotoCard from './js/photo-card.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import LoadMoreBtn from './js/load-more-btn.js';
import { Notify } from 'notiflix';

const options = {
  headers: {
    Authorization: '30593721-3615c14b1fd526cc46c7cd9ff',
  },
};

const refs = {
  serchForm: document.querySelector('.search-form'),
  galleryContainer: document.querySelector('.gallery'),
  searchBtn: document.querySelector('.search-btn'),
  loadMoreBtn: document.querySelector('.load-more'),
};
const loadMoreBtn = new LoadMoreBtn({
  selector: 'button.load-more',
  hidden: true,
});
const newsApiService = new NewsApiService();
let gallery;
let cardHeight = 0;

refs.serchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', loadMoreArticles);

// loadMoreBtn.hide();

function onSearch(e) {
  e.preventDefault();

  newsApiService.query = e.target.elements.searchQuery.value.trim();
  if (newsApiService.query === '') {
    refs.galleryContainer.innerHTML = '';
    loadMoreBtn.hide();
    return Notify.warning('Please, tipe somuthing');
  }

  clearArticlesMarkup();
  newsApiService.resetPage();

  // loadMoreBtn.show();
  // loadMoreBtn.disable();
  newsApiService
    .fetchArticles()
    .then(({ hits, totalHits }) => {
      newsApiService.totalQuery = totalHits;
      newsApiService.countQuery = hits.length;

      if (hits.length === 0) {
        loadMoreBtn.hide();

        return Notify.warning(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        loadMoreBtn.show();
        loadMoreBtn.disable();
        Notify.success(`Hooray! We found ${totalHits} images.`);
        fetchArticles(hits);
      }
    })
    .catch(error => Notify.failure('Qui timide rogat docet negare'));
}

function loadMoreArticles() {
  loadMoreBtn.disable();
  newsApiService
    .fetchArticles()
    .then(({ hits }) => {
      newsApiService.countQuery += hits.length;
      if (hits.length === 0) {
        loadMoreBtn.hide();
        return Notify.warning(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      fetchArticles(hits);
      gallery.refresh();
    })
    .catch(error => Notify.failure('Qui timide rogat docet negare'));
}

function fetchArticles(hits) {
  appendArticlesMarkup(hits);
  cardHeight = document
    .querySelector('.gallery')
    .firstElementChild?.getBoundingClientRect().height;

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });

  if (isLoadMore()) {
    loadMoreBtn.enable();
  } else {
    loadMoreBtn.hide();
    Notify.warning(
      `We're sorry, but you've reached the end of search results.`
    );
  }
}

function appendArticlesMarkup(articles) {
  const markup = articles.map(article => createPhotoCard(article)).join('');
  refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
  gallery = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
}

function clearArticlesMarkup() {
  refs.galleryContainer.innerHTML = '';
}

function isLoadMore() {
  console.log(
    'isLoad',
    newsApiService.totalQuery - newsApiService.countQuery,
    newsApiService.totalQuery,
    newsApiService.countQuery
  );
  return newsApiService.totalQuery - newsApiService.countQuery > 0;
}
