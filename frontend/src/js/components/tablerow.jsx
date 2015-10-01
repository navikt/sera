var React = require('react');
var classString = require('react-classset');

module.exports = LogRow = React.createClass({
    render: function () {
        var server = this.props.server;

        return <tr>
            <td>{server.hostname.toLowerCase()}</td>
            <td>{server.application.toLowerCase()}</td>
            <td>{server.environment.toUpperCase()}</td>
            <td>{server.type.toLowerCase()}</td>
        </tr>
    }
});
