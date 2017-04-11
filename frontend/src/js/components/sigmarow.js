import React from 'react'
let Table = require('react-bootstrap').Table;


export default class Sigmarow extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        let servers = this.props.servers;

        const summarize = function (total, num) {
            return isNaN(num) ? total : total + num
        };

        return (
            <div className="sigma-row">
                <Table>
                    <tbody>
                    <tr>
                        <td className="addrow-text"> Viser {this.props.itemRenderCount} servere</td>
                        <td className="addrow-table" width="50px">
                            <a id="decrease-btn" className="addrow-btn"
                               onClick={() => this.props.addRemoveRows("decrease")}><i
                                className="fa fa-minus-square"> </i></a>
                        </td>
                        <td className="addrow-table" width="50px">
                            <a id="increase-btn" className="addrow-btn"
                               onClick={() => this.props.addRemoveRows("increase")}><i
                                className="fa fa-plus-square"> </i></a>
                        </td>
                        <td></td>
                        <td className="text-center" width="80px"><strong>Σ</strong> (totals)</td>
                        <td className="text-center" width="40px">
                            <strong id="cpu">{Math.round(servers.map(function (server) {
                                return server.cpu
                            }).reduce(summarize, 0))}</strong></td>
                        <td className="text-center" width="80px">
                            <strong id="memory">{Math.round(servers.map(function (server) {
                                return server.memory
                            }).reduce(summarize, 0))} GB</strong>
                        </td>
                        <td className="text-center" width="80px">
                            <strong id="disk">{Math.round(servers.map(function (server) {
                                return server.disk
                            }).reduce(summarize, 0))} GB</strong>
                        </td>
                    </tr>
                    </tbody>
                </Table>
            </div>
        )
    }
}

