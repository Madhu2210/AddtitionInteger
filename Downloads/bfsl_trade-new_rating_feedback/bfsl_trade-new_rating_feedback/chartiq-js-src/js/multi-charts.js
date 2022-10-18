/* eslint-disable */

let selectedCharts = 0;
let selectedSymbolData = [];
let ENABLE_CACHE_SEARCH = true;
let initialResponse = [];
let prevString = "";


$(".multiple-charts").click(function () {
    let selectedID = $(this).attr("id")
    $(".multi-modal").css({ "display": "block" })
    $(".form-elements").empty()
    createInputElements(selectedID)
    selectedCharts = selectedID;
    let data = getQueryParams();
    let symbol = data && data.symbolObject && data.symbolObject.dispSymbol;
    $(".chart_1").val(symbol)
    let chartDetail = {
        exc: data && data.symbolObject && data.symbolObject.exc,
        streamSym: data && data.symbolObject && data.symbolObject.streamSym,
        instrument: data && data.symbolObject && data.symbolObject.instrument,
        id: data && data.symbolObject && data.symbolObject.id,
        asset: data && data.symbolObject && data.symbolObject.asset,
        precision: data && data.symbolObject && data.symbolObject.precision,
        dispSymbol: data && data.symbolObject && data.symbolObject.dispSymbol,
        chartID: "chart1"
    }
    selectedSymbolData.push(chartDetail)
})

function createInputElements(max) {
    for (var x = 1; x <= max; x++) {
        $('.form-elements').append('<div class="chart-form-filed">' +
            '<div class="chart-label">Chart ' + x + ':</div>' +
            '<div class="input-filed">' +
            '<input type = "text" id=' + x + ' class="chart_' + x + ' chart-input-type" autocomplete="off"/>' +
            '<div id="symbol_' + x + '_list_container" class="list-box">' +
            '</div>' +
            '</div>' +
            '</div>')
    }
}

$(".multi-charts-close").click(function () {
    $(".multi-modal").css({ "display": "none" })
})


$(document).on("click", ".chart-input-type", function (evt) {
    evt.stopImmediatePropagation();
    evt.stopPropagation();
})

$(document).on("input", ".chart-input-type", function (evt) {
 
    let id = evt && evt.target && evt.target.id;
    let searchString = $(this).val();
    if (id && searchString) {
        if (searchString.length < 3) {
            initialResponse = [];
            prevString = "";
            mapData([], id);
        }
        else if (searchString.length === 3) {
            let char1 = searchString.charAt(0)
            let char2 = searchString.charAt(1)
            let char3 = searchString.charAt(2)
            let prevChar1 = prevString.charAt(0)
            let prevChar2 = prevString.charAt(1)
            let prevChar3 = prevString.charAt(2)
            if ((char1 == prevChar1) && (char2 == prevChar2) && (char3 == prevChar3)) {
                showCacheFilterList(searchString, id)
            } else {
                let srString = char1 + '' + char2 + '' + char3;
                showSearchList(srString, id)
            }
        }
        else {
            showCacheFilterList(searchString, id)
        }
    }
})

function showCacheFilterList(searchString, id) {
    let result = cacheSearch(searchString, initialResponse, 'queryString', "queryString2")
    mapData(result, id);
}

function showSearchList(searchString, id) {
    if (searchString && searchString.length > 2) {
        prevString = searchString;
        $("#symbol_" + id + "_list_container").addClass("show").removeClass("hide");
        postSearchRequest(searchString, function (response) {
            if (response && response.length > 0) {
                response.map((item) => {
                    item.queryString = getDispSymbolName(item).primaryName + ' ' + item.sym.exc
                    item.queryString2 = getDispSymbolName(item).secondaryName + ' ' + item.sym.exc
                })
                initialResponse = response;
                mapData(response, id);
            }
        });
    }
}

