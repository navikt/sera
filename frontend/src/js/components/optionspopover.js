import React from 'react'
const OverlayTrigger = require('react-bootstrap').OverlayTrigger;
const Popover = require('react-bootstrap').Popover;


export default class OptionsPopover extends React.Component {
    render() {
        const popover = (
            <Popover id="popover-positioned-bottom" title="Legg til/fjern søkefelter">
                <ul className="toggle-visibility-table">
                    <li
                        className={this.props.visibility.type ? "toggle-visibility-btn-on" : "toggle-visibility-btn-off"}
                        onClick={() => this.props.toggleVisibility("type")}>Type
                    </li>
                    <li
                        className={this.props.visibility.environment ? "toggle-visibility-btn-on" : "toggle-visibility-btn-off"}
                        onClick={() => this.props.toggleVisibility("environment")}>Environment
                    </li>
                    <li
                        className={this.props.visibility.application ? "toggle-visibility-btn-on" : "toggle-visibility-btn-off"}
                        onClick={() => this.props.toggleVisibility("application")}>Application
                    </li>
                    <li
                        className={this.props.visibility.unit ? "toggle-visibility-btn-on" : "toggle-visibility-btn-off"}
                        onClick={() => this.props.toggleVisibility("unit")}>Unit
                    </li>
                    <li
                        className={this.props.visibility.site ? "toggle-visibility-btn-on" : "toggle-visibility-btn-off"}
                        onClick={() => this.props.toggleVisibility("site")}>Site
                    </li>
                    <li
                        className={this.props.visibility.rpm_rpm ? "toggle-visibility-rpm-btn-on" : "toggle-visibility-rpm-btn-off"}
                        onClick={() => this.props.toggleVisibility("rpm_rpm")}>RPM
                    </li>
                    <li
                        className={this.props.visibility.rpm_version ? "toggle-visibility-rpm-btn-on" : "toggle-visibility-rpm-btn-off"}
                        onClick={() => this.props.toggleVisibility("rpm_version")}>RPM Version
                    </li>
                    <li
                        className={this.props.visibility.notes ? "toggle-visibility-btn-on" : "toggle-visibility-btn-off"}
                        onClick={() => this.props.toggleVisibility("notes")}>Notes
                    </li>
                    <li
                        className={this.props.visibility.created ? "toggle-visibility-btn-on" : "toggle-visibility-btn-off"}
                        onClick={() => this.props.toggleVisibility("created")}>Created
                    </li>
                    <li
                        className={this.props.visibility.ipAddress ? "toggle-visibility-btn-on" : "toggle-visibility-btn-off"}
                        onClick={() => this.props.toggleVisibility("ipAddress")}>IP Address
                    </li>
                </ul>
            </Popover>

        );
        return (
            <OverlayTrigger id="overlay" trigger="click" placement="bottom" rootClose={true} overlay={popover}>
                <div className="options-btn">
                    Legg til/fjern søkefelt
                </div>
            </OverlayTrigger>
        )

    }
}