function replaceWithDefault(event) {
  const oldSrc = event.target.src;
  const stationId = oldSrc.match(/\d+.jpg$/)[0].split('.')[0];
  const hashed = hash(stationId);
  const newSrc = `img/stations/default/${hashed}.jpg`;
  event.target.src = newSrc;
}

// number of default pictures
function hash(x) {
  return x % 89;
}

export { replaceWithDefault };
