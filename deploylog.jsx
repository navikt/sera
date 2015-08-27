var React = require('react');

module.exports = DeployLog = React.createClass({

    getInitialState: function () {
        return {
            loaded: false
        };
    },

    render: function () {
        return (
            <div>
                <h1>{this.state.loaded}</h1>
            </div>
        )
    }
});