import React from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';

import './movie.css';

import {
  Tag, Rate, Spin, Alert,
} from 'antd';

function Movie({ element, loading, changeRated }) {
  let tagsId = 100000;
  let date = element.release_date;
  let cardImage = <img className="card-img" alt="title" src={element.photo1} />;

  if (element.photo1 === null) {
    cardImage = <Alert className="card-img-error" message={element.title} type="error" />;
  }
  if (element.release_date === new Date()) {
    date = format(new Date(element.release_date), 'MMMM d, yyyy');
  }

  let elementStarsColor;

  if (element.stars >= 0 && element.stars < 3) elementStarsColor = '#E90000';
  if (element.stars >= 3 && element.stars < 5) elementStarsColor = '#E97E00';
  if (element.stars >= 5 && element.stars < 7) elementStarsColor = '#E9D100';
  if (element.stars >= 7) elementStarsColor = '#66E900';

  let result = '';
  let string = '';
  function updateText(width, higth, text = '') {
    const newText = text.split(' ');
    const elem = `${newText.shift()} `;

    if (result.split('\n').length <= higth && text) {
      if ((elem.length + string.length) < width) {
        string += elem;
        updateText(width, higth, newText.join(' '));
      } else {
        if (result.split('\n').length === higth || !text) {
          result += `${string}...`;
          return result;
        }
        result += `${string}\n`;
        string = elem;
        updateText(width, higth, newText.join(' '));
      }
    } else {
      result += string;
    }
    return result;
  }

  const tags = !element.genres.length ? null
    : element.genres.map((el) => {
      tagsId += 1;
      return <Tag key={tagsId}>{el}</Tag>;
    });

  const cardList = (
    <>
      {cardImage}
      <section className="card-info">
        <section className="card-info__header">
          <p className="card-info__header__name">{element.title}</p>
          <p
            className="card-info__header__stars"
            style={{ border: `2px solid ${elementStarsColor}` }}
          >
            {element.stars}
          </p>
        </section>
        <p className="card-info__body info__date">{date}</p>
        <div className="card-info__body">{tags}</div>
        <p className="card-info__body info__overview">
          {updateText(35, 5, element.overview)}
        </p>
        <Rate
          className="card-info__body info__rate"
          defaultValue={0}
          value={element.rating}
          count={10}
          onChange={(value) => changeRated(value, element.id)}
        />
      </section>
    </>
  );
  const spinner = loading ? <Spin className="card-spinner" tip="Loading..." size="large" /> : null;
  const content = !loading ? cardList : null;

  return (
    <li className="card">
      {content}
      {spinner}
    </li>
  );
}

Movie.defaultProps = {
  element: {
    title: null,
    overview: null,
    photo1: null,
    photo2: null,
    release_date: null,
    popularity: null,
    id: null,
    stars: null,
    rating: 0,
    genres: [],
  },
  loading: true,
  changeRated: () => {},
};

Movie.propTypes = {
  element: PropTypes.shape({
    title: PropTypes.string,
    overview: PropTypes.string,
    photo1: PropTypes.string,
    photo2: PropTypes.string,
    release_date: PropTypes.string,
    popularity: PropTypes.number,
    id: PropTypes.number,
    stars: PropTypes.number,
    rating: PropTypes.number,
    genres: PropTypes.arrayOf(PropTypes.string),
  }),
  loading: PropTypes.bool,
  changeRated: PropTypes.func,
};

export default Movie;
