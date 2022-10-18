import NewsApiService from './js/news-servise.js';
import createPhotoCard from './js/photo-card.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import LoadMoreBtn from './js/load-more-btn.js';
import { Notify } from 'notiflix';

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

async function onSearch(e) {
  e.preventDefault();
  newsApiService.query = e.target.elements.searchQuery.value.trim();

  if (newsApiService.query === '') {
    refs.galleryContainer.innerHTML = '';
    loadMoreBtn.hide();
    return Notify.warning('Please, tipe somuthing');
  }

  clearArticlesMarkup();
  newsApiService.resetPage();

  try {
    const { hits, totalHits } = await newsApiService.fetchArticles();
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
  } catch (error) {
    Notify.failure('Qui timide rogat docet negare');
  }
}

async function loadMoreArticles() {
  loadMoreBtn.disable();

  try {
    const { hits } = await newsApiService.fetchArticles();
    newsApiService.countQuery += hits.length;
    if (hits.length === 0) {
      loadMoreBtn.hide();
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    setTimeout(() => fetchArticles(hits), 1500);
    gallery.refresh();
  } catch (error) {
    Notify.failure('Qui timide rogat docet negare');
  }
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
  return newsApiService.totalQuery - newsApiService.countQuery > 0;
}
