import React from 'react';
import ReactDOM from 'react-dom';

import StationContainer from './components/StationContainer';

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <StationContainer />,
    document.getElementById('stationContainer')
  );
});
