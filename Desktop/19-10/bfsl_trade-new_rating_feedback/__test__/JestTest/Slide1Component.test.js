import React from 'react'

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });


import { shallow,mount } from 'enzyme';

import Slide1Component from '../../src/components/prelogin/login/Slide1Component'


describe('rendering LoginComponent ',()=>{
    test('',()=>{
        const wrapper=mount(<Slide1Component />)
        // console.log(wrapper)
        expect(wrapper.exists()).toBe(true)
    })
})

