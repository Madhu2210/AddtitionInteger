/* eslint-disable */
let quoteFeedSimulator = {};
quoteFeedSimulator.maxTicks = 20000;
let streamingEnabled = false;

const getISTTimeZone = (date) => {
    let istTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60 * 1000));
    return istTime;
}

quoteFeedSimulator.getPreviousDay = function (howManyDays) {
    return new Date(new Date() - howManyDays * 24 * 60 * 60 * 1000)
}

quoteFeedSimulator.fetchInitialData = function (symbol, suggestedStartDate, suggestedEndDate, params, cb) {
    console.log('fetchInitialData :', params);
    let newParams = getCurrentParams(params)
    streamingEnabled = false;
    quoteFeedSimulator.postRequest(suggestedStartDate, suggestedEndDate, newParams, cb, false);
}

quoteFeedSimulator.fetchUpdateData = function (symbol, startDate, params, cb) {
    let symbolObj = {};
    let newParams = getCurrentParams(params)
    if (newParams.symbolObject && newParams.symbolObject.exc) {
        let symbolData = newParams.symbolObject;
        symbolObj = {
            asset: symbolData.asset ? symbolData.asset : "",
            exc: symbolData.exc ? symbolData.exc : "",
            id: symbolData.id ? symbolData.id : "",
            instrument: symbolData.instrument ? symbolData.instrument : "",
            streamSym: symbolData.streamSym ? symbolData.streamSym : "",
            chartID: symbolData.chartID ? symbolData.chartID : ""
        }
        //    if(stxx && stxx.chart && stxx.chart.market && stxx.chart.market.isOpen()){
        //     quoteFeedSimulator.postRequest(startDate, new Date(), params, cb, true);
        //    }else{
        //        alert("market closed")
        //    }

        console.log('symbolData :', symbolData,window.chartIQ);

        let sendObj = {
            id: 'startStream',
            data: { symbolObj }
        }
        let sendObj2 = JSON.stringify(sendObj);
        if (window.chartIQ) {
            if (symbolData && symbolData.platform && symbolData.platform === 'android') {
                window.chartIQ.postMessage(sendObj2);
            }
            else {
                window.chartIQ.postMessage(sendObj2, '*');
            }
        }
        if (window) {
            window.postMessage(sendObj2, "*");
        } 

        if (parent) {
            parent.postMessage(sendObj2, '*');
        } 
    }
}

quoteFeedSimulator.fetchPaginationData = function (symbol, suggestedStartDate, suggestedEndDate, params, cb) {
    console.log('fetchInitialData :', suggestedStartDate);
    let newParams = getCurrentParams(params)
    quoteFeedSimulator.postRequest(suggestedStartDate, suggestedEndDate, newParams, cb, true);
    streamingEnabled = true;
}

