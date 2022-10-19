import  { useEffect } from 'react'

import { closeAllPopup } from '../common/Bridge';

function useCloseModal() {

    function useOutsideAlerter(ref, closeCB, allClose = true) {
        useEffect(() => {
            /**
             * Alert if clicked on outside of element
             */
            function handleClickOutside(eve) {
                if (ref.current && !ref.current.contains(eve.target)) {
                    closeCB && closeCB()
                    if (allClose)
                        closeAllPopup()
                }
            }

            // Bind the event listener
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                // Unbind the event listener on clean up
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }

    return (
        { useOutsideAlerter }
    )
}

export default (useCloseModal);