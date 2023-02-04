"use strict";function _slicedToArray(e,t){return _arrayWithHoles(e)||_iterableToArrayLimit(e,t)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function _iterableToArrayLimit(e,t){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e)){var a=[],n=!0,r=!1,o=void 0;try{for(var c,i=e[Symbol.iterator]();!(n=(c=i.next()).done)&&(a.push(c.value),!t||a.length!==t);n=!0);}catch(e){r=!0,o=e}finally{try{n||null==i.return||i.return()}finally{if(r)throw o}}return a}}function _arrayWithHoles(e){if(Array.isArray(e))return e}var allTransactions=[],csvSort=["Timestamp","Action","Source","Base","Volume","Price","Counter","Fee","FeeCcy","hash","method","hash","gas","gasPrice","gasUsed","priceAverage","FeeJPY","VolumeJPY"],methodId={Claim:"0xb2c12192",BatchDelegate:"0xdc4fcda7",Delegate:"0x026e402b",SetAutoClaiming:"0xe72dcdbb",EnableDelegationAccount:"0xf0977215",Deposit:"0xd0e30db0",CastVote:"0x56781388",Withdraw:"0x2e1a7d4d",SetClaimExecutors:"0x9119c494",Transfer:"0x",logClaim:"0xddf252ad"},action={BUY:"",SELL:"",PAY:"",MINING:"",SENDFEE:"",REDUCE:"",BONUS:"",LENDING:"",STAKING:"",CASH:"",BORROW:"",RETURN:"",LOSS:""},methodAddress={claim:["0x9edca806834e89cc928ef4951ce0506be8416309","0x85627d71921ae25769f5370e482ada5e1e418d37"],delegate:["0x1d80c49bbbcd1c0911346656b529df9e5c2f783d"]},flareApi="https://flare-explorer.flare.network/api",bbPriceUrl="https://public.bitbank.cc/flr_jpy/candlestick/1min/",dataTable=document.getElementById("transaction-data"),tableData=document.getElementById("transaction-data"),dlbtn=document.getElementById("download");function render(){for(;tableData.firstChild;)tableData.removeChild(tableData.firstChild);var l=document.getElementById("waddress").value,e="https://flare-explorer.flare.network/api?module=account&action=txlist&address=".concat(l);l&&fetch(e).then(function(e){return e.json()}).then(function(e){allTransactions=e.result;var d=[];return allTransactions.forEach(function(a){a.Source="flare.network",a.Base="FLR",a.Volume=0,a.Price="",a.Counter="FLR",a.FeeCcy="FLR",a.Comment=a.hash,a.candlestick={},a.priceAverage=0,a.wrapped=0,a.Fee=division10p18fixed8(a.gasPrice*a.gasUsed),a.method="Unknown";var e=new Date(1e3*a.timeStamp);a.Timestamp=convertToJapanDateTime(e,"YMDHMS"),a.unixtimeSec=e.setSeconds(0),a.ymd=convertToJapanDateTime(a.unixtimeSec,"YMD"),a.methodId=a.input.slice(0,10);for(var t=0,n=Object.entries(methodId);t<n.length;t++){var r=_slicedToArray(n[t],2),o=r[0],c=r[1];if(a.methodId==c){a.method=o;break}}var i=flareApi+"?module=transaction&action=gettxinfo&txhash=".concat(a.hash);d.push(fetch(i).then(function(e){return e.json()}).then(function(e){switch(a.logs=e.result.logs,a.method){case"Claim":a.logs[0]&&a.logs.forEach(function(e){e.topics[0].slice(0,10)==methodId.logClaim&&(a.Volume=division10p18fixed8(hexConvert(e.data)))});break;case"Deposit":a.wrapped=division10p18fixed8(a.value);break;case"Transfer":a.Volume=division10p18fixed8(a.value),l.toUpperCase()==a.from.toUpperCase()?(a.Volume=-a.Volume,a.Action="PAY"):a.Action="BONUS"}switch(a.method){case"Claim":a.Action="MINING";break;case"BatchDelegate":case"Delegate":case"SetAutoClaiming":case"EnableDelegationAccount":case"Deposit":case"CastVote":case"Withdraw":case"SetClaimExecutors":a.Action="SENDFEE"}var t=bbPriceUrl+a.ymd;return fetch(t).then(function(e){return e.ok?e.json():Promise.resolve({})})}).then(function(e){1==e.success&&e.data.candlestick[0].ohlcv.forEach(function(e){e[5]==a.unixtimeSec&&(a.candlestick=e,a.priceAverage=Number(((Number(e[0])+Number(e[1])+Number(e[2])+Number(e[3]))/4).toFixed(8)))})}))}),Promise.all(d).then(function(){allTransactions.forEach(function(e){var t=document.createElement("tr"),a=document.createElement("td");switch(a.innerHTML=e.method,a.classList.add("text-center"),e.method){case"BatchDelegate":case"Delegate":a.classList.add("bg-primary"),a.classList.add("text-white");break;case"Claim":a.classList.add("bg-warning");break;case"Deposit":a.classList.add("bg-success"),a.classList.add("text-white");break;default:a.classList.add("bg-light")}var n=document.createElement("td");n.classList.add("text-start"),n.innerHTML=e.Timestamp;var r=document.createElement("td");r.classList.add("text-start");var o=document.createElement("span");o.classList.add("material-symbols-outlined"),o.innerHTML="link";var c=document.createElement("a");c.href="https://flare-explorer.flare.network/tx/"+e.hash,c.target="_blank",c.appendChild(o),c.appendChild(document.createTextNode(e.hash)),r.appendChild(c);var i=document.createElement("td");i.innerHTML=e.wrapped;var d=document.createElement("td");d.innerHTML=e.Volume;var l=document.createElement("td");l.innerHTML=e.Fee;var s=document.createElement("td");s.innerHTML=e.priceAverage;var u=document.createElement("td");e.FeeJPY=(e.Fee*e.priceAverage).toFixed(8),u.innerHTML=e.FeeJPY;var m=document.createElement("td");e.VolumeJPY=(e.Volume*e.priceAverage).toFixed(8),0==e.VolumeJPY&&(e.VolumeJPY=0),m.innerHTML=e.VolumeJPY,t.appendChild(a),t.appendChild(n),t.appendChild(r),t.appendChild(i),t.appendChild(d),t.appendChild(l),t.appendChild(s),t.appendChild(u),t.appendChild(m),dataTable.appendChild(t)}),downloadCSV(allTransactions)})})}function convertToJapanDateTime(e,t){var a=new Date(e);"YMDHMS"==t?a.setHours(a.getHours()):"YMD"==t&&a.setHours(a.getHours()-9);var n=a.getFullYear(),r=(a.getMonth()+1).toString().padStart(2,"0"),o=a.getDate().toString().padStart(2,"0"),c=a.getHours().toString().padStart(2,"0"),i=a.getMinutes().toString().padStart(2,"0"),d=("0"+a.getSeconds()).slice(-2);return"YMDHMS"==t?"".concat(n,"-").concat(r,"-").concat(o," ").concat(c,":").concat(i,":").concat(d):"YMD"==t?"".concat(n).concat(r).concat(o):void 0}function downloadCSV(e){var n=[];e.forEach(function(t,e){delete t.candlestick,delete t.logs,delete t.input,delete t.isError,delete t.nonce,delete t.transactionIndex,delete t.value,delete t.txreceipt_status,delete t.contractAddress,delete t.methodId,delete t.ymd,delete t.blockHash,delete t.blockNumber,delete t.confirmations,delete t.cumulativeGasUsed,delete t.from,delete t.timeStamp,delete t.to,delete t.unixtimeSec,delete t.wrapped;var a={};csvSort.forEach(function(e){t.hasOwnProperty(e)&&(a[e]=t[e])}),n.push(a)});var a=Object.keys(n[0]),t=a.join(","),r=e.map(function(t){return a.map(function(e){return t[e]}).join(",")}).join("\n"),o="data:text/csv;charset=utf-8,".concat(t,"\n").concat(r),c=encodeURI(o);dlbtn.href=c,dlbtn.setAttribute("download","flr-csv.csv"),dlbtn.classList.remove("btn-secondary"),dlbtn.classList.add("btn-warning"),dlbtn.classList.remove("disabled")}function division10p18fixed8(e){return Number((e/1e18).toFixed(8))}function hexConvert(e){return parseInt(e,16)}