function mapData(response, id) {
    const cont = document.getElementById("symbol_" + id + "_list_container");
    while (cont.hasChildNodes()) {
        cont.removeChild(cont.firstChild);
    }
    if (response && response.length) {
        const ul = document.createElement("ul");
        ul.setAttribute("id", "the-list");
        response.map((item,) => {
            const li = document.createElement("li");
            li.innerHTML = item.dispSym;
            li.setAttribute("class", "li-item")
            li.setAttribute("id", id)
            li.setAttribute("data-value", item.dispSym)
            li.setAttribute("data-asset", item.sym.asset)
            li.setAttribute("data-exc", item.sym.exc)
            li.setAttribute("data-id", item.sym.id)
            li.setAttribute("data-instrument", item.sym.instrument)
            li.setAttribute("data-streamSym", item.sym.streamSym)
            ul.appendChild(li);
        })
        cont.appendChild(ul)
       
    }else{
        errorMessage("No data found");
    }

}

$(document).on("click", ".list-box .li-item", function (evt) {
    let elemId = evt && evt.target && evt.target.id;
    evt.preventDefault()
    let baseData = getQueryParams()
    let chartDetail = {
        exc: $(this).attr("data-exc"),
        streamSym: $(this).attr("data-streamSym"),
        instrument: $(this).attr("data-instrument"),
        id: $(this).attr("data-id"),
        asset: $(this).attr("data-asset"),
        precision: baseData.symbolObject.precision,
        dispSymbol: $(this).attr("data-value"),
        chartID: `chart${elemId}`
    }
    if (selectedSymbolData && selectedSymbolData.length) {
        let itemIndex = selectedSymbolData.findIndex(item => item.chartID === chartDetail.chartID);
        if (itemIndex === -1) {
            selectedSymbolData.push(chartDetail)
        } else {
            selectedSymbolData[itemIndex] = chartDetail
        }
    } else {
        selectedSymbolData.push(chartDetail)
    }
    $(".chart_" + elemId + "").val($(this).attr("data-value"))
    $(".li-item").css({ "backgroundColor": "white" })
    $(this).css({ "backgroundColor": "green" })
    $("#symbol_" + elemId + "_list_container").addClass("hide").removeClass("show");
})

$(".btn-submit").click(function () {
    let isValid = true;
    for (let i = 1; i <= selectedCharts; i++) {
        let sym = $(`.chart_${i}`).val();
        if (!sym) {
            isValid = false;
            break;
        }
    }
    if (isValid && selectedSymbolData.length == selectedCharts)
        openNewWindow()
    else if (isValid && selectedSymbolData.length != selectedCharts)
        errorMessage("Invalid Symbols");
    else
        errorMessage("Symbols can not be empty");

})

function openNewWindow() {
    let baseData = getQueryParams();
    let data = {
        symbolObject: selectedSymbolData,
        appID: baseData && baseData.appID ? baseData.appID : null,
        sessionID: baseData && baseData.sessionID ? baseData.sessionID : null,
        view: baseData.view,
        deviceType: baseData.deviceType,
        userMode: baseData.userMode,
        selectedTheme: baseData.selectedTheme,
        encryptionKey: baseData.encryptionKey,
        isEncryptionEnabled: baseData.isEncryptionEnabled,
        intradayURL: baseData.intradayURL,
        historicalURL: baseData.historicalURL,
        tradingURL: baseData.tradingURL,
        symbolSearchURL: baseData.symbolSearchURL,
        publicURL: baseData.publicURL,
        socketURL: baseData.socketURL,

    }

    let encodedData = encodeURIComponent(`data=${JSON.stringify(data)}`);
    $(".multi-modal").hide();
    selectedSymbolData = [];
    window.open(`${baseData.publicURL}/chartiq/multiCharts.html?${encodedData}`)
}

function errorMessage(msg) {
    $(".err-msg").text(msg).css({ opacity: 1 })
    $(".err-msg").animate({ opacity: "0" }, 1000, function () {
        $(".err-msg").text("")
    });
}

$(document).on("click", ".modal-content", function () {
    for (var i = 0; i <= selectedCharts; i++) {
        if ($("#symbol_" + i + "_list_container").hasClass("show")) {
            $("#symbol_" + i + "_list_container").addClass("hide").removeClass("show")
            $(".chart_" + i + "").val("")
        }
    }
})

$(document).on("click", ".ciq-search", function (e) {
    let elemChartId = $(this).closest('cq-instant-chart').attr("id");
    window.searchElemtId = elemChartId
})