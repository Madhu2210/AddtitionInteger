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


export default `
<!-- TRADE FROM CHART --> 
  
<!-- Draggable Price lines + tabs -->
<div class="tfc container">
    <!--Add .red or .green to control color--> 
    <div class="tfc drag-price-line red" style="display:none;">
      <div class="drag-line"></div>
      <div class="drag-price">
        <div class="tfc-price-arrow"><span></span> </div>
        <div class="tfc-price"></div>
      </div>
    </div>

    <div class="tfc open-order-marker red" style="display:none;">
      <div class="open-order-line"></div>
      <div class="open-order-price">
        <div class="tfc-price-arrow"><span></span> </div>
        <div class="tfc-price"></div>
      </div>
    </div>
    
<!-- Market Orders -->

    <div class="tfc create-order market-order" style="display:none;">    
      <!--  remove display:none if you want to have a floating 'x' button to close the Market Orders overlay -->
      <div onClick="" class="stx-btn stx-ico" style="display:none; top:-21px"><span class="stx-ico-close"></span></div>      
      <div class="tfc-market-section">
	    <div class="col1 tfc-market-buy-action">
	      <div class="click tfc-buy" onclick=""> 
	        <div class="stx-ico-up"></div>
	        <span class="tfc-click-label">Buy</span>
	        <span class="tfc-ask"><span></span><strong><sup></sup></strong></span>
	      </div>
	    </div>
	    <div class="col2">
	      <div class="inputTemplate">
	        <div class="stx-data">
	          <input type="text" class="tfc-shares stx-input-field" value="" placeholder="">
	        </div>
	        <div class="stx-label tfc-shares-to-buy">Shares</div>
	        <div class="stx-label tfc-qty-to-buy">Units</div>
	      </div>
	      <div class="inputTemplate amount">
	        <div class="stx-data">
	          <input type="text" class="tfc-currency stx-input-field" value="" placeholder="">
	        </div>
	        <div class="stx-label tfc-price-dollars">Dollars</div>
	        <div class="stx-label tfc-price-amt">Amount</div>
	      </div>
	    </div>
        <div class="col3 tfc-market-sell-action">
          <div class="click tfc-sell" onclick=""> 
            <div class="stx-ico-down"></div>
            <span class="tfc-click-label">Sell</span>
            <span class="tfc-bid"><span></span><strong><sup></sup></strong></span>
          </div>
        </div>
	  </div>
      
      <div class="tfc-market-section complex" style="display:none;">
        <div class="wrapper">
      
         <div class="col1">
            <div class="stx-head stop-loss-label"></div>
            <div class="stx-data">
              <input type="text" class="tfc-market-loss-bracket stx-input-field" value="" placeholder="">
            </div>
            <div class="stx-label tfc-pips">pips</div>
            <div class="stx-label tfc-points">points</div>
         </div>
           
         <div class="col2">
            <div class="stx-head take-profit-label"></div>
            <div class="stx-data">
               <input type="text" class="tfc-market-profit-bracket stx-input-field" value="" placeholder="">
            </div>
            <div class="stx-label tfc-pips">pips</div>
            <div class="stx-label tfc-points">points</div>
         </div>
       
       </div>
      </div>  
    </div>
    
<!-- New Sell and Buy Orders -->

<!-- Use ID .new-sell-order for sell order -->
<!-- Use ID .new-buy-order for buy order -->
<!-- Use ID .new-buy-order + add class .with-stop to hide stop link and show limit link -->
<!-- Use ID .new-buy-order + add class .with-limit to hide limit link and show Risk/Reward -->
 <div class="tfc create-order stx-limit-order new-buy-order" style="display:none;">
    <div class="tfc-cancel-header">Modify: <span class="tfc-cancel-description">Sell 1000 shares @197.00</span></div>
    <div onClick="" class="stx-btn stx-ico"><span class="stx-ico-close"></span></div>

    <div class="tfc-input-body">
      <div class="row">
          <div class="stx-data labled-input labled-input-select">
            <label>Order</label>
            <select class="stx-select select-orderType">
              <option class="tfc-market" value="MARKET" selected>MARKET</option>
              <option class="tfc-limit" value="LIMIT">LIMIT</option>
            </select>
          </div>
          <div class="stx-data labled-input labled-input-select">
            <label>Product</label>
            <select class="stx-select select-productType">
              <option value="INTRADAY" selected>INTRADAY</option>
              <option id="delivery_opt" value="DELIVERY">DELIVERY</option>
              <option id="nrml_opt" value="NORMAL">NORMAL</option>
            </select>
          </div>
      </div>

      <div class="row qty-field">
      <div class="qty-plus-minus-view">
        <span class="qty-change stx-data-qty-minus">
          <i class="fa fa-minus-circle" aria-hidden="true"></i>
        </span>
          <div class="stx-data labled-input labled-input-input">
            <label>Qty</label>
            <input step="any" type="number" min="1" max="9999999999"  pattern="[0-9]*" inputmode="numeric"
            onkeyup="if(parseInt(this.value)>9999999999){ this.value = this.value.slice(0,10); return false; }" 
            onkeypress="return event.charCode >= 48 && event.charCode <= 57" 
            class="tfc-shares stx-input-field" autocomplete="off" autocapitalize="off" 
            autocorrect="off" spellcheck="off" value="1" id="tfc-shares-qty">
          </div>
          <span class="qty-change stx-data-qty-plus">
            <i class="fa fa-plus-circle" aria-hidden="true"></i>
          </span>
       </div>
          <div class="stx-data labled-input labled-input-input tfc-priceInput" style="display:none;">
            <label>Price</label>
            <input type="text" class="tfc-priceVal stx-input-field" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="none" placeholder="" disabled>
          </div>
      </div>

      <div class="row orderAction">
        <div class="doggle-input">
          <div class="tfc-action tfc-action-buy active" value="limit_buy">BUY</div>
          <div class="tfc-action tfc-action-sell inactive" value="limit_sell">SELL</div>
        </div>
        <button class="tfc-placeOrder place-order-btn">Place Order</button>
      </div>

      <div class="row infoMsg">
        Drag this window to set price
      </div>
      <div class="tfc-error"></div>
    </div>
    



    <div class="col1" style="display:none;">
      <div class="inputTemplate">
        <div class="stx-data">
          <input type="text" class="tfc-shares stx-input-field" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="none" placeholder="" >
        </div>
        <div class="stx-label tfc-shares-owned">of <span></span></div>
        <div class="stx-label tfc-shares-to-buy"><span>Shares</span></div>
        <div class="stx-label tfc-qty-to-buy">Units</div>
      </div>
      <div class="inputTemplate amount">
        <div class="stx-data">
          <input type="text" class="tfc-currency stx-input-field" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="none" placeholder="" >
        </div>
        <div class="stx-label tfc-price-dollars">Rupees</div>
        <div class="stx-label tfc-price-amt">Amount</div>
      </div>
      <div class="inputTemplate gain">
        <div class="stx-data tfc-gain-amount"></div>
        <div class="stx-data tfc-gain-percent"></div>
      </div>
      <div class="inputTemplate OTO stop"> <a><span class="stx-ico"></span>Add Stop Loss</a> </div>
      <div class="inputTemplate OTO limit"> <a><span class="stx-ico"></span>Add Take Profit</a> </div>
      <div class="inputTemplate risk-reward">
        <div class="stx-data"></div>
        <div class="stx-label">Rsk/Rwrd</div>
      </div>
  </div>
  <div class="col2">
<div class="stx-data" style="display:none;">
  <select class="stx-select">
    <option class="tfc-day" value="DAY" selected>DAY</option>
    <option value="GTC">GTC</option>
  </select>
</div>
    <div class="click tfc-buy" style="display:none;">Buy</div>
    <div class="click tfc-sell" style="display:none;">Sell</div>
    <div class="click tfc-short" style="display:none;">Short</div>
    <div class="click tfc-cover" style="display:none;">Cover</div>
    <div class="click tfc-replace" style="display:none;">Replace</div>
  </div>
  <div class="tfc-cancel-button click stx-btn"><span>Cancel this order</span></div>
  <div class="arrow"><span></span></div>
</div>


<!-- Order result -->


<!-- Buy, Cover, Bracket Order OTO Boxes -->

<!-- Use class .OTO.stx-stop for Stop box -->
<!-- Use class .OTO.stx-limit for Limit box (hides "trailing" option) -->
<div class="tfc create-order OTO stx-stop" style="display:none;">
  <div class="stx-btn stx-ico"><span class="stx-ico-close"></span></div>
  <div class="col1 OTO">
    <div class="stx-head tfc-oto-leg-label"></div>
  </div>
  <div class="col2">
      <div class="stx-data tfc-gain-percent">0%</div>
  </div>
  <div class="col3">
      <div class="stx-data tfc-gain-amount">&nbsp;</div>
  </div>
  <div class="stx-data trailing" style="display:none;"><span class="click">Make Trailing</span></div><!-- implement trailing stops in the future as a toggle, with percent or amount conditions -->
</div>

<!-- New OCO Order Legs -->


<!-- oco above -->
<div class="tfc create-order oco tfc-oco-above" style="display:none;">
  <div class="stx-head">Take Profit</div>
  <div class="stx-data"><span></span> Shares</div>
</div>

<!-- oco below -->
<div class="tfc create-order oco tfc-oco-below" style="display:none;">
  <div class="stx-head">Take Profit</div>
  <div class="stx-data"><span></span> Shares</div>
</div>


<div class="tfc create-order stx-oco-order" style="display:none;">
  <div class="stx-btn stx-ico"><span class="stx-ico-close"></span></div>
  <div class="col1">
    <div class="inputTemplate">
      <div class="stx-data">
        <input type="text" value="" class="stx-input-field" placeholder="">
      </div>
      <div class="stx-label tfc-price-dollars">Rupees</div>
      <div class="stx-label tfc-price-amt">Amount</div>
    </div>
<div class="stx-data">
  <select class="stx-select">
    <option class="tfc-day" value="DAY" selected>DAY</option>
    <option value="GTC">GTC</option>
  </select>
</div>
  </div>
  <div class="col2">
    <div class="click oco">Order</div>
  </div>
  <input type="hidden" value="" class="tfc-bracketid">
</div>

<div class="tfc tfc-shade" style="display:none">
</div>

</div>

<!-- END TRADE FROM CHART --> 


<div class="stx-dialog-container trade tfc-result-order-dialog-base">
  <div id="tfcConfirmOrderSuccess" style="display:none;" class="stx-dialog stx-dialog tfcOrderResult-dialog">
    <div onClick="" class="stx-btn stx-ico"><span class="stx-ico-close"></span></div>
    <h4>Order Result</h4>
    <div class="processOrder">
      <div class="tfc-loading"></div>
    </div>
    <div class="orderProcessed" style="display:none">
      <div class="confirm-ticket">
        <div class="row">
          <span class="tfcOrderStatus stx-value"><h4> </h4></span>
        </div>
        <div class="row">
            <span class="tfcsymbolDetails stx-value"></span>
       </div>
        <div class="row">
          <span class="stx-label order-execution"></span> <span class="tfcOrderResult stx-value order-execution"></span>
        </div>
        <div class="row">
          <span class="stx-label ord-id">Order Id : </span><span class="tfcOrderId stx-value ord-id"></span>
        </div>
        <div class="row">
          <span class="stx-label rej-rsn">Reject Reason : </span><span class="tfcRejRsn stx-value"></span>
        </div>
      </div>
      <div class="tfc-errors"></div>
      <div class="tfc-warnings"></div>
      <div class="stx-btn click tfcAbandon order-book">Order Book</div>
    </div>
  </div>
</div>


<div class="stx-dialog-container trade tfc-confirm-order-dialog-base">

<div style="display:none;" class="stx-dialog tfcConfirmOrder">
<h4>Confirm Your Order</h4>
<div class="stx-btn stx-ico stx-ico-close"><span class="stx-ico-close"></span></div>
<div class="processOrder">
    <div class="tfc-loading"></div>
</div>
<div class="orderProcessed" style="display:none">
    <div class="confirm-ticket">
      <div class="row">
        <span class="stx-label">Description:</span> <span class="tfcOrderDescription stx-value"></span>
      </div>
      <div class="row">
        <span class="stx-label">Price:</span> <span class="tfcOrderPrice stx-value"></span>
      </div>
      <div class="row" style="display:none">
        <span class="stx-label">Timeframe:</span><span class="tfcOrderTif stx-value"></span>
      </div>
      <span class="tfc-confirm-basis row"><span class="stx-label">Opened:</span><span class="tfcOrderBasis stx-value"></span></span>
      <span class="tfc-confirm-pl row"><span class="stx-label">Estimated P/L:</span><span class="tfcOrderPl stx-value"></span></span>
      <span class="tfc-confirm-oto row"><span class="stx-label">OTO:</span><span class="tfcOrderOTO stx-value"></span></span>
    </div>
    <div class="tfc-errors"></div>
    <div class="tfc-warnings"></div>
    <div class="stx-btn click tfcAbandon">Cancel</div>
    <div class="stx-btn click tfcSubmit">Submit</div>
</div>
</div>

<div style="display:none;" class="stx-dialog tfcConfirmReplace">
<h4>Replace Your Order</h4>
<div class="stx-btn stx-ico stx-ico-close"><span class="stx-ico-close"></span></div>
<div class="processOrder">
    <div class="tfc-loading"></div>
</div>
<div class="orderProcessed" style="display:none">
    <div class="confirm-ticket">
      <span class="stx-label">Description:</span><span class="tfcOrderDescription stx-value"></span><br>
      <hr/>
      <div class="compare-ticket">
        <div class="row">
          <span></span><span class="col1 stx-head">Old Order</span><span class="col2 stx-head">New Order</span>
        </div>
        <div class="row">
            <span class="stx-label">Quantity:</span><span class="col1 tfcOrderQuantityOld stx-value"></span><span class="col2 tfcOrderQuantityNew stx-value"></span>
        </div>
        <div class="row">
         <span class="stx-label">Price:</span><span class="col1 tfcOrderPriceOld stx-value"></span><span class="col2 tfcOrderPriceNew stx-value"></span>
        </div>
        <div class="row">
            <span class="stx-label">Timeframe:</span><span class="col1 tfcOrderTifOld stx-value"></span><span class="col2 tfcOrderTifNew stx-value"></span>
        </div>
        <div class="tfc-confirm-oto row">
            <span class="stx-label">OTO:</span><span class="col1 tfcOrderOTOOld stx-value"></span><span class="col2 tfcOrderOTONew stx-value"></span>
        </div>
      </div> 
    </div>
    <div class="tfc-errors"></div>
    <div class="tfc-warnings"></div>
    <div class="stx-btn click tfcAbandon">Abandon</div>
    <div class="stx-btn click tfcSubmit">Submit</div>
</div>
</div>

<div style="display:none;" class="stx-dialog tfcConfirmOCO">
<h4>Confirm: One Cancels the Other</h4>
<div class="stx-btn stx-ico stx-ico-close"><span class="stx-ico-close"></span></div>
<div class="processOrder">
    <div class="tfc-loading"></div>
</div>
<div class="orderProcessed" style="display:none">
    <div class="confirm-ticket">
        <span class="stx-label"></span> <span class="tfcOrderDescription1 stx-value"></span><br>
        <span class="stx-label"></span> <span class="tfcOrderDescription2 stx-value"></span><br>
        <span class="stx-label">Timeframe:</span><span class="tfcOrderTif stx-value"></span>
    </div>
    <div class="tfc-errors"></div>
    <div class="tfc-warnings"></div>
    <div class="stx-btn click tfcAbandon">Abandon</div>
    <div class="stx-btn click tfcSubmit">Submit</div>
</div>
</div> 

<div style="display:none;" class="stx-dialog tfcConfirmCloseAll">
<h4>Confirm Your Request</h4>
<div class="stx-btn stx-ico stx-ico-close"><span class="stx-ico-close"></span></div>
<div class="processOrder">
    <div class="tfc-loading"></div>
</div>
<div class="orderProcessed" style="display:none">
    <div class="confirm-ticket">
      <div class="row">
        <span class="tfc-attention">You have requested to immediately close all positions from your account.  Please click Submit to perform this action, or Abandon to abort.</span>
      </div>
    </div>
    <div class="stx-btn click tfcAbandon">Abandon</div>
    <div class="stx-btn click tfcSubmit">Submit</div>
</div>
</div>

</div>


<!----- TRADE --- -->
<div class="stx-panel-side stx-trade-panel closed">
<div class="stx-wrapper stx-trade-nav active">
  <ul class="stx-orders">
      <li class="stx-market" style="display:none"><a>MKT</a></li>
      <li class="stx-buy" style="display:none"><a>Buy</a></li>
      <li class="stx-sell" style="display:none"><a>Sell</a></li>
      <li class="stx-short" style="display:none"><a>Short</a></li>
      <li class="stx-cover" style="display:none"><a>Cover</a></li>
     
  </ul>
  <ul class="stx-account" style="display:none;">
      <li><span>Cash</span> <span class="tfc-current-cash"></span></li>
      <li><span>Funds Available</span> <span class="tfc-current-funds"></span></li>
      <li><span>Position</span> <span class="tfc-current-position"></span></li>
  </ul>
   
   <a class="stx-trade-ticket-toggle open" style="display:none">Expand/Collapse</a>
  
</div>

<div class="stx-wrapper stx-trade-info">
<ul class="stx-orders">
    <li class="stx-market" style="display:none"><a>MKT</a></li>
    <li class="stx-buy" style="display:none"><a>Buy</a></li>
    <li class="stx-sell" style="display:none"><a>Sell</a></li>
    <li class="stx-short" style="display:none"><a>Short</a></li>
    <li class="stx-cover" style="display:none"><a>Cover</a></li>
    <li class="stx-strangle" style="display:none">
      <a>Strangle</a>
      <div class="stx-tooltip left">
        <div>Strangle</div>
        <span></span></div>
    </li>
    <li class="stx-straddle" style="display:none">
      <a>Straddle</a>
      <div class="stx-tooltip left">
        <div>Straddle</div>
        <span></span></div>
    </li>
    <li class="stx-bracket" style="display:none">
      <a>Bracket</a>
      <div class="stx-tooltip left">
        <div>Bracket</div>
        <span></span></div>
    </li>
 </ul>
   
<div  style="display:none;" class="stx-panel-module stx-trade-account">
  <div class="stx-section">
    <table border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td>Net Liquidation Value</td>
        <td class="tfc-liquidity"></td>
      </tr>
      <tr>
        <td>Unsettled Cash</td>
        <td class="tfc-unsettled-cash"></td>
      </tr>
      <tr>
        <td>Cash and Sweep Vehicle</td>
        <td class="tfc-cash"></td>
      </tr>
      <tr>
        <td>Unrealized Gain/Loss</td>
        <td class="tfc-profitloss"></td>
      </tr>
      <tr>
        <td>Available Funds for Trading</td>
        <td class="tfc-buying-power"></td>
      </tr>
    </table>             
  </div>
</div>


<div class="stx-panel-module stx-trade-positions" style="display:none; position:relative">
  <div class="stx-head-bar">
      <h4><span class="stx-ico"></span>Positions</h4>
      <div class="stx-btn click stx-close-all">Close All</div>
      <ul class="tfc-positions-view holder">
      <li class="tfc-positions-view summary active"><i class="fa"></i></li>
      <li class="tfc-positions-view lots"><i class="fa"></i></li>
      <li class="tfc-positions-view performance"><i class="fa"></i></li>
      <li class="tfc-positions-view maintenance"><i class="fa">/</i></li>
      </ul>
  </div>
  <div class="stx-section stx-holder">
      <table cellspacing="0" cellpadding="0" border="0" class="stx-current-position">
      <thead>
        <tr class="tfc-positions-view summary active">
          <th scope="col">SYM</th>
          <th scope="col">QTY</th>
          <th scope="col">Basis</th>
          <!--th scope="col">Total</th-->
          <th scope="col">G/L</th>
          <th scope="col">% G/L</th>
          <!--th scope="col">Today</th-->
        </tr>
        <tr class="tfc-positions-view lots">
          <th scope="col" class="tfc-trade-date">Date</th>
          <th scope="col">QTY</th>
          <th scope="col">Basis</th>
          <th scope="col">G/L</th>
          <th scope="col">% G/L</th>
        </tr>
        <tr class="tfc-positions-view performance">
          <th scope="col">SYM</th>
          <th scope="col">Cost</th>
          <th scope="col">Value</th>
          <th scope="col">G/L</th>
          <th scope="col">% G/L</th>
        </tr>
        <tr class="tfc-positions-view maintenance">
          <th scope="col" class="tfc-col-qty">QTY</th>
          <th scope="col">Basis</th>
          <th scope="col" class="tfc-trade-actions" colspan=2>Protections</th>
          <th scope="col"></th>
        </tr>    	
      </thead>
      <tbody>
      </tbody>
      </table>                        
  </div>
</div>

<div class="stx-panel-module stx-trade-current" style="display:none; position:relative">
  <div class="stx-head-bar">
      <h4><span class="stx-ico"></span>Open Orders</h4>
  </div>
  <div class="stx-section stx-holder">
      <table cellspacing="0" cellpadding="0" border="0" class="stx-current-orders">
        <tbody>
        </tbody>
      </table>      
  </div>
</div>
<a class="stx-trade-ticket-toggle close" style="display:none">Expand/Collapse</a>
</div>
</div>
`;
