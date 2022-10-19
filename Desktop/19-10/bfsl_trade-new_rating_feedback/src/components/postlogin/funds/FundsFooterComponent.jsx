import React, { useEffect, useState } from 'react'

import { LOCAL_STORAGE } from '../../../common/Constants'
import { getItemFromSessionStorage } from '../../../common/LocalStorage'

function FundsFooterComponent() {

    const [footerContent, setFooterContent] = useState();
    useEffect(() => {
        getDetails()
    }, [])

    function getDetails() {
        let fundFooterContent = getItemFromSessionStorage(LOCAL_STORAGE.FUND_TRANSFER_FOOTER_CONTENT)
        if (fundFooterContent) {
            fundFooterContent = JSON.parse(fundFooterContent)
            setFooterContent(fundFooterContent)
        }
    }

    return (
        <div className="fund-footer-content">
            {
                footerContent ?
                    footerContent.map((item) => {
                        return (
                            <> 
                                <ul  className="footer-list">
                                    <li>
                                        {item}
                                    </li>
                                </ul>
                       
                            </>
                        )
                    })
                    : null
            }

        </div>
    )
}

export default FundsFooterComponent;