import Hammer from 'hammerjs';
import React from 'react';
import ReactDOM from 'react-dom';

import { buildRequestOptions } from './../util';
import StationCard from './StationCard';
import Loading from './Loading';

const baseUrl = 'https://vbb.transport.rest';
const maxNStations = 50; // FIXME: Looks like the cap is at 35
const initialNStations = 2;

export default class StationContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maxMinutesToDeparture: 30,
      currentFocus: null,
      latitude: null,
      longitude: null,
      loadingMessage: null,
    };
    this.hammerjsElement = new Hammer(document);
    this.stations = [];
    this.stationsWithInfo = [];
    this.requestOptions = buildRequestOptions();
  }

  componentDidMount() {
    this.getLocation.bind(this).call();
    this.interval = setInterval(this.getLocation.bind(this), 1000 * 60 * 5);

    // subscribe to events
    this.hammerjsElement.on('swipeleft', e => {
      e.preventDefault();
      const n = this.stationsWithInfo.length; // number of avaible station+infos
      this.fetchDepartures(this.stations[n]).then(newStationInfo =>
        this.stationsWithInfo.push(newStationInfo)
      );
      this.setState({ currentFocus: this.state.currentFocus + 1 });
    });

    this.hammerjsElement.on('swiperight', e => {
      e.preventDefault();
      const newfocus = Math.max(0, this.state.currentFocus - 1);
      this.setState({ currentFocus: newfocus });
    });
  }

  componentDidUpdate() {
    ReactDOM.findDOMNode(this).scrollIntoView();
  }

  getLocation() {
    function successfullyLocated(location) {
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;
      this.setState({
        latitude,
        longitude,
        loadingMessage: 'Fetching Departures',
      });
      this.fetchStations();
    }

    function failedLocated(error) {
      console.log('failed location');
    }

    if (navigator.geolocation) {
      this.setState({ loadingMessage: 'Getting Geolocation' });
      navigator.geolocation.getCurrentPosition(
        successfullyLocated.bind(this),
        failedLocated
      );
    } else {
      alert('Geolocation is not supported by this browser');
    }
  }

  fetchStations() {
    const urlWithLocation = `${baseUrl}/stations/nearby?latitude=${this.state
      .latitude}&longitude=${this.state.longitude}&results=${maxNStations}`;

    fetch(urlWithLocation, this.requestOptions)
      .then(r => (r.ok ? r.json() : Promise.reject(r)))
      .then(stationsWithoutDepartures => {
        this.stations = stationsWithoutDepartures;
        const initialStations = stationsWithoutDepartures.slice(
          0,
          initialNStations
        );
        Promise.all(initialStations.map(this.fetchDepartures.bind(this)))
          .then(stations => {
            this.stationsWithInfo = stations;
            this.setState({ currentFocus: 0 });
          })
          .catch(err => console.log(err));
      });
  }

  fetchDepartures(station) {
    const urlWithId = `${baseUrl}/stations/${station.id}/departures?duration=${this
      .state.maxMinutesToDeparture}`;

    return new Promise((resolve, reject) => {
      fetch(urlWithId, this.requestOptions)
        .then(
          r =>
            r.ok
              ? r.json()
              : resolve({
                  station,
                  departures: [],
                  error: 'with get Departure',
                })
        )
        .then(departures => {
          const departuresSorted = departures.sort((a, b) => a.when - b.when);
          resolve({ station, departures: departuresSorted, error: '' });
        });
    });
  }

  render() {
    if (this.stationsWithInfo.length > 0) {
      const currentStation = this.stationsWithInfo[this.state.currentFocus];
      return (
        <StationCard
          ref={c => (this.stationDiv = c)}
          key={currentStation.station.name}
          departures={currentStation.departures}
          station={currentStation.station}
          error={currentStation.error}
        />
      );
    }

    if (this.state.loadingMessage) {
      return <Loading message={this.state.loadingMessage} />;
    }

    if (this.stationsWithInfo.length === 0) {
      return <h2>Error</h2>;
    }

    return null;
  }
}
