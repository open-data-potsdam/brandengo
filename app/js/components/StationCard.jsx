import PropTypes from 'prop-types';
import React from 'react';

import { replaceWithDefault } from './../util';
import DepartureRow from './DepartureRow';
import Loading from './Loading';

const StationCard = ({ station }) => {
  const { errorMessage, information, departures, isFetching } = station;
  let departuresView;

  if (departures && departures.length) {
    departuresView = (
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Line</th>
            <th>Destination</th>
            <th>Departure</th>
          </tr>
        </thead>
        <tbody>
          {departures.map((x, i) => <DepartureRow key={i} departure={x} />)}
        </tbody>
      </table>
    );
  } else if (!isFetching && !errorMessage) {
    departuresView = <p>No departures to show</p>;
  }

  let error;
  if (errorMessage) {
    error = <p>Error: {errorMessage}</p>;
  }

  let loader;
  if (isFetching) {
    loader = <Loading message={'Fetching Departures'} />;
  }

  return (
    <div className="station-card">
      <img
        onError={replaceWithDefault.bind(this)}
        src={`img/stations/${information.id}.jpg`}
        alt="Station"
      />
      <h2 className="station-name">{information.name}</h2>
      {error}
      {loader}
      {departuresView}
    </div>
  );
};

StationCard.propTypes = {
  station: PropTypes.shape({
    departures: PropTypes.array,
    errorMessage: PropTypes.string,
    information: PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

export default StationCard;
