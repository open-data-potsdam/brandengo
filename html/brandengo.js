const baseUrl ='https://transport.rest';
const nStations = 20;
const maxMinutes = 60;

$(function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getStations);
  } else {
    $(body).innerHTML = "Geolocation is not supported by this browser.";
  }
});

function getStations(location) {
	const urlWithLocation = `${baseUrl}/stations/nearby?latitude=${location.coords.latitude}&longitude=${location.coords.longitude}&results=${nStations}`;
	fetch(urlWithLocation)
		.then(r => r.json())
		.then(printStations)
}

function printStations(stations) {
	Promise.all(stations.map(getDepartures))
		.then(r => $('#stations').append(r));
}

function getDepartures(station) {
	const urlWithId = `${baseUrl}/stations/${station.id}/departures?duration=${maxMinutes}`;
	return fetch(urlWithId)
		.then(r => r.ok ? r.json() : Promise.reject(r))
		.then(departures => buildStationDiv(station, departures))
		.catch(err => console.log(err));
}

function buildStationDiv(station, departures) {
	const div = $('<div></div>')
	const stationInfoDiv = div.append('<div></div>')
		.addClass('stationInfo')
		.append(`<h2>${station.name}</h2>`)
		.append(`<div>${station.distance}</div>`);
		
	// const stationInfoUl = $('<ul></ul');
	// stationInfoDiv.append(stationInfoUl);

	// for (let product in station.products) {
	// 	stationInfoUl.append(`<li>${product} ${station.products[product]}</li>`)
	// }

	const table = $('<table align="center"></table>');
	div.append(table);
	departures.forEach(x => table.append(buildRow(x)));

	return div;
}

function buildRow(departure) {
	const time = new Date(departure.when * 1000);
	const timeDif = new Date(time.getTime() - new Date().getTime());
	const minutes = timeDif.getMinutes() + timeDif.getHours() * 60 + ' min';
	const direction = departure.direction;
	const line = departure.product.line;
	const type = departure.product.type.unicode;
	const tr = $(`<tr></tr>`);
	[type, line, direction, minutes].forEach(x => tr.append(`<td>${x}</td>`));
	return tr;
}
