import React from 'react'
const OverlayTrigger = require('react-bootstrap').OverlayTrigger;
const Popover = require('react-bootstrap').Popover;


export default class AuraToolsPopover extends React.Component {
    render() {
        const auraToolsPopoverButton = (
            <Popover title="AURA tools" id="apps">
                <a href="https://fasit.adeo.no" target="Fasit">

                    <div className="app-container">
                        <div className="app-icon">
                            <img src="/images/aura-icons/fasit.png" className="app-icon"/>
                        </div>
                        <div className="app-label">
                            Fasit
                        </div>
                    </div>
                </a>
                <a href="https://basta.adeo.no" target="Basta">

                    <div className="app-container">
                        <div className="app-icon">
                            <img src="/images/aura-icons/basta.png" className="app-icon"/>
                        </div>
                        <div className="app-label">
                            Basta
                        </div>
                    </div>
                </a>
                <a href="https://vera.adeo.no" target="Vera">
                    <div className="app-container">
                        <div className="app-icon">
                            <img src="/images/aura-icons/vera.png" className="app-icon"/>
                        </div>
                        <div className="app-label">
                            Vera
                        </div>
                    </div>
                </a>
                <a href="https://sera.adeo.no" target="Sera">

                    <div className="app-container">
                        <div className="app-icon">
                            <img src="/images/aura-icons/sera.png" className="app-icon"/>
                        </div>
                        <div className="app-label">
                            Sera
                        </div>
                    </div>
                </a>
                <a href="https://nora.adeo.no" target="Nora">

                    <div className="app-container">
                        <div className="app-icon">
                            <img src="/images/aura-icons/nora.png" className="app-icon"/>
                        </div>
                        <div className="app-label">
                            Nora
                        </div>
                    </div>
                </a>
                <a href="https://coca.adeo.no" target="Coca">

                    <div className="app-container">
                        <div className="app-icon">
                            <img src="/images/aura-icons/coca.png" className="app-icon"/>
                        </div>
                        <div className="app-label">
                            Coca
                        </div>
                    </div>
                </a>
                <a href="https://visa.adeo.no" target="Visa">
                    <div className="app-container">
                        <div className="app-icon">
                            <img src="/images/aura-icons/visa.png" className="app-icon"/>
                        </div>
                        <div className="app-label">
                            Visa
                        </div>
                    </div>
                </a>
                <a href="https://plaster.adeo.no" target="Plaster">
                    <div className="app-container">
                        <div className="app-icon">
                            <img src="/images/aura-icons/plaster.png" className="app-icon"/>
                        </div>
                        <div className="app-label">
                            Plaster
                        </div>
                    </div>
                </a>
                <a href="https://confluence.adeo.no/display/AURA" target="confluence">
                    <div className="app-container">
                        <div className="app-icon">
                            <img src="/images/aura-icons/confluence.png" className="app-icon"/>
                        </div>
                        <div className="app-label">
                            Docs
                        </div>
                    </div>
                </a>
            </Popover>
        );
        return (
            <OverlayTrigger
                trigger="click"
                rootClose={true}
                placement="bottom"
                overlay={auraToolsPopoverButton}>
                <div className="aura-tools-btn" >
                    <img src="/images/aura-icons/aurabot.png" alt="AURA tools" height="30" width="30"/>
                </div>
            </OverlayTrigger>
        )
    }
}

