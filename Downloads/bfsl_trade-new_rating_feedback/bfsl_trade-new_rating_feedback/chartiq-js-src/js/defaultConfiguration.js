/* eslint-disable */
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

import { CIQ } from "../js/chartiq.js";
// Available resources:
// markerFeed
// scrollStyle
// quoteFeed
// forecastQuoteFeed
// nameValueStore
function getConfig(resources = {}) {
    let data = getQueryParams();
    console.log("getConfig", data)
    let config = {
        // Symbol can be string or
        // or an object containing property symbol of string type along with other properties
        initialSymbol: {
            symbol: data && data.symbolObject && data.symbolObject.dispSymbol,
            exc: data && data.symbolObject && data.symbolObject.exc,
            asset: data && data.symbolObject && data.symbolObject.asset,
            streamSym: data && data.symbolObject && data.symbolObject.streamSym,
            instrument: data && data.symbolObject && data.symbolObject.instrument,
            id: data && data.symbolObject && data.symbolObject.id,
            precision: data && data.symbolObject && data.symbolObject.precision,
            platform: data && data.platform,

            appID: data && data.appID,
            sessionID: data && data.sessionID,
            intradayURL: data && data.intradayURL,
            historicalURL: data && data.historicalURL,
            symbolSearchURL: data && data.symbolSearchURL,
            socketURL: data && data.socketURL,
            publicURL: data && data.publicURL,
            tradingURL: data && data.tradingURL,
            view: data && data.view,
            deviceType: data && data.deviceType,
            userMode: data && data.userMode,
            selectedTheme: data && data.selectedTheme,
            encryptionKey: data && data.encryptionKey,
            isEncryptionEnabled: data && data.isEncryptionEnabled,
            chartID: data && data.symbolObject.chartID
        },
        // highest common ancestor node for this chart
        root: document,
        // initial data array, if any
        initialData: undefined,
        // List of addons which are enabled and will be started when chart is created
        // Either override or supplement this list before creating chart to modify.
        enabledAddOns: {
            dataLoader: true,
            extendedHours: true,
            fullScreen: true,
            inactivityTimer: true,
            rangeSlider: true,
            shortcuts: true,
            tableView: true,
            tooltip: true
        },
        onNewSymbolLoad: {
            // if available called for each series in chart to test if it needs to be removed
            // when new primary symbol is loaded
            removeSeries(series) {
                return series.parameters.bucket !== "study"; // keeps only studies
            },
            // handle symbol load error
            loadError(error, uiContext) {
            }
        },
        // configure save and restore layout, preferences and drawings.
        // type is boolean or object
        // setting `restore: { symbol: false }` will restore everything except symbol
        restore: true,
        // language: "de", // Optionally set a language for the UI, after it has been initialized, and translate.
        // default lookup driver is defined in examples/feeds/symbolLookupChartIQ.js, it needs to be loaded to be available
        lookupDriver: CIQ.ChartEngine.Driver.Lookup.ChartIQ,
        hotkeyConfig: {
            // Specify hotkeys for default hotkey actions. Structure of the API works like this: each hotkey gets initialized with an
            // object that specifies the action to be performed and the command(s) to trigger it. Actions identified as strings are
            // default actions, which in some cases can be modified in the `hotkeyConfig.behavior` object. For custom actions, actions
            // can be set to functions, which will get called with an object with references to `stx` and `options` (an optional object
            // specified in the hotkey declaration).
            // Commands are specified as strings, with combo keys separated by `+`. For combos, all keys but the last key are expected
            // to be modifier keys (Shift, Alt, etc). The hotkey handler will check both `KeyboardEvent.key` and `KeyboardEvent.code`,
            // which can be useful when trying to ensure coverage across systems and layouts. If the keystroke originated on the numpad,
            // only `KeyboardEvent.code` will be checked, allowing different hotkeys to be assigned to the numpad.
            // Vertical movement options accept a percent option (expressed as a decimal), which specifies vertical movement as a
            // percentage of the chart height. Horizontal movement accepts a bars option, which specifies number of bars to move.
            // Note: if a `KeyboardEvent.key` value is equal to "Unidentified", the `String.fromCharCode` of the `KeyboardEvent.keyCode`
            // value will be used instead. This is to support legacy edge.
            hotkeys: [
                // precise navigation
                { label: "Pan chart up", action: "up", options: { percent: 0.02 }, commands: ["ArrowUp", "Up"] },
                { label: "Pan chart down", action: "down", options: { percent: 0.02 }, commands: ["ArrowDown", "Down"] },
                { label: "Pan chart right", action: "right", options: { bars: 1 }, commands: ["ArrowRight", "Right"] },
                { label: "Pan chart left", action: "left", options: { bars: 1 }, commands: ["ArrowLeft", "Left"] },
                // fast navigation
                { label: "Pan chart up fast", action: "up", options: { percent: 0.2 }, commands: ["Shift+ArrowUp", "Shift+Up"] },
                { label: "Pan chart down fast", action: "down", options: { percent: 0.2 }, commands: ["Shift+ArrowDown", "Shift+Down"] },
                { label: "Pan chart right fast", action: "right", options: { bars: 10 }, commands: ["Shift+ArrowRight", "Shift+Right"] },
                { label: "Pan chart left fast", action: "left", options: { bars: 10 }, commands: ["Shift+ArrowLeft", "Shift+Left"] },
                // page
                { label: "Page chart right", action: "pageRight", commands: ["Alt+ArrowRight", "Alt+Right", "PageUp"] },
                { label: "Page chart left", action: "pageLeft", commands: ["Alt+ArrowLeft", "Alt+Left", "PageDown"] },
                // zoom
                { label: "Zoom in x-axis", action: "zoomInXAxis", commands: ["NumpadAdd", "="] },
                { label: "Zoom out x-axis", action: "zoomOutXAxis", commands: ["NumpadSubtract", "-"] },
                { label: "Zoom in y-axis", action: "zoomInYAxis", commands: ["+"] },
                { label: "Zoom out y-axis", action: "zoomOutYAxis", commands: ["_"] },
                // toggle
                { label: "Toggle crosshair", action: "toggleCrosshairs", commands: ["Alt+Backslash", "Alt+\\", "Alt+Þ"] }, // Alt+Þ for legacy edge support
                { label: "Toggle continuous zoom", action: "toggleContinuousZoom", commands: ["Alt+Digit0", "Alt+0"], extension: "continuousZoom" },
                // UI navigation
                { label: "Tab to next", action: "keyboardNavigateNext", commands: ["Tab"] },
                { label: "Tab to previous", action: "keyboardNavigatePrevious", commands: ["Shift+Tab"] },
                // Tab navigation deselect is available. Comment out this line and assign an open key combination to enable.
                //{ label: "Deactivate Tab Selection", action: "keyboardNavigateDeselect", commands: [""] },
                { label: "Select at tab", action: "keyboardNavigateClick", commands: ["Enter"] },
                // misc
                { label: "Pan to home", action: "home", commands: ["Home"] },
                { label: "Pan to start of loaded data", action: "end", commands: ["End"] },
                { label: "Delete a highlighted item or the active drawing", action: "delete", commands: ["Backspace", "Delete", "Del"] },
                { label: "Close an open menu / dialog box or undo the active drawing", action: "escape", commands: ["Escape", "Esc"] },
                { label: "Symbol Lookup", action: "symbolLookup", commands: ["Shift+Alt+KeyL"], ariaLabel: "Opens main symbol lookup for chart" },
                // AddOns and Plugins
                { label: "Table view", action: "tableView", commands: ["Alt+KeyK"], extension: "tableView", ariaLabel: "Opens chart data in table format" }, // tableView is modal view, toggling off requires use of Escape
                { label: "Range Slider", action: "rangeSlider", commands: ["Shift+Alt+KeyR"], extension: "rangeSlider" },
                { label: "Extended Hours", action: "extendedHours", commands: ["Shift+Alt+KeyX"], extension: "extendedHours" },
                { label: "Keyboard Shortcuts", action: "shortcuts", commands: ["Shift+Alt+Slash", "Shift+Alt+?"], extension: "shortcuts" },
                { label: "Outliers", action: "outliers", commands: ["Shift+Alt+KeyO"], extension: "outliers" },
                { label: "Market Depth", action: "marketDepth", commands: ["Shift+Alt+KeyD"], extension: "marketDepth" },
                { label: "L2 Heat Map", action: "l2HeatMap", commands: ["Shift+Alt+KeyM"], extension: "marketDepth" },
                { label: "Import Data", action: "dataLoader", commands: ["Alt+KeyI"], extension: "dataLoader" },
                { label: "Trade From Chart", action: "tfc", commands: ["Shift+Alt+KeyP"], extension: "tfc" }
            ],
            // Keys events captured by the chart normally trigger on keyup. Specify which keys will trigger on keydown,
            // allowing a user to hold said key down (which keeps generating events) to repeat the associated hotkey action. It is
            // not recommended to associate "toggle" actions with these keys.
            keysToRepeat: [
                "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
                "Up", "Down", "Left", "Right", "-", "_", "=", "+"
            ],
        },
        systemMessages: {
            // Predefined notification event objects to be called by key value. Example:
            // testinfo: {
            // 	message: "This is an \"informational\" notification.",
            // 	position: "top",
            // 	type:"info",
            // 	transition:"slide",
            // 	displayTime: 5
            // }
            copytoclipboard: {
                message: "Copied to clipboard.",
                type: "info",
                displayTime: 5
            },
            logdeactivated: {
                message: "Log scale has been deactivated due to a zero or negative value in your visible dataset.",
                type: "warning"
            }
        },
        // Optionally set a market factory to the chart to make it market hours aware. Otherwise it will operate in 24x7 mode.
        // This is required for the simulator, or if you intend to also enable Extended hours trading zones.
        // Please note that, this method is set to use the CIQ.Market.Symbology functions by default,
        // which must be reviewed and adjust to comply with your quote feed and symbology format before they can be used.
        // Sample default setting requires resources loaded from
        // chartiq/examples/markets/marketDefinitionsSample and
        // chartiq/examples/markets/marketSymbologySample
        marketFactory: calMarketFactory,
        // All configuration parameters for chart engine except for container property
        // Only few are configured here. View available in https://documentation.chartiq.com/CIQ.ChartEngine.html
        // use in https://documentation.chartiq.com/CIQ.ChartEngine.html#.create
        chartEngineParams: {
            preferences: {
                labels: false,
                currentPriceLine: true,
                whitespace: 0
            },
            layout: {
                periodicity: 5,
                interval: 1,
                timeUnit: "minute"
            },
            crosshairXOffset: 0,
            crosshairYOffset: 0
        },
        // Array of objects containing properties to attach automated quote feeds
        // to the chart to handle initial load, pagination and updates at preset intervals.
        // Property detail - {@link CIQ.ChartEngine#attachQuoteFeed}
        quoteFeeds: [
            {
                quoteFeed: resources.quoteFeed,
                behavior: { refreshInterval: 1, bufferSize: 200 },
                // filter: () => {}
            }
        ],
        selector: {
            sideNav: ".ciq-sidenav",
            sidePanel: "cq-side-panel",
            lookupComponent: ".ciq-search cq-lookup",
            studyLegend: "cq-study-legend",
            timeSpanEvent: ".stx-markers cq-item.span-event",
            markersMenuItem: ".stx-markers cq-item",
            themesMenuItem: "cq-themes",
            tfcTradePanel: ".stx-trade-panel",
            tfcToggle: ".stx-trade",
        },
        themes: {
            builtInThemes: { "ciq-day": "Day", "ciq-night": "Night" },
            defaultTheme: "ciq-day",
            /**
			 * Optional override storage location of current theme and any custom defined themes. Takes a function with get, set, and remove methods
			 * If not defined, then the component will use CIQ.NameValueStore for storage.
			 */
            nameValueStore: resources.nameValueStore
        },
        // menu items
        // menuPeriodicity: [
        // 	{ type: "item", label: "1 D", cmd: "Layout.setPeriodicity(1,1,'day')", value: { period: 1, interval: 1, timeUnit: 'day'} },
        // 	{ type: "item", label: "1 W", cmd: "Layout.setPeriodicity(1,1,'week')", value: { period: 1, interval: 1, timeUnit: 'week' } },
        // 	{ type: "item", label: "1 Mo", cmd: "Layout.setPeriodicity(1,1,'month')", value: { period: 1, interval: 1, timeUnit: 'month' } },
        // 	{ type: "separator", },
        // 	{ type: "item", label: "1 Min", cmd: "Layout.setPeriodicity(1,1,'minute')", value: { period: 1, interval: 1, timeUnit: 'minute' } },
        // 	{ type: "item", label: "5 Min", cmd: "Layout.setPeriodicity(1,5,'minute')", value: { period: 1, interval: 5, timeUnit: 'minute' } },
        // 	{ type: "item", label: "10 Min", cmd: "Layout.setPeriodicity(1,10,'minute')", value: { period: 1, interval: 10, timeUnit: 'minute' } },
        // 	{ type: "item", label: "15 Min", cmd: "Layout.setPeriodicity(3,5,'minute')", value: { period: 1, interval: 1, timeUnit: 'minute' } },
        // 	{ type: "item", label: "30 Min", cmd: "Layout.setPeriodicity(1,30,'minute')", value: { period: 1, interval: 30, timeUnit: 'minute' } },
        // 	{ type: "item", label: "1 Hour", cmd: "Layout.setPeriodicity(2,30,'minute')", value: { period: 2, interval: 30, timeUnit: 'minute' } },
        // 	{ type: "item", label: "4 Hour", cmd: "Layout.setPeriodicity(8,30,'minute')", value: { period: 8, interval: 30, timeUnit: 'minute' } },
        // 	{ type: "separator", },
        // 	{ type: "item", label: "1 Sec", cmd: "Layout.setPeriodicity(1,1,'second')", value: { period: 1, interval: 1, timeUnit: 'second' } },
        // 	{ type: "item", label: "10 Sec", cmd: "Layout.setPeriodicity(1,10,'second')", value: { period: 1, interval: 10, timeUnit: 'second' } },
        // 	{ type: "item", label: "30 Sec", cmd: "Layout.setPeriodicity(1,30,'second')", value: { period: 1, interval: 30, timeUnit: 'second' } },
        // 	{ type: "separator", },
        // 	{ type: "item", label: "250 MSec", cmd: "Layout.setPeriodicity(1,250,'millisecond')", value: { period: 1, interval: 250, timeUnit: 'millisecond' } }
        // ],
        displayStyleIcons: true, // use style icons in the chart style menu
        menuChartStyle: [ // if displayStyleIcons is true and a suitable icon class for the iconCls parameter is not available, "generic" class can be applied
            { type: "radio", label: "Candle", cmd: "Layout.ChartType()", iconCls: "candle", value: "candle" },
            { type: "radio", label: "Bar", cmd: "Layout.ChartType()", iconCls: "bar", value: "bar" },
            { type: "radio", label: "Colored Bar", cmd: "Layout.ChartType()", iconCls: "colored-bar", value: "colored_bar" },
            { type: "radio", label: "Line", cmd: "Layout.ChartType()", iconCls: "line", value: "line" },
            { type: "radio", label: "Vertex Line", cmd: "Layout.ChartType()", iconCls: "vertex-line", value: "vertex_line" },
            { type: "radio", label: "Step", cmd: "Layout.ChartType()", iconCls: "step", value: "step" },
            { type: "radio", label: "Mountain", cmd: "Layout.ChartType()", iconCls: "mountain", value: "mountain" },
            { type: "radio", label: "Baseline", cmd: "Layout.ChartType()", iconCls: "baseline-delta", value: "baseline_delta" },
            { type: "radio", label: "Hollow Candle", cmd: "Layout.ChartType()", iconCls: "hollow-candle", value: "hollow_candle" },
            { type: "radio", label: "Volume Candle", cmd: "Layout.ChartType()", iconCls: "volume-candle", value: "volume_candle" },
            { type: "radio", label: "Colored HLC Bar", cmd: "Layout.ChartType()", iconCls: "colored-hlc", value: "colored_hlc" },
            { type: "radio", label: "Scatterplot", cmd: "Layout.ChartType()", iconCls: "scatterplot", value: "scatterplot" },
            { type: "radio", label: "Histogram", cmd: "Layout.ChartType()", iconCls: "histogram", value: "histogram" }
        ],
        menuChartAggregates: [
            { type: "separator" },
            { type: "radio", label: "Heikin Ashi", cmd: "Layout.ChartType()", iconCls: "heikinashi", value: "heikinashi" },
            { type: "radio", label: "Kagi", cmd: "Layout.ChartType()", options: "Layout.showAggregationEdit('kagi')", iconCls: "kagi", value: "kagi" },
            { type: "radio", label: "Line Break", cmd: "Layout.ChartType()", options: "Layout.showAggregationEdit('linebreak')", iconCls: "linebreak", value: "linebreak" },
            { type: "radio", label: "Renko", cmd: "Layout.ChartType()", options: "Layout.showAggregationEdit('renko')", iconCls: "renko", value: "renko" },
            { type: "radio", label: "Range Bars", cmd: "Layout.ChartType()", options: "Layout.showAggregationEdit('rangebars')", iconCls: "rangebars", value: "rangebars" },
            { type: "radio", label: "Point & Figure", cmd: "Layout.ChartType()", options: "Layout.showAggregationEdit('pandf')", iconCls: "pandf", value: "pandf" },
        ],
        menuChartPreferences: [
            { type: "checkbox", label: "Range Selector", cmd: "Layout.RangeSlider()", cls: "rangeslider-ui" },
            { type: "checkbox", label: "Extended Hours", cmd: "Layout.ExtendedHours()", cls: "extendedhours-ui" },
            { type: "checkbox", label: "Animation", cmd: "Layout.Animation()", cls: "animation-ui" },
            { type: "checkbox", label: "Hide Outliers", cmd: "Layout.Outliers()", cls: "outliers-ui" },
            { type: "checkbox", label: "Market Depth", cmd: "Layout.MarketDepth()", cls: "marketdepth-ui" },
            { type: "checkbox", label: "L2 Heat Map", cmd: "Layout.L2Heatmap()", cls: "marketdepth-ui" },
        ],
        menuYAxisPreferences: [
            { type: "checkbox", label: "Log Scale", cmd: "Layout.ChartScale('log')" },
            { type: "checkbox", label: "Invert", cmd: "Layout.FlippedChart()" },
        ],
        menuViewConfig: {
            // configure view menu options
        },
        menuStudiesConfig: { 	// All studies available are by default included in the studies menu
            excludedStudies: {
                "stochastics": true, // Remove simple stochastics, replaced with Stochastics
            },   // list of studies to exclude
            alwaysDisplayDialog: { ma: true, AVWAP: true },
            /*dialogBeforeAddingStudy: {"rsi": true} // here's how to always show a dialog before adding the study*/
        },
        // menuAddOns: [
        // 	{ type: "item", label: "Shortcuts / Hotkeys", cmd: "Layout.showShortcuts(true)", cls: "shortcuts-ui" },
        // 	{ type: "item", label: "Import Data", cmd: "Channel.write('dataLoader', true)", cls: "dataLoader-ui"}
        // ],
        // rangeMenu: [
        // 	{ type: "range", label: "1D", cmd: "set(1,'today')" },
        // 	{ type: "range", label: "5D", cmd: "set(5,'day',30,2,'minute')" },
        // 	{ type: "range", label: "1M", cmd: "set(1,'month',30,8,'minute')" },
        // 	{ type: "range", label: "3M", cmd: "set(3,'month')", cls: "hide-sm" },
        // 	{ type: "range", label: "6M", cmd: "set(6,'month')", cls: "hide-sm" },
        // 	{ type: "range", label: "YTD", cmd: "set(1,'YTD')", cls: "hide-sm" },
        // 	{ type: "range", label: "1Y", cmd: "set(1,'year')" },
        // 	{ type: "range", label: "5Y", cmd: "set(5,'year',1,1,'week')", cls: "hide-sm" },
        // 	{ type: "range", label: "All", cmd: "set(1,'all')", cls: "hide-sm" },
        // ],
        drawingTools: [
            { type: "dt", tool: "annotation", group: "text", label: "Annotation", shortcut: "w" },
            { type: "dt", tool: "arrow", group: "markings", label: "Arrow", shortcut: "a" },
            { type: "dt", tool: "line", group: "lines", label: "Line", shortcut: "l" },
            { type: "dt", tool: "horizontal", group: "lines", label: "Horizontal", shortcut: "o" },
            { type: "dt", tool: "vertical", group: "lines", label: "Vertical", shortcut: "p" },
            { type: "dt", tool: "rectangle", group: "markings", label: "Rectangle", shortcut: "r" },
            { type: "dt", tool: "segment", group: "lines", label: "Segment" },
            { type: "dt", tool: "average", group: "statistics", label: "Average Line" },
            { type: "dt", tool: "callout", group: "text", label: "Callout" },
            { type: "dt", tool: "channel", group: "lines", label: "Channel" },
            { type: "dt", tool: "check", group: "markings", label: "Check" },
            { type: "dt", tool: "continuous", group: "lines", label: "Continuous" },
            { type: "dt", tool: "crossline", group: "lines", label: "Crossline" },
            { type: "dt", tool: "elliottwave", group: "technicals", label: "Elliott Wave" },
            { type: "dt", tool: "ellipse", group: "markings", label: "Ellipse", shortcut: "e" },
            { type: "dt", tool: "freeform", group: "lines", label: "Doodle" },
            { type: "dt", tool: "fibprojection", group: "fibonacci", label: "Fib Projection" },
            { type: "dt", tool: "fibarc", group: "fibonacci", label: "Fib Arc" },
            { type: "dt", tool: "fibfan", group: "fibonacci", label: "Fib Fan" },
            { type: "dt", tool: "fibtimezone", group: "fibonacci", label: "Fib Time Zone" },
            { type: "dt", tool: "focusarrow", group: "markings", label: "Focus" },
            { type: "dt", tool: "gannfan", group: "technicals", label: "Gann Fan" },
            { type: "dt", tool: "gartley", group: "technicals", label: "Gartley" },
            { type: "dt", tool: "heart", group: "markings", label: "Heart" },
            { type: "dt", tool: "pitchfork", group: "technicals", label: "Pitchfork" },
            { type: "dt", tool: "quadrant", group: "statistics", label: "Quadrant Lines" },
            { type: "dt", tool: "ray", group: "lines", label: "Ray" },
            { type: "dt", tool: "regression", group: "statistics", label: "Regression Line" },
            { type: "dt", tool: "retracement", group: "fibonacci", label: "Fib Retracement" },
            { type: "dt", tool: "star", group: "markings", label: "Star" },
            { type: "dt", tool: "speedarc", group: "technicals", label: "Speed Resistance Arc" },
            { type: "dt", tool: "speedline", group: "technicals", label: "Speed Resistance Line" },
            { type: "dt", tool: "timecycle", group: "technicals", label: "Time Cycle" },
            { type: "dt", tool: "tirone", group: "statistics", label: "Tirone Levels" },
            { type: "dt", tool: "trendline", group: "text", label: "Trend Line" },
            { type: "dt", tool: "volumeprofile", group: "statistics", label: "Volume Profile" },
            { type: "dt", tool: "xcross", group: "markings", label: "Cross" },
        ],
        drawingToolGrouping: [
            "All",
            "Favorites",
            "Text",
            "Statistics",
            "Technicals",
            "Fibonacci",
            "Markings",
            "Lines"
        ],
        menuRendering: {
            separator: () => `
					<cq-separator></cq-separator>`,
            item: ({ label, cmd, cls }) => `
					<cq-item ${cls ? `class="${cls}"` : ""} stxtap="${cmd}">${label}</cq-item>`,
            radio: ({ label, cmd, options, cls, iconCls, value }, { displayStyleIcons }) => `
					<cq-item class="${cls || ''}${iconCls && displayStyleIcons ? ' ciq-menu-icon' : ''}"
						stxsetget="${cmd}"
						${value ? ` data-value=${JSON.stringify(value)}` : ""}>
						${iconCls && displayStyleIcons ? `<span ciq-menu-icon class="${'ciq-icon-' + iconCls}"></span>` : ""}
						${options ? `<span class="ciq-edit" stxtap="${options}" keyboard-selectable-child="true"></span>` : ""}
						<div><span ciq-label>${label}</span><span class="ciq-radio"><span></span></span></div>
					</cq-item>`,
            radioOptions: (...args) => { // alias for deprecated radioOption
                return config.menuRendering.radio.apply(config, args);
            },
            checkbox: ({ label, cmd, cls }) => `
					<cq-item
						${cls ? `class="${cls}"` : ""}
						stxsetget="${cmd}">${label}<span class="ciq-switch ciq-active"><span></span></span>
					</cq-item>`,
            checkboxOptions: ({ label, cmd, options, cls }) => `
					<cq-item ${cls ? `class="${cls}"` : ""}>
						<span class="ciq-edit" stxtap="${options}"></span>
						<div stxsetget="${cmd}">${label}<span class="ciq-switch ciq-active"><span></span></span></div>
					</cq-item>`,
            doubleslider: ({ label, cmd, attrs, cls }) => `
					<cq-item
						${cls ? `class="${cls}"` : ""}
						>${label}<span><cq-double-slider ${attrs}></cq-double-slider><span></span></span>
					</cq-item>`,
            range: ({ label, cmd, cls }) => `
					<div ${cls ? `class="${cls}"` : ""} stxtap="${cmd}">${label}</div>
				`,
            dt: ({ tool, group, label, shortcut }) => `<cq-item
						class="ciq-tool"
						cq-tool="${tool}"
						${shortcut ? `cq-tool-shortcut="${shortcut}"` : ""}
						cq-tool-group="${group}"
						stxtap="tool('${tool}')"
					>
						<span class="icon ${tool}"></span>
						<label>${label}</label>
						<cq-help help-id="drawing_palette_${tool}"></cq-help>
					</cq-item>
				`
        },
        getMenu(name, sort) {
            let menu = this[name];
            if (!menu) return;
            if (sort === true) sort = (a, b) => (a.label > b.label ? 1 : -1);
            if (typeof sort === "function") menu = menu.sort(sort);
            return this[name].map((options) => this.menuRendering[options.type || "item"](options, this));
        },
        addOns: {
            // Floating tooltip on mousehover
            // This should be used as an *alternative* to the HeadsUp (HUD).
            tooltip: {
                ohl: true,
                volume: true,
                series: true,
                studies: true
            },
            // Inactivity timer
            inactivityTimer: { minutes: 30 },
            // Animation
            animation: { animationParameters: { tension: 0.3 } },
            // Range Slider
            rangeSlider: {},
            // Enables Full Screen mode toggle button in chart controls
            fullScreen: {},
            // Extended hours trading zones
            extendedHours: { filter: true },
            // Continuous Zoom will also enable the SmartZoom button in your chart zoom controls
            // which allows the end-user to toggle the feature on and off.
            continuousZoom: {
                periodicities: [
                    // daily interval data
                    { period: 1, interval: "month" },
                    { period: 1, interval: "week" },
                    { period: 1, interval: "day" },
                    // 30 minute interval data
                    { period: 8, interval: 30 },
                    { period: 1, interval: 30 },
                    // 1 minute interval data
                    { period: 5, interval: 1 },
                    { period: 1, interval: 1 },
                    // one second interval data
                    { period: 10, interval: 1, timeUnit: "second" },
                    { period: 1, interval: 1, timeUnit: "second" },
                ],
                boundaries: {
                    maxCandleWidth: 15,
                    minCandleWidth: 3
                }
            },
            // Forecasting
            forecasting: {
                moduleName: "PlotComplementer",
                id: "forecast",
                decorator: { symbol: "_fcst", display: " Forecast" },
                renderingParameters: { chartType: "channel", opacity: 0.5, pattern: "dotted" },
                quoteFeed: resources.forecastQuoteFeed,
                behavior: { refreshInterval: 60 }
            },
            // Outliers
            outliers: {},
            // TableView
            tableView: {},
            // DataLoader
            dataLoader: {},
            // Shortcuts
            shortcuts: {}
        },
        plugins: {
            timeSpanEventPanel: {
                menuItemSelector: ".stx-markers cq-item.span-event",
                loadSample: true,
                showTooltip: true,
                // Event info can be displayed in "main" chart or in TSE "panel"
                infoPanel: {
                    durationEvent: 'main',
                    spanEvent: 'main',
                    singleEvent: 'main'
                }
            },
            // Enable the Active Trader Market Depth panel
            marketDepth: {
                volume: true,
                mountain: true,
                step: true,
                record: true,
                height: "50%",
                orderbook: true,
                interaction: true
            },
            // Trade From Chart (TFC)
            // set account key to your custom account class, or leave as undefined to default to CIQ.Account.Demo constructor
            // import plugins/tfc/tfc-demo.js or set loadSample=true to make CIQ.Account.Demo available for sample account creation
            tfc: {
                moduleName: "TFC",
                // loadSample: true,
                // account: undefined,  // Account instance object or a constructor
                /**
				 * By default if a constructor is provided in account the first created instance is shared with all TFC instances
				 * set following to true to create unique instances
				 */
                // allowUniqueAccountConstruction: true
                // startCompact: true // opens plugin in compact mode
            },
            crossSection: {
                pointFreshnessTimeout: 1, // pointFreshnessTimeout 1 min for demo purposes
                enableTimeSeries: true, // toggles on time-series related options
                timelineDateSelector: {
                    height: 95,
                    useNotifications: true
                },
                postInstall({ uiContext, extension }) {
                    const { stx: { crossSection } } = uiContext;
                    CIQ.getFn("UI.CurveEdit")(null, uiContext, this);
                    CIQ.getFn("CrossSection.HUD")(null, uiContext);
                    if (this.timelineDateSelector) {
                        CIQ.getFn("CrossSection.TimelineDateSelector")(
                            Object.assign({ crossSection }, this.timelineDateSelector)
                        );
                    }
                    // Connect datepicker change to crosssection callback
                    const datepicker = uiContext.topNode.querySelector("cq-datepicker");
                    if (datepicker) {
                        datepicker.registerCallback(date => extension.setCurveDate(date));
                    }
                }
            },
            visualEarnings: {
                menuContainer: ".ciq-dropdowns"
            },
            // signalIQ: {
            // 	panelHeight: 150,
            // 	displayCondition: false
            // }
        },
        // path of component communication channels
        // layout properties are persisted between reloads
        channels: {
            crosshair: "layout.crosshair",
            headsUp: "layout.headsUp",
            sidenav: "layout.sidenav",
            tableView: "channel.tableView",
            drawing: "channel.drawing",
            drawingPalettes: "channel.drawingPalettes",
            breakpoint: "channel.breakpoint",
            containerSize: "channel.containerSize",
            sidenavSize: "channel.sidenavSize",
            sidepanelSize: "channel.sidepanelSize",
            pluginPanelHeight: "channel.pluginPanelHeight",
            tfc: "channel.tfc",
            tc: "channel.tc",
            analystviews: "channel.analystviews",
            technicalinsights: "channel.technicalinsights",
            dataLoader: "channel.dataLoader",
            dialog: "channel.dialog",
            keyboardNavigation: "channel.keyboardNavigation"
        },
        // dialogs
        dialogs: {
            dataLoader: { tag: "cq-data-dialog" },
            view: { tag: "cq-view-dialog" },
            aggregation: { tag: "cq-aggregation-dialog" },
            timezone: { tag: "cq-timezone-dialog" },
            language: { tag: "cq-language-dialog" },
            theme: { tag: "cq-theme-dialog" },
            study: {
                tag: "cq-study-dialog",
                attributes: {
                    "cq-study-axis": true,
                    "cq-study-panel": "alias"
                }
            },
            // signaliq: { tag: "cq-signaliq-dialog" },
            fibSettings: { tag: "cq-fib-settings-dialog" },
            volumeprofileSettings: { tag: "cq-volumeprofile-settings-dialog" },
            share: { tag: "cq-share-dialog" }
        },
        // Event Markers implementation
        eventMarkersImplementation: resources.markerFeed,
        // Scrollbar styling implementation for cq-scroll component
        scrollbarStyling: {
            refresh(component, options = { suppressScrollX: true }) {
                if (typeof resources.scrollStyle !== "function") return;
                if (!component.__ps) {
                    component.__ps = new resources.scrollStyle(component, options);
                    component.__ps.scrollbarX.setAttribute('tabindex', -1);
                    component.__ps.scrollbarY.setAttribute('tabindex', -1);
                }
                component.__ps.update(component);
            }
        },
        // Copy symbol from the reference chart when a new chart is added
        multiChartCopySymbol: true,
        // Class to access and store data about the chart eg preferences, chart layout, and drawings for chart.
        // If you were using this property previously it stored information for themes which has now been moved to config.themes.nameValueStore
        nameValueStore: resources.nameValueStore,
        // Optional function to call when web components have initialized
        onWebComponentsReady: () => {
            let data = chartData ? getQueryParams(chartData) : getQueryParams()

            if (data) {
                checkRangeOnSymbolChange(data.symbolObject.exc, data.symbolObject.chartID, data.userMode)
                let instrument = data.symbolObject.instrument.toLowerCase()
                console.log('instrument :', instrument);
                // if (instrument === 'idx') {
                // 	$('.stx-trade').css({ "display": "none" })
                // }
                // else {
                // 	$('.stx-trade').css({ "display": "block" })
                // }
                // if (data.deviceType !== "web") {
                //     $('#tfc-shares-qty').addClass('tfc-mobile-view ')
                //     $('.qty-plus-minus-view .qty-change').css({ "display": "block" })
                //     $('.stx-data-qty-minus').addClass("disabled");
                // }
                // else {
                //     $('#tfc-shares-qty').removeClass('tfc-mobile-view ')
                //     // $('.qty-change').css({ "display": "none" })
                //     $('.qty-change').attr("style", "display: none !important");
                // }
                let chartID = data.symbolObject.chartID ? data.symbolObject.chartID : "chart0";
                let activeSpan = localStorage.getItem(`activeSpan-${chartID}`);
                getPeriodicityList(activeSpan)
                if (data.view !== "landscape")
                    $("cq-context").addClass("potraitView").removeClass("landscapeView")
                else
                    $("cq-context").addClass("landscapeView").removeClass("potraitView")

                if(data.deviceType === 'web') {
                    if(data.chartElement === "chart_iframe" || data.view === 'portrait-expand'|| data.symbolObject.asset==='index') {
                        $('.bfsl-order').css({ "display": "none" })
                        $(".bfsl-order").addClass("hide").removeClass("show-btn");
                    }
                    else {
                        $(".bfsl-order").addClass("show-btn").removeClass("hide");
                    }
                }
            }
        },
        // Callback to execute prior layout import or instrument loading after addOns and plugins have been initialized.
        // To set instrument for initial load, use this configuration's initialSymbol property and set the restore property to false or restore.symbol to false
        onEngineReady: (stx) => { },
        // Callback to execute when chart is loaded for first time
        onChartReady: (stx) => { },

        // function to create a new chart, returns a CIQ.ChartEngine instance
        createChart: function (container) {
            let config = this;
            if (CIQ.UI) {
                const chart = new CIQ.UI.Chart();
                const { stx } = chart.createChartAndUI({ container, config });
                let data = getQueryParams();
                getResolutionList()
                setActiveRange();
                let view = data && data.view;
                let theme = data && data.selectedTheme;
                let precision = data && data.symbolObject && data.symbolObject.precision;
                let asset = data && data.symbolObject && data.symbolObject.asset;
                let tickSize = data && data.symbolObject.tickSize
                let deviceType = data && data.deviceType;
                if (deviceType && deviceType === "web") {
                    $(".multiCharts").addClass("show").removeClass("hide");
                }
                else {
                    $(".multiCharts").addClass("hide").removeClass("show");
                }
                setView(view);
                setTheme(theme);
                minimumPriceTick(tickSize)
                setPrecision(precision);
                // stx.clearStyles();
                // let c = localStorage.getItem(`activeSpan-chart0`);
                // if(c === '1D' || c === null) {
                //     stx.setSpan({
                //         multiplier: 5,
                //         base: "today",
                //         padding: 30,
                //         // pre load a parameter for setRange
                //         periodicity: {
                //             period: 5,
                //             interval: 1,
                //             timeUnit: 'minute'
                //         }
                //     });
                // }
                stx.dontRoll = true
                // stx.chart.scroll = stx.chart.dataSet.length;
                return stx;
            }
            // if (CIQ.UI) return (new CIQ.UI.Chart()).createChartAndUI({ container, config }).stx;
            return CIQ.ChartEngine.create({ container, config });
        },
        // In multichart setting expand active chart by hiding all others for following settings
        // soloActive: {
        // 	onDraw: {
        // 		shouldSolo(stx) { // should chart solo when drawing is enabled for chart with stx parameter
        // 			// Uncomment following if up to medium breakpoint in chart solo on drawing is not required
        // 			// const { width, height } = stx.container.getBoundingClientRect();
        // 			// return width < 584 || height < 350;
        // 			return true;
        // 		},
        // 		// notification message
        // 		notify: {
        // 			message: "Click on the draw toggle again to close drawing tools and return to grid view",
        // 		}
        // 	},
        // 	onTFC: {
        // 		notify: {
        // 			message: "Click on the TFC toggle again to close TFC plugin and return to grid view",
        // 		}
        // 	}
        // },
        // Setting to load initial symbol from url
        //
        // If symbolParam defined query string parameter is provided in URL then this configs:
        // - "initialSymbol" property will be updated based on query string
        // - "restore" property will be updated to restore.symbol = false
        // Adjust or delete from config if this default behavior is not desired
        // useQueryString: {
        // 	symbolObject: {
        // 		symbol: "symbol",
        // 		name: "name",
        // 		exchDisp: "exchDisp"
        // 	},
        // },
        // updateFromQueryString() {
        // 	if (!this.useQueryString) return;
        // 	const queryObj = CIQ.qs();
        // 	const symbolObject = Object.entries(this.useQueryString.symbolObject)
        // 		.reduce((acc, [key, val]) => {
        // 			const value = queryObj[val];
        // 			if (value !== undefined) acc[key] = value;
        // 			return acc;
        // 		}, {});
        // 	if (symbolObject.symbol) {
        // 		this.initialSymbol = symbolObject;
        // 		if (this.restore) { // do not restore symbol use one set in initialSymbol
        // 			this.restore = { ...this.restore, symbol: false };
        // 		}
        // 	}
        // },
        // Set ariaStates to active instead of hidden
        // ariaActive: [
        // 	"cq-chart-instructions",
        // 	"cq-toggle.tableview-ui",
        // 	"cq-lookup",
        // 	".ciq-data-table-container"
        // ],
        // Function to create a new chart; returns a CIQ.ChartEngine instance
        // createChart: function(container) {
        // 	this.updateFromQueryString();
        // 	const config = this;
        // 	if(CIQ.UI) return (new CIQ.UI.Chart()).createChartAndUI({ container, config }).stx;
        // 	return CIQ.ChartEngine.create({ container, config });
        // }
    };
    if (!resources.quoteFeed) config.quoteFeeds.length = 0;
    return config;
}
export default getConfig;

