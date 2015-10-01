var React = require('react');
var $ = jQuery = require('jquery');
var Servers = require('./frontend/src/js/components/servers.jsx');
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
        <DefaultRoute handler={Servers} />
        <Route name="servers" handler={Servers}/>
    </Route>
)

Router.run(routes, function (Handler) {
    React.render(<Handler />, document.getElementById('content'));
})
