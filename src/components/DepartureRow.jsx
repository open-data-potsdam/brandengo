import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

const icons = {
  "Bus": "directions_bus",
  "Str": "tram",
  "U": "subway"
}

export default class DepartureRow extends React.Component {
  render() {
    const { departure } = this.props;

    const time = moment(new Date(departure.departure_time.scheduled_at));
    const difAsMinutes = Math.floor(
      moment.duration(time.diff(moment())).asMinutes()
    );
    let timeString = 'now';
    if (difAsMinutes > 30) {
      timeString = time.format('H:mm');
    } else if (difAsMinutes > 1) {
      timeString = `${difAsMinutes} min`;
    }

    const direction = departure.headsign;
    const line = departure.line_name;

    return (
      <tr>
        <td>
          <i className="material-icons">{icons[departure.type] || "train"}</i>
        </td>
        <td key="line">{line}</td>
        <td key="direction" dangerouslySetInnerHTML={{ __html: direction }} />
        <td key="time">{timeString}</td>
      </tr>
    );
  }
}
