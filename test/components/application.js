'use strict';
import 'jsdom-global/register';
import React from 'react';
import { shallow, mount } from 'enzyme';
import {expect} from 'chai';
import sinon from 'sinon';
import fetchMock from 'fetch-mock';
import Application from '../../frontend/src/js/components/application.js';
import TopNav from '../../frontend/src/js/components/topnav';
import Servertable from '../../frontend/src/js/components/servertable';
import Sigmarow from '../../frontend/src/js/components/sigmarow';
import AlertBox from '../../frontend/src/js/components/alertbox';

let wrapper;

describe('(Component) Application', () => {
    const wrapper = shallow(<Application />);

    it('renders Application without exploding', () => {
        expect(wrapper).to.have.length(1);
    });

    it('renders Topnav component once', () => {
        expect(wrapper.find(TopNav)).to.have.length(1);
    });

    it('renders Servertable component once', () => {
        expect(wrapper.find(Servertable)).to.have.length(1);
    });

    it('renders Sigmarow component once', () => {
        expect(wrapper.find(Sigmarow)).to.have.length(1);
    });

    it('renders Alertbox component once', () => {
        expect(wrapper.find(AlertBox)).to.have.length(1);
    })

});

describe('(Component) Application lifecycle tests', () => {
    beforeEach(() => {
        fetchMock.get('/api/v1/servers', mockPayload);
        fetchMock.get('/api/v1/hourssincelastupdate', "9"); // nine hours since last payload from orchestrator
    });

    it('renders empty serverlist based on the initial state (empty ´items´ array)', () => {
        wrapper = mount(<Application />);
        expect(wrapper.state().items).to.be.instanceof(Array);
        expect(wrapper.state().items.length).to.equal(0);
    });

    it('calls ´componentDidMount´ lifecycle method', () => {
        sinon.spy(Application.prototype, 'componentDidMount');
        wrapper = mount(<Application />);
        expect(Application.prototype.componentDidMount.calledOnce).to.equal(true)
    });

    it('correctly updates state after AJAX call in ´componentDidMount´ was made', (done) => {
        wrapper = mount(<Application />);
        setTimeout(function () {
            expect(wrapper.state().items).to.be.instanceof(Array);
            expect(wrapper.state().items.length).to.equal(2);
            expect(wrapper.state().items[0].hostname).to.equal('a01apvl069.devillo.central');
            done();
        }, 500);
    });

    it('should set flag isDatabaseUpdateWarningShowing´ to TRUE.',() => {
        expect(wrapper.state().isDatabaseUpdateWarningShowing).to.equal(true);
    });
//TOPNAV
    it('successfully passes prop ´filters´ to child component ´TopNav´',() => {
        expect(wrapper.find(TopNav).props().filters.regexp).to.equal(false);
    });

    it('successfully passes prop ´visibility´ to child component ´TopNav´',() => {
        expect(wrapper.find(TopNav).props().visibility.ipAddress).to.equal(false);
    });

    it('successfully passes prop ´isDatabaseUpdateWarningShowing´ to child component ´TopNav´',() => {
        expect(wrapper.find(TopNav).props().isDatabaseUpdateWarningShowing).to.equal(true);
    });

    it('successfully pass function ´dismissAlert´ to child component ´TopNav´',() => {
        expect(wrapper.find(TopNav).props().dismissAlert).to.be.instanceof(Function);
    });

    it('successfully passes function ´toggleVisibility´ to child component ´TopNav´',() => {
        expect(wrapper.find(TopNav).props().toggleVisibility).to.be.instanceof(Function);
    });

    it('successfully passes function ´clearFilters´ to child component ´TopNav´',() => {
        expect(wrapper.find(TopNav).props().clearFilters).to.be.instanceof(Function);
    });

    it('successfully passes function ´toggleRegexpMode´ to child component ´TopNav´',() => {
        expect(wrapper.find(TopNav).props().toggleRegexpMode).to.be.instanceof(Function);
    });
//SERVERTABLE
    it('successfully passes prop ´filters´ to child component ´Servertable´',() => {
        expect(wrapper.find(Servertable).props().filters.regexp).to.equal(false);
    });

    it('successfully passes prop ´visibility´ to child component ´Servertable´',() => {
        expect(wrapper.find(Servertable).props().visibility.ipAddress).to.equal(false);
    });

    it('successfully passes prop ´serversToRender´ to child component ´Servertable´',() => {
        expect(wrapper.find(Servertable).props().servers).to.be.instanceof(Array);
        expect(wrapper.find(Servertable).props().servers.length).to.equal(2);
        expect(wrapper.find(Servertable).props().servers[0].hostname).to.equal('a01apvl069.devillo.central');
    });

    it('successfully passes prop ´filteredServers´ to child component ´Servertable´',() => {
        expect(wrapper.find(Servertable).props().servers).to.be.instanceof(Array);
        expect(wrapper.find(Servertable).props().servers.length).to.equal(2);
        expect(wrapper.find(Servertable).props().servers[0].hostname).to.equal('a01apvl069.devillo.central');
    });

    it('successfully passes function ´handleChange´ to child component ´Servertable´',() => {
        expect(wrapper.find(Servertable).props().handleChange).to.be.instanceof(Function);
    });
//SIGMAROW
    it('successfully passes prop ´serversToRender´ to child component ´Sigmarow´',() => {
        expect(wrapper.find(Sigmarow).props().servers).to.be.instanceof(Array);
        expect(wrapper.find(Sigmarow).props().servers.length).to.equal(2);
        expect(wrapper.find(Sigmarow).props().servers[0].hostname).to.equal('a01apvl069.devillo.central');
    });

    it('successfully passes prop ´itemRenderCount´ to child component ´Sigmarow´',() => {
        expect(wrapper.find(Sigmarow).props().itemRenderCount).to.equal(20);
    });

    it('successfully passes function ´addRemoveRows´ to child component ´Sigmarow´',() => {
        expect(wrapper.find(Sigmarow).props().addRemoveRows).to.be.instanceof(Function);
    });
//ALERTBOX
    it('successfully passes prop ´isDatabaseUpdateWarningShowing´ to child component ´AlertBox´',() => {
        expect(wrapper.find(AlertBox).props().isDatabaseUpdateWarningShowing).to.equal(true);
    });

    it('successfully passes function ´dismissAlert´ to child component ´AlertBox´',() => {
        expect(wrapper.find(AlertBox).props().dismissAlert).to.be.instanceof(Function);
    });

});

