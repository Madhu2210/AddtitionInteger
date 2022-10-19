import React, {useEffect, useState} from "react";
import { withRouter } from "react-router-dom";
import { SCREENS } from "../../../common/Constants";
import LangText from "../../../common/lang/LangText";

function IPOandNCDHeaderComponent(props) {

    const [ncdSelected, setNcdSelected] = useState(false)
    const [ipoSelected, setIpoSelected] = useState(false)

    useEffect(() => {
        if(props.history && props.history.location && props.history.location.pathname) {
            if(props.history.location.pathname === SCREENS.IPO) {
                setIpoSelected(true) 
                setNcdSelected(false)
            }
            else if(props.history.location.pathname === SCREENS.NCD) {
                setIpoSelected(false) 
                setNcdSelected(true) 
            }
        }

    }, [])

    function onSelectNcd() {
        props.history.push(SCREENS.NCD)
    }

    function onSelectIpo() {
        props.history.push(SCREENS.IPO)
    }

    return(
        <div>
            <div className="ipo-ncd-headers">
                <div className={`head-name ${ipoSelected ? "selected" : ""} cursor`} onClick={onSelectIpo}>
                    <LangText name="IPO_s" module="IPO" />
                </div>
                <div className={`head-name ${ncdSelected ? "selected" : '' } cursor`} onClick={onSelectNcd}>
                    <LangText name="NCD_s" module="IPO" />
                </div>
            </div>
        </div>
    )
}
export default (withRouter(IPOandNCDHeaderComponent));