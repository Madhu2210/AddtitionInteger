import React from 'react';

import { checkEmpty } from '../../common/CommonMethods'

function QuoteDetailsGradient(props) {
    return (
        <div className="quote-detai-gradient">
            <div className="values">
                <span> {checkEmpty(props.low)} </span>
                <span> {checkEmpty(props.high)} </span>
            </div>
            <div className="gradient">

            </div>

        </div>
    );
}

export default QuoteDetailsGradient;