quoteFeedSimulator.postRequest = function (suggestedStartDate, suggestedEndDate, params, cb, fromPagination) {
    let symbolData = params.symbolObject;

    if (!fromPagination) {
        if (symbolData && symbolData.chartID) {
            $(`#${symbolData.chartID} .spinner`).show()
        } else {
            $('.spinner').show();
        }
    }

    let period = params.period;
    let interval = params.interval;
    let reqInterval;
    let appID = null;
    let sessionID = null;
    if (symbolData && symbolData.chartID) {
        $(`#${symbolData.chartID} .message-handler`).hide().text('')
    } else {
        $(`.message-handler`).hide().text('')
    }

    console.log("symbolData", symbolData)
    symbolData && symbolData.appID ? appID = symbolData.appID : appID = null;
    symbolData && symbolData.sessionID ? sessionID = symbolData.sessionID : sessionID = null;
    // let startDate = getISTTimeZone(suggestedStartDate)
    // let endDate = getISTTimeZone(suggestedEndDate)

    if (interval && interval === 'minute') {
        reqInterval = period && period + 'm'
    }
    else if (interval && interval === 'day') {
        reqInterval = period && period + 'day'
    }

    let customStartDate = '';
    if (reqInterval === '1m') {
        customStartDate = this.getPreviousDay(5);
    }
    else if (reqInterval === '30m') {
        customStartDate = this.getPreviousDay(30);
    } else {
        customStartDate = suggestedStartDate
    }

    let startDate = getISTTimeZone(customStartDate)
    let endDate = getISTTimeZone(suggestedEndDate)

    let headers = {
        'Content-Type': 'application/json'
    }

    if (sessionID) {
        headers.cookie = sessionID;
    }

    let apiRequestData = {
        request: {
            data: {
                sym: {
                    asset: symbolData.asset ? symbolData.asset : "",
                    exc: symbolData.exc ? symbolData.exc : "",
                    id: symbolData.id ? symbolData.id : "",
                    instrument: symbolData.instrument ? symbolData.instrument : "",
                    streamSym: symbolData.streamSym ? symbolData.streamSym : ""
                },
                startDate: startDate,
                endDate: endDate,
                interval: reqInterval
            },
            appID: appID,
            sessionID: sessionID
        }
    }

    let fetchRequestData = {
        method: 'POST',
        // credentials: 'include',
        body: JSON.stringify(apiRequestData),
        headers: {
            'Content-Type': 'application/json',
            'X-ENCRYPT': false
        }
    }

    quoteFeedSimulator.url = '';
    if (interval === 'minute') {
        if (symbolData && symbolData.intradayURL)
            quoteFeedSimulator.url = symbolData.intradayURL
    }
    else {
        if (symbolData && symbolData.historicalURL)
            quoteFeedSimulator.url = symbolData.historicalURL
    }

    if (appID) {
        fetch(quoteFeedSimulator.url, fetchRequestData)
            .then(checkStatus)
            .then(getBody)
            .then(parseBody)
            .then(response => {
                if (symbolData && symbolData.chartID) {
                    $(`#${symbolData.chartID} .spinner`).hide()
                } else {
                    $('.spinner').hide();
                }
                $(".chartContainer").show();
                let result = response.response;
                !streamingEnabled && (streamingEnabled = true);
                if (result.infoID === "0" && result.data) {
                    if (result.data && result.data.dataPoints.length > 0) {
                        if (symbolData && symbolData.chartID) {
                            $(`#${symbolData.chartID} .message-handler`).hide().text('')
                        } else {
                            $(`.message-handler`).hide().text('')
                        }
                        let getInitialChartData = quoteFeedSimulator.formatChartData(result.data.dataPoints)
                        if (getInitialChartData.length <= 1 && fromPagination)
                            cb({ quotes: getInitialChartData, upToDate: true, moreAvailable: false })
                        else
                            cb({ quotes: getInitialChartData, upToDate: true, moreAvailable: true })

                        // params.stx.home({ maintainWhitespace: false });
                    }
                } else {
                    if (symbolData && symbolData.chartID) {
                        $(`#${symbolData.chartID} .spinner`).hide()
                    } else {
                        $('.spinner').hide();
                    }
                    // $(".chartContainer").hide();
                    streamingEnabled = false;
                    cb({ quotes: [], moreAvailable: false });
                    if (symbolData && symbolData.chartID) {
                        $(`#${symbolData.chartID} .message-handler`).show().text(result.infoMsg);
                    } else {
                        $(`.message-handler`).show().text(result.infoMsg);
                    }
                    if (result.infoID === "EGN006") {
                        let sendObj = {
                            id: 'invalidSession',
                            message: {}
                        }
                        let sendObj2 = JSON.stringify(sendObj);
                        if (window.chartIQ) {
                            if (symbolData && symbolData.platform === 'android')
                                window.chartIQ.postMessage(sendObj2);
                            else
                                window.chartIQ.postMessage(sendObj2, '*');
                        }

                        if (parent)
                            parent.postMessage(sendObj2, '*')
                    }
                }
            })
            .catch(error => {
                $(".chartContainer").hide();
                if (symbolData && symbolData.chartID) {
                    $(`#${symbolData.chartID} .spinner`).hide()
                } else {
                    $('.spinner').hide();
                }
                if (symbolData && symbolData.chartID) {
                    $(`#${symbolData.chartID} .message-handler`).show().text(error.message);
                } else {
                    $(`.message-handler`).show().text(error.message);
                }
                cb({ quotes: [], moreAvailable: false });
            })
    }
}

const checkStatus = (response) => {
    if (response.status == 200) {
        return response
    }
    let error = new Error("service unavailable");
    throw error

}

