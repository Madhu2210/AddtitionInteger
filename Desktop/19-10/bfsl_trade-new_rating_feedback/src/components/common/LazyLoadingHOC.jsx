import React, {  useRef, useState } from 'react';

const defaultLoadLimit = 50
const defaultScrollLimit = 100

export const LazyLoading = (Comp) => {

    const LazyLoadingHOC = (props) => {

        const [list, setList] = useState([])
        const [loadLimit] = useState(defaultLoadLimit)
        const [limit, setLimit] = useState(defaultScrollLimit)
        const [disableScroll, setDisableScroll] = useState(false)
        const [visibleList, setVisibleList] = useState([])

        const originalList = useRef([])
        const cutLength = useRef(0)
        const scrollElement = useRef(null)
        const disableLazyLoad = useRef(false)
        const elementRowHeight = useRef(65)

        function setScrollLimit(limitVal) {
            setLimit(limitVal)
            // cutLength.current = limitVal
        }

        function setOriginalList(array, limitVal = loadLimit) {
            if (!disableLazyLoad.current) {
                originalList.current = array
                setList(array.slice(0, limitVal))
                cutLength.current = limitVal
                if (scrollElement.current)
                    scrollElement.current.scrollTo(0, 0)
            } else
                setList(array)

            let element = scrollElement.current
            let maxViewRow = Math.ceil(element.clientHeight / elementRowHeight.current);
            setVisibleList(array.slice(0, maxViewRow))
        }

        function setElementRowHeight(height) {
            elementRowHeight.current = height
        }

        function setDisableLazyLoad(flag) {
            disableLazyLoad.current = flag
        }

        function onScrollDiv(e) {
            if (!disableScroll) {
                let element = e.target
                let maxViewRow = Math.ceil(element.clientHeight / elementRowHeight.current);
                let scrolledViewPercent = 100 * ((element.clientHeight + element.scrollTop) / element.scrollHeight)
                let scrolledListCount = null
                let updatedList = null
                if (((element.scrollHeight * (90 / 100)) - element.scrollTop < element.clientHeight) &&
                 !disableLazyLoad.current) {
                    cutLength.current = cutLength.current + limit
                    let lazList = originalList.current.slice(0, cutLength.current)
                    updatedList = lazList
                    if (lazList.length) {
                        scrolledListCount = lazList.length * ((scrolledViewPercent) / 100)
                    }
                    setList(lazList)
                } else {
                    if (list.length) {
                        updatedList = list
                        scrolledListCount = list.length * ((scrolledViewPercent) / 100)
                    }
                }
                if (scrolledListCount)
                    scrolledListCount = Math.ceil(scrolledListCount)
                let upDatedLists = Object.assign([], updatedList)
                let scrolledList = upDatedLists.splice(0, scrolledListCount).map((i => {
                    return i
                }))
                let topCutIndex = (scrolledList.length - 1) - (maxViewRow)
                let viewableList = scrolledList.splice((topCutIndex < 0 ? 0 : topCutIndex),
                    (scrolledList.length + 1)).map((i => {
                    return i
                }))
                setVisibleList(viewableList)
            }
        }

        function setScrollRef(ref) {
            scrollElement.current = ref
        }

        function setDisableScrollFlag(flag) {
            setDisableScroll(flag)
        }

        return (
            <>
                <Comp {...props}
                    lazyList={list}
                    setOriginalList={setOriginalList}
                    onScrollDiv={onScrollDiv}
                    setScrollLimit={setScrollLimit}
                    setScrollRef={setScrollRef}
                    setDisableScrollFlag={setDisableScrollFlag}
                    setDisableLazyLoad={setDisableLazyLoad}
                    visibleList={visibleList}
                    setElementRowHeight={setElementRowHeight}
                />
            </>
        );
    }

    return LazyLoadingHOC;
}

export default LazyLoading;