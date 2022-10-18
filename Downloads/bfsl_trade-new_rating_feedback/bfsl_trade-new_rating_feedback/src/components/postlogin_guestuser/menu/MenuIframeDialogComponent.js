import React, { useEffect, useRef, useState } from 'react'

import DialogLoader from '../../common/ModalDialogLoaderComponent';

import { CloseIcon } from "../../common/FontIcons";

function MenuIframeDialogComponent(props) {

    const [showLoader, setShowLoader] = useState(false)

    const formRef = useRef(null)

    useEffect(() => {
        if (props.iFrameData) {
            setShowLoader(true)
            if (formRef.current)
                formRef.current.submit()
            if (!props.isModalIframe)
                props.onCloseIframeCB()
        }
    }, [props.iFrameData])

    function onLoadIframe() {
        setShowLoader(false)
    }

    if (!props.iFrameData)
        return null

    if (props.isModalIframe)
        return (
            <div className="app-modalDialog2 iFrame_dialog">
                <div className="window">

                    <DialogLoader
                        show={showLoader}
                    />
                    <div className="closeIcon-div flex-center" onClick={props.onCloseIframeCB} id="closeBtn">
                        <CloseIcon />
                    </div>

                    <form action={props.iFrameData.url}
                        method={props.iFrameData.type}
                        target="menu_iFrame" ref={formRef} >
                        {
                            (props.iFrameData.params && props.iFrameData.params.length) ?
                                props.iFrameData.params.map((item, index) => {
                                    return <input type="hidden" key={index} name={item.key} value={item.value} />
                                })
                                : null
                        }
                    </form>

                    <iframe className="content"
                        name="menu_iFrame" id="menu_iFrame"
                        frameBorder="0"
                        onLoad={(e) => onLoadIframe(e)} />

                </div>
            </div>
        )

    return (
        <form action={props.iFrameData.url} method={props.iFrameData.type} target="_blank" ref={formRef} >
            {
                (props.iFrameData.params && props.iFrameData.params.length) ?
                    props.iFrameData.params.map((item, index) => {
                        return <input type="hidden" key={index} name={item.key} value={item.value} />
                    })
                    : null
            }
        </form>
    )
}

export default MenuIframeDialogComponent;