function getQueryParams(paramsData = '') {
    let queryString = decodeURIComponent(paramsData ? paramsData : chartData);
    if (queryString) {
        let subString = queryString.substring(1);
        var parsedString = '';
        let splitString = '';
        if (subString)
            splitString = subString.split("=")
        if (splitString && splitString.length) {
            if (splitString[1])
                parsedString = JSON.parse(splitString[1])
        }
    }
    return parsedString;
}

function ChangeSymbolData(encodedData) {
    let data = getQueryParams(encodedData);
    checkRangeOnSymbolChange(data.symbolObject.exc, data.symbolObject.chartID, data.userMode)
    getResolutionList()
    setActiveRange();
    let instrument = data.symbolObject.instrument.toLowerCase()
    // if (instrument === 'idx') {
    // 	$('.stx-trade').css({ "display": "none" })
    // }
    // else {
    // 	$('.stx-trade').css({ "display": "block" })
    // }
    if (data.deviceType !== "web") {
        $('#tfc-shares-qty').addClass('tfc-mobile-view ')
        $('.qty-plus-minus-view .qty-change').css({ "display": "block" })
        $('.stx-data-qty-minus').prop('disabled', true);
    }
    else {
        $('#tfc-shares-qty').removeClass('tfc-mobile-view ')
        $('.qty-plus-minus-view .qty-change').attr("style", "display: none !important");
    }
    let changedSymbol = {
        symbol: data.symbolObject.dispSymbol,
        exchDisp: data.symbolObject.exc,
        assetType: data.symbolObject.asset,
        streamSym: data.symbolObject.streamSym,
        instrument: data.symbolObject.instrument,
        id: data.symbolObject.id,
        excToken: data.symbolObject.excToken,
        baseSym: data.symbolObject.baseSym,
        expiry: data.symbolObject.expiry
    }
    if (stxx && stxx.uiContext) {
        stxx.uiContext.changeSymbol(changedSymbol);
        let view = data && data.view;
        let theme = data && data.selectedTheme;
        let precision = data && data.symbolObject && data.symbolObject.precision;
        let tickSize = data && data.symbolObject && data.symbolObject.tickSize;
        setView(view);
        setTheme(theme);
        minimumPriceTick(tickSize)
        setPrecision(precision);
    }
}

