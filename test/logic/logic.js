'use strict';
import React from 'react';
import {shallow, mount} from 'enzyme';
import {expect} from 'chai';
import Application from '../../frontend/src/js/components/application.js';


describe('(Function) fillBlanks, toReadableDateFormat', () => {
    it('successfully formats input data', () => {
        let wrapper = shallow(<Application />);
        let fillBlanksReturnValue = wrapper.instance().fillBlanks(mockPayload[0]) // calling fillBlanks with dummy data
        expect(fillBlanksReturnValue.created).to.equal('2017-02-14T14:46:36.182Z')
        expect(fillBlanksReturnValue.unit).to.equal('n/a')
        expect(fillBlanksReturnValue.rpm_rpm).to.equal('n/a')
        let toReadableDateFormatReturnValue = wrapper.instance().toReadableDateFormat(fillBlanksReturnValue) // calling toReadableDateFormat with return data from fillBlanks
        expect(toReadableDateFormatReturnValue.created).to.equal('14-02-17 15:46:36')
        expect(toReadableDateFormatReturnValue.rpm_time).to.equal('Thu Feb 02 2017')
    });
})

describe('(Function) toggleVisibility', () => {
    it('successfully toggles state of ´visibility.type to FALSE', () => {
        let wrapper = shallow(<Application />)
        wrapper.setState({visibility: {type: true}})
        wrapper.instance().toggleVisibility('type') // calling toggleVisibility with args
        expect(wrapper.state().visibility.type).to.equal(false)
    })
})

describe('(Function) handleChange', () => {
    it('successfully sets state of filters.type', () => {
        let wrapper = shallow(<Application />)
        wrapper.setState({filters: {type: ''}})
        wrapper.instance().handleChange({target: {value: 'w'}}, 'type') // calling handleChange with args
        expect(wrapper.state().filters.type).to.equal('w')
    })
})

describe('(Function) dismissAlert', () => {
    it('successfully sets state of ´isDatabaseUpdateWarningShowing´to FALSE', () => {
        let wrapper = shallow(<Application />)
        wrapper.setState({isDatabaseUpdateWarningShowing: true})
        wrapper.instance().dismissAlert()
        expect(wrapper.state().isDatabaseUpdateWarningShowing).to.equal(false)
    });
})

describe('(Function) addRemoveRows', () => {
    it('successfully INCREASES state of ´itemRenderCount´', () => {
        let wrapper = shallow(<Application />)
        wrapper.setState({itemRenderCount: 20})
        wrapper.instance().addRemoveRows('increase')
        expect(wrapper.state().itemRenderCount).to.equal(40)
    })

    it('successfully DECREASES state of ´itemRenderCount´', () => {
        let wrapper = shallow(<Application />)
        wrapper.setState({itemRenderCount: 40})
        wrapper.instance().addRemoveRows('decrease')
        expect(wrapper.state().itemRenderCount).to.equal(20)
    })
})

describe('(Function) applyHeaderFilter', () => {
    it('successfully applies partial search pattern without applying regexp and returns ALL matching objects', () => {
        let wrapper = shallow(<Application />)
        wrapper.setState({filters: mockFilters})
        const applyHeaderFilterReturnValue = wrapper.instance().applyHeaderFilter(mockServerItems, false) // applying search pattern to mock server items object
        expect(applyHeaderFilterReturnValue).to.be.an('array')
        expect(applyHeaderFilterReturnValue).to.have.length(2)
        expect(applyHeaderFilterReturnValue[0].hostname).to.equal('a01apvl069.devillo.central')
        expect(applyHeaderFilterReturnValue[1].hostname).to.equal('a01apvl096.devillo.central')// return array with two server objects
    })
})

