import React from 'react'
import moment from 'moment'
import Servertable from './servertable.js'
import Sigmarow from './sigmarow.js'
import TopNav from './topnav.js'
import AlertBox from './alertbox.js'


export default class Application extends React.Component {
    constructor(props) {
        super(props);
        this.stringContainedIn = this.stringContainedIn.bind(this);
        this.state = {
            items: [],
            itemRenderCount: 20,
            filteredServers: '',
            serversToRender: '',
            isDatabaseUpdateWarningShowing: false,
            filters: {
                hostname: '',
                application: '',
                environment: '',
                type: '',
                unit: '',
                site: '',
                rpm_rpm: '',
                rpm_cluster: '',
                rpm_version: '',
                rpm_time: '',
                created: '',
                notes: '',
                ipAddress: '',
                regexp: false
            },
            emptyFilters: {
                hostname: '',
                application: '',
                environment: '',
                type: '',
                unit: '',
                site: '',
                rpm_rpm: '',
                rpm_cluster: '',
                rpm_version: '',
                rpm_time: '',
                created: '',
                notes: '',
                ipAddress: '',
                regexp: false
            },
            visibility: {
                hostname: true,
                application: true,
                environment: true,
                type: true,
                unit: true,
                site: true,
                rpm_rpm: true,
                rpm_cluster: false,
                rpm_version: false,
                rpm_time: false,
                notes: false,
                created: false,
                ipAddress: false,
            },
        }
    }

    componentDidMount() {
        this.getServersFromBackend()
        this.getTimestampFromBackend()


    }


    render() {
        const filteredServers = this.applyHeaderFilter(this.state.items, this.state.filters.regexp);
        const serversToRender = filteredServers.slice(0, this.state.itemRenderCount);

        return (
            <div className="sera-app-container">

                <TopNav
                    filters={this.state.filters}
                    visibility={this.state.visibility}
                    isDatabaseUpdateWarningShowing={this.state.isDatabaseUpdateWarningShowing}
                    dismissAlert={(event) => this.dismissAlert(event)}
                    toggleVisibility={(value) => this.toggleVisibility(value)}
                    clearFilters={() => this.clearFilters()}
                    toggleRegexpMode={() => this.toggleRegexpMode()}
                />
                <div className="server-table-container">
                    <Servertable
                        filters={this.state.filters}
                        visibility={this.state.visibility}
                        servers={serversToRender}
                        filteredServers={filteredServers}
                        handleChange={(event, value) => this.handleChange(event, value)}
                    />
                    <Sigmarow
                        servers={filteredServers}
                        itemRenderCount={this.state.itemRenderCount}
                        addRemoveRows={(type) => this.addRemoveRows(type)}
                    />
                </div>
                <AlertBox
                    isDatabaseUpdateWarningShowing={this.state.isDatabaseUpdateWarningShowing}
                    dismissAlert={() => this.dismissAlert()}
                />
            </div>
        );
    }

    getServersFromBackend() {
        fetch('/api/v1/servers')
            .then((res) => res.json())
            .then((data) => {
                const servers = data.map(this.fillBlanks).map(this.toReadableDateFormat);
                this.setState({
                    items: servers
                })
            })
    }

    getTimestampFromBackend() {
        fetch('/api/v1/hourssincelastupdate')
            .then((res) => res.json())
            .then((data) => {
                if (data > 8) {
                    this.setState({
                        isDatabaseUpdateWarningShowing: true
                    })
                }
            })
    }

    toReadableDateFormat(server) {
        if (server.created !== 'n/a') {
            server.created = moment(server.created.toUpperCase()).format('DD-MM-YY HH:mm:ss');
        }
        if (server.rpm_time !== 'n/a') {
            server.rpm_time = new Date(server.rpm_time).toDateString()
        }
        return server;
    }

    fillBlanks(server) {

        if (!server.application) {
            server.application = 'n/a'
        }

        if (!server.environment) {
            server.environment = 'n/a'
        }

        if (!server.type) {
            server.type = 'n/a'
        }

        if (!server.unit) {
            server.unit = 'n/a'
        }

        if (!server.site) {
            server.site = 'n/a'
        }

        if (!server.created) {
            server.created = 'n/a'
        }

        if (!server.notes) {
            server.notes = 'n/a'
        }

        if (!server.ipAddress) {
            server.ipAddress = 'n/a'
        }

        if (!server.rpm_rpm) {
            server.rpm_rpm = 'n/a'
        }

        if (!server.rpm_version) {
            server.rpm_version = 'n/a'
        }

        if (!server.rpm_time) {
            server.rpm_time = 'n/a'
        }
        return server;
    }


