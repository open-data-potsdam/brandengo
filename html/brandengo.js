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
	$.getJSON(urlWithLocation, printStations);
}

function printStations(stations) {
	results = stations.map(getDepartures);
}

function getDepartures(station) {
	const urlWithId = baseUrl + `/stations/${station.id}/departures`;
	$.getJSON(urlWithId, departures => buildStationDiv(station, departures));
}

function buildStationDiv(station, departures) {
	const div = $('<div></div>')
		.append(`<div>${station.name}</div>`)
		.append(`<div>${station.distance}</div>`)
		.append('<ul></ul');

	for (let product in station.products) {
		div.append(`<li>${product} ${station.products[product]}</li>`)
	}

	div.append(JSON.stringify(departures));

	$('#stations').append(div);
}