describe('(Function) filterWithPreCompiledRegexp', () => {
    it('successfully applies partial search pattern while applying regexp and returns NO matching objects', () => {
        let wrapper = shallow(<Application />)
        wrapper.setState({filters: mockFilters})
        const applyHeaderFilterReturnValue = wrapper.instance().filterWithPreCompiledRegexp(mockServerItems, true) // applying search pattern to mock server items object
        expect(applyHeaderFilterReturnValue).to.be.an('array')
        expect(applyHeaderFilterReturnValue).to.have.length(0) // returns empty array
    })

    it('successfully applies exact search pattern while applying regexp and returns ONE matching object', () => {
        let wrapper = shallow(<Application />)
        wrapper.setState({filters: mockFilters})
        wrapper.setState({filters: {hostname: 'a01apvl069.devillo.central'}})
        const applyHeaderFilterReturnValue = wrapper.instance().filterWithPreCompiledRegexp(mockServerItems, true) // applying search pattern to mock server items object
        expect(applyHeaderFilterReturnValue).to.be.an('array')
        expect(applyHeaderFilterReturnValue).to.have.length(1)
        expect(applyHeaderFilterReturnValue[0].hostname).to.equal('a01apvl069.devillo.central') // return array with one server object
    })
})

describe('(Function) clearFilters', () => {
    it('successfully resets state of ´filters´', () => {
        let wrapper = shallow(<Application />)
        wrapper.setState({filters: mockFilters})
        wrapper.instance().clearFilters()
        expect(wrapper.state().filters.hostname).to.equal('')
    })
})

describe('(Function) toggleRegexpMode', () => {
    it('successfully toggles filters.regexp´', () => {
        let wrapper = shallow(<Application />)
        wrapper.setState({filters: {regexp: false}})
        wrapper.instance().toggleRegexpMode()
        expect(wrapper.state().filters.regexp).to.equal(true)
    })
})


const mockFilters = {
    hostname: '01apvl',
    application: '',
    environment: '',
    type: '',
    unit: '',
    site: '',
    rpm_rpm: '',
    rpm_cluster: '',
    rpm_version: '',
    rpm_time: '',
    created: '',
    notes: '',
    ipAddress: '',
    regexp: false
}


const mockServerItems = [
    {
        hostname: 'a01apvl069.devillo.central',
        ipAddress: '10.0.69.96',
        owner: 'jOhAN yUmYuM',
        application: 'SERA',
        environment: 'DEV',
        cpu: 2,
        memory: 16,
        type: 'WAS',
        created: '14-02-17 15:46:36',
        os: 'rhel',
        site: 'so8',
        disk: 100,
        srm: false,
        custom: true,
        status: 'poweredOn',
        environmentClass: 'p',
        environmentName: 'n/a',
        calculations: {
            esx: 176,
            blade: 114,
            backup: 1250,
            memory: 1488,
            cpu: 320,
            classification: 4500,
            os: 0,
            disk: 0
        },
        unit: 'n/a',
        notes: 'n/a',
        rpm_rpm: 'n/a',
        rpm_version: 'n/a',
        rpm_cluster: 'n/a',
        rpm_time: 'n/a'
    },
    {
        hostname: 'a01apvl096.devillo.central',
        ipAddress: '10.0.69.96',
        owner: 'jOhAN yUmYuM',
        application: 'SERA',
        environment: 'DEV',
        cpu: 2,
        memory: 16,
        type: 'WAS',
        created: '14-02-17 15:46:36',
        os: 'rhel',
        site: 'so8',
        disk: 100,
        srm: false,
        custom: true,
        status: 'poweredOn',
        environmentClass: 'p',
        environmentName: 'n/a',
        calculations: {
            esx: 176,
            blade: 114,
            backup: 1250,
            memory: 1488,
            cpu: 320,
            classification: 4500,
            os: 0,
            disk: 0
        },
        unit: 'n/a',
        notes: 'n/a',
        rpm_rpm: 'n/a',
        rpm_version: 'n/a',
        rpm_cluster: 'n/a',
        rpm_time: 'n/a'
    }
]


const mockPayload = [{
    "hostname": "a01apvl069.devillo.central",
    "ipAddress": "10.0.69.96",
    "owner": "jOhAN yUmYuM",
    "application": "SERA",
    "environment": "DEV",
    "cpu": 2,
    "memory": 16,
    "type": "WAS",
    "created": "2017-02-14T14:46:36.182Z",
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
    },
    "notes": 'n/a',
    "rpm_version": 'n/a',
    "rpm_cluster": 'n/a',
    "rpm_time": '2017-02-02T16:54:05Z'
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
    },
    "notes": 'n/a',
    "rpm_version": 'n/a',
    "rpm_cluster": 'n/a',
    "rpm_time": 'n/a'
}];

