import React, { Component } from 'react';
import { Pagination, Tabs } from 'antd';

import 'antd/dist/antd.min.css';
import './app.css';

import MovieList from '../movie-list';
import Search from '../search';
import MoviesService from '../../services/movies-service';

export default class App extends Component {
  Info = new MoviesService();

  state = {
    listInfo: [],
    searchInfo: {
      current: 1,
      total_pages: 1,
      loading: true,
      error: false,
    },
    activeTab: 1,
  };

  componentDidMount() {
    this.Info.guestSession();
    this.genresKey();
    this.getMovieList('return');
  }

  onChange(page) {
    this.setState(({ searchInfo, activeTab }) => {
      const newObject = { ...searchInfo };
      newObject.current = page;
      newObject.loading = true;
      if (activeTab) this.getMovieList(newObject.searchText, page);
      else this.getRatedMovieList(page);
      return {
        listInfo: [],
        searchInfo: newObject,
      };
    });
  }

  onError() {
    this.setState(({ searchInfo }) => {
      const newObject = { ...searchInfo };
      newObject.error = true;
      newObject.loading = false;
      return {
        searchInfo: newObject,
      };
    });
  }
  /* eslint-disable */
  getServiceInfo(body, text = this.state.searchInfo.searchText) {
    const newInfo = {
      searchText: `${text}`,
      current: body.page,
      total_pages: body.total_pages,
      total_result: body.total_results,
      loading: false,
      error: false,
    };
    return newInfo;
  }

  getMovieList = async (text, page = 1) => {
    try {
      return await this.Info.getSearchMovies(text, page).then(async (body) => {
        const list = await this.createMovieList(body.results);
        const result = await this.getServiceInfo(body, text);
        this.setState(() => ({
          listInfo: list,
          searchInfo: result,
          activeTab: 1,
        }));
      });
    } catch {
      return this.onError();
    }
  };

  inputOnChange = (event) => {
    event.preventDefault();
    const text = event.target.value ? event.target.value : 'return';
    return this.getMovieList(text);
  };

  changeRated = async (value, id) => {
    if (value === 0) return;
    this.setState(({ listInfo }) => {
      const newArray = [...listInfo];
      const idx = newArray.findIndex((el) => el.id === id);
      newArray[idx].rating = value;
      return {
        listInfo: newArray,
      };
    });
    await this.Info.postRatedMovies(id, value);
  };

  getRatedMovieList = async (page = 1) => {
    await this.Info.getRatedMovies(page).then(async (array) => {
      const list = await this.createMovieList(array.results);
      const result = await this.getServiceInfo(array);
      this.setState(() => ({
        listInfo: list,
        searchInfo: result,
        activeTab: 0,
      }));
    });
  };

  genresKey() {
    return this.Info.getGenres().then((res) => { this.genres = Object.values(res); });
  }

  genresArrayToString(array = [], result = []) {
    if (array.length) {
      this.genres[0].forEach((el) => {
        if (el.id === array[0]) {
          result.push(el.name);
          array.shift();
          return this.genresArrayToString(array, result);
        }
        return null;
      });
    }
    return result;
  }

  clearInput() {
    this.setState(({ searchInfo }) => {
      const newObject = { ...searchInfo };
      newObject.searchText = '';
      return {
        searchInfo: newObject,
      };
    });
  }

  createMovieList(array) {
    const urlImage = 'https://image.tmdb.org/t/p/w500';
    const stateArray = [];
    array.forEach((el) => {
      const newObject = {
        title: el.title,
        overview: el.overview,
        photo1: el.poster_path ? `${urlImage}${el.poster_path}` : null,
        photo2: el.backdrop_path,
        release_date: el.release_date,
        popularity: el.popularity,
        id: el.id,
        stars: el.vote_average,
        rating: el.rating,
        genres: this.genresArrayToString(el.genre_ids),
      };
      stateArray.push(newObject);
    });
    return stateArray;
  }

  render() {
    const { listInfo, searchInfo } = this.state;
    const ratedList = (
      <>
        <MovieList
          listInfo={listInfo}
          loading={searchInfo.loading}
          error={searchInfo.error}
          totalResult={searchInfo.total_result}
          changeRated={this.changeRated}
        />
        <Pagination
          className="pagination"
          current={searchInfo.current}
          onChange={(page) => this.onChange(page)}
          total={searchInfo.total_result}
          defaultPageSize={20}
          pageSizeOptions={[20]}
        />
      </>
    );
    const searchList = (
      <>
        <Search
          clearInput={() => this.clearInput}
          inputOnChange={(event) => this.inputOnChange(event)}
        />
        {ratedList}
      </>
    );
    const searchPaginData = !(searchInfo.loading || searchInfo.error) && !!searchInfo.total_result;

    return (
      <Tabs
        defaultActiveKey="1"
        onChange={(activeKey) => {
          if (!searchInfo.total_result) {
            const newObject = { ...searchInfo };
            newObject.loading = true;
            this.setState({ searchInfo: newObject });
          }
          return +activeKey ? this.getMovieList(searchInfo.searchText || 'return')
            : this.getRatedMovieList();
        }}
      >
        <Tabs.TabPane tab="Search" key="1">{searchList || searchPaginData}</Tabs.TabPane>
        <Tabs.TabPane tab="Rated" key="0">{ratedList || searchPaginData}</Tabs.TabPane>
      </Tabs>
    );
  }
}
