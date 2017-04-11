'use strict'
import React from 'react'
import { shallow  } from 'enzyme'
import sinon from 'sinon'
import { expect } from 'chai'
import Sigmarow from '../../frontend/src/js/components/sigmarow'


describe('(Component) Sigmarow', () => {

    it('renders Sigmarow without exploding', () => {
        let wrapper = shallow(<Sigmarow { ...props }/>)
        expect(wrapper).to.have.length(1);
    });

    it('should initially show up to 20 servers',() => {
        let wrapper = shallow(<Sigmarow { ...props }/>)
        expect(wrapper.find('.addrow-text').props().children[1]).to.equal('20')
    })

    it('should increase amount of servers to show according to prop ´itemRenderCount´',() => {
        let wrapper = shallow(<Sigmarow  { ...props } itemRenderCount="40"/>)
        expect(wrapper.find('.addrow-text').props().children[1]).to.equal('40')
    })

    it('should call function ´addRemoveRows´ with argument ´decrease´ when clicked', () => {
        const addRemoveRows = sinon.spy(() => {
        })
        let wrapper = shallow(<Sigmarow { ...props } addRemoveRows={addRemoveRows} />)
        wrapper.find('#decrease-btn').simulate('click')
        expect(addRemoveRows.callCount).to.equal(1)
        expect(addRemoveRows.args[0][0]).to.equal('decrease')
    })

    it('should call function ´addRemoveRows´ with argument ´increase´ when clicked', () => {
        const addRemoveRows = sinon.spy(() => {
        })
        let wrapper = shallow(<Sigmarow { ...props } addRemoveRows={addRemoveRows} />)
        wrapper.find('#increase-btn').simulate('click')
        expect(addRemoveRows.callCount).to.equal(1)
        expect(addRemoveRows.args[0][0]).to.equal('increase')
    })

    it('should calculate total CPU',() => {
        let wrapper = shallow(<Sigmarow { ...props }/>)
        expect(wrapper.find('#cpu').props().children).to.equal(4)
    })

    it('should calculate total MEMORY',() => {
        let wrapper = shallow(<Sigmarow { ...props }/>)
        expect(wrapper.find('#memory').props().children[0]).to.equal(32)
    })

    it('should calculate total DISK',() => {
        let wrapper = shallow(<Sigmarow { ...props }/>)
        expect(wrapper.find('#disk').props().children[0]).to.equal(200)
    })


});

const props = {
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
    itemRenderCount: '20',
    addRemoveRows: fn => fn
};
