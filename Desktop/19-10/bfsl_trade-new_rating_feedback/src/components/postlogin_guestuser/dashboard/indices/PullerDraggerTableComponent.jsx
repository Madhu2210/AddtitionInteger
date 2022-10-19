import React from 'react'

import LangText from '../../../../common/lang/LangText';
import { WidgetLoader } from '../../../common/WidgetLoaderComponent';

import { gotoQuote } from '../../../../common/Bridge';

function PullerDraggerTableComponent(props) {

    function gotoQuoteView(item, fullView = false) {
        gotoQuote(item, fullView)
    }

    return (
        <div className="pullersDraggers-details">
            <div className="base">
                <div className="pd-title">
                    <span className="pullers">
                        <LangText module="TABLE_HEADERS" name="PULLERS" />
                    </span>
                    <span className="draggers">
                        <LangText module="TABLE_HEADERS" name="DRAGGERS" />
                    </span>
                </div>
                <div className="pd-content">
                    {
                        (props.positiveContributions.length || props.negativeContributions.length) ?
                            <>
                                <div className="pullers-left">
                                    {
                                        props.positiveContributions.length ?
                                            props.positiveContributions.map((item, index) => {
                                                return (
                                                    <div className="row" key={index}>
                                                        <div className="symbol-name cursor quote-click"
                                                            onClick={() => gotoQuoteView(item, true)} >
                                                            {item.dispSym}
                                                        </div>
                                                        <div className="contributions-pullers">
                                                            {item.contributn}
                                                        </div>
                                                    </div>

                                                )
                                            })
                                            : <div className="empty-ErrMsg">
                                                <LangText name="COMMON_NO_DATA" module="MESSAGES" />
                                            </div>
                                    }
                                </div>
                                <div className="draggers-right">
                                    {
                                        props.negativeContributions.length ?
                                            props.negativeContributions.map((item, index) => {
                                                return (
                                                    <div className="row" key={index}>
                                                        <div className="symbol-name cursor quote-click"
                                                            onClick={() => gotoQuoteView(item, true)}
                                                        >
                                                            {item.dispSym}
                                                        </div>
                                                        <div className="contributions-draggers">
                                                            {item.contributn}
                                                        </div>
                                                    </div>
                                                )
                                            })
                                            : <div className="empty-ErrMsg">
                                                <LangText name="COMMON_NO_DATA" module="MESSAGES" />
                                            </div>
                                    }
                                </div>
                            </>
                            :
                            <div className="errorMsg"> {props.contributionErr} </div>
                    }
                </div>

            </div>
        </div>
    )
}
export default WidgetLoader(PullerDraggerTableComponent);