import React from 'react';
import ReactDOM from 'react-dom';

import Onboarding from './components/Onboarding';

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<Onboarding />, document.getElementById('stationContainer'));
});
