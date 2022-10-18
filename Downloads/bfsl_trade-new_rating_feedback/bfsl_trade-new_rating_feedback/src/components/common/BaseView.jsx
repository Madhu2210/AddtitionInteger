import React from 'react';

const ErrorView = ({ errorMsg }) => {

    if (!errorMsg || errorMsg.length === 0)
        return null;

    return (
        <div className="flex-center" style={{ height: '100vh' }}>
            {errorMsg}
        </div>
    );

}

const BaseView = ({ errorMsg, children }) => {

    return (
        <span>
            <ErrorView errorMsg={errorMsg} />
            {children}
        </span>

    );
}

export default BaseView;