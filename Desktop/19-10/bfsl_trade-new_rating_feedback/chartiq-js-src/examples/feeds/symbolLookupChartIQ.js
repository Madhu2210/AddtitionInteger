/* eslint-disable */
// -------------------------------------------------------------------------------------------
// Copyright 2012-2019 by ChartIQ, Inc
// -------------------------------------------------------------------------------------------
// SAMPLE SYMBOL LOOKUP IMPLEMENTATION -- Connects to ChartIQ Lookup Server
///////////////////////////////////////////////////////////////////////////////////////////////////////////
import { CIQ, quoteFeed, symbolLookupBase } from "../../js/standard.js";
CIQ.activateImports(quoteFeed, symbolLookupBase); // so we can use CIQ.inheritsFrom
let ENABLE_CACHE_SEARCH = true;
let initialResponse = [];
let prevString = "";
/**
 * An example of an asynchronous Lookup.Driver that uses ChartIQ's suggestive search as its source for symbol search
 * @name CIQ.ChartEngine.Driver.Lookup.ChartIQ
 * @constructor
 * @param {string[]} exchanges An array of exchanges that can be searched against
 * @private
 * @since 6.0.0
 */
CIQ.ChartEngine.Driver.Lookup.ChartIQ = function (exchanges) {
	this.exchanges = exchanges;
	if (!this.exchanges)
		this.exchanges = [
			"XNYS",
			"XASE",
			"XNAS",
			"XASX",
			"INDCBSX",
			"INDXASE",
			"INDXNAS",
			"IND_DJI",
			"ARCX",
			"INDARCX",
			"forex",
			"mutualfund",
			"futures"
		];
	this.url =
		"https://symbols.chartiq.com/chiq.symbolserver.SymbolLookup.service";
	this.requestCounter = 0; //used to invalidate old requests
	//t=ibm&m=10&x=[]&e=STOCKS
};
CIQ.inheritsFrom(
	CIQ.ChartEngine.Driver.Lookup.ChartIQ,
	CIQ.ChartEngine.Driver.Lookup
);
/**
 * @memberof CIQ.ChartEngine.Driver.Lookup.ChartIQ
 * @param {string} text Text to search for
 * @param {string} filter Any filter to be applied to the search results
 * @param {number} maxResults Max number of results to return from the server
 * @param {function} cb Callback upon results
 * @private
 * @since 6.0.0
 */

CIQ.ChartEngine.Driver.Lookup.ChartIQ.prototype.acceptText = function (
	text,
	filter,
	maxResults,
	cb
) {

	var myCB = function (response) {
		var results = [];
		let symbolDetails = chartData ? getQueryParams(chartData) : getQueryParams();
		console.log("response", response)
		if (response && response.length > 0) {
			$(".search-no-data").hide()
			response.map((item,) => {
				item.symbol = item.dispSym;
				results.push({
					data: {
						symbol: item.dispSym,
						exc: item.sym.exc,
						asset: item.sym.asset,
						streamSym: item.sym.streamSym,
						instrument: item.sym.instrument,
						id: item.sym.id,
						precision: symbolDetails && symbolDetails.symbolObject && symbolDetails.symbolObject.precision,

						appID: symbolDetails && symbolDetails.appID,
						sessionID: symbolDetails && symbolDetails.sessionID,
						intradayURL: symbolDetails && symbolDetails.intradayURL,
						historicalURL: symbolDetails && symbolDetails.historicalURL,
						tradingURL: symbolDetails && symbolDetails.tradingURL,
						symbolSearchURL: symbolDetails && symbolDetails.symbolSearchURL,
						socketURL: symbolDetails && symbolDetails.socketURL,
						publicURL: symbolDetails && symbolDetails.publicURL,
						view: symbolDetails && symbolDetails.view,
						deviceType: symbolDetails && symbolDetails.deviceType,
						userMode: symbolDetails && symbolDetails.userMode,
						selectedTheme: symbolDetails && symbolDetails.selectedTheme,
						encryptionKey: symbolDetails && symbolDetails.encryptionKey,
						isEncryptionEnabled: symbolDetails && symbolDetails.isEncryptionEnabled,
						chartID: window.searchElemtId
					},
					display: [item.dispSym, item.sym.exc]
				})
			})
		} else {
			$(".search-no-data").show()
		}
		cb(results);
	};
	if (text) {
		getSearchResults(text, myCB)
	}

};
export { CIQ };

