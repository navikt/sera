var React = require('react');
var classString = require('react-classset');

module.exports = LogRow = React.createClass({
    render: function () {
        var server = this.props.server;

        return <tr>
            <td>{server.hostname.toLowerCase()}</td>
            <td>{server.type.toLowerCase()}</td>
            <td>{server.environment.toUpperCase()}</td>
            <td>{server.application.toLowerCase()}</td>
            <td>{server.unit.toLowerCase()}</td>
            <td>{server.site.toUpperCase()}</td>
            <td>{server.cpu} core(s) | {server.memory}GB ram | {server.disk}GB disk</td>
        </tr>
    }
});
