import React from 'react';

const LoaderImageComponent = (props) => {
    return (
        <div className={`loader-container ${props.hideBG ? 'hideBackground' : ''}`}>
            {/* <div className='loading-div flex-center'>
                <div className="spinner">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                </div>
            </div> */}
            <img className="loader-image" src="assets/images/dashboard/bfsl_loader.gif" alt="" />
        </div>
    );
}

export default LoaderImageComponent;