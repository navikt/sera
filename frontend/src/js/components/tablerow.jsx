var React = require('react');
var classString = require('react-classset');

module.exports = LogRow = React.createClass({
    render: function () {
        var event = this.props.event;

        return <tr>
            <td>{event.hostname.toLowerCase()}</td>
            <td>{event.application.toLowerCase()}</td>
            <td>{event.environment.toUpperCase()}</td>
            <td>{event.type.toUpperCase()}</td>
        </tr>
    }
});
