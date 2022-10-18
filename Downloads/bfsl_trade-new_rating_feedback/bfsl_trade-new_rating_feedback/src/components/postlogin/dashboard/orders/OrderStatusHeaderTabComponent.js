import React, { useEffect, useRef, useState } from 'react'
import { connect } from "react-redux";
import { useFetch, MsfRequest } from '../../../../index'

import { DASHBOARD_SERVICES } from '../../../../config/ServiceURLs';

import { getBaseURL, checkEmpty } from '../../../../common/CommonMethods';
import { DASHBOARD_ORDER_TABS, ORDER_STATUS, SET_TIMEOUT_INTERVAL } from '../../../../common/Constants';
import { storeRegetOrderStatus } from '../../../../state/actions/Actions';
import LangText from '../../../../common/lang/LangText';

function OrdersHeaderTabComponent(props) {
    const MsfFetch = useFetch()

    const [orderCount, setOrderCount] = useState({})

    const apiInterval = useRef(null)

    useEffect(() => {
        getOrderCount()
        apiInterval.current = setInterval(() => {
            getOrderCount()
        }, SET_TIMEOUT_INTERVAL.ORDER_INERVAL);

        return () => {
            clearRefreshInterval()
        };
    }, [])

    useEffect(() => {
        if (props.orderMenu.showOrderMenu) {
            props.onSelectTab(DASHBOARD_ORDER_TABS.ORDER_STATUS)
            getOrderCount()
        }
    }, [props.orderMenu])

    useEffect(() => {
        if (props.regetOrderStatus) {
            getOrderCount()
            props.storeRegetOrderStatus(false)
        }
    }, [props.regetOrderStatus])

    function clearRefreshInterval() {
        clearInterval(apiInterval.current)
    }

    function getOrderCount() {
        let request = new MsfRequest();
        MsfFetch.placeRequest(
            getBaseURL() + DASHBOARD_SERVICES.ORDER_COUNT,
            request,
            successRespCBGetOrderCount,
            errorRespCBGetOrderCount
        )
    }

    function successRespCBGetOrderCount(response) {
        setOrderCount(response.data.orderCount)
    }

    function errorRespCBGetOrderCount() {
        setOrderCount({})
    }

    return (
        <div className={`tab last order ${(props.selectedTab === DASHBOARD_ORDER_TABS.ORDER_STATUS) ? 'selected' : ''}`}
            onClick={() => props.onSelectTab(DASHBOARD_ORDER_TABS.ORDER_STATUS)}
        >
            <div className="label">
                <span className="head"><LangText module="ORDER_STATUS_HEADER" name="ORDER_STATUS" /></span>
                {/* <span className="valueLabel"><LangText module="ORDER_STATUS_HEADER" name="PENDING" /></span>
                <span className="valueLabel"><LangText module="ORDER_STATUS_HEADER" name="EXECUTED" /></span> */}
            </div>
            <div className="value">
                <span className="head valueLabel"></span>
                {/* <span className="pending-val">{checkEmpty(orderCount[ORDER_STATUS.PENDING])}</span>
                <span className={orderCount[ORDER_STATUS.EXECUTED] ? 'positiveColor' : ''}>
                    {checkEmpty(orderCount[ORDER_STATUS.EXECUTED])}
                </span> */}
            </div>
        </div>
    )
}

const mapStateToProps = ({ order }) => {
    return {
        orderMenu: order.orderMenu,
        regetOrderStatus: order.regetOrderStatus
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeRegetOrderStatus: (s) => { dispatch(storeRegetOrderStatus(s)) },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrdersHeaderTabComponent);