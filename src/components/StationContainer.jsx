import Hammer from "hammerjs";
import React from "react";

import Loading from "./Loading";
import StationCard from "./StationCard";
import { Mobilitybox } from '../Mobilitybox';

const mobilitybox = new Mobilitybox("enter-your-key-here");
const initialNumStations = 2;

export default class StationContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: {
        maxMinutesToDeparture: 30
      },
      position: {
        latitude: null,
        longitude: null
      },
      loadingMessage: null,
      errorMessage: null,
      currentIndex: null,
      nStationsWithFetchedDepartes: 0,
      stations: [] // lazy loading
    };
    this.hammerjsElement = new Hammer(document);

    this.swipeRight = this.swipeRight.bind(this);
    this.swipeLeft = this.swipeLeft.bind(this);
  }

  componentDidMount() {
    this.getLocation.bind(this).call();
    this.interval = setInterval(this.getLocation.bind(this), 1000 * 60 * 5);

    // subscribe to touch events
    this.hammerjsElement.on("swipeleft", this.swipeLeft);
    this.hammerjsElement.on("swiperight", this.swipeRight);

    mobilitybox.get_attributions(attributions => {
      document.getElementById("attributions").innerHTML = attributions.html;
    })
  }

  getLocation() {
    function successfullyLocated(location) {
      const position = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      };
      this.setState({
        position,
        loadingMessage: "Fetching Departures"
      });
      this.fetchStations();
    }

    function failedLocated(error) {
      this.setState({
        loadingMessage: null,
        errorMessage: `Something went wrong while getting your current GPS location: ${error.message}`
      });
    }

    if (navigator.geolocation) {
      this.setState({ loadingMessage: "Getting Geolocation" });
      navigator.geolocation.getCurrentPosition(
        successfullyLocated.bind(this),
        failedLocated.bind(this)
      );
    } else {
      this.setState({
        loadingMessage: null,
        errorMessage: "Geolocation is not supported by this browser"
      });
    }
  }

  swipeLeft(event) {
    event.preventDefault();
    const { currentIndex, stations, nStationsWithFetchedDepartes } = this.state;

    if (currentIndex >= stations.length - 1) return; // abort when end reached

    if (nStationsWithFetchedDepartes - currentIndex <= initialNumStations) {
      this.fetchDepartures(nStationsWithFetchedDepartes);
    }

    this.setState({
      currentIndex: currentIndex + 1
    });
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
    mobilitybox.find_stations_by_position(this.state.position, mobilitybox_stations => {
      const stations = mobilitybox_stations.map(x => ({
        information: x,
        departures: null,
        errorMessage: null,
        isFetching: false
      }));

      this.setState({
        currentIndex: 0,
        stations,
        loadingMessage: null
      })

      let i = 0;
      while (i < initialNumStations && i < stations.length) {
        this.fetchDepartures(i++);
      }
    });
  }

  fetchDepartures(positionInStations) {
    this.setState(oldState => {
      const modifiedStations = oldState.stations;
      modifiedStations[positionInStations].isFetching = true;
      return { stations: modifiedStations };
    });

    const station = this.state.stations[positionInStations].information;
    station.get_next_departures(departures => {
      this.setState(oldState => {
        const modifiedStations = oldState.stations;
        modifiedStations[positionInStations].isFetching = false;
        modifiedStations[positionInStations].departures = departures;

        return {
          stations: modifiedStations,
          nStationsWithFetchedDepartes: oldState.nStationsWithFetchedDepartes + 1
        };
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
          ref={c => {
            this.stationDiv = c;
          }}
          key={currentStation.information.name}
          station={currentStation}
        />
      );
    }
    return <h2>No Stations Nearby</h2>;
  }
}
