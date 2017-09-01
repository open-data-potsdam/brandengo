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
function buildRequestOptions() {
  const myHeaders = new Headers();

  // add header when developing as requested.
  // https://github.com/derhuerst/vbb-rest/blob/master/docs/index.md#berlin--brandenburg-public-transport-api
  if (window.location.hostname === 'localhost') {
    myHeaders.append('X-Identifier', 'brandengo-development');
  }

  return {
    method: 'GET',
    headers: myHeaders,
    cache: 'no-store', // we always want fresh data
  };
}

export { replaceWithDefault, buildRequestOptions };