const getBody = async (response) => {
    return response.text();
}

const parseBody = (response) => {
    return JSON.parse(response);
}

function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
}

quoteFeedSimulator.formatChartData = function (response) {

    let feeddata = response;
    let newQuotes = [];

    for (let i = 0; i < feeddata.length; i++) {
        if (feeddata[i]) {
            let newQuote = {};
            let date = replaceAll(feeddata[i][5], "-", "/");
            newQuote.DT = new Date(date); 
            newQuote.Open = Number(feeddata[i][0]);
            newQuote.High = Number(feeddata[i][1]);
            newQuote.Low = Number(feeddata[i][2]);
            newQuote.Close = Number(feeddata[i][3]);
            newQuote.Volume = Number(feeddata[i][4]);
            newQuotes.push(newQuote);
        }
    }
   console.log('newQuotes :', newQuotes);

    return newQuotes;
};

quoteFeedSimulator.setResolution = function (obj) {
    let getInterval = obj.interval;
    let interval;
    if (getInterval == 'day') {
        interval = obj.periodicity + 'DAY'
    } else if (getInterval == 'week') {
        interval = obj.periodicity + 'WEEK';
    } else if (getInterval == 'month') {
        interval = obj.periodicity + 'MONTH';
    } else if (getInterval == 1) {
        interval = (getInterval * obj.periodicity) + 'MIN';
    } else if (getInterval == 5) {
        interval = (getInterval * obj.periodicity) + 'MIN';
    } else if (getInterval == 10) {
        interval = (getInterval * obj.periodicity) + 'MIN';
    } else if (getInterval == 15) {
        interval = (getInterval * obj.periodicity) + 'MIN';
    } else if (getInterval == 30 && obj.periodicity == 1) {
        interval = (getInterval * obj.periodicity) + 'MIN';
    } else if (getInterval == 30 && obj.periodicity == 2) {
        interval = ((getInterval * obj.periodicity) / 60) + 'HOUR';
    } else if (getInterval == 30 && obj.periodicity == 8) {
        interval = ((getInterval * obj.periodicity) / 60) + 'HOUR';
    }
    return interval;
}

const getFormatedDate = (date = new Date(), format = 'yyyy-mm-dd') => {

    let result = '';
    let day = date.getDate();
    if (day < 10) { day = "0" + day; }

    let month = date.getMonth() + 1;
    if (month < 10) { month = "0" + month; }

    if (format == 'YYYY')
        result = date.getFullYear();
    else if (format == 'YYYYMM')
        result = date.getFullYear() + '' + month;
    else if (format == 'YYYYMMDD')
        result = date.getFullYear() + '' + month + '' + day;
    else
        result = date.getFullYear() + "-" + month + "-" + day;

    return result;
}

