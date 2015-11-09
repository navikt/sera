var React = require('react');
var classString = require('react-classset');
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;
var Tooltip = require('react-bootstrap').Tooltip;

module.exports = LogRow = React.createClass({
    render: function () {
        var server = this.props.server;

        return <tr>
            <td className="text-center">
                <OverlayTrigger placement="left" overlay={this.buildTooltip(server)}>
                    <i className={this.getStatusIcon(server.status.toLowerCase())}></i>
                </OverlayTrigger>
            </td>
            <td>{server.hostname.toLowerCase()}</td>
            <td>{server.type.toLowerCase()}</td>
            <td>{server.environment.toLowerCase()}</td>
            <td>{server.application.toLowerCase()}</td>
            <td>{server.unit.toLowerCase()}</td>
            <td>{server.site.toLowerCase()}</td>
            <td style={{whiteSpace: "nowrap"}}>{server.created}</td>
            <td>{Math.round(server.cpu)}</td>
            <td style={{whiteSpace: "nowrap"}}>{Math.round(server.memory)} GB</td>
            <td style={{whiteSpace: "nowrap"}}>{Math.round(server.disk)} GB</td>
        </tr>
    },

    buildTooltip: function(server){
      return (
          <Tooltip id={server.hostname}>
            {server.status}
          </Tooltip>
      )
    },

    getStatusIcon: function (status) {
        return classString({
            "fa": true,
            "fa-lg": true,
            "fa-power-off": true,
            "text-success": status === 'poweredon',
            "text-danger": status === 'poweredoff',
            "text-info": status === 'suspended'
        })
    }
});
