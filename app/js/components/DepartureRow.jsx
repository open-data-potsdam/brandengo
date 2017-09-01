import React from 'react';
import ReactDOM from 'react-dom';

export default class DepartureRow extends React.Component {
  render() {
    const departure = this.props.departure;
    const time = new Date(departure.when);
    const timeDif = time.getTime() - new Date().getTime();
    const minutes = Math.floor(timeDif / (1000 * 60));
    let timeString = `${minutes} min`;
    if (minutes < 1) timeString = 'now';
    if (minutes > 30) {
      let hours = new String(time.getHours());
      let minutes = new String(time.getMinutes());
      hours = hours.length > 1 ? hours : `0${hours}`;
      minutes = minutes.length > 1 ? minutes : `0${minutes}`;
      timeString = `${hours}:${minutes}`;
    }

    // somtimes, you have to break the line to prevent the table from fucking up.
    // because we have genereted dynamicly html, we have to set the html
    // in a dangarous way. (see further below)
    const direction = departure.direction.replace('/', '/<wbr>');
    const line = departure.line.name;
    const type = departure.line.product;
    const lineString = `${type} ${line}`;

    return (
      <tr>
        <td key="line">{lineString}</td>
        <td key="direction" dangerouslySetInnerHTML={{ __html: direction }} />
        <td key="time">{timeString}</td>
      </tr>
    );
  }
}
