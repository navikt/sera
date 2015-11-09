var React = require('react');
var $ = require('jquery');
var moment = require('moment');
var _ = require('lodash');
var classString = require('react-classset');
var TableRow = require('./tablerow.jsx');
var SigmaRow = require('./sigmarow.jsx');
var TableHeader = require('./tableheader.jsx')

module.exports = Servers = React.createClass({

    getInitialState: function () {
        return {
            items: [],
            itemRenderCount: 20,
            filters: this.emptyFilters
        };
    },

    emptyFilters: {
        hostname: '',
        application: '',
        environment: '',
        type: '',
        unit: '',
        site: '',
        created: '',
        regexp: false
    },

    componentDidMount: function () {
        this.getServersFromBackend();
    },

    render: function () {
        var filteredServers = this.applyHeaderFilter(this.state.items, this.state.filters.regexp)
        var serversToRender = filteredServers.slice(0, this.state.itemRenderCount)

        return (
            <div className="container">
                <h2>servers&nbsp;
                    <small>{filteredServers.length + "/" + this.state.items.length}</small>
                    <div className="pull-right btn-toolbar" data-toggle="buttons" role="group">
                        <button type="button"  className="btn btn-default btn-sm" onClick={this.clearFilters} >
                            <i className="fa fa-trash"></i>
                        &nbsp;
                        tøm filtere</button>
                        <label className={this.regexpToggleButtonClasses()} title="Matcher strengene eksakt. F.eks 't1' matcher kun 't1', ikke 't10', 't11' osv. Støtter også regulære uttrykk.">
                            <input type="checkbox" autoComplete="off" onClick={this.toggleRegexpMode} />
                        eksakt match
                        </label>
                    </div>
                </h2>
                <table className='table table-bordered table-striped'>
                    <thead>
                    <tr>
                        <td className="text-center"><h5>status</h5></td>
                        <TableHeader columnName="hostname" regexp={this.state.filters.regexp} value={this.state.filters.hostname} changeHandler={this.handleChange} />
                        <TableHeader columnName="type" regexp={this.state.filters.regexp} value={this.state.filters.type} changeHandler={this.handleChange} />
                        <TableHeader columnName="environment" regexp={this.state.filters.regexp} value={this.state.filters.environment} changeHandler={this.handleChange} />
                        <TableHeader columnName="application" regexp={this.state.filters.regexp} value={this.state.filters.application} changeHandler={this.handleChange} />
                        <TableHeader columnName="unit" regexp={this.state.filters.regexp} value={this.state.filters.unit} changeHandler={this.handleChange} />
                        <TableHeader columnName="site" regexp={this.state.filters.regexp} value={this.state.filters.site} changeHandler={this.handleChange} />
                        <TableHeader columnName="created" regexp={this.state.filters.regexp} value={this.state.filters.created} changeHandler={this.handleChange} />
                        <td className="text-center"><h5>cpu</h5></td>
                        <td className="text-center"><h5>memory</h5></td>
                        <td className="text-center"><h5>disk</h5></td>
                    </tr>
                        </thead>
                    <tbody>
                        {serversToRender.map(function (elem) {
                            return <TableRow key={elem.hostname} server={elem} />
                        })}
                        <SigmaRow servers={filteredServers} />
                    </tbody>
                </table>
                <button type="button" className={this.viewMoreResultsButtonClasses(filteredServers.length <= this.state.itemRenderCount)} onClick={this.viewMoreResults}>View more results...</button>
            </div>
        )
    },

    validBackendParams: ["application", "environment", "type", "hostname", "unit"],

    DEPLOYLOG_SERVICE: '/api/v1/servers',

    applyHeaderFilter: function (items, regexpMode) {
        if (regexpMode) {
            return this.filterWithPreCompiledRegexp(items);
        } else {
            return items.filter(this.stringContainedIn);
        }
    },

    filterWithPreCompiledRegexp: function (items) {
        var compileValidRegEx = function(filterValue){
            var isValidRegex = function (expression) {
                try {
                    new RegExp("^" + expression + "$");
                    return true;
                } catch (e) {
                    return false;
                }
            }

            if (isValidRegex(filterValue)){
                return new RegExp("^" + (filterValue ? filterValue : ".*") + "$", "i");
            } else {
                return new RegExp("^$");
            }
        }

        var preCompiledRegexp = {
            "hostname": compileValidRegEx(this.state.filters["hostname"]),
            "application": compileValidRegEx(this.state.filters["application"]),
            "environment": compileValidRegEx(this.state.filters["environment"]),
            "type": compileValidRegEx(this.state.filters["type"]),
            "unit": compileValidRegEx(this.state.filters["unit"]),
            "created": compileValidRegEx(this.state.filters["created"])
        }

        return items.filter(function (item) {
            return preCompiledRegexp["hostname"].test(item.hostname) &&
                preCompiledRegexp["application"].test(item.application) &&
                preCompiledRegexp["environment"].test(item.environment) &&
                preCompiledRegexp["type"].test(item.type) &&
                preCompiledRegexp["unit"].test(item.unit) &&
                preCompiledRegexp["created"].test(item.created)
        }.bind(this));
    },

    stringContainedIn: function (elem) {
        return elem.hostname.toLowerCase().indexOf(this.state.filters.hostname.toLowerCase()) > -1
            && elem.application.toLowerCase().indexOf(this.state.filters.application.toLowerCase()) > -1
            && elem.environment.toLowerCase().indexOf(this.state.filters.environment.toLowerCase()) > -1
            && elem.type.toLowerCase().indexOf(this.state.filters.type.toLowerCase()) > -1
            && elem.unit.toLowerCase().indexOf(this.state.filters.unit.toLowerCase()) > -1
            && elem.site.toLowerCase().indexOf(this.state.filters.site.toLowerCase()) > -1
            && elem.created.toLowerCase().indexOf(this.state.filters.created.toLowerCase()) > -1
    },

    handleChange: function (e) {
        var filter = _.clone(this.state.filters, true);
        filter[e.target.id] = e.target.value;
        this.setState({filters: filter});
    },

    toReadableDateFormat: function (server) {
        if (server.created !== 'n/a'){
            server.created = moment(server.created.toUpperCase()).format('DD-MM-YY HH:mm:ss');
        }
        return server;
    },

    fillBlanks: function (server) {

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

        if (!server.created){
            server.created = 'n/a'
        }

        return server;
    },

    getServersFromBackend: function () {
        return $.getJSON('/api/v1/servers').success(function (data) {
            var servers = data.map(this.fillBlanks).map(this.toReadableDateFormat)
            this.setState({items: servers})
        }.bind(this));
    },

    viewMoreResults: function () {
        this.setState({itemRenderCount: this.state.itemRenderCount + 20})
    },

    clearFilters: function () {
        this.setState({filters: _.clone(this.emptyFilters)});
    },

    toggleRegexpMode: function () {
        var filter = _.clone(this.state.filters, true);
        filter['regexp'] = !this.state.filters.regexp;
        this.setState({filters: filter});
    },

    viewMoreResultsButtonClasses: function (hide) {
        return classString({
            "btn": true,
            "btn-link": true,
            "hide": hide
        })
    },

    regexpToggleButtonClasses: function () {
        return classString({
            "btn": true,
            "btn-default": true,
            "btn-sm": true,
            "active": this.state.filters.regexp
        })
    }
});