var React = require('react');

module.exports = LogRow = React.createClass({
    render: function () {
        var servers = this.props.servers;

        var summarize = function (total, num) {
            return total + num
        }

        return <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td><strong>Σ</strong> (totals)</td>
            <td style={{whiteSpace: "nowrap"}} ><strong>{servers.map(function (server) {
                return server.cpu
            }).reduce(summarize, 0)}</strong></td>
            <td style={{whiteSpace: "nowrap"}} ><strong>{servers.map(function (server) {
                return server.memory
            }).reduce(summarize, 0)} GB</strong></td>
            <td style={{whiteSpace: "nowrap"}} ><strong>{servers.map(function (server) {
                return server.disk
            }).reduce(summarize, 0)} GB</strong></td>
        </tr>
    }
});