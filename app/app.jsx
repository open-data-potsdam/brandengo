import React from 'react';
import ReactDOM from 'react-dom';

const baseUrl = 'https://transport.rest';

class StationBox extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			nStations: 5,
			maxMinutesToDeparture: 120,
			stations: [],
			currentFocus: 0,
			latitude: props.latitude,
			longitude: props.longitude,
		};
		this.fetchStations();      
	}

	fetchStations() {
		const urlWithLocation = `${baseUrl}/stations/nearby?latitude=${this.state.latitude}&longitude=${this.state.longitude}&results=${this.state.nStations}`;

		fetch(urlWithLocation)
			.then(r => r.ok ? r.json() : Promise.reject(r))
			.then(stationsWithoutDepartures => Promise.all(stationsWithoutDepartures.map(this.getDepartures.bind(this))))
			.then(stations => {
				console.log(stations);
				this.setState({ stations: stations })
			})
			// .catch(err => console.log(err));
	}

	getDepartures(station) {
		const urlWithId = `${baseUrl}/stations/${station.id}/departures
			?duration=${this.state.maxMinutesToDeparture}`;

		return fetch(urlWithId)
			.then(r => r.ok ? r.json() : Promise.reject(r))
			.then(function(departures ) { return  { station: station, departures: departures } })
	}

	render() {
		if(this.state.stations.length > 0) {
			const currentStation = this.state.stations[this.state.currentFocus];
			return <Station departures={currentStation.departures} station={currentStation.station}/>
		}
		return null;
	}
}

class Station extends React.Component {

	render() {
	return <div>
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
					{this.props.departures.map(x => <Departure departure={x} /> )}
				</tbody>
			</table>
		</div>;
	}
}

class Departure extends React.Component {

	render() {
		const departure = this.props.departure;
		const time = new Date(departure.when * 1000);
		const timeDif = time.getTime() - new Date().getTime();
		const minutes = Math.floor(timeDif / (1000 * 60));
		let minutesString = `${minutes} min`;
		if (minutes < 1) minutesString = 'now'

		// const minutes = timeDif.getMinutes() + timeDif.getHours() * 60 + ' min';
		const direction = departure.direction;
		const line = departure.product.line;
		const type = departure.product.type.unicode;
		const lineString = `${type} ${line}`;

		return <tr>
			{[lineString, direction, minutesString].map(x => <td key={x}>{x}</td>)}
		</tr>;
	}
}

$(function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(location => {
    	const latitude = location.coords.latitude;
    	const longitude = location.coords.longitude;
    	ReactDOM.render(<StationBox longitude={longitude} latitude={latitude}/>, document.getElementById('stationBox'));
    });
  } else {
    $(body).innerHTML = "Geolocation is not supported by this browser.";
  }
});