function setTheme(theme) {
    // console.log('setTheme', theme)
    // if (theme === "DARK") {
    // 	$("body").removeClass("ciq-day");
    // 	$("body").addClass("ciq-night");
    // }
    // else {
    // 	$("body").removeClass("ciq-night");
    // 	$("body").addClass("ciq-day");
    // }
}

function minimumPriceTick(tickSize) {
    if (tickSize) {
        CIQ.ChartEngine.YAxis.prototype.minimumPriceTick = tickSize;
    }
}

function setPrecision(precision) {
    if (precision)
        CIQ.ChartEngine.YAxis.prototype.decimalPlaces = precision;
    else
        CIQ.ChartEngine.YAxis.prototype.decimalPlaces = 2;
}

function setView(view) {
    console.log("view", view)
    // change UI based on view here
}

$(document).on("click", ".active-range", function (e) {

    let selectedChartID = $(this).closest('cq-instant-chart').attr("id");
    let value = $(this).attr("data-value");
    let elemID = $(this).attr("id");
    updateActiveRange(elemID, value, selectedChartID, "range-case-1")
})

$(document).on("click", ".active-range-case-2", function (e) {

    let selectedChartID = $(this).closest('cq-instant-chart').attr("id");
    let value = $(this).attr("data-value");
    let elemID = $(this).attr("id");
    updateActiveRange(elemID, value, selectedChartID, "range-case-2")
})

