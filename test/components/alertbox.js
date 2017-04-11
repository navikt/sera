'use strict'
import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import { expect } from 'chai'
import AlertBox from '../../frontend/src/js/components/alertbox'


describe('(Component) AlertBox', () => {

    it('renders AlertBox without exploding', () => {
        let wrapper = shallow(<AlertBox { ...props }/>)
        expect(wrapper).to.have.length(1);
    });

    it('should show alertbox if prop ´isDatabaseUpdateWarningShowing´ equals TRUE', () => {
        let wrapper = shallow(<AlertBox { ...props }/>);
        expect(wrapper.find('.show-alert')).to.have.length(1);
    });

    it('should hide alertbox if prop ´isDatabaseUpdateWarningShowing´ equals FALSE', () => {
        let wrapper = shallow(<AlertBox { ...props } isDatabaseUpdateWarningShowing={false}/>);
        expect(wrapper.find('.hide-alert')).to.have.length(1);
    });

    it('should call function ´dismissAlert´ when clicked', () => {
        let dismissAlert = sinon.spy(() => {
        })
        let wrapper = shallow(<AlertBox { ...props } dismissAlert={dismissAlert} />)
        wrapper.find('.alert-btn').simulate('click')
        expect(dismissAlert.callCount).to.equal(1)
    })

});

const props = {
    isDatabaseUpdateWarningShowing: true,
    dismissAlert: fn => fn
}
