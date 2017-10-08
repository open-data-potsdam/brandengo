import PropTypes from 'prop-types';
import React from 'react';

import DepartureRow from './DepartureRow';
import Loading from './Loading';

const myHeaders = new Headers();
myHeaders.append('Authorization', ' Bearer 87f54d1b297dcc3c05324cebed834cf2'); // I don't give a shit about this key

const myInit = {
  method: 'GET',
  headers: myHeaders,
  mode: 'cors',
  cache: 'default',
};

class StationCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = { imageSrc: null, isFetchingImageSrc: false };
  }

  componentDidMount() {
    this.buildPictureUrl(this.props.station.information.name);
  }

  buildPictureUrl(name) {
    this.setState({ isFetchingImageSrc: true });

    let nameFixed = name;
    if (name.startsWith('S ')) {
      nameFixed = name.slice(2);
    }

    fetch(
      `https://api.deutschebahn.com/stada/v2/stations?searchstring=*${encodeURIComponent(
        nameFixed
      )}*`,
      myInit
    )
      .then(r => {
        if (r.ok) {
          return r.json();
        }
        throw new Error(`Error Fetching Stations API: ${r.status}`);
      })
      .then(d => {
        if (!(d.result && d.result[0].number)) {
          throw new Error('No Station Found');
        }
        const id = d.result[0].number;
        fetch(
          `https://api.deutschebahn.com/bahnhofsfotos/v1/de/stations/${id}`,
          myInit
        )
          .then(r => {
            if (r.ok) {
              return r.json();
            }
            throw new Error(`Error Fetching Image API: ${r.status}`);
          })
          .then(data => {
            const imageSrc = data.photoUrl;
            if (imageSrc) {
              this.setState({ imageSrc, isFetchingImageSrc: false });
            } else {
              throw new Error('Not Yet Uploaded an Image');
            }
          });
      })
      .catch(error => {
        this.setState({ isFetchingImageSrc: false, imageSrc: null });
        console.error(error);
      });
  }

  render() {
    const {
      errorMessage,
      information,
      departures,
      isFetching,
    } = this.props.station;
    let departuresView;

    if (departures && departures.length) {
      departuresView = (
        <table
          ref={x => {
            this.departures = x;
          }}
        >
          <thead>
            <tr>
              <th>Type</th>
              <th>Line</th>
              <th>Destination</th>
              <th>Departure</th>
            </tr>
          </thead>
          <tbody>
            {departures.map((x, i) => <DepartureRow key={i} departure={x} />)}
          </tbody>
        </table>
      );
    } else if (!isFetching && !errorMessage) {
      departuresView = <p>No departures to show</p>;
    }

    let error;
    if (errorMessage) {
      error = <p>Error: {errorMessage}</p>;
    }

    let loader;
    if (isFetching) {
      loader = <Loading message={'Fetching Departures'} />;
    }

    const departuresWitth =
      this.departures && this.departures.getBoundingClientRect().width;

    const img = this.state.imageSrc && (
      <img
        src={this.state.imageSrc}
        style={{ width: departuresWitth }}
        alt="station"
      />
    );

    return (
      <div className="station-card">
        {img}
        <h2 className="station-name">{information.name}</h2>
        {error}
        {loader}
        {departuresView}
      </div>
    );
  }
}

StationCard.propTypes = {
  station: PropTypes.shape({
    departures: PropTypes.array,
    errorMessage: PropTypes.string,
    information: PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

export default StationCard;