$(document).on("click", ".buy-order", function (e) {
    let data = getQueryParams();
    console.log("data1", data)
    console.log("window.chartIQ", window.chartIQ)
    let buyObj = {
        id: 'orderPad',
        data: { action: "BUY" }
    }
    let buyObj1 = JSON.stringify(buyObj);
    if (window.chartIQ) {
        if (data && data.platform === 'android')
            window.chartIQ.postMessage(buyObj1);
        else
            window.chartIQ.postMessage(buyObj1, '*');
    }

    if (window) {
        window.postMessage(buyObj1, "*");
    }

    if (parent) {
        parent.postMessage(buyObj1, '*');
    }

    if (parent && parent.gotoOrderPad)
        parent.gotoOrderPad(data.symbolObject, "BUY")
})

$(document).on("click", ".sell-order", function (e) {
    let data = getQueryParams();
    console.log("window.chartIQ", window.chartIQ)
    let sellObj = {
        id: 'orderPad',
        data: { action: "SELL" }
    }

    let sellObj1 = JSON.stringify(sellObj);

    if (window.chartIQ) {
        if (data && data.platform === 'android')
            window.chartIQ.postMessage(sellObj1);
        else
            window.chartIQ.postMessage(sellObj1, '*');
    }

    if (window) {
        window.postMessage(sellObj1, "*");
    }

    if (parent) {
        parent.postMessage(sellObj1, '*');
    }

    if (parent && parent.gotoOrderPad)
        parent.gotoOrderPad(data.symbolObject, "SELL")

})