const mockPayload = [{
    "hostname": "a01apvl069.devillo.central",
    "ipAddress": "10.0.69.96",
    "owner": "jOhAN yUmYuM",
    "application": "SERA",
    "environment": "DEV",
    "cpu": 2,
    "memory": 16,
    "type": "WAS",
    "os": "rhel",
    "site": "so8",
    "disk": 100,
    "srm": false,
    "custom": true,
    "status": "poweredOn",
    "environmentClass": "p",
    "environmentName": "n/a",
    "calculations": {
        "esx": 176,
        "blade": 114,
        "backup": 1250,
        "memory": 1488,
        "cpu": 320,
        "classification": 4500,
        "os": 0,
        "disk": 0
    }
}, {
    "hostname": "a01apvl096.devillo.central",
    "ipAddress": "10.0.69.96",
    "owner": "jOhAN yUmYuM",
    "application": "SERA",
    "environment": "DEV",
    "cpu": 2,
    "memory": 16,
    "type": "WAS",
    "os": "rhel",
    "site": "so8",
    "disk": 100,
    "srm": false,
    "custom": true,
    "status": "poweredOn",
    "environmentClass": "p",
    "environmentName": "n/a",
    "calculations": {
        "esx": 176,
        "blade": 114,
        "backup": 1250,
        "memory": 1488,
        "cpu": 320,
        "classification": 4500,
        "os": 0,
        "disk": 0
    }
}];