function formatStreamingData(response) {
	if (streamingEnabled) {
		try {
			let checkDate = getFormatedDate(new Date());
			let masterData = stxx.chart.masterData;
			let totalVolume = 0;
			if (response.vol) {
				quoteFeedSimulator.resVolume = parseFloat(response.vol.replace(/,/g, ''))
			}
			if (response.ltp) {
				quoteFeedSimulator.ltp = parseFloat(response.ltp.replace(/,/g, ''));
			}

			for (let i = 0; i < masterData.length - 1; i++) {
				let startTime = new Date(masterData[i].DT)

				if (checkDate == getFormatedDate(startTime)) {
					totalVolume = totalVolume + Number(masterData[i].Volume);
				}
			}

			if (quoteFeedSimulator.resVolume) {
				quoteFeedSimulator.volume = quoteFeedSimulator.resVolume - totalVolume;
			}

			let currentDate = new Date();
			currentDate.setSeconds(0, 0);
			quoteFeedSimulator.currentMin = currentDate.getMinutes();
			quoteFeedSimulator.currentHour = currentDate.getHours();
			quoteFeedSimulator.currentDate = currentDate.getDate();
			quoteFeedSimulator.updateOHLC = false;

			if (quoteFeedSimulator.setResolution(stxx.layout) == "1MIN") {
				if (quoteFeedSimulator.oldMinute != quoteFeedSimulator.currentMin) {
					quoteFeedSimulator.dateFinal = currentDate;
					quoteFeedSimulator.oldMinute = quoteFeedSimulator.currentMin;
					quoteFeedSimulator.updateOHLC = false;
				} else {
					quoteFeedSimulator.updateOHLC = true;
				}
			}
			else if (quoteFeedSimulator.setResolution(stxx.layout) == "5MIN") {
				let intervalDist = quoteFeedSimulator.currentMin % 5;
				if (intervalDist === 0) {
					if (quoteFeedSimulator.old5Minute != quoteFeedSimulator.currentMin) {
						quoteFeedSimulator.old5Minute = quoteFeedSimulator.currentMin;
						quoteFeedSimulator.dateFinal = currentDate;
						quoteFeedSimulator.updateOHLC = false;
					}
				} else {
					quoteFeedSimulator.dateFinal = currentDate;
					quoteFeedSimulator.updateOHLC = true;
				}

			}
			else if (quoteFeedSimulator.setResolution(stxx.layout) == "10MIN") {

				let intervalDist = quoteFeedSimulator.currentMin % 10;

				if (intervalDist === 0) {
					if (quoteFeedSimulator.old10Minute != quoteFeedSimulator.currentMin) {
						quoteFeedSimulator.old10Minute = quoteFeedSimulator.currentMin;
						quoteFeedSimulator.dateFinal = currentDate;
						quoteFeedSimulator.updateOHLC = false;
					}

				} else {
					quoteFeedSimulator.dateFinal = currentDate;
					quoteFeedSimulator.updateOHLC = true;
				}
			}
			else if (quoteFeedSimulator.setResolution(stxx.layout) == "15MIN") {

				let intervalDist = quoteFeedSimulator.currentMin % 15;

				if (intervalDist === 0) {
					if (quoteFeedSimulator.old15Minute != quoteFeedSimulator.currentMin) {
						quoteFeedSimulator.old15Minute = quoteFeedSimulator.currentMin;
						quoteFeedSimulator.dateFinal = currentDate;
						quoteFeedSimulator.updateOHLC = false;
					}

				} else {
					quoteFeedSimulator.dateFinal = currentDate;
					quoteFeedSimulator.updateOHLC = true;
				}
			}
			else if (quoteFeedSimulator.setResolution(stxx.layout) == "30MIN") {

				let intervalDist = quoteFeedSimulator.currentMin % 30;

				if (intervalDist === 0 || quoteFeedSimulator.currentMin == 0) {
					if (quoteFeedSimulator.old30Minute != quoteFeedSimulator.currentMin) {
						quoteFeedSimulator.old30Minute = quoteFeedSimulator.currentMin;
						quoteFeedSimulator.dateFinal = currentDate;
						quoteFeedSimulator.updateOHLC = false;
					}

				} else {
					quoteFeedSimulator.dateFinal = currentDate;
					quoteFeedSimulator.updateOHLC = true;
				}
			}
			else if (quoteFeedSimulator.setResolution(stxx.layout) == "1HOUR") {

				if (quoteFeedSimulator.currentHour != quoteFeedSimulator.oldHour) {
					quoteFeedSimulator.oldHour = quoteFeedSimulator.currentHour;
					quoteFeedSimulator.dateFinal = currentDate;
					quoteFeedSimulator.updateOHLC = false;
				} else {
					quoteFeedSimulator.updateOHLC = true;
				}

			}
			else if (quoteFeedSimulator.setResolution(stxx.layout) == "4HOUR") {

				let intervalTimeDist = quoteFeedSimulator.currentHour % 4;

				if (intervalTimeDist === 0) {

					if (quoteFeedSimulator.currentHour != quoteFeedSimulator.old4Hour) {
						quoteFeedSimulator.old4Hour = quoteFeedSimulator.currentHour;
						quoteFeedSimulator.dateFinal = currentDate;
						quoteFeedSimulator.updateOHLC = false;
					} else {
						quoteFeedSimulator.dateFinal = currentDate;
						quoteFeedSimulator.updateOHLC = true;
					}
				} else {
					var event = new Date();
					let hoursSubtract = quoteFeedSimulator.currentHour - intervalTimeDist;
					event.setHours(hoursSubtract);
					event.setMinutes(0)
					event.setSeconds(0, 0);
					quoteFeedSimulator.dateFinal = currentDate;
					quoteFeedSimulator.updateOHLC = true;
				}
			}
			else if (quoteFeedSimulator.setResolution(stxx.layout) == "1DAY") {
				quoteFeedSimulator.volume = quoteFeedSimulator.resVolume;
				if (quoteFeedSimulator.currentDate != quoteFeedSimulator.oldDate) {
					quoteFeedSimulator.dateFinal = currentDate;
					quoteFeedSimulator.updateOHLC = false;
				} else {
					quoteFeedSimulator.updateOHLC = true;
					quoteFeedSimulator.dateFinal = event;
				}
			}

			if (quoteFeedSimulator.updateOHLC) {

				if (quoteFeedSimulator.high < quoteFeedSimulator.ltp) {
					quoteFeedSimulator.high = quoteFeedSimulator.ltp;

				}
				if (quoteFeedSimulator.low > quoteFeedSimulator.ltp) {
					quoteFeedSimulator.low = quoteFeedSimulator.ltp;
				}
			} else {
				quoteFeedSimulator.Open = Number(response.ltp);
				quoteFeedSimulator.high = Number(response.ltp);
				quoteFeedSimulator.low = Number(response.ltp);
			}
			let newQuotes = {};
			newQuotes.DT = quoteFeedSimulator.dateFinal;
			newQuotes.Open = quoteFeedSimulator.Open ? quoteFeedSimulator.Open : quoteFeedSimulator.ltp;
			newQuotes.High = quoteFeedSimulator.high ? quoteFeedSimulator.high : quoteFeedSimulator.ltp;
			newQuotes.Low = quoteFeedSimulator.low ? quoteFeedSimulator.low : quoteFeedSimulator.ltp;
			newQuotes.Close = quoteFeedSimulator.ltp;
			newQuotes.Volume = quoteFeedSimulator.volume;

			newQuotes = [newQuotes];
   console.log('newQuotes :', newQuotes);
			if (stxx) {
				if (streamingEnabled) {
					$('.message-handler').hide().text('')
					if (newQuotes[0].Open && newQuotes[0].High && newQuotes[0].Low && newQuotes[0].Close) {
						stxx.updateChartData(newQuotes, null, { bypassGovernor: true });
					}

				} else {
					stxx.updateChartData([]);
				}
			}

		} catch (error) {
			console.log("error", error.message);
		}
	}
}