function updateActiveRange(name, value, id, range) {
    if (id) {
        $(`#${id} #ranges>div.active`).removeClass("active");
        $(`#${id} #ranges .${name}`).addClass("active")
    } else {
        id = "chart0"
        console.log("rangeeeee", name)
        $(`#ranges>div.active`).removeClass("active");
        $(`.${range} .${name}`).addClass("active")
    }
    localStorage.setItem(`activeSpan-${id}`, value)
    getPeriodicityList(value)
}

function checkRangeOnSymbolChange(exc, chartID, user) {
    if (exc === "NFO" || user === "GUEST") {
        if (!chartID) chartID = "chart0"
        let activeSpan = localStorage.getItem(`activeSpan-${chartID}`);
        if (activeSpan !== '1D' || activeSpan !== '5D') {
            stxx.setPeriodicity({ period: 5, interval: 1, timeUnit: "minute" });
            updateActiveRange('1_day', '1D', chartID)
        }
    }
}

function getPeriodicityList(name) {
    if (name === "1D" || name === "5D") {
        $(".case-one").css({ "display": "block" });
        $(".case-two").css({ "display": "block" });
    }
    else if (name === "1M" || name === "3M" || name === "6M" || name === "YTD" || name === "1Y" || name === "5Y") {
        $(".case-one").css({ "display": "block" });
        $(".case-two").css({ "display": "block" });
    } else {
        $(".case-one").css({ "display": "block" });
        $(".case-two, .case-three").css({ "display": "none" });
    }
}

