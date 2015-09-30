var React = require('react');
var $ = jQuery = require('jquery');
var DeployLog = require('./frontend/src/js/components/deploylog.jsx');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;
var Link = Router.Link;
require('console-shim'); // IE9 FIX

var Sera = React.createClass({

    getInitialState: function () {
        return {}
    },


    componentDidMount: function () {
        $.getJSON('http://localhost:8443/api/v1/servers').done(function (data) {
            console.log(data);
            this.setState(data)
        }.bind(this));
    },

    render: function () {
        return (
            <div>
                <nav className="navbar navbar-fixed-top vera-header">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <a className="navbar-brand" href="#">
                                <span className="fa-stack fa-lg">
                                    <i className="fa fa-circle fa-stack-2x logo"></i>
                                    <strong className="fa-stack-1x fa-stack-text fa-comment-text ">S</strong>
                                </span>
                            &nbsp;sera</a>
                        </div>
                    </div>
                </nav>
                <RouteHandler />
            </div>
        )
    }
})

var routes = (
    <Route handler={Sera}>
        <DefaultRoute handler={DeployLog} />
        <Route name="log" handler={DeployLog}/>
    </Route>
)

Router.run(routes, function (Handler) {
    React.render(<Handler />, document.getElementById('content'));
})
