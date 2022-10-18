import React, { useState } from 'react';

import LoaderImage from './LoaderImageComponent'

export const LoaderComponent = (props) => {

    function onClickLoaderDiv() {
        props.onClickOut && props.onClickOut()
    }

    return (
        <div className="loader" onClick={onClickLoaderDiv}>
            {props.hideLoader ?
                null
                :
                <LoaderImage />
            }
        </div>
    );
}

export const Loader = (Comp) => {

    const LoaderHOC = (props) => {

        const [active, setActive] = useState()

        function showLoader() { setActive(true) }

        function hideLoader() { setActive(false) }

        return (
            <>
                {active && <LoaderComponent />}
                <Comp {...props}
                    showLoader={showLoader}
                    hideLoader={hideLoader}
                />
            </>
        );
    }

    return LoaderHOC;
}

export default LoaderComponent;