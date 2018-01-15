import React from 'react';
import ReactDOM from 'react-dom';

import StationContainer from './StationContainer';

class Onboarding extends React.Component {
  constructor() {
    super();
    this.state = { justClickedOkay: false };
  }

  componentDidMount() {
    if (!localStorage.getItem('beenHere')) {
      $(ReactDOM.findDOMNode(this)).modal('show');
    }
  }
  render() {
    if (this.state.justClickedOkay || localStorage.getItem('beenHere')) {
      return <StationContainer />;
    }

    return (
      <div
        className="modal fade"
        id="myModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="myModalLabel"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 className="modal-title text-center" id="myModalLabel">
                Willkommen zu brandenGo!
              </h4>
            </div>
            <div className="modal-body text-center">
              Wir zeigen dir Haltestelle mit Abfahrtszeiten aus deiner Umgebung
              an.<br />
              <br />Dazu brauchen wir Zugriff auf deine Position.
            </div>
            <div className="modal-footer" style={{ 'text-align': 'center' }}>
              <button
                type="button"
                className="btn btn-default"
                data-dismiss="modal"
                onClick={() => {
                  localStorage.setItem('beenHere', '1');
                  this.setState({ justClickedOkay: true });
                }}
              >
                OK. Los geht's!
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Onboarding;
