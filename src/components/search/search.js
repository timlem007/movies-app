import React from 'react';
import PropTypes from 'prop-types';
import './search.css';
import debounce from 'lodash.debounce';

import { Input } from 'antd';

function Search({ inputOnChange }) {
  // const [value, setValue] = useState('');
  // // useEffect(() => () => setValue(''));

  // const onChange = (event) => {
  //   event.preventDefault();
  //   setValue(event.target.value);
  //   // inputOnChange();
  // };
  return (
    <Input
      className="search-form"
      type="text"
      onChange={debounce(inputOnChange, 800)}
      placeholder="Type to search..."
    />
  );
}

Search.defaultProps = {
  inputOnChange: () => {},
  // clearInput: () => {},
};

Search.propTypes = {
  inputOnChange: PropTypes.func,
  // clearInput: PropTypes.func,
};

export default Search;
