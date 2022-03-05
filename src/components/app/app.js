import React, { Component } from 'react';
import { Pagination, Tabs } from 'antd';

import 'antd/dist/antd.css';
import './app.css';

import MovieList from '../movie-list';
import Search from '../search';
import MoviesService from '../../services/movies-service';

export default class App extends Component {
  Info = new MoviesService();

  state = {
    listInfo: [],
    listRated: [],
    ratedInfo: {
      current: 1,
      total_pages: 1,
      loading: false,
      error: false,
    },
    searchInfo: {
      current: 1,
      total_pages: 1,
      loading: true,
      error: false,
    },
  };

  componentDidMount() {
    this.Info.guestSession();
    this.movieSearch('return');
  }

  onChange(page) {
    this.setState(({ searchInfo }) => {
      const newObject = { ...searchInfo };
      newObject.current = page;
      newObject.loading = true;
      this.movieSearch(searchInfo.searchText, page);
      return {
        listInfo: [],
        searchInfo: newObject,
      };
    });
  }

  onChangeRated(page) {
    this.setState(({ ratedInfo }) => {
      const newObject = { ...ratedInfo };
      newObject.current = page;
      newObject.loading = true;
      this.ratedMoviesList(page);
      return {
        listRated: [],
        ratedInfo: newObject,
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

  getServiceInfo(text, body) {
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

  movieSearch = async (text, page = 1) => {
    try {
      return await this.Info.getSearchMovies(text, page).then(async (body) => {
        const list = await this.createMovieList(body.results);
        const result = await this.getServiceInfo(text, body);
        this.setState(() => ({
          listInfo: list,
          searchInfo: result,
        }));
      });
    } catch {
      return this.onError();
    }
  };

  inputOnChange = (event) => {
    event.preventDefault();
    const text = event.target.value ? event.target.value : 'return';
    return this.movieSearch(text);
  };

  changeRated = async (value, id) => {
    if (value === 0) return;
    this.setState(({ listInfo, ratedInfo }) => {
      const newArray = [...listInfo];
      const newObject = { ...ratedInfo };
      const idx = newArray.findIndex((el) => el.id === id);
      newArray[idx].rating = value;
      newObject.loading = true;
      return {
        listInfo: newArray,
      };
    });
    await this.Info.postRatedMovies(id, value);
    await this.ratedMoviesList();
  };

  ratedMoviesList = async (page = 1) => {
    let list;
    let result;
    await this.Info.getRatedMovies(page).then(async (array) => {
      list = await this.createMovieList(array.results);
      result = await this.getServiceInfo('', array);
    });
    this.setState(() => ({
      listRated: list,
      ratedInfo: result,
    }));
  };

  createMovieList(array) {
    const urlImage = 'https://image.tmdb.org/t/p/w500';
    const stateArray = [];
    const newArray = [...array];

    newArray.forEach((el) => {
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
      };
      const { listRated } = this.state;
      const idx = listRated.findIndex((element) => element.id === newObject.id);
      if (idx >= 0) newObject.rating = listRated[idx].rating;
      stateArray.push(newObject);
    });
    return stateArray;
  }

  render() {
    const {
      listInfo, searchInfo, listRated, ratedInfo,
    } = this.state;
    const { TabPane } = Tabs;
    const searchPaginData = !(searchInfo.loading || searchInfo.error) && searchInfo.total_result;
    const ratedPaginData = !(ratedInfo.loading || ratedInfo.error) && ratedInfo.total_result;
    const searchPagination = searchPaginData ? (
      <Pagination
        className="pagination"
        current={searchInfo.current}
        onChange={(page) => this.onChange(page)}
        total={searchInfo.total_result}
      />
    ) : null;
    const ratedPagination = ratedPaginData ? (
      <Pagination
        className="pagination"
        current={ratedInfo.current}
        onChange={(page) => this.onChangeRated(page)}
        total={ratedInfo.total_result}
        pageSize={20}
      />
    ) : null;
    return (
      <Tabs defaultActiveKey="1">
        <TabPane tab="Search" key="1">
          <Search
            searchText={searchInfo.searchText}
            inputOnChange={(event) => this.inputOnChange(event)}
          />
          <MovieList
            listInfo={listInfo}
            loading={searchInfo.loading}
            error={searchInfo.error}
            totalResult={searchInfo.total_result}
            changeRated={this.changeRated}
          />
          {searchPagination}
        </TabPane>
        <TabPane tab="Rated" key="2">
          <MovieList
            listInfo={listRated}
            loading={ratedInfo.loading}
            error={ratedInfo.error}
            totalResult={ratedInfo.total_result}
          />
          {ratedPagination}
        </TabPane>
      </Tabs>
    );
  }
}
