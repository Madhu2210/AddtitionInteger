import React, { useState } from 'react';

import LoaderImageComponent from '../common/LoaderImageComponent';

const WidgetLoaderComponent = (props) => {
    return (
        <>
            {
                props.errorMsg ?
                    <span className="loaderError-msg">
                        {props.errorMsg}
                    </span>
                    :
                    <LoaderImageComponent hideBG={props.hideBG} />
            }
        </>
    );
}

export const WidgetLoader = (Comp) => {

    const LoaderHOC = (props) => {

        const [active, setActive] = useState(false)
        const [errorMsg, setErrorMsg] = useState(null)
        const [tableLoader, setTableLoader] = useState(false)
        const [hideBG, setHideBG] = useState(false)

        function showWidgetLoader(hideBackGround = false) {
            setActive(true)
            setHideBG(hideBackGround)
        }

        function hideWidgetLoader() {
            setActive(false)
            setErrorMsg(null)
            setHideBG(false)
        }

        function setInfoMsg(msg) {
            setErrorMsg(msg)
            if (msg)
                setActive(true)
            else
                setActive(false)
        }

        function setTableLoaderFlag() {
            setTableLoader(true)
        }

        return (
            <div className={`widget-loader-div ${tableLoader ? 'table-loader' : ''}`}>

                {active && <WidgetLoaderComponent errorMsg={errorMsg} hideBG={hideBG} />}

                <Comp {...props}
                    showWidgetLoader={showWidgetLoader}
                    hideWidgetLoader={hideWidgetLoader}
                    setTableLoader={setTableLoaderFlag}
                    setInfoMsg={setInfoMsg}
                />
            </div>
        );
    }

    return LoaderHOC;
}

export default WidgetLoaderComponent;