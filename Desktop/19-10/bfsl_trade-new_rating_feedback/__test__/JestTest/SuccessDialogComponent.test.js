import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import { shallow, mount, render, configure } from 'enzyme';
import SuccessDialogComponent from '../../src/components/postlogin/orders/SuccessDialogComponent'
import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";

const mockStore = configureMockStore();
const store = mockStore({});
const mockCallBack = jest.fn();
configure({ adapter: new Adapter() })

const wrapper = shallow((<Provider store={store}><SuccessDialogComponent /></Provider>));

describe('SuccessDialogComponent  snapshot testing', () => {
    it('renders app module correctly', () => {
        expect(wrapper).toMatchSnapshot();
    });
});


describe('SuccessDialogComponent Component', () => {
    it('should render without throwing an error', () => {
        expect(wrapper.exists()).toBe(true)
    })
})
describe('', () => {
    const onCloseCB = jest.fn()
    const root = shallow(<SuccessDialogComponent onCloseCB={onCloseCB} />)
    it('should have one button', () => {
        console.log(root.debug())
        const container = root.find("button")
        expect(container).toHaveLength(1);
    })
    it('should called onCloseCB', () => {
        console.log(root.debug())
        const container = root.find("button")
        container.simulate('click')
        expect(onCloseCB).toHaveBeenCalled();
    })

    it('should have one button', () => {
        const container = root.find('Connect(LangText)')
        expect(container).toHaveLength(2);
    })
})