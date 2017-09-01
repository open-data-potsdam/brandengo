import React from 'react';

import { replaceWithDefault } from './../util';
import Departure from './Departure';

export default class Station extends React.Component {
  render() {
    if (this.props.departures.length) {
      return (
        <div className="station">
          <img
            onError={replaceWithDefault.bind(this)}
            src={`img/stations/${this.props.station.id}.jpg`}
            alt="Station Picture"
          />
          <h2>{this.props.station.name}</h2>
          <table>
            <thead>
              <tr>
                <th>Line</th>
                <th>Destination</th>
                <th>Departure</th>
              </tr>
            </thead>
            <tbody>
              {this.props.departures.map(x => <Departure departure={x} />)}
            </tbody>
          </table>
        </div>
      );
    } else {
      if (this.props.error !== '') {
        return (
          <div>
            <h2>{this.props.station.name}</h2>
            <p>Error: {this.props.error}</p>
          </div>
        );
      } else {
        return (
          <div>
            <h2>{this.props.station.name}</h2>
            <p>Currently no departures</p>
          </div>
        );
      }
    }
  }
}
