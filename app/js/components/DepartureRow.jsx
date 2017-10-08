import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

const icons = [
  'train',
  'subway',
  'tram',
  'directions_bus',
  'directions_boat',
  'train',
];

export default class DepartureRow extends React.Component {
  render() {
    const { departure } = this.props;

    const time = moment(departure.when);
    const difAsMinutes = Math.floor(
      moment.duration(time.diff(moment())).asMinutes()
    );
    let timeString = 'now';
    if (difAsMinutes > 30) {
      timeString = time.format('H:mm');
    } else if (difAsMinutes > 1) {
      timeString = `${difAsMinutes} min`;
    }

    // somtimes, you have to break the line to prevent the table from fucking up.
    // because we have genereted dynamicly html, we have to set the html
    // in a dangarous way. (see further below)
    const direction = departure.direction.replace('/', '/<wbr>');
    const line = departure.line.name;

    return (
      <tr>
        <td>
          <i className="material-icons">{icons[departure.line.productCode]}</i>
        </td>
        <td key="line">{line}</td>
        <td key="direction" dangerouslySetInnerHTML={{ __html: direction }} />
        <td key="time">{timeString}</td>
      </tr>
    );
  }
}
