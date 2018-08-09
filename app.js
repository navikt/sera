'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
import 'babel-polyfill'
import Application from './frontend/src/js/components/application.js';
require('isomorphic-fetch') // IE11 FIX
require('console-shim') // IE9 FIX

class Sera extends React.Component {

    render() {
        return (
            <Application/>
        )
    }
}

ReactDOM.render(React.createElement(Sera), document.getElementById('content'))