function getSearchResults(text, cb) {
	if (text.length < 3) {
		initialResponse = [];
		prevString = "";
		cb([])
	}
	else if (text.length === 3) {
		let char1 = text.charAt(0)
		let char2 = text.charAt(1)
		let char3 = text.charAt(2)
		let prevChar1 = prevString.charAt(0)
		let prevChar2 = prevString.charAt(1)
		let prevChar3 = prevString.charAt(2)
		if ((char1 == prevChar1) && (char2 == prevChar2) && (char3 == prevChar3)) {
			let searchString = char1 + '' + char2 + '' + char3;
			cb(cacheSearch(searchString, initialResponse, 'queryString', "queryString2"))
		} else {
			let searchString = char1 + '' + char2 + '' + char3;
			if (searchString && searchString.length > 2) {
				prevString = searchString;
				postSearchRequest(searchString, function (response) {
					if (response && response.length > 0) {
						response.map((item) => {
							item.queryString = getDispSymbolName(item).primaryName + ' ' + item.sym.exc
							item.queryString2 = getDispSymbolName(item).secondaryName + ' ' + item.sym.exc
						})
						initialResponse = response;
						cb(response);
					}
				});
			}
		}
	}
	else {
		cb(cacheSearch(text, initialResponse, 'queryString', "queryString2"))
	}
}


function postSearchRequest(text, cb) {
	let queryParam = chartData ? getQueryParams(chartData) : getQueryParams();
	let url = queryParam.symbolSearchURL;
	let _data = {
		request:
		{
			data:
			{
				input: text,
				appID: queryParam.appID,
				sessionID: queryParam.sessionID
			},
			appID: queryParam.appID,
			sessionID: queryParam.sessionID
		}
	}
	fetch(url, {
		method: "POST",
		body: JSON.stringify(_data),
		headers: {
			"X-ENCRYPT": false,
			"Content-Type": "application/json",
			// "X-AUTH-STATUS": true
		}
	})
		.then(response => { return response.text() })
		.then(response => { return JSON.parse(response) })
		.then(response => {
			let result = response.response;
			if (result && result.data && result.data.symbols) {
				cb(result && result.data && result.data.symbols)
			}

			if (result && result.infoID === "EGN006") {
				let sendObj = {
					id: 'invalidSession',
					message: {}
				}
				let sendObj2 = JSON.stringify(sendObj);
				if (parent)
					parent.postMessage(sendObj2, '*')
			}

		})
		.catch(err => console.log("search err", err));
}



function cacheSearch(searchString, list, identifierKey, identifierKey2) {
	let symbolArray = Object.assign([], list)
	let filteredArray = symbolArray.filter((item) => {
		if (checkSymString(searchString, item[identifierKey]))
			return item
		else if (checkSymString(searchString, item[identifierKey2]))
			return item
		return null
	})
	return filteredArray
}

function checkSymString(query, str) {
	let queryArr = query.split(' ')
	return queryArr.every((qur) => {
		qur = convertToUpperCase(qur)
		str = convertToUpperCase(str)

		let regex = new RegExp(`${qur}`, 'gi')
		return regex.test(str)
	})
}

function convertToUpperCase(value) {
	if (value) {
		value = value.toUpperCase()
		return value
	}
	return ''
}

function getDispSymbolName(symDetails) {
	let primaryName, secondaryName = ""
	if (symDetails) {
		let symObj = symDetails.sym ? symDetails.sym : symDetails
		if (symObj) {
			primaryName = symObj.dispSym ? symObj.dispSym : symDetails.dispSym

			if (convertToUpperCase(symObj.asset) === "EQUITY") {
				secondaryName = symObj.companyName ? symObj.companyName : symDetails.companyName
			} else {
				secondaryName = symObj.baseSym ? symObj.baseSym : symDetails.baseSym
			}
		}

		primaryName = checkEmpty(primaryName)
		secondaryName = checkEmpty(secondaryName)
	}
	return { primaryName, secondaryName }
}

function checkEmpty(value) {
	if (value) return value
	else if (parseInt(value) === 0) return value
	return '--'
}

window.postSearchRequest = postSearchRequest;
window.getDispSymbolName = getDispSymbolName;
window.cacheSearch = cacheSearch;
