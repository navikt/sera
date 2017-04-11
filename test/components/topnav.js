'use strict';
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import TopNav from '../../frontend/src/js/components/topnav';
import OptionsPopover  from '../../frontend/src/js/components/optionspopover'
import AuraToolsPopover from '../../frontend/src/js/components/auratoolspopover.js'

let wrapper;

describe('(Component) TopNav', () => {

    it('renders TopNav without exploding', () => {
        wrapper = shallow(<TopNav visibility={visibility} filters={filters}/>);
        expect(wrapper).to.have.length(1);
    });

    it('renders OptionsPopover component once', () => {
        expect(wrapper.find(OptionsPopover)).to.have.length(1);
    });

    it('renders AuraToolsPopover component once', () => {
        expect(wrapper.find(AuraToolsPopover)).to.have.length(1);
    });

    it('should call´toggleRegexpMode´ when clicked', () => {
        const toggleRegexpMode = sinon.spy(() => {
        });
        wrapper = shallow(<TopNav toggleRegexpMode={toggleRegexpMode} filters={filters}/>);
        wrapper.find('#toggle-regexpMode').simulate('click');
        expect(toggleRegexpMode.callCount).to.equal(1);
    });

    it('should call ´clearFilters´ when clicked', () => {
        const clearFilters = sinon.spy(() => {
        });
        wrapper = shallow(<TopNav clearFilters={clearFilters} filters={filters}/>);
        wrapper.find('#clear-filters').simulate('click');
        expect(clearFilters.callCount).to.equal(1);
    });

    it('should switch css class if prop ´filters.regexp´ equals TRUE', () => {
        const filtersRegexpTrue = {
            regexp: true
        };
        wrapper = shallow(<TopNav filters={filtersRegexpTrue}/>);
        expect(wrapper.find('.sera-topnav-btn-active')).to.have.length(1);
    });
});


const visibility = {
    hostname: true,
    application: true,
    environment: true,
    type: true,
    unit: true,
    site: true,
    created: false,
    ipAddress: false,
};

const filters = {
    hostname: '',
    application: '',
    environment: '',
    type: '',
    unit: '',
    site: '',
    created: '',
    ipAddress: '',
    regexp: false
};




