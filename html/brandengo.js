const baseUrl ='https://transport.rest';

$(function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getStations);
  } else {
    $(body).innerHTML = "Geolocation is not supported by this browser.";
  }
});

function getStations(location) {
	const urlWithLocation = baseUrl + `/stations/nearby?latitude=${location.coords.latitude}&longitude=${location.coords.longitude}`
	fetch(urlWithLocation)
		.then(r => r.json())
		.then(printStations);
}

function printStations(stations) {
	Promise.all(stations.map(getDepartures))
		.then(r => $('#stations').append(r));
}

function getDepartures(station) {
	const urlWithId = baseUrl + `/stations/${station.id}/departures`;
	return fetch(urlWithId)
		.then(r => r.json())
		.then(departures => buildStationDiv(station, departures));
}

function buildStationDiv(station, departures) {
	const div = $('<div></div>')
	const stationInfoDiv = div.append('<div></div>')
		.addClass('stationInfo')
		.append(`<div>${station.name}</div>`)
		.append(`<div>${station.distance}</div>`)
		.append('<ul></ul');

	for (let product in station.products) {
		stationInfoDiv.append(`<li>${product} ${station.products[product]}</li>`)
	}

	div.append(JSON.stringify(departures));

	return div;
}
