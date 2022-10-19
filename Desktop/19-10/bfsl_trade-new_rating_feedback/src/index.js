import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import useFetch, {
    streamingManagerV2, withStreamingV2, Request as MsfRequest, apiConfig,
    encrypt, decrypt, AppManager, DEFAULT_PKT_INFO
} from '@msf/msf-reactjs-weblib-base'

import App from './App';
// import * as serviceWorker from './serviceWorker';

import Store from './state/Store'

export {
    useFetch as useFetch,
    MsfRequest,
    apiConfig as apiConfig,
    streamingManagerV2 as streamingManager,
    withStreamingV2 as withStreaming,
    encrypt as encrypt,
    decrypt as decrypt,
    AppManager as AppManager,
    DEFAULT_PKT_INFO
}

ReactDOM.render(<Provider store={Store}>
    <App />
</Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