function sendStreamingDataToChart(data) {
    let paredData = JSON.parse(data)
    if (Object.keys(paredData).length > 0) {
        formatStreamingData(paredData);
    }
}

function getCurrentParams(params) {
    let deviceData = getQueryParams();
    console.log('deviceData :', deviceData);
	let newParams = { symbolObject : {
            appID: deviceData.appID,
            asset: deviceData.symbolObject.asset,
            deviceType: deviceData.deviceType,
            platform: deviceData.platform,
            chartID: deviceData.chartID,
            encryptionKey: deviceData.encryptionKey,
            exc: deviceData.symbolObject.exc,
			historicalURL: deviceData.historicalURL,
            id: deviceData.symbolObject.id,
            instrument: deviceData.symbolObject.instrument,
            intradayURL: deviceData.intradayURL,
            isEncryptionEnabled: deviceData.isEncryptionEnabled,
            precision: deviceData.symbolObject.precision,
            publicURL: deviceData.publicURL,
            selectedTheme: deviceData.selectedTheme,
            sessionID: deviceData.sessionID,
            socketURL: deviceData.socketURL,
            streamSym: deviceData.symbolObject.streamSym,
            symbol: deviceData.symbolObject.baseSym,
            symbolSearchURL: deviceData.symbolSearchURL,
            tradingURL: deviceData.tradingURL,
            view: deviceData.view,
            userMode: deviceData.userMode,
        }}
	
	let returnedTarget = Object.assign(params, newParams);
    return returnedTarget
}


export default quoteFeedSimulator;

window.formatStreamingData = formatStreamingData;
window.sendStreamingDataToChart = sendStreamingDataToChart;
window.getFormatedDate = getFormatedDate;
window.quoteFeedSimulator = quoteFeedSimulator;