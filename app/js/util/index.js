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

export { buildRequestOptions };
