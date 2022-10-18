import React from 'react'
import { connect } from "react-redux";

import LangText from '../../common/lang/LangText'

import { storeQuoteDialogDetails } from '../../state/actions/Actions';

import { QUOTE_DIALOGS, ORDER_TYPES } from '../../common/Constants'
import { gotoTrade, stockReport } from '../../common/Bridge'
import { ReportIcon } from '../common/FontIcons';

const NewsListComponent = props => {

    function onClickNews(newsObj) {
        props.storeQuoteDialogDetails({
            dialogName: QUOTE_DIALOGS.NEWS_DETAILS,
            newsId: newsObj.storyID
        })
    }

    function onClickBuy_Sell(e, symData, type) {
        e.stopPropagation();
        e.preventDefault();
        if (type === ORDER_TYPES.BUY)
            gotoTrade(symData, ORDER_TYPES.BUY)
        else if (type === ORDER_TYPES.SELL)
            gotoTrade(symData, ORDER_TYPES.SELL)
    }

    function onClickStockReport(e) {
        e.stopPropagation();
        e.preventDefault();
        stockReport()
    }

    return (
        <div className="newsList_div contentDiv scrollArea scroller_firefox">
            {
                (props.newsData && props.newsData.length) ?
                    props.newsData.map((item, index) => {
                        return (
                            <div key={index}
                                className="row newsRow"
                                onClick={() => onClickNews(item)}
                            >
                                <div className="list_icon_div">
                                    <span className="list_icon"></span>
                                </div>
                                <div key={index} className="dataRow">
                                    <span>{item.txt}</span>
                                    <span className="date_time">{item.date}</span>
                                    {
                                        (item.symbols && item.symbols.length) ?
                                            <>
                                                <div className="symexc">
                                                    <span className="symName">{item.symbols[0].dispSym}</span>
                                                    <span className="excName">{item.symbols[0].sym.exc}</span>
                                                </div>
                                                <span className="button_div">
                                                    <button className="buy-btn" onClick={(e) => 
                                                        onClickBuy_Sell(e, item.symbols[0], ORDER_TYPES.BUY)}>
                                                        <LangText name="BUY_BTN" />
                                                    </button>
                                                    <button className="sell-btn" onClick={(e) => 
                                                        onClickBuy_Sell(e, item.symbols[0], ORDER_TYPES.SELL)}>
                                                        <LangText  name="BUY_BTN" />
                                                    </button>
                                                    <button className="stock_report_btn" onClick={(e) => 
                                                        onClickStockReport(e, item)}>
                                                        <div className="flex-center">
                                                            <ReportIcon />
                                                            <LangText module="BUTTONS" name="STOCK_REPORT" /> +
                                                        </div>
                                                    </button>
                                                </span>
                                            </>
                                            : null
                                    }
                                </div>
                            </div>
                        )
                    })
                    :
                    <div className="errorDiv flex-center">
                        {props.errorMsg ? props.errorMsg : ''}
                    </div>
            }
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeQuoteDialogDetails: (s) => { dispatch(storeQuoteDialogDetails(s)) }
    };
};

export default connect(null, mapDispatchToProps)(NewsListComponent);