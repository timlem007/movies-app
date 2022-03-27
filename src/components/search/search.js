import React from 'react';
import PropTypes from 'prop-types';
import './search.css';
import debounce from 'lodash.debounce';

import { Input } from 'antd';

function Search({ inputOnChange }) {
  return (
    <Input
      className="search-form"
      type="text"
      onChange={debounce(inputOnChange, 800)}
      placeholder="Type to search..."
    />
  );
}

Search.defaultProps = { inputOnChange: () => {} };

Search.propTypes = { inputOnChange: PropTypes.func };

export default Search;