function getResolutionList() {

    let data = chartData ? getQueryParams(chartData) : getQueryParams();
    if (data.symbolObject) {
        let chartIDD = ""
        if (data && data.symbolObject && data.symbolObject.chartID) chartIDD = data.symbolObject.chartID
        else chartIDD = "chart0"
        if (data.symbolObject.exc === "NFO" || data.userMode === "GUEST") {
            console.log("resolution", data.symbolObject.exc, data.symbolObject)
            $(`#${chartIDD} .range-case-1`).hide();
            $(`#${chartIDD} .range-case-2`).show();
        } else {
            console.log("resolution", data.symbolObject.exc, data.symbolObject)
            $(`#${chartIDD} .range-case-1`).show();
            $(`#${chartIDD} .range-case-2`).hide();
        }
    }
}

function setActiveRange() {
    let data = chartData ? getQueryParams(chartData) : getQueryParams();
    let chartID = data.symbolObject.chartID ? data.symbolObject.chartID : "chart0"
    let span_range = localStorage.getItem(`activeSpan-${chartID}`);
    if (!span_range) span_range = "1D";
    console.log("Valueee", span_range, chartID)
    if (chartID) {
        $(`#${chartID} #ranges>div.active`).removeClass("active");
        $(`#${chartID} #ranges .${span_range}`).addClass("active")
    } else {
        id = "chart0"
        console.log("rangeeeee", span_range)
        $(`#ranges>div.active`).removeClass("active");
        $(`#ranges .${span_range}`).addClass("active")
    }
}

