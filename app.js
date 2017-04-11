'use strict'
const React = require('react');
const ReactDOM = require('react-dom');
import 'babel-polyfill'
import Application from './frontend/src/js/components/application.js';
require('isomorphic-fetch') // IE11 FIX
require('console-shim'); // IE9 FIX

const Sera = React.createClass({
    render: function () {
        return (
        <Application/>
        )
    }
});

ReactDOM.render(React.createElement(Sera), document.getElementById('content'))