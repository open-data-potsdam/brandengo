import React from 'react';
import ReactDOM from 'react-dom';

import StationBox from './components/StationBox';

const baseUrl = 'https://vbb.transport.rest';
const maxNStations = 50; // FIXME: Looks like the cap is at 35
const initialNStations = 2;

$(function() {
  ReactDOM.render(<StationBox />, document.getElementById('stationBox'));
});
