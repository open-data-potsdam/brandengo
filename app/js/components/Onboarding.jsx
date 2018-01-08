import React from 'react';
import ReactDOM from 'react-dom';

import StationContainer from './StationContainer';

class Onboarding extends React.Component {
  constructor() {
    super();
    this.state = { beenHere: false };
  }

  componentDidMount() {
    if (!localStorage.getItem('beenHere')) {
      $(ReactDOM.findDOMNode(this)).modal('show');
    }
  }
  render() {
    if (this.state.beenHere) {
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
              Hier werden dir Haltestellen mit Abfahrtszeiten aus deiner
              Umgebung angezeigt.<br />
              <br />Dazu brauchen wir aber deine genau Position.
            </div>
            <div className="modal-footer" style={{ 'text-align': 'center' }}>
              <button
                type="button"
                className="btn btn-default"
                data-dismiss="modal"
                onClick={() => {
                  localStorage.setItem('beenHere', '1');
                  this.setState({ beenHere: true });
                }}
              >
                Ok verstanden. Los geht's!
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Onboarding;
