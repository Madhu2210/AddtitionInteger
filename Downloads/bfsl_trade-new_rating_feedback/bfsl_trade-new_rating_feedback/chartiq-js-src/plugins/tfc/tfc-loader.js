/**
 *	8.7.0
 *	Generation date: 2022-08-01T14:30:00.407Z
 *	Client name: bajaj financial services ltd
 *	Package Type: Technical Analysis e98f22c
 *	License type: annual
 *	Expiration date: "2022/12/31"
 *	Domain lock: ["127.0.0.1","localhost","bajajfinservsecurities.in"]
 *	iFrame lock: true
 */

/***********************************************************
 * Copyright by ChartIQ, Inc.
 * Licensed under the ChartIQ, Inc. Developer License Agreement https://www.chartiq.com/developer-license-agreement
*************************************************************/
/*************************************** DO NOT MAKE CHANGES TO THIS LIBRARY FILE!! **************************************/
/* If you wish to overwrite default functionality, create a separate file with a copy of the methods you are overwriting */
/* and load that file right after the library has been loaded, but before the chart engine is instantiated.              */
/* Directly modifying library files will prevent upgrades and the ability for ChartIQ to support your solution.          */
/*************************************************************************************************************************/
/* eslint-disable no-extra-parens */


/*
 *
 * TFC package.  This loads up the Trade From Chart module.
 *
 */
import { CIQ } from "../../js/componentUI.js";
import TFC from "./tfc.js";
import html from "./tfcHtml.js";

const cssReady = new Promise((resolve) => {
	if (
		typeof define === "undefined" &&
		typeof module === "object" &&
		typeof require === "function"
	) {
		// webpack 4
		resolve(require("./tfc.css"));
	} else if (typeof define === "function" && define.amd) {
		define(["./tfc.css"], resolve);
	} else if (import.meta.webpack) {
		// webpack 5
		import(/* webpackMode: "eager" */ "./tfc.css").then(resolve);
	} else if (typeof window !== "undefined") {
		// no webpack
		CIQ.loadStylesheet(new URL("./tfc.css", import.meta.url).href, resolve);
	} else resolve();
}).then((m) => CIQ.addInternalStylesheet(m, "tfc")); // a framework, such as Angular, may require style addition

function start(config) {
	var stx = config.stx;

	let { account, allowUniqueAccountConstruction } = config;

	const accountIsInstance = typeof account !== "function";

	if (allowUniqueAccountConstruction || accountIsInstance) {
		config.account = accountIsInstance ? account : new account();
	} else {
		TFC.sharedAccount =
			TFC.sharedAccount || (accountIsInstance ? account : new account());
		config.account = TFC.sharedAccount;
	}

	stx.tfc = new TFC(config);

	stx.addEventListener("newChart", function () {
		stx.tfc.changeSymbol();
	});

	var topNode = config.context
		? config.context.topNode
		: stx.container.ownerDocument;
	var qs = (path) => topNode.querySelector(path);

	stx.tfc.selectSymbol = function (symbol) {
		if (config.context)
			config.context.changeSymbol({ symbol: symbol.toUpperCase() });
	};

	var sidePanel = qs("cq-side-panel");

	if (!topNode.querySelector("cq-side-panel .stx-trade-panel")) {
		// Add trade panel if markup is not already present in side panel
		sidePanel.appendChild(qs(".stx-trade-panel"));
	}
	// Start with compact panel
	if (config.startCompact) {
		topNode.querySelector(".stx-trade-nav").classList.toggle("active", true);
		topNode.querySelector(".stx-trade-info").classList.toggle("active", false);
	}

	let initTFC = true
	if (config.context.config) {
		CIQ.UI.BaseComponent.prototype.channelSubscribe(
			(config.context.config.channels || {}).tfc || "channel.tfc",
			function (isActive) {
				if (isActive != undefined) {
					let openTFC = true
					if ($('.stx-trade').hasClass('active'))
						openTFC = false
					stx.tfc.openPanel(initTFC ? isActive : openTFC);
					initTFC = false
				}
			},
			stx
		);
		// Resize side panel based on tradePanel width
		sidePanel.resizeMyself();
	}
}

// Stub function to allow child classes to be defined by the user
CIQ.Account = CIQ.Account || function () {};

// **Note:** The CIQ.TFC documentation is in *plugins/tfc/tfc.js*.
//
// Stub function used to create the plug-in object on the page before the class is loaded.
//
// @param {object} config Parameters for setting up the Trade from Chart plug-in.
// @param {CIQ.ChartEngine} config.stx A reference to the chart engine.
// @param {CIQ.ChartEngine.Chart} config.chart A reference to the chart to which the plug-in is
// 		added.
// @param {CIQ.UI.Context} config.context A reference to the user interface context.
// @param {CIQ.Account} [config.account] Account object for querying a brokerage and placing
// 		trades. If omitted, will be a demo account.
// @param {boolean} [config.loadTemplate] Set to false if the Trade from Chart markup is already
//		present in the document.
// @param {string} [config.htmlTemplate] Markup string to use instead of the default loaded HTML
// 		string.
// @param {boolean} [config.loadSample] Set to true to load the sample demo account.
//
// @since
// - 6.2.0 Added `context` parameter.
// - 8.1.0 Added `config.loadTemplate` and `config.htmlTemplate`.
// - 8.4.0 Added `config.loadSample`.
CIQ.TFC = function (config) {
	var tfcConfig = Object.assign({}, config);

	if (tfcConfig.account) {
		CIQ.ensureDefaults(
			typeof tfcConfig.account === "function"
				? tfcConfig.account.prototype
				: tfcConfig.account.constructor.prototype,
			CIQ.Account.prototype
		);
	} else if (CIQ.Account.Demo) {
		tfcConfig.account = CIQ.Account.Demo;
	} else if (config.loadSample) {
		var pathbits = import.meta.url.split("/");
		pathbits.pop();
		CIQ.loadScript(
			pathbits.join("/") + "/tfc-demo.js",
			function () {
				tfcConfig.account = CIQ.Account.Demo;
				cb();
			},
			true
		);
	} else {
		console.warn(
			"The TFC plugin requires account, neither TFC plugin account has been provided " +
				"in the plugin config nor has CIQ.Account.Demo been made available using tfc-demo.js import."
		);
		return;
	}

	if (config.loadTemplate !== false) {
		// markup is not present in document
		var topNode = config.context
			? config.context.topNode
			: config.chart.container.ownerDocument.body;
		var div = document.createElement("div");

		CIQ.innerHTML(div, config.htmlTemplate || html);
		Array.from(div.children).forEach((ch) =>
			topNode.appendChild(ch.cloneNode(true))
		);
	}

	var calledBack = false;
	function cb() {
		if (!calledBack && tfcConfig.account) {
			calledBack = true;
			start(tfcConfig);
		}
	}
	cssReady.then(cb);
};

export { TFC };
