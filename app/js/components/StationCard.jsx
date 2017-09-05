import React from 'react';
import PropTypes from 'prop-types';

import { replaceWithDefault } from './../util';
import DepartureRow from './DepartureRow';

const StationCard = ({ errorMessage, station, departures }) => {
  if (errorMessage) {
    return (
      <div>
        <h2>{station.name}</h2>
        <p>Error: {errorMessage}</p>
      </div>
    );
  }

  if (departures.length) {
    return (
      <div className="station-card">
        <img
          onError={replaceWithDefault.bind(this)}
          src={`img/stations/${station.id}.jpg`}
          alt="Station Picture"
        />
        <h2 className="station-name">{station.name}</h2>
        <table>
          <thead>
            <tr>
              <th>Line</th>
              <th>Destination</th>
              <th>Departure</th>
            </tr>
          </thead>
          <tbody>{departures.map(x => <DepartureRow departure={x} />)}</tbody>
        </table>
      </div>
    );
  }

  return (
    <div>
      <h2>{station.name}</h2>
      <p>Currently no departures</p>
    </div>
  );
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
