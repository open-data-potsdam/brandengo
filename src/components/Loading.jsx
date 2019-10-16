import React from 'react';
import PropTypes from 'prop-types';

const Loading = ({ message }) => (
  <div className="loading">
    <div className="circle" />
    <h2 className="message">{message}</h2>
  </div>
);

Loading.propTypes = {
  message: PropTypes.string.isRequired,
};

export default Loading;
