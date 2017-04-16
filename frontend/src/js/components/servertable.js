import React from 'react'
const ReactBsTable = require('react-bootstrap-table');
const BootstrapTable = ReactBsTable.BootstrapTable;
const TableHeaderColumn = ReactBsTable.TableHeaderColumn;
const OverlayTrigger = require('react-bootstrap').OverlayTrigger;
const Tooltip = require('react-bootstrap').Tooltip;

export default class Servertable extends React.Component {

    render() {

        const tableOptions = {
            noDataText: (
                <div className="loader-container">
                    <div className="loader"></div>
                </div>
            )
        };

        const tooltip = function (status) {
            return <Tooltip id="Serverstatus">{status}</Tooltip>
        };

        const iconFormatter = function (cell, row) {
            let statusColor = "fa fa-lg fa-power-off text-success";

            if (cell === "poweredOff") {
                statusColor = "fa fa-lg fa-power-off text-danger";
            }
            else if (cell === "suspended") {
                statusColor = "fa fa-lg fa-power-off text-info";
            }
            return (
                <OverlayTrigger placement="top" overlay={tooltip(cell)}>
                    <i className={statusColor}> </i>
                </OverlayTrigger>
            )
        };

        return (
            <div>
                <h1>servere&nbsp;
                    <small id="servers">{this.props.servers.length + "/" + this.props.filteredServers.length}</small>
                </h1>
                <BootstrapTable data={this.props.servers} striped={true} hover={true} options={tableOptions}>
                    <TableHeaderColumn
                        width="60"
                        dataAlign="center"
                        dataField="status"
                        dataFormat={iconFormatter}
                    >
                        status
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField="hostname" isKey={true} hidden={!this.props.visibility.hostname}>
                        <input
                            ref={this.props.filters.hostname}
                            id=''
                            type="text"
                            className="form-control input-sm"
                            value={this.props.filters.hostname}
                            placeholder="hostname"
                            onChange={(event) => this.props.handleChange(event, "hostname")}
                        />
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField="type" width="120" hidden={!this.props.visibility.type}>
                        <input
                            ref={this.props.filters.type}
                            id={''}
                            type="text"
                            className="form-control input-sm"
                            value={this.props.filters.type}
                            placeholder="type"
                            onChange={(event) => this.props.handleChange(event, "type")}
                        />
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField="environment" width="70" hidden={!this.props.visibility.environment}>
                        <input
                            ref={this.props.filters.environment}
                            type="text"
                            className="form-control input-sm"
                            value={this.props.filters.environment}
                            placeholder="env"
                            onChange={(event) => this.props.handleChange(event, "environment")}
                        />
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField="application" width="250" hidden={!this.props.visibility.application}>
                        <input
                            ref={this.props.filters.application}
                            type="text"
                            className="form-control input-sm"
                            value={this.props.filters.application}
                            placeholder="application"
                            onChange={(event) => this.props.handleChange(event, "application")}
                        />
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField="unit" width="150" hidden={!this.props.visibility.unit}>
                        <input
                            ref={this.props.filters.unit}
                            type="text"
                            className="form-control input-sm"
                            value={this.props.filters.unit}
                            placeholder="unit"
                            onChange={(event) => this.props.handleChange(event, "unit")}
                        />
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField="site" width="70" hidden={!this.props.visibility.site}>
                        <input
                            ref={this.props.filters.site}
                            type="text"
                            className="form-control input-sm"
                            value={this.props.filters.site}
                            placeholder="site"
                            onChange={(event) => this.props.handleChange(event, "site")}
                        />
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField="rpm_rpm" width="120" hidden={!this.props.visibility.rpm_rpm}>
                        <input
                            ref={this.props.filters.rpm_rpm}
                            type="text"
                            className="form-control input-sm"
                            value={this.props.filters.rpm_rpm}
                            placeholder="rpm"
                            onChange={(event) => this.props.handleChange(event, "rpm_rpm")}
                        />
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField="rpm_version" width="90" hidden={!this.props.visibility.rpm_version}>
                        <input
                            ref={this.props.filters.rpm_version}
                            type="text"
                            className="form-control input-sm"
                            value={this.props.filters.rpm_version}
                            placeholder="rpm version"
                            onChange={(event) => this.props.handleChange(event, "rpm_version")}
                        />
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField="notes" width="300" hidden={!this.props.visibility.notes}>
                        <input
                            ref={this.props.filters.notes}
                            type="text"
                            className="form-control input-sm"
                            value={this.props.filters.notes}
                            placeholder="notes"
                            onChange={(event) => this.props.handleChange(event, "notes")}
                        />
                    </TableHeaderColumn>
                    <TableHeaderColumn id="created" dataField="created" width="130"
                                       hidden={!this.props.visibility.created}>
                        <input
                            ref={this.props.filters.created}
                            id={'created-input'}
                            type="text"
                            className="form-control input-sm"
                            value={this.props.filters.created}
                            placeholder="created"
                            onChange={(event) => this.props.handleChange(event, "created")}
                        />
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField="ipAddress" width="100" hidden={!this.props.visibility.ipAddress}>
                        <input
                            ref={this.props.filters.ipAddress}
                            type="text"
                            className="form-control input-sm"
                            value={this.props.filters.ipAddress}
                            placeholder="ip address"
                            onChange={(event) => this.props.handleChange(event, "ipAddress")}
                        />
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField="cpu" width="43" dataAlign="center">cpu</TableHeaderColumn>
                    <TableHeaderColumn dataField="memory" width="80" dataAlign="center" dataFormat={this.formatValues}>memory</TableHeaderColumn>
                    <TableHeaderColumn dataField="disk" width="80" dataAlign="center" dataFormat={this.formatValues}>disk</TableHeaderColumn>
                </BootstrapTable>
            </div>
        )
    }

    formatValues(cell) {
        return cell + " GB";
    }
}