const React = require('react');

export default class AlertBox extends React.Component {
    render() {
        return (
            <div className={this.props.isDatabaseUpdateWarningShowing ? "show-alert" : "hide-alert" }>
                <div className="alert-logo" >
                    !
                </div>
                <div className="alert-text">
                    <strong>Obs!</strong><br />
                    Gammal drit i databasen, kontakt noen som kan fikse sånt.
                </div>
                <div>
                    <button
                        type="button"
                        className="alert-btn"
                        onClick={() => this.props.dismissAlert()}>
                        <strong>✖</strong>
                    </button>
                </div>
            </div>
        )
    }
}
