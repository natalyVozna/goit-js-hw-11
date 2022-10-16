export default class NewsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  fetchArticles() {
    const KEY_AUTH = '30593721-3615c14b1fd526cc46c7cd9ff';
    console.log('class', this.searchQuery);
    const url = `https://pixabay.com/api/?key=${KEY_AUTH}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`;

    return fetch(url)
      .then(response => response.json())
      .then(data => {
        this.page += 1;

        return data.hits;
      });
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
