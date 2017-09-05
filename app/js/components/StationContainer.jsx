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
      options: {
        maxMinutesToDeparture: 30,
      },
      position: {
        latitude: null,
        longitude: null,
      },
      loadingMessage: null,
      errorMessage: null,
      currentIndex: null,
      nStationsWithFetchedDepartes: 0,
      stations: [], // lazy loading
      stationIds: [], // all possible stations
    };
    this.hammerjsElement = new Hammer(document);
    this.requestOptions = buildRequestOptions();

    this.swipeRight = this.swipeRight.bind(this);
    this.swipeLeft = this.swipeLeft.bind(this);
  }

  componentDidMount() {
    this.getLocation.bind(this).call();
    this.interval = setInterval(this.getLocation.bind(this), 1000 * 60 * 5);

    // subscribe to touch events
    this.hammerjsElement.on('swipeleft', this.swipeLeft);
    this.hammerjsElement.on('swiperight', this.swipeRight);
  }

  getLocation() {
    function successfullyLocated(location) {
      const position = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      this.setState({
        position,
        loadingMessage: 'Fetching Departures',
      });
      this.fetchStations();
    }

    function failedLocated(error) {
      this.setState({
        loadingMessage: null,
        errorMessage: `Something went wrong while getting your current GPS location: ${error}`,
      });
    }

    if (navigator.geolocation) {
      this.setState({ loadingMessage: 'Getting Geolocation' });
      navigator.geolocation.getCurrentPosition(
        successfullyLocated.bind(this),
        failedLocated.bind(this)
      );
    } else {
      this.setState({
        loadingMessage: null,
        errorMessage: 'Geolocation is not supported by this browser',
      });
    }
  }

  swipeLeft(event) {
    console.log(this);
    event.preventDefault();
    const {
      currentIndex,
      stations,
      stationIds,
      nStationsWithFetchedDepartes,
    } = this.state;

    if (currentIndex >= stationIds.length - 1) return; // abort when end reached

    if (nStationsWithFetchedDepartes - currentIndex <= initialNStations) {
      this.fetchDepartures(
        stationIds[nStationsWithFetchedDepartes]
      ).then(newStation => {
        this.setState({
          currentIndex: currentIndex + 1,
          nStationsWithFetchedDepartes: nStationsWithFetchedDepartes + 1,
          stations: [...stations, newStation],
        });
      });
    } else {
      this.setState({
        currentIndex: currentIndex + 1,
      });
    }
  }

  swipeRight(event) {
    event.preventDefault();
    const { currentIndex } = this.state;
    const newIndex = Math.max(0, currentIndex - 1);
    this.setState({ currentIndex: newIndex });
  }

  // Scroll Into View
  // componentDidUpdate() {
  //   ReactDOM.findDOMNode(this).scrollIntoView();
  // }

  fetchStations() {
    const { longitude, latitude } = this.state.position;
    const urlWithLocation = `${baseUrl}/stations/nearby?latitude=${latitude}&longitude=${longitude}&results=${maxNStations}`;

    fetch(urlWithLocation, this.requestOptions)
      .then(r => (r.ok ? r.json() : Promise.reject(r)))
      .then(stationsWithoutDepartures => {
        const stationIds = stationsWithoutDepartures.map(x => x.id);
        const initialStations = stationsWithoutDepartures.slice(
          0,
          initialNStations
        );
        Promise.all(initialStations.map(this.fetchDepartures.bind(this)))
          .then(stations => {
            this.setState({
              currentIndex: 0,
              nStationsWithFetchedDepartes: initialNStations,
              stations,
              stationIds,
              loadingMessage: null,
            });
          })
          .catch(err => console.log(err));
      });
  }

  fetchDepartures(station) {
    const { maxMinutesToDeparture } = this.state.options;
    const urlWithId = `${baseUrl}/stations/${station.id}/departures?duration=${maxMinutesToDeparture}`;

    return new Promise((resolve, reject) => {
      fetch(urlWithId, this.requestOptions)
        .then(
          r =>
            r.ok
              ? r.json()
              : resolve({
                  station,
                  departures: [],
                  errorMessage:
                    'There was an error while fetching departes for this station.',
                })
        )
        .then(departures => {
          const departuresSorted = departures.sort((a, b) => a.when - b.when);
          resolve({
            station,
            departures: departuresSorted,
            errorMessage: null,
          });
        });
    });
  }

  render() {
    const { stations, currentIndex, loadingMessage, errorMessage } = this.state;
    if (errorMessage) {
      return <h2>Error: {errorMessage}</h2>;
    }

    if (loadingMessage) {
      return <Loading message={loadingMessage} />;
    }

    if (stations.length > 0) {
      const currentStation = stations[currentIndex];
      return (
        <StationCard
          ref={c => (this.stationDiv = c)}
          key={currentStation.station.name}
          departures={currentStation.departures}
          station={currentStation.station}
          errorMessage={currentStation.errorMessage}
        />
      );
    } else {
      return <h2>No Stations Nearby</h2>;
    }
  }
}
