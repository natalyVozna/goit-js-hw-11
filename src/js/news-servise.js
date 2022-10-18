import axios from 'axios';

export default class NewsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.totalQuery = 0;
    this.countQuery = 0;
  }

  async fetchArticles() {
    const KEY_AUTH = '30593721-3615c14b1fd526cc46c7cd9ff';
    const url = `https://pixabay.com/api/?key=${KEY_AUTH}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`;

    const response = await axios.get(url);
    this.page += 1;
    const data = await response.data;

    return data;
  }

  // fetchArticles() {
  //   const KEY_AUTH = '30593721-3615c14b1fd526cc46c7cd9ff';
  //   const url = `https://pixabay.com/api/?key=${KEY_AUTH}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`;

  //   return axios.get(url).then(res => {
  //     this.page += 1;

  //     return res.data;
  //   });
  // }

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
