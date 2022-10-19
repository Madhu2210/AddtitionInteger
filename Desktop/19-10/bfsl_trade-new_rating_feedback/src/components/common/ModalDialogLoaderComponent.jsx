import React from 'react'

import LoaderImage from './LoaderImageComponent'

const ModalDialogLoaderComponent = (props) => {
    if (!props.show)
        return null
    return (
        <div className="modalDialog-loader">
            <LoaderImage />
        </div>
    )
}

export default ModalDialogLoaderComponent;