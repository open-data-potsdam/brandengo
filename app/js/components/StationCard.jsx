import PropTypes from 'prop-types';
import React from 'react';

import { replaceWithDefault } from './../util';
import DepartureRow from './DepartureRow';
import Loading from './Loading';

const StationCard = ({ errorMessage, station, departures, isFetching }) => {
  let departureTable;

  if (departures && departures.length) {
    departureTable = (
      <table>
        <thead>
          <tr>
            <th>Line</th>
            <th>Destination</th>
            <th>Departure</th>
          </tr>
        </thead>
        <tbody>
          {departures.map(x => (
            <DepartureRow key={x.trip + x.when} departure={x} />
          ))}
        </tbody>
      </table>
    );
  }

  let error;
  if (errorMessage) {
    error = <p>Error: {errorMessage}</p>;
  }

  console.log('isFetching', isFetching);
  let loader;
  if (isFetching) {
    loader = <Loading message={'is Fetching'} />;
  }

  return (
    <div className="station-card">
      <img
        onError={replaceWithDefault.bind(this)}
        src={`img/stations/${station.id}.jpg`}
        alt="Station"
      />
      <h2 className="station-name">{station.name}</h2>
      {error}
      {loader}
      {departureTable}
    </div>
  );

  // return (
  //   <div>
  //     <h2>{station.name}</h2>
  //     <p>Currently no departures</p>
  //   </div>
  // );
};

StationCard.propTypes = {
  departures: PropTypes.array.isRequired,
  errorMessage: PropTypes.string,
  station: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default StationCard;
