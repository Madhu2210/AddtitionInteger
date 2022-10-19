import React from "react"
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux'

import { SCREENS } from "../../common/Constants";

function LoanAuthorized(props) {

    const { component: Component, ...rest } = props;

    return (
        <>
            <Route {...rest} exact render={compProps => {
                return props.loanInit
                    ? <Component {...compProps} />
                    : <Redirect to={SCREENS.HOME} />
            }} />
        </>
    )
}

const mapStateToProps = ({ las }) => {
    return {
        loanInit: las.loanInit
    }
}

export default connect(mapStateToProps, null)(LoanAuthorized);