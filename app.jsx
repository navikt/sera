var React = require('react');
var ReactDOM = require('react-dom');
var Servers = require('./frontend/src/js/components/servers.jsx');
require('console-shim'); // IE9 FIX

var Sera = React.createClass({

    getInitialState: function () {
        return {}
    },

    render: function () {
        return (
            <div>
                <nav className="navbar navbar-fixed-top sera-header">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <a className="navbar-brand" href="#">
                                <span className="fa-stack fa-lg">
                                    <i className="fa fa-square fa-stack-2x logo"></i>
                                    <strong className="fa-stack-1x fa-stack-text fa-comment-text ">S</strong>
                                </span>
                            &nbsp;sera</a>
                        </div>
                    </div>
                </nav>
                <Servers />
            </div>
        )
    }
})

ReactDOM.render(React.createElement(Sera), document.getElementById('content'))