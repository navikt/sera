import 'jsdom-global/register';
import React from 'react'
import { shallow } from 'enzyme';
import { expect } from 'chai'
import AuraToolsPopover from '../../frontend/src/js/components/auratoolspopover'


describe('(Component) AuraToolsPopover', () => {

    it('renders AuraToolsPopover without exploding', () => {
        let wrapper = shallow(<AuraToolsPopover/>)
        expect(wrapper).to.have.length(1);
    })
})