function getMultiParamsData(chartID) {
    let details = window.location.search
    let queryString = decodeURIComponent(details);
    if (queryString) {
        let subString = queryString.substring(1);
        var parsedString = '';
        let splitString = '';
        var symData = "";
        if (subString)
            splitString = subString.split("=")
        if (splitString && splitString.length) {
            if (splitString[1])
                parsedString = JSON.parse(splitString[1])
        }
    }
    if (parsedString && parsedString.symbolObject && parsedString.symbolObject.length) {
        symData = parsedString.symbolObject.filter((item) => {
            if (item.chartID === chartID)
                return item;
        })
    }

    let data = {
        appID: parsedString.appID,
        sessionID: parsedString.sessionID,
        view: parsedString.view,
        deviceType: parsedString.deviceType,
        userMode: parsedString.userMode,
        selectedTheme: parsedString.selectedTheme,
        encryptionKey: parsedString.encryptionKey,
        isEncryptionEnabled: parsedString.isEncryptionEnabled,
        intradayURL: parsedString.intradayURL,
        historicalURL: parsedString.historicalURL,
        tradingURL: parsedString.tradingURL,
        symbolSearchURL: parsedString.symbolSearchURL,
        socketURL: parsedString.socketURL,
        publicURL: parsedString.publicURL,
        symbolObject: {
            exc: symData[0].exc,
            streamSym: symData[0].streamSym,
            instrument: symData[0].instrument,
            id: symData[0].id,
            asset: symData[0].asset,
            precision: symData[0].precision,
            dispSymbol: symData[0].dispSymbol,
            chartID: chartID
        }
    }
    return data;
}

window.getMultiParamsData = getMultiParamsData;
window.getQueryParams = getQueryParams;
window.getConfig = getConfig;
window.updateActiveRange = updateActiveRange;
window.ChangeSymbolData = ChangeSymbolData;
window.getResolutionList = getResolutionList;