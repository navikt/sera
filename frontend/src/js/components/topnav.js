const React = require('react');
import OptionsPopover  from './optionspopover.js'
import AuraToolsPopover from './auratoolspopover.js'
const Mousetrap = require('mousetrap')

export default class TopNav extends React.Component {

    componentDidMount() {
        Mousetrap.bind(['esc'], this.props.clearFilters)
    }

    componentWillUnmount() {
        Mousetrap.bind(['esc'], this.props.clearFilters)
    }

    render() {
        return (
            <div className="sera-topnav-container">
                <div className="sera-topnav-logo">
                    <div className="sera-topnav-big-letter">
                        S
                    </div>
                    <div className="sera-topnav-logo-text">
                        sera
                    </div>
                </div>
                <ul className="sera-topnav-list">
                    <li className="sera-topnav-list-item">
                        <a type="button"
                           id="tools-popover"
                        >
                            <AuraToolsPopover />
                        </a>
                    </li>
                    <li className="sera-topnav-list-item">
                        <a type="button"
                           id="options-popover"
                        >
                            <OptionsPopover
                                visibility={this.props.visibility}
                                toggleVisibility={(value) => this.props.toggleVisibility(value)}
                            />
                        </a>
                    </li>
                    <li className="sera-topnav-list-item">
                        <a className={this.props.filters.regexp ? "sera-topnav-btn-active" : "sera-topnav-btn" }
                           id="toggle-regexpMode"
                           autoComplete="off"
                           title="Matcher strengene eksakt. F.eks 't1' matcher kun 't1', ikke 't10', 't11' osv. Støtter også regulære uttrykk."
                           onClick={this.props.toggleRegexpMode}
                        >
                            Eksakt match
                        </a>
                    </li>
                    <li className="sera-topnav-list-item">
                        <a className="sera-topnav-btn"
                           id="clear-filters"
                           onClick={this.props.clearFilters}
                        >
                            <i className="fa fa-trash"> </i>
                            &nbsp;
                            Tøm filtere
                        </a>
                    </li>
                </ul>
            </div>
        );
    }
};



