'use strict'
import React from 'react'
import { shallow  } from 'enzyme'
import { expect } from 'chai'
import Servertable from '../../frontend/src/js/components/servertable'
const ReactBsTable = require('react-bootstrap-table');
const BootstrapTable = ReactBsTable.BootstrapTable;

describe('(Component) Servertable', () => {

    it('renders Servertable without exploding', () => {
        let wrapper = shallow(<Servertable { ...props }/>)
        expect(wrapper).to.have.length(1);
    });

    it('should calculate servers to render/show correctly', () => {
        let wrapper = shallow(<Servertable {...props}/>)
        expect(wrapper.find('#servers').props().children).to.equal("2/2")
    })

   it('should hide column ´created´ if props ´visibility.created´ equals FALSE', () => {
        let wrapper = shallow(<Servertable {...props}/>)
        expect(wrapper.find('#created').props().hidden).to.equal(true)
    })

    it('should show column ´created´ if props ´visibility.created´ equals TRUE', () => {
        let wrapper = shallow(<Servertable {...props} visibility={{created: true}}/>)
        expect(wrapper.find('#created').props().hidden).to.equal(false)
    })

    it('should render two rows', () => {
        let wrapper = shallow(<Servertable {...props}/>)
        expect(wrapper.find(BootstrapTable).props().data).to.have.length(2)
    })

    it('should render hostname ´a01apvl069.devillo.central´ on first row', () => {
        let wrapper = shallow(<Servertable {...props}/>)
        expect(wrapper.find(BootstrapTable).props().data[0].hostname).to.equal('a01apvl069.devillo.central')
    })

});
const props = {
    visibility: {
        hostname: true,
        application: true,
        environment: true,
        type: true,
        unit: true,
        site: true,
        created: false,
        ipAddress: false,
    },

    filters: {
        hostname: '',
        application: '',
        environment: '',
        type: '',
        unit: '',
        site: '',
        created: '',
        ipAddress: '',
        regexp: false
    },

    servers: [{
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
    }],

    filteredServers: [{
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
    }],
    handleChange: fn => fn
};