    toggleVisibility(column) {
        console.log(this.state.items)
        const visibility = Object.assign({}, this.state.visibility, {
            [column]: !this.state.visibility[column]
        });
        this.setState({
            visibility: visibility
        });
    }

    handleChange(event, type) {
        const filters = Object.assign({}, this.state.filters, {
            [type]: this.state.filters[type]
        });
        filters[type] = event.target.value;
        this.setState({
            filters: filters
        });
    }

    dismissAlert() {
        this.setState({
            isDatabaseUpdateWarningShowing: false
        })
    }

    addRemoveRows(type) {
        if (type === "increase") {
            this.setState({
                itemRenderCount: (this.state.itemRenderCount + 20)
            })
        }
        if (type === "decrease" && this.state.itemRenderCount >= 40) {
            this.setState({
                itemRenderCount: (this.state.itemRenderCount - 20)
            })
        }
    }

    applyHeaderFilter(items, regexpMode) {
        if (regexpMode) {
            return this.filterWithPreCompiledRegexp(items);
        } else {
            return items.filter(this.stringContainedIn);
        }
    }

    stringContainedIn(elem) {
        return elem.hostname.toLowerCase().indexOf(this.state.filters.hostname.toLowerCase()) > -1
            && elem.application.toLowerCase().indexOf(this.state.filters.application.toLowerCase()) > -1
            && elem.environment.toLowerCase().indexOf(this.state.filters.environment.toLowerCase()) > -1
            && elem.type.toLowerCase().indexOf(this.state.filters.type.toLowerCase()) > -1
            && elem.unit.toLowerCase().indexOf(this.state.filters.unit.toLowerCase()) > -1
            && elem.site.toLowerCase().indexOf(this.state.filters.site.toLowerCase()) > -1
            && elem.rpm_rpm.toLowerCase().indexOf(this.state.filters.rpm_rpm.toLowerCase()) > -1
            && elem.rpm_time.toLowerCase().indexOf(this.state.filters.rpm_time.toLowerCase()) > -1
            && elem.notes.toLowerCase().indexOf(this.state.filters.notes.toLowerCase()) > -1
            && elem.created.toLowerCase().indexOf(this.state.filters.created.toLowerCase()) > -1
            && elem.ipAddress.toLowerCase().indexOf(this.state.filters.ipAddress.toLowerCase()) > -1
    }

    filterWithPreCompiledRegexp(items) {
        const compileValidRegEx = function (filterValue) {
            const isValidRegex = function (expression) {
                try {
                    new RegExp("^" + expression + "$");
                    return true;
                } catch (e) {
                    return false;
                }
            };

            if (isValidRegex(filterValue)) {
                return new RegExp("^" + (filterValue ? filterValue : ".*") + "$", "i");
            } else {
                return new RegExp("^$");
            }
        };

        const preCompiledRegexp = {
            "hostname": compileValidRegEx(this.state.filters["hostname"]),
            "application": compileValidRegEx(this.state.filters["application"]),
            "environment": compileValidRegEx(this.state.filters["environment"]),
            "type": compileValidRegEx(this.state.filters["type"]),
            "unit": compileValidRegEx(this.state.filters["unit"]),
            "site": compileValidRegEx(this.state.filters["site"]),
            "created": compileValidRegEx(this.state.filters["created"])
        };

        return items.filter(function (item) {
            return preCompiledRegexp["hostname"].test(item.hostname) &&
                preCompiledRegexp["application"].test(item.application) &&
                preCompiledRegexp["environment"].test(item.environment) &&
                preCompiledRegexp["type"].test(item.type) &&
                preCompiledRegexp["unit"].test(item.unit) &&
                preCompiledRegexp["site"].test(item.site) &&
                preCompiledRegexp["created"].test(item.created)
        }.bind(this));
    }

    clearFilters() {
        const filters = Object.assign({}, this.state.emptyFilters, {
            filters: this.state.emptyFilters
        });
        this.setState({
            filters: filters
        });
    }

    toggleRegexpMode() {
        const filters = Object.assign({}, this.state.filters, {
            ['regexp']: !this.state.filters.regexp
        });
        this.setState({
            filters: filters
        });
    }


};





