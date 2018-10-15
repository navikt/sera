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
                    Import av serverdata fra vCenter har feilet og informasjonen kan være feil. Kontakt AURA.
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
