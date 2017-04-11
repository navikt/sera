import React from 'react'
import { shallow } from 'enzyme';
import { expect } from 'chai'
import OptionsPopover from '../../frontend/src/js/components/optionspopover'


describe('(Component) OptionsPopover', () => {

    it('renders OptionsPopover without exploding', () => {
        let wrapper = shallow(<OptionsPopover { ...props }/>)
        expect(wrapper).to.have.length(1);
    })

    it('should show menu option ´type´ as clickable if prop ´visibility.type´ equals TRUE', () => {
        let wrapper = shallow(<OptionsPopover { ...props } visibility={{ type: true }}/>)
        expect(wrapper.props().overlay.props.children.props.children[0].props.className).to.equal("toggle-visibility-btn-on")
    })

    it('should show menu option ´type´ as unclickable if prop ´visibility.type´ equals FALSE', () => {
        let wrapper = shallow(<OptionsPopover { ...props } visibility={{ type: false }}/>)
        expect(wrapper.props().overlay.props.children.props.children[0].props.className).to.equal("toggle-visibility-btn-off")
    })

    it('should show menu option ´environment´ as clickable if prop ´visibility.environment´ equals TRUE', () => {
        let wrapper = shallow(<OptionsPopover { ...props } visibility={{ environment: true }}/>)
        expect(wrapper.props().overlay.props.children.props.children[1].props.className).to.equal("toggle-visibility-btn-on")
    })

    it('should show menu option ´environment´ as unclickable if prop ´visibility.environment´ equals FALSE', () => {
        let wrapper = shallow(<OptionsPopover { ...props } visibility={{ environment: false }}/>)
        expect(wrapper.props().overlay.props.children.props.children[1].props.className).to.equal("toggle-visibility-btn-off")
    })

    it('should show menu option ´application´ as clickable if prop ´visibility.application´ equals TRUE', () => {
        let wrapper = shallow(<OptionsPopover { ...props } visibility={{ application: true }}/>)
        expect(wrapper.props().overlay.props.children.props.children[2].props.className).to.equal("toggle-visibility-btn-on")
    })

    it('should show menu option ´application´ as unclickable if prop ´visibility.application´ equals FALSE', () => {
        let wrapper = shallow(<OptionsPopover { ...props } visibility={{ application: false }}/>)
        expect(wrapper.props().overlay.props.children.props.children[2].props.className).to.equal("toggle-visibility-btn-off")
    })

    it('should show menu option ´unit´ as clickable if prop ´visibility.unit´ equals TRUE', () => {
        let wrapper = shallow(<OptionsPopover { ...props } visibility={{ unit: true }}/>)
        expect(wrapper.props().overlay.props.children.props.children[3].props.className).to.equal("toggle-visibility-btn-on")
    })

    it('should show menu option ´unit´ as unit if prop ´visibility.unit´ equals FALSE', () => {
        let wrapper = shallow(<OptionsPopover { ...props } visibility={{ unit: false }}/>)
        expect(wrapper.props().overlay.props.children.props.children[3].props.className).to.equal("toggle-visibility-btn-off")
    })

    it('should show menu option ´site´ as clickable if prop ´visibility.site´ equals TRUE', () => {
        let wrapper = shallow(<OptionsPopover { ...props } visibility={{ site: true }}/>)
        expect(wrapper.props().overlay.props.children.props.children[4].props.className).to.equal("toggle-visibility-btn-on")
    })

    it('should show menu option ´site´ as unit if prop ´visibility.site´ equals FALSE', () => {
        let wrapper = shallow(<OptionsPopover { ...props } visibility={{ site: false }}/>)
        expect(wrapper.props().overlay.props.children.props.children[4].props.className).to.equal("toggle-visibility-btn-off")
    })

    it('should show menu option ´rpm´ as clickable if prop ´visibility.rpm_rpm´ equals TRUE', () => {
        let wrapper = shallow(<OptionsPopover { ...props } visibility={{ rpm_rpm: true }}/>);
        expect(wrapper.props().overlay.props.children.props.children[5].props.className).to.equal("toggle-visibility-rpm-btn-on")
    })

    it('should show menu option ´rpm´ as unit if prop ´visibility.rpm_rpm´ equals FALSE', () => {
        let wrapper = shallow(<OptionsPopover { ...props } visibility={{ rpm_rpm: false }}/>);
        expect(wrapper.props().overlay.props.children.props.children[5].props.className).to.equal("toggle-visibility-rpm-btn-off")
    });

    it('should show menu option ´rpm version´ as clickable if prop ´visibility.rpm_version´ equals TRUE', () => {
        let wrapper = shallow(<OptionsPopover { ...props } visibility={{ rpm_version: true }}/>)
        expect(wrapper.props().overlay.props.children.props.children[6].props.className).to.equal("toggle-visibility-rpm-btn-on")
    })

    it('should show menu option ´rpm version´ as unit if prop ´visibility.rpm_version´ equals FALSE', () => {
        let wrapper = shallow(<OptionsPopover { ...props } visibility={{ rpm_version: false }}/>)
        expect(wrapper.props().overlay.props.children.props.children[6].props.className).to.equal("toggle-visibility-rpm-btn-off")
    });

    it('should show menu option ´notes´ as clickable if prop ´visibility.notes´ equals TRUE', () => {
        let wrapper = shallow(<OptionsPopover { ...props } visibility={{ notes: true }}/>)
        expect(wrapper.props().overlay.props.children.props.children[7].props.className).to.equal("toggle-visibility-btn-on")
    })

    it('should show menu option ´notes´ as unit if prop ´visibility.notes´ equals FALSE', () => {
        let wrapper = shallow(<OptionsPopover { ...props } visibility={{ notes: false }}/>)
        expect(wrapper.props().overlay.props.children.props.children[7].props.className).to.equal("toggle-visibility-btn-off")
    })

    it('should show menu option ´created´ as clickable if prop ´visibility.created´ equals TRUE', () => {
        let wrapper = shallow(<OptionsPopover { ...props } visibility={{ created: true }}/>)
        expect(wrapper.props().overlay.props.children.props.children[8].props.className).to.equal("toggle-visibility-btn-on")
    })

    it('should show menu option ´notes´ as unit if prop ´visibility.notes´ equals FALSE', () => {
        let wrapper = shallow(<OptionsPopover { ...props } visibility={{ created: false }}/>)
        expect(wrapper.props().overlay.props.children.props.children[8].props.className).to.equal("toggle-visibility-btn-off")
    })

    it('should show menu option ´ipAddress´ as clickable if prop ´visibility.ipAddress´ equals TRUE', () => {
        let wrapper = shallow(<OptionsPopover { ...props } visibility={{ ipAddress: true }}/>)
        expect(wrapper.props().overlay.props.children.props.children[9].props.className).to.equal("toggle-visibility-btn-on")
    })

    it('should show menu option ´ipAddress´ as unit if prop ´visibility.ipAddress´ equals FALSE', () => {
        let wrapper = shallow(<OptionsPopover { ...props } visibility={{ ipAddress: false }}/>)
        expect(wrapper.props().overlay.props.children.props.children[9].props.className).to.equal("toggle-visibility-btn-off")
    })

});

const props = {
    itemRenderCount: '20',
    toggleVisibility: fn => fn,
    visibility: {
        hostname: false,
        application: false,
        environment: false,
        type: false,
        unit: false,
        site: false,
        rpm_rpm: false,
        rpm_cluster: false,
        rpm_version: false,
        rpm_time: false,
        notes: false,
        created: false,
        ipAddress: false,
    }
}
