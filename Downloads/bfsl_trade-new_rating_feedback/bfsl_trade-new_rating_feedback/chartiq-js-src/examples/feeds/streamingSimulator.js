/* eslint-disable */

let streamingSimulator = {};

let isDataUpdated = true;
let response = {};

function streamingSimulatorFn(streamRes) {
    // console.log("stresamingRes", streamRes )
    if (!streamingSimulator[streamRes.chartID]) {
        streamingSimulator[streamRes.chartID] = streamRes
    }
    if (streamRes && streamRes.chartID) {
        try {
            if (isDataUpdated) {
                response = streamRes;
                isDataUpdated = false
            }

            let checkDate = window.getFormatedDate(new Date());
            let masterData = window.stxx[response.chartID].chart.masterData;

            let totalVolume = 0;
            if (response && response.vol) {
                streamingSimulator[response.chartID].resVolume = parseFloat(response.vol.replace(/,/g, ''))
            }
            if (response && response.ltp) {
                streamingSimulator[response.chartID].ltp = parseFloat(response.ltp.replace(/,/g, ''));
            }

            for (let i = 0; i < masterData.length - 1; i++) {
                let startTime = new Date(masterData[i].DT)

                if (checkDate == window.getFormatedDate(startTime)) {
                    totalVolume = totalVolume + Number(masterData[i].Volume);
                }
            }

            if (streamingSimulator[response.chartID].resVolume) {
                streamingSimulator[response.chartID].volume =
                    streamingSimulator[response.chartID].resVolume - totalVolume;
            }

            let currentDate = new Date();
            currentDate.setSeconds(0, 0);
            streamingSimulator.currentMin = currentDate.getMinutes();
            streamingSimulator.currentHour = currentDate.getHours();
            streamingSimulator.currentDate = currentDate.getDate();
            streamingSimulator.updateOHLC = false;

            if (quoteFeedSimulator.setResolution(window.stxx[response.chartID].layout) == "1MIN") {
                if (streamingSimulator.oldMinute != streamingSimulator.currentMin) {
                    streamingSimulator.dateFinal = currentDate;
                    streamingSimulator.oldMinute = streamingSimulator.currentMin;
                    streamingSimulator.updateOHLC = false;
                } else {
                    streamingSimulator.updateOHLC = true;
                }
            }
            else if (quoteFeedSimulator.setResolution(window.stxx[response.chartID].layout) == "5MIN") {
                let intervalDist = streamingSimulator.currentMin % 5;
                if (intervalDist === 0) {
                    if (streamingSimulator.old5Minute != streamingSimulator.currentMin) {
                        streamingSimulator.old5Minute = streamingSimulator.currentMin;
                        streamingSimulator.dateFinal = currentDate;
                        streamingSimulator.updateOHLC = false;
                    }
                } else {
                    streamingSimulator.dateFinal = currentDate;
                    streamingSimulator.updateOHLC = true;
                }

            }
            else if (quoteFeedSimulator.setResolution(window.stxx[response.chartID].layout) == "10MIN") {

                let intervalDist = streamingSimulator.currentMin % 10;

                if (intervalDist === 0) {
                    if (streamingSimulator.old10Minute != streamingSimulator.currentMin) {
                        streamingSimulator.old10Minute = streamingSimulator.currentMin;
                        streamingSimulator.dateFinal = currentDate;
                        streamingSimulator.updateOHLC = false;
                    }

                } else {
                    streamingSimulator.dateFinal = currentDate;
                    streamingSimulator.updateOHLC = true;
                }
            }
            else if (quoteFeedSimulator.setResolution(window.stxx[response.chartID].layout) == "15MIN") {

                let intervalDist = streamingSimulator.currentMin % 15;

                if (intervalDist === 0) {
                    if (streamingSimulator.old15Minute != streamingSimulator.currentMin) {
                        streamingSimulator.old15Minute = streamingSimulator.currentMin;
                        streamingSimulator.dateFinal = currentDate;
                        streamingSimulator.updateOHLC = false;
                    }

                } else {
                    streamingSimulator.dateFinal = currentDate;
                    streamingSimulator.updateOHLC = true;
                }
            }
            else if (quoteFeedSimulator.setResolution(window.stxx[response.chartID].layout) == "30MIN") {

                let intervalDist = streamingSimulator.currentMin % 30;

                if (intervalDist === 0 || streamingSimulator.currentMin == 0) {
                    if (streamingSimulator.old30Minute != streamingSimulator.currentMin) {
                        streamingSimulator.old30Minute = streamingSimulator.currentMin;
                        streamingSimulator.dateFinal = currentDate;
                        streamingSimulator.updateOHLC = false;
                    }

                } else {
                    streamingSimulator.dateFinal = currentDate;
                    streamingSimulator.updateOHLC = true;
                }
            }
            else if (quoteFeedSimulator.setResolution(window.stxx[response.chartID].layout) == "1HOUR") {

                if (streamingSimulator.currentHour != streamingSimulator.oldHour) {
                    streamingSimulator.oldHour = streamingSimulator.currentHour;
                    streamingSimulator.dateFinal = currentDate;
                    streamingSimulator.updateOHLC = false;
                } else {
                    streamingSimulator.updateOHLC = true;
                }

            }
            else if (quoteFeedSimulator.setResolution(window.stxx[response.chartID].layout) == "4HOUR") {

                let intervalTimeDist = streamingSimulator.currentHour % 4;

                if (intervalTimeDist === 0) {
                    if (streamingSimulator.currentHour != streamingSimulator.old4Hour) {
                        streamingSimulator.old4Hour = streamingSimulator.currentHour;
                        streamingSimulator.dateFinal = currentDate;
                        streamingSimulator.updateOHLC = false;
                    } else {
                        streamingSimulator.dateFinal = currentDate;
                        streamingSimulator.updateOHLC = true;
                    }
                } else {
                    var event = new Date();
                    let hoursSubtract = streamingSimulator.currentHour - intervalTimeDist;
                    event.setHours(hoursSubtract);
                    event.setMinutes(0)
                    event.setSeconds(0, 0);
                    streamingSimulator.dateFinal = currentDate;
                    streamingSimulator.updateOHLC = true;
                }
            }
            else if (quoteFeedSimulator.setResolution(window.stxx[response.chartID].layout) == "1DAY") {
                streamingSimulator.volume = streamingSimulator.resVolume;
                if (streamingSimulator.currentDate != streamingSimulator.oldDate) {
                    streamingSimulator.dateFinal = currentDate;
                    streamingSimulator.updateOHLC = false;
                } else {
                    streamingSimulator.updateOHLC = true;
                    streamingSimulator.dateFinal = event;
                }
            }

            if (streamingSimulator.updateOHLC) {

                if (streamingSimulator[response.chartID].high < streamingSimulator[response.chartID].ltp) {
                    streamingSimulator[response.chartID].high = streamingSimulator[response.chartID].ltp;
                }
                if (streamingSimulator[response.chartID].low > streamingSimulator[response.chartID].ltp) {
                    streamingSimulator[response.chartID].low = streamingSimulator[response.chartID].ltp;
                }
            } else {
                streamingSimulator[response.chartID].Open = Number(response.ltp);
                streamingSimulator[response.chartID].high = Number(response.ltp);
                streamingSimulator[response.chartID].low = Number(response.ltp);
            }
            let newQuotes = {};
            newQuotes.DT = streamingSimulator.dateFinal;
            newQuotes.Open = streamingSimulator[response.chartID].Open ?
                streamingSimulator[response.chartID].Open : streamingSimulator[response.chartID].ltp;
            newQuotes.High = streamingSimulator[response.chartID].high ?
                streamingSimulator[response.chartID].high : streamingSimulator[response.chartID].ltp;
            newQuotes.Low = streamingSimulator[response.chartID].low ?
                streamingSimulator[response.chartID].low : streamingSimulator[response.chartID].ltp;
            newQuotes.Close = streamingSimulator[response.chartID].ltp;
            newQuotes.Volume = streamingSimulator[response.chartID].volume;
            newQuotes = [newQuotes];
            if (window.stxx[response.chartID]) {
                if (newQuotes[0].Open && newQuotes[0].High && newQuotes[0].Low && newQuotes[0].Close) {
                    if (response.symbol === window.stxx[response.chartID].chart.symbolObject.streamSym) {
                        $(`#${response.chartID} .message-handler`).hide()
                        $(`#${response.chartID} .message-handler`).text('')
                        window.stxx[response.chartID].updateChartData(newQuotes, null, { bypassGovernor: true });
                        isDataUpdated = true;
                    }else{
                        isDataUpdated = true;
                    }
                } else {
                    isDataUpdated = true;
                    window.stxx[response.chartID].updateChartData([]);
                }
            } else {
                isDataUpdated = true;
            }

        } catch (error) {
            isDataUpdated = true;
            // console.log("error", error.message);
        }
    }
}
export default streamingSimulator;

window.streamingSimulatorFn = streamingSimulatorFn;