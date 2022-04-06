import React from 'react';
import PropTypes from 'prop-types';
import './movie-list.css';

import { Spin, Alert } from 'antd';
import Movie from '../movie';

function MovieList({
  listInfo, loading, error, totalResult, changeRated,
}) {
  const createLi = listInfo.map((element) => (
    <Movie loading={loading} element={element} key={element.id} changeRated={changeRated} />
  ));

  if (!(loading || error) && totalResult) return <ul className="card-list">{createLi}</ul>;
  if (!(loading || error) && !totalResult) return <Alert className="alert-error" message="No result" type="error" />;
  if (loading) return <Spin className="card-spinner" tip="Loading..." size="large" />;
  if (error) return <Alert className="alert-error" message="Fetch Error" type="error" />;
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
