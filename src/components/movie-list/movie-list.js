import React from 'react';
import PropTypes from 'prop-types';
import './movie-list.css';

import { Spin, Alert } from 'antd';
import Movie from '../movie';

function MovieList({
  listInfo, loading, error, totalResult, changeRated,
}) {
  const createLi = listInfo.map((element) => (

    <Movie
      loading={loading}
      element={element}
      key={element.id}
      changeRated={changeRated}
    />
  ));
  const hasData = !(loading || error) && totalResult;
  const noResult = !(loading || error) && !totalResult;
  const err = error ? <Alert className="alert-error" message="Fetch Error" type="error" /> : null;
  const spinner = loading ? <Spin className="card-spinner" tip="Loading..." size="large" /> : null;
  const content = hasData ? <ul className="card-list">{createLi}</ul> : null;
  const noResults = noResult ? <Alert className="alert-error" message="No result" type="error" /> : null;
  return (
    <>
      {spinner}
      {content}
      {err}
      {noResults}
    </>
  );
}

MovieList.defaultProps = {
  listInfo: [],
  loading: true,
  error: false,
  totalResult: 0,
  changeRated: () => {},
};

MovieList.propTypes = {
  listInfo: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  error: PropTypes.bool,
  totalResult: PropTypes.number,
  changeRated: PropTypes.func,
};

export default MovieList;
