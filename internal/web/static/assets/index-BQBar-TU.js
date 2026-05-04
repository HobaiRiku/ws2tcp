const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Login-lO02capF.js","assets/client-BXgnPFun.js","assets/AppShell-Da7ngza_.js","assets/runtime-CfHl_dLx.js","assets/Dashboard-B5oTpDq9.js","assets/Server-Dbr19gJi.js","assets/forms-CaWIanOo.js","assets/Clients-BnAeu3rO.js","assets/Endpoints-fP2PRKQm.js"])))=>i.map(i=>d[i]);
import{$ as e,A as t,B as n,C as r,D as i,F as a,G as o,H as s,I as c,J as l,K as u,L as d,M as f,N as ee,O as te,P as ne,Q as re,R as ie,U as ae,V as oe,W as se,X as ce,Y as le,Z as ue,_ as de,a as p,b as fe,et as pe,g as me,h as he,i as ge,j as _e,k as ve,m as ye,n as be,nt as xe,p as Se,q as Ce,s as we,t as Te,tt as Ee,u as De,w as Oe,x as ke,y as Ae,z as je}from"./client-BXgnPFun.js";(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var Me=void 0,Ne=typeof window<`u`&&window.trustedTypes;if(Ne)try{Me=Ne.createPolicy(`vue`,{createHTML:e=>e})}catch{}var Pe=Me?e=>Me.createHTML(e):e=>e,Fe=`http://www.w3.org/2000/svg`,Ie=`http://www.w3.org/1998/Math/MathML`,Le=typeof document<`u`?document:null,Re=Le&&Le.createElement(`template`),ze={insert:(e,t,n)=>{t.insertBefore(e,n||null)},remove:e=>{let t=e.parentNode;t&&t.removeChild(e)},createElement:(e,t,n,r)=>{let i=t===`svg`?Le.createElementNS(Fe,e):t===`mathml`?Le.createElementNS(Ie,e):n?Le.createElement(e,{is:n}):Le.createElement(e);return e===`select`&&r&&r.multiple!=null&&i.setAttribute(`multiple`,r.multiple),i},createText:e=>Le.createTextNode(e),createComment:e=>Le.createComment(e),setText:(e,t)=>{e.nodeValue=t},setElementText:(e,t)=>{e.textContent=t},parentNode:e=>e.parentNode,nextSibling:e=>e.nextSibling,querySelector:e=>Le.querySelector(e),setScopeId(e,t){e.setAttribute(t,``)},insertStaticContent(e,t,n,r,i,a){let o=n?n.previousSibling:t.lastChild;if(i&&(i===a||i.nextSibling))for(;t.insertBefore(i.cloneNode(!0),n),!(i===a||!(i=i.nextSibling)););else{Re.innerHTML=Pe(r===`svg`?`<svg>${e}</svg>`:r===`mathml`?`<math>${e}</math>`:e);let i=Re.content;if(r===`svg`||r===`mathml`){let e=i.firstChild;for(;e.firstChild;)i.appendChild(e.firstChild);i.removeChild(e)}t.insertBefore(i,n)}return[o?o.nextSibling:t.firstChild,n?n.previousSibling:t.lastChild]}},Be=Symbol(`_vtc`);function Ve(e,t,n){let r=e[Be];r&&(t=(t?[t,...r]:[...r]).join(` `)),t==null?e.removeAttribute(`class`):n?e.setAttribute(`class`,t):e.className=t}var He=Symbol(`_vod`),Ue=Symbol(`_vsh`),We=Symbol(``),Ge=/(?:^|;)\s*display\s*:/;function Ke(e,t,n){let r=e.style,i=re(n),a=!1;if(n&&!i){if(t)if(re(t))for(let e of t.split(`;`)){let t=e.slice(0,e.indexOf(`:`)).trim();n[t]??Je(r,t,``)}else for(let e in t)n[e]??Je(r,e,``);for(let i in n){i===`display`&&(a=!0);let o=n[i];o==null?Je(r,i,``):Qe(e,i,!re(t)&&t?t[i]:void 0,o)||Je(r,i,o)}}else if(i){if(t!==n){let e=r[We];e&&(n+=`;`+e),r.cssText=n,a=Ge.test(n)}}else t&&e.removeAttribute(`style`);He in e&&(e[He]=a?r.display:``,e[Ue]&&(r.display=`none`))}var qe=/\s*!important$/;function Je(e,t,n){if(u(n))n.forEach(n=>Je(e,t,n));else if(n??=``,t.startsWith(`--`))e.setProperty(t,n);else{let r=Ze(e,t);qe.test(n)?e.setProperty(ae(r),n.replace(qe,``),`important`):e[r]=n}}var Ye=[`Webkit`,`Moz`,`ms`],Xe={};function Ze(e,t){let r=Xe[t];if(r)return r;let i=n(t);if(i!==`filter`&&i in e)return Xe[t]=i;i=oe(i);for(let n=0;n<Ye.length;n++){let r=Ye[n]+i;if(r in e)return Xe[t]=r}return t}function Qe(e,t,n,r){return e.tagName===`TEXTAREA`&&(t===`width`||t===`height`)&&re(r)&&n===r}var $e=`http://www.w3.org/1999/xlink`;function et(t,n,r,i,a,o=ue(n)){i&&n.startsWith(`xlink:`)?r==null?t.removeAttributeNS($e,n.slice(6,n.length)):t.setAttributeNS($e,n,r):r==null||o&&!se(r)?t.removeAttribute(n):t.setAttribute(n,o?``:e(r)?String(r):r)}function tt(e,t,n,r,i){if(t===`innerHTML`||t===`textContent`){n!=null&&(e[t]=t===`innerHTML`?Pe(n):n);return}let a=e.tagName;if(t===`value`&&a!==`PROGRESS`&&!a.includes(`-`)){let r=a===`OPTION`?e.getAttribute(`value`)||``:e.value,i=n==null?e.type===`checkbox`?`on`:``:String(n);(r!==i||!(`_value`in e))&&(e.value=i),n??e.removeAttribute(t),e._value=n;return}let o=!1;if(n===``||n==null){let r=typeof e[t];r===`boolean`?n=se(n):n==null&&r===`string`?(n=``,o=!0):r===`number`&&(n=0,o=!0)}try{e[t]=n}catch{}o&&e.removeAttribute(i||t)}function nt(e,t,n,r){e.addEventListener(t,n,r)}function rt(e,t,n,r){e.removeEventListener(t,n,r)}var it=Symbol(`_vei`);function at(e,t,n,r,i=null){let a=e[it]||(e[it]={}),o=a[t];if(r&&o)o.value=r;else{let[n,s]=st(t);r?nt(e,n,a[t]=dt(r,i),s):o&&(rt(e,n,o,s),a[t]=void 0)}}var ot=/(?:Once|Passive|Capture)$/;function st(e){let t;if(ot.test(e)){t={};let n;for(;n=e.match(ot);)e=e.slice(0,e.length-n[0].length),t[n[0].toLowerCase()]=!0}return[e[2]===`:`?e.slice(3):ae(e.slice(2)),t]}var ct=0,lt=Promise.resolve(),ut=()=>ct||=(lt.then(()=>ct=0),Date.now());function dt(e,t){let n=e=>{if(!e._vts)e._vts=Date.now();else if(e._vts<=n.attached)return;ge(ft(e,n.value),t,5,[e])};return n.value=e,n.attached=ut(),n}function ft(e,t){if(u(t)){let n=e.stopImmediatePropagation;return e.stopImmediatePropagation=()=>{n.call(e),e._stopped=!0},t.map(e=>t=>!t._stopped&&e&&e(t))}else return t}var pt=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&e.charCodeAt(2)>96&&e.charCodeAt(2)<123,mt=(e,t,r,i,a,o)=>{let s=a===`svg`;t===`class`?Ve(e,i,s):t===`style`?Ke(e,r,i):le(t)?l(t)||at(e,t,r,i,o):(t[0]===`.`?(t=t.slice(1),!0):t[0]===`^`?(t=t.slice(1),!1):ht(e,t,i,s))?(tt(e,t,i),!e.tagName.includes(`-`)&&(t===`value`||t===`checked`||t===`selected`)&&et(e,t,i,s,o,t!==`value`)):e._isVueCE&&(gt(e,t)||e._def.__asyncLoader&&(/[A-Z]/.test(t)||!re(i)))?tt(e,n(t),i,o,t):(t===`true-value`?e._trueValue=i:t===`false-value`&&(e._falseValue=i),et(e,t,i,s))};function ht(e,t,n,r){if(r)return!!(t===`innerHTML`||t===`textContent`||t in e&&pt(t)&&Ce(n));if(t===`spellcheck`||t===`draggable`||t===`translate`||t===`autocorrect`||t===`sandbox`&&e.tagName===`IFRAME`||t===`form`||t===`list`&&e.tagName===`INPUT`||t===`type`&&e.tagName===`TEXTAREA`)return!1;if(t===`width`||t===`height`){let t=e.tagName;if(t===`IMG`||t===`VIDEO`||t===`CANVAS`||t===`SOURCE`)return!1}return pt(t)&&re(n)?!1:t in e}function gt(e,t){let r=e._def.props;if(!r)return!1;let i=n(t);return Array.isArray(r)?r.some(e=>n(e)===i):Object.keys(r).some(e=>n(e)===i)}var _t=e=>{let t=e.props[`onUpdate:modelValue`]||!1;return u(t)?e=>o(t,e):t};function vt(e){e.target.composing=!0}function yt(e){let t=e.target;t.composing&&(t.composing=!1,t.dispatchEvent(new Event(`input`)))}var bt=Symbol(`_assign`);function xt(e,t,n){return t&&(e=e.trim()),n&&(e=xe(e)),e}var St={created(e,{modifiers:{lazy:t,trim:n,number:r}},i){e[bt]=_t(i);let a=r||i.props&&i.props.type===`number`;nt(e,t?`change`:`input`,t=>{t.target.composing||e[bt](xt(e.value,n,a))}),(n||a)&&nt(e,`change`,()=>{e.value=xt(e.value,n,a)}),t||(nt(e,`compositionstart`,vt),nt(e,`compositionend`,yt),nt(e,`change`,yt))},mounted(e,{value:t}){e.value=t??``},beforeUpdate(e,{value:t,oldValue:n,modifiers:{lazy:r,trim:i,number:a}},o){if(e[bt]=_t(o),e.composing)return;let s=(a||e.type===`number`)&&!/^0\d/.test(e.value)?xe(e.value):e.value,c=t??``;if(s===c)return;let l=e.getRootNode();(l instanceof Document||l instanceof ShadowRoot)&&l.activeElement===e&&e.type!==`range`&&(r&&t===n||i&&e.value.trim()===c)||(e.value=c)}},Ct={deep:!0,created(e,{value:t,modifiers:{number:n}},r){let i=ce(t);nt(e,`change`,()=>{let t=Array.prototype.filter.call(e.options,e=>e.selected).map(e=>n?xe(Tt(e)):Tt(e));e[bt](e.multiple?i?new Set(t):t:t[0]),e._assigning=!0,de(()=>{e._assigning=!1})}),e[bt]=_t(r)},mounted(e,{value:t}){wt(e,t)},beforeUpdate(e,t,n){e[bt]=_t(n)},updated(e,{value:t}){e._assigning||wt(e,t)}};function wt(e,t){let n=e.multiple,r=u(t);if(!(n&&!r&&!ce(t))){for(let i=0,a=e.options.length;i<a;i++){let a=e.options[i],o=Tt(a);if(n)if(r){let e=typeof o;e===`string`||e===`number`?a.selected=t.some(e=>String(e)===String(o)):a.selected=Ee(t,o)>-1}else a.selected=t.has(o);else if(pe(Tt(a),t)){e.selectedIndex!==i&&(e.selectedIndex=i);return}}!n&&e.selectedIndex!==-1&&(e.selectedIndex=-1)}}function Tt(e){return`_value`in e?e._value:e.value}var Et={esc:`escape`,space:` `,up:`arrow-up`,left:`arrow-left`,right:`arrow-right`,down:`arrow-down`,delete:`backspace`},Dt=(e,t)=>{let n=e._withKeys||={},r=t.join(`.`);return n[r]||(n[r]=(n=>{if(!(`key`in n))return;let r=ae(n.key);if(t.some(e=>e===r||Et[e]===r))return e(n)}))},Ot=s({patchProp:mt},ze),kt;function At(){return kt||=De(Ot)}var jt=((...e)=>{let t=At().createApp(...e),{mount:n}=t;return t.mount=e=>{let r=Nt(e);if(!r)return;let i=t._component;!Ce(i)&&!i.render&&!i.template&&(i.template=r.innerHTML),r.nodeType===1&&(r.textContent=``);let a=n(r,!1,Mt(r));return r instanceof Element&&(r.removeAttribute(`v-cloak`),r.setAttribute(`data-v-app`,``)),a},t});function Mt(e){if(e instanceof SVGElement)return`svg`;if(typeof MathMLElement==`function`&&e instanceof MathMLElement)return`mathml`}function Nt(e){return re(e)?document.querySelector(e):e}var Pt=typeof window<`u`,Ft,It=e=>Ft=e,Lt=Symbol();function Rt(e){return e&&typeof e==`object`&&Object.prototype.toString.call(e)===`[object Object]`&&typeof e.toJSON!=`function`}var zt;(function(e){e.direct=`direct`,e.patchObject=`patch object`,e.patchFunction=`patch function`})(zt||={});var Bt=typeof window==`object`&&window.window===window?window:typeof self==`object`&&self.self===self?self:typeof global==`object`&&global.global===global?global:typeof globalThis==`object`?globalThis:{HTMLElement:null};function Vt(e,{autoBom:t=!1}={}){return t&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)?new Blob([`﻿`,e],{type:e.type}):e}function Ht(e,t,n){let r=new XMLHttpRequest;r.open(`GET`,e),r.responseType=`blob`,r.onload=function(){qt(r.response,t,n)},r.onerror=function(){console.error(`could not download file`)},r.send()}function Ut(e){let t=new XMLHttpRequest;t.open(`HEAD`,e,!1);try{t.send()}catch{}return t.status>=200&&t.status<=299}function Wt(e){try{e.dispatchEvent(new MouseEvent(`click`))}catch{let t=new MouseEvent(`click`,{bubbles:!0,cancelable:!0,view:window,detail:0,screenX:80,screenY:20,clientX:80,clientY:20,ctrlKey:!1,altKey:!1,shiftKey:!1,metaKey:!1,button:0,relatedTarget:null});e.dispatchEvent(t)}}var Gt=typeof navigator==`object`?navigator:{userAgent:``},Kt=/Macintosh/.test(Gt.userAgent)&&/AppleWebKit/.test(Gt.userAgent)&&!/Safari/.test(Gt.userAgent),qt=Pt?typeof HTMLAnchorElement<`u`&&`download`in HTMLAnchorElement.prototype&&!Kt?Jt:`msSaveOrOpenBlob`in Gt?Yt:Xt:()=>{};function Jt(e,t=`download`,n){let r=document.createElement(`a`);r.download=t,r.rel=`noopener`,typeof e==`string`?(r.href=e,r.origin===location.origin?Wt(r):Ut(r.href)?Ht(e,t,n):(r.target=`_blank`,Wt(r))):(r.href=URL.createObjectURL(e),setTimeout(function(){URL.revokeObjectURL(r.href)},4e4),setTimeout(function(){Wt(r)},0))}function Yt(e,t=`download`,n){if(typeof e==`string`)if(Ut(e))Ht(e,t,n);else{let t=document.createElement(`a`);t.href=e,t.target=`_blank`,setTimeout(function(){Wt(t)})}else navigator.msSaveOrOpenBlob(Vt(e,n),t)}function Xt(e,t,n,r){if(r||=open(``,`_blank`),r&&(r.document.title=r.document.body.innerText=`downloading...`),typeof e==`string`)return Ht(e,t,n);let i=e.type===`application/octet-stream`,a=/constructor/i.test(String(Bt.HTMLElement))||`safari`in Bt,o=/CriOS\/[\d]+/.test(navigator.userAgent);if((o||i&&a||Kt)&&typeof FileReader<`u`){let t=new FileReader;t.onloadend=function(){let e=t.result;if(typeof e!=`string`)throw r=null,Error(`Wrong reader.result type`);e=o?e:e.replace(/^data:[^;]*;/,`data:attachment/file;`),r?r.location.href=e:location.assign(e),r=null},t.readAsDataURL(e)}else{let t=URL.createObjectURL(e);r?r.location.assign(t):location.href=t,r=null,setTimeout(function(){URL.revokeObjectURL(t)},4e4)}}var{assign:Zt}=Object;function Qt(){let e=i(!0),t=e.run(()=>ne({})),n=[],r=[],a=_e({install(e){It(a),a._a=e,e.provide(Lt,a),e.config.globalProperties.$pinia=a,r.forEach(e=>n.push(e)),r=[]},use(e){return this._a?n.push(e):r.push(e),this},_p:n,_a:null,_e:e,_s:new Map,state:t});return a}var $t=()=>{};function en(e,t,n,r=$t){e.add(t);let i=()=>{e.delete(t)&&r()};return!n&&te()&&f(i),i}function tn(e,...t){e.forEach(e=>{e(...t)})}var nn=e=>e(),rn=Symbol(),an=Symbol();function on(e,n){e instanceof Map&&n instanceof Map?n.forEach((t,n)=>e.set(n,t)):e instanceof Set&&n instanceof Set&&n.forEach(e.add,e);for(let r in n){if(!n.hasOwnProperty(r))continue;let i=n[r],a=e[r];Rt(a)&&Rt(i)&&e.hasOwnProperty(r)&&!t(i)&&!ve(i)?e[r]=on(a,i):e[r]=i}return e}var sn=Symbol();function cn(e){return!Rt(e)||!Object.prototype.hasOwnProperty.call(e,sn)}var{assign:ln}=Object;function un(e){return!!(t(e)&&e.effect)}function dn(e,t,n,r){let{state:i,actions:a,getters:o}=t,s=n.state.value[e],c;function l(){return s||(n.state.value[e]=i?i():{}),ln(ie(n.state.value[e]),a,Object.keys(o||{}).reduce((t,r)=>(t[r]=_e(p(()=>{It(n);let t=n._s.get(e);return o[r].call(t,t)})),t),{}))}return c=fn(e,l,t,n,r,!0),c}function fn(e,n,r={},a,o,s){let c,l=ln({actions:{}},r),u={deep:!0},f,te,re=new Set,ie=new Set,ae=a.state.value[e];!s&&!ae&&(a.state.value[e]={}),ne({});let oe;function se(t){let n;f=te=!1,typeof t==`function`?(t(a.state.value[e]),n={type:zt.patchFunction,storeId:e,events:void 0}):(on(a.state.value[e],t),n={type:zt.patchObject,payload:t,storeId:e,events:void 0});let r=oe=Symbol();de().then(()=>{oe===r&&(f=!0)}),te=!0,tn(re,n,a.state.value[e])}let ce=s?function(){let{state:e}=r,t=e?e():{};this.$patch(e=>{ln(e,t)})}:$t;function le(){c.stop(),re.clear(),ie.clear(),a._s.delete(e)}let ue=(t,n=``)=>{if(rn in t)return t[an]=n,t;let r=function(){It(a);let n=Array.from(arguments),i=new Set,o=new Set;function s(e){i.add(e)}function c(e){o.add(e)}tn(ie,{args:n,name:r[an],store:p,after:s,onError:c});let l;try{l=t.apply(this&&this.$id===e?this:p,n)}catch(e){throw tn(o,e),e}return l instanceof Promise?l.then(e=>(tn(i,e),e)).catch(e=>(tn(o,e),Promise.reject(e))):(tn(i,l),l)};return r[rn]=!0,r[an]=n,r},p=ee({_p:a,$id:e,$onAction:en.bind(null,ie),$patch:se,$reset:ce,$subscribe(t,n={}){let r=en(re,t,n.detached,()=>i()),i=c.run(()=>Oe(()=>a.state.value[e],r=>{(n.flush===`sync`?te:f)&&t({storeId:e,type:zt.direct,events:void 0},r)},ln({},u,n)));return r},$dispose:le});a._s.set(e,p);let fe=(a._a&&a._a.runWithContext||nn)(()=>a._e.run(()=>(c=i()).run(()=>n({action:ue}))));for(let n in fe){let r=fe[n];t(r)&&!un(r)||ve(r)?s||(ae&&cn(r)&&(t(r)?r.value=ae[n]:on(r,ae[n])),a.state.value[e][n]=r):typeof r==`function`&&(fe[n]=ue(r,n),l.actions[n]=r)}return ln(p,fe),ln(d(p),fe),Object.defineProperty(p,`$state`,{get:()=>a.state.value[e],set:e=>{se(t=>{ln(t,e)})}}),a._p.forEach(e=>{ln(p,c.run(()=>e({store:p,app:a._a,pinia:a,options:l})))}),ae&&s&&r.hydrate&&r.hydrate(p.$state,ae),f=!0,te=!0,p}function pn(e,t,n){let r,i=typeof t==`function`;r=i?n:t;function a(n,a){let o=he();return n||=o?me(Lt,null):null,n&&It(n),n=Ft,n._s.has(e)||(i?fn(e,t,r,n):dn(e,r,n)),n._s.get(e)}return a.$id=e,a}var mn=(function(){if(typeof globalThis<`u`)return globalThis;if(typeof global<`u`)return global;if(typeof self<`u`)return self;if(typeof window<`u`)return window;try{return Function(`return this`)()}catch{return{}}})();mn.trustedTypes===void 0&&(mn.trustedTypes={createPolicy:(e,t)=>t});var hn={configurable:!1,enumerable:!1,writable:!1};mn.FAST===void 0&&Reflect.defineProperty(mn,`FAST`,Object.assign({value:Object.create(null)},hn));var gn=mn.FAST;if(gn.getById===void 0){let e=Object.create(null);Reflect.defineProperty(gn,`getById`,Object.assign({value(t,n){let r=e[t];return r===void 0&&(r=n?e[t]=n():null),r}},hn))}var _n=Object.freeze([]);function vn(){let e=new WeakMap;return function(t){let n=e.get(t);if(n===void 0){let r=Reflect.getPrototypeOf(t);for(;n===void 0&&r!==null;)n=e.get(r),r=Reflect.getPrototypeOf(r);n=n===void 0?[]:n.slice(0),e.set(t,n)}return n}}var yn=mn.FAST.getById(1,()=>{let e=[],t=[];function n(){if(t.length)throw t.shift()}function r(e){try{e.call()}catch(e){t.push(e),setTimeout(n,0)}}function i(){let t=0;for(;t<e.length;)if(r(e[t]),t++,t>1024){for(let n=0,r=e.length-t;n<r;n++)e[n]=e[n+t];e.length-=t,t=0}e.length=0}function a(t){e.length<1&&mn.requestAnimationFrame(i),e.push(t)}return Object.freeze({enqueue:a,process:i})}),bn=mn.trustedTypes.createPolicy(`fast-html`,{createHTML:e=>e}),xn=bn,Sn=`fast-${Math.random().toString(36).substring(2,8)}`,Cn=`${Sn}{`,wn=`}${Sn}`,m=Object.freeze({supportsAdoptedStyleSheets:Array.isArray(document.adoptedStyleSheets)&&`replace`in CSSStyleSheet.prototype,setHTMLPolicy(e){if(xn!==bn)throw Error(`The HTML policy can only be set once.`);xn=e},createHTML(e){return xn.createHTML(e)},isMarker(e){return e&&e.nodeType===8&&e.data.startsWith(Sn)},extractDirectiveIndexFromMarker(e){return parseInt(e.data.replace(`${Sn}:`,``))},createInterpolationPlaceholder(e){return`${Cn}${e}${wn}`},createCustomAttributePlaceholder(e,t){return`${e}="${this.createInterpolationPlaceholder(t)}"`},createBlockPlaceholder(e){return`<!--${Sn}:${e}-->`},queueUpdate:yn.enqueue,processUpdates:yn.process,nextUpdate(){return new Promise(yn.enqueue)},setAttribute(e,t,n){n==null?e.removeAttribute(t):e.setAttribute(t,n)},setBooleanAttribute(e,t,n){n?e.setAttribute(t,``):e.removeAttribute(t)},removeChildNodes(e){for(let t=e.firstChild;t!==null;t=e.firstChild)e.removeChild(t)},createTemplateWalker(e){return document.createTreeWalker(e,133,null,!1)}}),Tn=class{constructor(e,t){this.sub1=void 0,this.sub2=void 0,this.spillover=void 0,this.source=e,this.sub1=t}has(e){return this.spillover===void 0?this.sub1===e||this.sub2===e:this.spillover.indexOf(e)!==-1}subscribe(e){let t=this.spillover;if(t===void 0){if(this.has(e))return;if(this.sub1===void 0){this.sub1=e;return}if(this.sub2===void 0){this.sub2=e;return}this.spillover=[this.sub1,this.sub2,e],this.sub1=void 0,this.sub2=void 0}else t.indexOf(e)===-1&&t.push(e)}unsubscribe(e){let t=this.spillover;if(t===void 0)this.sub1===e?this.sub1=void 0:this.sub2===e&&(this.sub2=void 0);else{let n=t.indexOf(e);n!==-1&&t.splice(n,1)}}notify(e){let t=this.spillover,n=this.source;if(t===void 0){let t=this.sub1,r=this.sub2;t!==void 0&&t.handleChange(n,e),r!==void 0&&r.handleChange(n,e)}else for(let r=0,i=t.length;r<i;++r)t[r].handleChange(n,e)}},En=class{constructor(e){this.subscribers={},this.sourceSubscribers=null,this.source=e}notify(e){var t;let n=this.subscribers[e];n!==void 0&&n.notify(e),(t=this.sourceSubscribers)==null||t.notify(e)}subscribe(e,t){if(t){let n=this.subscribers[t];n===void 0&&(this.subscribers[t]=n=new Tn(this.source)),n.subscribe(e)}else this.sourceSubscribers=this.sourceSubscribers??new Tn(this.source),this.sourceSubscribers.subscribe(e)}unsubscribe(e,t){var n;if(t){let n=this.subscribers[t];n!==void 0&&n.unsubscribe(e)}else (n=this.sourceSubscribers)==null||n.unsubscribe(e)}},h=gn.getById(2,()=>{let e=/(:|&&|\|\||if)/,t=new WeakMap,n=m.queueUpdate,r,i=e=>{throw Error(`Must call enableArrayObservation before observing arrays.`)};function a(e){let n=e.$fastController||t.get(e);return n===void 0&&(Array.isArray(e)?n=i(e):t.set(e,n=new En(e))),n}let o=vn();class s{constructor(e){this.name=e,this.field=`_${e}`,this.callback=`${e}Changed`}getValue(e){return r!==void 0&&r.watch(e,this.name),e[this.field]}setValue(e,t){let n=this.field,r=e[n];if(r!==t){e[n]=t;let i=e[this.callback];typeof i==`function`&&i.call(e,r,t),a(e).notify(this.name)}}}class c extends Tn{constructor(e,t,n=!1){super(e,t),this.binding=e,this.isVolatileBinding=n,this.needsRefresh=!0,this.needsQueue=!0,this.first=this,this.last=null,this.propertySource=void 0,this.propertyName=void 0,this.notifier=void 0,this.next=void 0}observe(e,t){this.needsRefresh&&this.last!==null&&this.disconnect();let n=r;r=this.needsRefresh?this:void 0,this.needsRefresh=this.isVolatileBinding;let i=this.binding(e,t);return r=n,i}disconnect(){if(this.last!==null){let e=this.first;for(;e!==void 0;)e.notifier.unsubscribe(this,e.propertyName),e=e.next;this.last=null,this.needsRefresh=this.needsQueue=!0}}watch(e,t){let n=this.last,i=a(e),o=n===null?this.first:{};if(o.propertySource=e,o.propertyName=t,o.notifier=i,i.subscribe(this,t),n!==null){if(!this.needsRefresh){let t;r=void 0,t=n.propertySource[n.propertyName],r=this,e===t&&(this.needsRefresh=!0)}n.next=o}this.last=o}handleChange(){this.needsQueue&&(this.needsQueue=!1,n(this))}call(){this.last!==null&&(this.needsQueue=!0,this.notify(this))}records(){let e=this.first;return{next:()=>{let t=e;return t===void 0?{value:void 0,done:!0}:(e=e.next,{value:t,done:!1})},[Symbol.iterator]:function(){return this}}}}return Object.freeze({setArrayObserverFactory(e){i=e},getNotifier:a,track(e,t){r!==void 0&&r.watch(e,t)},trackVolatile(){r!==void 0&&(r.needsRefresh=!0)},notify(e,t){a(e).notify(t)},defineProperty(e,t){typeof t==`string`&&(t=new s(t)),o(e).push(t),Reflect.defineProperty(e,t.name,{enumerable:!0,get:function(){return t.getValue(this)},set:function(e){t.setValue(this,e)}})},getAccessors:o,binding(e,t,n=this.isVolatileBinding(e)){return new c(e,t,n)},isVolatileBinding(t){return e.test(t.toString())}})});function g(e,t){h.defineProperty(e,t)}function Dn(e,t,n){return Object.assign({},n,{get:function(){return h.trackVolatile(),n.get.apply(this)}})}var On=gn.getById(3,()=>{let e=null;return{get(){return e},set(t){e=t}}}),kn=class{constructor(){this.index=0,this.length=0,this.parent=null,this.parentContext=null}get event(){return On.get()}get isEven(){return this.index%2==0}get isOdd(){return this.index%2!=0}get isFirst(){return this.index===0}get isInMiddle(){return!this.isFirst&&!this.isLast}get isLast(){return this.index===this.length-1}static setEvent(e){On.set(e)}};h.defineProperty(kn.prototype,`index`),h.defineProperty(kn.prototype,`length`);var An=Object.seal(new kn),jn=class{constructor(){this.targetIndex=0}},Mn=class extends jn{constructor(){super(...arguments),this.createPlaceholder=m.createInterpolationPlaceholder}},Nn=class extends jn{constructor(e,t,n){super(),this.name=e,this.behavior=t,this.options=n}createPlaceholder(e){return m.createCustomAttributePlaceholder(this.name,e)}createBehavior(e){return new this.behavior(e,this.options)}};function Pn(e,t){this.source=e,this.context=t,this.bindingObserver===null&&(this.bindingObserver=h.binding(this.binding,this,this.isBindingVolatile)),this.updateTarget(this.bindingObserver.observe(e,t))}function Fn(e,t){this.source=e,this.context=t,this.target.addEventListener(this.targetName,this)}function In(){this.bindingObserver.disconnect(),this.source=null,this.context=null}function Ln(){this.bindingObserver.disconnect(),this.source=null,this.context=null;let e=this.target.$fastView;e!==void 0&&e.isComposed&&(e.unbind(),e.needsBindOnly=!0)}function Rn(){this.target.removeEventListener(this.targetName,this),this.source=null,this.context=null}function zn(e){m.setAttribute(this.target,this.targetName,e)}function Bn(e){m.setBooleanAttribute(this.target,this.targetName,e)}function Vn(e){if(e??=``,e.create){this.target.textContent=``;let t=this.target.$fastView;t===void 0?t=e.create():this.target.$fastTemplate!==e&&(t.isComposed&&(t.remove(),t.unbind()),t=e.create()),t.isComposed?t.needsBindOnly&&(t.needsBindOnly=!1,t.bind(this.source,this.context)):(t.isComposed=!0,t.bind(this.source,this.context),t.insertBefore(this.target),this.target.$fastView=t,this.target.$fastTemplate=e)}else{let t=this.target.$fastView;t!==void 0&&t.isComposed&&(t.isComposed=!1,t.remove(),t.needsBindOnly?t.needsBindOnly=!1:t.unbind()),this.target.textContent=e}}function Hn(e){this.target[this.targetName]=e}function Un(e){let t=this.classVersions||Object.create(null),n=this.target,r=this.version||0;if(e!=null&&e.length){let i=e.split(/\s+/);for(let e=0,a=i.length;e<a;++e){let a=i[e];a!==``&&(t[a]=r,n.classList.add(a))}}if(this.classVersions=t,this.version=r+1,r!==0){--r;for(let e in t)t[e]===r&&n.classList.remove(e)}}var Wn=class extends Mn{constructor(e){super(),this.binding=e,this.bind=Pn,this.unbind=In,this.updateTarget=zn,this.isBindingVolatile=h.isVolatileBinding(this.binding)}get targetName(){return this.originalTargetName}set targetName(e){if(this.originalTargetName=e,e!==void 0)switch(e[0]){case`:`:if(this.cleanedTargetName=e.substr(1),this.updateTarget=Hn,this.cleanedTargetName===`innerHTML`){let e=this.binding;this.binding=(t,n)=>m.createHTML(e(t,n))}break;case`?`:this.cleanedTargetName=e.substr(1),this.updateTarget=Bn;break;case`@`:this.cleanedTargetName=e.substr(1),this.bind=Fn,this.unbind=Rn;break;default:this.cleanedTargetName=e,e===`class`&&(this.updateTarget=Un);break}}targetAtContent(){this.updateTarget=Vn,this.unbind=Ln}createBehavior(e){return new Gn(e,this.binding,this.isBindingVolatile,this.bind,this.unbind,this.updateTarget,this.cleanedTargetName)}},Gn=class{constructor(e,t,n,r,i,a,o){this.source=null,this.context=null,this.bindingObserver=null,this.target=e,this.binding=t,this.isBindingVolatile=n,this.bind=r,this.unbind=i,this.updateTarget=a,this.targetName=o}handleChange(){this.updateTarget(this.bindingObserver.observe(this.source,this.context))}handleEvent(e){kn.setEvent(e);let t=this.binding(this.source,this.context);kn.setEvent(null),t!==!0&&e.preventDefault()}},Kn=null,qn=class e{addFactory(e){e.targetIndex=this.targetIndex,this.behaviorFactories.push(e)}captureContentBinding(e){e.targetAtContent(),this.addFactory(e)}reset(){this.behaviorFactories=[],this.targetIndex=-1}release(){Kn=this}static borrow(t){let n=Kn||new e;return n.directives=t,n.reset(),Kn=null,n}};function Jn(e){if(e.length===1)return e[0];let t,n=e.length,r=e.map(e=>typeof e==`string`?()=>e:(t=e.targetName||t,e.binding)),i=new Wn((e,t)=>{let i=``;for(let a=0;a<n;++a)i+=r[a](e,t);return i});return i.targetName=t,i}var Yn=wn.length;function Xn(e,t){let n=t.split(Cn);if(n.length===1)return null;let r=[];for(let t=0,i=n.length;t<i;++t){let i=n[t],a=i.indexOf(wn),o;if(a===-1)o=i;else{let t=parseInt(i.substring(0,a));r.push(e.directives[t]),o=i.substring(a+Yn)}o!==``&&r.push(o)}return r}function Zn(e,t,n=!1){let r=t.attributes;for(let i=0,a=r.length;i<a;++i){let o=r[i],s=o.value,c=Xn(e,s),l=null;c===null?n&&(l=new Wn(()=>s),l.targetName=o.name):l=Jn(c),l!==null&&(t.removeAttributeNode(o),i--,a--,e.addFactory(l))}}function Qn(e,t,n){let r=Xn(e,t.textContent);if(r!==null){let i=t;for(let a=0,o=r.length;a<o;++a){let o=r[a],s=a===0?t:i.parentNode.insertBefore(document.createTextNode(``),i.nextSibling);typeof o==`string`?s.textContent=o:(s.textContent=` `,e.captureContentBinding(o)),i=s,e.targetIndex++,s!==t&&n.nextNode()}e.targetIndex--}}function $n(e,t){let n=e.content;document.adoptNode(n);let r=qn.borrow(t);Zn(r,e,!0);let i=r.behaviorFactories;r.reset();let a=m.createTemplateWalker(n),o;for(;o=a.nextNode();)switch(r.targetIndex++,o.nodeType){case 1:Zn(r,o);break;case 3:Qn(r,o,a);break;case 8:m.isMarker(o)&&r.addFactory(t[m.extractDirectiveIndexFromMarker(o)])}let s=0;(m.isMarker(n.firstChild)||n.childNodes.length===1&&t.length)&&(n.insertBefore(document.createComment(``),n.firstChild),s=-1);let c=r.behaviorFactories;return r.release(),{fragment:n,viewBehaviorFactories:c,hostBehaviorFactories:i,targetOffset:s}}var er=document.createRange(),tr=class{constructor(e,t){this.fragment=e,this.behaviors=t,this.source=null,this.context=null,this.firstChild=e.firstChild,this.lastChild=e.lastChild}appendTo(e){e.appendChild(this.fragment)}insertBefore(e){if(this.fragment.hasChildNodes())e.parentNode.insertBefore(this.fragment,e);else{let t=this.lastChild;if(e.previousSibling===t)return;let n=e.parentNode,r=this.firstChild,i;for(;r!==t;)i=r.nextSibling,n.insertBefore(r,e),r=i;n.insertBefore(t,e)}}remove(){let e=this.fragment,t=this.lastChild,n=this.firstChild,r;for(;n!==t;)r=n.nextSibling,e.appendChild(n),n=r;e.appendChild(t)}dispose(){let e=this.firstChild.parentNode,t=this.lastChild,n=this.firstChild,r;for(;n!==t;)r=n.nextSibling,e.removeChild(n),n=r;e.removeChild(t);let i=this.behaviors,a=this.source;for(let e=0,t=i.length;e<t;++e)i[e].unbind(a)}bind(e,t){let n=this.behaviors;if(this.source!==e)if(this.source!==null){let r=this.source;this.source=e,this.context=t;for(let i=0,a=n.length;i<a;++i){let a=n[i];a.unbind(r),a.bind(e,t)}}else{this.source=e,this.context=t;for(let r=0,i=n.length;r<i;++r)n[r].bind(e,t)}}unbind(){if(this.source===null)return;let e=this.behaviors,t=this.source;for(let n=0,r=e.length;n<r;++n)e[n].unbind(t);this.source=null}static disposeContiguousBatch(e){if(e.length!==0){er.setStartBefore(e[0].firstChild),er.setEndAfter(e[e.length-1].lastChild),er.deleteContents();for(let t=0,n=e.length;t<n;++t){let n=e[t],r=n.behaviors,i=n.source;for(let e=0,t=r.length;e<t;++e)r[e].unbind(i)}}}},nr=class{constructor(e,t){this.behaviorCount=0,this.hasHostBehaviors=!1,this.fragment=null,this.targetOffset=0,this.viewBehaviorFactories=null,this.hostBehaviorFactories=null,this.html=e,this.directives=t}create(e){if(this.fragment===null){let e,t=this.html;if(typeof t==`string`){e=document.createElement(`template`),e.innerHTML=m.createHTML(t);let n=e.content.firstElementChild;n!==null&&n.tagName===`TEMPLATE`&&(e=n)}else e=t;let n=$n(e,this.directives);this.fragment=n.fragment,this.viewBehaviorFactories=n.viewBehaviorFactories,this.hostBehaviorFactories=n.hostBehaviorFactories,this.targetOffset=n.targetOffset,this.behaviorCount=this.viewBehaviorFactories.length+this.hostBehaviorFactories.length,this.hasHostBehaviors=this.hostBehaviorFactories.length>0}let t=this.fragment.cloneNode(!0),n=this.viewBehaviorFactories,r=Array(this.behaviorCount),i=m.createTemplateWalker(t),a=0,o=this.targetOffset,s=i.nextNode();for(let e=n.length;a<e;++a){let e=n[a],t=e.targetIndex;for(;s!==null;)if(o===t){r[a]=e.createBehavior(s);break}else s=i.nextNode(),o++}if(this.hasHostBehaviors){let t=this.hostBehaviorFactories;for(let n=0,i=t.length;n<i;++n,++a)r[a]=t[n].createBehavior(e)}return new tr(t,r)}render(e,t,n){typeof t==`string`&&(t=document.getElementById(t)),n===void 0&&(n=t);let r=this.create(n);return r.bind(e,An),r.appendTo(t),r}},rr=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;function _(e,...t){let n=[],r=``;for(let i=0,a=e.length-1;i<a;++i){let a=e[i],o=t[i];if(r+=a,o instanceof nr){let e=o;o=()=>e}if(typeof o==`function`&&(o=new Wn(o)),o instanceof Mn){let e=rr.exec(a);e!==null&&(o.targetName=e[2])}o instanceof jn?(r+=o.createPlaceholder(n.length),n.push(o)):r+=o}return r+=e[e.length-1],new nr(r,n)}var ir=class{constructor(){this.targets=new WeakSet}addStylesTo(e){this.targets.add(e)}removeStylesFrom(e){this.targets.delete(e)}isAttachedTo(e){return this.targets.has(e)}withBehaviors(...e){return this.behaviors=this.behaviors===null?e:this.behaviors.concat(e),this}};ir.create=(()=>{if(m.supportsAdoptedStyleSheets){let e=new Map;return t=>new dr(t,e)}return e=>new mr(e)})();function ar(e){return e.map(e=>e instanceof ir?ar(e.styles):[e]).reduce((e,t)=>e.concat(t),[])}function or(e){return e.map(e=>e instanceof ir?e.behaviors:null).reduce((e,t)=>t===null?e:(e===null&&(e=[]),e.concat(t)),null)}var sr=Symbol(`prependToAdoptedStyleSheets`);function cr(e){let t=[],n=[];return e.forEach(e=>(e[sr]?t:n).push(e)),{prepend:t,append:n}}var lr=(e,t)=>{let{prepend:n,append:r}=cr(t);e.adoptedStyleSheets=[...n,...e.adoptedStyleSheets,...r]},ur=(e,t)=>{e.adoptedStyleSheets=e.adoptedStyleSheets.filter(e=>t.indexOf(e)===-1)};if(m.supportsAdoptedStyleSheets)try{document.adoptedStyleSheets.push(),document.adoptedStyleSheets.splice(),lr=(e,t)=>{let{prepend:n,append:r}=cr(t);e.adoptedStyleSheets.splice(0,0,...n),e.adoptedStyleSheets.push(...r)},ur=(e,t)=>{for(let n of t){let t=e.adoptedStyleSheets.indexOf(n);t!==-1&&e.adoptedStyleSheets.splice(t,1)}}}catch{}var dr=class extends ir{constructor(e,t){super(),this.styles=e,this.styleSheetCache=t,this._styleSheets=void 0,this.behaviors=or(e)}get styleSheets(){if(this._styleSheets===void 0){let e=this.styles,t=this.styleSheetCache;this._styleSheets=ar(e).map(e=>{if(e instanceof CSSStyleSheet)return e;let n=t.get(e);return n===void 0&&(n=new CSSStyleSheet,n.replaceSync(e),t.set(e,n)),n})}return this._styleSheets}addStylesTo(e){lr(e,this.styleSheets),super.addStylesTo(e)}removeStylesFrom(e){ur(e,this.styleSheets),super.removeStylesFrom(e)}},fr=0;function pr(){return`fast-style-class-${++fr}`}var mr=class extends ir{constructor(e){super(),this.styles=e,this.behaviors=null,this.behaviors=or(e),this.styleSheets=ar(e),this.styleClass=pr()}addStylesTo(e){let t=this.styleSheets,n=this.styleClass;e=this.normalizeTarget(e);for(let r=0;r<t.length;r++){let i=document.createElement(`style`);i.innerHTML=t[r],i.className=n,e.append(i)}super.addStylesTo(e)}removeStylesFrom(e){e=this.normalizeTarget(e);let t=e.querySelectorAll(`.${this.styleClass}`);for(let n=0,r=t.length;n<r;++n)e.removeChild(t[n]);super.removeStylesFrom(e)}isAttachedTo(e){return super.isAttachedTo(this.normalizeTarget(e))}normalizeTarget(e){return e===document?document.body:e}},hr=Object.freeze({locate:vn()}),gr={toView(e){return e?`true`:`false`},fromView(e){return!(e==null||e===`false`||e===!1||e===0)}},v={toView(e){if(e==null)return null;let t=e*1;return isNaN(t)?null:t.toString()},fromView(e){if(e==null)return null;let t=e*1;return isNaN(t)?null:t}},_r=class e{constructor(e,t,n=t.toLowerCase(),r=`reflect`,i){this.guards=new Set,this.Owner=e,this.name=t,this.attribute=n,this.mode=r,this.converter=i,this.fieldName=`_${t}`,this.callbackName=`${t}Changed`,this.hasCallback=this.callbackName in e.prototype,r===`boolean`&&i===void 0&&(this.converter=gr)}setValue(e,t){let n=e[this.fieldName],r=this.converter;r!==void 0&&(t=r.fromView(t)),n!==t&&(e[this.fieldName]=t,this.tryReflectToAttribute(e),this.hasCallback&&e[this.callbackName](n,t),e.$fastController.notify(this.name))}getValue(e){return h.track(e,this.name),e[this.fieldName]}onAttributeChangedCallback(e,t){this.guards.has(e)||(this.guards.add(e),this.setValue(e,t),this.guards.delete(e))}tryReflectToAttribute(e){let t=this.mode,n=this.guards;n.has(e)||t===`fromView`||m.queueUpdate(()=>{n.add(e);let r=e[this.fieldName];switch(t){case`reflect`:let t=this.converter;m.setAttribute(e,this.attribute,t===void 0?r:t.toView(r));break;case`boolean`:m.setBooleanAttribute(e,this.attribute,r);break}n.delete(e)})}static collect(t,...n){let r=[];n.push(hr.locate(t));for(let i=0,a=n.length;i<a;++i){let a=n[i];if(a!==void 0)for(let n=0,i=a.length;n<i;++n){let i=a[n];typeof i==`string`?r.push(new e(t,i)):r.push(new e(t,i.property,i.attribute,i.mode,i.converter))}}return r}};function y(e,t){let n;function r(e,t){arguments.length>1&&(n.property=t),hr.locate(e.constructor).push(n)}if(arguments.length>1){n={},r(e,t);return}return n=e===void 0?{}:e,r}var vr={mode:`open`},yr={},br=gn.getById(4,()=>{let e=new Map;return Object.freeze({register(t){return e.has(t.type)?!1:(e.set(t.type,t),!0)},getByType(t){return e.get(t)}})}),xr=class{constructor(e,t=e.definition){typeof t==`string`&&(t={name:t}),this.type=e,this.name=t.name,this.template=t.template;let n=_r.collect(e,t.attributes),r=Array(n.length),i={},a={};for(let e=0,t=n.length;e<t;++e){let t=n[e];r[e]=t.attribute,i[t.name]=t,a[t.attribute]=t}this.attributes=n,this.observedAttributes=r,this.propertyLookup=i,this.attributeLookup=a,this.shadowOptions=t.shadowOptions===void 0?vr:t.shadowOptions===null?void 0:Object.assign(Object.assign({},vr),t.shadowOptions),this.elementOptions=t.elementOptions===void 0?yr:Object.assign(Object.assign({},yr),t.elementOptions),this.styles=t.styles===void 0?void 0:Array.isArray(t.styles)?ir.create(t.styles):t.styles instanceof ir?t.styles:ir.create([t.styles])}get isDefined(){return!!br.getByType(this.type)}define(e=customElements){let t=this.type;if(br.register(this)){let e=this.attributes,n=t.prototype;for(let t=0,r=e.length;t<r;++t)h.defineProperty(n,e[t]);Reflect.defineProperty(t,`observedAttributes`,{value:this.observedAttributes,enumerable:!0})}return e.get(this.name)||e.define(this.name,t,this.elementOptions),this}};xr.forType=br.getByType;var Sr=new WeakMap,Cr={bubbles:!0,composed:!0,cancelable:!0};function wr(e){return e.shadowRoot||Sr.get(e)||null}var Tr=class e extends En{constructor(e,t){super(e),this.boundObservables=null,this.behaviors=null,this.needsInitialization=!0,this._template=null,this._styles=null,this._isConnected=!1,this.$fastController=this,this.view=null,this.element=e,this.definition=t;let n=t.shadowOptions;if(n!==void 0){let t=e.attachShadow(n);n.mode===`closed`&&Sr.set(e,t)}let r=h.getAccessors(e);if(r.length>0){let t=this.boundObservables=Object.create(null);for(let n=0,i=r.length;n<i;++n){let i=r[n].name,a=e[i];a!==void 0&&(delete e[i],t[i]=a)}}}get isConnected(){return h.track(this,`isConnected`),this._isConnected}setIsConnected(e){this._isConnected=e,h.notify(this,`isConnected`)}get template(){return this._template}set template(e){this._template!==e&&(this._template=e,this.needsInitialization||this.renderTemplate(e))}get styles(){return this._styles}set styles(e){this._styles!==e&&(this._styles!==null&&this.removeStyles(this._styles),this._styles=e,!this.needsInitialization&&e!==null&&this.addStyles(e))}addStyles(e){let t=wr(this.element)||this.element.getRootNode();if(e instanceof HTMLStyleElement)t.append(e);else if(!e.isAttachedTo(t)){let n=e.behaviors;e.addStylesTo(t),n!==null&&this.addBehaviors(n)}}removeStyles(e){let t=wr(this.element)||this.element.getRootNode();if(e instanceof HTMLStyleElement)t.removeChild(e);else if(e.isAttachedTo(t)){let n=e.behaviors;e.removeStylesFrom(t),n!==null&&this.removeBehaviors(n)}}addBehaviors(e){let t=this.behaviors||=new Map,n=e.length,r=[];for(let i=0;i<n;++i){let n=e[i];t.has(n)?t.set(n,t.get(n)+1):(t.set(n,1),r.push(n))}if(this._isConnected){let e=this.element;for(let t=0;t<r.length;++t)r[t].bind(e,An)}}removeBehaviors(e,t=!1){let n=this.behaviors;if(n===null)return;let r=e.length,i=[];for(let a=0;a<r;++a){let r=e[a];if(n.has(r)){let e=n.get(r)-1;e===0||t?n.delete(r)&&i.push(r):n.set(r,e)}}if(this._isConnected){let e=this.element;for(let t=0;t<i.length;++t)i[t].unbind(e)}}onConnectedCallback(){if(this._isConnected)return;let e=this.element;this.needsInitialization?this.finishInitialization():this.view!==null&&this.view.bind(e,An);let t=this.behaviors;if(t!==null)for(let[n]of t)n.bind(e,An);this.setIsConnected(!0)}onDisconnectedCallback(){if(!this._isConnected)return;this.setIsConnected(!1);let e=this.view;e!==null&&e.unbind();let t=this.behaviors;if(t!==null){let e=this.element;for(let[n]of t)n.unbind(e)}}onAttributeChangedCallback(e,t,n){let r=this.definition.attributeLookup[e];r!==void 0&&r.onAttributeChangedCallback(this.element,n)}emit(e,t,n){return this._isConnected?this.element.dispatchEvent(new CustomEvent(e,Object.assign(Object.assign({detail:t},Cr),n))):!1}finishInitialization(){let e=this.element,t=this.boundObservables;if(t!==null){let n=Object.keys(t);for(let r=0,i=n.length;r<i;++r){let i=n[r];e[i]=t[i]}this.boundObservables=null}let n=this.definition;this._template===null&&(this.element.resolveTemplate?this._template=this.element.resolveTemplate():n.template&&(this._template=n.template||null)),this._template!==null&&this.renderTemplate(this._template),this._styles===null&&(this.element.resolveStyles?this._styles=this.element.resolveStyles():n.styles&&(this._styles=n.styles||null)),this._styles!==null&&this.addStyles(this._styles),this.needsInitialization=!1}renderTemplate(e){let t=this.element,n=wr(t)||t;this.view===null?this.needsInitialization||m.removeChildNodes(n):(this.view.dispose(),this.view=null),e&&(this.view=e.render(t,n,t))}static forCustomElement(t){let n=t.$fastController;if(n!==void 0)return n;let r=xr.forType(t.constructor);if(r===void 0)throw Error(`Missing FASTElement definition.`);return t.$fastController=new e(t,r)}};function Er(e){return class extends e{constructor(){super(),Tr.forCustomElement(this)}$emit(e,t,n){return this.$fastController.emit(e,t,n)}connectedCallback(){this.$fastController.onConnectedCallback()}disconnectedCallback(){this.$fastController.onDisconnectedCallback()}attributeChangedCallback(e,t,n){this.$fastController.onAttributeChangedCallback(e,t,n)}}}var Dr=Object.assign(Er(HTMLElement),{from(e){return Er(e)},define(e,t){return new xr(e,t).define().type}}),Or=class{createCSS(){return``}createBehavior(){}};function kr(e,t){let n=[],r=``,i=[];for(let a=0,o=e.length-1;a<o;++a){r+=e[a];let o=t[a];if(o instanceof Or){let e=o.createBehavior();o=o.createCSS(),e&&i.push(e)}o instanceof ir||o instanceof CSSStyleSheet?(r.trim()!==``&&(n.push(r),r=``),n.push(o)):r+=o}return r+=e[e.length-1],r.trim()!==``&&n.push(r),{styles:n,behaviors:i}}function b(e,...t){let{styles:n,behaviors:r}=kr(e,t),i=ir.create(n);return r.length&&i.withBehaviors(...r),i}var Ar=class extends Or{constructor(e,t){super(),this.behaviors=t,this.css=``;let n=e.reduce((e,t)=>(typeof t==`string`?this.css+=t:e.push(t),e),[]);n.length&&(this.styles=ir.create(n))}createBehavior(){return this}createCSS(){return this.css}bind(e){this.styles&&e.$fastController.addStyles(this.styles),this.behaviors.length&&e.$fastController.addBehaviors(this.behaviors)}unbind(e){this.styles&&e.$fastController.removeStyles(this.styles),this.behaviors.length&&e.$fastController.removeBehaviors(this.behaviors)}};function jr(e,...t){let{styles:n,behaviors:r}=kr(e,t);return new Ar(n,r)}function Mr(e,t,n){return{index:e,removed:t,addedCount:n}}var Nr=0,Pr=1,Fr=2,Ir=3;function Lr(e,t,n,r,i,a){let o=a-i+1,s=n-t+1,c=Array(o),l,u;for(let e=0;e<o;++e)c[e]=Array(s),c[e][0]=e;for(let e=0;e<s;++e)c[0][e]=e;for(let n=1;n<o;++n)for(let a=1;a<s;++a)e[t+a-1]===r[i+n-1]?c[n][a]=c[n-1][a-1]:(l=c[n-1][a]+1,u=c[n][a-1]+1,c[n][a]=l<u?l:u);return c}function Rr(e){let t=e.length-1,n=e[0].length-1,r=e[t][n],i=[];for(;t>0||n>0;){if(t===0){i.push(Fr),n--;continue}if(n===0){i.push(Ir),t--;continue}let a=e[t-1][n-1],o=e[t-1][n],s=e[t][n-1],c;c=o<s?o<a?o:a:s<a?s:a,c===a?(a===r?i.push(Nr):(i.push(Pr),r=a),t--,n--):c===o?(i.push(Ir),t--,r=o):(i.push(Fr),n--,r=s)}return i.reverse(),i}function zr(e,t,n){for(let r=0;r<n;++r)if(e[r]!==t[r])return r;return n}function Br(e,t,n){let r=e.length,i=t.length,a=0;for(;a<n&&e[--r]===t[--i];)a++;return a}function Vr(e,t,n,r){return t<n||r<e?-1:t===n||r===e?0:e<n?t<r?t-n:r-n:r<t?r-e:t-e}function Hr(e,t,n,r,i,a){let o=0,s=0,c=Math.min(n-t,a-i);if(t===0&&i===0&&(o=zr(e,r,c)),n===e.length&&a===r.length&&(s=Br(e,r,c-o)),t+=o,i+=o,n-=s,a-=s,n-t===0&&a-i===0)return _n;if(t===n){let e=Mr(t,[],0);for(;i<a;)e.removed.push(r[i++]);return[e]}else if(i===a)return[Mr(t,[],n-t)];let l=Rr(Lr(e,t,n,r,i,a)),u=[],d,f=t,ee=i;for(let e=0;e<l.length;++e)switch(l[e]){case Nr:d!==void 0&&(u.push(d),d=void 0),f++,ee++;break;case Pr:d===void 0&&(d=Mr(f,[],0)),d.addedCount++,f++,d.removed.push(r[ee]),ee++;break;case Fr:d===void 0&&(d=Mr(f,[],0)),d.addedCount++,f++;break;case Ir:d===void 0&&(d=Mr(f,[],0)),d.removed.push(r[ee]),ee++;break}return d!==void 0&&u.push(d),u}var Ur=Array.prototype.push;function Wr(e,t,n,r){let i=Mr(t,n,r),a=!1,o=0;for(let t=0;t<e.length;t++){let n=e[t];if(n.index+=o,a)continue;let r=Vr(i.index,i.index+i.removed.length,n.index,n.index+n.addedCount);if(r>=0){e.splice(t,1),t--,o-=n.addedCount-n.removed.length,i.addedCount+=n.addedCount-r;let s=i.removed.length+n.removed.length-r;if(!i.addedCount&&!s)a=!0;else{let e=n.removed;if(i.index<n.index){let t=i.removed.slice(0,n.index-i.index);Ur.apply(t,e),e=t}if(i.index+i.removed.length>n.index+n.addedCount){let t=i.removed.slice(n.index+n.addedCount-i.index);Ur.apply(e,t)}i.removed=e,n.index<i.index&&(i.index=n.index)}}else if(i.index<n.index){a=!0,e.splice(t,0,i),t++;let r=i.addedCount-i.removed.length;n.index+=r,o+=r}}a||e.push(i)}function Gr(e){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];Wr(t,r.index,r.removed,r.addedCount)}return t}function Kr(e,t){let n=[],r=Gr(t);for(let t=0,i=r.length;t<i;++t){let i=r[t];if(i.addedCount===1&&i.removed.length===1){i.removed[0]!==e[i.index]&&n.push(i);continue}n=n.concat(Hr(e,i.index,i.index+i.addedCount,i.removed,0,i.removed.length))}return n}var qr=!1;function Jr(e,t){let n=e.index,r=t.length;return n>r?n=r-e.addedCount:n<0&&(n=r+e.removed.length+n-e.addedCount),n<0&&(n=0),e.index=n,e}var Yr=class extends Tn{constructor(e){super(e),this.oldCollection=void 0,this.splices=void 0,this.needsQueue=!0,this.call=this.flush,Reflect.defineProperty(e,`$fastController`,{value:this,enumerable:!1})}subscribe(e){this.flush(),super.subscribe(e)}addSplice(e){this.splices===void 0?this.splices=[e]:this.splices.push(e),this.needsQueue&&(this.needsQueue=!1,m.queueUpdate(this))}reset(e){this.oldCollection=e,this.needsQueue&&(this.needsQueue=!1,m.queueUpdate(this))}flush(){let e=this.splices,t=this.oldCollection;if(e===void 0&&t===void 0)return;this.needsQueue=!0,this.splices=void 0,this.oldCollection=void 0;let n=t===void 0?Kr(this.source,e):Hr(this.source,0,this.source.length,t,0,t.length);this.notify(n)}};function Xr(){if(qr)return;qr=!0,h.setArrayObserverFactory(e=>new Yr(e));let e=Array.prototype;if(e.$fastPatch)return;Reflect.defineProperty(e,`$fastPatch`,{value:1,enumerable:!1});let t=e.pop,n=e.push,r=e.reverse,i=e.shift,a=e.sort,o=e.splice,s=e.unshift;e.pop=function(){let e=this.length>0,n=t.apply(this,arguments),r=this.$fastController;return r!==void 0&&e&&r.addSplice(Mr(this.length,[n],0)),n},e.push=function(){let e=n.apply(this,arguments),t=this.$fastController;return t!==void 0&&t.addSplice(Jr(Mr(this.length-arguments.length,[],arguments.length),this)),e},e.reverse=function(){let e,t=this.$fastController;t!==void 0&&(t.flush(),e=this.slice());let n=r.apply(this,arguments);return t!==void 0&&t.reset(e),n},e.shift=function(){let e=this.length>0,t=i.apply(this,arguments),n=this.$fastController;return n!==void 0&&e&&n.addSplice(Mr(0,[t],0)),t},e.sort=function(){let e,t=this.$fastController;t!==void 0&&(t.flush(),e=this.slice());let n=a.apply(this,arguments);return t!==void 0&&t.reset(e),n},e.splice=function(){let e=o.apply(this,arguments),t=this.$fastController;return t!==void 0&&t.addSplice(Jr(Mr(+arguments[0],e,arguments.length>2?arguments.length-2:0),this)),e},e.unshift=function(){let e=s.apply(this,arguments),t=this.$fastController;return t!==void 0&&t.addSplice(Jr(Mr(0,[],arguments.length),this)),e}}var Zr=class{constructor(e,t){this.target=e,this.propertyName=t}bind(e){e[this.propertyName]=this.target}unbind(){}};function x(e){return new Nn(`fast-ref`,Zr,e)}var Qr=e=>typeof e==`function`,$r=()=>null;function ei(e){return e===void 0?$r:Qr(e)?e:()=>e}function S(e,t,n){let r=Qr(e)?e:()=>e,i=ei(t),a=ei(n);return(e,t)=>r(e,t)?i(e,t):a(e,t)}var ti=Object.freeze({positioning:!1,recycle:!0});function ni(e,t,n,r){e.bind(t[n],r)}function ri(e,t,n,r){let i=Object.create(r);i.index=n,i.length=t.length,e.bind(t[n],i)}var ii=class{constructor(e,t,n,r,i,a){this.location=e,this.itemsBinding=t,this.templateBinding=r,this.options=a,this.source=null,this.views=[],this.items=null,this.itemsObserver=null,this.originalContext=void 0,this.childContext=void 0,this.bindView=ni,this.itemsBindingObserver=h.binding(t,this,n),this.templateBindingObserver=h.binding(r,this,i),a.positioning&&(this.bindView=ri)}bind(e,t){this.source=e,this.originalContext=t,this.childContext=Object.create(t),this.childContext.parent=e,this.childContext.parentContext=this.originalContext,this.items=this.itemsBindingObserver.observe(e,this.originalContext),this.template=this.templateBindingObserver.observe(e,this.originalContext),this.observeItems(!0),this.refreshAllViews()}unbind(){this.source=null,this.items=null,this.itemsObserver!==null&&this.itemsObserver.unsubscribe(this),this.unbindAllViews(),this.itemsBindingObserver.disconnect(),this.templateBindingObserver.disconnect()}handleChange(e,t){e===this.itemsBinding?(this.items=this.itemsBindingObserver.observe(this.source,this.originalContext),this.observeItems(),this.refreshAllViews()):e===this.templateBinding?(this.template=this.templateBindingObserver.observe(this.source,this.originalContext),this.refreshAllViews(!0)):this.updateViews(t)}observeItems(e=!1){if(!this.items){this.items=_n;return}let t=this.itemsObserver,n=this.itemsObserver=h.getNotifier(this.items),r=t!==n;r&&t!==null&&t.unsubscribe(this),(r||e)&&n.subscribe(this)}updateViews(e){let t=this.childContext,n=this.views,r=this.bindView,i=this.items,a=this.template,o=this.options.recycle,s=[],c=0,l=0;for(let u=0,d=e.length;u<d;++u){let d=e[u],f=d.removed,ee=0,te=d.index,ne=te+d.addedCount,re=n.splice(d.index,f.length),ie=l=s.length+re.length;for(;te<ne;++te){let e=n[te],u=e?e.firstChild:this.location,d;o&&l>0?(ee<=ie&&re.length>0?(d=re[ee],ee++):(d=s[c],c++),l--):d=a.create(),n.splice(te,0,d),r(d,i,te,t),d.insertBefore(u)}re[ee]&&s.push(...re.slice(ee))}for(let e=c,t=s.length;e<t;++e)s[e].dispose();if(this.options.positioning)for(let e=0,t=n.length;e<t;++e){let r=n[e].context;r.length=t,r.index=e}}refreshAllViews(e=!1){let t=this.items,n=this.childContext,r=this.template,i=this.location,a=this.bindView,o=t.length,s=this.views,c=s.length;if((o===0||e||!this.options.recycle)&&(tr.disposeContiguousBatch(s),c=0),c===0){this.views=s=Array(o);for(let e=0;e<o;++e){let o=r.create();a(o,t,e,n),s[e]=o,o.insertBefore(i)}}else{let e=0;for(;e<o;++e)if(e<c){let r=s[e];a(r,t,e,n)}else{let o=r.create();a(o,t,e,n),s.push(o),o.insertBefore(i)}let l=s.splice(e,c-e);for(e=0,o=l.length;e<o;++e)l[e].dispose()}}unbindAllViews(){let e=this.views;for(let t=0,n=e.length;t<n;++t)e[t].unbind()}},ai=class extends jn{constructor(e,t,n){super(),this.itemsBinding=e,this.templateBinding=t,this.options=n,this.createPlaceholder=m.createBlockPlaceholder,Xr(),this.isItemsBindingVolatile=h.isVolatileBinding(e),this.isTemplateBindingVolatile=h.isVolatileBinding(t)}createBehavior(e){return new ii(e,this.itemsBinding,this.isItemsBindingVolatile,this.templateBinding,this.isTemplateBindingVolatile,this.options)}};function oi(e,t,n=ti){return new ai(e,typeof t==`function`?t:()=>t,Object.assign(Object.assign({},ti),n))}function si(e){return e?function(t,n,r){return t.nodeType===1&&t.matches(e)}:function(e,t,n){return e.nodeType===1}}var ci=class{constructor(e,t){this.target=e,this.options=t,this.source=null}bind(e){let t=this.options.property;this.shouldUpdate=h.getAccessors(e).some(e=>e.name===t),this.source=e,this.updateTarget(this.computeNodes()),this.shouldUpdate&&this.observe()}unbind(){this.updateTarget(_n),this.source=null,this.shouldUpdate&&this.disconnect()}handleEvent(){this.updateTarget(this.computeNodes())}computeNodes(){let e=this.getNodes();return this.options.filter!==void 0&&(e=e.filter(this.options.filter)),e}updateTarget(e){this.source[this.options.property]=e}},li=class extends ci{constructor(e,t){super(e,t)}observe(){this.target.addEventListener(`slotchange`,this)}disconnect(){this.target.removeEventListener(`slotchange`,this)}getNodes(){return this.target.assignedNodes(this.options)}};function C(e){return typeof e==`string`&&(e={property:e}),new Nn(`fast-slotted`,li,e)}var ui=class extends ci{constructor(e,t){super(e,t),this.observer=null,t.childList=!0}observe(){this.observer===null&&(this.observer=new MutationObserver(this.handleEvent.bind(this))),this.observer.observe(this.target,this.options)}disconnect(){this.observer.disconnect()}getNodes(){return`subtree`in this.options?Array.from(this.target.querySelectorAll(this.options.selector)):Array.from(this.target.childNodes)}};function di(e){return typeof e==`string`&&(e={property:e}),new Nn(`fast-children`,ui,e)}var fi=class{handleStartContentChange(){this.startContainer.classList.toggle(`start`,this.start.assignedNodes().length>0)}handleEndContentChange(){this.endContainer.classList.toggle(`end`,this.end.assignedNodes().length>0)}},pi=(e,t)=>_`
    <span
        part="end"
        ${x(`endContainer`)}
        class=${e=>t.end?`end`:void 0}
    >
        <slot name="end" ${x(`end`)} @slotchange="${e=>e.handleEndContentChange()}">
            ${t.end||``}
        </slot>
    </span>
`,mi=(e,t)=>_`
    <span
        part="start"
        ${x(`startContainer`)}
        class="${e=>t.start?`start`:void 0}"
    >
        <slot
            name="start"
            ${x(`start`)}
            @slotchange="${e=>e.handleStartContentChange()}"
        >
            ${t.start||``}
        </slot>
    </span>
`,hi=_`
    <span part="end" ${x(`endContainer`)}>
        <slot
            name="end"
            ${x(`end`)}
            @slotchange="${e=>e.handleEndContentChange()}"
        ></slot>
    </span>
`,gi=_`
    <span part="start" ${x(`startContainer`)}>
        <slot
            name="start"
            ${x(`start`)}
            @slotchange="${e=>e.handleStartContentChange()}"
        ></slot>
    </span>
`,_i=(e,t)=>_`
    <template class="${e=>e.expanded?`expanded`:``}">
        <div
            class="heading"
            part="heading"
            role="heading"
            aria-level="${e=>e.headinglevel}"
        >
            <button
                class="button"
                part="button"
                ${x(`expandbutton`)}
                aria-expanded="${e=>e.expanded}"
                aria-controls="${e=>e.id}-panel"
                id="${e=>e.id}"
                @click="${(e,t)=>e.clickHandler(t.event)}"
            >
                <span class="heading-content" part="heading-content">
                    <slot name="heading"></slot>
                </span>
            </button>
            ${mi(e,t)}
            ${pi(e,t)}
            <span class="icon" part="icon" aria-hidden="true">
                <slot name="expanded-icon" part="expanded-icon">
                    ${t.expandedIcon||``}
                </slot>
                <slot name="collapsed-icon" part="collapsed-icon">
                    ${t.collapsedIcon||``}
                </slot>
            <span>
        </div>
        <div
            class="region"
            part="region"
            id="${e=>e.id}-panel"
            role="region"
            aria-labelledby="${e=>e.id}"
        >
            <slot></slot>
        </div>
    </template>
`;function w(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}var vi=new Map;`metadata`in Reflect||(Reflect.metadata=function(e,t){return function(n){Reflect.defineMetadata(e,t,n)}},Reflect.defineMetadata=function(e,t,n){let r=vi.get(n);r===void 0&&vi.set(n,r=new Map),r.set(e,t)},Reflect.getOwnMetadata=function(e,t){let n=vi.get(t);if(n!==void 0)return n.get(e)});var yi=class{constructor(e,t){this.container=e,this.key=t}instance(e){return this.registerResolver(0,e)}singleton(e){return this.registerResolver(1,e)}transient(e){return this.registerResolver(2,e)}callback(e){return this.registerResolver(3,e)}cachedCallback(e){return this.registerResolver(3,Ui(e))}aliasTo(e){return this.registerResolver(5,e)}registerResolver(e,t){let{container:n,key:r}=this;return this.container=this.key=void 0,n.registerResolver(r,new ki(r,e,t))}};function bi(e){let t=e.slice(),n=Object.keys(e),r=n.length,i;for(let a=0;a<r;++a)i=n[a],Zi(i)||(t[i]=e[i]);return t}var xi=Object.freeze({none(e){throw Error(`${e.toString()} not registered, did you forget to add @singleton()?`)},singleton(e){return new ki(e,1,e)},transient(e){return new ki(e,2,e)}}),Si=Object.freeze({default:Object.freeze({parentLocator:()=>null,responsibleForOwnerRequests:!1,defaultResolver:xi.singleton})}),Ci=new Map;function wi(e){return t=>Reflect.getOwnMetadata(e,t)}var Ti=null,T=Object.freeze({createContainer(e){return new Vi(null,Object.assign({},Si.default,e))},findResponsibleContainer(e){let t=e.$$container$$;return t&&t.responsibleForOwnerRequests?t:T.findParentContainer(e)},findParentContainer(e){let t=new CustomEvent(zi,{bubbles:!0,composed:!0,cancelable:!0,detail:{container:void 0}});return e.dispatchEvent(t),t.detail.container||T.getOrCreateDOMContainer()},getOrCreateDOMContainer(e,t){return e?e.$$container$$||new Vi(e,Object.assign({},Si.default,t,{parentLocator:T.findParentContainer})):Ti||=new Vi(null,Object.assign({},Si.default,t,{parentLocator:()=>null}))},getDesignParamtypes:wi(`design:paramtypes`),getAnnotationParamtypes:wi(`di:paramtypes`),getOrCreateAnnotationParamTypes(e){let t=this.getAnnotationParamtypes(e);return t===void 0&&Reflect.defineMetadata(`di:paramtypes`,t=[],e),t},getDependencies(e){let t=Ci.get(e);if(t===void 0){let n=e.inject;if(n===void 0){let n=T.getDesignParamtypes(e),r=T.getAnnotationParamtypes(e);if(n===void 0)if(r===void 0){let n=Object.getPrototypeOf(e);t=typeof n==`function`&&n!==Function.prototype?bi(T.getDependencies(n)):[]}else t=bi(r);else if(r===void 0)t=bi(n);else{t=bi(n);let e=r.length,i;for(let n=0;n<e;++n)i=r[n],i!==void 0&&(t[n]=i);let a=Object.keys(r);e=a.length;let o;for(let n=0;n<e;++n)o=a[n],Zi(o)||(t[o]=r[o])}}else t=bi(n);Ci.set(e,t)}return t},defineProperty(e,t,n,r=!1){let i=`$di_${t}`;Reflect.defineProperty(e,t,{get:function(){let e=this[i];if(e===void 0&&(e=(this instanceof HTMLElement?T.findResponsibleContainer(this):T.getOrCreateDOMContainer()).get(n),this[i]=e,r&&this instanceof Dr)){let r=this.$fastController;r.subscribe({handleChange:()=>{T.findResponsibleContainer(this).get(n)!==this[i]&&(this[i]=e,r.notify(t))}},`isConnected`)}return e}})},createInterface(e,t){let n=typeof e==`function`?e:t,r=typeof e==`string`?e:e&&`friendlyName`in e&&e.friendlyName||qi,i=typeof e==`string`?!1:e&&`respectConnection`in e&&e.respectConnection||!1,a=function(e,t,n){if(e==null||new.target!==void 0)throw Error(`No registration for interface: '${a.friendlyName}'`);if(t)T.defineProperty(e,t,a,i);else{let t=T.getOrCreateAnnotationParamTypes(e);t[n]=a}};return a.$isInterface=!0,a.friendlyName=r??`(anonymous)`,n!=null&&(a.register=function(e,t){return n(new yi(e,t??a))}),a.toString=function(){return`InterfaceSymbol<${a.friendlyName}>`},a},inject(...e){return function(t,n,r){if(typeof r==`number`){let n=T.getOrCreateAnnotationParamTypes(t),i=e[0];i!==void 0&&(n[r]=i)}else if(n)T.defineProperty(t,n,e[0]);else{let n=r?T.getOrCreateAnnotationParamTypes(r.value):T.getOrCreateAnnotationParamTypes(t),i;for(let t=0;t<e.length;++t)i=e[t],i!==void 0&&(n[t]=i)}}},transient(e){return e.register=function(t){return Wi.transient(e,e).register(t)},e.registerInRequestor=!1,e},singleton(e,t=Di){return e.register=function(t){return Wi.singleton(e,e).register(t)},e.registerInRequestor=t.scoped,e}}),Ei=T.createInterface(`Container`);T.inject;var Di={scoped:!1};function Oi(e,t,n){T.inject(Oi)(e,t,n)}Oi.$isResolver=!0,Oi.resolve=()=>void 0;var ki=class{constructor(e,t,n){this.key=e,this.strategy=t,this.state=n,this.resolving=!1}get $isResolver(){return!0}register(e){return e.registerResolver(this.key,this)}resolve(e,t){switch(this.strategy){case 0:return this.state;case 1:if(this.resolving)throw Error(`Cyclic dependency found: ${this.state.name}`);return this.resolving=!0,this.state=e.getFactory(this.state).construct(t),this.strategy=0,this.resolving=!1,this.state;case 2:{let n=e.getFactory(this.state);if(n===null)throw Error(`Resolver for ${String(this.key)} returned a null factory`);return n.construct(t)}case 3:return this.state(e,t,this);case 4:return this.state[0].resolve(e,t);case 5:return t.get(this.state);default:throw Error(`Invalid resolver strategy specified: ${this.strategy}.`)}}getFactory(e){var t;switch(this.strategy){case 1:case 2:return e.getFactory(this.state);case 5:return((t=e.getResolver(this.state))?.getFactory)?.call(t,e)??null;default:return null}}};function Ai(e){return this.get(e)}function ji(e,t){return t(e)}var Mi=class{constructor(e,t){this.Type=e,this.dependencies=t,this.transformers=null}construct(e,t){let n;return n=t===void 0?new this.Type(...this.dependencies.map(Ai,e)):new this.Type(...this.dependencies.map(Ai,e),...t),this.transformers==null?n:this.transformers.reduce(ji,n)}registerTransformer(e){(this.transformers||=[]).push(e)}},Ni={$isResolver:!0,resolve(e,t){return t}};function Pi(e){return typeof e.register==`function`}function Fi(e){return Pi(e)&&typeof e.registerInRequestor==`boolean`}function Ii(e){return Fi(e)&&e.registerInRequestor}function Li(e){return e.prototype!==void 0}var Ri=new Set(`Array.ArrayBuffer.Boolean.DataView.Date.Error.EvalError.Float32Array.Float64Array.Function.Int8Array.Int16Array.Int32Array.Map.Number.Object.Promise.RangeError.ReferenceError.RegExp.Set.SharedArrayBuffer.String.SyntaxError.TypeError.Uint8Array.Uint8ClampedArray.Uint16Array.Uint32Array.URIError.WeakMap.WeakSet`.split(`.`)),zi=`__DI_LOCATE_PARENT__`,Bi=new Map,Vi=class e{constructor(e,t){this.owner=e,this.config=t,this._parent=void 0,this.registerDepth=0,this.context=null,e!==null&&(e.$$container$$=this),this.resolvers=new Map,this.resolvers.set(Ei,Ni),e instanceof Node&&e.addEventListener(zi,e=>{e.composedPath()[0]!==this.owner&&(e.detail.container=this,e.stopImmediatePropagation())})}get parent(){return this._parent===void 0&&(this._parent=this.config.parentLocator(this.owner)),this._parent}get depth(){return this.parent===null?0:this.parent.depth+1}get responsibleForOwnerRequests(){return this.config.responsibleForOwnerRequests}registerWithContext(e,...t){return this.context=e,this.register(...t),this.context=null,this}register(...e){if(++this.registerDepth===100)throw Error(`Unable to autoregister dependency`);let t,n,r,i,a,o=this.context;for(let s=0,c=e.length;s<c;++s)if(t=e[s],Ji(t))if(Pi(t))t.register(this,o);else if(Li(t))Wi.singleton(t,t).register(this);else for(n=Object.keys(t),i=0,a=n.length;i<a;++i)r=t[n[i]],Ji(r)&&(Pi(r)?r.register(this,o):this.register(r));return--this.registerDepth,this}registerResolver(e,t){Gi(e);let n=this.resolvers,r=n.get(e);return r==null?n.set(e,t):r instanceof ki&&r.strategy===4?r.state.push(t):n.set(e,new ki(e,4,[r,t])),t}registerTransformer(e,t){let n=this.getResolver(e);if(n==null)return!1;if(n.getFactory){let e=n.getFactory(this);return e==null?!1:(e.registerTransformer(t),!0)}return!1}getResolver(e,t=!0){if(Gi(e),e.resolve!==void 0)return e;let n=this,r;for(;n!=null;)if(r=n.resolvers.get(e),r==null){if(n.parent==null){let r=Ii(e)?this:n;return t?this.jitRegister(e,r):null}n=n.parent}else return r;return null}has(e,t=!1){return this.resolvers.has(e)?!0:t&&this.parent!=null?this.parent.has(e,!0):!1}get(e){if(Gi(e),e.$isResolver)return e.resolve(this,this);let t=this,n;for(;t!=null;)if(n=t.resolvers.get(e),n==null){if(t.parent==null){let r=Ii(e)?this:t;return n=this.jitRegister(e,r),n.resolve(t,this)}t=t.parent}else return n.resolve(t,this);throw Error(`Unable to resolve key: ${String(e)}`)}getAll(e,t=!1){Gi(e);let n=this,r=n,i;if(t){let t=_n;for(;r!=null;)i=r.resolvers.get(e),i!=null&&(t=t.concat(Ki(i,r,n))),r=r.parent;return t}else for(;r!=null;)if(i=r.resolvers.get(e),i==null){if(r=r.parent,r==null)return _n}else return Ki(i,r,n);return _n}getFactory(e){let t=Bi.get(e);if(t===void 0){if(Yi(e))throw Error(`${e.name} is a native function and therefore cannot be safely constructed by DI. If this is intentional, please use a callback or cachedCallback resolver.`);Bi.set(e,t=new Mi(e,T.getDependencies(e)))}return t}registerFactory(e,t){Bi.set(e,t)}createChild(t){return new e(null,Object.assign({},this.config,t,{parentLocator:()=>this}))}jitRegister(e,t){if(typeof e!=`function`)throw Error(`Attempted to jitRegister something that is not a constructor: '${e}'. Did you forget to register this dependency?`);if(Ri.has(e.name))throw Error(`Attempted to jitRegister an intrinsic type: ${e.name}. Did you forget to add @inject(Key)`);if(Pi(e)){let n=e.register(t);if(!(n instanceof Object)||n.resolve==null){let n=t.resolvers.get(e);if(n!=null)return n;throw Error(`A valid resolver was not returned from the static register method`)}return n}else if(e.$isInterface)throw Error(`Attempted to jitRegister an interface: ${e.friendlyName}`);else{let n=this.config.defaultResolver(e,t);return t.resolvers.set(e,n),n}}},Hi=new WeakMap;function Ui(e){return function(t,n,r){if(Hi.has(r))return Hi.get(r);let i=e(t,n,r);return Hi.set(r,i),i}}var Wi=Object.freeze({instance(e,t){return new ki(e,0,t)},singleton(e,t){return new ki(e,1,t)},transient(e,t){return new ki(e,2,t)},callback(e,t){return new ki(e,3,t)},cachedCallback(e,t){return new ki(e,3,Ui(t))},aliasTo(e,t){return new ki(t,5,e)}});function Gi(e){if(e==null)throw Error(`key/value cannot be null or undefined. Are you trying to inject/register something that doesn't exist with DI?`)}function Ki(e,t,n){if(e instanceof ki&&e.strategy===4){let r=e.state,i=r.length,a=Array(i);for(;i--;)a[i]=r[i].resolve(t,n);return a}return[e.resolve(t,n)]}var qi=`(anonymous)`;function Ji(e){return typeof e==`object`&&!!e||typeof e==`function`}var Yi=(function(){let e=new WeakMap,t=!1,n=``,r=0;return function(i){return t=e.get(i),t===void 0&&(n=i.toString(),r=n.length,t=r>=29&&r<=100&&n.charCodeAt(r-1)===125&&n.charCodeAt(r-2)<=32&&n.charCodeAt(r-3)===93&&n.charCodeAt(r-4)===101&&n.charCodeAt(r-5)===100&&n.charCodeAt(r-6)===111&&n.charCodeAt(r-7)===99&&n.charCodeAt(r-8)===32&&n.charCodeAt(r-9)===101&&n.charCodeAt(r-10)===118&&n.charCodeAt(r-11)===105&&n.charCodeAt(r-12)===116&&n.charCodeAt(r-13)===97&&n.charCodeAt(r-14)===110&&n.charCodeAt(r-15)===88,e.set(i,t)),t}})(),Xi={};function Zi(e){switch(typeof e){case`number`:return e>=0&&(e|0)===e;case`string`:{let t=Xi[e];if(t!==void 0)return t;let n=e.length;if(n===0)return Xi[e]=!1;let r=0;for(let t=0;t<n;++t)if(r=e.charCodeAt(t),t===0&&r===48&&n>1||r<48||r>57)return Xi[e]=!1;return Xi[e]=!0}default:return!1}}function Qi(e){return`${e.toLowerCase()}:presentation`}var $i=new Map,ea=Object.freeze({define(e,t,n){let r=Qi(e);$i.get(r)===void 0?$i.set(r,t):$i.set(r,!1),n.register(Wi.instance(r,t))},forTag(e,t){let n=Qi(e),r=$i.get(n);return r===!1?T.findResponsibleContainer(t).get(n):r||null}}),ta=class{constructor(e,t){this.template=e||null,this.styles=t===void 0?null:Array.isArray(t)?ir.create(t):t instanceof ir?t:ir.create([t])}applyTo(e){let t=e.$fastController;t.template===null&&(t.template=this.template),t.styles===null&&(t.styles=this.styles)}},E=class e extends Dr{constructor(){super(...arguments),this._presentation=void 0}get $presentation(){return this._presentation===void 0&&(this._presentation=ea.forTag(this.tagName,this)),this._presentation}templateChanged(){this.template!==void 0&&(this.$fastController.template=this.template)}stylesChanged(){this.styles!==void 0&&(this.$fastController.styles=this.styles)}connectedCallback(){this.$presentation!==null&&this.$presentation.applyTo(this),super.connectedCallback()}static compose(t){return(n={})=>new ra(this===e?class extends e{}:this,t,n)}};w([g],E.prototype,`template`,void 0),w([g],E.prototype,`styles`,void 0);function na(e,t,n){return typeof e==`function`?e(t,n):e}var ra=class{constructor(e,t,n){this.type=e,this.elementDefinition=t,this.overrideDefinition=n,this.definition=Object.assign(Object.assign({},this.elementDefinition),this.overrideDefinition)}register(e,t){let n=this.definition,r=this.overrideDefinition,i=`${n.prefix||t.elementPrefix}-${n.baseName}`;t.tryDefineElement({name:i,type:this.type,baseClass:this.elementDefinition.baseClass,callback:e=>{let t=new ta(na(n.template,e,n),na(n.styles,e,n));e.definePresentation(t);let i=na(n.shadowOptions,e,n);e.shadowRootMode&&(i?r.shadowOptions||(i.mode=e.shadowRootMode):i!==null&&(i={mode:e.shadowRootMode})),e.defineElement({elementOptions:na(n.elementOptions,e,n),shadowOptions:i,attributes:na(n.attributes,e,n)})}})}};function D(e,...t){let n=hr.locate(e);t.forEach(t=>{Object.getOwnPropertyNames(t.prototype).forEach(n=>{n!==`constructor`&&Object.defineProperty(e.prototype,n,Object.getOwnPropertyDescriptor(t.prototype,n))}),hr.locate(t).forEach(e=>n.push(e))})}var ia=class extends E{constructor(){super(...arguments),this.headinglevel=2,this.expanded=!1,this.clickHandler=e=>{this.expanded=!this.expanded,this.change()},this.change=()=>{this.$emit(`change`)}}};w([y({attribute:`heading-level`,mode:`fromView`,converter:v})],ia.prototype,`headinglevel`,void 0),w([y({mode:`boolean`})],ia.prototype,`expanded`,void 0),w([y],ia.prototype,`id`,void 0),D(ia,fi);var aa=(e,t)=>_`
    <template>
        <slot ${C({property:`accordionItems`,filter:si()})}></slot>
        <slot name="item" part="item" ${C(`accordionItems`)}></slot>
    </template>
`,O={horizontal:`horizontal`,vertical:`vertical`};function oa(e,t){let n=e.length;for(;n--;)if(t(e[n],n,e))return n;return-1}function sa(){return!!(typeof window<`u`&&window.document&&window.document.createElement)}function ca(...e){return e.every(e=>e instanceof HTMLElement)}function la(e,t){if(!(!e||!t||!ca(e)))return Array.from(e.querySelectorAll(t)).filter(e=>e.offsetParent!==null)}function ua(){let e=document.querySelector(`meta[property="csp-nonce"]`);return e?e.getAttribute(`content`):null}var da;function fa(){if(typeof da==`boolean`)return da;if(!sa())return da=!1,da;let e=document.createElement(`style`),t=ua();t!==null&&e.setAttribute(`nonce`,t),document.head.appendChild(e);try{e.sheet.insertRule(`foo:focus-visible {color:inherit}`,0),da=!0}catch{da=!1}finally{document.head.removeChild(e)}return da}var pa=`focus`,ma=`focusin`,ha=`focusout`,ga=`keydown`,_a=`resize`,va=`scroll`,ya;(function(e){e[e.alt=18]=`alt`,e[e.arrowDown=40]=`arrowDown`,e[e.arrowLeft=37]=`arrowLeft`,e[e.arrowRight=39]=`arrowRight`,e[e.arrowUp=38]=`arrowUp`,e[e.back=8]=`back`,e[e.backSlash=220]=`backSlash`,e[e.break=19]=`break`,e[e.capsLock=20]=`capsLock`,e[e.closeBracket=221]=`closeBracket`,e[e.colon=186]=`colon`,e[e.colon2=59]=`colon2`,e[e.comma=188]=`comma`,e[e.ctrl=17]=`ctrl`,e[e.delete=46]=`delete`,e[e.end=35]=`end`,e[e.enter=13]=`enter`,e[e.equals=187]=`equals`,e[e.equals2=61]=`equals2`,e[e.equals3=107]=`equals3`,e[e.escape=27]=`escape`,e[e.forwardSlash=191]=`forwardSlash`,e[e.function1=112]=`function1`,e[e.function10=121]=`function10`,e[e.function11=122]=`function11`,e[e.function12=123]=`function12`,e[e.function2=113]=`function2`,e[e.function3=114]=`function3`,e[e.function4=115]=`function4`,e[e.function5=116]=`function5`,e[e.function6=117]=`function6`,e[e.function7=118]=`function7`,e[e.function8=119]=`function8`,e[e.function9=120]=`function9`,e[e.home=36]=`home`,e[e.insert=45]=`insert`,e[e.menu=93]=`menu`,e[e.minus=189]=`minus`,e[e.minus2=109]=`minus2`,e[e.numLock=144]=`numLock`,e[e.numPad0=96]=`numPad0`,e[e.numPad1=97]=`numPad1`,e[e.numPad2=98]=`numPad2`,e[e.numPad3=99]=`numPad3`,e[e.numPad4=100]=`numPad4`,e[e.numPad5=101]=`numPad5`,e[e.numPad6=102]=`numPad6`,e[e.numPad7=103]=`numPad7`,e[e.numPad8=104]=`numPad8`,e[e.numPad9=105]=`numPad9`,e[e.numPadDivide=111]=`numPadDivide`,e[e.numPadDot=110]=`numPadDot`,e[e.numPadMinus=109]=`numPadMinus`,e[e.numPadMultiply=106]=`numPadMultiply`,e[e.numPadPlus=107]=`numPadPlus`,e[e.openBracket=219]=`openBracket`,e[e.pageDown=34]=`pageDown`,e[e.pageUp=33]=`pageUp`,e[e.period=190]=`period`,e[e.print=44]=`print`,e[e.quote=222]=`quote`,e[e.scrollLock=145]=`scrollLock`,e[e.shift=16]=`shift`,e[e.space=32]=`space`,e[e.tab=9]=`tab`,e[e.tilde=192]=`tilde`,e[e.windowsLeft=91]=`windowsLeft`,e[e.windowsOpera=219]=`windowsOpera`,e[e.windowsRight=92]=`windowsRight`})(ya||={});var ba=`ArrowDown`,xa=`ArrowLeft`,Sa=`ArrowRight`,Ca=`ArrowUp`,wa=`Enter`,Ta=`Escape`,Ea=`Home`,Da=`PageDown`,Oa=`PageUp`,ka={ArrowDown:ba,ArrowLeft:xa,ArrowRight:Sa,ArrowUp:Ca},k;(function(e){e.ltr=`ltr`,e.rtl=`rtl`})(k||={});function Aa(e,t,n){return n<e?t:n>t?e:n}function ja(e,t,n){return Math.min(Math.max(n,e),t)}function Ma(e,t,n=0){return[t,n]=[t,n].sort((e,t)=>e-t),t<=e&&e<n}var Na=0;function Pa(e=``){return`${e}${Na++}`}var A;(function(e){e.Canvas=`Canvas`,e.CanvasText=`CanvasText`,e.LinkText=`LinkText`,e.VisitedText=`VisitedText`,e.ActiveText=`ActiveText`,e.ButtonFace=`ButtonFace`,e.ButtonText=`ButtonText`,e.Field=`Field`,e.FieldText=`FieldText`,e.Highlight=`Highlight`,e.HighlightText=`HighlightText`,e.GrayText=`GrayText`})(A||={});var Fa={single:`single`,multi:`multi`},Ia=class extends E{constructor(){super(...arguments),this.expandmode=Fa.multi,this.activeItemIndex=0,this.change=()=>{this.$emit(`change`,this.activeid)},this.setItems=()=>{this.accordionItems.length!==0&&(this.accordionIds=this.getItemIds(),this.accordionItems.forEach((e,t)=>{e instanceof ia&&(e.addEventListener(`change`,this.activeItemChange),this.isSingleExpandMode()&&(this.activeItemIndex===t?e.expanded=!0:e.expanded=!1));let n=this.accordionIds[t];e.setAttribute(`id`,typeof n==`string`?n:`accordion-${t+1}`),this.activeid=this.accordionIds[this.activeItemIndex],e.addEventListener(`keydown`,this.handleItemKeyDown),e.addEventListener(`focus`,this.handleItemFocus)}),this.isSingleExpandMode()&&(this.findExpandedItem()??this.accordionItems[0]).setAttribute(`aria-disabled`,`true`))},this.removeItemListeners=e=>{e.forEach((e,t)=>{e.removeEventListener(`change`,this.activeItemChange),e.removeEventListener(`keydown`,this.handleItemKeyDown),e.removeEventListener(`focus`,this.handleItemFocus)})},this.activeItemChange=e=>{if(e.defaultPrevented||e.target!==e.currentTarget)return;e.preventDefault();let t=e.target;this.activeid=t.getAttribute(`id`),this.isSingleExpandMode()&&(this.resetItems(),t.expanded=!0,t.setAttribute(`aria-disabled`,`true`),this.accordionItems.forEach(e=>{!e.hasAttribute(`disabled`)&&e.id!==this.activeid&&e.removeAttribute(`aria-disabled`)})),this.activeItemIndex=Array.from(this.accordionItems).indexOf(t),this.change()},this.handleItemKeyDown=e=>{if(e.target===e.currentTarget)switch(this.accordionIds=this.getItemIds(),e.key){case Ca:e.preventDefault(),this.adjust(-1);break;case ba:e.preventDefault(),this.adjust(1);break;case Ea:this.activeItemIndex=0,this.focusItem();break;case`End`:this.activeItemIndex=this.accordionItems.length-1,this.focusItem();break}},this.handleItemFocus=e=>{if(e.target===e.currentTarget){let t=e.target,n=this.activeItemIndex=Array.from(this.accordionItems).indexOf(t);this.activeItemIndex!==n&&n!==-1&&(this.activeItemIndex=n,this.activeid=this.accordionIds[this.activeItemIndex])}}}accordionItemsChanged(e,t){this.$fastController.isConnected&&(this.removeItemListeners(e),this.setItems())}findExpandedItem(){for(let e=0;e<this.accordionItems.length;e++)if(this.accordionItems[e].getAttribute(`expanded`)===`true`)return this.accordionItems[e];return null}resetItems(){this.accordionItems.forEach((e,t)=>{e.expanded=!1})}getItemIds(){return this.accordionItems.map(e=>e.getAttribute(`id`))}isSingleExpandMode(){return this.expandmode===Fa.single}adjust(e){this.activeItemIndex=Aa(0,this.accordionItems.length-1,this.activeItemIndex+e),this.focusItem()}focusItem(){let e=this.accordionItems[this.activeItemIndex];e instanceof ia&&e.expandbutton.focus()}};w([y({attribute:`expand-mode`})],Ia.prototype,`expandmode`,void 0),w([g],Ia.prototype,`accordionItems`,void 0);var La=(e,t)=>_`
    <a
        class="control"
        part="control"
        download="${e=>e.download}"
        href="${e=>e.href}"
        hreflang="${e=>e.hreflang}"
        ping="${e=>e.ping}"
        referrerpolicy="${e=>e.referrerpolicy}"
        rel="${e=>e.rel}"
        target="${e=>e.target}"
        type="${e=>e.type}"
        aria-atomic="${e=>e.ariaAtomic}"
        aria-busy="${e=>e.ariaBusy}"
        aria-controls="${e=>e.ariaControls}"
        aria-current="${e=>e.ariaCurrent}"
        aria-describedby="${e=>e.ariaDescribedby}"
        aria-details="${e=>e.ariaDetails}"
        aria-disabled="${e=>e.ariaDisabled}"
        aria-errormessage="${e=>e.ariaErrormessage}"
        aria-expanded="${e=>e.ariaExpanded}"
        aria-flowto="${e=>e.ariaFlowto}"
        aria-haspopup="${e=>e.ariaHaspopup}"
        aria-hidden="${e=>e.ariaHidden}"
        aria-invalid="${e=>e.ariaInvalid}"
        aria-keyshortcuts="${e=>e.ariaKeyshortcuts}"
        aria-label="${e=>e.ariaLabel}"
        aria-labelledby="${e=>e.ariaLabelledby}"
        aria-live="${e=>e.ariaLive}"
        aria-owns="${e=>e.ariaOwns}"
        aria-relevant="${e=>e.ariaRelevant}"
        aria-roledescription="${e=>e.ariaRoledescription}"
        ${x(`control`)}
    >
        ${mi(e,t)}
        <span class="content" part="content">
            <slot ${C(`defaultSlottedContent`)}></slot>
        </span>
        ${pi(e,t)}
    </a>
`,j=class{};w([y({attribute:`aria-atomic`})],j.prototype,`ariaAtomic`,void 0),w([y({attribute:`aria-busy`})],j.prototype,`ariaBusy`,void 0),w([y({attribute:`aria-controls`})],j.prototype,`ariaControls`,void 0),w([y({attribute:`aria-current`})],j.prototype,`ariaCurrent`,void 0),w([y({attribute:`aria-describedby`})],j.prototype,`ariaDescribedby`,void 0),w([y({attribute:`aria-details`})],j.prototype,`ariaDetails`,void 0),w([y({attribute:`aria-disabled`})],j.prototype,`ariaDisabled`,void 0),w([y({attribute:`aria-errormessage`})],j.prototype,`ariaErrormessage`,void 0),w([y({attribute:`aria-flowto`})],j.prototype,`ariaFlowto`,void 0),w([y({attribute:`aria-haspopup`})],j.prototype,`ariaHaspopup`,void 0),w([y({attribute:`aria-hidden`})],j.prototype,`ariaHidden`,void 0),w([y({attribute:`aria-invalid`})],j.prototype,`ariaInvalid`,void 0),w([y({attribute:`aria-keyshortcuts`})],j.prototype,`ariaKeyshortcuts`,void 0),w([y({attribute:`aria-label`})],j.prototype,`ariaLabel`,void 0),w([y({attribute:`aria-labelledby`})],j.prototype,`ariaLabelledby`,void 0),w([y({attribute:`aria-live`})],j.prototype,`ariaLive`,void 0),w([y({attribute:`aria-owns`})],j.prototype,`ariaOwns`,void 0),w([y({attribute:`aria-relevant`})],j.prototype,`ariaRelevant`,void 0),w([y({attribute:`aria-roledescription`})],j.prototype,`ariaRoledescription`,void 0);var Ra=class extends E{constructor(){super(...arguments),this.handleUnsupportedDelegatesFocus=()=>{window.ShadowRoot&&!window.ShadowRoot.prototype.hasOwnProperty(`delegatesFocus`)&&this.$fastController.definition.shadowOptions?.delegatesFocus&&(this.focus=()=>{var e;(e=this.control)==null||e.focus()})}}connectedCallback(){super.connectedCallback(),this.handleUnsupportedDelegatesFocus()}};w([y],Ra.prototype,`download`,void 0),w([y],Ra.prototype,`href`,void 0),w([y],Ra.prototype,`hreflang`,void 0),w([y],Ra.prototype,`ping`,void 0),w([y],Ra.prototype,`referrerpolicy`,void 0),w([y],Ra.prototype,`rel`,void 0),w([y],Ra.prototype,`target`,void 0),w([y],Ra.prototype,`type`,void 0),w([g],Ra.prototype,`defaultSlottedContent`,void 0);var za=class{};w([y({attribute:`aria-expanded`})],za.prototype,`ariaExpanded`,void 0),D(za,j),D(Ra,fi,za);var Ba=(e,t)=>_`
    <template class="${e=>e.initialLayoutComplete?`loaded`:``}">
        ${S(e=>e.initialLayoutComplete,_`
                <slot></slot>
            `)}
    </template>
`,Va=e=>{let t=e.closest(`[dir]`);return t!==null&&t.dir===`rtl`?k.rtl:k.ltr},Ha=class{constructor(){this.intersectionDetector=null,this.observedElements=new Map,this.requestPosition=(e,t)=>{var n;if(this.intersectionDetector!==null){if(this.observedElements.has(e)){(n=this.observedElements.get(e))==null||n.push(t);return}this.observedElements.set(e,[t]),this.intersectionDetector.observe(e)}},this.cancelRequestPosition=(e,t)=>{let n=this.observedElements.get(e);if(n!==void 0){let e=n.indexOf(t);e!==-1&&n.splice(e,1)}},this.initializeIntersectionDetector=()=>{mn.IntersectionObserver&&(this.intersectionDetector=new IntersectionObserver(this.handleIntersection,{root:null,rootMargin:`0px`,threshold:[0,1]}))},this.handleIntersection=e=>{if(this.intersectionDetector===null)return;let t=[],n=[];e.forEach(e=>{var r;(r=this.intersectionDetector)==null||r.unobserve(e.target);let i=this.observedElements.get(e.target);i!==void 0&&(i.forEach(r=>{let i=t.indexOf(r);i===-1&&(i=t.length,t.push(r),n.push([])),n[i].push(e)}),this.observedElements.delete(e.target))}),t.forEach((e,t)=>{e(n[t])})},this.initializeIntersectionDetector()}},M=class e extends E{constructor(){super(...arguments),this.anchor=``,this.viewport=``,this.horizontalPositioningMode=`uncontrolled`,this.horizontalDefaultPosition=`unset`,this.horizontalViewportLock=!1,this.horizontalInset=!1,this.horizontalScaling=`content`,this.verticalPositioningMode=`uncontrolled`,this.verticalDefaultPosition=`unset`,this.verticalViewportLock=!1,this.verticalInset=!1,this.verticalScaling=`content`,this.fixedPlacement=!1,this.autoUpdateMode=`anchor`,this.anchorElement=null,this.viewportElement=null,this.initialLayoutComplete=!1,this.resizeDetector=null,this.baseHorizontalOffset=0,this.baseVerticalOffset=0,this.pendingPositioningUpdate=!1,this.pendingReset=!1,this.currentDirection=k.ltr,this.regionVisible=!1,this.forceUpdate=!1,this.updateThreshold=.5,this.update=()=>{this.pendingPositioningUpdate||this.requestPositionUpdates()},this.startObservers=()=>{this.stopObservers(),this.anchorElement!==null&&(this.requestPositionUpdates(),this.resizeDetector!==null&&(this.resizeDetector.observe(this.anchorElement),this.resizeDetector.observe(this)))},this.requestPositionUpdates=()=>{this.anchorElement===null||this.pendingPositioningUpdate||(e.intersectionService.requestPosition(this,this.handleIntersection),e.intersectionService.requestPosition(this.anchorElement,this.handleIntersection),this.viewportElement!==null&&e.intersectionService.requestPosition(this.viewportElement,this.handleIntersection),this.pendingPositioningUpdate=!0)},this.stopObservers=()=>{this.pendingPositioningUpdate&&(this.pendingPositioningUpdate=!1,e.intersectionService.cancelRequestPosition(this,this.handleIntersection),this.anchorElement!==null&&e.intersectionService.cancelRequestPosition(this.anchorElement,this.handleIntersection),this.viewportElement!==null&&e.intersectionService.cancelRequestPosition(this.viewportElement,this.handleIntersection)),this.resizeDetector!==null&&this.resizeDetector.disconnect()},this.getViewport=()=>typeof this.viewport!=`string`||this.viewport===``?document.documentElement:document.getElementById(this.viewport),this.getAnchor=()=>document.getElementById(this.anchor),this.handleIntersection=e=>{this.pendingPositioningUpdate&&(this.pendingPositioningUpdate=!1,this.applyIntersectionEntries(e)&&this.updateLayout())},this.applyIntersectionEntries=e=>{let t=e.find(e=>e.target===this),n=e.find(e=>e.target===this.anchorElement),r=e.find(e=>e.target===this.viewportElement);return t===void 0||r===void 0||n===void 0?!1:!this.regionVisible||this.forceUpdate||this.regionRect===void 0||this.anchorRect===void 0||this.viewportRect===void 0||this.isRectDifferent(this.anchorRect,n.boundingClientRect)||this.isRectDifferent(this.viewportRect,r.boundingClientRect)||this.isRectDifferent(this.regionRect,t.boundingClientRect)?(this.regionRect=t.boundingClientRect,this.anchorRect=n.boundingClientRect,this.viewportElement===document.documentElement?this.viewportRect=new DOMRectReadOnly(r.boundingClientRect.x+document.documentElement.scrollLeft,r.boundingClientRect.y+document.documentElement.scrollTop,r.boundingClientRect.width,r.boundingClientRect.height):this.viewportRect=r.boundingClientRect,this.updateRegionOffset(),this.forceUpdate=!1,!0):!1},this.updateRegionOffset=()=>{this.anchorRect&&this.regionRect&&(this.baseHorizontalOffset=this.baseHorizontalOffset+(this.anchorRect.left-this.regionRect.left)+(this.translateX-this.baseHorizontalOffset),this.baseVerticalOffset=this.baseVerticalOffset+(this.anchorRect.top-this.regionRect.top)+(this.translateY-this.baseVerticalOffset))},this.isRectDifferent=(e,t)=>Math.abs(e.top-t.top)>this.updateThreshold||Math.abs(e.right-t.right)>this.updateThreshold||Math.abs(e.bottom-t.bottom)>this.updateThreshold||Math.abs(e.left-t.left)>this.updateThreshold,this.handleResize=e=>{this.update()},this.reset=()=>{this.pendingReset&&(this.pendingReset=!1,this.anchorElement===null&&(this.anchorElement=this.getAnchor()),this.viewportElement===null&&(this.viewportElement=this.getViewport()),this.currentDirection=Va(this),this.startObservers())},this.updateLayout=()=>{let e,t;if(this.horizontalPositioningMode!==`uncontrolled`){let e=this.getPositioningOptions(this.horizontalInset);if(this.horizontalDefaultPosition===`center`)t=`center`;else if(this.horizontalDefaultPosition!==`unset`){let e=this.horizontalDefaultPosition;if(e===`start`||e===`end`){let t=Va(this);if(t!==this.currentDirection){this.currentDirection=t,this.initialize();return}e=this.currentDirection===k.ltr?e===`start`?`left`:`right`:e===`start`?`right`:`left`}switch(e){case`left`:t=this.horizontalInset?`insetStart`:`start`;break;case`right`:t=this.horizontalInset?`insetEnd`:`end`;break}}let n=this.horizontalThreshold===void 0?this.regionRect===void 0?0:this.regionRect.width:this.horizontalThreshold,r=this.anchorRect===void 0?0:this.anchorRect.left,i=this.anchorRect===void 0?0:this.anchorRect.right,a=this.anchorRect===void 0?0:this.anchorRect.width,o=this.viewportRect===void 0?0:this.viewportRect.left,s=this.viewportRect===void 0?0:this.viewportRect.right;(t===void 0||this.horizontalPositioningMode!==`locktodefault`&&this.getAvailableSpace(t,r,i,a,o,s)<n)&&(t=this.getAvailableSpace(e[0],r,i,a,o,s)>this.getAvailableSpace(e[1],r,i,a,o,s)?e[0]:e[1])}if(this.verticalPositioningMode!==`uncontrolled`){let t=this.getPositioningOptions(this.verticalInset);if(this.verticalDefaultPosition===`center`)e=`center`;else if(this.verticalDefaultPosition!==`unset`)switch(this.verticalDefaultPosition){case`top`:e=this.verticalInset?`insetStart`:`start`;break;case`bottom`:e=this.verticalInset?`insetEnd`:`end`;break}let n=this.verticalThreshold===void 0?this.regionRect===void 0?0:this.regionRect.height:this.verticalThreshold,r=this.anchorRect===void 0?0:this.anchorRect.top,i=this.anchorRect===void 0?0:this.anchorRect.bottom,a=this.anchorRect===void 0?0:this.anchorRect.height,o=this.viewportRect===void 0?0:this.viewportRect.top,s=this.viewportRect===void 0?0:this.viewportRect.bottom;(e===void 0||this.verticalPositioningMode!==`locktodefault`&&this.getAvailableSpace(e,r,i,a,o,s)<n)&&(e=this.getAvailableSpace(t[0],r,i,a,o,s)>this.getAvailableSpace(t[1],r,i,a,o,s)?t[0]:t[1])}let n=this.getNextRegionDimension(t,e),r=this.horizontalPosition!==t||this.verticalPosition!==e;if(this.setHorizontalPosition(t,n),this.setVerticalPosition(e,n),this.updateRegionStyle(),!this.initialLayoutComplete){this.initialLayoutComplete=!0,this.requestPositionUpdates();return}this.regionVisible||(this.regionVisible=!0,this.style.removeProperty(`pointer-events`),this.style.removeProperty(`opacity`),this.classList.toggle(`loaded`,!0),this.$emit(`loaded`,this,{bubbles:!1})),this.updatePositionClasses(),r&&this.$emit(`positionchange`,this,{bubbles:!1})},this.updateRegionStyle=()=>{this.style.width=this.regionWidth,this.style.height=this.regionHeight,this.style.transform=`translate(${this.translateX}px, ${this.translateY}px)`},this.updatePositionClasses=()=>{this.classList.toggle(`top`,this.verticalPosition===`start`),this.classList.toggle(`bottom`,this.verticalPosition===`end`),this.classList.toggle(`inset-top`,this.verticalPosition===`insetStart`),this.classList.toggle(`inset-bottom`,this.verticalPosition===`insetEnd`),this.classList.toggle(`vertical-center`,this.verticalPosition===`center`),this.classList.toggle(`left`,this.horizontalPosition===`start`),this.classList.toggle(`right`,this.horizontalPosition===`end`),this.classList.toggle(`inset-left`,this.horizontalPosition===`insetStart`),this.classList.toggle(`inset-right`,this.horizontalPosition===`insetEnd`),this.classList.toggle(`horizontal-center`,this.horizontalPosition===`center`)},this.setHorizontalPosition=(e,t)=>{if(e===void 0||this.regionRect===void 0||this.anchorRect===void 0||this.viewportRect===void 0)return;let n=0;switch(this.horizontalScaling){case`anchor`:case`fill`:n=this.horizontalViewportLock?this.viewportRect.width:t.width,this.regionWidth=`${n}px`;break;case`content`:n=this.regionRect.width,this.regionWidth=`unset`;break}let r=0;switch(e){case`start`:this.translateX=this.baseHorizontalOffset-n,this.horizontalViewportLock&&this.anchorRect.left>this.viewportRect.right&&(this.translateX-=this.anchorRect.left-this.viewportRect.right);break;case`insetStart`:this.translateX=this.baseHorizontalOffset-n+this.anchorRect.width,this.horizontalViewportLock&&this.anchorRect.right>this.viewportRect.right&&(this.translateX-=this.anchorRect.right-this.viewportRect.right);break;case`insetEnd`:this.translateX=this.baseHorizontalOffset,this.horizontalViewportLock&&this.anchorRect.left<this.viewportRect.left&&(this.translateX-=this.anchorRect.left-this.viewportRect.left);break;case`end`:this.translateX=this.baseHorizontalOffset+this.anchorRect.width,this.horizontalViewportLock&&this.anchorRect.right<this.viewportRect.left&&(this.translateX-=this.anchorRect.right-this.viewportRect.left);break;case`center`:if(r=(this.anchorRect.width-n)/2,this.translateX=this.baseHorizontalOffset+r,this.horizontalViewportLock){let e=this.anchorRect.left+r,t=this.anchorRect.right-r;e<this.viewportRect.left&&!(t>this.viewportRect.right)?this.translateX-=e-this.viewportRect.left:t>this.viewportRect.right&&!(e<this.viewportRect.left)&&(this.translateX-=t-this.viewportRect.right)}break}this.horizontalPosition=e},this.setVerticalPosition=(e,t)=>{if(e===void 0||this.regionRect===void 0||this.anchorRect===void 0||this.viewportRect===void 0)return;let n=0;switch(this.verticalScaling){case`anchor`:case`fill`:n=this.verticalViewportLock?this.viewportRect.height:t.height,this.regionHeight=`${n}px`;break;case`content`:n=this.regionRect.height,this.regionHeight=`unset`;break}let r=0;switch(e){case`start`:this.translateY=this.baseVerticalOffset-n,this.verticalViewportLock&&this.anchorRect.top>this.viewportRect.bottom&&(this.translateY-=this.anchorRect.top-this.viewportRect.bottom);break;case`insetStart`:this.translateY=this.baseVerticalOffset-n+this.anchorRect.height,this.verticalViewportLock&&this.anchorRect.bottom>this.viewportRect.bottom&&(this.translateY-=this.anchorRect.bottom-this.viewportRect.bottom);break;case`insetEnd`:this.translateY=this.baseVerticalOffset,this.verticalViewportLock&&this.anchorRect.top<this.viewportRect.top&&(this.translateY-=this.anchorRect.top-this.viewportRect.top);break;case`end`:this.translateY=this.baseVerticalOffset+this.anchorRect.height,this.verticalViewportLock&&this.anchorRect.bottom<this.viewportRect.top&&(this.translateY-=this.anchorRect.bottom-this.viewportRect.top);break;case`center`:if(r=(this.anchorRect.height-n)/2,this.translateY=this.baseVerticalOffset+r,this.verticalViewportLock){let e=this.anchorRect.top+r,t=this.anchorRect.bottom-r;e<this.viewportRect.top&&!(t>this.viewportRect.bottom)?this.translateY-=e-this.viewportRect.top:t>this.viewportRect.bottom&&!(e<this.viewportRect.top)&&(this.translateY-=t-this.viewportRect.bottom)}}this.verticalPosition=e},this.getPositioningOptions=e=>e?[`insetStart`,`insetEnd`]:[`start`,`end`],this.getAvailableSpace=(e,t,n,r,i,a)=>{let o=t-i,s=a-(t+r);switch(e){case`start`:return o;case`insetStart`:return o+r;case`insetEnd`:return s+r;case`end`:return s;case`center`:return Math.min(o,s)*2+r}},this.getNextRegionDimension=(e,t)=>{let n={height:this.regionRect===void 0?0:this.regionRect.height,width:this.regionRect===void 0?0:this.regionRect.width};return e!==void 0&&this.horizontalScaling===`fill`?n.width=this.getAvailableSpace(e,this.anchorRect===void 0?0:this.anchorRect.left,this.anchorRect===void 0?0:this.anchorRect.right,this.anchorRect===void 0?0:this.anchorRect.width,this.viewportRect===void 0?0:this.viewportRect.left,this.viewportRect===void 0?0:this.viewportRect.right):this.horizontalScaling===`anchor`&&(n.width=this.anchorRect===void 0?0:this.anchorRect.width),t!==void 0&&this.verticalScaling===`fill`?n.height=this.getAvailableSpace(t,this.anchorRect===void 0?0:this.anchorRect.top,this.anchorRect===void 0?0:this.anchorRect.bottom,this.anchorRect===void 0?0:this.anchorRect.height,this.viewportRect===void 0?0:this.viewportRect.top,this.viewportRect===void 0?0:this.viewportRect.bottom):this.verticalScaling===`anchor`&&(n.height=this.anchorRect===void 0?0:this.anchorRect.height),n},this.startAutoUpdateEventListeners=()=>{window.addEventListener(_a,this.update,{passive:!0}),window.addEventListener(va,this.update,{passive:!0,capture:!0}),this.resizeDetector!==null&&this.viewportElement!==null&&this.resizeDetector.observe(this.viewportElement)},this.stopAutoUpdateEventListeners=()=>{window.removeEventListener(_a,this.update),window.removeEventListener(va,this.update),this.resizeDetector!==null&&this.viewportElement!==null&&this.resizeDetector.unobserve(this.viewportElement)}}anchorChanged(){this.initialLayoutComplete&&(this.anchorElement=this.getAnchor())}viewportChanged(){this.initialLayoutComplete&&(this.viewportElement=this.getViewport())}horizontalPositioningModeChanged(){this.requestReset()}horizontalDefaultPositionChanged(){this.updateForAttributeChange()}horizontalViewportLockChanged(){this.updateForAttributeChange()}horizontalInsetChanged(){this.updateForAttributeChange()}horizontalThresholdChanged(){this.updateForAttributeChange()}horizontalScalingChanged(){this.updateForAttributeChange()}verticalPositioningModeChanged(){this.requestReset()}verticalDefaultPositionChanged(){this.updateForAttributeChange()}verticalViewportLockChanged(){this.updateForAttributeChange()}verticalInsetChanged(){this.updateForAttributeChange()}verticalThresholdChanged(){this.updateForAttributeChange()}verticalScalingChanged(){this.updateForAttributeChange()}fixedPlacementChanged(){this.$fastController.isConnected&&this.initialLayoutComplete&&this.initialize()}autoUpdateModeChanged(e,t){this.$fastController.isConnected&&this.initialLayoutComplete&&(e===`auto`&&this.stopAutoUpdateEventListeners(),t===`auto`&&this.startAutoUpdateEventListeners())}anchorElementChanged(){this.requestReset()}viewportElementChanged(){this.$fastController.isConnected&&this.initialLayoutComplete&&this.initialize()}connectedCallback(){super.connectedCallback(),this.autoUpdateMode===`auto`&&this.startAutoUpdateEventListeners(),this.initialize()}disconnectedCallback(){super.disconnectedCallback(),this.autoUpdateMode===`auto`&&this.stopAutoUpdateEventListeners(),this.stopObservers(),this.disconnectResizeDetector()}adoptedCallback(){this.initialize()}disconnectResizeDetector(){this.resizeDetector!==null&&(this.resizeDetector.disconnect(),this.resizeDetector=null)}initializeResizeDetector(){this.disconnectResizeDetector(),this.resizeDetector=new window.ResizeObserver(this.handleResize)}updateForAttributeChange(){this.$fastController.isConnected&&this.initialLayoutComplete&&(this.forceUpdate=!0,this.update())}initialize(){this.initializeResizeDetector(),this.anchorElement===null&&(this.anchorElement=this.getAnchor()),this.requestReset()}requestReset(){this.$fastController.isConnected&&this.pendingReset===!1&&(this.setInitialState(),m.queueUpdate(()=>this.reset()),this.pendingReset=!0)}setInitialState(){this.initialLayoutComplete=!1,this.regionVisible=!1,this.translateX=0,this.translateY=0,this.baseHorizontalOffset=0,this.baseVerticalOffset=0,this.viewportRect=void 0,this.regionRect=void 0,this.anchorRect=void 0,this.verticalPosition=void 0,this.horizontalPosition=void 0,this.style.opacity=`0`,this.style.pointerEvents=`none`,this.forceUpdate=!1,this.style.position=this.fixedPlacement?`fixed`:`absolute`,this.updatePositionClasses(),this.updateRegionStyle()}};M.intersectionService=new Ha,w([y],M.prototype,`anchor`,void 0),w([y],M.prototype,`viewport`,void 0),w([y({attribute:`horizontal-positioning-mode`})],M.prototype,`horizontalPositioningMode`,void 0),w([y({attribute:`horizontal-default-position`})],M.prototype,`horizontalDefaultPosition`,void 0),w([y({attribute:`horizontal-viewport-lock`,mode:`boolean`})],M.prototype,`horizontalViewportLock`,void 0),w([y({attribute:`horizontal-inset`,mode:`boolean`})],M.prototype,`horizontalInset`,void 0),w([y({attribute:`horizontal-threshold`})],M.prototype,`horizontalThreshold`,void 0),w([y({attribute:`horizontal-scaling`})],M.prototype,`horizontalScaling`,void 0),w([y({attribute:`vertical-positioning-mode`})],M.prototype,`verticalPositioningMode`,void 0),w([y({attribute:`vertical-default-position`})],M.prototype,`verticalDefaultPosition`,void 0),w([y({attribute:`vertical-viewport-lock`,mode:`boolean`})],M.prototype,`verticalViewportLock`,void 0),w([y({attribute:`vertical-inset`,mode:`boolean`})],M.prototype,`verticalInset`,void 0),w([y({attribute:`vertical-threshold`})],M.prototype,`verticalThreshold`,void 0),w([y({attribute:`vertical-scaling`})],M.prototype,`verticalScaling`,void 0),w([y({attribute:`fixed-placement`,mode:`boolean`})],M.prototype,`fixedPlacement`,void 0),w([y({attribute:`auto-update-mode`})],M.prototype,`autoUpdateMode`,void 0),w([g],M.prototype,`anchorElement`,void 0),w([g],M.prototype,`viewportElement`,void 0),w([g],M.prototype,`initialLayoutComplete`,void 0);var Ua=(e,t)=>_`
    <template class="${e=>e.circular?`circular`:``}">
        <div class="control" part="control" style="${e=>e.generateBadgeStyle()}">
            <slot></slot>
        </div>
    </template>
`,Wa=class extends E{constructor(){super(...arguments),this.generateBadgeStyle=()=>{if(!this.fill&&!this.color)return;let e=`background-color: var(--badge-fill-${this.fill});`,t=`color: var(--badge-color-${this.color});`;return this.fill&&!this.color?e:this.color&&!this.fill?t:`${t} ${e}`}}};w([y({attribute:`fill`})],Wa.prototype,`fill`,void 0),w([y({attribute:`color`})],Wa.prototype,`color`,void 0),w([y({mode:`boolean`})],Wa.prototype,`circular`,void 0);var Ga=(e,t)=>_`
    <div role="listitem" class="listitem" part="listitem">
        ${S(e=>e.href&&e.href.length>0,_`
                ${La(e,t)}
            `)}
        ${S(e=>!e.href,_`
                ${mi(e,t)}
                <slot></slot>
                ${pi(e,t)}
            `)}
        ${S(e=>e.separator,_`
                <span class="separator" part="separator" aria-hidden="true">
                    <slot name="separator">${t.separator||``}</slot>
                </span>
            `)}
    </div>
`,Ka=class extends Ra{constructor(){super(...arguments),this.separator=!0}};w([g],Ka.prototype,`separator`,void 0),D(Ka,fi,za);var qa=(e,t)=>_`
    <template role="navigation">
        <div role="list" class="list" part="list">
            <slot
                ${C({property:`slottedBreadcrumbItems`,filter:si()})}
            ></slot>
        </div>
    </template>
`,Ja=class extends E{slottedBreadcrumbItemsChanged(){if(this.$fastController.isConnected){if(this.slottedBreadcrumbItems===void 0||this.slottedBreadcrumbItems.length===0)return;let e=this.slottedBreadcrumbItems[this.slottedBreadcrumbItems.length-1];this.slottedBreadcrumbItems.forEach(t=>{let n=t===e;this.setItemSeparator(t,n),this.setAriaCurrent(t,n)})}}setItemSeparator(e,t){e instanceof Ka&&(e.separator=!t)}findChildWithHref(e){return e.childElementCount>0?e.querySelector(`a[href]`):e.shadowRoot?.childElementCount?e.shadowRoot?.querySelector(`a[href]`):null}setAriaCurrent(e,t){let n=this.findChildWithHref(e);n===null&&e.hasAttribute(`href`)&&e instanceof Ka?t?e.setAttribute(`aria-current`,`page`):e.removeAttribute(`aria-current`):n!==null&&(t?n.setAttribute(`aria-current`,`page`):n.removeAttribute(`aria-current`))}};w([g],Ja.prototype,`slottedBreadcrumbItems`,void 0);var Ya=(e,t)=>_`
    <button
        class="control"
        part="control"
        ?autofocus="${e=>e.autofocus}"
        ?disabled="${e=>e.disabled}"
        form="${e=>e.formId}"
        formaction="${e=>e.formaction}"
        formenctype="${e=>e.formenctype}"
        formmethod="${e=>e.formmethod}"
        formnovalidate="${e=>e.formnovalidate}"
        formtarget="${e=>e.formtarget}"
        name="${e=>e.name}"
        type="${e=>e.type}"
        value="${e=>e.value}"
        aria-atomic="${e=>e.ariaAtomic}"
        aria-busy="${e=>e.ariaBusy}"
        aria-controls="${e=>e.ariaControls}"
        aria-current="${e=>e.ariaCurrent}"
        aria-describedby="${e=>e.ariaDescribedby}"
        aria-details="${e=>e.ariaDetails}"
        aria-disabled="${e=>e.ariaDisabled}"
        aria-errormessage="${e=>e.ariaErrormessage}"
        aria-expanded="${e=>e.ariaExpanded}"
        aria-flowto="${e=>e.ariaFlowto}"
        aria-haspopup="${e=>e.ariaHaspopup}"
        aria-hidden="${e=>e.ariaHidden}"
        aria-invalid="${e=>e.ariaInvalid}"
        aria-keyshortcuts="${e=>e.ariaKeyshortcuts}"
        aria-label="${e=>e.ariaLabel}"
        aria-labelledby="${e=>e.ariaLabelledby}"
        aria-live="${e=>e.ariaLive}"
        aria-owns="${e=>e.ariaOwns}"
        aria-pressed="${e=>e.ariaPressed}"
        aria-relevant="${e=>e.ariaRelevant}"
        aria-roledescription="${e=>e.ariaRoledescription}"
        ${x(`control`)}
    >
        ${mi(e,t)}
        <span class="content" part="content">
            <slot ${C(`defaultSlottedContent`)}></slot>
        </span>
        ${pi(e,t)}
    </button>
`,Xa=`form-associated-proxy`,Za=`ElementInternals`,Qa=Za in window&&`setFormValue`in window[Za].prototype,$a=new WeakMap;function eo(e){let t=class extends e{constructor(...e){super(...e),this.dirtyValue=!1,this.disabled=!1,this.proxyEventsToBlock=[`change`,`click`],this.proxyInitialized=!1,this.required=!1,this.initialValue=this.initialValue||``,this.elementInternals||(this.formResetCallback=this.formResetCallback.bind(this))}static get formAssociated(){return Qa}get validity(){return this.elementInternals?this.elementInternals.validity:this.proxy.validity}get form(){return this.elementInternals?this.elementInternals.form:this.proxy.form}get validationMessage(){return this.elementInternals?this.elementInternals.validationMessage:this.proxy.validationMessage}get willValidate(){return this.elementInternals?this.elementInternals.willValidate:this.proxy.willValidate}get labels(){if(this.elementInternals)return Object.freeze(Array.from(this.elementInternals.labels));if(this.proxy instanceof HTMLElement&&this.proxy.ownerDocument&&this.id){let e=this.proxy.labels,t=Array.from(this.proxy.getRootNode().querySelectorAll(`[for='${this.id}']`)),n=e?t.concat(Array.from(e)):t;return Object.freeze(n)}else return _n}valueChanged(e,t){this.dirtyValue=!0,this.proxy instanceof HTMLElement&&(this.proxy.value=this.value),this.currentValue=this.value,this.setFormValue(this.value),this.validate()}currentValueChanged(){this.value=this.currentValue}initialValueChanged(e,t){this.dirtyValue||=(this.value=this.initialValue,!1)}disabledChanged(e,t){this.proxy instanceof HTMLElement&&(this.proxy.disabled=this.disabled),m.queueUpdate(()=>this.classList.toggle(`disabled`,this.disabled))}nameChanged(e,t){this.proxy instanceof HTMLElement&&(this.proxy.name=this.name)}requiredChanged(e,t){this.proxy instanceof HTMLElement&&(this.proxy.required=this.required),m.queueUpdate(()=>this.classList.toggle(`required`,this.required)),this.validate()}get elementInternals(){if(!Qa)return null;let e=$a.get(this);return e||(e=this.attachInternals(),$a.set(this,e)),e}connectedCallback(){super.connectedCallback(),this.addEventListener(`keypress`,this._keypressHandler),this.value||(this.value=this.initialValue,this.dirtyValue=!1),this.elementInternals||(this.attachProxy(),this.form&&this.form.addEventListener(`reset`,this.formResetCallback))}disconnectedCallback(){super.disconnectedCallback(),this.proxyEventsToBlock.forEach(e=>this.proxy.removeEventListener(e,this.stopPropagation)),!this.elementInternals&&this.form&&this.form.removeEventListener(`reset`,this.formResetCallback)}checkValidity(){return this.elementInternals?this.elementInternals.checkValidity():this.proxy.checkValidity()}reportValidity(){return this.elementInternals?this.elementInternals.reportValidity():this.proxy.reportValidity()}setValidity(e,t,n){this.elementInternals?this.elementInternals.setValidity(e,t,n):typeof t==`string`&&this.proxy.setCustomValidity(t)}formDisabledCallback(e){this.disabled=e}formResetCallback(){this.value=this.initialValue,this.dirtyValue=!1}attachProxy(){var e;this.proxyInitialized||(this.proxyInitialized=!0,this.proxy.style.display=`none`,this.proxyEventsToBlock.forEach(e=>this.proxy.addEventListener(e,this.stopPropagation)),this.proxy.disabled=this.disabled,this.proxy.required=this.required,typeof this.name==`string`&&(this.proxy.name=this.name),typeof this.value==`string`&&(this.proxy.value=this.value),this.proxy.setAttribute(`slot`,Xa),this.proxySlot=document.createElement(`slot`),this.proxySlot.setAttribute(`name`,Xa)),(e=this.shadowRoot)==null||e.appendChild(this.proxySlot),this.appendChild(this.proxy)}detachProxy(){var e;this.removeChild(this.proxy),(e=this.shadowRoot)==null||e.removeChild(this.proxySlot)}validate(e){this.proxy instanceof HTMLElement&&this.setValidity(this.proxy.validity,this.proxy.validationMessage,e)}setFormValue(e,t){this.elementInternals&&this.elementInternals.setFormValue(e,t||e)}_keypressHandler(e){switch(e.key){case wa:this.form instanceof HTMLFormElement&&this.form.querySelector(`[type=submit]`)?.click();break}}stopPropagation(e){e.stopPropagation()}};return y({mode:`boolean`})(t.prototype,`disabled`),y({mode:`fromView`,attribute:`value`})(t.prototype,`initialValue`),y({attribute:`current-value`})(t.prototype,`currentValue`),y(t.prototype,`name`),y({mode:`boolean`})(t.prototype,`required`),g(t.prototype,`value`),t}function to(e){class t extends eo(e){}class n extends t{constructor(...e){super(e),this.dirtyChecked=!1,this.checkedAttribute=!1,this.checked=!1,this.dirtyChecked=!1}checkedAttributeChanged(){this.defaultChecked=this.checkedAttribute}defaultCheckedChanged(){this.dirtyChecked||=(this.checked=this.defaultChecked,!1)}checkedChanged(e,t){this.dirtyChecked||=!0,this.currentChecked=this.checked,this.updateForm(),this.proxy instanceof HTMLInputElement&&(this.proxy.checked=this.checked),e!==void 0&&this.$emit(`change`),this.validate()}currentCheckedChanged(e,t){this.checked=this.currentChecked}updateForm(){let e=this.checked?this.value:null;this.setFormValue(e,e)}connectedCallback(){super.connectedCallback(),this.updateForm()}formResetCallback(){super.formResetCallback(),this.checked=!!this.checkedAttribute,this.dirtyChecked=!1}}return y({attribute:`checked`,mode:`boolean`})(n.prototype,`checkedAttribute`),y({attribute:`current-checked`,converter:gr})(n.prototype,`currentChecked`),g(n.prototype,`defaultChecked`),g(n.prototype,`checked`),n}var no=class extends E{},ro=class extends eo(no){constructor(){super(...arguments),this.proxy=document.createElement(`input`)}},io=class extends ro{constructor(){super(...arguments),this.handleClick=e=>{this.disabled&&this.defaultSlottedContent?.length<=1&&e.stopPropagation()},this.handleSubmission=()=>{if(!this.form)return;let e=this.proxy.isConnected;e||this.attachProxy(),typeof this.form.requestSubmit==`function`?this.form.requestSubmit(this.proxy):this.proxy.click(),e||this.detachProxy()},this.handleFormReset=()=>{var e;(e=this.form)==null||e.reset()},this.handleUnsupportedDelegatesFocus=()=>{window.ShadowRoot&&!window.ShadowRoot.prototype.hasOwnProperty(`delegatesFocus`)&&this.$fastController.definition.shadowOptions?.delegatesFocus&&(this.focus=()=>{this.control.focus()})}}formactionChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formAction=this.formaction)}formenctypeChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formEnctype=this.formenctype)}formmethodChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formMethod=this.formmethod)}formnovalidateChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formNoValidate=this.formnovalidate)}formtargetChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formTarget=this.formtarget)}typeChanged(e,t){this.proxy instanceof HTMLInputElement&&(this.proxy.type=this.type),t===`submit`&&this.addEventListener(`click`,this.handleSubmission),e===`submit`&&this.removeEventListener(`click`,this.handleSubmission),t===`reset`&&this.addEventListener(`click`,this.handleFormReset),e===`reset`&&this.removeEventListener(`click`,this.handleFormReset)}validate(){super.validate(this.control)}connectedCallback(){super.connectedCallback(),this.proxy.setAttribute(`type`,this.type),this.handleUnsupportedDelegatesFocus();let e=Array.from(this.control?.children);e&&e.forEach(e=>{e.addEventListener(`click`,this.handleClick)})}disconnectedCallback(){super.disconnectedCallback();let e=Array.from(this.control?.children);e&&e.forEach(e=>{e.removeEventListener(`click`,this.handleClick)})}};w([y({mode:`boolean`})],io.prototype,`autofocus`,void 0),w([y({attribute:`form`})],io.prototype,`formId`,void 0),w([y],io.prototype,`formaction`,void 0),w([y],io.prototype,`formenctype`,void 0),w([y],io.prototype,`formmethod`,void 0),w([y({mode:`boolean`})],io.prototype,`formnovalidate`,void 0),w([y],io.prototype,`formtarget`,void 0),w([y],io.prototype,`type`,void 0),w([g],io.prototype,`defaultSlottedContent`,void 0);var ao=class{};w([y({attribute:`aria-expanded`})],ao.prototype,`ariaExpanded`,void 0),w([y({attribute:`aria-pressed`})],ao.prototype,`ariaPressed`,void 0),D(ao,j),D(io,fi,ao);var oo=class{constructor(e){if(this.dayFormat=`numeric`,this.weekdayFormat=`long`,this.monthFormat=`long`,this.yearFormat=`numeric`,this.date=new Date,e)for(let t in e){let n=e[t];t===`date`?this.date=this.getDateObject(n):this[t]=n}}getDateObject(e){if(typeof e==`string`){let t=e.split(/[/-]/);return t.length<3?new Date:new Date(parseInt(t[2],10),parseInt(t[0],10)-1,parseInt(t[1],10))}else if(`day`in e&&`month`in e&&`year`in e){let{day:t,month:n,year:r}=e;return new Date(r,n-1,t)}return e}getDate(e=this.date,t={weekday:this.weekdayFormat,month:this.monthFormat,day:this.dayFormat,year:this.yearFormat},n=this.locale){let r=this.getDateObject(e);if(!r.getTime())return``;let i=Object.assign({timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone},t);return new Intl.DateTimeFormat(n,i).format(r)}getDay(e=this.date.getDate(),t=this.dayFormat,n=this.locale){return this.getDate({month:1,day:e,year:2020},{day:t},n)}getMonth(e=this.date.getMonth()+1,t=this.monthFormat,n=this.locale){return this.getDate({month:e,day:2,year:2020},{month:t},n)}getYear(e=this.date.getFullYear(),t=this.yearFormat,n=this.locale){return this.getDate({month:2,day:2,year:e},{year:t},n)}getWeekday(e=0,t=this.weekdayFormat,n=this.locale){let r=`1-${e+1}-2017`;return this.getDate(r,{weekday:t},n)}getWeekdays(e=this.weekdayFormat,t=this.locale){return Array(7).fill(null).map((n,r)=>this.getWeekday(r,e,t))}},so=class extends E{constructor(){super(...arguments),this.dateFormatter=new oo,this.readonly=!1,this.locale=`en-US`,this.month=new Date().getMonth()+1,this.year=new Date().getFullYear(),this.dayFormat=`numeric`,this.weekdayFormat=`short`,this.monthFormat=`long`,this.yearFormat=`numeric`,this.minWeeks=0,this.disabledDates=``,this.selectedDates=``,this.oneDayInMs=864e5}localeChanged(){this.dateFormatter.locale=this.locale}dayFormatChanged(){this.dateFormatter.dayFormat=this.dayFormat}weekdayFormatChanged(){this.dateFormatter.weekdayFormat=this.weekdayFormat}monthFormatChanged(){this.dateFormatter.monthFormat=this.monthFormat}yearFormatChanged(){this.dateFormatter.yearFormat=this.yearFormat}getMonthInfo(e=this.month,t=this.year){let n=e=>new Date(e.getFullYear(),e.getMonth(),1).getDay(),r=e=>{let t=new Date(e.getFullYear(),e.getMonth()+1,1);return new Date(t.getTime()-this.oneDayInMs).getDate()},i=new Date(t,e-1),a=new Date(t,e),o=new Date(t,e-2);return{length:r(i),month:e,start:n(i),year:t,previous:{length:r(o),month:o.getMonth()+1,start:n(o),year:o.getFullYear()},next:{length:r(a),month:a.getMonth()+1,start:n(a),year:a.getFullYear()}}}getDays(e=this.getMonthInfo(),t=this.minWeeks){t=t>10?10:t;let{start:n,length:r,previous:i,next:a}=e,o=[],s=1-n;for(;s<r+1||o.length<t||o[o.length-1].length%7!=0;){let{month:t,year:n}=s<1?i:s>r?a:e,c=s<1?i.length+s:s>r?s-r:s,l=`${t}-${c}-${n}`,u={day:c,month:t,year:n,disabled:this.dateInString(l,this.disabledDates),selected:this.dateInString(l,this.selectedDates)},d=o[o.length-1];o.length===0||d.length%7==0?o.push([u]):d.push(u),s++}return o}dateInString(e,t){let n=t.split(`,`).map(e=>e.trim());return e=typeof e==`string`?e:`${e.getMonth()+1}-${e.getDate()}-${e.getFullYear()}`,n.some(t=>t===e)}getDayClassNames(e,t){let{day:n,month:r,year:i,disabled:a,selected:o}=e,s=t===`${r}-${n}-${i}`,c=this.month!==r;return[`day`,s&&`today`,c&&`inactive`,a&&`disabled`,o&&`selected`].filter(Boolean).join(` `)}getWeekdayText(){let e=this.dateFormatter.getWeekdays().map(e=>({text:e}));if(this.weekdayFormat!==`long`){let t=this.dateFormatter.getWeekdays(`long`);e.forEach((e,n)=>{e.abbr=t[n]})}return e}handleDateSelect(e,t){e.preventDefault,this.$emit(`dateselected`,t)}handleKeydown(e,t){return e.key===`Enter`&&this.handleDateSelect(e,t),!0}};w([y({mode:`boolean`})],so.prototype,`readonly`,void 0),w([y],so.prototype,`locale`,void 0),w([y({converter:v})],so.prototype,`month`,void 0),w([y({converter:v})],so.prototype,`year`,void 0),w([y({attribute:`day-format`,mode:`fromView`})],so.prototype,`dayFormat`,void 0),w([y({attribute:`weekday-format`,mode:`fromView`})],so.prototype,`weekdayFormat`,void 0),w([y({attribute:`month-format`,mode:`fromView`})],so.prototype,`monthFormat`,void 0),w([y({attribute:`year-format`,mode:`fromView`})],so.prototype,`yearFormat`,void 0),w([y({attribute:`min-weeks`,converter:v})],so.prototype,`minWeeks`,void 0),w([y({attribute:`disabled-dates`})],so.prototype,`disabledDates`,void 0),w([y({attribute:`selected-dates`})],so.prototype,`selectedDates`,void 0);var co={none:`none`,default:`default`,sticky:`sticky`},lo={default:`default`,columnHeader:`columnheader`,rowHeader:`rowheader`},uo={default:`default`,header:`header`,stickyHeader:`sticky-header`},fo=class extends E{constructor(){super(...arguments),this.rowType=uo.default,this.rowData=null,this.columnDefinitions=null,this.isActiveRow=!1,this.cellsRepeatBehavior=null,this.cellsPlaceholder=null,this.focusColumnIndex=0,this.refocusOnLoad=!1,this.updateRowStyle=()=>{this.style.gridTemplateColumns=this.gridTemplateColumns}}gridTemplateColumnsChanged(){this.$fastController.isConnected&&this.updateRowStyle()}rowTypeChanged(){this.$fastController.isConnected&&this.updateItemTemplate()}rowDataChanged(){if(this.rowData!==null&&this.isActiveRow){this.refocusOnLoad=!0;return}}cellItemTemplateChanged(){this.updateItemTemplate()}headerCellItemTemplateChanged(){this.updateItemTemplate()}connectedCallback(){super.connectedCallback(),this.cellsRepeatBehavior===null&&(this.cellsPlaceholder=document.createComment(``),this.appendChild(this.cellsPlaceholder),this.updateItemTemplate(),this.cellsRepeatBehavior=new ai(e=>e.columnDefinitions,e=>e.activeCellItemTemplate,{positioning:!0}).createBehavior(this.cellsPlaceholder),this.$fastController.addBehaviors([this.cellsRepeatBehavior])),this.addEventListener(`cell-focused`,this.handleCellFocus),this.addEventListener(ha,this.handleFocusout),this.addEventListener(ga,this.handleKeydown),this.updateRowStyle(),this.refocusOnLoad&&(this.refocusOnLoad=!1,this.cellElements.length>this.focusColumnIndex&&this.cellElements[this.focusColumnIndex].focus())}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(`cell-focused`,this.handleCellFocus),this.removeEventListener(ha,this.handleFocusout),this.removeEventListener(ga,this.handleKeydown)}handleFocusout(e){this.contains(e.target)||(this.isActiveRow=!1,this.focusColumnIndex=0)}handleCellFocus(e){this.isActiveRow=!0,this.focusColumnIndex=this.cellElements.indexOf(e.target),this.$emit(`row-focused`,this)}handleKeydown(e){if(e.defaultPrevented)return;let t=0;switch(e.key){case xa:t=Math.max(0,this.focusColumnIndex-1),this.cellElements[t].focus(),e.preventDefault();break;case Sa:t=Math.min(this.cellElements.length-1,this.focusColumnIndex+1),this.cellElements[t].focus(),e.preventDefault();break;case Ea:e.ctrlKey||(this.cellElements[0].focus(),e.preventDefault());break;case`End`:e.ctrlKey||(this.cellElements[this.cellElements.length-1].focus(),e.preventDefault());break}}updateItemTemplate(){this.activeCellItemTemplate=this.rowType===uo.default&&this.cellItemTemplate!==void 0?this.cellItemTemplate:this.rowType===uo.default&&this.cellItemTemplate===void 0?this.defaultCellItemTemplate:this.headerCellItemTemplate===void 0?this.defaultHeaderCellItemTemplate:this.headerCellItemTemplate}};w([y({attribute:`grid-template-columns`})],fo.prototype,`gridTemplateColumns`,void 0),w([y({attribute:`row-type`})],fo.prototype,`rowType`,void 0),w([g],fo.prototype,`rowData`,void 0),w([g],fo.prototype,`columnDefinitions`,void 0),w([g],fo.prototype,`cellItemTemplate`,void 0),w([g],fo.prototype,`headerCellItemTemplate`,void 0),w([g],fo.prototype,`rowIndex`,void 0),w([g],fo.prototype,`isActiveRow`,void 0),w([g],fo.prototype,`activeCellItemTemplate`,void 0),w([g],fo.prototype,`defaultCellItemTemplate`,void 0),w([g],fo.prototype,`defaultHeaderCellItemTemplate`,void 0),w([g],fo.prototype,`cellElements`,void 0);function po(e){let t=e.tagFor(fo);return _`
    <${t}
        :rowData="${e=>e}"
        :cellItemTemplate="${(e,t)=>t.parent.cellItemTemplate}"
        :headerCellItemTemplate="${(e,t)=>t.parent.headerCellItemTemplate}"
    ></${t}>
`}var mo=(e,t)=>{let n=po(e),r=e.tagFor(fo);return _`
        <template
            role="grid"
            tabindex="0"
            :rowElementTag="${()=>r}"
            :defaultRowItemTemplate="${n}"
            ${di({property:`rowElements`,filter:si(`[role=row]`)})}
        >
            <slot></slot>
        </template>
    `},ho=class e extends E{constructor(){super(),this.noTabbing=!1,this.generateHeader=co.default,this.rowsData=[],this.columnDefinitions=null,this.focusRowIndex=0,this.focusColumnIndex=0,this.rowsPlaceholder=null,this.generatedHeader=null,this.isUpdatingFocus=!1,this.pendingFocusUpdate=!1,this.rowindexUpdateQueued=!1,this.columnDefinitionsStale=!0,this.generatedGridTemplateColumns=``,this.focusOnCell=(e,t,n)=>{if(this.rowElements.length===0){this.focusRowIndex=0,this.focusColumnIndex=0;return}let r=Math.max(0,Math.min(this.rowElements.length-1,e)),i=this.rowElements[r].querySelectorAll(`[role="cell"], [role="gridcell"], [role="columnheader"], [role="rowheader"]`),a=i[Math.max(0,Math.min(i.length-1,t))];n&&this.scrollHeight!==this.clientHeight&&(r<this.focusRowIndex&&this.scrollTop>0||r>this.focusRowIndex&&this.scrollTop<this.scrollHeight-this.clientHeight)&&a.scrollIntoView({block:`center`,inline:`center`}),a.focus()},this.onChildListChange=(e,t)=>{e&&e.length&&(e.forEach(e=>{e.addedNodes.forEach(e=>{e.nodeType===1&&e.getAttribute(`role`)===`row`&&(e.columnDefinitions=this.columnDefinitions)})}),this.queueRowIndexUpdate())},this.queueRowIndexUpdate=()=>{this.rowindexUpdateQueued||(this.rowindexUpdateQueued=!0,m.queueUpdate(this.updateRowIndexes))},this.updateRowIndexes=()=>{let e=this.gridTemplateColumns;if(e===void 0){if(this.generatedGridTemplateColumns===``&&this.rowElements.length>0){let e=this.rowElements[0];this.generatedGridTemplateColumns=Array(e.cellElements.length).fill(`1fr`).join(` `)}e=this.generatedGridTemplateColumns}this.rowElements.forEach((t,n)=>{let r=t;r.rowIndex=n,r.gridTemplateColumns=e,this.columnDefinitionsStale&&(r.columnDefinitions=this.columnDefinitions)}),this.rowindexUpdateQueued=!1,this.columnDefinitionsStale=!1}}static generateTemplateColumns(e){let t=``;return e.forEach(e=>{t=`${t}${t===``?``:` `}1fr`}),t}noTabbingChanged(){this.$fastController.isConnected&&(this.noTabbing?this.setAttribute(`tabIndex`,`-1`):this.setAttribute(`tabIndex`,this.contains(document.activeElement)||this===document.activeElement?`-1`:`0`))}generateHeaderChanged(){this.$fastController.isConnected&&this.toggleGeneratedHeader()}gridTemplateColumnsChanged(){this.$fastController.isConnected&&this.updateRowIndexes()}rowsDataChanged(){this.columnDefinitions===null&&this.rowsData.length>0&&(this.columnDefinitions=e.generateColumns(this.rowsData[0])),this.$fastController.isConnected&&this.toggleGeneratedHeader()}columnDefinitionsChanged(){if(this.columnDefinitions===null){this.generatedGridTemplateColumns=``;return}this.generatedGridTemplateColumns=e.generateTemplateColumns(this.columnDefinitions),this.$fastController.isConnected&&(this.columnDefinitionsStale=!0,this.queueRowIndexUpdate())}headerCellItemTemplateChanged(){this.$fastController.isConnected&&this.generatedHeader!==null&&(this.generatedHeader.headerCellItemTemplate=this.headerCellItemTemplate)}focusRowIndexChanged(){this.$fastController.isConnected&&this.queueFocusUpdate()}focusColumnIndexChanged(){this.$fastController.isConnected&&this.queueFocusUpdate()}connectedCallback(){super.connectedCallback(),this.rowItemTemplate===void 0&&(this.rowItemTemplate=this.defaultRowItemTemplate),this.rowsPlaceholder=document.createComment(``),this.appendChild(this.rowsPlaceholder),this.toggleGeneratedHeader(),this.rowsRepeatBehavior=new ai(e=>e.rowsData,e=>e.rowItemTemplate,{positioning:!0}).createBehavior(this.rowsPlaceholder),this.$fastController.addBehaviors([this.rowsRepeatBehavior]),this.addEventListener(`row-focused`,this.handleRowFocus),this.addEventListener(pa,this.handleFocus),this.addEventListener(ga,this.handleKeydown),this.addEventListener(ha,this.handleFocusOut),this.observer=new MutationObserver(this.onChildListChange),this.observer.observe(this,{childList:!0}),this.noTabbing&&this.setAttribute(`tabindex`,`-1`),m.queueUpdate(this.queueRowIndexUpdate)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(`row-focused`,this.handleRowFocus),this.removeEventListener(pa,this.handleFocus),this.removeEventListener(ga,this.handleKeydown),this.removeEventListener(ha,this.handleFocusOut),this.observer.disconnect(),this.rowsPlaceholder=null,this.generatedHeader=null}handleRowFocus(e){this.isUpdatingFocus=!0;let t=e.target;this.focusRowIndex=this.rowElements.indexOf(t),this.focusColumnIndex=t.focusColumnIndex,this.setAttribute(`tabIndex`,`-1`),this.isUpdatingFocus=!1}handleFocus(e){this.focusOnCell(this.focusRowIndex,this.focusColumnIndex,!0)}handleFocusOut(e){(e.relatedTarget===null||!this.contains(e.relatedTarget))&&this.setAttribute(`tabIndex`,this.noTabbing?`-1`:`0`)}handleKeydown(e){if(e.defaultPrevented)return;let t,n=this.rowElements.length-1,r=this.offsetHeight+this.scrollTop,i=this.rowElements[n];switch(e.key){case Ca:e.preventDefault(),this.focusOnCell(this.focusRowIndex-1,this.focusColumnIndex,!0);break;case ba:e.preventDefault(),this.focusOnCell(this.focusRowIndex+1,this.focusColumnIndex,!0);break;case Oa:if(e.preventDefault(),this.rowElements.length===0){this.focusOnCell(0,0,!1);break}if(this.focusRowIndex===0){this.focusOnCell(0,this.focusColumnIndex,!1);return}for(t=this.focusRowIndex-1;t>=0;t--){let e=this.rowElements[t];if(e.offsetTop<this.scrollTop){this.scrollTop=e.offsetTop+e.clientHeight-this.clientHeight;break}}this.focusOnCell(t,this.focusColumnIndex,!1);break;case Da:if(e.preventDefault(),this.rowElements.length===0){this.focusOnCell(0,0,!1);break}if(this.focusRowIndex>=n||i.offsetTop+i.offsetHeight<=r){this.focusOnCell(n,this.focusColumnIndex,!1);return}for(t=this.focusRowIndex+1;t<=n;t++){let e=this.rowElements[t];if(e.offsetTop+e.offsetHeight>r){let t=0;this.generateHeader===co.sticky&&this.generatedHeader!==null&&(t=this.generatedHeader.clientHeight),this.scrollTop=e.offsetTop-t;break}}this.focusOnCell(t,this.focusColumnIndex,!1);break;case Ea:e.ctrlKey&&(e.preventDefault(),this.focusOnCell(0,0,!0));break;case`End`:e.ctrlKey&&this.columnDefinitions!==null&&(e.preventDefault(),this.focusOnCell(this.rowElements.length-1,this.columnDefinitions.length-1,!0));break}}queueFocusUpdate(){this.isUpdatingFocus&&(this.contains(document.activeElement)||this===document.activeElement)||this.pendingFocusUpdate===!1&&(this.pendingFocusUpdate=!0,m.queueUpdate(()=>this.updateFocus()))}updateFocus(){this.pendingFocusUpdate=!1,this.focusOnCell(this.focusRowIndex,this.focusColumnIndex,!0)}toggleGeneratedHeader(){if(this.generatedHeader!==null&&(this.removeChild(this.generatedHeader),this.generatedHeader=null),this.generateHeader!==co.none&&this.rowsData.length>0){let e=document.createElement(this.rowElementTag);this.generatedHeader=e,this.generatedHeader.columnDefinitions=this.columnDefinitions,this.generatedHeader.gridTemplateColumns=this.gridTemplateColumns,this.generatedHeader.rowType=this.generateHeader===co.sticky?uo.stickyHeader:uo.header,(this.firstChild!==null||this.rowsPlaceholder!==null)&&this.insertBefore(e,this.firstChild===null?this.rowsPlaceholder:this.firstChild);return}}};ho.generateColumns=e=>Object.getOwnPropertyNames(e).map((e,t)=>({columnDataKey:e,gridColumn:`${t}`})),w([y({attribute:`no-tabbing`,mode:`boolean`})],ho.prototype,`noTabbing`,void 0),w([y({attribute:`generate-header`})],ho.prototype,`generateHeader`,void 0),w([y({attribute:`grid-template-columns`})],ho.prototype,`gridTemplateColumns`,void 0),w([g],ho.prototype,`rowsData`,void 0),w([g],ho.prototype,`columnDefinitions`,void 0),w([g],ho.prototype,`rowItemTemplate`,void 0),w([g],ho.prototype,`cellItemTemplate`,void 0),w([g],ho.prototype,`headerCellItemTemplate`,void 0),w([g],ho.prototype,`focusRowIndex`,void 0),w([g],ho.prototype,`focusColumnIndex`,void 0),w([g],ho.prototype,`defaultRowItemTemplate`,void 0),w([g],ho.prototype,`rowElementTag`,void 0),w([g],ho.prototype,`rowElements`,void 0);var go=_`
    <template>
        ${e=>e.rowData===null||e.columnDefinition===null||e.columnDefinition.columnDataKey===null?null:e.rowData[e.columnDefinition.columnDataKey]}
    </template>
`,_o=_`
    <template>
        ${e=>e.columnDefinition===null?null:e.columnDefinition.title===void 0?e.columnDefinition.columnDataKey:e.columnDefinition.title}
    </template>
`,vo=class extends E{constructor(){super(...arguments),this.cellType=lo.default,this.rowData=null,this.columnDefinition=null,this.isActiveCell=!1,this.customCellView=null,this.updateCellStyle=()=>{this.style.gridColumn=this.gridColumn}}cellTypeChanged(){this.$fastController.isConnected&&this.updateCellView()}gridColumnChanged(){this.$fastController.isConnected&&this.updateCellStyle()}columnDefinitionChanged(e,t){this.$fastController.isConnected&&this.updateCellView()}connectedCallback(){super.connectedCallback(),this.addEventListener(ma,this.handleFocusin),this.addEventListener(ha,this.handleFocusout),this.addEventListener(ga,this.handleKeydown),this.style.gridColumn=`${this.columnDefinition?.gridColumn===void 0?0:this.columnDefinition.gridColumn}`,this.updateCellView(),this.updateCellStyle()}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(ma,this.handleFocusin),this.removeEventListener(ha,this.handleFocusout),this.removeEventListener(ga,this.handleKeydown),this.disconnectCellView()}handleFocusin(e){if(!this.isActiveCell){switch(this.isActiveCell=!0,this.cellType){case lo.columnHeader:if(this.columnDefinition!==null&&this.columnDefinition.headerCellInternalFocusQueue!==!0&&typeof this.columnDefinition.headerCellFocusTargetCallback==`function`){let e=this.columnDefinition.headerCellFocusTargetCallback(this);e!==null&&e.focus()}break;default:if(this.columnDefinition!==null&&this.columnDefinition.cellInternalFocusQueue!==!0&&typeof this.columnDefinition.cellFocusTargetCallback==`function`){let e=this.columnDefinition.cellFocusTargetCallback(this);e!==null&&e.focus()}break}this.$emit(`cell-focused`,this)}}handleFocusout(e){this!==document.activeElement&&!this.contains(document.activeElement)&&(this.isActiveCell=!1)}handleKeydown(e){if(!(e.defaultPrevented||this.columnDefinition===null||this.cellType===lo.default&&this.columnDefinition.cellInternalFocusQueue!==!0||this.cellType===lo.columnHeader&&this.columnDefinition.headerCellInternalFocusQueue!==!0))switch(e.key){case wa:case`F2`:if(this.contains(document.activeElement)&&document.activeElement!==this)return;switch(this.cellType){case lo.columnHeader:if(this.columnDefinition.headerCellFocusTargetCallback!==void 0){let t=this.columnDefinition.headerCellFocusTargetCallback(this);t!==null&&t.focus(),e.preventDefault()}break;default:if(this.columnDefinition.cellFocusTargetCallback!==void 0){let t=this.columnDefinition.cellFocusTargetCallback(this);t!==null&&t.focus(),e.preventDefault()}break}break;case Ta:this.contains(document.activeElement)&&document.activeElement!==this&&(this.focus(),e.preventDefault());break}}updateCellView(){if(this.disconnectCellView(),this.columnDefinition!==null)switch(this.cellType){case lo.columnHeader:this.columnDefinition.headerCellTemplate===void 0?this.customCellView=_o.render(this,this):this.customCellView=this.columnDefinition.headerCellTemplate.render(this,this);break;case void 0:case lo.rowHeader:case lo.default:this.columnDefinition.cellTemplate===void 0?this.customCellView=go.render(this,this):this.customCellView=this.columnDefinition.cellTemplate.render(this,this);break}}disconnectCellView(){this.customCellView!==null&&(this.customCellView.dispose(),this.customCellView=null)}};w([y({attribute:`cell-type`})],vo.prototype,`cellType`,void 0),w([y({attribute:`grid-column`})],vo.prototype,`gridColumn`,void 0),w([g],vo.prototype,`rowData`,void 0),w([g],vo.prototype,`columnDefinition`,void 0);function yo(e){let t=e.tagFor(vo);return _`
    <${t}
        cell-type="${e=>e.isRowHeader?`rowheader`:void 0}"
        grid-column="${(e,t)=>t.index+1}"
        :rowData="${(e,t)=>t.parent.rowData}"
        :columnDefinition="${e=>e}"
    ></${t}>
`}function bo(e){let t=e.tagFor(vo);return _`
    <${t}
        cell-type="columnheader"
        grid-column="${(e,t)=>t.index+1}"
        :columnDefinition="${e=>e}"
    ></${t}>
`}var xo=(e,t)=>_`
        <template
            role="row"
            class="${e=>e.rowType===`default`?``:e.rowType}"
            :defaultCellItemTemplate="${yo(e)}"
            :defaultHeaderCellItemTemplate="${bo(e)}"
            ${di({property:`cellElements`,filter:si(`[role="cell"],[role="gridcell"],[role="columnheader"],[role="rowheader"]`)})}
        >
            <slot ${C(`slottedCellElements`)}></slot>
        </template>
    `,So=(e,t)=>_`
        <template
            tabindex="-1"
            role="${e=>!e.cellType||e.cellType===`default`?`gridcell`:e.cellType}"
            class="
            ${e=>e.cellType===`columnheader`?`column-header`:e.cellType===`rowheader`?`row-header`:``}
            "
        >
            <slot></slot>
        </template>
    `,Co=_`
    <div
        class="title"
        part="title"
        aria-label="${e=>e.dateFormatter.getDate(`${e.month}-2-${e.year}`,{month:`long`,year:`numeric`})}"
    >
        <span part="month">
            ${e=>e.dateFormatter.getMonth(e.month)}
        </span>
        <span part="year">${e=>e.dateFormatter.getYear(e.year)}</span>
    </div>
`,wo=e=>{let t=e.tagFor(vo);return _`
        <${t}
            class="week-day"
            part="week-day"
            tabindex="-1"
            grid-column="${(e,t)=>t.index+1}"
            abbr="${e=>e.abbr}"
        >
            ${e=>e.text}
        </${t}>
    `},To=(e,t)=>{let n=e.tagFor(vo);return _`
        <${n}
            class="${(e,n)=>n.parentContext.parent.getDayClassNames(e,t)}"
            part="day"
            tabindex="-1"
            role="gridcell"
            grid-column="${(e,t)=>t.index+1}"
            @click="${(e,t)=>t.parentContext.parent.handleDateSelect(t.event,e)}"
            @keydown="${(e,t)=>t.parentContext.parent.handleKeydown(t.event,e)}"
            aria-label="${(e,t)=>t.parentContext.parent.dateFormatter.getDate(`${e.month}-${e.day}-${e.year}`,{month:`long`,day:`numeric`})}"
        >
            <div
                class="date"
                part="${e=>t===`${e.month}-${e.day}-${e.year}`?`today`:`date`}"
            >
                ${(e,t)=>t.parentContext.parent.dateFormatter.getDay(e.day)}
            </div>
            <slot name="${e=>e.month}-${e=>e.day}-${e=>e.year}"></slot>
        </${n}>
    `},Eo=(e,t)=>{let n=e.tagFor(fo);return _`
        <${n}
            class="week"
            part="week"
            role="row"
            role-type="default"
            grid-template-columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr"
        >
        ${oi(e=>e,To(e,t),{positioning:!0})}
        </${n}>
    `},Do=(e,t)=>{let n=e.tagFor(ho),r=e.tagFor(fo);return _`
    <${n} class="days interact" part="days" generate-header="none">
        <${r}
            class="week-days"
            part="week-days"
            role="row"
            row-type="header"
            grid-template-columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr"
        >
            ${oi(e=>e.getWeekdayText(),wo(e),{positioning:!0})}
        </${r}>
        ${oi(e=>e.getDays(),Eo(e,t))}
    </${n}>
`},Oo=e=>_`
        <div class="days" part="days">
            <div class="week-days" part="week-days">
                ${oi(e=>e.getWeekdayText(),_`
                        <div class="week-day" part="week-day" abbr="${e=>e.abbr}">
                            ${e=>e.text}
                        </div>
                    `)}
            </div>
            ${oi(e=>e.getDays(),_`
                    <div class="week">
                        ${oi(e=>e,_`
                                <div
                                    class="${(t,n)=>n.parentContext.parent.getDayClassNames(t,e)}"
                                    part="day"
                                    aria-label="${(e,t)=>t.parentContext.parent.dateFormatter.getDate(`${e.month}-${e.day}-${e.year}`,{month:`long`,day:`numeric`})}"
                                >
                                    <div
                                        class="date"
                                        part="${t=>e===`${t.month}-${t.day}-${t.year}`?`today`:`date`}"
                                    >
                                        ${(e,t)=>t.parentContext.parent.dateFormatter.getDay(e.day)}
                                    </div>
                                    <slot
                                        name="${e=>e.month}-${e=>e.day}-${e=>e.year}"
                                    ></slot>
                                </div>
                            `)}
                    </div>
                `)}
        </div>
    `,ko=(e,t)=>{let n=new Date,r=`${n.getMonth()+1}-${n.getDate()}-${n.getFullYear()}`;return _`
        <template>
            ${gi}
            ${t.title instanceof Function?t.title(e,t):t.title??``}
            <slot></slot>
            ${S(e=>e.readonly,Oo(r),Do(e,r))}
            ${hi}
        </template>
    `},Ao=(e,t)=>_`
    <slot></slot>
`,jo=class extends E{},Mo=(e,t)=>_`
    <template
        role="checkbox"
        aria-checked="${e=>e.checked}"
        aria-required="${e=>e.required}"
        aria-disabled="${e=>e.disabled}"
        aria-readonly="${e=>e.readOnly}"
        tabindex="${e=>e.disabled?null:0}"
        @keypress="${(e,t)=>e.keypressHandler(t.event)}"
        @click="${(e,t)=>e.clickHandler(t.event)}"
        class="${e=>e.readOnly?`readonly`:``} ${e=>e.checked?`checked`:``} ${e=>e.indeterminate?`indeterminate`:``}"
    >
        <div part="control" class="control">
            <slot name="checked-indicator">
                ${t.checkedIndicator||``}
            </slot>
            <slot name="indeterminate-indicator">
                ${t.indeterminateIndicator||``}
            </slot>
        </div>
        <label
            part="label"
            class="${e=>e.defaultSlottedNodes&&e.defaultSlottedNodes.length?`label`:`label label__hidden`}"
        >
            <slot ${C(`defaultSlottedNodes`)}></slot>
        </label>
    </template>
`,No=class extends E{},Po=class extends to(No){constructor(){super(...arguments),this.proxy=document.createElement(`input`)}},Fo=class extends Po{constructor(){super(),this.initialValue=`on`,this.indeterminate=!1,this.keypressHandler=e=>{if(!this.readOnly)switch(e.key){case` `:this.indeterminate&&=!1,this.checked=!this.checked;break}},this.clickHandler=e=>{!this.disabled&&!this.readOnly&&(this.indeterminate&&=!1,this.checked=!this.checked)},this.proxy.setAttribute(`type`,`checkbox`)}readOnlyChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.readOnly=this.readOnly)}};w([y({attribute:`readonly`,mode:`boolean`})],Fo.prototype,`readOnly`,void 0),w([g],Fo.prototype,`defaultSlottedNodes`,void 0),w([g],Fo.prototype,`indeterminate`,void 0);function Io(e){return ca(e)&&(e.getAttribute(`role`)===`option`||e instanceof HTMLOptionElement)}var Lo=class extends E{constructor(e,t,n,r){super(),this.defaultSelected=!1,this.dirtySelected=!1,this.selected=this.defaultSelected,this.dirtyValue=!1,e&&(this.textContent=e),t&&(this.initialValue=t),n&&(this.defaultSelected=n),r&&(this.selected=r),this.proxy=new Option(`${this.textContent}`,this.initialValue,this.defaultSelected,this.selected),this.proxy.disabled=this.disabled}checkedChanged(e,t){if(typeof t==`boolean`){this.ariaChecked=t?`true`:`false`;return}this.ariaChecked=null}contentChanged(e,t){this.proxy instanceof HTMLOptionElement&&(this.proxy.textContent=this.textContent),this.$emit(`contentchange`,null,{bubbles:!0})}defaultSelectedChanged(){this.dirtySelected||(this.selected=this.defaultSelected,this.proxy instanceof HTMLOptionElement&&(this.proxy.selected=this.defaultSelected))}disabledChanged(e,t){this.ariaDisabled=this.disabled?`true`:`false`,this.proxy instanceof HTMLOptionElement&&(this.proxy.disabled=this.disabled)}selectedAttributeChanged(){this.defaultSelected=this.selectedAttribute,this.proxy instanceof HTMLOptionElement&&(this.proxy.defaultSelected=this.defaultSelected)}selectedChanged(){this.ariaSelected=this.selected?`true`:`false`,this.dirtySelected||=!0,this.proxy instanceof HTMLOptionElement&&(this.proxy.selected=this.selected)}initialValueChanged(e,t){this.dirtyValue||=(this.value=this.initialValue,!1)}get label(){return this.value??this.text}get text(){return this.textContent?.replace(/\s+/g,` `).trim()??``}set value(e){let t=`${e??``}`;this._value=t,this.dirtyValue=!0,this.proxy instanceof HTMLOptionElement&&(this.proxy.value=t),h.notify(this,`value`)}get value(){return h.track(this,`value`),this._value??this.text}get form(){return this.proxy?this.proxy.form:null}};w([g],Lo.prototype,`checked`,void 0),w([g],Lo.prototype,`content`,void 0),w([g],Lo.prototype,`defaultSelected`,void 0),w([y({mode:`boolean`})],Lo.prototype,`disabled`,void 0),w([y({attribute:`selected`,mode:`boolean`})],Lo.prototype,`selectedAttribute`,void 0),w([g],Lo.prototype,`selected`,void 0),w([y({attribute:`value`,mode:`fromView`})],Lo.prototype,`initialValue`,void 0);var Ro=class{};w([g],Ro.prototype,`ariaChecked`,void 0),w([g],Ro.prototype,`ariaPosInSet`,void 0),w([g],Ro.prototype,`ariaSelected`,void 0),w([g],Ro.prototype,`ariaSetSize`,void 0),D(Ro,j),D(Lo,fi,Ro);var zo=class e extends E{constructor(){super(...arguments),this._options=[],this.selectedIndex=-1,this.selectedOptions=[],this.shouldSkipFocus=!1,this.typeaheadBuffer=``,this.typeaheadExpired=!0,this.typeaheadTimeout=-1}get firstSelectedOption(){return this.selectedOptions[0]??null}get hasSelectableOptions(){return this.options.length>0&&!this.options.every(e=>e.disabled)}get length(){return this.options?.length??0}get options(){return h.track(this,`options`),this._options}set options(e){this._options=e,h.notify(this,`options`)}get typeAheadExpired(){return this.typeaheadExpired}set typeAheadExpired(e){this.typeaheadExpired=e}clickHandler(e){let t=e.target.closest(`option,[role=option]`);if(t&&!t.disabled)return this.selectedIndex=this.options.indexOf(t),!0}focusAndScrollOptionIntoView(e=this.firstSelectedOption){this.contains(document.activeElement)&&e!==null&&(e.focus(),requestAnimationFrame(()=>{e.scrollIntoView({block:`nearest`})}))}focusinHandler(e){!this.shouldSkipFocus&&e.target===e.currentTarget&&(this.setSelectedOptions(),this.focusAndScrollOptionIntoView()),this.shouldSkipFocus=!1}getTypeaheadMatches(){let e=this.typeaheadBuffer.replace(/[.*+\-?^${}()|[\]\\]/g,`\\$&`),t=RegExp(`^${e}`,`gi`);return this.options.filter(e=>e.text.trim().match(t))}getSelectableIndex(e=this.selectedIndex,t){let n=e>t?-1:+(e<t),r=e+n,i=null;switch(n){case-1:i=this.options.reduceRight((e,t,n)=>!e&&!t.disabled&&n<r?t:e,i);break;case 1:i=this.options.reduce((e,t,n)=>!e&&!t.disabled&&n>r?t:e,i);break}return this.options.indexOf(i)}handleChange(t,n){switch(n){case`selected`:e.slottedOptionFilter(t)&&(this.selectedIndex=this.options.indexOf(t)),this.setSelectedOptions();break}}handleTypeAhead(t){this.typeaheadTimeout&&window.clearTimeout(this.typeaheadTimeout),this.typeaheadTimeout=window.setTimeout(()=>this.typeaheadExpired=!0,e.TYPE_AHEAD_TIMEOUT_MS),!(t.length>1)&&(this.typeaheadBuffer=`${this.typeaheadExpired?``:this.typeaheadBuffer}${t}`)}keydownHandler(e){if(this.disabled)return!0;this.shouldSkipFocus=!1;let t=e.key;switch(t){case Ea:e.shiftKey||(e.preventDefault(),this.selectFirstOption());break;case ba:e.shiftKey||(e.preventDefault(),this.selectNextOption());break;case Ca:e.shiftKey||(e.preventDefault(),this.selectPreviousOption());break;case`End`:e.preventDefault(),this.selectLastOption();break;case`Tab`:return this.focusAndScrollOptionIntoView(),!0;case wa:case Ta:return!0;case` `:if(this.typeaheadExpired)return!0;default:return t.length===1&&this.handleTypeAhead(`${t}`),!0}}mousedownHandler(e){return this.shouldSkipFocus=!this.contains(document.activeElement),!0}multipleChanged(e,t){this.ariaMultiSelectable=t?`true`:null}selectedIndexChanged(e,t){if(!this.hasSelectableOptions){this.selectedIndex=-1;return}if(this.options[this.selectedIndex]?.disabled&&typeof e==`number`){let n=this.getSelectableIndex(e,t),r=n>-1?n:e;this.selectedIndex=r,t===r&&this.selectedIndexChanged(t,r);return}this.setSelectedOptions()}selectedOptionsChanged(t,n){var r;let i=n.filter(e.slottedOptionFilter);(r=this.options)==null||r.forEach(e=>{let t=h.getNotifier(e);t.unsubscribe(this,`selected`),e.selected=i.includes(e),t.subscribe(this,`selected`)})}selectFirstOption(){this.disabled||(this.selectedIndex=this.options?.findIndex(e=>!e.disabled)??-1)}selectLastOption(){this.disabled||(this.selectedIndex=oa(this.options,e=>!e.disabled))}selectNextOption(){!this.disabled&&this.selectedIndex<this.options.length-1&&(this.selectedIndex+=1)}selectPreviousOption(){!this.disabled&&this.selectedIndex>0&&--this.selectedIndex}setDefaultSelectedOption(){this.selectedIndex=this.options?.findIndex(e=>e.defaultSelected)??-1}setSelectedOptions(){this.options?.length&&(this.selectedOptions=[this.options[this.selectedIndex]],this.ariaActiveDescendant=this.firstSelectedOption?.id??``,this.focusAndScrollOptionIntoView())}slottedOptionsChanged(e,t){this.options=t.reduce((e,t)=>(Io(t)&&e.push(t),e),[]);let n=`${this.options.length}`;this.options.forEach((e,t)=>{e.id||=Pa(`option-`),e.ariaPosInSet=`${t+1}`,e.ariaSetSize=n}),this.$fastController.isConnected&&(this.setSelectedOptions(),this.setDefaultSelectedOption())}typeaheadBufferChanged(e,t){if(this.$fastController.isConnected){let e=this.getTypeaheadMatches();if(e.length){let t=this.options.indexOf(e[0]);t>-1&&(this.selectedIndex=t)}this.typeaheadExpired=!1}}};zo.slottedOptionFilter=e=>Io(e)&&!e.hidden,zo.TYPE_AHEAD_TIMEOUT_MS=1e3,w([y({mode:`boolean`})],zo.prototype,`disabled`,void 0),w([g],zo.prototype,`selectedIndex`,void 0),w([g],zo.prototype,`selectedOptions`,void 0),w([g],zo.prototype,`slottedOptions`,void 0),w([g],zo.prototype,`typeaheadBuffer`,void 0);var Bo=class{};w([g],Bo.prototype,`ariaActiveDescendant`,void 0),w([g],Bo.prototype,`ariaDisabled`,void 0),w([g],Bo.prototype,`ariaExpanded`,void 0),w([g],Bo.prototype,`ariaMultiSelectable`,void 0),D(Bo,j),D(zo,Bo);var Vo={above:`above`,below:`below`},Ho=class extends zo{},Uo=class extends eo(Ho){constructor(){super(...arguments),this.proxy=document.createElement(`input`)}},Wo={inline:`inline`,list:`list`,both:`both`,none:`none`},Go=class extends Uo{constructor(){super(...arguments),this._value=``,this.filteredOptions=[],this.filter=``,this.forcedPosition=!1,this.listboxId=Pa(`listbox-`),this.maxHeight=0,this.open=!1}formResetCallback(){super.formResetCallback(),this.setDefaultSelectedOption(),this.updateValue()}validate(){super.validate(this.control)}get isAutocompleteInline(){return this.autocomplete===Wo.inline||this.isAutocompleteBoth}get isAutocompleteList(){return this.autocomplete===Wo.list||this.isAutocompleteBoth}get isAutocompleteBoth(){return this.autocomplete===Wo.both}openChanged(){if(this.open){this.ariaControls=this.listboxId,this.ariaExpanded=`true`,this.setPositioning(),this.focusAndScrollOptionIntoView(),m.queueUpdate(()=>this.focus());return}this.ariaControls=``,this.ariaExpanded=`false`}get options(){return h.track(this,`options`),this.filteredOptions.length?this.filteredOptions:this._options}set options(e){this._options=e,h.notify(this,`options`)}placeholderChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.placeholder=this.placeholder)}positionChanged(e,t){this.positionAttribute=t,this.setPositioning()}get value(){return h.track(this,`value`),this._value}set value(e){let t=`${this._value}`;if(this.$fastController.isConnected&&this.options){let t=this.options.findIndex(t=>t.text.toLowerCase()===e.toLowerCase()),n=this.options[this.selectedIndex]?.text,r=this.options[t]?.text;this.selectedIndex=n===r?this.selectedIndex:t,e=this.firstSelectedOption?.text||e}t!==e&&(this._value=e,super.valueChanged(t,e),h.notify(this,`value`))}clickHandler(e){let t=e.target.closest(`option,[role=option]`);if(!(this.disabled||t?.disabled)){if(this.open){if(e.composedPath()[0]===this.control)return;t&&(this.selectedOptions=[t],this.control.value=t.text,this.clearSelectionRange(),this.updateValue(!0))}return this.open=!this.open,this.open&&this.control.focus(),!0}}connectedCallback(){super.connectedCallback(),this.forcedPosition=!!this.positionAttribute,this.value&&(this.initialValue=this.value)}disabledChanged(e,t){super.disabledChanged&&super.disabledChanged(e,t),this.ariaDisabled=this.disabled?`true`:`false`}filterOptions(){(!this.autocomplete||this.autocomplete===Wo.none)&&(this.filter=``);let e=this.filter.toLowerCase();this.filteredOptions=this._options.filter(e=>e.text.toLowerCase().startsWith(this.filter.toLowerCase())),this.isAutocompleteList&&(!this.filteredOptions.length&&!e&&(this.filteredOptions=this._options),this._options.forEach(e=>{e.hidden=!this.filteredOptions.includes(e)}))}focusAndScrollOptionIntoView(){this.contains(document.activeElement)&&(this.control.focus(),this.firstSelectedOption&&requestAnimationFrame(()=>{var e;(e=this.firstSelectedOption)==null||e.scrollIntoView({block:`nearest`})}))}focusoutHandler(e){if(this.syncValue(),!this.open)return!0;let t=e.relatedTarget;if(this.isSameNode(t)){this.focus();return}(!this.options||!this.options.includes(t))&&(this.open=!1)}inputHandler(e){if(this.filter=this.control.value,this.filterOptions(),this.isAutocompleteInline||(this.selectedIndex=this.options.map(e=>e.text).indexOf(this.control.value)),e.inputType.includes(`deleteContent`)||!this.filter.length)return!0;this.isAutocompleteList&&!this.open&&(this.open=!0),this.isAutocompleteInline&&(this.filteredOptions.length?(this.selectedOptions=[this.filteredOptions[0]],this.selectedIndex=this.options.indexOf(this.firstSelectedOption),this.setInlineSelection()):this.selectedIndex=-1)}keydownHandler(e){let t=e.key;if(e.ctrlKey||e.shiftKey)return!0;switch(t){case`Enter`:this.syncValue(),this.isAutocompleteInline&&(this.filter=this.value),this.open=!1,this.clearSelectionRange();break;case`Escape`:if(this.isAutocompleteInline||(this.selectedIndex=-1),this.open){this.open=!1;break}this.value=``,this.control.value=``,this.filter=``,this.filterOptions();break;case`Tab`:if(this.setInputToSelection(),!this.open)return!0;e.preventDefault(),this.open=!1;break;case`ArrowUp`:case`ArrowDown`:if(this.filterOptions(),!this.open){this.open=!0;break}this.filteredOptions.length>0&&super.keydownHandler(e),this.isAutocompleteInline&&this.setInlineSelection();break;default:return!0}}keyupHandler(e){switch(e.key){case`ArrowLeft`:case`ArrowRight`:case`Backspace`:case`Delete`:case`Home`:case`End`:this.filter=this.control.value,this.selectedIndex=-1,this.filterOptions();break}}selectedIndexChanged(e,t){if(this.$fastController.isConnected){if(t=ja(-1,this.options.length-1,t),t!==this.selectedIndex){this.selectedIndex=t;return}super.selectedIndexChanged(e,t)}}selectPreviousOption(){!this.disabled&&this.selectedIndex>=0&&--this.selectedIndex}setDefaultSelectedOption(){if(this.$fastController.isConnected&&this.options){let e=this.options.findIndex(e=>e.getAttribute(`selected`)!==null||e.selected);this.selectedIndex=e,!this.dirtyValue&&this.firstSelectedOption&&(this.value=this.firstSelectedOption.text),this.setSelectedOptions()}}setInputToSelection(){this.firstSelectedOption&&(this.control.value=this.firstSelectedOption.text,this.control.focus())}setInlineSelection(){this.firstSelectedOption&&(this.setInputToSelection(),this.control.setSelectionRange(this.filter.length,this.control.value.length,`backward`))}syncValue(){let e=this.selectedIndex>-1?this.firstSelectedOption?.text:this.control.value;this.updateValue(this.value!==e)}setPositioning(){let e=this.getBoundingClientRect(),t=window.innerHeight-e.bottom;this.position=this.forcedPosition?this.positionAttribute:e.top>t?Vo.above:Vo.below,this.positionAttribute=this.forcedPosition?this.positionAttribute:this.position,this.maxHeight=this.position===Vo.above?~~e.top:~~t}selectedOptionsChanged(e,t){this.$fastController.isConnected&&this._options.forEach(e=>{e.selected=t.includes(e)})}slottedOptionsChanged(e,t){super.slottedOptionsChanged(e,t),this.updateValue()}updateValue(e){this.$fastController.isConnected&&(this.value=this.firstSelectedOption?.text||this.control.value,this.control.value=this.value),e&&this.$emit(`change`)}clearSelectionRange(){let e=this.control.value.length;this.control.setSelectionRange(e,e)}};w([y({attribute:`autocomplete`,mode:`fromView`})],Go.prototype,`autocomplete`,void 0),w([g],Go.prototype,`maxHeight`,void 0),w([y({attribute:`open`,mode:`boolean`})],Go.prototype,`open`,void 0),w([y],Go.prototype,`placeholder`,void 0),w([y({attribute:`position`})],Go.prototype,`positionAttribute`,void 0),w([g],Go.prototype,`position`,void 0);var Ko=class{};w([g],Ko.prototype,`ariaAutoComplete`,void 0),w([g],Ko.prototype,`ariaControls`,void 0),D(Ko,Bo),D(Go,fi,Ko);var qo=(e,t)=>_`
    <template
        aria-disabled="${e=>e.ariaDisabled}"
        autocomplete="${e=>e.autocomplete}"
        class="${e=>e.open?`open`:``} ${e=>e.disabled?`disabled`:``} ${e=>e.position}"
        ?open="${e=>e.open}"
        tabindex="${e=>e.disabled?null:`0`}"
        @click="${(e,t)=>e.clickHandler(t.event)}"
        @focusout="${(e,t)=>e.focusoutHandler(t.event)}"
        @keydown="${(e,t)=>e.keydownHandler(t.event)}"
    >
        <div class="control" part="control">
            ${mi(e,t)}
            <slot name="control">
                <input
                    aria-activedescendant="${e=>e.open?e.ariaActiveDescendant:null}"
                    aria-autocomplete="${e=>e.ariaAutoComplete}"
                    aria-controls="${e=>e.ariaControls}"
                    aria-disabled="${e=>e.ariaDisabled}"
                    aria-expanded="${e=>e.ariaExpanded}"
                    aria-haspopup="listbox"
                    class="selected-value"
                    part="selected-value"
                    placeholder="${e=>e.placeholder}"
                    role="combobox"
                    type="text"
                    ?disabled="${e=>e.disabled}"
                    :value="${e=>e.value}"
                    @input="${(e,t)=>e.inputHandler(t.event)}"
                    @keyup="${(e,t)=>e.keyupHandler(t.event)}"
                    ${x(`control`)}
                />
                <div class="indicator" part="indicator" aria-hidden="true">
                    <slot name="indicator">
                        ${t.indicator||``}
                    </slot>
                </div>
            </slot>
            ${pi(e,t)}
        </div>
        <div
            class="listbox"
            id="${e=>e.listboxId}"
            part="listbox"
            role="listbox"
            ?disabled="${e=>e.disabled}"
            ?hidden="${e=>!e.open}"
            ${x(`listbox`)}
        >
            <slot
                ${C({filter:zo.slottedOptionFilter,flatten:!0,property:`slottedOptions`})}
            ></slot>
        </div>
    </template>
`;function Jo(e){let t=e.parentElement;if(t)return t;{let t=e.getRootNode();if(t.host instanceof HTMLElement)return t.host}return null}function Yo(e,t){let n=t;for(;n!==null;){if(n===e)return!0;n=Jo(n)}return!1}var Xo=document.createElement(`div`);function Zo(e){return e instanceof Dr}var Qo=class{setProperty(e,t){m.queueUpdate(()=>this.target.setProperty(e,t))}removeProperty(e){m.queueUpdate(()=>this.target.removeProperty(e))}},$o=class extends Qo{constructor(e){super();let t=new CSSStyleSheet;t[sr]=!0,this.target=t.cssRules[t.insertRule(`:host{}`)].style,e.$fastController.addStyles(ir.create([t]))}},es=class extends Qo{constructor(){super();let e=new CSSStyleSheet;this.target=e.cssRules[e.insertRule(`:root{}`)].style,document.adoptedStyleSheets=[...document.adoptedStyleSheets,e]}},ts=class extends Qo{constructor(){super(),this.style=document.createElement(`style`),document.head.appendChild(this.style);let{sheet:e}=this.style;if(e){let t=e.insertRule(`:root{}`,e.cssRules.length);this.target=e.cssRules[t].style}}},ns=class{constructor(e){this.store=new Map,this.target=null;let t=e.$fastController;this.style=document.createElement(`style`),t.addStyles(this.style),h.getNotifier(t).subscribe(this,`isConnected`),this.handleChange(t,`isConnected`)}targetChanged(){if(this.target!==null)for(let[e,t]of this.store.entries())this.target.setProperty(e,t)}setProperty(e,t){this.store.set(e,t),m.queueUpdate(()=>{this.target!==null&&this.target.setProperty(e,t)})}removeProperty(e){this.store.delete(e),m.queueUpdate(()=>{this.target!==null&&this.target.removeProperty(e)})}handleChange(e,t){let{sheet:n}=this.style;if(n){let e=n.insertRule(`:host{}`,n.cssRules.length);this.target=n.cssRules[e].style}else this.target=null}};w([g],ns.prototype,`target`,void 0);var rs=class{constructor(e){this.target=e.style}setProperty(e,t){m.queueUpdate(()=>this.target.setProperty(e,t))}removeProperty(e){m.queueUpdate(()=>this.target.removeProperty(e))}},is=class e{setProperty(t,n){e.properties[t]=n;for(let r of e.roots.values())ss.getOrCreate(e.normalizeRoot(r)).setProperty(t,n)}removeProperty(t){delete e.properties[t];for(let n of e.roots.values())ss.getOrCreate(e.normalizeRoot(n)).removeProperty(t)}static registerRoot(t){let{roots:n}=e;if(!n.has(t)){n.add(t);let r=ss.getOrCreate(this.normalizeRoot(t));for(let t in e.properties)r.setProperty(t,e.properties[t])}}static unregisterRoot(t){let{roots:n}=e;if(n.has(t)){n.delete(t);let r=ss.getOrCreate(e.normalizeRoot(t));for(let t in e.properties)r.removeProperty(t)}}static normalizeRoot(e){return e===Xo?document:e}};is.roots=new Set,is.properties={};var as=new WeakMap,os=m.supportsAdoptedStyleSheets?$o:ns,ss=Object.freeze({getOrCreate(e){if(as.has(e))return as.get(e);let t;return t=e===Xo?new is:e instanceof Document?m.supportsAdoptedStyleSheets?new es:new ts:Zo(e)?new os(e):new rs(e),as.set(e,t),t}}),cs=class e extends Or{constructor(t){super(),this.subscribers=new WeakMap,this._appliedTo=new Set,this.name=t.name,t.cssCustomPropertyName!==null&&(this.cssCustomProperty=`--${t.cssCustomPropertyName}`,this.cssVar=`var(${this.cssCustomProperty})`),this.id=e.uniqueId(),e.tokensById.set(this.id,this)}get appliedTo(){return[...this._appliedTo]}static from(t){return new e({name:typeof t==`string`?t:t.name,cssCustomPropertyName:typeof t==`string`?t:t.cssCustomPropertyName===void 0?t.name:t.cssCustomPropertyName})}static isCSSDesignToken(e){return typeof e.cssCustomProperty==`string`}static isDerivedDesignTokenValue(e){return typeof e==`function`}static getTokenById(t){return e.tokensById.get(t)}getOrCreateSubscriberSet(e=this){return this.subscribers.get(e)||this.subscribers.set(e,new Set)&&this.subscribers.get(e)}createCSS(){return this.cssVar||``}getValueFor(e){let t=ms.getOrCreate(e).get(this);if(t!==void 0)return t;throw Error(`Value could not be retrieved for token named "${this.name}". Ensure the value is set for ${e} or an ancestor of ${e}.`)}setValueFor(t,n){return this._appliedTo.add(t),n instanceof e&&(n=this.alias(n)),ms.getOrCreate(t).set(this,n),this}deleteValueFor(e){return this._appliedTo.delete(e),ms.existsFor(e)&&ms.getOrCreate(e).delete(this),this}withDefault(e){return this.setValueFor(Xo,e),this}subscribe(e,t){let n=this.getOrCreateSubscriberSet(t);t&&!ms.existsFor(t)&&ms.getOrCreate(t),n.has(e)||n.add(e)}unsubscribe(e,t){let n=this.subscribers.get(t||this);n&&n.has(e)&&n.delete(e)}notify(e){let t=Object.freeze({token:this,target:e});this.subscribers.has(this)&&this.subscribers.get(this).forEach(e=>e.handleChange(t)),this.subscribers.has(e)&&this.subscribers.get(e).forEach(e=>e.handleChange(t))}alias(e){return(t=>e.getValueFor(t))}};cs.uniqueId=(()=>{let e=0;return()=>(e++,e.toString(16))})(),cs.tokensById=new Map;var ls=class{startReflection(e,t){e.subscribe(this,t),this.handleChange({token:e,target:t})}stopReflection(e,t){e.unsubscribe(this,t),this.remove(e,t)}handleChange(e){let{token:t,target:n}=e;this.add(t,n)}add(e,t){ss.getOrCreate(t).setProperty(e.cssCustomProperty,this.resolveCSSValue(ms.getOrCreate(t).get(e)))}remove(e,t){ss.getOrCreate(t).removeProperty(e.cssCustomProperty)}resolveCSSValue(e){return e&&typeof e.createCSS==`function`?e.createCSS():e}},us=class{constructor(e,t,n){this.source=e,this.token=t,this.node=n,this.dependencies=new Set,this.observer=h.binding(e,this,!1),this.observer.handleChange=this.observer.call,this.handleChange()}disconnect(){this.observer.disconnect()}handleChange(){try{this.node.store.set(this.token,this.observer.observe(this.node.target,An))}catch(e){console.error(e)}}},ds=class{constructor(){this.values=new Map}set(e,t){this.values.get(e)!==t&&(this.values.set(e,t),h.getNotifier(this).notify(e.id))}get(e){return h.track(this,e.id),this.values.get(e)}delete(e){this.values.delete(e),h.getNotifier(this).notify(e.id)}all(){return this.values.entries()}},fs=new WeakMap,ps=new WeakMap,ms=class e{constructor(e){this.target=e,this.store=new ds,this.children=[],this.assignedValues=new Map,this.reflecting=new Set,this.bindingObservers=new Map,this.tokenValueChangeHandler={handleChange:(e,t)=>{let n=cs.getTokenById(t);n&&(n.notify(this.target),this.updateCSSTokenReflection(e,n))}},fs.set(e,this),h.getNotifier(this.store).subscribe(this.tokenValueChangeHandler),e instanceof Dr?e.$fastController.addBehaviors([this]):e.isConnected&&this.bind()}static getOrCreate(t){return fs.get(t)||new e(t)}static existsFor(e){return fs.has(e)}static findParent(t){if(Xo!==t.target){let n=Jo(t.target);for(;n!==null;){if(fs.has(n))return fs.get(n);n=Jo(n)}return e.getOrCreate(Xo)}return null}static findClosestAssignedNode(t,n){let r=n;do{if(r.has(t))return r;r=r.parent?r.parent:r.target===Xo?null:e.getOrCreate(Xo)}while(r!==null);return null}get parent(){return ps.get(this)||null}updateCSSTokenReflection(e,t){if(cs.isCSSDesignToken(t)){let n=this.parent,r=this.isReflecting(t);if(n){let i=n.get(t),a=e.get(t);i!==a&&!r?this.reflectToCSS(t):i===a&&r&&this.stopReflectToCSS(t)}else r||this.reflectToCSS(t)}}has(e){return this.assignedValues.has(e)}get(e){let t=this.store.get(e);if(t!==void 0)return t;let n=this.getRaw(e);if(n!==void 0)return this.hydrate(e,n),this.get(e)}getRaw(t){return this.assignedValues.has(t)?this.assignedValues.get(t):e.findClosestAssignedNode(t,this)?.getRaw(t)}set(e,t){cs.isDerivedDesignTokenValue(this.assignedValues.get(e))&&this.tearDownBindingObserver(e),this.assignedValues.set(e,t),cs.isDerivedDesignTokenValue(t)?this.setupBindingObserver(e,t):this.store.set(e,t)}delete(e){this.assignedValues.delete(e),this.tearDownBindingObserver(e);let t=this.getRaw(e);t?this.hydrate(e,t):this.store.delete(e)}bind(){let t=e.findParent(this);t&&t.appendChild(this);for(let e of this.assignedValues.keys())e.notify(this.target)}unbind(){this.parent&&ps.get(this).removeChild(this);for(let e of this.bindingObservers.keys())this.tearDownBindingObserver(e)}appendChild(e){e.parent&&ps.get(e).removeChild(e);let t=this.children.filter(t=>e.contains(t));ps.set(e,this),this.children.push(e),t.forEach(t=>e.appendChild(t)),h.getNotifier(this.store).subscribe(e);for(let[t,n]of this.store.all())e.hydrate(t,this.bindingObservers.has(t)?this.getRaw(t):n),e.updateCSSTokenReflection(e.store,t)}removeChild(e){let t=this.children.indexOf(e);if(t!==-1&&this.children.splice(t,1),h.getNotifier(this.store).unsubscribe(e),e.parent!==this)return!1;let n=ps.delete(e);for(let[t]of this.store.all())e.hydrate(t,e.getRaw(t)),e.updateCSSTokenReflection(e.store,t);return n}contains(e){return Yo(this.target,e.target)}reflectToCSS(t){this.isReflecting(t)||(this.reflecting.add(t),e.cssCustomPropertyReflector.startReflection(t,this.target))}stopReflectToCSS(t){this.isReflecting(t)&&(this.reflecting.delete(t),e.cssCustomPropertyReflector.stopReflection(t,this.target))}isReflecting(e){return this.reflecting.has(e)}handleChange(e,t){let n=cs.getTokenById(t);n&&(this.hydrate(n,this.getRaw(n)),this.updateCSSTokenReflection(this.store,n))}hydrate(e,t){if(!this.has(e)){let n=this.bindingObservers.get(e);cs.isDerivedDesignTokenValue(t)?n?n.source!==t&&(this.tearDownBindingObserver(e),this.setupBindingObserver(e,t)):this.setupBindingObserver(e,t):(n&&this.tearDownBindingObserver(e),this.store.set(e,t))}}setupBindingObserver(e,t){let n=new us(t,e,this);return this.bindingObservers.set(e,n),n}tearDownBindingObserver(e){return this.bindingObservers.has(e)?(this.bindingObservers.get(e).disconnect(),this.bindingObservers.delete(e),!0):!1}};ms.cssCustomPropertyReflector=new ls,w([g],ms.prototype,`children`,void 0);function hs(e){return cs.from(e)}var N=Object.freeze({create:hs,notifyConnection(e){return!e.isConnected||!ms.existsFor(e)?!1:(ms.getOrCreate(e).bind(),!0)},notifyDisconnection(e){return e.isConnected||!ms.existsFor(e)?!1:(ms.getOrCreate(e).unbind(),!0)},registerRoot(e=Xo){is.registerRoot(e)},unregisterRoot(e=Xo){is.unregisterRoot(e)}}),gs=Object.freeze({definitionCallbackOnly:null,ignoreDuplicate:Symbol()}),_s=new Map,vs=new Map,ys=null,bs=T.createInterface(e=>e.cachedCallback(e=>(ys===null&&(ys=new Cs(null,e)),ys))),xs=Object.freeze({tagFor(e){return vs.get(e)},responsibleFor(e){return e.$$designSystem$$||T.findResponsibleContainer(e).get(bs)},getOrCreate(e){if(!e)return ys===null&&(ys=T.getOrCreateDOMContainer().get(bs)),ys;let t=e.$$designSystem$$;if(t)return t;let n=T.getOrCreateDOMContainer(e);if(n.has(bs,!1))return n.get(bs);{let t=new Cs(e,n);return n.register(Wi.instance(bs,t)),t}}});function Ss(e,t,n){return typeof e==`string`?{name:e,type:t,callback:n}:e}var Cs=class{constructor(e,t){this.owner=e,this.container=t,this.designTokensInitialized=!1,this.prefix=`fast`,this.shadowRootMode=void 0,this.disambiguate=()=>gs.definitionCallbackOnly,e!==null&&(e.$$designSystem$$=this)}withPrefix(e){return this.prefix=e,this}withShadowRootMode(e){return this.shadowRootMode=e,this}withElementDisambiguation(e){return this.disambiguate=e,this}withDesignTokenRoot(e){return this.designTokenRoot=e,this}register(...e){let t=this.container,n=[],r=this.disambiguate,i=this.shadowRootMode,a={elementPrefix:this.prefix,tryDefineElement(e,a,o){let s=Ss(e,a,o),{name:c,callback:l,baseClass:u}=s,{type:d}=s,f=c,ee=_s.get(f),te=!0;for(;ee;){let e=r(f,d,ee);switch(e){case gs.ignoreDuplicate:return;case gs.definitionCallbackOnly:te=!1,ee=void 0;break;default:f=e,ee=_s.get(f);break}}te&&((vs.has(d)||d===E)&&(d=class extends d{}),_s.set(f,d),vs.set(d,f),u&&vs.set(u,f)),n.push(new ws(t,f,d,i,l,te))}};this.designTokensInitialized||(this.designTokensInitialized=!0,this.designTokenRoot!==null&&N.registerRoot(this.designTokenRoot)),t.registerWithContext(a,...e);for(let e of n)e.callback(e),e.willDefine&&e.definition!==null&&e.definition.define();return this}},ws=class{constructor(e,t,n,r,i,a){this.container=e,this.name=t,this.type=n,this.shadowRootMode=r,this.callback=i,this.willDefine=a,this.definition=null}definePresentation(e){ea.define(this.name,e,this.container)}defineElement(e){this.definition=new xr(this.type,Object.assign(Object.assign({},e),{name:this.name}))}tagFor(e){return xs.tagFor(e)}},Ts=(e,t)=>_`
    <div class="positioning-region" part="positioning-region">
        ${S(e=>e.modal,_`
                <div
                    class="overlay"
                    part="overlay"
                    role="presentation"
                    @click="${e=>e.dismiss()}"
                ></div>
            `)}
        <div
            role="dialog"
            tabindex="-1"
            class="control"
            part="control"
            aria-modal="${e=>e.modal}"
            aria-describedby="${e=>e.ariaDescribedby}"
            aria-labelledby="${e=>e.ariaLabelledby}"
            aria-label="${e=>e.ariaLabel}"
            ${x(`dialog`)}
        >
            <slot></slot>
        </div>
    </div>
`,Es=[`input`,`select`,`textarea`,`a[href]`,`button`,`[tabindex]:not(slot)`,`audio[controls]`,`video[controls]`,`[contenteditable]:not([contenteditable="false"])`,`details>summary:first-of-type`,`details`],Ds=Es.join(`,`),Os=typeof Element>`u`,ks=Os?function(){}:Element.prototype.matches||Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector,As=!Os&&Element.prototype.getRootNode?function(e){return e.getRootNode()}:function(e){return e.ownerDocument},js=function(e,t){return e.tabIndex<0&&(t||/^(AUDIO|VIDEO|DETAILS)$/.test(e.tagName)||e.isContentEditable)&&isNaN(parseInt(e.getAttribute(`tabindex`),10))?0:e.tabIndex},Ms=function(e){return e.tagName===`INPUT`},Ns=function(e){return Ms(e)&&e.type===`hidden`},Ps=function(e){return e.tagName===`DETAILS`&&Array.prototype.slice.apply(e.children).some(function(e){return e.tagName===`SUMMARY`})},Fs=function(e,t){for(var n=0;n<e.length;n++)if(e[n].checked&&e[n].form===t)return e[n]},Is=function(e){if(!e.name)return!0;var t=e.form||As(e),n=function(e){return t.querySelectorAll(`input[type="radio"][name="`+e+`"]`)},r;if(typeof window<`u`&&window.CSS!==void 0&&typeof window.CSS.escape==`function`)r=n(window.CSS.escape(e.name));else try{r=n(e.name)}catch(e){return console.error(`Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s`,e.message),!1}var i=Fs(r,e.form);return!i||i===e},Ls=function(e){return Ms(e)&&e.type===`radio`},Rs=function(e){return Ls(e)&&!Is(e)},zs=function(e){var t=e.getBoundingClientRect(),n=t.width,r=t.height;return n===0&&r===0},Bs=function(e,t){var n=t.displayCheck,r=t.getShadowRoot;if(getComputedStyle(e).visibility===`hidden`)return!0;var i=ks.call(e,`details>summary:first-of-type`)?e.parentElement:e;if(ks.call(i,`details:not([open]) *`))return!0;var a=As(e).host,o=a?.ownerDocument.contains(a)||e.ownerDocument.contains(e);if(!n||n===`full`){if(typeof r==`function`){for(var s=e;e;){var c=e.parentElement,l=As(e);if(c&&!c.shadowRoot&&r(c)===!0)return zs(e);e=e.assignedSlot?e.assignedSlot:!c&&l!==e.ownerDocument?l.host:c}e=s}if(o)return!e.getClientRects().length}else if(n===`non-zero-area`)return zs(e);return!1},Vs=function(e){if(/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(e.tagName))for(var t=e.parentElement;t;){if(t.tagName===`FIELDSET`&&t.disabled){for(var n=0;n<t.children.length;n++){var r=t.children.item(n);if(r.tagName===`LEGEND`)return ks.call(t,`fieldset[disabled] *`)?!0:!r.contains(e)}return!0}t=t.parentElement}return!1},Hs=function(e,t){return!(t.disabled||Ns(t)||Bs(t,e)||Ps(t)||Vs(t))},Us=function(e,t){return!(Rs(t)||js(t)<0||!Hs(e,t))},Ws=function(e,t){if(t||={},!e)throw Error(`No node provided`);return ks.call(e,Ds)===!1?!1:Us(t,e)},Gs=Es.concat(`iframe`).join(`,`),Ks=function(e,t){if(t||={},!e)throw Error(`No node provided`);return ks.call(e,Gs)===!1?!1:Hs(t,e)},qs=class e extends E{constructor(){super(...arguments),this.modal=!0,this.hidden=!1,this.trapFocus=!0,this.trapFocusChanged=()=>{this.$fastController.isConnected&&this.updateTrapFocus()},this.isTrappingFocus=!1,this.handleDocumentKeydown=e=>{if(!e.defaultPrevented&&!this.hidden)switch(e.key){case Ta:this.dismiss(),e.preventDefault();break;case`Tab`:this.handleTabKeyDown(e);break}},this.handleDocumentFocus=e=>{!e.defaultPrevented&&this.shouldForceFocus(e.target)&&(this.focusFirstElement(),e.preventDefault())},this.handleTabKeyDown=e=>{if(!this.trapFocus||this.hidden)return;let t=this.getTabQueueBounds();if(t.length!==0){if(t.length===1){t[0].focus(),e.preventDefault();return}e.shiftKey&&e.target===t[0]?(t[t.length-1].focus(),e.preventDefault()):!e.shiftKey&&e.target===t[t.length-1]&&(t[0].focus(),e.preventDefault())}},this.getTabQueueBounds=()=>e.reduceTabbableItems([],this),this.focusFirstElement=()=>{let e=this.getTabQueueBounds();e.length>0?e[0].focus():this.dialog instanceof HTMLElement&&this.dialog.focus()},this.shouldForceFocus=e=>this.isTrappingFocus&&!this.contains(e),this.shouldTrapFocus=()=>this.trapFocus&&!this.hidden,this.updateTrapFocus=e=>{let t=e===void 0?this.shouldTrapFocus():e;t&&!this.isTrappingFocus?(this.isTrappingFocus=!0,document.addEventListener(`focusin`,this.handleDocumentFocus),m.queueUpdate(()=>{this.shouldForceFocus(document.activeElement)&&this.focusFirstElement()})):!t&&this.isTrappingFocus&&(this.isTrappingFocus=!1,document.removeEventListener(`focusin`,this.handleDocumentFocus))}}dismiss(){this.$emit(`dismiss`),this.$emit(`cancel`)}show(){this.hidden=!1}hide(){this.hidden=!0,this.$emit(`close`)}connectedCallback(){super.connectedCallback(),document.addEventListener(`keydown`,this.handleDocumentKeydown),this.notifier=h.getNotifier(this),this.notifier.subscribe(this,`hidden`),this.updateTrapFocus()}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener(`keydown`,this.handleDocumentKeydown),this.updateTrapFocus(!1),this.notifier.unsubscribe(this,`hidden`)}handleChange(e,t){switch(t){case`hidden`:this.updateTrapFocus();break;default:break}}static reduceTabbableItems(t,n){return n.getAttribute(`tabindex`)===`-1`?t:Ws(n)||e.isFocusableFastElement(n)&&e.hasTabbableShadow(n)?(t.push(n),t):n.childElementCount?t.concat(Array.from(n.children).reduce(e.reduceTabbableItems,[])):t}static isFocusableFastElement(e){return!!e.$fastController?.definition.shadowOptions?.delegatesFocus}static hasTabbableShadow(e){return Array.from(e.shadowRoot?.querySelectorAll(`*`)??[]).some(e=>Ws(e))}};w([y({mode:`boolean`})],qs.prototype,`modal`,void 0),w([y({mode:`boolean`})],qs.prototype,`hidden`,void 0),w([y({attribute:`trap-focus`,mode:`boolean`})],qs.prototype,`trapFocus`,void 0),w([y({attribute:`aria-describedby`})],qs.prototype,`ariaDescribedby`,void 0),w([y({attribute:`aria-labelledby`})],qs.prototype,`ariaLabelledby`,void 0),w([y({attribute:`aria-label`})],qs.prototype,`ariaLabel`,void 0);var Js=(e,t)=>_`
    <template role="${e=>e.role}" aria-orientation="${e=>e.orientation}"></template>
`,Ys={separator:`separator`,presentation:`presentation`},Xs=class extends E{constructor(){super(...arguments),this.role=Ys.separator,this.orientation=O.horizontal}};w([y],Xs.prototype,`role`,void 0),w([y],Xs.prototype,`orientation`,void 0);var Zs={next:`next`,previous:`previous`},Qs=(e,t)=>_`
    <template
        role="button"
        aria-disabled="${e=>e.disabled?!0:void 0}"
        tabindex="${e=>e.hiddenFromAT?-1:0}"
        class="${e=>e.direction} ${e=>e.disabled?`disabled`:``}"
        @keyup="${(e,t)=>e.keyupHandler(t.event)}"
    >
        ${S(e=>e.direction===Zs.next,_`
                <span part="next" class="next">
                    <slot name="next">
                        ${t.next||``}
                    </slot>
                </span>
            `)}
        ${S(e=>e.direction===Zs.previous,_`
                <span part="previous" class="previous">
                    <slot name="previous">
                        ${t.previous||``}
                    </slot>
                </span>
            `)}
    </template>
`,$s=class extends E{constructor(){super(...arguments),this.hiddenFromAT=!0,this.direction=Zs.next}keyupHandler(e){if(!this.hiddenFromAT){let t=e.key;(t===`Enter`||t===`Space`)&&this.$emit(`click`,e),t===`Escape`&&this.blur()}}};w([y({mode:`boolean`})],$s.prototype,`disabled`,void 0),w([y({attribute:`aria-hidden`,converter:gr})],$s.prototype,`hiddenFromAT`,void 0),w([y],$s.prototype,`direction`,void 0);var ec=(e,t)=>_`
    <template
        aria-checked="${e=>e.ariaChecked}"
        aria-disabled="${e=>e.ariaDisabled}"
        aria-posinset="${e=>e.ariaPosInSet}"
        aria-selected="${e=>e.ariaSelected}"
        aria-setsize="${e=>e.ariaSetSize}"
        class="${e=>[e.checked&&`checked`,e.selected&&`selected`,e.disabled&&`disabled`].filter(Boolean).join(` `)}"
        role="option"
    >
        ${mi(e,t)}
        <span class="content" part="content">
            <slot ${C(`content`)}></slot>
        </span>
        ${pi(e,t)}
    </template>
`,tc=class extends zo{constructor(){super(...arguments),this.activeIndex=-1,this.rangeStartIndex=-1}get activeOption(){return this.options[this.activeIndex]}get checkedOptions(){return this.options?.filter(e=>e.checked)}get firstSelectedOptionIndex(){return this.options.indexOf(this.firstSelectedOption)}activeIndexChanged(e,t){this.ariaActiveDescendant=this.options[t]?.id??``,this.focusAndScrollOptionIntoView()}checkActiveIndex(){if(!this.multiple)return;let e=this.activeOption;e&&(e.checked=!0)}checkFirstOption(e=!1){e?(this.rangeStartIndex===-1&&(this.rangeStartIndex=this.activeIndex+1),this.options.forEach((e,t)=>{e.checked=Ma(t,this.rangeStartIndex)})):this.uncheckAllOptions(),this.activeIndex=0,this.checkActiveIndex()}checkLastOption(e=!1){e?(this.rangeStartIndex===-1&&(this.rangeStartIndex=this.activeIndex),this.options.forEach((e,t)=>{e.checked=Ma(t,this.rangeStartIndex,this.options.length)})):this.uncheckAllOptions(),this.activeIndex=this.options.length-1,this.checkActiveIndex()}connectedCallback(){super.connectedCallback(),this.addEventListener(`focusout`,this.focusoutHandler)}disconnectedCallback(){this.removeEventListener(`focusout`,this.focusoutHandler),super.disconnectedCallback()}checkNextOption(e=!1){e?(this.rangeStartIndex===-1&&(this.rangeStartIndex=this.activeIndex),this.options.forEach((e,t)=>{e.checked=Ma(t,this.rangeStartIndex,this.activeIndex+1)})):this.uncheckAllOptions(),this.activeIndex+=+(this.activeIndex<this.options.length-1),this.checkActiveIndex()}checkPreviousOption(e=!1){e?(this.rangeStartIndex===-1&&(this.rangeStartIndex=this.activeIndex),this.checkedOptions.length===1&&(this.rangeStartIndex+=1),this.options.forEach((e,t)=>{e.checked=Ma(t,this.activeIndex,this.rangeStartIndex)})):this.uncheckAllOptions(),this.activeIndex-=+(this.activeIndex>0),this.checkActiveIndex()}clickHandler(e){if(!this.multiple)return super.clickHandler(e);let t=e.target?.closest(`[role=option]`);if(!(!t||t.disabled))return this.uncheckAllOptions(),this.activeIndex=this.options.indexOf(t),this.checkActiveIndex(),this.toggleSelectedForAllCheckedOptions(),!0}focusAndScrollOptionIntoView(){super.focusAndScrollOptionIntoView(this.activeOption)}focusinHandler(e){if(!this.multiple)return super.focusinHandler(e);!this.shouldSkipFocus&&e.target===e.currentTarget&&(this.uncheckAllOptions(),this.activeIndex===-1&&(this.activeIndex=this.firstSelectedOptionIndex===-1?0:this.firstSelectedOptionIndex),this.checkActiveIndex(),this.setSelectedOptions(),this.focusAndScrollOptionIntoView()),this.shouldSkipFocus=!1}focusoutHandler(e){this.multiple&&this.uncheckAllOptions()}keydownHandler(e){if(!this.multiple)return super.keydownHandler(e);if(this.disabled)return!0;let{key:t,shiftKey:n}=e;switch(this.shouldSkipFocus=!1,t){case Ea:this.checkFirstOption(n);return;case ba:this.checkNextOption(n);return;case Ca:this.checkPreviousOption(n);return;case`End`:this.checkLastOption(n);return;case`Tab`:return this.focusAndScrollOptionIntoView(),!0;case Ta:return this.uncheckAllOptions(),this.checkActiveIndex(),!0;case` `:if(e.preventDefault(),this.typeAheadExpired){this.toggleSelectedForAllCheckedOptions();return}default:return t.length===1&&this.handleTypeAhead(`${t}`),!0}}mousedownHandler(e){if(e.offsetX>=0&&e.offsetX<=this.scrollWidth)return super.mousedownHandler(e)}multipleChanged(e,t){var n;this.ariaMultiSelectable=t?`true`:null,(n=this.options)==null||n.forEach(e=>{e.checked=t?!1:void 0}),this.setSelectedOptions()}setSelectedOptions(){if(!this.multiple){super.setSelectedOptions();return}this.$fastController.isConnected&&this.options&&(this.selectedOptions=this.options.filter(e=>e.selected),this.focusAndScrollOptionIntoView())}sizeChanged(e,t){let n=Math.max(0,parseInt(t?.toFixed()??``,10));n!==t&&m.queueUpdate(()=>{this.size=n})}toggleSelectedForAllCheckedOptions(){let e=this.checkedOptions.filter(e=>!e.disabled),t=!e.every(e=>e.selected);e.forEach(e=>e.selected=t),this.selectedIndex=this.options.indexOf(e[e.length-1]),this.setSelectedOptions()}typeaheadBufferChanged(e,t){if(!this.multiple){super.typeaheadBufferChanged(e,t);return}if(this.$fastController.isConnected){let e=this.getTypeaheadMatches(),t=this.options.indexOf(e[0]);t>-1&&(this.activeIndex=t,this.uncheckAllOptions(),this.checkActiveIndex()),this.typeAheadExpired=!1}}uncheckAllOptions(e=!1){this.options.forEach(e=>e.checked=this.multiple?!1:void 0),e||(this.rangeStartIndex=-1)}};w([g],tc.prototype,`activeIndex`,void 0),w([y({mode:`boolean`})],tc.prototype,`multiple`,void 0),w([y({converter:v})],tc.prototype,`size`,void 0);var nc=(e,t)=>_`
    <template
        aria-activedescendant="${e=>e.ariaActiveDescendant}"
        aria-multiselectable="${e=>e.ariaMultiSelectable}"
        class="listbox"
        role="listbox"
        tabindex="${e=>e.disabled?null:`0`}"
        @click="${(e,t)=>e.clickHandler(t.event)}"
        @focusin="${(e,t)=>e.focusinHandler(t.event)}"
        @keydown="${(e,t)=>e.keydownHandler(t.event)}"
        @mousedown="${(e,t)=>e.mousedownHandler(t.event)}"
    >
        <slot
            ${C({filter:tc.slottedOptionFilter,flatten:!0,property:`slottedOptions`})}
        ></slot>
    </template>
`,rc={menuitem:`menuitem`,menuitemcheckbox:`menuitemcheckbox`,menuitemradio:`menuitemradio`},ic={[rc.menuitem]:`menuitem`,[rc.menuitemcheckbox]:`menuitemcheckbox`,[rc.menuitemradio]:`menuitemradio`},ac=class extends E{constructor(){super(...arguments),this.role=rc.menuitem,this.hasSubmenu=!1,this.currentDirection=k.ltr,this.focusSubmenuOnLoad=!1,this.handleMenuItemKeyDown=e=>{if(e.defaultPrevented)return!1;switch(e.key){case wa:case` `:return this.invoke(),!1;case Sa:return this.expandAndFocus(),!1;case xa:if(this.expanded)return this.expanded=!1,this.focus(),!1}return!0},this.handleMenuItemClick=e=>(e.defaultPrevented||this.disabled||this.invoke(),!1),this.submenuLoaded=()=>{this.focusSubmenuOnLoad&&(this.focusSubmenuOnLoad=!1,this.hasSubmenu&&(this.submenu.focus(),this.setAttribute(`tabindex`,`-1`)))},this.handleMouseOver=e=>(this.disabled||!this.hasSubmenu||this.expanded||(this.expanded=!0),!1),this.handleMouseOut=e=>(!this.expanded||this.contains(document.activeElement)||(this.expanded=!1),!1),this.expandAndFocus=()=>{this.hasSubmenu&&(this.focusSubmenuOnLoad=!0,this.expanded=!0)},this.invoke=()=>{if(!this.disabled)switch(this.role){case rc.menuitemcheckbox:this.checked=!this.checked;break;case rc.menuitem:this.updateSubmenu(),this.hasSubmenu?this.expandAndFocus():this.$emit(`change`);break;case rc.menuitemradio:this.checked||=!0;break}},this.updateSubmenu=()=>{this.submenu=this.domChildren().find(e=>e.getAttribute(`role`)===`menu`),this.hasSubmenu=this.submenu!==void 0}}expandedChanged(e){if(this.$fastController.isConnected){if(this.submenu===void 0)return;this.expanded===!1?this.submenu.collapseExpandedItem():this.currentDirection=Va(this),this.$emit(`expanded-change`,this,{bubbles:!1})}}checkedChanged(e,t){this.$fastController.isConnected&&this.$emit(`change`)}connectedCallback(){super.connectedCallback(),m.queueUpdate(()=>{this.updateSubmenu()}),this.startColumnCount||=1,this.observer=new MutationObserver(this.updateSubmenu)}disconnectedCallback(){super.disconnectedCallback(),this.submenu=void 0,this.observer!==void 0&&(this.observer.disconnect(),this.observer=void 0)}domChildren(){return Array.from(this.children).filter(e=>!e.hasAttribute(`hidden`))}};w([y({mode:`boolean`})],ac.prototype,`disabled`,void 0),w([y({mode:`boolean`})],ac.prototype,`expanded`,void 0),w([g],ac.prototype,`startColumnCount`,void 0),w([y],ac.prototype,`role`,void 0),w([y({mode:`boolean`})],ac.prototype,`checked`,void 0),w([g],ac.prototype,`submenuRegion`,void 0),w([g],ac.prototype,`hasSubmenu`,void 0),w([g],ac.prototype,`currentDirection`,void 0),w([g],ac.prototype,`submenu`,void 0),D(ac,fi);var oc=(e,t)=>_`
    <template
        role="${e=>e.role}"
        aria-haspopup="${e=>e.hasSubmenu?`menu`:void 0}"
        aria-checked="${e=>e.role===rc.menuitem?void 0:e.checked}"
        aria-disabled="${e=>e.disabled}"
        aria-expanded="${e=>e.expanded}"
        @keydown="${(e,t)=>e.handleMenuItemKeyDown(t.event)}"
        @click="${(e,t)=>e.handleMenuItemClick(t.event)}"
        @mouseover="${(e,t)=>e.handleMouseOver(t.event)}"
        @mouseout="${(e,t)=>e.handleMouseOut(t.event)}"
        class="${e=>e.disabled?`disabled`:``} ${e=>e.expanded?`expanded`:``} ${e=>`indent-${e.startColumnCount}`}"
    >
            ${S(e=>e.role===rc.menuitemcheckbox,_`
                    <div part="input-container" class="input-container">
                        <span part="checkbox" class="checkbox">
                            <slot name="checkbox-indicator">
                                ${t.checkboxIndicator||``}
                            </slot>
                        </span>
                    </div>
                `)}
            ${S(e=>e.role===rc.menuitemradio,_`
                    <div part="input-container" class="input-container">
                        <span part="radio" class="radio">
                            <slot name="radio-indicator">
                                ${t.radioIndicator||``}
                            </slot>
                        </span>
                    </div>
                `)}
        </div>
        ${mi(e,t)}
        <span class="content" part="content">
            <slot></slot>
        </span>
        ${pi(e,t)}
        ${S(e=>e.hasSubmenu,_`
                <div
                    part="expand-collapse-glyph-container"
                    class="expand-collapse-glyph-container"
                >
                    <span part="expand-collapse" class="expand-collapse">
                        <slot name="expand-collapse-indicator">
                            ${t.expandCollapseGlyph||``}
                        </slot>
                    </span>
                </div>
            `)}
        ${S(e=>e.expanded,_`
                <${e.tagFor(M)}
                    :anchorElement="${e=>e}"
                    vertical-positioning-mode="dynamic"
                    vertical-default-position="bottom"
                    vertical-inset="true"
                    horizontal-positioning-mode="dynamic"
                    horizontal-default-position="end"
                    class="submenu-region"
                    dir="${e=>e.currentDirection}"
                    @loaded="${e=>e.submenuLoaded()}"
                    ${x(`submenuRegion`)}
                    part="submenu-region"
                >
                    <slot name="submenu"></slot>
                </${e.tagFor(M)}>
            `)}
    </template>
`,sc=(e,t)=>_`
    <template
        slot="${e=>e.slot?e.slot:e.isNestedMenu()?`submenu`:void 0}"
        role="menu"
        @keydown="${(e,t)=>e.handleMenuKeyDown(t.event)}"
        @focusout="${(e,t)=>e.handleFocusOut(t.event)}"
    >
        <slot ${C(`items`)}></slot>
    </template>
`,cc=class e extends E{constructor(){super(...arguments),this.expandedItem=null,this.focusIndex=-1,this.isNestedMenu=()=>this.parentElement!==null&&ca(this.parentElement)&&this.parentElement.getAttribute(`role`)===`menuitem`,this.handleFocusOut=e=>{if(!this.contains(e.relatedTarget)&&this.menuItems!==void 0){this.collapseExpandedItem();let e=this.menuItems.findIndex(this.isFocusableElement);this.menuItems[this.focusIndex].setAttribute(`tabindex`,`-1`),this.menuItems[e].setAttribute(`tabindex`,`0`),this.focusIndex=e}},this.handleItemFocus=e=>{let t=e.target;this.menuItems!==void 0&&t!==this.menuItems[this.focusIndex]&&(this.menuItems[this.focusIndex].setAttribute(`tabindex`,`-1`),this.focusIndex=this.menuItems.indexOf(t),t.setAttribute(`tabindex`,`0`))},this.handleExpandedChanged=e=>{if(e.defaultPrevented||e.target===null||this.menuItems===void 0||this.menuItems.indexOf(e.target)<0)return;e.preventDefault();let t=e.target;if(this.expandedItem!==null&&t===this.expandedItem&&t.expanded===!1){this.expandedItem=null;return}t.expanded&&(this.expandedItem!==null&&this.expandedItem!==t&&(this.expandedItem.expanded=!1),this.menuItems[this.focusIndex].setAttribute(`tabindex`,`-1`),this.expandedItem=t,this.focusIndex=this.menuItems.indexOf(t),t.setAttribute(`tabindex`,`0`))},this.removeItemListeners=()=>{this.menuItems!==void 0&&this.menuItems.forEach(e=>{e.removeEventListener(`expanded-change`,this.handleExpandedChanged),e.removeEventListener(`focus`,this.handleItemFocus)})},this.setItems=()=>{let e=this.domChildren();this.removeItemListeners(),this.menuItems=e;let t=this.menuItems.filter(this.isMenuItemElement);t.length&&(this.focusIndex=0);function n(e){let t=e.getAttribute(`role`),n=e.querySelector(`[slot=start]`);return t!==rc.menuitem&&n===null||t===rc.menuitem&&n!==null?1:t!==rc.menuitem&&n!==null?2:0}let r=t.reduce((e,t)=>{let r=n(t);return e>r?e:r},0);t.forEach((e,t)=>{e.setAttribute(`tabindex`,t===0?`0`:`-1`),e.addEventListener(`expanded-change`,this.handleExpandedChanged),e.addEventListener(`focus`,this.handleItemFocus),(e instanceof ac||`startColumnCount`in e)&&(e.startColumnCount=r)})},this.changeHandler=e=>{if(this.menuItems===void 0)return;let t=e.target,n=this.menuItems.indexOf(t);if(n!==-1&&t.role===`menuitemradio`&&t.checked===!0){for(let e=n-1;e>=0;--e){let t=this.menuItems[e],n=t.getAttribute(`role`);if(n===rc.menuitemradio&&(t.checked=!1),n===`separator`)break}let e=this.menuItems.length-1;for(let t=n+1;t<=e;++t){let e=this.menuItems[t],n=e.getAttribute(`role`);if(n===rc.menuitemradio&&(e.checked=!1),n===`separator`)break}}},this.isMenuItemElement=t=>ca(t)&&e.focusableElementRoles.hasOwnProperty(t.getAttribute(`role`)),this.isFocusableElement=e=>this.isMenuItemElement(e)}itemsChanged(e,t){this.$fastController.isConnected&&this.menuItems!==void 0&&this.setItems()}connectedCallback(){super.connectedCallback(),m.queueUpdate(()=>{this.setItems()}),this.addEventListener(`change`,this.changeHandler)}disconnectedCallback(){super.disconnectedCallback(),this.removeItemListeners(),this.menuItems=void 0,this.removeEventListener(`change`,this.changeHandler)}focus(){this.setFocus(0,1)}collapseExpandedItem(){this.expandedItem!==null&&(this.expandedItem.expanded=!1,this.expandedItem=null)}handleMenuKeyDown(e){if(!(e.defaultPrevented||this.menuItems===void 0))switch(e.key){case ba:this.setFocus(this.focusIndex+1,1);return;case Ca:this.setFocus(this.focusIndex-1,-1);return;case`End`:this.setFocus(this.menuItems.length-1,-1);return;case Ea:this.setFocus(0,1);return;default:return!0}}domChildren(){return Array.from(this.children).filter(e=>!e.hasAttribute(`hidden`))}setFocus(e,t){if(this.menuItems!==void 0)for(;e>=0&&e<this.menuItems.length;){let n=this.menuItems[e];if(this.isFocusableElement(n)){this.focusIndex>-1&&this.menuItems.length>=this.focusIndex-1&&this.menuItems[this.focusIndex].setAttribute(`tabindex`,`-1`),this.focusIndex=e,n.setAttribute(`tabindex`,`0`),n.focus();break}e+=t}}};cc.focusableElementRoles=ic,w([g],cc.prototype,`items`,void 0);var lc=(e,t)=>_`
    <template class="${e=>e.readOnly?`readonly`:``}">
        <label
            part="label"
            for="control"
            class="${e=>e.defaultSlottedNodes&&e.defaultSlottedNodes.length?`label`:`label label__hidden`}"
        >
            <slot ${C(`defaultSlottedNodes`)}></slot>
        </label>
        <div class="root" part="root">
            ${mi(e,t)}
            <input
                class="control"
                part="control"
                id="control"
                @input="${e=>e.handleTextInput()}"
                @change="${e=>e.handleChange()}"
                @keydown="${(e,t)=>e.handleKeyDown(t.event)}"
                @blur="${(e,t)=>e.handleBlur()}"
                ?autofocus="${e=>e.autofocus}"
                ?disabled="${e=>e.disabled}"
                list="${e=>e.list}"
                maxlength="${e=>e.maxlength}"
                minlength="${e=>e.minlength}"
                placeholder="${e=>e.placeholder}"
                ?readonly="${e=>e.readOnly}"
                ?required="${e=>e.required}"
                size="${e=>e.size}"
                type="text"
                inputmode="numeric"
                min="${e=>e.min}"
                max="${e=>e.max}"
                step="${e=>e.step}"
                aria-atomic="${e=>e.ariaAtomic}"
                aria-busy="${e=>e.ariaBusy}"
                aria-controls="${e=>e.ariaControls}"
                aria-current="${e=>e.ariaCurrent}"
                aria-describedby="${e=>e.ariaDescribedby}"
                aria-details="${e=>e.ariaDetails}"
                aria-disabled="${e=>e.ariaDisabled}"
                aria-errormessage="${e=>e.ariaErrormessage}"
                aria-flowto="${e=>e.ariaFlowto}"
                aria-haspopup="${e=>e.ariaHaspopup}"
                aria-hidden="${e=>e.ariaHidden}"
                aria-invalid="${e=>e.ariaInvalid}"
                aria-keyshortcuts="${e=>e.ariaKeyshortcuts}"
                aria-label="${e=>e.ariaLabel}"
                aria-labelledby="${e=>e.ariaLabelledby}"
                aria-live="${e=>e.ariaLive}"
                aria-owns="${e=>e.ariaOwns}"
                aria-relevant="${e=>e.ariaRelevant}"
                aria-roledescription="${e=>e.ariaRoledescription}"
                ${x(`control`)}
            />
            ${S(e=>!e.hideStep&&!e.readOnly&&!e.disabled,_`
                    <div class="controls" part="controls">
                        <div class="step-up" part="step-up" @click="${e=>e.stepUp()}">
                            <slot name="step-up-glyph">
                                ${t.stepUpGlyph||``}
                            </slot>
                        </div>
                        <div
                            class="step-down"
                            part="step-down"
                            @click="${e=>e.stepDown()}"
                        >
                            <slot name="step-down-glyph">
                                ${t.stepDownGlyph||``}
                            </slot>
                        </div>
                    </div>
                `)}
            ${pi(e,t)}
        </div>
    </template>
`,uc=class extends E{},dc=class extends eo(uc){constructor(){super(...arguments),this.proxy=document.createElement(`input`)}},fc={email:`email`,password:`password`,tel:`tel`,text:`text`,url:`url`},pc=class extends dc{constructor(){super(...arguments),this.type=fc.text}readOnlyChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.readOnly=this.readOnly,this.validate())}autofocusChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.autofocus=this.autofocus,this.validate())}placeholderChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.placeholder=this.placeholder)}typeChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.type=this.type,this.validate())}listChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.setAttribute(`list`,this.list),this.validate())}maxlengthChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.maxLength=this.maxlength,this.validate())}minlengthChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.minLength=this.minlength,this.validate())}patternChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.pattern=this.pattern,this.validate())}sizeChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.size=this.size)}spellcheckChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.spellcheck=this.spellcheck)}connectedCallback(){super.connectedCallback(),this.proxy.setAttribute(`type`,this.type),this.validate(),this.autofocus&&m.queueUpdate(()=>{this.focus()})}select(){this.control.select(),this.$emit(`select`)}handleTextInput(){this.value=this.control.value}handleChange(){this.$emit(`change`)}validate(){super.validate(this.control)}};w([y({attribute:`readonly`,mode:`boolean`})],pc.prototype,`readOnly`,void 0),w([y({mode:`boolean`})],pc.prototype,`autofocus`,void 0),w([y],pc.prototype,`placeholder`,void 0),w([y],pc.prototype,`type`,void 0),w([y],pc.prototype,`list`,void 0),w([y({converter:v})],pc.prototype,`maxlength`,void 0),w([y({converter:v})],pc.prototype,`minlength`,void 0),w([y],pc.prototype,`pattern`,void 0),w([y({converter:v})],pc.prototype,`size`,void 0),w([y({mode:`boolean`})],pc.prototype,`spellcheck`,void 0),w([g],pc.prototype,`defaultSlottedNodes`,void 0);var mc=class{};D(mc,j),D(pc,fi,mc);var hc=class extends E{},gc=class extends eo(hc){constructor(){super(...arguments),this.proxy=document.createElement(`input`)}},_c=class extends gc{constructor(){super(...arguments),this.hideStep=!1,this.step=1,this.isUserInput=!1}maxChanged(e,t){this.max=Math.max(t,this.min??t);let n=Math.min(this.min,this.max);this.min!==void 0&&this.min!==n&&(this.min=n),this.value=this.getValidValue(this.value)}minChanged(e,t){this.min=Math.min(t,this.max??t);let n=Math.max(this.min,this.max);this.max!==void 0&&this.max!==n&&(this.max=n),this.value=this.getValidValue(this.value)}get valueAsNumber(){return parseFloat(super.value)}set valueAsNumber(e){this.value=e.toString()}valueChanged(e,t){this.value=this.getValidValue(t),t===this.value&&(this.control&&!this.isUserInput&&(this.control.value=this.value),super.valueChanged(e,this.value),e!==void 0&&!this.isUserInput&&(this.$emit(`input`),this.$emit(`change`)),this.isUserInput=!1)}validate(){super.validate(this.control)}getValidValue(e){let t=parseFloat(parseFloat(e).toPrecision(12));return isNaN(t)?t=``:(t=Math.min(t,this.max??t),t=Math.max(t,this.min??t).toString()),t}stepUp(){let e=parseFloat(this.value),t=isNaN(e)?this.min>0?this.min:this.max<0?this.max:this.min?0:this.step:e+this.step;this.value=t.toString()}stepDown(){let e=parseFloat(this.value),t=isNaN(e)?this.min>0?this.min:this.max<0?this.max:this.min?0:0-this.step:e-this.step;this.value=t.toString()}connectedCallback(){super.connectedCallback(),this.proxy.setAttribute(`type`,`number`),this.validate(),this.control.value=this.value,this.autofocus&&m.queueUpdate(()=>{this.focus()})}select(){this.control.select(),this.$emit(`select`)}handleTextInput(){this.control.value=this.control.value.replace(/[^0-9\-+e.]/g,``),this.isUserInput=!0,this.value=this.control.value}handleChange(){this.$emit(`change`)}handleKeyDown(e){switch(e.key){case Ca:return this.stepUp(),!1;case ba:return this.stepDown(),!1}return!0}handleBlur(){this.control.value=this.value}};w([y({attribute:`readonly`,mode:`boolean`})],_c.prototype,`readOnly`,void 0),w([y({mode:`boolean`})],_c.prototype,`autofocus`,void 0),w([y({attribute:`hide-step`,mode:`boolean`})],_c.prototype,`hideStep`,void 0),w([y],_c.prototype,`placeholder`,void 0),w([y],_c.prototype,`list`,void 0),w([y({converter:v})],_c.prototype,`maxlength`,void 0),w([y({converter:v})],_c.prototype,`minlength`,void 0),w([y({converter:v})],_c.prototype,`size`,void 0),w([y({converter:v})],_c.prototype,`step`,void 0),w([y({converter:v})],_c.prototype,`max`,void 0),w([y({converter:v})],_c.prototype,`min`,void 0),w([g],_c.prototype,`defaultSlottedNodes`,void 0),D(_c,fi,mc);var vc=44,yc=(e,t)=>_`
    <template
        role="progressbar"
        aria-valuenow="${e=>e.value}"
        aria-valuemin="${e=>e.min}"
        aria-valuemax="${e=>e.max}"
        class="${e=>e.paused?`paused`:``}"
    >
        ${S(e=>typeof e.value==`number`,_`
                <svg
                    class="progress"
                    part="progress"
                    viewBox="0 0 16 16"
                    slot="determinate"
                >
                    <circle
                        class="background"
                        part="background"
                        cx="8px"
                        cy="8px"
                        r="7px"
                    ></circle>
                    <circle
                        class="determinate"
                        part="determinate"
                        style="stroke-dasharray: ${e=>vc*e.percentComplete/100}px ${vc}px"
                        cx="8px"
                        cy="8px"
                        r="7px"
                    ></circle>
                </svg>
            `,_`
                <slot name="indeterminate" slot="indeterminate">
                    ${t.indeterminateIndicator||``}
                </slot>
            `)}
    </template>
`,bc=class extends E{constructor(){super(...arguments),this.percentComplete=0}valueChanged(){this.$fastController.isConnected&&this.updatePercentComplete()}minChanged(){this.$fastController.isConnected&&this.updatePercentComplete()}maxChanged(){this.$fastController.isConnected&&this.updatePercentComplete()}connectedCallback(){super.connectedCallback(),this.updatePercentComplete()}updatePercentComplete(){let e=typeof this.min==`number`?this.min:0,t=typeof this.max==`number`?this.max:100,n=typeof this.value==`number`?this.value:0,r=t-e;this.percentComplete=r===0?0:Math.fround((n-e)/r*100)}};w([y({converter:v})],bc.prototype,`value`,void 0),w([y({converter:v})],bc.prototype,`min`,void 0),w([y({converter:v})],bc.prototype,`max`,void 0),w([y({mode:`boolean`})],bc.prototype,`paused`,void 0),w([g],bc.prototype,`percentComplete`,void 0);var xc=(e,t)=>_`
    <template
        role="progressbar"
        aria-valuenow="${e=>e.value}"
        aria-valuemin="${e=>e.min}"
        aria-valuemax="${e=>e.max}"
        class="${e=>e.paused?`paused`:``}"
    >
        ${S(e=>typeof e.value==`number`,_`
                <div class="progress" part="progress" slot="determinate">
                    <div
                        class="determinate"
                        part="determinate"
                        style="width: ${e=>e.percentComplete}%"
                    ></div>
                </div>
            `,_`
                <div class="progress" part="progress" slot="indeterminate">
                    <slot class="indeterminate" name="indeterminate">
                        ${t.indeterminateIndicator1||``}
                        ${t.indeterminateIndicator2||``}
                    </slot>
                </div>
            `)}
    </template>
`,Sc=(e,t)=>_`
    <template
        role="radiogroup"
        aria-disabled="${e=>e.disabled}"
        aria-readonly="${e=>e.readOnly}"
        @click="${(e,t)=>e.clickHandler(t.event)}"
        @keydown="${(e,t)=>e.keydownHandler(t.event)}"
        @focusout="${(e,t)=>e.focusOutHandler(t.event)}"
    >
        <slot name="label"></slot>
        <div
            class="positioning-region ${e=>e.orientation===O.horizontal?`horizontal`:`vertical`}"
            part="positioning-region"
        >
            <slot
                ${C({property:`slottedRadioButtons`,filter:si(`[role=radio]`)})}
            ></slot>
        </div>
    </template>
`,Cc=class extends E{constructor(){super(...arguments),this.orientation=O.horizontal,this.radioChangeHandler=e=>{let t=e.target;t.checked&&(this.slottedRadioButtons.forEach(e=>{e!==t&&(e.checked=!1,this.isInsideFoundationToolbar||e.setAttribute(`tabindex`,`-1`))}),this.selectedRadio=t,this.value=t.value,t.setAttribute(`tabindex`,`0`),this.focusedRadio=t),e.stopPropagation()},this.moveToRadioByIndex=(e,t)=>{let n=e[t];this.isInsideToolbar||(n.setAttribute(`tabindex`,`0`),n.readOnly?this.slottedRadioButtons.forEach(e=>{e!==n&&e.setAttribute(`tabindex`,`-1`)}):(n.checked=!0,this.selectedRadio=n)),this.focusedRadio=n,n.focus()},this.moveRightOffGroup=()=>{var e;(e=this.nextElementSibling)==null||e.focus()},this.moveLeftOffGroup=()=>{var e;(e=this.previousElementSibling)==null||e.focus()},this.focusOutHandler=e=>{let t=this.slottedRadioButtons,n=e.target,r=n===null?0:t.indexOf(n),i=this.focusedRadio?t.indexOf(this.focusedRadio):-1;return(i===0&&r===i||i===t.length-1&&i===r)&&(this.selectedRadio?(this.focusedRadio=this.selectedRadio,this.isInsideFoundationToolbar||(this.selectedRadio.setAttribute(`tabindex`,`0`),t.forEach(e=>{e!==this.selectedRadio&&e.setAttribute(`tabindex`,`-1`)}))):(this.focusedRadio=t[0],this.focusedRadio.setAttribute(`tabindex`,`0`),t.forEach(e=>{e!==this.focusedRadio&&e.setAttribute(`tabindex`,`-1`)}))),!0},this.clickHandler=e=>{let t=e.target;if(t){let e=this.slottedRadioButtons;t.checked||e.indexOf(t)===0?(t.setAttribute(`tabindex`,`0`),this.selectedRadio=t):(t.setAttribute(`tabindex`,`-1`),this.selectedRadio=null),this.focusedRadio=t}e.preventDefault()},this.shouldMoveOffGroupToTheRight=(e,t,n)=>e===t.length&&this.isInsideToolbar&&n===`ArrowRight`,this.shouldMoveOffGroupToTheLeft=(e,t)=>(this.focusedRadio?e.indexOf(this.focusedRadio)-1:0)<0&&this.isInsideToolbar&&t===`ArrowLeft`,this.checkFocusedRadio=()=>{this.focusedRadio!==null&&!this.focusedRadio.readOnly&&!this.focusedRadio.checked&&(this.focusedRadio.checked=!0,this.focusedRadio.setAttribute(`tabindex`,`0`),this.focusedRadio.focus(),this.selectedRadio=this.focusedRadio)},this.moveRight=e=>{let t=this.slottedRadioButtons,n=0;if(n=this.focusedRadio?t.indexOf(this.focusedRadio)+1:1,this.shouldMoveOffGroupToTheRight(n,t,e.key)){this.moveRightOffGroup();return}else n===t.length&&(n=0);for(;n<t.length&&t.length>1;)if(!t[n].disabled){this.moveToRadioByIndex(t,n);break}else if(this.focusedRadio&&n===t.indexOf(this.focusedRadio))break;else if(n+1>=t.length){if(this.isInsideToolbar)break;n=0}else n+=1},this.moveLeft=e=>{let t=this.slottedRadioButtons,n=0;if(n=this.focusedRadio?t.indexOf(this.focusedRadio)-1:0,n=n<0?t.length-1:n,this.shouldMoveOffGroupToTheLeft(t,e.key)){this.moveLeftOffGroup();return}for(;n>=0&&t.length>1;)if(!t[n].disabled){this.moveToRadioByIndex(t,n);break}else if(this.focusedRadio&&n===t.indexOf(this.focusedRadio))break;else n-1<0?n=t.length-1:--n},this.keydownHandler=e=>{let t=e.key;if(t in ka&&this.isInsideFoundationToolbar)return!0;switch(t){case wa:this.checkFocusedRadio();break;case Sa:case ba:this.direction===k.ltr?this.moveRight(e):this.moveLeft(e);break;case xa:case Ca:this.direction===k.ltr?this.moveLeft(e):this.moveRight(e);break;default:return!0}}}readOnlyChanged(){this.slottedRadioButtons!==void 0&&this.slottedRadioButtons.forEach(e=>{this.readOnly?e.readOnly=!0:e.readOnly=!1})}disabledChanged(){this.slottedRadioButtons!==void 0&&this.slottedRadioButtons.forEach(e=>{this.disabled?e.disabled=!0:e.disabled=!1})}nameChanged(){this.slottedRadioButtons&&this.slottedRadioButtons.forEach(e=>{e.setAttribute(`name`,this.name)})}valueChanged(){this.slottedRadioButtons&&this.slottedRadioButtons.forEach(e=>{e.value===this.value&&(e.checked=!0,this.selectedRadio=e)}),this.$emit(`change`)}slottedRadioButtonsChanged(e,t){this.slottedRadioButtons&&this.slottedRadioButtons.length>0&&this.setupRadioButtons()}get parentToolbar(){return this.closest(`[role="toolbar"]`)}get isInsideToolbar(){return this.parentToolbar??!1}get isInsideFoundationToolbar(){return!!this.parentToolbar?.$fastController}connectedCallback(){super.connectedCallback(),this.direction=Va(this),this.setupRadioButtons()}disconnectedCallback(){this.slottedRadioButtons.forEach(e=>{e.removeEventListener(`change`,this.radioChangeHandler)})}setupRadioButtons(){let e=this.slottedRadioButtons.filter(e=>e.hasAttribute(`checked`)),t=e?e.length:0;if(t>1){let n=e[t-1];n.checked=!0}let n=!1;if(this.slottedRadioButtons.forEach(e=>{this.name!==void 0&&e.setAttribute(`name`,this.name),this.disabled&&(e.disabled=!0),this.readOnly&&(e.readOnly=!0),this.value&&this.value===e.value?(this.selectedRadio=e,this.focusedRadio=e,e.checked=!0,e.setAttribute(`tabindex`,`0`),n=!0):(this.isInsideFoundationToolbar||e.setAttribute(`tabindex`,`-1`),e.checked=!1),e.addEventListener(`change`,this.radioChangeHandler)}),this.value===void 0&&this.slottedRadioButtons.length>0){let e=this.slottedRadioButtons.filter(e=>e.hasAttribute(`checked`)),t=e===null?0:e.length;if(t>0&&!n){let n=e[t-1];n.checked=!0,this.focusedRadio=n,n.setAttribute(`tabindex`,`0`)}else this.slottedRadioButtons[0].setAttribute(`tabindex`,`0`),this.focusedRadio=this.slottedRadioButtons[0]}}};w([y({attribute:`readonly`,mode:`boolean`})],Cc.prototype,`readOnly`,void 0),w([y({attribute:`disabled`,mode:`boolean`})],Cc.prototype,`disabled`,void 0),w([y],Cc.prototype,`name`,void 0),w([y],Cc.prototype,`value`,void 0),w([y],Cc.prototype,`orientation`,void 0),w([g],Cc.prototype,`childItems`,void 0),w([g],Cc.prototype,`slottedRadioButtons`,void 0);var wc=(e,t)=>_`
    <template
        role="radio"
        class="${e=>e.checked?`checked`:``} ${e=>e.readOnly?`readonly`:``}"
        aria-checked="${e=>e.checked}"
        aria-required="${e=>e.required}"
        aria-disabled="${e=>e.disabled}"
        aria-readonly="${e=>e.readOnly}"
        @keypress="${(e,t)=>e.keypressHandler(t.event)}"
        @click="${(e,t)=>e.clickHandler(t.event)}"
    >
        <div part="control" class="control">
            <slot name="checked-indicator">
                ${t.checkedIndicator||``}
            </slot>
        </div>
        <label
            part="label"
            class="${e=>e.defaultSlottedNodes&&e.defaultSlottedNodes.length?`label`:`label label__hidden`}"
        >
            <slot ${C(`defaultSlottedNodes`)}></slot>
        </label>
    </template>
`,Tc=class extends E{},Ec=class extends to(Tc){constructor(){super(...arguments),this.proxy=document.createElement(`input`)}},Dc=class extends Ec{constructor(){super(),this.initialValue=`on`,this.keypressHandler=e=>{switch(e.key){case` `:!this.checked&&!this.readOnly&&(this.checked=!0);return}return!0},this.proxy.setAttribute(`type`,`radio`)}readOnlyChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.readOnly=this.readOnly)}defaultCheckedChanged(){this.$fastController.isConnected&&!this.dirtyChecked&&(this.isInsideRadioGroup()||(this.checked=this.defaultChecked??!1,this.dirtyChecked=!1))}connectedCallback(){super.connectedCallback(),this.validate(),this.parentElement?.getAttribute(`role`)!==`radiogroup`&&this.getAttribute(`tabindex`)===null&&(this.disabled||this.setAttribute(`tabindex`,`0`)),this.checkedAttribute&&(this.dirtyChecked||this.isInsideRadioGroup()||(this.checked=this.defaultChecked??!1,this.dirtyChecked=!1))}isInsideRadioGroup(){return this.closest(`[role=radiogroup]`)!==null}clickHandler(e){!this.disabled&&!this.readOnly&&!this.checked&&(this.checked=!0)}};w([y({attribute:`readonly`,mode:`boolean`})],Dc.prototype,`readOnly`,void 0),w([g],Dc.prototype,`name`,void 0),w([g],Dc.prototype,`defaultSlottedNodes`,void 0);var Oc=class extends E{constructor(){super(...arguments),this.framesPerSecond=60,this.updatingItems=!1,this.speed=600,this.easing=`ease-in-out`,this.flippersHiddenFromAT=!1,this.scrolling=!1,this.resizeDetector=null}get frameTime(){return 1e3/this.framesPerSecond}scrollingChanged(e,t){if(this.scrollContainer){let e=this.scrolling==1?`scrollstart`:`scrollend`;this.$emit(e,this.scrollContainer.scrollLeft)}}get isRtl(){return this.scrollItems.length>1&&this.scrollItems[0].offsetLeft>this.scrollItems[1].offsetLeft}connectedCallback(){super.connectedCallback(),this.initializeResizeDetector()}disconnectedCallback(){this.disconnectResizeDetector(),super.disconnectedCallback()}scrollItemsChanged(e,t){t&&!this.updatingItems&&m.queueUpdate(()=>this.setStops())}disconnectResizeDetector(){this.resizeDetector&&=(this.resizeDetector.disconnect(),null)}initializeResizeDetector(){this.disconnectResizeDetector(),this.resizeDetector=new window.ResizeObserver(this.resized.bind(this)),this.resizeDetector.observe(this)}updateScrollStops(){this.updatingItems=!0;let e=this.scrollItems.reduce((e,t)=>t instanceof HTMLSlotElement?e.concat(t.assignedElements()):(e.push(t),e),[]);this.scrollItems=e,this.updatingItems=!1}setStops(){this.updateScrollStops();let{scrollContainer:e}=this,{scrollLeft:t}=e,{width:n,left:r}=e.getBoundingClientRect();this.width=n;let i=0,a=this.scrollItems.map((e,n)=>{let{left:a,width:o}=e.getBoundingClientRect(),s=Math.round(a+t-r),c=Math.round(s+o);return this.isRtl?-c:(i=c,n===0?0:s)}).concat(i);a=this.fixScrollMisalign(a),a.sort((e,t)=>Math.abs(e)-Math.abs(t)),this.scrollStops=a,this.setFlippers()}validateStops(e=!0){let t=()=>!!this.scrollStops.find(e=>e>0);return!t()&&e&&this.setStops(),t()}fixScrollMisalign(e){if(this.isRtl&&e.some(e=>e>0)){e.sort((e,t)=>t-e);let t=e[0];e=e.map(e=>e-t)}return e}setFlippers(){var e,t;let n=this.scrollContainer.scrollLeft;if((e=this.previousFlipperContainer)==null||e.classList.toggle(`disabled`,n===0),this.scrollStops){let e=Math.abs(this.scrollStops[this.scrollStops.length-1]);(t=this.nextFlipperContainer)==null||t.classList.toggle(`disabled`,this.validateStops(!1)&&Math.abs(n)+this.width>=e)}}scrollInView(e,t=0,n){if(typeof e!=`number`&&e&&(e=this.scrollItems.findIndex(t=>t===e||t.contains(e))),e!==void 0){n??=t;let{scrollContainer:r,scrollStops:i,scrollItems:a}=this,{scrollLeft:o}=this.scrollContainer,{width:s}=r.getBoundingClientRect(),c=i[e],{width:l}=a[e].getBoundingClientRect(),u=c+l,d=o+t>c;if(d||o+s-n<u){let e=[...i].sort((e,t)=>d?t-e:e-t).find(e=>d?e+t<c:e+s-(n??0)>u)??0;this.scrollToPosition(e)}}}keyupHandler(e){switch(e.key){case`ArrowLeft`:this.scrollToPrevious();break;case`ArrowRight`:this.scrollToNext();break}}scrollToPrevious(){this.validateStops();let e=this.scrollContainer.scrollLeft,t=this.scrollStops.findIndex((t,n)=>t>=e&&(this.isRtl||n===this.scrollStops.length-1||this.scrollStops[n+1]>e)),n=Math.abs(this.scrollStops[t+1]),r=this.scrollStops.findIndex(e=>Math.abs(e)+this.width>n);(r>=t||r===-1)&&(r=t>0?t-1:0),this.scrollToPosition(this.scrollStops[r],e)}scrollToNext(){this.validateStops();let e=this.scrollContainer.scrollLeft,t=this.scrollStops.findIndex(t=>Math.abs(t)>=Math.abs(e)),n=this.scrollStops.findIndex(t=>Math.abs(e)+this.width<=Math.abs(t)),r=t;n>t+2?r=n-2:t<this.scrollStops.length-2&&(r=t+1),this.scrollToPosition(this.scrollStops[r],e)}scrollToPosition(e,t=this.scrollContainer.scrollLeft){if(this.scrolling)return;this.scrolling=!0;let n=this.duration??`${Math.abs(e-t)/this.speed}s`;this.content.style.setProperty(`transition-duration`,n);let r=parseFloat(getComputedStyle(this.content).getPropertyValue(`transition-duration`)),i=t=>{t&&t.target!==t.currentTarget||(this.content.style.setProperty(`transition-duration`,`0s`),this.content.style.removeProperty(`transform`),this.scrollContainer.style.setProperty(`scroll-behavior`,`auto`),this.scrollContainer.scrollLeft=e,this.setFlippers(),this.content.removeEventListener(`transitionend`,i),this.scrolling=!1)};if(r===0){i();return}this.content.addEventListener(`transitionend`,i);let a=this.scrollContainer.scrollWidth-this.scrollContainer.clientWidth,o=this.scrollContainer.scrollLeft-Math.min(e,a);this.isRtl&&(o=this.scrollContainer.scrollLeft+Math.min(Math.abs(e),a)),this.content.style.setProperty(`transition-property`,`transform`),this.content.style.setProperty(`transition-timing-function`,this.easing),this.content.style.setProperty(`transform`,`translateX(${o}px)`)}resized(){this.resizeTimeout&&=clearTimeout(this.resizeTimeout),this.resizeTimeout=setTimeout(()=>{this.width=this.scrollContainer.offsetWidth,this.setFlippers()},this.frameTime)}scrolled(){this.scrollTimeout&&=clearTimeout(this.scrollTimeout),this.scrollTimeout=setTimeout(()=>{this.setFlippers()},this.frameTime)}};w([y({converter:v})],Oc.prototype,`speed`,void 0),w([y],Oc.prototype,`duration`,void 0),w([y],Oc.prototype,`easing`,void 0),w([y({attribute:`flippers-hidden-from-at`,converter:gr})],Oc.prototype,`flippersHiddenFromAT`,void 0),w([g],Oc.prototype,`scrolling`,void 0),w([g],Oc.prototype,`scrollItems`,void 0),w([y({attribute:`view`})],Oc.prototype,`view`,void 0);var kc=(e,t)=>_`
    <template
        class="horizontal-scroll"
        @keyup="${(e,t)=>e.keyupHandler(t.event)}"
    >
        ${mi(e,t)}
        <div class="scroll-area" part="scroll-area">
            <div
                class="scroll-view"
                part="scroll-view"
                @scroll="${e=>e.scrolled()}"
                ${x(`scrollContainer`)}
            >
                <div class="content-container" part="content-container" ${x(`content`)}>
                    <slot
                        ${C({property:`scrollItems`,filter:si()})}
                    ></slot>
                </div>
            </div>
            ${S(e=>e.view!==`mobile`,_`
                    <div
                        class="scroll scroll-prev"
                        part="scroll-prev"
                        ${x(`previousFlipperContainer`)}
                    >
                        <div class="scroll-action" part="scroll-action-previous">
                            <slot name="previous-flipper">
                                ${t.previousFlipper instanceof Function?t.previousFlipper(e,t):t.previousFlipper??``}
                            </slot>
                        </div>
                    </div>
                    <div
                        class="scroll scroll-next"
                        part="scroll-next"
                        ${x(`nextFlipperContainer`)}
                    >
                        <div class="scroll-action" part="scroll-action-next">
                            <slot name="next-flipper">
                                ${t.nextFlipper instanceof Function?t.nextFlipper(e,t):t.nextFlipper??``}
                            </slot>
                        </div>
                    </div>
                `)}
        </div>
        ${pi(e,t)}
    </template>
`;function Ac(e,t,n){return e.nodeType===Node.TEXT_NODE?typeof e.nodeValue==`string`&&!!e.nodeValue.trim().length:!0}var jc=class extends E{},Mc=class extends eo(jc){constructor(){super(...arguments),this.proxy=document.createElement(`input`)}},Nc=class extends Mc{readOnlyChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.readOnly=this.readOnly,this.validate())}autofocusChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.autofocus=this.autofocus,this.validate())}placeholderChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.placeholder=this.placeholder)}listChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.setAttribute(`list`,this.list),this.validate())}maxlengthChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.maxLength=this.maxlength,this.validate())}minlengthChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.minLength=this.minlength,this.validate())}patternChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.pattern=this.pattern,this.validate())}sizeChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.size=this.size)}spellcheckChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.spellcheck=this.spellcheck)}connectedCallback(){super.connectedCallback(),this.validate(),this.autofocus&&m.queueUpdate(()=>{this.focus()})}validate(){super.validate(this.control)}handleTextInput(){this.value=this.control.value}handleClearInput(){this.value=``,this.control.focus(),this.handleChange()}handleChange(){this.$emit(`change`)}};w([y({attribute:`readonly`,mode:`boolean`})],Nc.prototype,`readOnly`,void 0),w([y({mode:`boolean`})],Nc.prototype,`autofocus`,void 0),w([y],Nc.prototype,`placeholder`,void 0),w([y],Nc.prototype,`list`,void 0),w([y({converter:v})],Nc.prototype,`maxlength`,void 0),w([y({converter:v})],Nc.prototype,`minlength`,void 0),w([y],Nc.prototype,`pattern`,void 0),w([y({converter:v})],Nc.prototype,`size`,void 0),w([y({mode:`boolean`})],Nc.prototype,`spellcheck`,void 0),w([g],Nc.prototype,`defaultSlottedNodes`,void 0);var Pc=class{};D(Pc,j),D(Nc,fi,Pc);var Fc=class extends tc{},Ic=class extends eo(Fc){constructor(){super(...arguments),this.proxy=document.createElement(`select`)}},Lc=class extends Ic{constructor(){super(...arguments),this.open=!1,this.forcedPosition=!1,this.listboxId=Pa(`listbox-`),this.maxHeight=0}openChanged(e,t){if(this.collapsible){if(this.open){this.ariaControls=this.listboxId,this.ariaExpanded=`true`,this.setPositioning(),this.focusAndScrollOptionIntoView(),this.indexWhenOpened=this.selectedIndex,m.queueUpdate(()=>this.focus());return}this.ariaControls=``,this.ariaExpanded=`false`}}get collapsible(){return!(this.multiple||typeof this.size==`number`)}get value(){return h.track(this,`value`),this._value}set value(e){let t=`${this._value}`;if(this._options?.length){let t=this._options.findIndex(t=>t.value===e),n=this._options[this.selectedIndex]?.value??null,r=this._options[t]?.value??null;(t===-1||n!==r)&&(e=``,this.selectedIndex=t),e=this.firstSelectedOption?.value??e}t!==e&&(this._value=e,super.valueChanged(t,e),h.notify(this,`value`),this.updateDisplayValue())}updateValue(e){this.$fastController.isConnected&&(this.value=this.firstSelectedOption?.value??``),e&&(this.$emit(`input`),this.$emit(`change`,this,{bubbles:!0,composed:void 0}))}selectedIndexChanged(e,t){super.selectedIndexChanged(e,t),this.updateValue()}positionChanged(e,t){this.positionAttribute=t,this.setPositioning()}setPositioning(){let e=this.getBoundingClientRect(),t=window.innerHeight-e.bottom;this.position=this.forcedPosition?this.positionAttribute:e.top>t?Vo.above:Vo.below,this.positionAttribute=this.forcedPosition?this.positionAttribute:this.position,this.maxHeight=this.position===Vo.above?~~e.top:~~t}get displayValue(){return h.track(this,`displayValue`),this.firstSelectedOption?.text??``}disabledChanged(e,t){super.disabledChanged&&super.disabledChanged(e,t),this.ariaDisabled=this.disabled?`true`:`false`}formResetCallback(){this.setProxyOptions(),super.setDefaultSelectedOption(),this.selectedIndex===-1&&(this.selectedIndex=0)}clickHandler(e){if(!this.disabled){if(this.open){let t=e.target.closest(`option,[role=option]`);if(t&&t.disabled)return}return super.clickHandler(e),this.open=this.collapsible&&!this.open,!this.open&&this.indexWhenOpened!==this.selectedIndex&&this.updateValue(!0),!0}}focusoutHandler(e){if(super.focusoutHandler(e),!this.open)return!0;let t=e.relatedTarget;if(this.isSameNode(t)){this.focus();return}this.options?.includes(t)||(this.open=!1,this.indexWhenOpened!==this.selectedIndex&&this.updateValue(!0))}handleChange(e,t){super.handleChange(e,t),t===`value`&&this.updateValue()}slottedOptionsChanged(e,t){this.options.forEach(e=>{h.getNotifier(e).unsubscribe(this,`value`)}),super.slottedOptionsChanged(e,t),this.options.forEach(e=>{h.getNotifier(e).subscribe(this,`value`)}),this.setProxyOptions(),this.updateValue()}mousedownHandler(e){return e.offsetX>=0&&e.offsetX<=this.listbox?.scrollWidth?super.mousedownHandler(e):this.collapsible}multipleChanged(e,t){super.multipleChanged(e,t),this.proxy&&(this.proxy.multiple=t)}selectedOptionsChanged(e,t){var n;super.selectedOptionsChanged(e,t),(n=this.options)==null||n.forEach((e,t)=>{let n=this.proxy?.options.item(t);n&&(n.selected=e.selected)})}setDefaultSelectedOption(){let e=(this.options??Array.from(this.children).filter(zo.slottedOptionFilter))?.findIndex(e=>e.hasAttribute(`selected`)||e.selected||e.value===this.value);if(e!==-1){this.selectedIndex=e;return}this.selectedIndex=0}setProxyOptions(){this.proxy instanceof HTMLSelectElement&&this.options&&(this.proxy.options.length=0,this.options.forEach(e=>{let t=e.proxy||(e instanceof HTMLOptionElement?e.cloneNode():null);t&&this.proxy.options.add(t)}))}keydownHandler(e){super.keydownHandler(e);let t=e.key||e.key.charCodeAt(0);switch(t){case` `:e.preventDefault(),this.collapsible&&this.typeAheadExpired&&(this.open=!this.open);break;case Ea:case`End`:e.preventDefault();break;case wa:e.preventDefault(),this.open=!this.open;break;case Ta:this.collapsible&&this.open&&(e.preventDefault(),this.open=!1);break;case`Tab`:return this.collapsible&&this.open&&(e.preventDefault(),this.open=!1),!0}return!this.open&&this.indexWhenOpened!==this.selectedIndex&&(this.updateValue(!0),this.indexWhenOpened=this.selectedIndex),!(t===`ArrowDown`||t===`ArrowUp`)}connectedCallback(){super.connectedCallback(),this.forcedPosition=!!this.positionAttribute,this.addEventListener(`contentchange`,this.updateDisplayValue)}disconnectedCallback(){this.removeEventListener(`contentchange`,this.updateDisplayValue),super.disconnectedCallback()}sizeChanged(e,t){super.sizeChanged(e,t),this.proxy&&(this.proxy.size=t)}updateDisplayValue(){this.collapsible&&h.notify(this,`displayValue`)}};w([y({attribute:`open`,mode:`boolean`})],Lc.prototype,`open`,void 0),w([Dn],Lc.prototype,`collapsible`,null),w([g],Lc.prototype,`control`,void 0),w([y({attribute:`position`})],Lc.prototype,`positionAttribute`,void 0),w([g],Lc.prototype,`position`,void 0),w([g],Lc.prototype,`maxHeight`,void 0);var Rc=class{};w([g],Rc.prototype,`ariaControls`,void 0),D(Rc,Bo),D(Lc,fi,Rc);var zc=(e,t)=>_`
    <template
        class="${e=>[e.collapsible&&`collapsible`,e.collapsible&&e.open&&`open`,e.disabled&&`disabled`,e.collapsible&&e.position].filter(Boolean).join(` `)}"
        aria-activedescendant="${e=>e.ariaActiveDescendant}"
        aria-controls="${e=>e.ariaControls}"
        aria-disabled="${e=>e.ariaDisabled}"
        aria-expanded="${e=>e.ariaExpanded}"
        aria-haspopup="${e=>e.collapsible?`listbox`:null}"
        aria-multiselectable="${e=>e.ariaMultiSelectable}"
        ?open="${e=>e.open}"
        role="combobox"
        tabindex="${e=>e.disabled?null:`0`}"
        @click="${(e,t)=>e.clickHandler(t.event)}"
        @focusin="${(e,t)=>e.focusinHandler(t.event)}"
        @focusout="${(e,t)=>e.focusoutHandler(t.event)}"
        @keydown="${(e,t)=>e.keydownHandler(t.event)}"
        @mousedown="${(e,t)=>e.mousedownHandler(t.event)}"
    >
        ${S(e=>e.collapsible,_`
                <div
                    class="control"
                    part="control"
                    ?disabled="${e=>e.disabled}"
                    ${x(`control`)}
                >
                    ${mi(e,t)}
                    <slot name="button-container">
                        <div class="selected-value" part="selected-value">
                            <slot name="selected-value">${e=>e.displayValue}</slot>
                        </div>
                        <div aria-hidden="true" class="indicator" part="indicator">
                            <slot name="indicator">
                                ${t.indicator||``}
                            </slot>
                        </div>
                    </slot>
                    ${pi(e,t)}
                </div>
            `)}
        <div
            class="listbox"
            id="${e=>e.listboxId}"
            part="listbox"
            role="listbox"
            ?disabled="${e=>e.disabled}"
            ?hidden="${e=>e.collapsible?!e.open:!1}"
            ${x(`listbox`)}
        >
            <slot
                ${C({filter:zo.slottedOptionFilter,flatten:!0,property:`slottedOptions`})}
            ></slot>
        </div>
    </template>
`,Bc=(e,t)=>_`
    <template
        class="${e=>e.shape===`circle`?`circle`:`rect`}"
        pattern="${e=>e.pattern}"
        ?shimmer="${e=>e.shimmer}"
    >
        ${S(e=>e.shimmer===!0,_`
                <span class="shimmer"></span>
            `)}
        <object type="image/svg+xml" data="${e=>e.pattern}" role="presentation">
            <img class="pattern" src="${e=>e.pattern}" />
        </object>
        <slot></slot>
    </template>
`,Vc=class extends E{constructor(){super(...arguments),this.shape=`rect`}};w([y],Vc.prototype,`fill`,void 0),w([y],Vc.prototype,`shape`,void 0),w([y],Vc.prototype,`pattern`,void 0),w([y({mode:`boolean`})],Vc.prototype,`shimmer`,void 0);var Hc=(e,t)=>_`
    <template
        aria-disabled="${e=>e.disabled}"
        class="${e=>e.sliderOrientation||O.horizontal}
            ${e=>e.disabled?`disabled`:``}"
    >
        <div ${x(`root`)} part="root" class="root" style="${e=>e.positionStyle}">
            <div class="container">
                ${S(e=>!e.hideMark,_`
                        <div class="mark"></div>
                    `)}
                <div class="label">
                    <slot></slot>
                </div>
            </div>
        </div>
    </template>
`;function Uc(e,t,n,r){let i=ja(0,1,(e-t)/(n-t));return r===k.rtl&&(i=1-i),i}var Wc={min:0,max:0,direction:k.ltr,orientation:O.horizontal,disabled:!1},Gc=class extends E{constructor(){super(...arguments),this.hideMark=!1,this.sliderDirection=k.ltr,this.getSliderConfiguration=()=>{if(!this.isSliderConfig(this.parentNode))this.sliderDirection=Wc.direction||k.ltr,this.sliderOrientation=Wc.orientation||O.horizontal,this.sliderMaxPosition=Wc.max,this.sliderMinPosition=Wc.min;else{let{min:e,max:t,direction:n,orientation:r,disabled:i}=this.parentNode;i!==void 0&&(this.disabled=i),this.sliderDirection=n||k.ltr,this.sliderOrientation=r||O.horizontal,this.sliderMaxPosition=t,this.sliderMinPosition=e}},this.positionAsStyle=()=>{let e=this.sliderDirection?this.sliderDirection:k.ltr,t=Uc(Number(this.position),Number(this.sliderMinPosition),Number(this.sliderMaxPosition)),n=Math.round((1-t)*100),r=Math.round(t*100);return Number.isNaN(r)&&Number.isNaN(n)&&(n=50,r=50),this.sliderOrientation===O.horizontal?e===k.rtl?`right: ${r}%; left: ${n}%;`:`left: ${r}%; right: ${n}%;`:`top: ${r}%; bottom: ${n}%;`}}positionChanged(){this.positionStyle=this.positionAsStyle()}sliderOrientationChanged(){}connectedCallback(){super.connectedCallback(),this.getSliderConfiguration(),this.positionStyle=this.positionAsStyle(),this.notifier=h.getNotifier(this.parentNode),this.notifier.subscribe(this,`orientation`),this.notifier.subscribe(this,`direction`),this.notifier.subscribe(this,`max`),this.notifier.subscribe(this,`min`)}disconnectedCallback(){super.disconnectedCallback(),this.notifier.unsubscribe(this,`orientation`),this.notifier.unsubscribe(this,`direction`),this.notifier.unsubscribe(this,`max`),this.notifier.unsubscribe(this,`min`)}handleChange(e,t){switch(t){case`direction`:this.sliderDirection=e.direction;break;case`orientation`:this.sliderOrientation=e.orientation;break;case`max`:this.sliderMaxPosition=e.max;break;case`min`:this.sliderMinPosition=e.min;break;default:break}this.positionStyle=this.positionAsStyle()}isSliderConfig(e){return e.max!==void 0&&e.min!==void 0}};w([g],Gc.prototype,`positionStyle`,void 0),w([y],Gc.prototype,`position`,void 0),w([y({attribute:`hide-mark`,mode:`boolean`})],Gc.prototype,`hideMark`,void 0),w([y({attribute:`disabled`,mode:`boolean`})],Gc.prototype,`disabled`,void 0),w([g],Gc.prototype,`sliderOrientation`,void 0),w([g],Gc.prototype,`sliderMinPosition`,void 0),w([g],Gc.prototype,`sliderMaxPosition`,void 0),w([g],Gc.prototype,`sliderDirection`,void 0);var Kc=(e,t)=>_`
    <template
        role="slider"
        class="${e=>e.readOnly?`readonly`:``}
        ${e=>e.orientation||O.horizontal}"
        tabindex="${e=>e.disabled?null:0}"
        aria-valuetext="${e=>e.valueTextFormatter(e.value)}"
        aria-valuenow="${e=>e.value}"
        aria-valuemin="${e=>e.min}"
        aria-valuemax="${e=>e.max}"
        aria-disabled="${e=>e.disabled?!0:void 0}"
        aria-readonly="${e=>e.readOnly?!0:void 0}"
        aria-orientation="${e=>e.orientation}"
        class="${e=>e.orientation}"
    >
        <div part="positioning-region" class="positioning-region">
            <div ${x(`track`)} part="track-container" class="track">
                <slot name="track"></slot>
                <div part="track-start" class="track-start" style="${e=>e.position}">
                    <slot name="track-start"></slot>
                </div>
            </div>
            <slot></slot>
            <div
                ${x(`thumb`)}
                part="thumb-container"
                class="thumb-container"
                style="${e=>e.position}"
            >
                <slot name="thumb">${t.thumb||``}</slot>
            </div>
        </div>
    </template>
`,qc=class extends E{},Jc=class extends eo(qc){constructor(){super(...arguments),this.proxy=document.createElement(`input`)}},Yc={singleValue:`single-value`},Xc=class extends Jc{constructor(){super(...arguments),this.direction=k.ltr,this.isDragging=!1,this.trackWidth=0,this.trackMinWidth=0,this.trackHeight=0,this.trackLeft=0,this.trackMinHeight=0,this.valueTextFormatter=()=>null,this.min=0,this.max=10,this.step=1,this.orientation=O.horizontal,this.mode=Yc.singleValue,this.keypressHandler=e=>{if(!this.readOnly){if(e.key===`Home`)e.preventDefault(),this.value=`${this.min}`;else if(e.key===`End`)e.preventDefault(),this.value=`${this.max}`;else if(!e.shiftKey)switch(e.key){case Sa:case Ca:e.preventDefault(),this.increment();break;case xa:case ba:e.preventDefault(),this.decrement();break}}},this.setupTrackConstraints=()=>{let e=this.track.getBoundingClientRect();this.trackWidth=this.track.clientWidth,this.trackMinWidth=this.track.clientLeft,this.trackHeight=e.bottom,this.trackMinHeight=e.top,this.trackLeft=this.getBoundingClientRect().left,this.trackWidth===0&&(this.trackWidth=1)},this.setupListeners=(e=!1)=>{let t=`${e?`remove`:`add`}EventListener`;this[t](`keydown`,this.keypressHandler),this[t](`mousedown`,this.handleMouseDown),this.thumb[t](`mousedown`,this.handleThumbMouseDown,{passive:!0}),this.thumb[t](`touchstart`,this.handleThumbMouseDown,{passive:!0}),e&&(this.handleMouseDown(null),this.handleThumbMouseDown(null))},this.initialValue=``,this.handleThumbMouseDown=e=>{if(e){if(this.readOnly||this.disabled||e.defaultPrevented)return;e.target.focus()}let t=`${e===null?`remove`:`add`}EventListener`;window[t](`mouseup`,this.handleWindowMouseUp),window[t](`mousemove`,this.handleMouseMove,{passive:!0}),window[t](`touchmove`,this.handleMouseMove,{passive:!0}),window[t](`touchend`,this.handleWindowMouseUp),this.isDragging=e!==null},this.handleMouseMove=e=>{if(this.readOnly||this.disabled||e.defaultPrevented)return;let t=window.TouchEvent&&e instanceof TouchEvent?e.touches[0]:e,n=this.orientation===O.horizontal?t.pageX-document.documentElement.scrollLeft-this.trackLeft:t.pageY-document.documentElement.scrollTop;this.value=`${this.calculateNewValue(n)}`},this.calculateNewValue=e=>{let t=Uc(e,this.orientation===O.horizontal?this.trackMinWidth:this.trackMinHeight,this.orientation===O.horizontal?this.trackWidth:this.trackHeight,this.direction),n=(this.max-this.min)*t+this.min;return this.convertToConstrainedValue(n)},this.handleWindowMouseUp=e=>{this.stopDragging()},this.stopDragging=()=>{this.isDragging=!1,this.handleMouseDown(null),this.handleThumbMouseDown(null)},this.handleMouseDown=e=>{let t=`${e===null?`remove`:`add`}EventListener`;if((e===null||!this.disabled&&!this.readOnly)&&(window[t](`mouseup`,this.handleWindowMouseUp),window.document[t](`mouseleave`,this.handleWindowMouseUp),window[t](`mousemove`,this.handleMouseMove),e)){e.preventDefault(),this.setupTrackConstraints(),e.target.focus();let t=this.orientation===O.horizontal?e.pageX-document.documentElement.scrollLeft-this.trackLeft:e.pageY-document.documentElement.scrollTop;this.value=`${this.calculateNewValue(t)}`}},this.convertToConstrainedValue=e=>{isNaN(e)&&(e=this.min);let t=e-this.min,n=Math.round(t/this.step),r=t-n*(this.stepMultiplier*this.step)/this.stepMultiplier;return t=r>=Number(this.step)/2?t-r+Number(this.step):t-r,t+this.min}}readOnlyChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.readOnly=this.readOnly)}get valueAsNumber(){return parseFloat(super.value)}set valueAsNumber(e){this.value=e.toString()}valueChanged(e,t){super.valueChanged(e,t),this.$fastController.isConnected&&this.setThumbPositionForOrientation(this.direction),this.$emit(`change`)}minChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.min=`${this.min}`),this.validate()}maxChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.max=`${this.max}`),this.validate()}stepChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.step=`${this.step}`),this.updateStepMultiplier(),this.validate()}orientationChanged(){this.$fastController.isConnected&&this.setThumbPositionForOrientation(this.direction)}connectedCallback(){super.connectedCallback(),this.proxy.setAttribute(`type`,`range`),this.direction=Va(this),this.updateStepMultiplier(),this.setupTrackConstraints(),this.setupListeners(),this.setupDefaultValue(),this.setThumbPositionForOrientation(this.direction)}disconnectedCallback(){this.setupListeners(!0)}increment(){let e=this.direction!==k.rtl&&this.orientation!==O.vertical?Number(this.value)+Number(this.step):Number(this.value)-Number(this.step),t=this.convertToConstrainedValue(e),n=t<Number(this.max)?`${t}`:`${this.max}`;this.value=n}decrement(){let e=this.direction!==k.rtl&&this.orientation!==O.vertical?Number(this.value)-Number(this.step):Number(this.value)+Number(this.step),t=this.convertToConstrainedValue(e),n=t>Number(this.min)?`${t}`:`${this.min}`;this.value=n}setThumbPositionForOrientation(e){let t=(1-Uc(Number(this.value),Number(this.min),Number(this.max),e))*100;this.orientation===O.horizontal?this.position=this.isDragging?`right: ${t}%; transition: none;`:`right: ${t}%; transition: all 0.2s ease;`:this.position=this.isDragging?`bottom: ${t}%; transition: none;`:`bottom: ${t}%; transition: all 0.2s ease;`}updateStepMultiplier(){let e=this.step+``,t=this.step%1?e.length-e.indexOf(`.`)-1:0;this.stepMultiplier=10**t}get midpoint(){return`${this.convertToConstrainedValue((this.max+this.min)/2)}`}setupDefaultValue(){if(typeof this.value==`string`)if(this.value.length===0)this.initialValue=this.midpoint;else{let e=parseFloat(this.value);!Number.isNaN(e)&&(e<this.min||e>this.max)&&(this.value=this.midpoint)}}};w([y({attribute:`readonly`,mode:`boolean`})],Xc.prototype,`readOnly`,void 0),w([g],Xc.prototype,`direction`,void 0),w([g],Xc.prototype,`isDragging`,void 0),w([g],Xc.prototype,`position`,void 0),w([g],Xc.prototype,`trackWidth`,void 0),w([g],Xc.prototype,`trackMinWidth`,void 0),w([g],Xc.prototype,`trackHeight`,void 0),w([g],Xc.prototype,`trackLeft`,void 0),w([g],Xc.prototype,`trackMinHeight`,void 0),w([g],Xc.prototype,`valueTextFormatter`,void 0),w([y({converter:v})],Xc.prototype,`min`,void 0),w([y({converter:v})],Xc.prototype,`max`,void 0),w([y({converter:v})],Xc.prototype,`step`,void 0),w([y],Xc.prototype,`orientation`,void 0),w([y],Xc.prototype,`mode`,void 0);var Zc=(e,t)=>_`
    <template
        role="switch"
        aria-checked="${e=>e.checked}"
        aria-disabled="${e=>e.disabled}"
        aria-readonly="${e=>e.readOnly}"
        tabindex="${e=>e.disabled?null:0}"
        @keypress="${(e,t)=>e.keypressHandler(t.event)}"
        @click="${(e,t)=>e.clickHandler(t.event)}"
        class="${e=>e.checked?`checked`:``}"
    >
        <label
            part="label"
            class="${e=>e.defaultSlottedNodes&&e.defaultSlottedNodes.length?`label`:`label label__hidden`}"
        >
            <slot ${C(`defaultSlottedNodes`)}></slot>
        </label>
        <div part="switch" class="switch">
            <slot name="switch">${t.switch||``}</slot>
        </div>
        <span class="status-message" part="status-message">
            <span class="checked-message" part="checked-message">
                <slot name="checked-message"></slot>
            </span>
            <span class="unchecked-message" part="unchecked-message">
                <slot name="unchecked-message"></slot>
            </span>
        </span>
    </template>
`,Qc=class extends E{},$c=class extends to(Qc){constructor(){super(...arguments),this.proxy=document.createElement(`input`)}},el=class extends $c{constructor(){super(),this.initialValue=`on`,this.keypressHandler=e=>{if(!this.readOnly)switch(e.key){case wa:case` `:this.checked=!this.checked;break}},this.clickHandler=e=>{!this.disabled&&!this.readOnly&&(this.checked=!this.checked)},this.proxy.setAttribute(`type`,`checkbox`)}readOnlyChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.readOnly=this.readOnly),this.readOnly?this.classList.add(`readonly`):this.classList.remove(`readonly`)}checkedChanged(e,t){super.checkedChanged(e,t),this.checked?this.classList.add(`checked`):this.classList.remove(`checked`)}};w([y({attribute:`readonly`,mode:`boolean`})],el.prototype,`readOnly`,void 0),w([g],el.prototype,`defaultSlottedNodes`,void 0);var tl=(e,t)=>_`
    <template slot="tabpanel" role="tabpanel">
        <slot></slot>
    </template>
`,nl=class extends E{},rl=(e,t)=>_`
    <template slot="tab" role="tab" aria-disabled="${e=>e.disabled}">
        <slot></slot>
    </template>
`,il=class extends E{};w([y({mode:`boolean`})],il.prototype,`disabled`,void 0);var al=(e,t)=>_`
    <template class="${e=>e.orientation}">
        ${mi(e,t)}
        <div class="tablist" part="tablist" role="tablist">
            <slot class="tab" name="tab" part="tab" ${C(`tabs`)}></slot>

            ${S(e=>e.showActiveIndicator,_`
                    <div
                        ${x(`activeIndicatorRef`)}
                        class="activeIndicator"
                        part="activeIndicator"
                    ></div>
                `)}
        </div>
        ${pi(e,t)}
        <div class="tabpanel" part="tabpanel">
            <slot name="tabpanel" ${C(`tabpanels`)}></slot>
        </div>
    </template>
`,ol={vertical:`vertical`,horizontal:`horizontal`},sl=class extends E{constructor(){super(...arguments),this.orientation=ol.horizontal,this.activeindicator=!0,this.showActiveIndicator=!0,this.prevActiveTabIndex=0,this.activeTabIndex=0,this.ticking=!1,this.change=()=>{this.$emit(`change`,this.activetab)},this.isDisabledElement=e=>e.getAttribute(`aria-disabled`)===`true`,this.isHiddenElement=e=>e.hasAttribute(`hidden`),this.isFocusableElement=e=>!this.isDisabledElement(e)&&!this.isHiddenElement(e),this.setTabs=()=>{let e=`gridColumn`,t=`gridRow`,n=this.isHorizontal()?e:t;this.activeTabIndex=this.getActiveIndex(),this.showActiveIndicator=!1,this.tabs.forEach((r,i)=>{if(r.slot===`tab`){let e=this.activeTabIndex===i&&this.isFocusableElement(r);this.activeindicator&&this.isFocusableElement(r)&&(this.showActiveIndicator=!0);let t=this.tabIds[i],n=this.tabpanelIds[i];r.setAttribute(`id`,t),r.setAttribute(`aria-selected`,e?`true`:`false`),r.setAttribute(`aria-controls`,n),r.addEventListener(`click`,this.handleTabClick),r.addEventListener(`keydown`,this.handleTabKeyDown),r.setAttribute(`tabindex`,e?`0`:`-1`),e&&(this.activetab=r,this.activeid=t)}r.style[e]=``,r.style[t]=``,r.style[n]=`${i+1}`,this.isHorizontal()?r.classList.remove(`vertical`):r.classList.add(`vertical`)})},this.setTabPanels=()=>{this.tabpanels.forEach((e,t)=>{let n=this.tabIds[t],r=this.tabpanelIds[t];e.setAttribute(`id`,r),e.setAttribute(`aria-labelledby`,n),this.activeTabIndex===t?e.removeAttribute(`hidden`):e.setAttribute(`hidden`,``)})},this.handleTabClick=e=>{let t=e.currentTarget;t.nodeType===1&&this.isFocusableElement(t)&&(this.prevActiveTabIndex=this.activeTabIndex,this.activeTabIndex=this.tabs.indexOf(t),this.setComponent())},this.handleTabKeyDown=e=>{if(this.isHorizontal())switch(e.key){case xa:e.preventDefault(),this.adjustBackward(e);break;case Sa:e.preventDefault(),this.adjustForward(e);break}else switch(e.key){case Ca:e.preventDefault(),this.adjustBackward(e);break;case ba:e.preventDefault(),this.adjustForward(e);break}switch(e.key){case Ea:e.preventDefault(),this.adjust(-this.activeTabIndex);break;case`End`:e.preventDefault(),this.adjust(this.tabs.length-this.activeTabIndex-1);break}},this.adjustForward=e=>{let t=this.tabs,n=0;for(n=this.activetab?t.indexOf(this.activetab)+1:1,n===t.length&&(n=0);n<t.length&&t.length>1;)if(this.isFocusableElement(t[n])){this.moveToTabByIndex(t,n);break}else if(this.activetab&&n===t.indexOf(this.activetab))break;else n+1>=t.length?n=0:n+=1},this.adjustBackward=e=>{let t=this.tabs,n=0;for(n=this.activetab?t.indexOf(this.activetab)-1:0,n=n<0?t.length-1:n;n>=0&&t.length>1;)if(this.isFocusableElement(t[n])){this.moveToTabByIndex(t,n);break}else n-1<0?n=t.length-1:--n},this.moveToTabByIndex=(e,t)=>{let n=e[t];this.activetab=n,this.prevActiveTabIndex=this.activeTabIndex,this.activeTabIndex=t,n.focus(),this.setComponent()}}orientationChanged(){this.$fastController.isConnected&&(this.setTabs(),this.setTabPanels(),this.handleActiveIndicatorPosition())}activeidChanged(e,t){this.$fastController.isConnected&&this.tabs.length<=this.tabpanels.length&&(this.prevActiveTabIndex=this.tabs.findIndex(t=>t.id===e),this.setTabs(),this.setTabPanels(),this.handleActiveIndicatorPosition())}tabsChanged(){this.$fastController.isConnected&&this.tabs.length<=this.tabpanels.length&&(this.tabIds=this.getTabIds(),this.tabpanelIds=this.getTabPanelIds(),this.setTabs(),this.setTabPanels(),this.handleActiveIndicatorPosition())}tabpanelsChanged(){this.$fastController.isConnected&&this.tabpanels.length<=this.tabs.length&&(this.tabIds=this.getTabIds(),this.tabpanelIds=this.getTabPanelIds(),this.setTabs(),this.setTabPanels(),this.handleActiveIndicatorPosition())}getActiveIndex(){return this.activeid===void 0||this.tabIds.indexOf(this.activeid)===-1?0:this.tabIds.indexOf(this.activeid)}getTabIds(){return this.tabs.map(e=>e.getAttribute(`id`)??`tab-${Pa()}`)}getTabPanelIds(){return this.tabpanels.map(e=>e.getAttribute(`id`)??`panel-${Pa()}`)}setComponent(){this.activeTabIndex!==this.prevActiveTabIndex&&(this.activeid=this.tabIds[this.activeTabIndex],this.focusTab(),this.change())}isHorizontal(){return this.orientation===ol.horizontal}handleActiveIndicatorPosition(){this.showActiveIndicator&&this.activeindicator&&this.activeTabIndex!==this.prevActiveTabIndex&&(this.ticking?this.ticking=!1:(this.ticking=!0,this.animateActiveIndicator()))}animateActiveIndicator(){this.ticking=!0;let e=this.isHorizontal()?`gridColumn`:`gridRow`,t=this.isHorizontal()?`translateX`:`translateY`,n=this.isHorizontal()?`offsetLeft`:`offsetTop`,r=this.activeIndicatorRef[n];this.activeIndicatorRef.style[e]=`${this.activeTabIndex+1}`;let i=this.activeIndicatorRef[n];this.activeIndicatorRef.style[e]=`${this.prevActiveTabIndex+1}`;let a=i-r;this.activeIndicatorRef.style.transform=`${t}(${a}px)`,this.activeIndicatorRef.classList.add(`activeIndicatorTransition`),this.activeIndicatorRef.addEventListener(`transitionend`,()=>{this.ticking=!1,this.activeIndicatorRef.style[e]=`${this.activeTabIndex+1}`,this.activeIndicatorRef.style.transform=`${t}(0px)`,this.activeIndicatorRef.classList.remove(`activeIndicatorTransition`)})}adjust(e){let t=this.tabs.filter(e=>this.isFocusableElement(e)),n=t.indexOf(this.activetab),r=ja(0,t.length-1,n+e),i=this.tabs.indexOf(t[r]);i>-1&&this.moveToTabByIndex(this.tabs,i)}focusTab(){this.tabs[this.activeTabIndex].focus()}connectedCallback(){super.connectedCallback(),this.tabIds=this.getTabIds(),this.tabpanelIds=this.getTabPanelIds(),this.activeTabIndex=this.getActiveIndex()}};w([y],sl.prototype,`orientation`,void 0),w([y],sl.prototype,`activeid`,void 0),w([g],sl.prototype,`tabs`,void 0),w([g],sl.prototype,`tabpanels`,void 0),w([y({mode:`boolean`})],sl.prototype,`activeindicator`,void 0),w([g],sl.prototype,`activeIndicatorRef`,void 0),w([g],sl.prototype,`showActiveIndicator`,void 0),D(sl,fi);var cl=class extends E{},ll=class extends eo(cl){constructor(){super(...arguments),this.proxy=document.createElement(`textarea`)}},ul={none:`none`,both:`both`,horizontal:`horizontal`,vertical:`vertical`},dl=class extends ll{constructor(){super(...arguments),this.resize=ul.none,this.cols=20,this.handleTextInput=()=>{this.value=this.control.value}}readOnlyChanged(){this.proxy instanceof HTMLTextAreaElement&&(this.proxy.readOnly=this.readOnly)}autofocusChanged(){this.proxy instanceof HTMLTextAreaElement&&(this.proxy.autofocus=this.autofocus)}listChanged(){this.proxy instanceof HTMLTextAreaElement&&this.proxy.setAttribute(`list`,this.list)}maxlengthChanged(){this.proxy instanceof HTMLTextAreaElement&&(this.proxy.maxLength=this.maxlength)}minlengthChanged(){this.proxy instanceof HTMLTextAreaElement&&(this.proxy.minLength=this.minlength)}spellcheckChanged(){this.proxy instanceof HTMLTextAreaElement&&(this.proxy.spellcheck=this.spellcheck)}select(){this.control.select(),this.$emit(`select`)}handleChange(){this.$emit(`change`)}validate(){super.validate(this.control)}};w([y({mode:`boolean`})],dl.prototype,`readOnly`,void 0),w([y],dl.prototype,`resize`,void 0),w([y({mode:`boolean`})],dl.prototype,`autofocus`,void 0),w([y({attribute:`form`})],dl.prototype,`formId`,void 0),w([y],dl.prototype,`list`,void 0),w([y({converter:v})],dl.prototype,`maxlength`,void 0),w([y({converter:v})],dl.prototype,`minlength`,void 0),w([y],dl.prototype,`name`,void 0),w([y],dl.prototype,`placeholder`,void 0),w([y({converter:v,mode:`fromView`})],dl.prototype,`cols`,void 0),w([y({converter:v,mode:`fromView`})],dl.prototype,`rows`,void 0),w([y({mode:`boolean`})],dl.prototype,`spellcheck`,void 0),w([g],dl.prototype,`defaultSlottedNodes`,void 0),D(dl,mc);var fl=(e,t)=>_`
    <template
        class="
            ${e=>e.readOnly?`readonly`:``}
            ${e=>e.resize===ul.none?``:`resize-${e.resize}`}"
    >
        <label
            part="label"
            for="control"
            class="${e=>e.defaultSlottedNodes&&e.defaultSlottedNodes.length?`label`:`label label__hidden`}"
        >
            <slot ${C(`defaultSlottedNodes`)}></slot>
        </label>
        <textarea
            part="control"
            class="control"
            id="control"
            ?autofocus="${e=>e.autofocus}"
            cols="${e=>e.cols}"
            ?disabled="${e=>e.disabled}"
            form="${e=>e.form}"
            list="${e=>e.list}"
            maxlength="${e=>e.maxlength}"
            minlength="${e=>e.minlength}"
            name="${e=>e.name}"
            placeholder="${e=>e.placeholder}"
            ?readonly="${e=>e.readOnly}"
            ?required="${e=>e.required}"
            rows="${e=>e.rows}"
            ?spellcheck="${e=>e.spellcheck}"
            :value="${e=>e.value}"
            aria-atomic="${e=>e.ariaAtomic}"
            aria-busy="${e=>e.ariaBusy}"
            aria-controls="${e=>e.ariaControls}"
            aria-current="${e=>e.ariaCurrent}"
            aria-describedby="${e=>e.ariaDescribedby}"
            aria-details="${e=>e.ariaDetails}"
            aria-disabled="${e=>e.ariaDisabled}"
            aria-errormessage="${e=>e.ariaErrormessage}"
            aria-flowto="${e=>e.ariaFlowto}"
            aria-haspopup="${e=>e.ariaHaspopup}"
            aria-hidden="${e=>e.ariaHidden}"
            aria-invalid="${e=>e.ariaInvalid}"
            aria-keyshortcuts="${e=>e.ariaKeyshortcuts}"
            aria-label="${e=>e.ariaLabel}"
            aria-labelledby="${e=>e.ariaLabelledby}"
            aria-live="${e=>e.ariaLive}"
            aria-owns="${e=>e.ariaOwns}"
            aria-relevant="${e=>e.ariaRelevant}"
            aria-roledescription="${e=>e.ariaRoledescription}"
            @input="${(e,t)=>e.handleTextInput()}"
            @change="${e=>e.handleChange()}"
            ${x(`control`)}
        ></textarea>
    </template>
`,pl=(e,t)=>_`
    <template
        class="
            ${e=>e.readOnly?`readonly`:``}
        "
    >
        <label
            part="label"
            for="control"
            class="${e=>e.defaultSlottedNodes&&e.defaultSlottedNodes.length?`label`:`label label__hidden`}"
        >
            <slot
                ${C({property:`defaultSlottedNodes`,filter:Ac})}
            ></slot>
        </label>
        <div class="root" part="root">
            ${mi(e,t)}
            <input
                class="control"
                part="control"
                id="control"
                @input="${e=>e.handleTextInput()}"
                @change="${e=>e.handleChange()}"
                ?autofocus="${e=>e.autofocus}"
                ?disabled="${e=>e.disabled}"
                list="${e=>e.list}"
                maxlength="${e=>e.maxlength}"
                minlength="${e=>e.minlength}"
                pattern="${e=>e.pattern}"
                placeholder="${e=>e.placeholder}"
                ?readonly="${e=>e.readOnly}"
                ?required="${e=>e.required}"
                size="${e=>e.size}"
                ?spellcheck="${e=>e.spellcheck}"
                :value="${e=>e.value}"
                type="${e=>e.type}"
                aria-atomic="${e=>e.ariaAtomic}"
                aria-busy="${e=>e.ariaBusy}"
                aria-controls="${e=>e.ariaControls}"
                aria-current="${e=>e.ariaCurrent}"
                aria-describedby="${e=>e.ariaDescribedby}"
                aria-details="${e=>e.ariaDetails}"
                aria-disabled="${e=>e.ariaDisabled}"
                aria-errormessage="${e=>e.ariaErrormessage}"
                aria-flowto="${e=>e.ariaFlowto}"
                aria-haspopup="${e=>e.ariaHaspopup}"
                aria-hidden="${e=>e.ariaHidden}"
                aria-invalid="${e=>e.ariaInvalid}"
                aria-keyshortcuts="${e=>e.ariaKeyshortcuts}"
                aria-label="${e=>e.ariaLabel}"
                aria-labelledby="${e=>e.ariaLabelledby}"
                aria-live="${e=>e.ariaLive}"
                aria-owns="${e=>e.ariaOwns}"
                aria-relevant="${e=>e.ariaRelevant}"
                aria-roledescription="${e=>e.ariaRoledescription}"
                ${x(`control`)}
            />
            ${pi(e,t)}
        </div>
    </template>
`,ml=(e,t)=>_`
    <template
        aria-label="${e=>e.ariaLabel}"
        aria-labelledby="${e=>e.ariaLabelledby}"
        aria-orientation="${e=>e.orientation}"
        orientation="${e=>e.orientation}"
        role="toolbar"
        @mousedown="${(e,t)=>e.mouseDownHandler(t.event)}"
        @focusin="${(e,t)=>e.focusinHandler(t.event)}"
        @keydown="${(e,t)=>e.keydownHandler(t.event)}"
        ${di({property:`childItems`,attributeFilter:[`disabled`,`hidden`],filter:si(),subtree:!0})}
    >
        <slot name="label"></slot>
        <div class="positioning-region" part="positioning-region">
            ${mi(e,t)}
            <slot
                ${C({filter:si(),property:`slottedItems`})}
            ></slot>
            ${pi(e,t)}
        </div>
    </template>
`;function hl(e){let t=e.getRootNode();return t instanceof ShadowRoot?t.activeElement:document.activeElement}var gl=Object.freeze({[ka.ArrowUp]:{[O.vertical]:-1},[ka.ArrowDown]:{[O.vertical]:1},[ka.ArrowLeft]:{[O.horizontal]:{[k.ltr]:-1,[k.rtl]:1}},[ka.ArrowRight]:{[O.horizontal]:{[k.ltr]:1,[k.rtl]:-1}}}),_l=class e extends E{constructor(){super(...arguments),this._activeIndex=0,this.direction=k.ltr,this.orientation=O.horizontal}get activeIndex(){return h.track(this,`activeIndex`),this._activeIndex}set activeIndex(e){this.$fastController.isConnected&&(this._activeIndex=ja(0,this.focusableElements.length-1,e),h.notify(this,`activeIndex`))}slottedItemsChanged(){this.$fastController.isConnected&&this.reduceFocusableElements()}mouseDownHandler(e){let t=this.focusableElements?.findIndex(t=>t.contains(e.target));return t>-1&&this.activeIndex!==t&&this.setFocusedElement(t),!0}childItemsChanged(e,t){this.$fastController.isConnected&&this.reduceFocusableElements()}connectedCallback(){super.connectedCallback(),this.direction=Va(this)}focusinHandler(e){let t=e.relatedTarget;!t||this.contains(t)||this.setFocusedElement()}getDirectionalIncrementer(e){return gl[e]?.[this.orientation]?.[this.direction]??gl[e]?.[this.orientation]??0}keydownHandler(e){let t=e.key;if(!(t in ka)||e.defaultPrevented||e.shiftKey)return!0;let n=this.getDirectionalIncrementer(t);if(!n)return!e.target.closest(`[role=radiogroup]`);let r=this.activeIndex+n;return this.focusableElements[r]&&e.preventDefault(),this.setFocusedElement(r),!0}get allSlottedItems(){return[...this.start.assignedElements(),...this.slottedItems,...this.end.assignedElements()]}reduceFocusableElements(){let t=this.focusableElements?.[this.activeIndex];this.focusableElements=this.allSlottedItems.reduce(e.reduceFocusableItems,[]);let n=this.focusableElements.indexOf(t);this.activeIndex=Math.max(0,n),this.setFocusableElements()}setFocusedElement(e=this.activeIndex){this.activeIndex=e,this.setFocusableElements(),this.focusableElements[this.activeIndex]&&this.contains(hl(this))&&this.focusableElements[this.activeIndex].focus()}static reduceFocusableItems(t,n){let r=n.getAttribute(`role`)===`radio`,i=n.$fastController?.definition.shadowOptions?.delegatesFocus,a=Array.from(n.shadowRoot?.querySelectorAll(`*`)??[]).some(e=>Ks(e));return!n.hasAttribute(`disabled`)&&!n.hasAttribute(`hidden`)&&(Ks(n)||r||i||a)?(t.push(n),t):n.childElementCount?t.concat(Array.from(n.children).reduce(e.reduceFocusableItems,[])):t}setFocusableElements(){this.$fastController.isConnected&&this.focusableElements.length>0&&this.focusableElements.forEach((e,t)=>{e.tabIndex=this.activeIndex===t?0:-1})}};w([g],_l.prototype,`direction`,void 0),w([y],_l.prototype,`orientation`,void 0),w([g],_l.prototype,`slottedItems`,void 0),w([g],_l.prototype,`slottedLabel`,void 0),w([g],_l.prototype,`childItems`,void 0);var vl=class{};w([y({attribute:`aria-labelledby`})],vl.prototype,`ariaLabelledby`,void 0),w([y({attribute:`aria-label`})],vl.prototype,`ariaLabel`,void 0),D(vl,j),D(_l,fi,vl);var yl=(e,t)=>_`
        ${S(e=>e.tooltipVisible,_`
            <${e.tagFor(M)}
                fixed-placement="true"
                auto-update-mode="${e=>e.autoUpdateMode}"
                vertical-positioning-mode="${e=>e.verticalPositioningMode}"
                vertical-default-position="${e=>e.verticalDefaultPosition}"
                vertical-inset="${e=>e.verticalInset}"
                vertical-scaling="${e=>e.verticalScaling}"
                horizontal-positioning-mode="${e=>e.horizontalPositioningMode}"
                horizontal-default-position="${e=>e.horizontalDefaultPosition}"
                horizontal-scaling="${e=>e.horizontalScaling}"
                horizontal-inset="${e=>e.horizontalInset}"
                vertical-viewport-lock="${e=>e.horizontalViewportLock}"
                horizontal-viewport-lock="${e=>e.verticalViewportLock}"
                dir="${e=>e.currentDirection}"
                ${x(`region`)}
            >
                <div class="tooltip" part="tooltip" role="tooltip">
                    <slot></slot>
                </div>
            </${e.tagFor(M)}>
        `)}
    `,bl={top:`top`,right:`right`,bottom:`bottom`,left:`left`,start:`start`,end:`end`,topLeft:`top-left`,topRight:`top-right`,bottomLeft:`bottom-left`,bottomRight:`bottom-right`,topStart:`top-start`,topEnd:`top-end`,bottomStart:`bottom-start`,bottomEnd:`bottom-end`},xl=class extends E{constructor(){super(...arguments),this.anchor=``,this.delay=300,this.autoUpdateMode=`anchor`,this.anchorElement=null,this.viewportElement=null,this.verticalPositioningMode=`dynamic`,this.horizontalPositioningMode=`dynamic`,this.horizontalInset=`false`,this.verticalInset=`false`,this.horizontalScaling=`content`,this.verticalScaling=`content`,this.verticalDefaultPosition=void 0,this.horizontalDefaultPosition=void 0,this.tooltipVisible=!1,this.currentDirection=k.ltr,this.showDelayTimer=null,this.hideDelayTimer=null,this.isAnchorHoveredFocused=!1,this.isRegionHovered=!1,this.handlePositionChange=e=>{this.classList.toggle(`top`,this.region.verticalPosition===`start`),this.classList.toggle(`bottom`,this.region.verticalPosition===`end`),this.classList.toggle(`inset-top`,this.region.verticalPosition===`insetStart`),this.classList.toggle(`inset-bottom`,this.region.verticalPosition===`insetEnd`),this.classList.toggle(`center-vertical`,this.region.verticalPosition===`center`),this.classList.toggle(`left`,this.region.horizontalPosition===`start`),this.classList.toggle(`right`,this.region.horizontalPosition===`end`),this.classList.toggle(`inset-left`,this.region.horizontalPosition===`insetStart`),this.classList.toggle(`inset-right`,this.region.horizontalPosition===`insetEnd`),this.classList.toggle(`center-horizontal`,this.region.horizontalPosition===`center`)},this.handleRegionMouseOver=e=>{this.isRegionHovered=!0},this.handleRegionMouseOut=e=>{this.isRegionHovered=!1,this.startHideDelayTimer()},this.handleAnchorMouseOver=e=>{if(this.tooltipVisible){this.isAnchorHoveredFocused=!0;return}this.startShowDelayTimer()},this.handleAnchorMouseOut=e=>{this.isAnchorHoveredFocused=!1,this.clearShowDelayTimer(),this.startHideDelayTimer()},this.handleAnchorFocusIn=e=>{this.startShowDelayTimer()},this.handleAnchorFocusOut=e=>{this.isAnchorHoveredFocused=!1,this.clearShowDelayTimer(),this.startHideDelayTimer()},this.startHideDelayTimer=()=>{this.clearHideDelayTimer(),this.tooltipVisible&&(this.hideDelayTimer=window.setTimeout(()=>{this.updateTooltipVisibility()},60))},this.clearHideDelayTimer=()=>{this.hideDelayTimer!==null&&(clearTimeout(this.hideDelayTimer),this.hideDelayTimer=null)},this.startShowDelayTimer=()=>{if(!this.isAnchorHoveredFocused){if(this.delay>1){this.showDelayTimer===null&&(this.showDelayTimer=window.setTimeout(()=>{this.startHover()},this.delay));return}this.startHover()}},this.startHover=()=>{this.isAnchorHoveredFocused=!0,this.updateTooltipVisibility()},this.clearShowDelayTimer=()=>{this.showDelayTimer!==null&&(clearTimeout(this.showDelayTimer),this.showDelayTimer=null)},this.getAnchor=()=>{let e=this.getRootNode();return e instanceof ShadowRoot?e.getElementById(this.anchor):document.getElementById(this.anchor)},this.handleDocumentKeydown=e=>{if(!e.defaultPrevented&&this.tooltipVisible)switch(e.key){case Ta:this.isAnchorHoveredFocused=!1,this.updateTooltipVisibility(),this.$emit(`dismiss`);break}},this.updateTooltipVisibility=()=>{if(this.visible===!1)this.hideTooltip();else if(this.visible===!0){this.showTooltip();return}else{if(this.isAnchorHoveredFocused||this.isRegionHovered){this.showTooltip();return}this.hideTooltip()}},this.showTooltip=()=>{this.tooltipVisible||(this.currentDirection=Va(this),this.tooltipVisible=!0,document.addEventListener(`keydown`,this.handleDocumentKeydown),m.queueUpdate(this.setRegionProps))},this.hideTooltip=()=>{this.tooltipVisible&&=(this.clearHideDelayTimer(),this.region!==null&&this.region!==void 0&&(this.region.removeEventListener(`positionchange`,this.handlePositionChange),this.region.viewportElement=null,this.region.anchorElement=null,this.region.removeEventListener(`mouseover`,this.handleRegionMouseOver),this.region.removeEventListener(`mouseout`,this.handleRegionMouseOut)),document.removeEventListener(`keydown`,this.handleDocumentKeydown),!1)},this.setRegionProps=()=>{this.tooltipVisible&&(this.region.viewportElement=this.viewportElement,this.region.anchorElement=this.anchorElement,this.region.addEventListener(`positionchange`,this.handlePositionChange),this.region.addEventListener(`mouseover`,this.handleRegionMouseOver,{passive:!0}),this.region.addEventListener(`mouseout`,this.handleRegionMouseOut,{passive:!0}))}}visibleChanged(){this.$fastController.isConnected&&(this.updateTooltipVisibility(),this.updateLayout())}anchorChanged(){this.$fastController.isConnected&&(this.anchorElement=this.getAnchor())}positionChanged(){this.$fastController.isConnected&&this.updateLayout()}anchorElementChanged(e){if(this.$fastController.isConnected){if(e!=null&&(e.removeEventListener(`mouseover`,this.handleAnchorMouseOver),e.removeEventListener(`mouseout`,this.handleAnchorMouseOut),e.removeEventListener(`focusin`,this.handleAnchorFocusIn),e.removeEventListener(`focusout`,this.handleAnchorFocusOut)),this.anchorElement!==null&&this.anchorElement!==void 0){this.anchorElement.addEventListener(`mouseover`,this.handleAnchorMouseOver,{passive:!0}),this.anchorElement.addEventListener(`mouseout`,this.handleAnchorMouseOut,{passive:!0}),this.anchorElement.addEventListener(`focusin`,this.handleAnchorFocusIn,{passive:!0}),this.anchorElement.addEventListener(`focusout`,this.handleAnchorFocusOut,{passive:!0});let e=this.anchorElement.id;this.anchorElement.parentElement!==null&&this.anchorElement.parentElement.querySelectorAll(`:hover`).forEach(t=>{t.id===e&&this.startShowDelayTimer()})}this.region!==null&&this.region!==void 0&&this.tooltipVisible&&(this.region.anchorElement=this.anchorElement),this.updateLayout()}}viewportElementChanged(){this.region!==null&&this.region!==void 0&&(this.region.viewportElement=this.viewportElement),this.updateLayout()}connectedCallback(){super.connectedCallback(),this.anchorElement=this.getAnchor(),this.updateTooltipVisibility()}disconnectedCallback(){this.hideTooltip(),this.clearShowDelayTimer(),this.clearHideDelayTimer(),super.disconnectedCallback()}updateLayout(){switch(this.verticalPositioningMode=`locktodefault`,this.horizontalPositioningMode=`locktodefault`,this.position){case bl.top:case bl.bottom:this.verticalDefaultPosition=this.position,this.horizontalDefaultPosition=`center`;break;case bl.right:case bl.left:case bl.start:case bl.end:this.verticalDefaultPosition=`center`,this.horizontalDefaultPosition=this.position;break;case bl.topLeft:this.verticalDefaultPosition=`top`,this.horizontalDefaultPosition=`left`;break;case bl.topRight:this.verticalDefaultPosition=`top`,this.horizontalDefaultPosition=`right`;break;case bl.bottomLeft:this.verticalDefaultPosition=`bottom`,this.horizontalDefaultPosition=`left`;break;case bl.bottomRight:this.verticalDefaultPosition=`bottom`,this.horizontalDefaultPosition=`right`;break;case bl.topStart:this.verticalDefaultPosition=`top`,this.horizontalDefaultPosition=`start`;break;case bl.topEnd:this.verticalDefaultPosition=`top`,this.horizontalDefaultPosition=`end`;break;case bl.bottomStart:this.verticalDefaultPosition=`bottom`,this.horizontalDefaultPosition=`start`;break;case bl.bottomEnd:this.verticalDefaultPosition=`bottom`,this.horizontalDefaultPosition=`end`;break;default:this.verticalPositioningMode=`dynamic`,this.horizontalPositioningMode=`dynamic`,this.verticalDefaultPosition=void 0,this.horizontalDefaultPosition=`center`;break}}};w([y({mode:`boolean`})],xl.prototype,`visible`,void 0),w([y],xl.prototype,`anchor`,void 0),w([y],xl.prototype,`delay`,void 0),w([y],xl.prototype,`position`,void 0),w([y({attribute:`auto-update-mode`})],xl.prototype,`autoUpdateMode`,void 0),w([y({attribute:`horizontal-viewport-lock`})],xl.prototype,`horizontalViewportLock`,void 0),w([y({attribute:`vertical-viewport-lock`})],xl.prototype,`verticalViewportLock`,void 0),w([g],xl.prototype,`anchorElement`,void 0),w([g],xl.prototype,`viewportElement`,void 0),w([g],xl.prototype,`verticalPositioningMode`,void 0),w([g],xl.prototype,`horizontalPositioningMode`,void 0),w([g],xl.prototype,`horizontalInset`,void 0),w([g],xl.prototype,`verticalInset`,void 0),w([g],xl.prototype,`horizontalScaling`,void 0),w([g],xl.prototype,`verticalScaling`,void 0),w([g],xl.prototype,`verticalDefaultPosition`,void 0),w([g],xl.prototype,`horizontalDefaultPosition`,void 0),w([g],xl.prototype,`tooltipVisible`,void 0),w([g],xl.prototype,`currentDirection`,void 0);var Sl=(e,t)=>_`
    <template
        role="treeitem"
        slot="${e=>e.isNestedItem()?`item`:void 0}"
        tabindex="-1"
        class="${e=>e.expanded?`expanded`:``} ${e=>e.selected?`selected`:``} ${e=>e.nested?`nested`:``}
            ${e=>e.disabled?`disabled`:``}"
        aria-expanded="${e=>e.childItems&&e.childItemLength()>0?e.expanded:void 0}"
        aria-selected="${e=>e.selected}"
        aria-disabled="${e=>e.disabled}"
        @focusin="${(e,t)=>e.handleFocus(t.event)}"
        @focusout="${(e,t)=>e.handleBlur(t.event)}"
        ${di({property:`childItems`,filter:si()})}
    >
        <div class="positioning-region" part="positioning-region">
            <div class="content-region" part="content-region">
                ${S(e=>e.childItems&&e.childItemLength()>0,_`
                        <div
                            aria-hidden="true"
                            class="expand-collapse-button"
                            part="expand-collapse-button"
                            @click="${(e,t)=>e.handleExpandCollapseButtonClick(t.event)}"
                            ${x(`expandCollapseButton`)}
                        >
                            <slot name="expand-collapse-glyph">
                                ${t.expandCollapseGlyph||``}
                            </slot>
                        </div>
                    `)}
                ${mi(e,t)}
                <slot></slot>
                ${pi(e,t)}
            </div>
        </div>
        ${S(e=>e.childItems&&e.childItemLength()>0&&(e.expanded||e.renderCollapsedChildren),_`
                <div role="group" class="items" part="items">
                    <slot name="item" ${C(`items`)}></slot>
                </div>
            `)}
    </template>
`;function Cl(e){return ca(e)&&e.getAttribute(`role`)===`treeitem`}var wl=class extends E{constructor(){super(...arguments),this.expanded=!1,this.focusable=!1,this.isNestedItem=()=>Cl(this.parentElement),this.handleExpandCollapseButtonClick=e=>{!this.disabled&&!e.defaultPrevented&&(this.expanded=!this.expanded)},this.handleFocus=e=>{this.setAttribute(`tabindex`,`0`)},this.handleBlur=e=>{this.setAttribute(`tabindex`,`-1`)}}expandedChanged(){this.$fastController.isConnected&&this.$emit(`expanded-change`,this)}selectedChanged(){this.$fastController.isConnected&&this.$emit(`selected-change`,this)}itemsChanged(e,t){this.$fastController.isConnected&&this.items.forEach(e=>{Cl(e)&&(e.nested=!0)})}static focusItem(e){e.focusable=!0,e.focus()}childItemLength(){let e=this.childItems.filter(e=>Cl(e));return e?e.length:0}};w([y({mode:`boolean`})],wl.prototype,`expanded`,void 0),w([y({mode:`boolean`})],wl.prototype,`selected`,void 0),w([y({mode:`boolean`})],wl.prototype,`disabled`,void 0),w([g],wl.prototype,`focusable`,void 0),w([g],wl.prototype,`childItems`,void 0),w([g],wl.prototype,`items`,void 0),w([g],wl.prototype,`nested`,void 0),w([g],wl.prototype,`renderCollapsedChildren`,void 0),D(wl,fi);var Tl=(e,t)=>_`
    <template
        role="tree"
        ${x(`treeView`)}
        @keydown="${(e,t)=>e.handleKeyDown(t.event)}"
        @focusin="${(e,t)=>e.handleFocus(t.event)}"
        @focusout="${(e,t)=>e.handleBlur(t.event)}"
        @click="${(e,t)=>e.handleClick(t.event)}"
        @selected-change="${(e,t)=>e.handleSelectedChange(t.event)}"
    >
        <slot ${C(`slottedTreeItems`)}></slot>
    </template>
`,El=class extends E{constructor(){super(...arguments),this.currentFocused=null,this.handleFocus=e=>{if(!(this.slottedTreeItems.length<1)){if(e.target===this){this.currentFocused===null&&(this.currentFocused=this.getValidFocusableItem()),this.currentFocused!==null&&wl.focusItem(this.currentFocused);return}this.contains(e.target)&&(this.setAttribute(`tabindex`,`-1`),this.currentFocused=e.target)}},this.handleBlur=e=>{e.target instanceof HTMLElement&&(e.relatedTarget===null||!this.contains(e.relatedTarget))&&this.setAttribute(`tabindex`,`0`)},this.handleKeyDown=e=>{if(e.defaultPrevented)return;if(this.slottedTreeItems.length<1)return!0;let t=this.getVisibleNodes();switch(e.key){case Ea:t.length&&wl.focusItem(t[0]);return;case`End`:t.length&&wl.focusItem(t[t.length-1]);return;case xa:if(e.target&&this.isFocusableElement(e.target)){let t=e.target;t instanceof wl&&t.childItemLength()>0&&t.expanded?t.expanded=!1:t instanceof wl&&t.parentElement instanceof wl&&wl.focusItem(t.parentElement)}return!1;case Sa:if(e.target&&this.isFocusableElement(e.target)){let t=e.target;t instanceof wl&&t.childItemLength()>0&&!t.expanded?t.expanded=!0:t instanceof wl&&t.childItemLength()>0&&this.focusNextNode(1,e.target)}return;case ba:e.target&&this.isFocusableElement(e.target)&&this.focusNextNode(1,e.target);return;case Ca:e.target&&this.isFocusableElement(e.target)&&this.focusNextNode(-1,e.target);return;case wa:this.handleClick(e);return}return!0},this.handleSelectedChange=e=>{if(e.defaultPrevented)return;if(!(e.target instanceof Element)||!Cl(e.target))return!0;let t=e.target;t.selected?(this.currentSelected&&this.currentSelected!==t&&(this.currentSelected.selected=!1),this.currentSelected=t):!t.selected&&this.currentSelected===t&&(this.currentSelected=null)},this.setItems=()=>{let e=this.treeView.querySelector(`[aria-selected='true']`);this.currentSelected=e,(this.currentFocused===null||!this.contains(this.currentFocused))&&(this.currentFocused=this.getValidFocusableItem()),this.nested=this.checkForNestedItems(),this.getVisibleNodes().forEach(e=>{Cl(e)&&(e.nested=this.nested)})},this.isFocusableElement=e=>Cl(e),this.isSelectedElement=e=>e.selected}slottedTreeItemsChanged(){this.$fastController.isConnected&&this.setItems()}connectedCallback(){super.connectedCallback(),this.setAttribute(`tabindex`,`0`),m.queueUpdate(()=>{this.setItems()})}handleClick(e){if(e.defaultPrevented)return;if(!(e.target instanceof Element)||!Cl(e.target))return!0;let t=e.target;t.disabled||(t.selected=!t.selected)}focusNextNode(e,t){let n=this.getVisibleNodes();if(!n)return;let r=n[n.indexOf(t)+e];ca(r)&&wl.focusItem(r)}getValidFocusableItem(){let e=this.getVisibleNodes(),t=e.findIndex(this.isSelectedElement);return t===-1&&(t=e.findIndex(this.isFocusableElement)),t===-1?null:e[t]}checkForNestedItems(){return this.slottedTreeItems.some(e=>Cl(e)&&e.querySelector(`[role='treeitem']`))}getVisibleNodes(){return la(this,`[role='treeitem']`)||[]}};w([y({attribute:`render-collapsed-nodes`})],El.prototype,`renderCollapsedNodes`,void 0),w([g],El.prototype,`currentSelected`,void 0),w([g],El.prototype,`slottedTreeItems`,void 0);var Dl=class{constructor(e){this.listenerCache=new WeakMap,this.query=e}bind(e){let{query:t}=this,n=this.constructListener(e);n.bind(t)(),t.addListener(n),this.listenerCache.set(e,n)}unbind(e){let t=this.listenerCache.get(e);t&&(this.query.removeListener(t),this.listenerCache.delete(e))}},Ol=class e extends Dl{constructor(e,t){super(e),this.styles=t}static with(t){return n=>new e(t,n)}constructListener(e){let t=!1,n=this.styles;return function(){let{matches:r}=this;r&&!t?(e.$fastController.addStyles(n),t=r):!r&&t&&(e.$fastController.removeStyles(n),t=r)}}unbind(e){super.unbind(e),e.$fastController.removeStyles(this.styles)}},P=Ol.with(window.matchMedia(`(forced-colors)`));Ol.with(window.matchMedia(`(prefers-color-scheme: dark)`)),Ol.with(window.matchMedia(`(prefers-color-scheme: light)`));var kl=class{constructor(e,t,n){this.propertyName=e,this.value=t,this.styles=n}bind(e){h.getNotifier(e).subscribe(this,this.propertyName),this.handleChange(e,this.propertyName)}unbind(e){h.getNotifier(e).unsubscribe(this,this.propertyName),e.$fastController.removeStyles(this.styles)}handleChange(e,t){e[t]===this.value?e.$fastController.addStyles(this.styles):e.$fastController.removeStyles(this.styles)}},Al=`not-allowed`,jl=`:host([hidden]){display:none}`;function F(e){return`${jl}:host{display:${e}}`}var I=fa()?`focus-visible`:`focus`;function Ml(e,t,n){return isNaN(e)||e<=t?t:e>=n?n:e}function Nl(e,t,n){return isNaN(e)||e<=t?0:e>=n?1:e/(n-t)}function Pl(e,t,n){return isNaN(e)?t:t+e*(n-t)}function Fl(e){let t=Math.round(Ml(e,0,255)).toString(16);return t.length===1?`0`+t:t}function Il(e,t,n){return isNaN(e)||e<=0?t:e>=1?n:t+e*(n-t)}Math.PI*2;function Ll(e,t){let n=10**t;return Math.round(e*n)/n}var Rl=class e{constructor(e,t,n){this.h=e,this.s=t,this.l=n}static fromObject(t){return t&&!isNaN(t.h)&&!isNaN(t.s)&&!isNaN(t.l)?new e(t.h,t.s,t.l):null}equalValue(e){return this.h===e.h&&this.s===e.s&&this.l===e.l}roundToPrecision(t){return new e(Ll(this.h,t),Ll(this.s,t),Ll(this.l,t))}toObject(){return{h:this.h,s:this.s,l:this.l}}},zl=class e{constructor(e,t,n){this.l=e,this.a=t,this.b=n}static fromObject(t){return t&&!isNaN(t.l)&&!isNaN(t.a)&&!isNaN(t.b)?new e(t.l,t.a,t.b):null}equalValue(e){return this.l===e.l&&this.a===e.a&&this.b===e.b}roundToPrecision(t){return new e(Ll(this.l,t),Ll(this.a,t),Ll(this.b,t))}toObject(){return{l:this.l,a:this.a,b:this.b}}};zl.epsilon=216/24389,zl.kappa=24389/27;var Bl=class e{constructor(e,t,n,r){this.r=e,this.g=t,this.b=n,this.a=typeof r==`number`&&!isNaN(r)?r:1}static fromObject(t){return t&&!isNaN(t.r)&&!isNaN(t.g)&&!isNaN(t.b)?new e(t.r,t.g,t.b,t.a):null}equalValue(e){return this.r===e.r&&this.g===e.g&&this.b===e.b&&this.a===e.a}toStringHexRGB(){return`#`+[this.r,this.g,this.b].map(this.formatHexValue).join(``)}toStringHexRGBA(){return this.toStringHexRGB()+this.formatHexValue(this.a)}toStringHexARGB(){return`#`+[this.a,this.r,this.g,this.b].map(this.formatHexValue).join(``)}toStringWebRGB(){return`rgb(${Math.round(Pl(this.r,0,255))},${Math.round(Pl(this.g,0,255))},${Math.round(Pl(this.b,0,255))})`}toStringWebRGBA(){return`rgba(${Math.round(Pl(this.r,0,255))},${Math.round(Pl(this.g,0,255))},${Math.round(Pl(this.b,0,255))},${Ml(this.a,0,1)})`}roundToPrecision(t){return new e(Ll(this.r,t),Ll(this.g,t),Ll(this.b,t),Ll(this.a,t))}clamp(){return new e(Ml(this.r,0,1),Ml(this.g,0,1),Ml(this.b,0,1),Ml(this.a,0,1))}toObject(){return{r:this.r,g:this.g,b:this.b,a:this.a}}formatHexValue(e){return Fl(Pl(e,0,255))}},Vl=class e{constructor(e,t,n){this.x=e,this.y=t,this.z=n}static fromObject(t){return t&&!isNaN(t.x)&&!isNaN(t.y)&&!isNaN(t.z)?new e(t.x,t.y,t.z):null}equalValue(e){return this.x===e.x&&this.y===e.y&&this.z===e.z}roundToPrecision(t){return new e(Ll(this.x,t),Ll(this.y,t),Ll(this.z,t))}toObject(){return{x:this.x,y:this.y,z:this.z}}};Vl.whitePoint=new Vl(.95047,1,1.08883);function Hl(e){return e.r*.2126+e.g*.7152+e.b*.0722}function Ul(e){function t(e){return e<=.03928?e/12.92:((e+.055)/1.055)**2.4}return Hl(new Bl(t(e.r),t(e.g),t(e.b),1))}function Wl(e,t,n){return n-t===0?0:(e-t)/(n-t)}function Gl(e,t,n){let r=Wl(e.r,t.r,n.r),i=Wl(e.g,t.g,n.g),a=Wl(e.b,t.b,n.b);return(r+i+a)/3}function Kl(e,t,n=null){let r=0,i=n;return i===null?(i=new Bl(0,0,0,1),r=Gl(e,t,i),r<=0&&(i=new Bl(1,1,1,1),r=Gl(e,t,i))):r=Gl(e,t,i),r=Math.round(r*1e3)/1e3,new Bl(i.r,i.g,i.b,r)}function ql(e){let t=Math.max(e.r,e.g,e.b),n=Math.min(e.r,e.g,e.b),r=t-n,i=0;r!==0&&(i=t===e.r?60*((e.g-e.b)/r%6):t===e.g?60*((e.b-e.r)/r+2):60*((e.r-e.g)/r+4)),i<0&&(i+=360);let a=(t+n)/2,o=0;return r!==0&&(o=r/(1-Math.abs(2*a-1))),new Rl(i,o,a)}function Jl(e,t=1){let n=(1-Math.abs(2*e.l-1))*e.s,r=n*(1-Math.abs(e.h/60%2-1)),i=e.l-n/2,a=0,o=0,s=0;return e.h<60?(a=n,o=r,s=0):e.h<120?(a=r,o=n,s=0):e.h<180?(a=0,o=n,s=r):e.h<240?(a=0,o=r,s=n):e.h<300?(a=r,o=0,s=n):e.h<360&&(a=n,o=0,s=r),new Bl(a+i,o+i,s+i,t)}function Yl(e){let t=(e.l+16)/116,n=t+e.a/500,r=t-e.b/200,i=n**3,a=t**3,o=r**3,s=0;s=i>zl.epsilon?i:(116*n-16)/zl.kappa;let c=0;c=e.l>zl.epsilon*zl.kappa?a:e.l/zl.kappa;let l=0;return l=o>zl.epsilon?o:(116*r-16)/zl.kappa,s=Vl.whitePoint.x*s,c=Vl.whitePoint.y*c,l=Vl.whitePoint.z*l,new Vl(s,c,l)}function Xl(e){function t(e){return e>zl.epsilon?e**(1/3):(zl.kappa*e+16)/116}let n=t(e.x/Vl.whitePoint.x),r=t(e.y/Vl.whitePoint.y),i=t(e.z/Vl.whitePoint.z);return new zl(116*r-16,500*(n-r),200*(r-i))}function Zl(e){function t(e){return e<=.04045?e/12.92:((e+.055)/1.055)**2.4}let n=t(e.r),r=t(e.g),i=t(e.b);return new Vl(n*.4124564+r*.3575761+i*.1804375,n*.2126729+r*.7151522+i*.072175,n*.0193339+r*.119192+i*.9503041)}function Ql(e,t=1){function n(e){return e<=.0031308?e*12.92:1.055*e**(1/2.4)-.055}return new Bl(n(e.x*3.2404542-e.y*1.5371385-e.z*.4985314),n(e.x*-.969266+e.y*1.8760108+e.z*.041556),n(e.x*.0556434-e.y*.2040259+e.z*1.0572252),t)}function $l(e){return Xl(Zl(e))}function eu(e,t=1){return Ql(Yl(e),t)}var tu;(function(e){e[e.Burn=0]=`Burn`,e[e.Color=1]=`Color`,e[e.Darken=2]=`Darken`,e[e.Dodge=3]=`Dodge`,e[e.Lighten=4]=`Lighten`,e[e.Multiply=5]=`Multiply`,e[e.Overlay=6]=`Overlay`,e[e.Screen=7]=`Screen`})(tu||={});function nu(e,t){return t.a>=1?t:t.a<=0?new Bl(e.r,e.g,e.b,1):new Bl(t.a*t.r+(1-t.a)*e.r,t.a*t.g+(1-t.a)*e.g,t.a*t.b+(1-t.a)*e.b,1)}function ru(e,t,n){return isNaN(e)||e<=0?t:e>=1?n:new Bl(Il(e,t.r,n.r),Il(e,t.g,n.g),Il(e,t.b,n.b),Il(e,t.a,n.a))}var iu;(function(e){e[e.RGB=0]=`RGB`,e[e.HSL=1]=`HSL`,e[e.HSV=2]=`HSV`,e[e.XYZ=3]=`XYZ`,e[e.LAB=4]=`LAB`,e[e.LCH=5]=`LCH`})(iu||={});var au=/^#((?:[0-9a-f]{6}|[0-9a-f]{3}))$/i;function ou(e){let t=au.exec(e);if(t===null)return null;let n=t[1];if(n.length===3){let e=n.charAt(0),t=n.charAt(1),r=n.charAt(2);n=e.concat(e,t,t,r,r)}let r=parseInt(n,16);return isNaN(r)?null:new Bl(Nl((r&16711680)>>>16,0,255),Nl((r&65280)>>>8,0,255),Nl(r&255,0,255),1)}function su(e,t){let n=e.relativeLuminance>t.relativeLuminance?e:t,r=e.relativeLuminance>t.relativeLuminance?t:e;return(n.relativeLuminance+.05)/(r.relativeLuminance+.05)}var cu=Object.freeze({create(e,t,n){return new uu(e,t,n)},from(e){return new uu(e.r,e.g,e.b)}});function lu(e){let t={r:0,g:0,b:0,toColorString:()=>``,contrast:()=>0,relativeLuminance:0};for(let n in t)if(typeof t[n]!=typeof e[n])return!1;return!0}var uu=class e extends Bl{constructor(e,t,n){super(e,t,n,1),this.toColorString=this.toStringHexRGB,this.contrast=su.bind(null,this),this.createCSS=this.toColorString,this.relativeLuminance=Ul(this)}static fromObject(t){return new e(t.r,t.g,t.b)}};function du(e,t,n=0,r=e.length-1){if(r===n)return e[n];let i=Math.floor((r-n)/2)+n;return t(e[i])?du(e,t,n,i):du(e,t,i+1,r)}var fu=(-.1+Math.sqrt(.21))/2;function pu(e){return e.relativeLuminance<=fu}function mu(e){return pu(e)?-1:1}var hu={stepContrast:1.03,stepContrastRamp:.03,preserveSource:!1};function gu(e,t,n){return typeof e==`number`?vu.from(cu.create(e,t,n)):vu.from(e)}function _u(e,t){return lu(e)?yu.from(e,t):yu.from(cu.create(e.r,e.g,e.b),t)}var vu=Object.freeze({create:gu,from:_u}),yu=class e{constructor(e,t){this.closestIndexCache=new Map,this.source=e,this.swatches=t,this.reversedSwatches=Object.freeze([...this.swatches].reverse()),this.lastIndex=this.swatches.length-1}colorContrast(e,t,n,r){n===void 0&&(n=this.closestIndexOf(e));let i=this.swatches,a=this.lastIndex,o=n;return r===void 0&&(r=mu(e)),r===-1&&(i=this.reversedSwatches,o=a-o),du(i,n=>su(e,n)>=t,o,a)}get(e){return this.swatches[e]||this.swatches[Ml(e,0,this.lastIndex)]}closestIndexOf(e){if(this.closestIndexCache.has(e.relativeLuminance))return this.closestIndexCache.get(e.relativeLuminance);let t=this.swatches.indexOf(e);if(t!==-1)return this.closestIndexCache.set(e.relativeLuminance,t),t;let n=this.swatches.reduce((t,n)=>Math.abs(n.relativeLuminance-e.relativeLuminance)<Math.abs(t.relativeLuminance-e.relativeLuminance)?n:t);return t=this.swatches.indexOf(n),this.closestIndexCache.set(e.relativeLuminance,t),t}static saturationBump(e,t){let n=ql(e).s,r=ql(t);return r.s<n?Jl(new Rl(r.h,n,r.l)):t}static ramp(e){let t=e/100;return t>.5?(t-.5)/.5:2*t}static createHighResolutionPalette(t){let n=[],r=$l(Bl.fromObject(t).roundToPrecision(4)),i=eu(new zl(0,r.a,r.b)).clamp().roundToPrecision(4),a=eu(new zl(50,r.a,r.b)).clamp().roundToPrecision(4),o=eu(new zl(100,r.a,r.b)).clamp().roundToPrecision(4),s=new Bl(0,0,0),c=new Bl(1,1,1),l=o.equalValue(c)?0:14,u=i.equalValue(s)?0:14;for(let t=100+l;t>=0-u;t-=.5){let r;r=t<0?ru(t/u+1,s,i):t<=50?ru(e.ramp(t),i,a):t<=100?ru(e.ramp(t),a,o):ru((t-100)/l,o,c),r=e.saturationBump(a,r).roundToPrecision(4),n.push(cu.from(r))}return new e(t,n)}static adjustEnd(e,t,n,r){let i=r===-1?t.swatches:t.reversedSwatches,a=e=>{let n=t.closestIndexOf(e);return r===1?t.lastIndex-n:n};r===1&&n.reverse();let o=e(n[n.length-2]);if(Ll(su(n[n.length-1],n[n.length-2]),2)<o){n.pop();let e=a(t.colorContrast(i[t.lastIndex],o,void 0,r))-a(n[n.length-2]),s=1;for(let r=n.length-e-1;r<n.length;r++){let e=a(n[r]);n[r]=i[r===n.length-1?t.lastIndex:e+s],s++}}r===1&&n.reverse()}static createColorPaletteByContrast(t,n){let r=e.createHighResolutionPalette(t),i=e=>Ll(n.stepContrast+n.stepContrast*(1-e.relativeLuminance)*n.stepContrastRamp,2),a=[],o=n.preserveSource?t:r.swatches[0];a.push(o);do{let e=i(o);o=r.colorContrast(o,e,void 0,1),a.push(o)}while(o.relativeLuminance>0);if(n.preserveSource){o=t;do{let e=i(o);o=r.colorContrast(o,e,void 0,-1),a.unshift(o)}while(o.relativeLuminance<1)}return this.adjustEnd(i,r,a,-1),n.preserveSource&&this.adjustEnd(i,r,a,1),a}static from(t,n){let r=n===void 0?hu:Object.assign(Object.assign({},hu),n);return new e(t,Object.freeze(e.createColorPaletteByContrast(t,r)))}},bu=cu.create(1,1,1),xu=cu.create(0,0,0),Su=cu.create(.5,.5,.5),Cu=ou(`#0078D4`),wu=cu.create(Cu.r,Cu.g,Cu.b);function Tu(e,t,n,r,i){let a=e=>e.contrast(bu)>=i?bu:xu,o=a(e),s=a(t);return{rest:o,hover:s,active:o.relativeLuminance===s.relativeLuminance?o:a(n),focus:a(r)}}var Eu=class e{constructor(e,t,n,r){this.toColorString=()=>this.cssGradient,this.contrast=su.bind(null,this),this.createCSS=this.toColorString,this.color=new Bl(e,t,n),this.cssGradient=r,this.relativeLuminance=Ul(this.color),this.r=e,this.g=t,this.b=n}static fromObject(t,n){return new e(t.r,t.g,t.b,n)}},Du=new Bl(0,0,0),Ou=new Bl(1,1,1);function ku(e,t,n,r,i,a,o,s,c=10,l=!1){let u=e.closestIndexOf(t);s===void 0&&(s=mu(t));function d(n){if(l){let r=e.closestIndexOf(t),i=e.get(r),a=n.relativeLuminance<t.relativeLuminance?Du:Ou,o=Kl(ou(n.toColorString()),ou(i.toColorString()),a).roundToPrecision(2),s=nu(ou(t.toColorString()),o);return cu.from(s)}else return n}let f=u+s*n,ee=f+s*(r-n),te=f+s*(i-n),ne=f+s*(a-n),re=s===-1?0:100-c,ie=s===-1?c:100;function ae(t,n){let r=e.get(t);if(n){let n=e.get(t+s*o),i=s===-1?n:r,a=s===-1?r:n,c=`linear-gradient(${d(i).toColorString()} ${re}%, ${d(a).toColorString()} ${ie}%)`;return Eu.fromObject(i,c)}else return d(r)}return{rest:ae(f,!0),hover:ae(ee,!0),active:ae(te,!1),focus:ae(ne,!0)}}function Au(e,t,n,r,i,a,o,s){let c=e.closestIndexOf(t),l=mu(t),u=c+l*n,d=u+l*(r-n),f=u+l*(i-n),ee=u+l*(a-n),te=`calc(100% - ${s})`;function ne(t,n){let r=e.get(t);if(n){let n=e.get(t+l*o),i=`linear-gradient(${r.toColorString()} ${te}, ${n.toColorString()} ${te}, ${n.toColorString()})`;return Eu.fromObject(r,i)}else return r}return{rest:ne(u,!0),hover:ne(d,!0),active:ne(f,!1),focus:ne(ee,!0)}}function ju(e,t,n){return e.colorContrast(t,n)}function Mu(e,t,n,r,i,a,o,s){s??=mu(t);let c=e.closestIndexOf(e.colorContrast(t,n));return{rest:e.get(c+s*r),hover:e.get(c+s*i),active:e.get(c+s*a),focus:e.get(c+s*o)}}function Nu(e,t,n,r,i,a,o,s=void 0,c,l,u,d,f,ee=void 0){return pu(t)?Mu(e,t,c,l,u,d,f,ee):Mu(e,t,n,r,i,a,o,s)}function Pu(e,t,n){return e.get(e.closestIndexOf(t)+mu(t)*n)}function Fu(e,t,n,r,i,a,o){let s=e.closestIndexOf(t);return o??=mu(t),{rest:e.get(s+o*n),hover:e.get(s+o*r),active:e.get(s+o*i),focus:e.get(s+o*a)}}function Iu(e,t,n,r,i,a,o=void 0,s,c,l,u,d=void 0){return pu(t)?Fu(e,t,s,c,l,u,d):Fu(e,t,n,r,i,a,o)}function Lu(e,t){return pu(t)?bu:xu}function Ru(e,t,n){return pu(t)?xu:bu}function zu(e){return cu.create(e,e,e)}var Bu;(function(e){e[e.LightMode=.98]=`LightMode`,e[e.DarkMode=.15]=`DarkMode`})(Bu||={});function Vu(e,t){return e.closestIndexOf(zu(t))}function Hu(e,t){return e.get(Vu(e,t))}function Uu(e,t,n){return e.get(Vu(e,t)+n)}function Wu(e,t,n){return e.get(Vu(e,t)+n*-1)}function Gu(e,t,n){return e.get(Vu(e,t)+n*-1*2)}function Ku(e,t,n){return e.get(Vu(e,t)+n*-1*3)}var qu={Thin:100,ExtraLight:200,Light:300,Normal:400,Medium:500,SemiBold:600,Bold:700,ExtraBold:800,Black:900},{create:L}=N;function R(e){return N.create({name:e,cssCustomPropertyName:null})}var Ju=L(`direction`).withDefault(k.ltr),Yu=L(`disabled-opacity`).withDefault(.3),Xu=L(`base-height-multiplier`).withDefault(8),Zu=L(`base-horizontal-spacing-multiplier`).withDefault(3),Qu=L(`density`).withDefault(0),z=L(`design-unit`).withDefault(4),B=L(`control-corner-radius`).withDefault(4),$u=L(`layer-corner-radius`).withDefault(8),V=L(`stroke-width`).withDefault(1),ed=L(`focus-stroke-width`).withDefault(2),td=L(`body-font`).withDefault(`"Segoe UI Variable", "Segoe UI", sans-serif`),nd=L(`font-weight`).withDefault(qu.Normal);function rd(e){return t=>{let n=e.getValueFor(t),r=nd.getValueFor(t);if(n.endsWith(`px`)){let e=Number.parseFloat(n.replace(`px`,``));if(e<=12)return`"wght" ${r}, "opsz" 8`;if(e>24)return`"wght" ${r}, "opsz" 36`}return`"wght" ${r}, "opsz" 10.5`}}var id=L(`type-ramp-base-font-size`).withDefault(`14px`),ad=L(`type-ramp-base-line-height`).withDefault(`20px`),od=L(`type-ramp-base-font-variations`).withDefault(rd(id)),sd=L(`type-ramp-minus-1-font-size`).withDefault(`12px`),cd=L(`type-ramp-minus-1-line-height`).withDefault(`16px`),ld=L(`type-ramp-minus-1-font-variations`).withDefault(rd(sd)),ud=L(`type-ramp-minus-2-font-size`).withDefault(`10px`),dd=L(`type-ramp-minus-2-line-height`).withDefault(`14px`),fd=L(`type-ramp-minus-2-font-variations`).withDefault(rd(ud)),pd=L(`type-ramp-plus-1-font-size`).withDefault(`16px`),md=L(`type-ramp-plus-1-line-height`).withDefault(`22px`),hd=L(`type-ramp-plus-1-font-variations`).withDefault(rd(pd)),gd=L(`type-ramp-plus-2-font-size`).withDefault(`20px`),_d=L(`type-ramp-plus-2-line-height`).withDefault(`26px`),vd=L(`type-ramp-plus-2-font-variations`).withDefault(rd(gd)),yd=L(`type-ramp-plus-3-font-size`).withDefault(`24px`),bd=L(`type-ramp-plus-3-line-height`).withDefault(`32px`),xd=L(`type-ramp-plus-3-font-variations`).withDefault(rd(yd)),Sd=L(`type-ramp-plus-4-font-size`).withDefault(`28px`),Cd=L(`type-ramp-plus-4-line-height`).withDefault(`36px`),wd=L(`type-ramp-plus-4-font-variations`).withDefault(rd(Sd)),Td=L(`type-ramp-plus-5-font-size`).withDefault(`32px`),Ed=L(`type-ramp-plus-5-line-height`).withDefault(`40px`),Dd=L(`type-ramp-plus-5-font-variations`).withDefault(rd(Td)),Od=L(`type-ramp-plus-6-font-size`).withDefault(`40px`),kd=L(`type-ramp-plus-6-line-height`).withDefault(`52px`),Ad=L(`type-ramp-plus-6-font-variations`).withDefault(rd(Od)),jd=L(`base-layer-luminance`).withDefault(Bu.LightMode),Md=R(`accent-fill-rest-delta`).withDefault(0),Nd=R(`accent-fill-hover-delta`).withDefault(-2),Pd=R(`accent-fill-active-delta`).withDefault(-5),Fd=R(`accent-fill-focus-delta`).withDefault(0),Id=R(`accent-foreground-rest-delta`).withDefault(0),Ld=R(`accent-foreground-hover-delta`).withDefault(3),Rd=R(`accent-foreground-active-delta`).withDefault(-8),zd=R(`accent-foreground-focus-delta`).withDefault(0),Bd=R(`neutral-fill-rest-delta`).withDefault(-1),Vd=R(`neutral-fill-hover-delta`).withDefault(1),Hd=R(`neutral-fill-active-delta`).withDefault(0),Ud=R(`neutral-fill-focus-delta`).withDefault(0),Wd=R(`neutral-fill-input-rest-delta`).withDefault(-1),Gd=R(`neutral-fill-input-hover-delta`).withDefault(1),Kd=R(`neutral-fill-input-active-delta`).withDefault(0),qd=R(`neutral-fill-input-focus-delta`).withDefault(-2),Jd=R(`neutral-fill-input-alt-rest-delta`).withDefault(2),Yd=R(`neutral-fill-input-alt-hover-delta`).withDefault(4),Xd=R(`neutral-fill-input-alt-active-delta`).withDefault(6),Zd=R(`neutral-fill-input-alt-focus-delta`).withDefault(2),Qd=R(`neutral-fill-layer-rest-delta`).withDefault(-2),$d=R(`neutral-fill-layer-hover-delta`).withDefault(-3),ef=R(`neutral-fill-layer-active-delta`).withDefault(-3),tf=R(`neutral-fill-layer-alt-rest-delta`).withDefault(-1),nf=R(`neutral-fill-secondary-rest-delta`).withDefault(3),rf=R(`neutral-fill-secondary-hover-delta`).withDefault(2),af=R(`neutral-fill-secondary-active-delta`).withDefault(1),of=R(`neutral-fill-secondary-focus-delta`).withDefault(3),sf=R(`neutral-fill-stealth-rest-delta`).withDefault(0),cf=R(`neutral-fill-stealth-hover-delta`).withDefault(3),lf=R(`neutral-fill-stealth-active-delta`).withDefault(2),uf=R(`neutral-fill-stealth-focus-delta`).withDefault(0),df=R(`neutral-fill-strong-rest-delta`).withDefault(0),ff=R(`neutral-fill-strong-hover-delta`).withDefault(8),pf=R(`neutral-fill-strong-active-delta`).withDefault(-5),mf=R(`neutral-fill-strong-focus-delta`).withDefault(0),hf=R(`neutral-stroke-rest-delta`).withDefault(8),gf=R(`neutral-stroke-hover-delta`).withDefault(12),_f=R(`neutral-stroke-active-delta`).withDefault(6),vf=R(`neutral-stroke-focus-delta`).withDefault(8),yf=R(`neutral-stroke-control-rest-delta`).withDefault(3),bf=R(`neutral-stroke-control-hover-delta`).withDefault(5),xf=R(`neutral-stroke-control-active-delta`).withDefault(5),Sf=R(`neutral-stroke-control-focus-delta`).withDefault(5),Cf=R(`neutral-stroke-divider-rest-delta`).withDefault(4),wf=R(`neutral-stroke-layer-rest-delta`).withDefault(3),Tf=R(`neutral-stroke-layer-hover-delta`).withDefault(3),Ef=R(`neutral-stroke-layer-active-delta`).withDefault(3),Df=R(`neutral-stroke-strong-hover-delta`).withDefault(0),Of=R(`neutral-stroke-strong-active-delta`).withDefault(0),kf=R(`neutral-stroke-strong-focus-delta`).withDefault(0),Af=L(`neutral-base-color`).withDefault(Su),H=R(`neutral-palette`).withDefault(e=>vu.from(Af.getValueFor(e))),jf=L(`accent-base-color`).withDefault(wu),Mf=R(`accent-palette`).withDefault(e=>vu.from(jf.getValueFor(e))),Nf=R(`neutral-layer-card-container-recipe`).withDefault({evaluate:e=>Wu(H.getValueFor(e),jd.getValueFor(e),Qd.getValueFor(e))});L(`neutral-layer-card-container`).withDefault(e=>Nf.getValueFor(e).evaluate(e));var Pf=R(`neutral-layer-floating-recipe`).withDefault({evaluate:e=>Uu(H.getValueFor(e),jd.getValueFor(e),Qd.getValueFor(e))}),Ff=L(`neutral-layer-floating`).withDefault(e=>Pf.getValueFor(e).evaluate(e)),If=R(`neutral-layer-1-recipe`).withDefault({evaluate:e=>Hu(H.getValueFor(e),jd.getValueFor(e))}),Lf=L(`neutral-layer-1`).withDefault(e=>If.getValueFor(e).evaluate(e)),Rf=R(`neutral-layer-2-recipe`).withDefault({evaluate:e=>Wu(H.getValueFor(e),jd.getValueFor(e),Qd.getValueFor(e))});L(`neutral-layer-2`).withDefault(e=>Rf.getValueFor(e).evaluate(e));var zf=R(`neutral-layer-3-recipe`).withDefault({evaluate:e=>Gu(H.getValueFor(e),jd.getValueFor(e),Qd.getValueFor(e))});L(`neutral-layer-3`).withDefault(e=>zf.getValueFor(e).evaluate(e));var Bf=R(`neutral-layer-4-recipe`).withDefault({evaluate:e=>Ku(H.getValueFor(e),jd.getValueFor(e),Qd.getValueFor(e))});L(`neutral-layer-4`).withDefault(e=>Bf.getValueFor(e).evaluate(e));var U=L(`fill-color`).withDefault(e=>Lf.getValueFor(e)),Vf;(function(e){e[e.normal=4.5]=`normal`,e[e.large=3]=`large`})(Vf||={});var Hf=R(`accent-fill-recipe`).withDefault({evaluate:(e,t)=>Nu(Mf.getValueFor(e),t||U.getValueFor(e),5,Md.getValueFor(e),Nd.getValueFor(e),Pd.getValueFor(e),Fd.getValueFor(e),void 0,8,Md.getValueFor(e),Nd.getValueFor(e),Pd.getValueFor(e),Fd.getValueFor(e),void 0)}),W=L(`accent-fill-rest`).withDefault(e=>Hf.getValueFor(e).evaluate(e).rest),Uf=L(`accent-fill-hover`).withDefault(e=>Hf.getValueFor(e).evaluate(e).hover),Wf=L(`accent-fill-active`).withDefault(e=>Hf.getValueFor(e).evaluate(e).active),Gf=L(`accent-fill-focus`).withDefault(e=>Hf.getValueFor(e).evaluate(e).focus),Kf=R(`foreground-on-accent-recipe`).withDefault({evaluate:e=>Tu(W.getValueFor(e),Uf.getValueFor(e),Wf.getValueFor(e),Gf.getValueFor(e),Vf.normal)}),qf=L(`foreground-on-accent-rest`).withDefault(e=>Kf.getValueFor(e).evaluate(e).rest),Jf=L(`foreground-on-accent-hover`).withDefault(e=>Kf.getValueFor(e).evaluate(e).hover),Yf=L(`foreground-on-accent-active`).withDefault(e=>Kf.getValueFor(e).evaluate(e).active);L(`foreground-on-accent-focus`).withDefault(e=>Kf.getValueFor(e).evaluate(e).focus);var Xf=R(`accent-foreground-recipe`).withDefault({evaluate:(e,t)=>Mu(Mf.getValueFor(e),t||U.getValueFor(e),9.5,Id.getValueFor(e),Ld.getValueFor(e),Rd.getValueFor(e),zd.getValueFor(e))}),Zf=L(`accent-foreground-rest`).withDefault(e=>Xf.getValueFor(e).evaluate(e).rest),Qf=L(`accent-foreground-hover`).withDefault(e=>Xf.getValueFor(e).evaluate(e).hover),$f=L(`accent-foreground-active`).withDefault(e=>Xf.getValueFor(e).evaluate(e).active);L(`accent-foreground-focus`).withDefault(e=>Xf.getValueFor(e).evaluate(e).focus);var ep=R(`accent-stroke-control-recipe`).withDefault({evaluate:(e,t)=>ku(H.getValueFor(e),t||U.getValueFor(e),-3,-3,-3,-3,10,1,void 0,!0)}),tp=L(`accent-stroke-control-rest`).withDefault(e=>ep.getValueFor(e).evaluate(e,W.getValueFor(e)).rest),np=L(`accent-stroke-control-hover`).withDefault(e=>ep.getValueFor(e).evaluate(e,Uf.getValueFor(e)).hover),rp=L(`accent-stroke-control-active`).withDefault(e=>ep.getValueFor(e).evaluate(e,Wf.getValueFor(e)).active);L(`accent-stroke-control-focus`).withDefault(e=>ep.getValueFor(e).evaluate(e,Gf.getValueFor(e)).focus);var ip=R(`neutral-fill-recipe`).withDefault({evaluate:(e,t)=>Iu(H.getValueFor(e),t||U.getValueFor(e),Bd.getValueFor(e),Vd.getValueFor(e),Hd.getValueFor(e),Ud.getValueFor(e),void 0,2,3,1,2,void 0)}),ap=L(`neutral-fill-rest`).withDefault(e=>ip.getValueFor(e).evaluate(e).rest),op=L(`neutral-fill-hover`).withDefault(e=>ip.getValueFor(e).evaluate(e).hover),sp=L(`neutral-fill-active`).withDefault(e=>ip.getValueFor(e).evaluate(e).active);L(`neutral-fill-focus`).withDefault(e=>ip.getValueFor(e).evaluate(e).focus);var cp=R(`neutral-fill-input-recipe`).withDefault({evaluate:(e,t)=>Iu(H.getValueFor(e),t||U.getValueFor(e),Wd.getValueFor(e),Gd.getValueFor(e),Kd.getValueFor(e),qd.getValueFor(e),void 0,2,3,1,0,void 0)}),lp=L(`neutral-fill-input-rest`).withDefault(e=>cp.getValueFor(e).evaluate(e).rest),up=L(`neutral-fill-input-hover`).withDefault(e=>cp.getValueFor(e).evaluate(e).hover);L(`neutral-fill-input-active`).withDefault(e=>cp.getValueFor(e).evaluate(e).active);var dp=L(`neutral-fill-input-focus`).withDefault(e=>cp.getValueFor(e).evaluate(e).focus),fp=R(`neutral-fill-input-alt-recipe`).withDefault({evaluate:(e,t)=>Iu(H.getValueFor(e),t||U.getValueFor(e),Jd.getValueFor(e),Yd.getValueFor(e),Xd.getValueFor(e),Zd.getValueFor(e),1,Jd.getValueFor(e),Jd.getValueFor(e)-Yd.getValueFor(e),Jd.getValueFor(e)-Xd.getValueFor(e),Zd.getValueFor(e),1)}),pp=L(`neutral-fill-input-alt-rest`).withDefault(e=>fp.getValueFor(e).evaluate(e).rest),mp=L(`neutral-fill-input-alt-hover`).withDefault(e=>fp.getValueFor(e).evaluate(e).hover),hp=L(`neutral-fill-input-alt-active`).withDefault(e=>fp.getValueFor(e).evaluate(e).active),gp=L(`neutral-fill-input-alt-focus`).withDefault(e=>fp.getValueFor(e).evaluate(e).focus),_p=R(`neutral-fill-layer-recipe`).withDefault({evaluate:(e,t)=>Fu(H.getValueFor(e),t||U.getValueFor(e),Qd.getValueFor(e),$d.getValueFor(e),ef.getValueFor(e),Qd.getValueFor(e),1)}),vp=L(`neutral-fill-layer-rest`).withDefault(e=>_p.getValueFor(e).evaluate(e).rest);L(`neutral-fill-layer-hover`).withDefault(e=>_p.getValueFor(e).evaluate(e).hover),L(`neutral-fill-layer-active`).withDefault(e=>_p.getValueFor(e).evaluate(e).active);var yp=R(`neutral-fill-layer-alt-recipe`).withDefault({evaluate:(e,t)=>Fu(H.getValueFor(e),t||U.getValueFor(e),tf.getValueFor(e),tf.getValueFor(e),tf.getValueFor(e),tf.getValueFor(e))}),bp=L(`neutral-fill-layer-alt-rest`).withDefault(e=>yp.getValueFor(e).evaluate(e).rest),xp=R(`neutral-fill-secondary-recipe`).withDefault({evaluate:(e,t)=>Fu(H.getValueFor(e),t||U.getValueFor(e),nf.getValueFor(e),rf.getValueFor(e),af.getValueFor(e),of.getValueFor(e))}),Sp=L(`neutral-fill-secondary-rest`).withDefault(e=>xp.getValueFor(e).evaluate(e).rest),Cp=L(`neutral-fill-secondary-hover`).withDefault(e=>xp.getValueFor(e).evaluate(e).hover),wp=L(`neutral-fill-secondary-active`).withDefault(e=>xp.getValueFor(e).evaluate(e).active),Tp=L(`neutral-fill-secondary-focus`).withDefault(e=>xp.getValueFor(e).evaluate(e).focus),Ep=R(`neutral-fill-stealth-recipe`).withDefault({evaluate:(e,t)=>Fu(H.getValueFor(e),t||U.getValueFor(e),sf.getValueFor(e),cf.getValueFor(e),lf.getValueFor(e),uf.getValueFor(e))}),Dp=L(`neutral-fill-stealth-rest`).withDefault(e=>Ep.getValueFor(e).evaluate(e).rest),Op=L(`neutral-fill-stealth-hover`).withDefault(e=>Ep.getValueFor(e).evaluate(e).hover),kp=L(`neutral-fill-stealth-active`).withDefault(e=>Ep.getValueFor(e).evaluate(e).active),Ap=L(`neutral-fill-stealth-focus`).withDefault(e=>Ep.getValueFor(e).evaluate(e).focus),jp=R(`neutral-fill-strong-recipe`).withDefault({evaluate:(e,t)=>Mu(H.getValueFor(e),t||U.getValueFor(e),4.5,df.getValueFor(e),ff.getValueFor(e),pf.getValueFor(e),mf.getValueFor(e))}),Mp=L(`neutral-fill-strong-rest`).withDefault(e=>jp.getValueFor(e).evaluate(e).rest),Np=L(`neutral-fill-strong-hover`).withDefault(e=>jp.getValueFor(e).evaluate(e).hover),Pp=L(`neutral-fill-strong-active`).withDefault(e=>jp.getValueFor(e).evaluate(e).active);L(`neutral-fill-strong-focus`).withDefault(e=>jp.getValueFor(e).evaluate(e).focus);var Fp=R(`neutral-foreground-recipe`).withDefault({evaluate:(e,t)=>Mu(H.getValueFor(e),t||U.getValueFor(e),16,0,-19,-30,0)}),G=L(`neutral-foreground-rest`).withDefault(e=>Fp.getValueFor(e).evaluate(e).rest),Ip=L(`neutral-foreground-hover`).withDefault(e=>Fp.getValueFor(e).evaluate(e).hover),Lp=L(`neutral-foreground-active`).withDefault(e=>Fp.getValueFor(e).evaluate(e).active);L(`neutral-foreground-focus`).withDefault(e=>Fp.getValueFor(e).evaluate(e).focus);var Rp=R(`neutral-foreground-hint-recipe`).withDefault({evaluate:(e,t)=>ju(H.getValueFor(e),t||U.getValueFor(e),4.5)}),zp=L(`neutral-foreground-hint`).withDefault(e=>Rp.getValueFor(e).evaluate(e)),Bp=R(`neutral-stroke-recipe`).withDefault({evaluate:(e,t)=>Fu(H.getValueFor(e),t||U.getValueFor(e),hf.getValueFor(e),gf.getValueFor(e),_f.getValueFor(e),vf.getValueFor(e))}),Vp=L(`neutral-stroke-rest`).withDefault(e=>Bp.getValueFor(e).evaluate(e).rest),Hp=L(`neutral-stroke-hover`).withDefault(e=>Bp.getValueFor(e).evaluate(e).hover),Up=L(`neutral-stroke-active`).withDefault(e=>Bp.getValueFor(e).evaluate(e).active);L(`neutral-stroke-focus`).withDefault(e=>Bp.getValueFor(e).evaluate(e).focus);var Wp=R(`neutral-stroke-control-recipe`).withDefault({evaluate:(e,t)=>ku(H.getValueFor(e),t||U.getValueFor(e),yf.getValueFor(e),bf.getValueFor(e),xf.getValueFor(e),Sf.getValueFor(e),5)}),Gp=L(`neutral-stroke-control-rest`).withDefault(e=>Wp.getValueFor(e).evaluate(e).rest),Kp=L(`neutral-stroke-control-hover`).withDefault(e=>Wp.getValueFor(e).evaluate(e).hover),qp=L(`neutral-stroke-control-active`).withDefault(e=>Wp.getValueFor(e).evaluate(e).active);L(`neutral-stroke-control-focus`).withDefault(e=>Wp.getValueFor(e).evaluate(e).focus);var Jp=R(`neutral-stroke-divider-recipe`).withDefault({evaluate:(e,t)=>Pu(H.getValueFor(e),t||U.getValueFor(e),Cf.getValueFor(e))}),Yp=L(`neutral-stroke-divider-rest`).withDefault(e=>Jp.getValueFor(e).evaluate(e)),Xp=R(`neutral-stroke-input-recipe`).withDefault({evaluate:(e,t)=>Au(H.getValueFor(e),t||U.getValueFor(e),yf.getValueFor(e),bf.getValueFor(e),xf.getValueFor(e),Sf.getValueFor(e),20,V.getValueFor(e)+`px`)}),Zp=L(`neutral-stroke-input-rest`).withDefault(e=>Xp.getValueFor(e).evaluate(e).rest),Qp=L(`neutral-stroke-input-hover`).withDefault(e=>Xp.getValueFor(e).evaluate(e).hover);L(`neutral-stroke-input-active`).withDefault(e=>Xp.getValueFor(e).evaluate(e).active),L(`neutral-stroke-input-focus`).withDefault(e=>Xp.getValueFor(e).evaluate(e).focus);var $p=R(`neutral-stroke-layer-recipe`).withDefault({evaluate:(e,t)=>Fu(H.getValueFor(e),t||U.getValueFor(e),wf.getValueFor(e),Tf.getValueFor(e),Ef.getValueFor(e),wf.getValueFor(e))}),em=L(`neutral-stroke-layer-rest`).withDefault(e=>$p.getValueFor(e).evaluate(e).rest);L(`neutral-stroke-layer-hover`).withDefault(e=>$p.getValueFor(e).evaluate(e).hover),L(`neutral-stroke-layer-active`).withDefault(e=>$p.getValueFor(e).evaluate(e).active);var tm=R(`neutral-stroke-strong-recipe`).withDefault({evaluate:(e,t)=>Mu(H.getValueFor(e),t||U.getValueFor(e),5.5,0,Df.getValueFor(e),Of.getValueFor(e),kf.getValueFor(e))}),nm=L(`neutral-stroke-strong-rest`).withDefault(e=>tm.getValueFor(e).evaluate(e).rest),rm=L(`neutral-stroke-strong-hover`).withDefault(e=>tm.getValueFor(e).evaluate(e).hover),im=L(`neutral-stroke-strong-active`).withDefault(e=>tm.getValueFor(e).evaluate(e).active);L(`neutral-stroke-strong-focus`).withDefault(e=>tm.getValueFor(e).evaluate(e).focus);var am=R(`focus-stroke-outer-recipe`).withDefault({evaluate:e=>Lu(H.getValueFor(e),U.getValueFor(e))}),om=L(`focus-stroke-outer`).withDefault(e=>am.getValueFor(e).evaluate(e)),sm=R(`focus-stroke-inner-recipe`).withDefault({evaluate:e=>Ru(Mf.getValueFor(e),U.getValueFor(e),om.getValueFor(e))}),cm=L(`focus-stroke-inner`).withDefault(e=>sm.getValueFor(e).evaluate(e)),lm=R(`foreground-on-accent-large-recipe`).withDefault({evaluate:e=>Tu(W.getValueFor(e),Uf.getValueFor(e),Wf.getValueFor(e),Gf.getValueFor(e),Vf.large)});L(`foreground-on-accent-rest-large`).withDefault(e=>lm.getValueFor(e).evaluate(e).rest),L(`foreground-on-accent-hover-large`).withDefault(e=>lm.getValueFor(e).evaluate(e,Uf.getValueFor(e)).hover),L(`foreground-on-accent-active-large`).withDefault(e=>lm.getValueFor(e).evaluate(e,Wf.getValueFor(e)).active),L(`foreground-on-accent-focus-large`).withDefault(e=>lm.getValueFor(e).evaluate(e,Gf.getValueFor(e)).focus);var um=L(`neutral-fill-inverse-rest-delta`).withDefault(0),dm=L(`neutral-fill-inverse-hover-delta`).withDefault(-3),fm=L(`neutral-fill-inverse-active-delta`).withDefault(7),pm=L(`neutral-fill-inverse-focus-delta`).withDefault(0);function mm(e,t,n,r,i,a){let o=mu(t),s=e.closestIndexOf(e.colorContrast(t,14)),c=s+o*Math.abs(n-r),l=o===1?n<r:o*n>o*r,u,d;return l?(u=s,d=c):(u=c,d=s),{rest:e.get(u),hover:e.get(d),active:e.get(u+o*i),focus:e.get(u+o*a)}}var hm=R(`neutral-fill-inverse-recipe`).withDefault({evaluate:(e,t)=>mm(H.getValueFor(e),t||U.getValueFor(e),um.getValueFor(e),dm.getValueFor(e),fm.getValueFor(e),pm.getValueFor(e))});L(`neutral-fill-inverse-rest`).withDefault(e=>hm.getValueFor(e).evaluate(e).rest),L(`neutral-fill-inverse-hover`).withDefault(e=>hm.getValueFor(e).evaluate(e).hover),L(`neutral-fill-inverse-active`).withDefault(e=>hm.getValueFor(e).evaluate(e).active),L(`neutral-fill-inverse-focus`).withDefault(e=>hm.getValueFor(e).evaluate(e).focus);var K=jr`
  font-family: ${td};
  font-size: ${id};
  line-height: ${ad};
  font-weight: initial;
  font-variation-settings: ${od};
`,gm=jr`
  font-family: ${td};
  font-size: ${sd};
  line-height: ${cd};
  font-weight: initial;
  font-variation-settings: ${ld};
`;jr`
  font-family: ${td};
  font-size: ${ud};
  line-height: ${dd};
  font-weight: initial;
  font-variation-settings: ${fd};
`,jr`
  font-family: ${td};
  font-size: ${pd};
  line-height: ${md};
  font-weight: initial;
  font-variation-settings: ${hd};
`,jr`
  font-family: ${td};
  font-size: ${gd};
  line-height: ${_d};
  font-weight: initial;
  font-variation-settings: ${vd};
`,jr`
  font-family: ${td};
  font-size: ${yd};
  line-height: ${bd};
  font-weight: initial;
  font-variation-settings: ${xd};
`,jr`
  font-family: ${td};
  font-size: ${Sd};
  line-height: ${Cd};
  font-weight: initial;
  font-variation-settings: ${wd};
`,jr`
  font-family: ${td};
  font-size: ${Td};
  line-height: ${Ed};
  font-weight: initial;
  font-variation-settings: ${Dd};
`,jr`
  font-family: ${td};
  font-size: ${Od};
  line-height: ${kd};
  font-weight: initial;
  font-variation-settings: ${Ad};
`;var _m=(e,t)=>b`
    ${F(`flex`)} :host {
      box-sizing: border-box;
      flex-direction: column;
      ${K}
      color: ${G};
      gap: calc(${z} * 1px);
    }
  `,vm=jr`
  outline: calc(${ed} * 1px) solid ${om};
  outline-offset: calc(${ed} * -1px);
`,ym=jr`
  outline: calc(${ed} * 1px) solid ${om};
  outline-offset: calc(${V} * 1px);
`,q=jr`(${Xu} + ${Qu}) * ${z}`,bm=N.create(`neutral-fill-stealth-rest-on-neutral-fill-layer-rest`).withDefault(e=>{let t=_p.getValueFor(e);return Ep.getValueFor(e).evaluate(e,t.evaluate(e).rest).rest}),xm=N.create(`neutral-fill-stealth-hover-on-neutral-fill-layer-rest`).withDefault(e=>{let t=_p.getValueFor(e);return Ep.getValueFor(e).evaluate(e,t.evaluate(e).rest).hover}),Sm=N.create(`neutral-fill-stealth-active-on-neutral-fill-layer-rest`).withDefault(e=>{let t=_p.getValueFor(e);return Ep.getValueFor(e).evaluate(e,t.evaluate(e).rest).active}),Cm=ia.compose({baseName:`accordion-item`,template:_i,styles:(e,t)=>b`
    ${F(`flex`)} :host {
      box-sizing: border-box;
      ${K};
      flex-direction: column;
      background: ${vp};
      color: ${G};
      border: calc(${V} * 1px) solid ${em};
      border-radius: calc(${$u} * 1px);
    }

    .region {
      display: none;
      padding: calc(${z} * 2 * 1px);
      background: ${bp};
    }

    .heading {
      display: grid;
      position: relative;
      grid-template-columns: auto 1fr auto auto;
      align-items: center;
    }

    .button {
      appearance: none;
      border: none;
      background: none;
      grid-column: 2;
      grid-row: 1;
      outline: none;
      margin: calc(${z} * 3 * 1px) 0;
      padding: 0 calc(${z} * 2 * 1px);
      text-align: left;
      color: inherit;
      cursor: pointer;
      font: inherit;
    }

    .button::before {
      content: '';
      position: absolute;
      top: calc(${V} * -1px);
      left: calc(${V} * -1px);
      right: calc(${V} * -1px);
      bottom: calc(${V} * -1px);
      cursor: pointer;
    }

    .button:${I}::before {
      ${vm}
      border-radius: calc(${$u} * 1px);
    }

    :host(.expanded) .button:${I}::before {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    :host(.expanded) .region {
      display: block;
      border-top: calc(${V} * 1px) solid ${em};
      border-bottom-left-radius: calc((${$u} - ${V}) * 1px);
      border-bottom-right-radius: calc((${$u} - ${V}) * 1px);
    }

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      grid-column: 4;
      pointer-events: none;
      background: ${bm};
      border-radius: calc(${B} * 1px);
      fill: currentcolor;
      width: calc(${q} * 1px);
      height: calc(${q} * 1px);
      margin: calc(${z} * 2 * 1px);
    }

    .heading:hover .icon {
      background: ${xm};
    }

    .heading:active .icon {
      background: ${Sm};
    }

    slot[name='collapsed-icon'] {
      display: flex;
    }

    :host(.expanded) slot[name='collapsed-icon'] {
      display: none;
    }

    slot[name='expanded-icon'] {
      display: none;
    }

    :host(.expanded) slot[name='expanded-icon'] {
      display: flex;
    }

    .start {
      display: flex;
      align-items: center;
      padding-inline-start: calc(${z} * 2 * 1px);
      justify-content: center;
      grid-column: 1;
    }

    .end {
      display: flex;
      align-items: center;
      justify-content: center;
      grid-column: 3;
    }

    .icon,
    .start,
    .end {
      position: relative;
    }
  `.withBehaviors(P(b`
        .button:${I}::before {
          outline-color: ${A.Highlight};
        }
        .icon {
          fill: ${A.ButtonText};
        }
      `)),collapsedIcon:`
    <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.15 4.65c.2-.2.5-.2.7 0L6 7.79l3.15-3.14a.5.5 0 11.7.7l-3.5 3.5a.5.5 0 01-.7 0l-3.5-3.5a.5.5 0 010-.7z"/>
    </svg>
  `,expandedIcon:`
    <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.15 7.35c.2.2.5.2.7 0L6 4.21l3.15 3.14a.5.5 0 10.7-.7l-3.5-3.5a.5.5 0 00-.7 0l-3.5 3.5a.5.5 0 000 .7z"/>
    </svg>
  `}),wm=Ia.compose({baseName:`accordion`,template:aa,styles:_m});function J(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}var Tm=class{constructor(e,t){this.cache=new WeakMap,this.ltr=e,this.rtl=t}bind(e){this.attach(e)}unbind(e){let t=this.cache.get(e);t&&Ju.unsubscribe(t)}attach(e){let t=this.cache.get(e)||new Em(this.ltr,this.rtl,e),n=Ju.getValueFor(e);Ju.subscribe(t),t.attach(n),this.cache.set(e,t)}},Em=class{constructor(e,t,n){this.ltr=e,this.rtl=t,this.source=n,this.attached=null}handleChange({target:e,token:t}){this.attach(t.getValueFor(this.source))}attach(e){this.attached!==this[e]&&(this.attached!==null&&this.source.$fastController.removeStyles(this.attached),this.attached=this[e],this.attached!==null&&this.source.$fastController.addStyles(this.attached))}},Dm=N.create({name:`elevation-shadow`,cssCustomPropertyName:null}).withDefault({evaluate:(e,t,n)=>{let r=.12,i=.14;return t>16&&(r=.2,i=.24),`${`0 0 2px rgba(0, 0, 0, ${r})`}, ${`0 calc(${t} * 0.5px) calc((${t} * 1px)) rgba(0, 0, 0, ${i})`}`}}),Om=N.create(`elevation-shadow-card-rest-size`).withDefault(4),km=N.create(`elevation-shadow-card-hover-size`).withDefault(8),Am=N.create(`elevation-shadow-card-active-size`).withDefault(0),jm=N.create(`elevation-shadow-card-focus-size`).withDefault(8),Mm=N.create(`elevation-shadow-card-rest`).withDefault(e=>Dm.getValueFor(e).evaluate(e,Om.getValueFor(e)));N.create(`elevation-shadow-card-hover`).withDefault(e=>Dm.getValueFor(e).evaluate(e,km.getValueFor(e))),N.create(`elevation-shadow-card-active`).withDefault(e=>Dm.getValueFor(e).evaluate(e,Am.getValueFor(e))),N.create(`elevation-shadow-card-focus`).withDefault(e=>Dm.getValueFor(e).evaluate(e,jm.getValueFor(e)));var Nm=N.create(`elevation-shadow-tooltip-size`).withDefault(16),Pm=N.create(`elevation-shadow-tooltip`).withDefault(e=>Dm.getValueFor(e).evaluate(e,Nm.getValueFor(e))),Fm=N.create(`elevation-shadow-flyout-size`).withDefault(32),Im=N.create(`elevation-shadow-flyout`).withDefault(e=>Dm.getValueFor(e).evaluate(e,Fm.getValueFor(e))),Lm=N.create(`elevation-shadow-dialog-size`).withDefault(128),Rm=N.create(`elevation-shadow-dialog`).withDefault(e=>Dm.getValueFor(e).evaluate(e,Lm.getValueFor(e))),zm=(e,t,n,r=`[disabled]`)=>b`
    ${F(`inline-flex`)}
    
    :host {
      position: relative;
      box-sizing: border-box;
      ${K}
      height: calc(${q} * 1px);
      min-width: calc(${q} * 1px);
      color: ${G};
      border-radius: calc(${B} * 1px);
      fill: currentcolor;
    }

    .control {
      border: calc(${V} * 1px) solid transparent;
      flex-grow: 1;
      box-sizing: border-box;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      padding: 0 calc((10 + (${z} * 2 * ${Qu})) * 1px);
      white-space: nowrap;
      outline: none;
      text-decoration: none;
      color: inherit;
      border-radius: inherit;
      fill: inherit;
      font-family: inherit;
    }

    .control,
    .end,
    .start {
      font: inherit;
    }

    .control.icon-only {
      padding: 0;
      line-height: 0;
    }

    .control:${I} {
      ${vm}
    }

    .control::-moz-focus-inner {
      border: 0;
    }

    .content {
      pointer-events: none;
    }

    .start,
    .end {
      display: flex;
      pointer-events: none;
    }

    .start {
      margin-inline-end: 11px;
    }

    .end {
      margin-inline-start: 11px;
    }
  `,Bm=(e,t,n,r=`[disabled]`)=>b`
    .control {
      background: padding-box linear-gradient(${ap}, ${ap}),
        border-box ${Gp};
    }

    :host(${n}:hover) .control {
      background: padding-box linear-gradient(${op}, ${op}),
        border-box ${Kp};
    }

    :host(${n}:active) .control {
      background: padding-box linear-gradient(${sp}, ${sp}),
        border-box ${qp};
    }

    :host(${r}) .control {
      background: padding-box linear-gradient(${ap}, ${ap}),
        border-box ${Vp};
    }
  `.withBehaviors(P(b`
        .control {
          background: ${A.ButtonFace};
          border-color: ${A.ButtonText};
          color: ${A.ButtonText};
        }

        :host(${n}:hover) .control,
        :host(${n}:active) .control {
          forced-color-adjust: none;
          background: ${A.HighlightText};
          border-color: ${A.Highlight};
          color: ${A.Highlight};
        }

        :host(${r}) .control {
          background: transparent;
          border-color: ${A.GrayText};
          color: ${A.GrayText};
        }

        .control:${I} {
          outline-color: ${A.CanvasText};
        }

        :host([href]) .control {
          background: transparent;
          border-color: ${A.LinkText};
          color: ${A.LinkText};
        }

        :host([href]:hover) .control,
        :host([href]:active) .control {
          background: transparent;
          border-color: ${A.CanvasText};
          color: ${A.CanvasText};
        }
    `)),Vm=(e,t,n,r=`[disabled]`)=>b`
    .control {
      background: padding-box linear-gradient(${W}, ${W}),
        border-box ${tp};
      color: ${qf};
    }

    :host(${n}:hover) .control {
      background: padding-box linear-gradient(${Uf}, ${Uf}),
        border-box ${np};
      color: ${Jf};
    }

    :host(${n}:active) .control {
      background: padding-box linear-gradient(${Wf}, ${Wf}),
        border-box ${rp};
      color: ${Yf};
    }

    :host(${r}) .control {
      background: ${W};
    }

    .control:${I} {
      box-shadow: 0 0 0 calc(${ed} * 1px) ${cm} inset !important;
    }
  `.withBehaviors(P(b`
        .control {
          forced-color-adjust: none;
          background: ${A.Highlight};
          color: ${A.HighlightText};
        }

        :host(${n}:hover) .control,
        :host(${n}:active) .control {
          background: ${A.HighlightText};
          border-color: ${A.Highlight};
          color: ${A.Highlight};
        }

        :host(${r}) .control {
          background: transparent;
          border-color: ${A.GrayText};
          color: ${A.GrayText};
        }

        .control:${I} {
          outline-color: ${A.CanvasText};
          box-shadow: 0 0 0 calc(${ed} * 1px) ${A.HighlightText} inset !important;
        }

        :host([href]) .control {
          background: ${A.LinkText};
          color: ${A.HighlightText};
        }

        :host([href]:hover) .control,
        :host([href]:active) .control {
          background: ${A.ButtonFace};
          border-color: ${A.LinkText};
          color: ${A.LinkText};
        }
      `)),Hm=(e,t,n,r=`[disabled]`)=>b`
    :host {
      height: auto;
      font-family: inherit;
      font-size: inherit;
      line-height: inherit;
      min-width: 0;
    }

    .control {
      display: inline;
      padding: 0;
      border: none;
      box-shadow: none;
      line-height: 1;
    }

    :host(${n}) .control {
      color: ${Zf};
      text-decoration: underline 1px;
    }

    :host(${n}:hover) .control {
      color: ${Qf};
      text-decoration: none;
    }

    :host(${n}:active) .control {
      color: ${$f};
      text-decoration: none;
    }

    .control:${I} {
      ${ym}
    }
  `.withBehaviors(P(b`
        :host(${n}) .control {
          color: ${A.LinkText};
        }

        :host(${n}:hover) .control,
        :host(${n}:active) .control {
          color: ${A.CanvasText};
        }

        .control:${I} {
          outline-color: ${A.CanvasText};
        }
      `)),Um=(e,t,n,r=`[disabled]`)=>b`
    :host {
      color: ${Zf};
    }

    .control {
      background: ${Dp};
    }

    :host(${n}:hover) .control {
      background: ${Op};
      color: ${Qf};
    }

    :host(${n}:active) .control {
      background: ${kp};
      color: ${$f};
    }

    :host(${r}) .control {
      background: ${Dp};
    }
  `.withBehaviors(P(b`
        :host {
          color: ${A.ButtonText};
        }

        .control {
          forced-color-adjust: none;
          background: transparent;
        }

        :host(${n}:hover) .control,
        :host(${n}:active) .control {
          background: transparent;
          border-color: ${A.ButtonText};
          color: ${A.ButtonText};
        }

        :host(${r}) .control {
          background: transparent;
          color: ${A.GrayText};
        }

        .control:${I} {
          outline-color: ${A.CanvasText};
        }

        :host([href]) .control {
          color: ${A.LinkText};
        }

        :host([href]:hover) .control,
        :host([href]:active) .control {
          border-color: ${A.LinkText};
          color: ${A.LinkText};
        }
      `)),Wm=(e,t,n,r=`[disabled]`)=>b`
    .control {
      background: transparent !important;
      border-color: ${Vp};
    }

    :host(${n}:hover) .control {
      border-color: ${Hp};
    }

    :host(${n}:active) .control {
      border-color: ${Up};
    }

    :host(${r}) .control {
      background: transparent !important;
      border-color: ${Vp};
    }
  `.withBehaviors(P(b`
        .control {
          border-color: ${A.ButtonText};
          color: ${A.ButtonText};
        }

        :host(${n}:hover) .control,
        :host(${n}:active) .control {
          background: ${A.HighlightText};
          border-color: ${A.Highlight};
          color: ${A.Highlight};
        }

        :host(${r}) .control {
          border-color: ${A.GrayText};
          color: ${A.GrayText};
        }

        .control:${I} {
          outline-color: ${A.CanvasText};
        }

        :host([href]) .control {
          border-color: ${A.LinkText};
          color: ${A.LinkText};
        }

        :host([href]:hover) .control,
        :host([href]:active) .control {
          border-color: ${A.CanvasText};
          color: ${A.CanvasText};
        }
      `)),Gm=(e,t,n,r=`[disabled]`)=>b`
    .control {
      background: ${Dp};
    }

    :host(${n}:hover) .control {
      background: ${Op};
    }

    :host(${n}:active) .control {
      background: ${kp};
    }

    :host(${r}) .control {
      background: ${Dp};
    }
  `.withBehaviors(P(b`
        .control {
          forced-color-adjust: none;
          background: transparent;
          color: ${A.ButtonText};
        }

        :host(${n}:hover) .control,
        :host(${n}:active) .control {
          background: transparent;
          border-color: ${A.ButtonText};
          color: ${A.ButtonText};
        }

        :host(${r}) .control {
          background: transparent;
          color: ${A.GrayText};
        }
        
        .control:${I} {
          outline-color: ${A.CanvasText};
        }

        :host([href]) .control {
          color: ${A.LinkText};
        }

        :host([href]:hover) .control,
        :host([href]:active) .control {
          background: transparent;
          border-color: ${A.LinkText};
          color: ${A.LinkText};
        }
      `)),Km=N.create(`input-placeholder-rest`).withDefault(e=>{let t=cp.getValueFor(e);return Rp.getValueFor(e).evaluate(e,t.evaluate(e).rest)}),qm=N.create(`input-placeholder-hover`).withDefault(e=>{let t=cp.getValueFor(e);return Rp.getValueFor(e).evaluate(e,t.evaluate(e).hover)}),Jm=N.create(`input-filled-placeholder-rest`).withDefault(e=>{let t=xp.getValueFor(e);return Rp.getValueFor(e).evaluate(e,t.evaluate(e).rest)}),Ym=N.create(`input-filled-placeholder-hover`).withDefault(e=>{let t=xp.getValueFor(e);return Rp.getValueFor(e).evaluate(e,t.evaluate(e).hover)}),Xm=(e,t,n)=>b`
  :host {
    ${K}
    color: ${G};
    fill: currentcolor;
    user-select: none;
    position: relative;
  }

  ${n} {
    box-sizing: border-box;
    position: relative;
    color: inherit;
    border: calc(${V} * 1px) solid transparent;
    border-radius: calc(${B} * 1px);
    height: calc(${q} * 1px);
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  .control {
    width: 100%;
    outline: none;
  }

  .label {
    display: block;
    color: ${G};
    cursor: pointer;
    ${K}
    margin-bottom: 4px;
  }

  .label__hidden {
    display: none;
    visibility: hidden;
  }

  :host([disabled]) ${n},
  :host([readonly]) ${n},
  :host([disabled]) .label,
  :host([readonly]) .label,
  :host([disabled]) .control,
  :host([readonly]) .control {
    cursor: ${Al};
  }

  :host([disabled]) {
    opacity: ${Yu};
  }
`,Zm=(e,t,n)=>b`
  @media (forced-colors: none) {
    :host(:not([disabled]):active)::after {
      left: 50%;
      width: 40%;
      transform: translateX(-50%);
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    :host(:not([disabled]):focus-within)::after {
      left: 0;
      width: 100%;
      transform: none;
    }

    :host(:not([disabled]):active)::after,
    :host(:not([disabled]):focus-within:not(:active))::after {
      content: '';
      position: absolute;
      height: calc(${ed} * 1px);
      bottom: 0;
      border-bottom: calc(${ed} * 1px) solid ${W};
      border-bottom-left-radius: calc(${B} * 1px);
      border-bottom-right-radius: calc(${B} * 1px);
      z-index: 2;
      transition: all 300ms cubic-bezier(0.1, 0.9, 0.2, 1);
    }
  }
`,Qm=(e,t,n,r=`:not([disabled]):not(:focus-within)`)=>b`
  ${n} {
    background: padding-box linear-gradient(${lp}, ${lp}),
      border-box ${Zp};
  }

  :host(${r}:hover) ${n} {
    background: padding-box linear-gradient(${up}, ${up}),
      border-box ${Qp};
  }

  :host(:not([disabled]):focus-within) ${n} {
    background: padding-box linear-gradient(${dp}, ${dp}),
      border-box ${Zp};
  }
  
  :host([disabled]) ${n} {
    background: padding-box linear-gradient(${lp}, ${lp}),
      border-box ${Vp};
  }

  .control::placeholder {
    color: ${Km};
  }

  :host(${r}:hover) .control::placeholder {
    color: ${qm};
  }
`,$m=(e,t,n,r=`:not([disabled]):not(:focus-within)`)=>b`
  ${n} {
    background: ${Sp};
  }

  :host(${r}:hover) ${n} {
    background: ${Cp};
  }

  :host(:not([disabled]):focus-within) ${n} {
    background: ${Tp};
  }

  :host([disabled]) ${n} {
    background: ${Sp};
  }

  .control::placeholder {
    color: ${Jm};
  }

  :host(${r}:hover) .control::placeholder {
    color: ${Ym};
  }
`,eh=(e,t,n,r=`:not([disabled]):not(:focus-within)`)=>b`
  :host {
    color: ${A.ButtonText};
  }

  ${n} {
    background: ${A.ButtonFace};
    border-color: ${A.ButtonText};
  }

  :host(${r}:hover) ${n},
  :host(:not([disabled]):focus-within) ${n} {
    border-color: ${A.Highlight};
  }

  :host([disabled]) ${n} {
    opacity: 1;
    background: ${A.ButtonFace};
    border-color: ${A.GrayText};
  }

  .control::placeholder,
  :host(${r}:hover) .control::placeholder {
    color: ${A.CanvasText};
  }

  :host(:not([disabled]):focus) ${n} {
    ${vm}
    outline-color: ${A.Highlight};
  }

  :host([disabled]) {
    opacity: 1;
    color: ${A.GrayText};
  }

  :host([disabled]) ::placeholder,
  :host([disabled]) ::-webkit-input-placeholder {
    color: ${A.GrayText};
  }
`;function Y(e,t){return new kl(`appearance`,e,t)}var th=`[href]`,nh=(e,t)=>zm(e,t,th).withBehaviors(Y(`neutral`,Bm(e,t,th)),Y(`accent`,Vm(e,t,th)),Y(`hypertext`,Hm(e,t,th)),Y(`lightweight`,Um(e,t,th)),Y(`outline`,Wm(e,t,th)),Y(`stealth`,Gm(e,t,th))),rh=class extends Ra{appearanceChanged(e,t){e!==t&&(this.classList.add(t),this.classList.remove(e))}connectedCallback(){super.connectedCallback(),this.appearance||=`neutral`}defaultSlottedContentChanged(){var e,t;let n=this.defaultSlottedContent.filter(e=>e.nodeType===Node.ELEMENT_NODE);n.length===1&&n[0]instanceof SVGElement?(e=this.control)==null||e.classList.add(`icon-only`):(t=this.control)==null||t.classList.remove(`icon-only`)}};J([y],rh.prototype,`appearance`,void 0);var ih=rh.compose({baseName:`anchor`,baseClass:Ra,template:La,styles:nh,shadowOptions:{delegatesFocus:!0}}),ah=M.compose({baseName:`anchored-region`,template:Ba,styles:(e,t)=>b`
  :host {
    contain: layout;
    display: block;
  }
`}),oh=(e,t)=>b`
    ${F(`inline-block`)} :host {
      box-sizing: border-box;
      ${gm};
    }

    .control {
      border-radius: calc(${B} * 1px);
      padding: calc(((${z} * 0.5) - ${V}) * 1px) calc((${z} - ${V}) * 1px);
      border: calc(${V} * 1px) solid transparent;
    }

    :host(.lightweight) .control {
      background: transparent;
      color: ${G};
      font-weight: 600;
    }

    :host(.accent) .control {
      background: ${W};
      color: ${qf};
    }

    :host(.neutral) .control {
      background: ${Sp};
      color: ${G};
    }

    :host([circular]) .control {
      border-radius: 100px;
      min-width: calc(${cd} - calc(${z} * 1px));
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `,sh=class extends Wa{constructor(){super(...arguments),this.appearance=`lightweight`}appearanceChanged(e,t){e!==t&&m.queueUpdate(()=>{this.classList.add(t),this.classList.remove(e)})}};J([y({mode:`fromView`})],sh.prototype,`appearance`,void 0);var ch=sh.compose({baseName:`badge`,baseClass:Wa,template:Ua,styles:oh}),lh=Ja.compose({baseName:`breadcrumb`,template:qa,styles:(e,t)=>b`
  ${F(`inline-block`)} :host {
    box-sizing: border-box;
    ${K};
  }

  .list {
    display: flex;
  }
`}),uh=Ka.compose({baseName:`breadcrumb-item`,template:Ga,styles:(e,t)=>b`
    ${F(`inline-flex`)} :host {
      background: transparent;
      color: ${G};
      fill: currentcolor;
      box-sizing: border-box;
      ${K};
      min-width: calc(${q} * 1px);
      border-radius: calc(${B} * 1px);
    }

    .listitem {
      display: flex;
      align-items: center;
      border-radius: inherit;
    }

    .control {
      position: relative;
      align-items: center;
      box-sizing: border-box;
      color: inherit;
      fill: inherit;
      cursor: pointer;
      display: flex;
      outline: none;
      text-decoration: none;
      white-space: nowrap;
      border-radius: inherit;
    }

    .control:hover {
      color: ${Ip};
    }

    .control:active {
      color: ${Lp};
    }

    .control:${I} {
      ${ym}
    }

    :host(:not([href])),
    :host([aria-current]) .control {
      color: ${G};
      fill: currentcolor;
      cursor: default;
    }

    .start {
      display: flex;
      margin-inline-end: 6px;
    }

    .end {
      display: flex;
      margin-inline-start: 6px;
    }

    .separator {
      display: flex;
    }
  `.withBehaviors(P(b`
        :host(:not([href])),
        .start,
        .end,
        .separator {
          background: ${A.ButtonFace};
          color: ${A.ButtonText};
          fill: currentcolor;
        }
        .separator {
          fill: ${A.ButtonText};
        }
        :host([href]) {
          forced-color-adjust: none;
          background: ${A.ButtonFace};
          color: ${A.LinkText};
        }
        :host([href]) .control:hover {
          background: ${A.LinkText};
          color: ${A.HighlightText};
          fill: currentcolor;
        }
        .control:${I} {
          outline-color: ${A.LinkText};
        }
      `)),shadowOptions:{delegatesFocus:!0},separator:`
    <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.65 2.15a.5.5 0 000 .7L7.79 6 4.65 9.15a.5.5 0 10.7.7l3.5-3.5a.5.5 0 000-.7l-3.5-3.5a.5.5 0 00-.7 0z"/>
    </svg>
  `}),dh=`:not([disabled])`,fh=`[disabled]`,ph=(e,t)=>b`
    :host(${dh}) .control {
      cursor: pointer;
    }

    :host(${fh}) .control {
      cursor: ${Al};
    }

    @media (forced-colors: none) {
      :host(${fh}) .control {
        opacity: ${Yu};
      }
    }

    ${zm(e,t,dh,fh)}
  `.withBehaviors(Y(`neutral`,Bm(e,t,dh,fh)),Y(`accent`,Vm(e,t,dh,fh)),Y(`lightweight`,Um(e,t,dh,fh)),Y(`outline`,Wm(e,t,dh,fh)),Y(`stealth`,Gm(e,t,dh,fh))),mh=class extends io{appearanceChanged(e,t){e!==t&&(this.classList.add(t),this.classList.remove(e))}connectedCallback(){super.connectedCallback(),this.appearance||=`neutral`}defaultSlottedContentChanged(){let e=this.defaultSlottedContent.filter(e=>e.nodeType===Node.ELEMENT_NODE);e.length===1&&e[0]instanceof SVGElement?this.control.classList.add(`icon-only`):this.control.classList.remove(`icon-only`)}};J([y],mh.prototype,`appearance`,void 0);var hh=mh.compose({baseName:`button`,baseClass:io,template:Ya,styles:ph,shadowOptions:{delegatesFocus:!0}}),gh=b`
.day.disabled::before {
  transform: translate(-50%, 0) rotate(45deg);
}
`,_h=b`
.day.disabled::before {
  transform: translate(50%, 0) rotate(-45deg);
}
`,vh=(e,t)=>b`
${F(`inline-block`)} :host {
  --calendar-cell-size: calc((${Xu} + 2 + ${Qu}) * ${z} * 1px);
  --calendar-gap: 2px;
  ${K}
  color: ${G};
}

.title {
  padding: calc(${z} * 2px);
  font-weight: 600;
}

.days {
  text-align: center;
}

.week-days,
.week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-gap: var(--calendar-gap);
  border: 0;
  padding: 0;
}

.day,
.week-day {
  border: 0;
  width: var(--calendar-cell-size);
  height: var(--calendar-cell-size);
  line-height: var(--calendar-cell-size);
  padding: 0;
  box-sizing: initial;
}

.week-day {
  font-weight: 600;
}

.day {
  border: calc(${V} * 1px) solid transparent;
  border-radius: calc(${B} * 1px);
}

.interact .day {
  cursor: pointer;
}

.date {
  height: 100%;
}

.inactive .date,
.inactive.disabled::before {
  color: ${zp};
}

.disabled::before {
  content: '';
  display: inline-block;
  width: calc(var(--calendar-cell-size) * .8);
  height: calc(${V} * 1px);
  background: currentColor;
  position: absolute;
  margin-top: calc(var(--calendar-cell-size) / 2);
  transform-origin: center;
  z-index: 1;
}

.selected {
  color: ${W};
  border: 1px solid ${W};
  background: ${U};
}

.selected + .selected {
  border-start-start-radius: 0;
  border-end-start-radius: 0;
  border-inline-start-width: 0;
  padding-inline-start: calc(var(--calendar-gap) + (${V} + ${B}) * 1px);
  margin-inline-start: calc((${B} * -1px) - var(--calendar-gap));
}

.today.disabled::before {
  color: ${qf};
}

.today .date {
  color: ${qf};
  background: ${W};
  border-radius: 50%;
  position: relative;
}
`.withBehaviors(P(b`
          .day.selected {
              color: ${A.Highlight};
          }

          .today .date {
              background: ${A.Highlight};
              color: ${A.HighlightText};
          }
      `),new Tm(gh,_h)),yh=class extends so{constructor(){super(...arguments),this.readonly=!0}};J([y({converter:gr})],yh.prototype,`readonly`,void 0);var bh=yh.compose({baseName:`calendar`,template:ko,styles:vh,title:Co}),xh=(e,t)=>b`
    ${F(`block`)} :host {
      display: block;
      contain: content;
      height: var(--card-height, 100%);
      width: var(--card-width, 100%);
      box-sizing: border-box;
      background: ${U};
      color: ${G};
      border: calc(${V} * 1px) solid ${em};
      border-radius: calc(${$u} * 1px);
      box-shadow: ${Mm};
    }

    :host {
      content-visibility: auto;
    }
  `.withBehaviors(P(b`
        :host {
          background: ${A.Canvas};
          color: ${A.CanvasText};
        }
      `)),Sh=class extends jo{cardFillColorChanged(e,t){if(t){let e=ou(t);e!==null&&(this.neutralPaletteSource=t,U.setValueFor(this,cu.create(e.r,e.g,e.b)))}}neutralPaletteSourceChanged(e,t){if(t){let e=ou(t),n=cu.create(e.r,e.g,e.b);H.setValueFor(this,vu.create(n))}}handleChange(e,t){this.cardFillColor||U.setValueFor(this,t=>_p.getValueFor(t).evaluate(t,U.getValueFor(e)).rest)}connectedCallback(){super.connectedCallback();let e=Jo(this);if(e){let t=h.getNotifier(e);t.subscribe(this,`fillColor`),t.subscribe(this,`neutralPalette`),this.handleChange(e,`fillColor`)}}};J([y({attribute:`card-fill-color`,mode:`fromView`})],Sh.prototype,`cardFillColor`,void 0),J([y({attribute:`neutral-palette-source`,mode:`fromView`})],Sh.prototype,`neutralPaletteSource`,void 0);var Ch=Sh.compose({baseName:`card`,baseClass:jo,template:Ao,styles:xh}),wh=Fo.compose({baseName:`checkbox`,template:Mo,styles:(e,t)=>b`
    ${F(`inline-flex`)} :host {
      align-items: center;
      outline: none;
      ${``} user-select: none;
    }

    .control {
      position: relative;
      width: calc((${q} / 2 + ${z}) * 1px);
      height: calc((${q} / 2 + ${z}) * 1px);
      box-sizing: border-box;
      border-radius: calc(${B} * 1px);
      border: calc(${V} * 1px) solid ${nm};
      background: ${pp};
      cursor: pointer;
    }

    .label__hidden {
      display: none;
      visibility: hidden;
    }

    .label {
      ${K}
      color: ${G};
      ${``} padding-inline-start: calc(${z} * 2px + 2px);
      margin-inline-end: calc(${z} * 2px + 2px);
      cursor: pointer;
    }

    slot[name='checked-indicator'],
    slot[name='indeterminate-indicator'] {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      fill: ${G};
      opacity: 0;
      pointer-events: none;
    }

    slot[name='indeterminate-indicator'] {
      position: absolute;
      top: 0;
    }

    :host(.checked) slot[name='checked-indicator'],
    :host(.checked) slot[name='indeterminate-indicator'] {
      fill: ${qf};
    }

    :host(:not(.disabled):hover) .control {
      background: ${mp};
      border-color: ${rm};
    }

    :host(:not(.disabled):active) .control {
      background: ${hp};
      border-color: ${im};
    }

    :host(:${I}) .control {
      background: ${gp};
      ${ym}
    }

    :host(.checked) .control {
      background: ${W};
      border-color: transparent;
    }

    :host(.checked:not(.disabled):hover) .control {
      background: ${Uf};
      border-color: transparent;
    }

    :host(.checked:not(.disabled):active) .control {
      background: ${Wf};
      border-color: transparent;
    }

    :host(.disabled) .label,
    :host(.readonly) .label,
    :host(.readonly) .control,
    :host(.disabled) .control {
      cursor: ${Al};
    }

    :host(.checked:not(.indeterminate)) slot[name='checked-indicator'],
    :host(.indeterminate) slot[name='indeterminate-indicator'] {
      opacity: 1;
    }

    :host(.disabled) {
      opacity: ${Yu};
    }
  `.withBehaviors(P(b`
        .control {
          border-color: ${A.FieldText};
          background: ${A.Field};
        }
        :host(:not(.disabled):hover) .control,
        :host(:not(.disabled):active) .control {
          border-color: ${A.Highlight};
          background: ${A.Field};
        }
        slot[name='checked-indicator'],
        slot[name='indeterminate-indicator'] {
          fill: ${A.FieldText};
        }
        :host(:${I}) .control {
          forced-color-adjust: none;
          outline-color: ${A.FieldText};
          background: ${A.Field};
          border-color: ${A.Highlight};
        }
        :host(.checked) .control {
          background: ${A.Highlight};
          border-color: ${A.Highlight};
        }
        :host(.checked:not(.disabled):hover) .control,
        :host(.checked:not(.disabled):active) .control {
          background: ${A.HighlightText};
          border-color: ${A.Highlight};
        }
        :host(.checked) slot[name='checked-indicator'],
        :host(.checked) slot[name='indeterminate-indicator'] {
          fill: ${A.HighlightText};
        }
        :host(.checked:hover ) .control slot[name='checked-indicator'],
        :host(.checked:hover ) .control slot[name='indeterminate-indicator'] {
          fill: ${A.Highlight};
        }
        :host(.disabled) {
          opacity: 1;
        }
        :host(.disabled) .control {
          border-color: ${A.GrayText};
          background: ${A.Field};
        }
        :host(.disabled) slot[name='checked-indicator'],
        :host(.checked.disabled:hover) .control slot[name='checked-indicator'],
        :host(.disabled) slot[name='indeterminate-indicator'],
        :host(.checked.disabled:hover) .control slot[name='indeterminate-indicator'] {
          fill: ${A.GrayText};
        }
      `)),checkedIndicator:`
    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.86 3.66a.5.5 0 01-.02.7l-7.93 7.48a.6.6 0 01-.84-.02L2.4 9.1a.5.5 0 01.72-.7l2.4 2.44 7.65-7.2a.5.5 0 01.7.02z"/>
    </svg>
  `,indeterminateIndicator:`
    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 8c0-.28.22-.5.5-.5h9a.5.5 0 010 1h-9A.5.5 0 013 8z"/>
    </svg>
  `}),Th=`.control`,Eh=`:not([disabled]):not([open])`,Dh=`[disabled]`,Oh=(e,t)=>b`
    ${F(`inline-flex`)}
    
    :host {
      border-radius: calc(${B} * 1px);
      box-sizing: border-box;
      color: ${G};
      fill: currentcolor;
      font-family: ${td};
      position: relative;
      user-select: none;
      min-width: 250px;
      vertical-align: top;
    }

    .listbox {
      box-shadow: ${Im};
      background: ${U};
      border-radius: calc(${$u} * 1px);
      box-sizing: border-box;
      display: inline-flex;
      flex-direction: column;
      left: 0;
      max-height: calc(var(--max-height) - (${q} * 1px));
      padding: calc((${z} - ${V} ) * 1px);
      overflow-y: auto;
      position: absolute;
      width: 100%;
      z-index: 1;
      margin: 1px 0;
      border: calc(${V} * 1px) solid transparent;
    }

    .listbox[hidden] {
      display: none;
    }

    .control {
      border: calc(${V} * 1px) solid transparent;
      border-radius: calc(${B} * 1px);
      height: calc(${q} * 1px);
      align-items: center;
      box-sizing: border-box;
      cursor: pointer;
      display: flex;
      ${K}
      min-height: 100%;
      padding: 0 calc(${z} * 2.25px);
      width: 100%;
    }

    :host(:${I}) {
      ${vm}
    }

    :host([disabled]) .control {
      cursor: ${Al};
      opacity: ${Yu};
      user-select: none;
    }

    :host([open][position='above']) .listbox {
      bottom: calc((${q} + ${z} * 2) * 1px);
    }

    :host([open][position='below']) .listbox {
      top: calc((${q} + ${z} * 2) * 1px);
    }

    .selected-value {
      font-family: inherit;
      flex: 1 1 auto;
      text-align: start;
    }

    .indicator {
      flex: 0 0 auto;
      margin-inline-start: 1em;
    }

    slot[name='listbox'] {
      display: none;
      width: 100%;
    }

    :host([open]) slot[name='listbox'] {
      display: flex;
      position: absolute;
    }

    .start {
      margin-inline-end: 11px;
    }

    .end {
      margin-inline-start: 11px;
    }

    .start,
    .end,
    .indicator,
    ::slotted(svg) {
      display: flex;
    }

    ::slotted([role='option']) {
      flex: 0 0 auto;
    }
  `,kh=(e,t)=>b`
    :host([open]) .listbox {
      background: ${A.ButtonFace};
      border-color: ${A.CanvasText};
    }
  `,Ah=(e,t)=>Oh(e,t).withBehaviors(Y(`outline`,Bm(e,t,Eh,Dh)),Y(`filled`,$m(e,t,Th,Eh).withBehaviors(P(eh(e,t,Th,Eh)))),Y(`stealth`,Gm(e,t,Eh,Dh)),P(kh(e,t))),jh=`.control`,Mh=`:not([disabled]):not([open])`,Nh=(e,t)=>b`
    ${Oh(e,t)}

    ${Zm(e,t,jh)}

    :host(:empty) .listbox {
      display: none;
    }

    :host([disabled]) *,
    :host([disabled]) {
      cursor: ${Al};
      user-select: none;
    }

    :host(:active) .selected-value {
      user-select: none;
    }

    .selected-value {
      -webkit-appearance: none;
      background: transparent;
      border: none;
      color: inherit;
      ${K}
      height: calc(100% - ${V} * 1px));
      margin: auto 0;
      width: 100%;
      outline: none;
    }
  `.withBehaviors(Y(`outline`,Qm(e,t,jh,Mh)),Y(`filled`,$m(e,t,jh,Mh)),P(eh(e,t,jh,Mh))),Ph=class extends Go{appearanceChanged(e,t){e!==t&&(this.classList.add(t),this.classList.remove(e))}connectedCallback(){super.connectedCallback(),this.appearance||=`outline`,this.listbox&&U.setValueFor(this.listbox,Ff)}};J([y({mode:`fromView`})],Ph.prototype,`appearance`,void 0);var Fh=Ph.compose({baseName:`combobox`,baseClass:Go,shadowOptions:{delegatesFocus:!0},template:qo,styles:Nh,indicator:`
    <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.15 4.65c.2-.2.5-.2.7 0L6 7.79l3.15-3.14a.5.5 0 11.7.7l-3.5 3.5a.5.5 0 01-.7 0l-3.5-3.5a.5.5 0 010-.7z"/>
    </svg>
  `}),Ih=(e,t)=>b`
  :host {
    display: flex;
    position: relative;
    flex-direction: column;
  }
`,Lh=(e,t)=>b`
    :host {
      display: grid;
      padding: 1px 0;
      box-sizing: border-box;
      width: 100%;
      border-bottom: calc(${V} * 1px) solid ${Yp};
    }

    :host(.header) {
    }

    :host(.sticky-header) {
      background: ${U};
      position: sticky;
      top: 0;
    }
  `.withBehaviors(P(b`
        :host {
        }
      `)),Rh=vo.compose({baseName:`data-grid-cell`,template:So,styles:(e,t)=>b`
    :host {
      padding: calc((${z} + ${ed} - ${V}) * 1px) calc(((${z} * 3) + ${ed} - ${V}) * 1px);
      color: ${G};
      box-sizing: border-box;
      ${K}
      border: transparent calc(${V} * 1px) solid;
      overflow: hidden;
      white-space: nowrap;
      border-radius: calc(${B} * 1px);
    }

    :host(.column-header) {
      font-weight: 600;
    }

    :host(:${I}) {
      ${vm}
    }
  `.withBehaviors(P(b`
        :host {
          forced-color-adjust: none;
          background: ${A.Field};
          color: ${A.FieldText};
        }

        :host(:${I}) {
          outline-color: ${A.FieldText};
        }
      `))}),zh=fo.compose({baseName:`data-grid-row`,template:xo,styles:Lh}),Bh=ho.compose({baseName:`data-grid`,template:mo,styles:Ih}),Vh={toView(e){return e==null?null:e?.toColorString()},fromView(e){if(e==null)return null;let t=ou(e);return t?cu.create(t.r,t.g,t.b):null}},Hh=b`
  :host {
    background-color: ${U};
    color: ${G};
  }
`.withBehaviors(P(b`
      :host {
        background-color: ${A.Canvas};
        box-shadow: 0 0 0 1px ${A.CanvasText};
        color: ${A.CanvasText};
      }
    `));function X(e){return(t,n)=>{t[n+`Changed`]=function(t,n){n==null?e.deleteValueFor(this):e.setValueFor(this,n)}}}var Z=class extends E{constructor(){super(),this.noPaint=!1;let e={handleChange:this.noPaintChanged.bind(this)};h.getNotifier(this).subscribe(e,`fillColor`),h.getNotifier(this).subscribe(e,`baseLayerLuminance`)}connectedCallback(){super.connectedCallback(),this.noPaintChanged()}noPaintChanged(){!this.noPaint&&(this.fillColor!==void 0||this.baseLayerLuminance)?this.$fastController.addStyles(Hh):this.$fastController.removeStyles(Hh)}};J([y({attribute:`no-paint`,mode:`boolean`})],Z.prototype,`noPaint`,void 0),J([y({attribute:`fill-color`,converter:Vh,mode:`fromView`}),X(U)],Z.prototype,`fillColor`,void 0),J([y({attribute:`accent-base-color`,converter:Vh,mode:`fromView`}),X(jf)],Z.prototype,`accentBaseColor`,void 0),J([y({attribute:`neutral-base-color`,converter:Vh,mode:`fromView`}),X(Af)],Z.prototype,`neutralBaseColor`,void 0),J([y({converter:v}),X(Qu)],Z.prototype,`density`,void 0),J([y({attribute:`design-unit`,converter:v}),X(z)],Z.prototype,`designUnit`,void 0),J([y({attribute:`direction`}),X(Ju)],Z.prototype,`direction`,void 0),J([y({attribute:`base-height-multiplier`,converter:v}),X(Xu)],Z.prototype,`baseHeightMultiplier`,void 0),J([y({attribute:`base-horizontal-spacing-multiplier`,converter:v}),X(Zu)],Z.prototype,`baseHorizontalSpacingMultiplier`,void 0),J([y({attribute:`control-corner-radius`,converter:v}),X(B)],Z.prototype,`controlCornerRadius`,void 0),J([y({attribute:`layer-corner-radius`,converter:v}),X($u)],Z.prototype,`layerCornerRadius`,void 0),J([y({attribute:`stroke-width`,converter:v}),X(V)],Z.prototype,`strokeWidth`,void 0),J([y({attribute:`focus-stroke-width`,converter:v}),X(ed)],Z.prototype,`focusStrokeWidth`,void 0),J([y({attribute:`disabled-opacity`,converter:v}),X(Yu)],Z.prototype,`disabledOpacity`,void 0),J([y({attribute:`type-ramp-minus-2-font-size`}),X(ud)],Z.prototype,`typeRampMinus2FontSize`,void 0),J([y({attribute:`type-ramp-minus-2-line-height`}),X(dd)],Z.prototype,`typeRampMinus2LineHeight`,void 0),J([y({attribute:`type-ramp-minus-1-font-size`}),X(sd)],Z.prototype,`typeRampMinus1FontSize`,void 0),J([y({attribute:`type-ramp-minus-1-line-height`}),X(cd)],Z.prototype,`typeRampMinus1LineHeight`,void 0),J([y({attribute:`type-ramp-base-font-size`}),X(id)],Z.prototype,`typeRampBaseFontSize`,void 0),J([y({attribute:`type-ramp-base-line-height`}),X(ad)],Z.prototype,`typeRampBaseLineHeight`,void 0),J([y({attribute:`type-ramp-plus-1-font-size`}),X(pd)],Z.prototype,`typeRampPlus1FontSize`,void 0),J([y({attribute:`type-ramp-plus-1-line-height`}),X(md)],Z.prototype,`typeRampPlus1LineHeight`,void 0),J([y({attribute:`type-ramp-plus-2-font-size`}),X(gd)],Z.prototype,`typeRampPlus2FontSize`,void 0),J([y({attribute:`type-ramp-plus-2-line-height`}),X(_d)],Z.prototype,`typeRampPlus2LineHeight`,void 0),J([y({attribute:`type-ramp-plus-3-font-size`}),X(yd)],Z.prototype,`typeRampPlus3FontSize`,void 0),J([y({attribute:`type-ramp-plus-3-line-height`}),X(bd)],Z.prototype,`typeRampPlus3LineHeight`,void 0),J([y({attribute:`type-ramp-plus-4-font-size`}),X(Sd)],Z.prototype,`typeRampPlus4FontSize`,void 0),J([y({attribute:`type-ramp-plus-4-line-height`}),X(Cd)],Z.prototype,`typeRampPlus4LineHeight`,void 0),J([y({attribute:`type-ramp-plus-5-font-size`}),X(Td)],Z.prototype,`typeRampPlus5FontSize`,void 0),J([y({attribute:`type-ramp-plus-5-line-height`}),X(Ed)],Z.prototype,`typeRampPlus5LineHeight`,void 0),J([y({attribute:`type-ramp-plus-6-font-size`}),X(Od)],Z.prototype,`typeRampPlus6FontSize`,void 0),J([y({attribute:`type-ramp-plus-6-line-height`}),X(kd)],Z.prototype,`typeRampPlus6LineHeight`,void 0),J([y({attribute:`accent-fill-rest-delta`,converter:v}),X(Md)],Z.prototype,`accentFillRestDelta`,void 0),J([y({attribute:`accent-fill-hover-delta`,converter:v}),X(Nd)],Z.prototype,`accentFillHoverDelta`,void 0),J([y({attribute:`accent-fill-active-delta`,converter:v}),X(Pd)],Z.prototype,`accentFillActiveDelta`,void 0),J([y({attribute:`accent-fill-focus-delta`,converter:v}),X(Fd)],Z.prototype,`accentFillFocusDelta`,void 0),J([y({attribute:`accent-foreground-rest-delta`,converter:v}),X(Id)],Z.prototype,`accentForegroundRestDelta`,void 0),J([y({attribute:`accent-foreground-hover-delta`,converter:v}),X(Ld)],Z.prototype,`accentForegroundHoverDelta`,void 0),J([y({attribute:`accent-foreground-active-delta`,converter:v}),X(Rd)],Z.prototype,`accentForegroundActiveDelta`,void 0),J([y({attribute:`accent-foreground-focus-delta`,converter:v}),X(zd)],Z.prototype,`accentForegroundFocusDelta`,void 0),J([y({attribute:`neutral-fill-rest-delta`,converter:v}),X(Bd)],Z.prototype,`neutralFillRestDelta`,void 0),J([y({attribute:`neutral-fill-hover-delta`,converter:v}),X(Vd)],Z.prototype,`neutralFillHoverDelta`,void 0),J([y({attribute:`neutral-fill-active-delta`,converter:v}),X(Hd)],Z.prototype,`neutralFillActiveDelta`,void 0),J([y({attribute:`neutral-fill-focus-delta`,converter:v}),X(Ud)],Z.prototype,`neutralFillFocusDelta`,void 0),J([y({attribute:`neutral-fill-input-rest-delta`,converter:v}),X(Wd)],Z.prototype,`neutralFillInputRestDelta`,void 0),J([y({attribute:`neutral-fill-input-hover-delta`,converter:v}),X(Gd)],Z.prototype,`neutralFillInputHoverDelta`,void 0),J([y({attribute:`neutral-fill-input-active-delta`,converter:v}),X(Kd)],Z.prototype,`neutralFillInputActiveDelta`,void 0),J([y({attribute:`neutral-fill-input-focus-delta`,converter:v}),X(qd)],Z.prototype,`neutralFillInputFocusDelta`,void 0),J([y({attribute:`neutral-fill-layer-rest-delta`,converter:v}),X(Qd)],Z.prototype,`neutralFillLayerRestDelta`,void 0),J([y({attribute:`neutral-fill-stealth-rest-delta`,converter:v}),X(sf)],Z.prototype,`neutralFillStealthRestDelta`,void 0),J([y({attribute:`neutral-fill-stealth-hover-delta`,converter:v}),X(cf)],Z.prototype,`neutralFillStealthHoverDelta`,void 0),J([y({attribute:`neutral-fill-stealth-active-delta`,converter:v}),X(lf)],Z.prototype,`neutralFillStealthActiveDelta`,void 0),J([y({attribute:`neutral-fill-stealth-focus-delta`,converter:v}),X(uf)],Z.prototype,`neutralFillStealthFocusDelta`,void 0),J([y({attribute:`neutral-fill-strong-hover-delta`,converter:v}),X(ff)],Z.prototype,`neutralFillStrongHoverDelta`,void 0),J([y({attribute:`neutral-fill-strong-active-delta`,converter:v}),X(pf)],Z.prototype,`neutralFillStrongActiveDelta`,void 0),J([y({attribute:`neutral-fill-strong-focus-delta`,converter:v}),X(mf)],Z.prototype,`neutralFillStrongFocusDelta`,void 0),J([y({attribute:`base-layer-luminance`,converter:v}),X(jd)],Z.prototype,`baseLayerLuminance`,void 0),J([y({attribute:`neutral-stroke-divider-rest-delta`,converter:v}),X(Cf)],Z.prototype,`neutralStrokeDividerRestDelta`,void 0),J([y({attribute:`neutral-stroke-rest-delta`,converter:v}),X(hf)],Z.prototype,`neutralStrokeRestDelta`,void 0),J([y({attribute:`neutral-stroke-hover-delta`,converter:v}),X(gf)],Z.prototype,`neutralStrokeHoverDelta`,void 0),J([y({attribute:`neutral-stroke-active-delta`,converter:v}),X(_f)],Z.prototype,`neutralStrokeActiveDelta`,void 0),J([y({attribute:`neutral-stroke-focus-delta`,converter:v}),X(vf)],Z.prototype,`neutralStrokeFocusDelta`,void 0);var Uh=Z.compose({baseName:`design-system-provider`,template:_` <slot></slot> `,styles:b`
    ${F(`block`)}
  `}),Wh=qs.compose({baseName:`dialog`,template:Ts,styles:(e,t)=>b`
  :host([hidden]) {
    display: none;
  }

  :host {
    --dialog-height: 480px;
    --dialog-width: 640px;
    display: block;
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    touch-action: none;
  }

  .positioning-region {
    display: flex;
    justify-content: center;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
  }

  .control {
    box-shadow: ${Rm};
    margin-top: auto;
    margin-bottom: auto;
    border-radius: calc(${$u} * 1px);
    width: var(--dialog-width);
    height: var(--dialog-height);
    background: ${U};
    z-index: 1;
    border: calc(${V} * 1px) solid transparent;
  }
`}),Gh=Xs.compose({baseName:`divider`,template:Js,styles:(e,t)=>b`
    ${F(`block`)} :host {
      box-sizing: content-box;
      height: 0;
      border: none;
      border-top: calc(${V} * 1px) solid ${Yp};
    }

    :host([orientation="vertical"]) {
      border: none;
      height: 100%;
      margin: 0 calc(${z} * 1px);
      border-left: calc(${V} * 1px) solid ${Yp};
  }
  `}),Kh=$s.compose({baseName:`flipper`,template:Qs,styles:(e,t)=>b`
    ${F(`inline-flex`)} :host {
      height: calc((${q} + ${z}) * 1px);
      justify-content: center;
      align-items: center;
      fill: currentcolor;
      color: ${Mp};
      background: padding-box linear-gradient(${ap}, ${ap}),
        border-box ${Gp};
      box-sizing: border-box;
      border: calc(${V} * 1px) solid transparent;
      border-radius: calc(${B} * 1px);
      padding: 0;
    }

    :host(.disabled) {
      opacity: ${Yu};
      cursor: ${Al};
      pointer-events: none;
    }

    .next,
    .previous {
      display: flex;
    }

    :host(:not(.disabled):hover) {
      cursor: pointer;
    }

    :host(:not(.disabled):hover) {
      color: ${Np};
    }

    :host(:not(.disabled):active) {
      color: ${Pp};
    }

    :host(:${I}) {
      ${vm}
    }

    :host::-moz-focus-inner {
      border: 0;
    }
  `.withBehaviors(P(b`
        :host {
          background: ${A.ButtonFace};
          border-color: ${A.ButtonText};
        }
        :host .next,
        :host .previous {
          color: ${A.ButtonText};
          fill: currentcolor;
        }
        :host(:not(.disabled):hover) {
          background: ${A.Highlight};
        }
        :host(:not(.disabled):hover) .next,
        :host(:not(.disabled):hover) .previous {
          color: ${A.HighlightText};
          fill: currentcolor;
        }
        :host(.disabled) {
          opacity: 1;
        }
        :host(.disabled),
        :host(.disabled) .next,
        :host(.disabled) .previous {
          border-color: ${A.GrayText};
          color: ${A.GrayText};
          fill: currentcolor;
        }
        :host(:${I}) {
          forced-color-adjust: none;
          outline-color: ${A.Highlight};
        }
      `)),next:`
    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.57 11.84A1 1 0 016 11.02V4.98a1 1 0 011.57-.82l3.79 2.62c.85.59.85 1.85 0 2.44l-3.79 2.62z"/>
    </svg>
  `,previous:`
    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.43 11.84a1 1 0 001.57-.82V4.98a1 1 0 00-1.57-.82L5.64 6.78c-.85.59-.85 1.85 0 2.44l3.79 2.62z"/>
    </svg>
  `}),qh=b`
  .scroll-prev {
    right: auto;
    left: 0;
  }

  .scroll.scroll-next::before,
  .scroll-next .scroll-action {
    left: auto;
    right: 0;
  }

  .scroll.scroll-next::before {
    background: linear-gradient(to right, transparent, var(--scroll-fade-next));
  }

  .scroll-next .scroll-action {
    transform: translate(50%, -50%);
  }
`,Jh=b`
  .scroll.scroll-next {
    right: auto;
    left: 0;
  }

  .scroll.scroll-next::before {
    background: linear-gradient(to right, var(--scroll-fade-next), transparent);
    left: auto;
    right: 0;
  }

  .scroll.scroll-prev::before {
    background: linear-gradient(to right, transparent, var(--scroll-fade-previous));
  }

  .scroll-prev .scroll-action {
    left: auto;
    right: 0;
    transform: translate(50%, -50%);
  }
`,Yh=b`
  .scroll-area {
    position: relative;
  }

  div.scroll-view {
    overflow-x: hidden;
  }

  .scroll {
    bottom: 0;
    pointer-events: none;
    position: absolute;
    right: 0;
    top: 0;
    user-select: none;
    width: 100px;
  }

  .scroll.disabled {
    display: none;
  }

  .scroll::before,
  .scroll-action {
    left: 0;
    position: absolute;
  }

  .scroll::before {
    background: linear-gradient(to right, var(--scroll-fade-previous), transparent);
    content: '';
    display: block;
    height: 100%;
    width: 100%;
  }

  .scroll-action {
    pointer-events: auto;
    right: auto;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  ::slotted(fluent-flipper) {
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }

  .scroll-area:hover ::slotted(fluent-flipper) {
    opacity: 1;
  }
`.withBehaviors(new Tm(qh,Jh)),Xh=class extends Oc{connectedCallback(){super.connectedCallback(),this.view!==`mobile`&&this.$fastController.addStyles(Yh)}}.compose({baseName:`horizontal-scroll`,baseClass:Oc,template:kc,styles:(e,t)=>b`
  ${F(`block`)} :host {
    --scroll-align: center;
    --scroll-item-spacing: 4px;
    contain: layout;
    position: relative;
  }

  .scroll-view {
    overflow-x: auto;
    scrollbar-width: none;
  }

  ::-webkit-scrollbar {
    display: none;
  }

  .content-container {
    align-items: var(--scroll-align);
    display: inline-flex;
    flex-wrap: nowrap;
    position: relative;
  }

  .content-container ::slotted(*) {
    margin-right: var(--scroll-item-spacing);
  }

  .content-container ::slotted(*:last-child) {
    margin-right: 0;
  }
`,nextFlipper:_`
    <fluent-flipper @click="${e=>e.scrollToNext()}" aria-hidden="${e=>e.flippersHiddenFromAT}"></fluent-flipper>
  `,previousFlipper:_`
    <fluent-flipper
      @click="${e=>e.scrollToPrevious()}"
      direction="previous"
      aria-hidden="${e=>e.flippersHiddenFromAT}"
    ></fluent-flipper>
  `}),Zh=class extends zo{}.compose({baseName:`listbox`,template:nc,styles:(e,t)=>b`
    ${F(`inline-flex`)} :host {
      border: calc(${V} * 1px) solid ${Vp};
      border-radius: calc(${B} * 1px);
      box-sizing: border-box;
      flex-direction: column;
      padding: calc(${z} * 1px) 0;
    }

    ::slotted(${e.tagFor(Lo)}) {
      margin: 0 calc(${z} * 1px);
    }

    :host(:focus-within:not([disabled])) {
      ${vm}
    }
  `}),Qh=Lo.compose({baseName:`option`,template:ec,styles:(e,t)=>b`
    ${F(`inline-flex`)} :host {
      position: relative;
      ${K}
      background: ${Dp};
      border-radius: calc(${B} * 1px);
      border: calc(${V} * 1px) solid transparent;
      box-sizing: border-box;
      color: ${G};
      cursor: pointer;
      fill: currentcolor;
      height: calc(${q} * 1px);
      overflow: hidden;
      align-items: center;
      padding: 0 calc(((${z} * 3) - ${V} - 1) * 1px);
      user-select: none;
      white-space: nowrap;
    }

    :host::before {
      content: '';
      display: block;
      position: absolute;
      left: calc((${ed} - ${V}) * 1px);
      top: calc((${q} / 4) - ${ed} * 1px);
      width: 3px;
      height: calc((${q} / 2) * 1px);
      background: transparent;
      border-radius: calc(${B} * 1px);
    }

    :host(:not([disabled]):hover) {
      background: ${Op};
    }

    :host(:not([disabled]):active) {
      background: ${kp};
    }

    :host(:not([disabled]):active)::before {
      background: ${W};
      height: calc(((${q} / 2) - 6) * 1px);
    }

    :host([aria-selected='true'])::before {
      background: ${W};
    }

    :host(:${I}) {
      ${vm}
      background: ${Ap};
    }

    :host([aria-selected='true']) {
      background: ${Sp};
    }

    :host(:not([disabled])[aria-selected='true']:hover) {
      background: ${Cp};
    }

    :host(:not([disabled])[aria-selected='true']:active) {
      background: ${wp};
    }

    :host(:not([disabled]):not([aria-selected='true']):hover) {
      background: ${Op};
    }

    :host(:not([disabled]):not([aria-selected='true']):active) {
      background: ${kp};
    }

    :host([disabled]) {
      cursor: ${Al};
      opacity: ${Yu};
    }

    .content {
      grid-column-start: 2;
      justify-self: start;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .start,
    .end,
    ::slotted(svg) {
      display: flex;
    }

    ::slotted([slot='end']) {
      margin-inline-start: 1ch;
    }

    ::slotted([slot='start']) {
      margin-inline-end: 1ch;
    }
  `.withBehaviors(new Tm(null,b`
      :host::before {
        right: calc((${ed} - ${V}) * 1px);
      }
    `),P(b`
        :host {
          background: ${A.ButtonFace};
          border-color: ${A.ButtonFace};
          color: ${A.ButtonText};
        }
        :host(:not([disabled]):not([aria-selected="true"]):hover),
        :host(:not([disabled])[aria-selected="true"]:hover),
        :host([aria-selected="true"]) {
          forced-color-adjust: none;
          background: ${A.Highlight};
          color: ${A.HighlightText};
        }
        :host(:not([disabled]):active)::before,
        :host([aria-selected='true'])::before {
          background: ${A.HighlightText};
        }
        :host([disabled]),
        :host([disabled]:not([aria-selected='true']):hover) {
          background: ${A.Canvas};
          color: ${A.GrayText};
          fill: currentcolor;
          opacity: 1;
        }
        :host(:${I}) {
          outline-color: ${A.CanvasText};
        }
      `))}),$h=class extends cc{connectedCallback(){super.connectedCallback(),U.setValueFor(this,Ff)}}.compose({baseName:`menu`,baseClass:cc,template:sc,styles:(e,t)=>b`
    ${F(`block`)} :host {
      background: ${Ff};
      border: calc(${V} * 1px) solid transparent;
      border-radius: calc(${$u} * 1px);
      box-shadow: ${Im};
      padding: calc((${z} - ${V}) * 1px) 0;
      max-width: 368px;
      min-width: 64px;
    }

    :host([slot='submenu']) {
      width: max-content;
      margin: 0 calc(${z} * 2px);
    }

    ::slotted(${e.tagFor(ac)}) {
      margin: 0 calc(${z} * 1px);
    }

    ::slotted(${e.tagFor(Xs)}) {
      margin: calc(${z} * 1px) 0;
    }

    ::slotted(hr) {
      box-sizing: content-box;
      height: 0;
      margin: calc(${z} * 1px) 0;
      border: none;
      border-top: calc(${V} * 1px) solid ${Yp};
    }
  `.withBehaviors(P(b`
        :host([slot='submenu']) {
          background: ${A.Canvas};
          border-color: ${A.CanvasText};
        }
      `))}),eg=ac.compose({baseName:`menu-item`,template:oc,styles:(e,t)=>b`
    ${F(`grid`)} :host {
      contain: layout;
      overflow: visible;
      ${K}
      box-sizing: border-box;
      height: calc(${q} * 1px);
      grid-template-columns: minmax(32px, auto) 1fr minmax(32px, auto);
      grid-template-rows: auto;
      justify-items: center;
      align-items: center;
      padding: 0;
      white-space: nowrap;
      color: ${G};
      fill: currentcolor;
      cursor: pointer;
      border-radius: calc(${B} * 1px);
      border: calc(${V} * 1px) solid transparent;
      position: relative;
    }

    :host(.indent-0) {
      grid-template-columns: auto 1fr minmax(32px, auto);
    }

    :host(.indent-0) .content {
      grid-column: 1;
      grid-row: 1;
      margin-inline-start: 10px;
    }

    :host(.indent-0) .expand-collapse-glyph-container {
      grid-column: 5;
      grid-row: 1;
    }

    :host(.indent-2) {
      grid-template-columns: minmax(32px, auto) minmax(32px, auto) 1fr minmax(32px, auto) minmax(32px, auto);
    }

    :host(.indent-2) .content {
      grid-column: 3;
      grid-row: 1;
      margin-inline-start: 10px;
    }

    :host(.indent-2) .expand-collapse-glyph-container {
      grid-column: 5;
      grid-row: 1;
    }

    :host(.indent-2) .start {
      grid-column: 2;
    }

    :host(.indent-2) .end {
      grid-column: 4;
    }

    :host(:${I}) {
      ${vm}
    }

    :host(:not([disabled]):hover) {
      background: ${Op};
    }

    :host(:not([disabled]):active),
    :host(.expanded) {
      background: ${kp};
      color: ${G};
      z-index: 2;
    }

    :host([disabled]) {
      cursor: ${Al};
      opacity: ${Yu};
    }

    .content {
      grid-column-start: 2;
      justify-self: start;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .start,
    .end {
      display: flex;
      justify-content: center;
    }

    :host(.indent-0[aria-haspopup='menu']) {
      display: grid;
      grid-template-columns: minmax(32px, auto) auto 1fr minmax(32px, auto) minmax(32px, auto);
      align-items: center;
      min-height: 32px;
    }

    :host(.indent-1[aria-haspopup='menu']),
    :host(.indent-1[role='menuitemcheckbox']),
    :host(.indent-1[role='menuitemradio']) {
      display: grid;
      grid-template-columns: minmax(32px, auto) auto 1fr minmax(32px, auto) minmax(32px, auto);
      align-items: center;
      min-height: 32px;
    }

    :host(.indent-2:not([aria-haspopup='menu'])) .end {
      grid-column: 5;
    }

    :host .input-container,
    :host .expand-collapse-glyph-container {
      display: none;
    }

    :host([aria-haspopup='menu']) .expand-collapse-glyph-container,
    :host([role='menuitemcheckbox']) .input-container,
    :host([role='menuitemradio']) .input-container {
      display: grid;
    }

    :host([aria-haspopup='menu']) .content,
    :host([role='menuitemcheckbox']) .content,
    :host([role='menuitemradio']) .content {
      grid-column-start: 3;
    }

    :host([aria-haspopup='menu'].indent-0) .content {
      grid-column-start: 1;
    }

    :host([aria-haspopup='menu']) .end,
    :host([role='menuitemcheckbox']) .end,
    :host([role='menuitemradio']) .end {
      grid-column-start: 4;
    }

    :host .expand-collapse,
    :host .checkbox,
    :host .radio {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      box-sizing: border-box;
    }

    :host .checkbox-indicator,
    :host .radio-indicator,
    slot[name='checkbox-indicator'],
    slot[name='radio-indicator'] {
      display: none;
    }

    ::slotted([slot='end']:not(svg)) {
      margin-inline-end: 10px;
      color: ${zp};
    }

    :host([aria-checked='true']) .checkbox-indicator,
    :host([aria-checked='true']) slot[name='checkbox-indicator'],
    :host([aria-checked='true']) .radio-indicator,
    :host([aria-checked='true']) slot[name='radio-indicator'] {
      display: flex;
    }
  `.withBehaviors(P(b`
        :host,
        ::slotted([slot='end']:not(svg)) {
          forced-color-adjust: none;
          color: ${A.ButtonText};
          fill: currentcolor;
        }
        :host(:not([disabled]):hover) {
          background: ${A.Highlight};
          color: ${A.HighlightText};
          fill: currentcolor;
        }
        :host(:hover) .start,
        :host(:hover) .end,
        :host(:hover)::slotted(svg),
        :host(:active) .start,
        :host(:active) .end,
        :host(:active)::slotted(svg),
        :host(:hover) ::slotted([slot='end']:not(svg)),
        :host(:${I}) ::slotted([slot='end']:not(svg)) {
          color: ${A.HighlightText};
          fill: currentcolor;
        }
        :host(.expanded) {
          background: ${A.Highlight};
          color: ${A.HighlightText};
        }
        :host(:${I}) {
          background: ${A.Highlight};
          outline-color: ${A.ButtonText};
          color: ${A.HighlightText};
          fill: currentcolor;
        }
        :host([disabled]),
        :host([disabled]:hover),
        :host([disabled]:hover) .start,
        :host([disabled]:hover) .end,
        :host([disabled]:hover)::slotted(svg),
        :host([disabled]:${I}) {
          background: ${A.ButtonFace};
          color: ${A.GrayText};
          fill: currentcolor;
          opacity: 1;
        }
        :host([disabled]:${I}) {
          outline-color: ${A.GrayText};
        }
        :host .expanded-toggle,
        :host .checkbox,
        :host .radio {
          border-color: ${A.ButtonText};
          background: ${A.HighlightText};
        }
        :host([checked]) .checkbox,
        :host([checked]) .radio {
          background: ${A.HighlightText};
          border-color: ${A.HighlightText};
        }
        :host(:hover) .expanded-toggle,
            :host(:hover) .checkbox,
            :host(:hover) .radio,
            :host(:${I}) .expanded-toggle,
            :host(:${I}) .checkbox,
            :host(:${I}) .radio,
            :host([checked]:hover) .checkbox,
            :host([checked]:hover) .radio,
            :host([checked]:${I}) .checkbox,
            :host([checked]:${I}) .radio {
          border-color: ${A.HighlightText};
        }
        :host([aria-checked='true']) {
          background: ${A.Highlight};
          color: ${A.HighlightText};
        }
        :host([aria-checked='true']) .checkbox-indicator,
        :host([aria-checked='true']) ::slotted([slot='checkbox-indicator']),
        :host([aria-checked='true']) ::slotted([slot='radio-indicator']) {
          fill: ${A.Highlight};
        }
        :host([aria-checked='true']) .radio-indicator {
          background: ${A.Highlight};
        }
      `),new Tm(b`
        .expand-collapse-glyph-container {
          transform: rotate(0deg);
        }
      `,b`
        .expand-collapse-glyph-container {
          transform: rotate(180deg);
        }
      `)),checkboxIndicator:`
    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.86 3.66a.5.5 0 01-.02.7l-7.93 7.48a.6.6 0 01-.84-.02L2.4 9.1a.5.5 0 01.72-.7l2.4 2.44 7.65-7.2a.5.5 0 01.7.02z"/>
    </svg>
  `,expandCollapseGlyph:`
    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.65 3.15a.5.5 0 000 .7L9.79 8l-4.14 4.15a.5.5 0 00.7.7l4.5-4.5a.5.5 0 000-.7l-4.5-4.5a.5.5 0 00-.7 0z"/>
    </svg>
  `,radioIndicator:`
    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="2"/>
    </svg>
  `}),tg=`.root`,ng=(e,t)=>b`
    ${F(`inline-block`)}

    ${Xm(e,t,tg)}

    ${Zm(e,t,tg)}

    .root {
      display: flex;
      flex-direction: row;
    }

    .control {
      -webkit-appearance: none;
      color: inherit;
      background: transparent;
      border: 0;
      height: calc(100% - 4px);
      margin-top: auto;
      margin-bottom: auto;
      padding: 0 calc(${z} * 2px + 1px);
      font-family: inherit;
      font-size: inherit;
      line-height: inherit;
    }

    .start,
    .end {
      margin: auto;
      fill: currentcolor;
    }

    .start {
      display: flex;
      margin-inline-start: 11px;
    }

    .end {
      display: flex;
      margin-inline-end: 11px;
    }

    .controls {
      opacity: 0;
      position: relative;
      top: -1px;
      z-index: 3;
    }

    :host(:hover:not([disabled])) .controls,
    :host(:focus-within:not([disabled])) .controls {
      opacity: 1;
    }

    .step-up,
    .step-down {
      display: flex;
      padding: 0 8px;
      cursor: pointer;
    }

    .step-up {
      padding-top: 3px;
    }
  `.withBehaviors(Y(`outline`,Qm(e,t,tg)),Y(`filled`,$m(e,t,tg)),P(eh(e,t,tg))),rg=class extends _c{connectedCallback(){super.connectedCallback(),this.appearance||=`outline`}};J([y],rg.prototype,`appearance`,void 0);var ig=rg.compose({baseName:`number-field`,baseClass:_c,styles:ng,template:lc,shadowOptions:{delegatesFocus:!0},stepDownGlyph:`
    <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.15 4.65c.2-.2.5-.2.7 0L6 7.79l3.15-3.14a.5.5 0 11.7.7l-3.5 3.5a.5.5 0 01-.7 0l-3.5-3.5a.5.5 0 010-.7z"/>
    </svg>
  `,stepUpGlyph:`
    <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.15 7.35c.2.2.5.2.7 0L6 4.21l3.15 3.14a.5.5 0 10.7-.7l-3.5-3.5a.5.5 0 00-.7 0l-3.5 3.5a.5.5 0 000 .7z"/>
    </svg>
`}),ag=class extends bc{}.compose({baseName:`progress`,template:xc,styles:(e,t)=>b`
    ${F(`flex`)} :host {
      align-items: center;
      height: calc((${V} * 3) * 1px);
    }

    .progress {
      background-color: ${nm};
      border-radius: calc(${z} * 1px);
      width: 100%;
      height: calc(${V} * 1px);
      display: flex;
      align-items: center;
      position: relative;
    }

    .determinate {
      background-color: ${W};
      border-radius: calc(${z} * 1px);
      height: calc((${V} * 3) * 1px);
      transition: all 0.2s ease-in-out;
      display: flex;
    }

    .indeterminate {
      height: calc((${V} * 3) * 1px);
      border-radius: calc(${z} * 1px);
      display: flex;
      width: 100%;
      position: relative;
      overflow: hidden;
    }

    .indeterminate-indicator-1 {
      position: absolute;
      opacity: 0;
      height: 100%;
      background-color: ${W};
      border-radius: calc(${z} * 1px);
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
      width: 40%;
      animation: indeterminate-1 2s infinite;
    }

    .indeterminate-indicator-2 {
      position: absolute;
      opacity: 0;
      height: 100%;
      background-color: ${W};
      border-radius: calc(${z} * 1px);
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
      width: 60%;
      animation: indeterminate-2 2s infinite;
    }

    :host(.paused) .indeterminate-indicator-1,
    :host(.paused) .indeterminate-indicator-2 {
      animation: none;
      background-color: ${zp};
      width: 100%;
      opacity: 1;
    }

    :host(.paused) .determinate {
      background-color: ${zp};
    }

    @keyframes indeterminate-1 {
      0% {
        opacity: 1;
        transform: translateX(-100%);
      }
      70% {
        opacity: 1;
        transform: translateX(300%);
      }
      70.01% {
        opacity: 0;
      }
      100% {
        opacity: 0;
        transform: translateX(300%);
      }
    }

    @keyframes indeterminate-2 {
      0% {
        opacity: 0;
        transform: translateX(-150%);
      }
      29.99% {
        opacity: 0;
      }
      30% {
        opacity: 1;
        transform: translateX(-150%);
      }
      100% {
        transform: translateX(166.66%);
        opacity: 1;
      }
    }
  `.withBehaviors(P(b`
        .indeterminate-indicator-1,
        .indeterminate-indicator-2,
        .determinate,
        .progress {
          background-color: ${A.ButtonText};
        }
        :host(.paused) .indeterminate-indicator-1,
        :host(.paused) .indeterminate-indicator-2,
        :host(.paused) .determinate {
          background-color: ${A.GrayText};
        }
      `)),indeterminateIndicator1:`
    <span class="indeterminate-indicator-1" part="indeterminate-indicator-1"></span>
  `,indeterminateIndicator2:`
    <span class="indeterminate-indicator-2" part="indeterminate-indicator-2"></span>
  `}),og=class extends bc{}.compose({baseName:`progress-ring`,template:yc,styles:(e,t)=>b`
    ${F(`flex`)} :host {
      align-items: center;
      height: calc(${q} * 1px);
      width: calc(${q} * 1px);
    }

    .progress {
      height: 100%;
      width: 100%;
    }

    .background {
      fill: none;
      stroke-width: 2px;
    }

    .determinate {
      stroke: ${W};
      fill: none;
      stroke-width: 2px;
      stroke-linecap: round;
      transform-origin: 50% 50%;
      transform: rotate(-90deg);
      transition: all 0.2s ease-in-out;
    }

    .indeterminate-indicator-1 {
      stroke: ${W};
      fill: none;
      stroke-width: 2px;
      stroke-linecap: round;
      transform-origin: 50% 50%;
      transform: rotate(-90deg);
      transition: all 0.2s ease-in-out;
      animation: spin-infinite 2s linear infinite;
    }

    :host(.paused) .indeterminate-indicator-1 {
      animation: none;
      stroke: ${zp};
    }

    :host(.paused) .determinate {
      stroke: ${zp};
    }

    @keyframes spin-infinite {
      0% {
        stroke-dasharray: 0.01px 43.97px;
        transform: rotate(0deg);
      }
      50% {
        stroke-dasharray: 21.99px 21.99px;
        transform: rotate(450deg);
      }
      100% {
        stroke-dasharray: 0.01px 43.97px;
        transform: rotate(1080deg);
      }
    }
  `.withBehaviors(P(b`
        .background {
          stroke: ${A.Field};
        }
        .determinate,
        .indeterminate-indicator-1 {
          stroke: ${A.ButtonText};
        }
        :host(.paused) .determinate,
        :host(.paused) .indeterminate-indicator-1 {
          stroke: ${A.GrayText};
        }
      `)),indeterminateIndicator:`
    <svg class="progress" part="progress" viewBox="0 0 16 16">
        <circle
            class="background"
            part="background"
            cx="8px"
            cy="8px"
            r="7px"
        ></circle>
        <circle
            class="indeterminate-indicator-1"
            part="indeterminate-indicator-1"
            cx="8px"
            cy="8px"
            r="7px"
        ></circle>
    </svg>
  `}),sg=Dc.compose({baseName:`radio`,template:wc,styles:(e,t)=>b`
    ${F(`inline-flex`)} :host {
      --input-size: calc((${q} / 2) + ${z});
      align-items: center;
      outline: none;
      ${``} user-select: none;
      position: relative;
      flex-direction: row;
      transition: all 0.2s ease-in-out;
    }

    .control {
      position: relative;
      width: calc(var(--input-size) * 1px);
      height: calc(var(--input-size) * 1px);
      box-sizing: border-box;
      border-radius: 50%;
      border: calc(${V} * 1px) solid ${nm};
      background: ${pp};
      cursor: pointer;
    }

    .label__hidden {
      display: none;
      visibility: hidden;
    }

    .label {
      ${K}
      color: ${G};
      ${``} padding-inline-start: calc(${z} * 2px + 2px);
      margin-inline-end: calc(${z} * 2px + 2px);
      cursor: pointer;
    }

    .control,
    slot[name='checked-indicator'] {
      flex-shrink: 0;
    }

    slot[name='checked-indicator'] {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      fill: ${qf};
      opacity: 0;
      pointer-events: none;
    }

    :host(:not(.disabled):hover) .control {
      background: ${mp};
      border-color: ${rm};
    }

    :host(:not(.disabled):active) .control {
      background: ${hp};
      border-color: ${im};
    }

    :host(:not(.disabled):active) slot[name='checked-indicator'] {
      opacity: 1;
    }

    :host(:${I}) .control {
      ${ym}
      background: ${gp};
    }

    :host(.checked) .control {
      background: ${W};
      border-color: transparent;
    }

    :host(.checked:not(.disabled):hover) .control {
      background: ${Uf};
      border-color: transparent;
    }

    :host(.checked:not(.disabled):active) .control {
      background: ${Wf};
      border-color: transparent;
    }

    :host(.disabled) .label,
    :host(.readonly) .label,
    :host(.readonly) .control,
    :host(.disabled) .control {
      cursor: ${Al};
    }

    :host(.checked) slot[name='checked-indicator'] {
      opacity: 1;
    }

    :host(.disabled) {
      opacity: ${Yu};
    }
  `.withBehaviors(P(b`
        .control {
          background: ${A.Field};
          border-color: ${A.FieldText};
        }
        :host(:not(.disabled):hover) .control,
        :host(:not(.disabled):active) .control {
          border-color: ${A.Highlight};
        }
        :host(:${I}) .control {
          forced-color-adjust: none;
          background: ${A.Field};
          outline-color: ${A.FieldText};
        }
        :host(.checked:not(.disabled):hover) .control,
        :host(.checked:not(.disabled):active) .control {
          border-color: ${A.Highlight};
          background: ${A.Highlight};
        }
        :host(.checked) slot[name='checked-indicator'] {
          fill: ${A.Highlight};
        }
        :host(.checked:hover) .control slot[name='checked-indicator'] {
          fill: ${A.HighlightText};
        }
        :host(.disabled) {
          opacity: 1;
        }
        :host(.disabled) .label {
          color: ${A.GrayText};
        }
        :host(.disabled) .control,
        :host(.checked.disabled) .control {
          background: ${A.Field};
          border-color: ${A.GrayText};
        }
        :host(.disabled) slot[name='checked-indicator'],
        :host(.checked.disabled) slot[name='checked-indicator'] {
          fill: ${A.GrayText};
        }
      `)),checkedIndicator:`
    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="4"/>
    </svg>
  `}),cg=Cc.compose({baseName:`radio-group`,template:Sc,styles:(e,t)=>b`
  ${F(`flex`)} :host {
    align-items: flex-start;
    flex-direction: column;
  }

  .positioning-region {
    display: flex;
    flex-wrap: wrap;
  }

  :host([orientation='vertical']) .positioning-region {
    flex-direction: column;
  }

  :host([orientation='horizontal']) .positioning-region {
    flex-direction: row;
  }
`}),lg=(e,t)=>_`
  <template
    class="
            ${e=>e.readOnly?`readonly`:``}
        "
  >
    <label
      part="label"
      for="control"
      class="${e=>e.defaultSlottedNodes&&e.defaultSlottedNodes.length?`label`:`label label__hidden`}"
    >
      <slot ${C({property:`defaultSlottedNodes`,filter:Ac})}></slot>
    </label>
    <div class="root" part="root" ${x(`root`)}>
      ${mi(e,t)}
      <div class="input-wrapper" part="input-wrapper">
        <input
          class="control"
          part="control"
          id="control"
          @input="${e=>e.handleTextInput()}"
          @change="${e=>e.handleChange()}"
          ?autofocus="${e=>e.autofocus}"
          ?disabled="${e=>e.disabled}"
          list="${e=>e.list}"
          maxlength="${e=>e.maxlength}"
          minlength="${e=>e.minlength}"
          pattern="${e=>e.pattern}"
          placeholder="${e=>e.placeholder}"
          ?readonly="${e=>e.readOnly}"
          ?required="${e=>e.required}"
          size="${e=>e.size}"
          ?spellcheck="${e=>e.spellcheck}"
          :value="${e=>e.value}"
          type="search"
          aria-atomic="${e=>e.ariaAtomic}"
          aria-busy="${e=>e.ariaBusy}"
          aria-controls="${e=>e.ariaControls}"
          aria-current="${e=>e.ariaCurrent}"
          aria-describedby="${e=>e.ariaDescribedby}"
          aria-details="${e=>e.ariaDetails}"
          aria-disabled="${e=>e.ariaDisabled}"
          aria-errormessage="${e=>e.ariaErrormessage}"
          aria-flowto="${e=>e.ariaFlowto}"
          aria-haspopup="${e=>e.ariaHaspopup}"
          aria-hidden="${e=>e.ariaHidden}"
          aria-invalid="${e=>e.ariaInvalid}"
          aria-keyshortcuts="${e=>e.ariaKeyshortcuts}"
          aria-label="${e=>e.ariaLabel}"
          aria-labelledby="${e=>e.ariaLabelledby}"
          aria-live="${e=>e.ariaLive}"
          aria-owns="${e=>e.ariaOwns}"
          aria-relevant="${e=>e.ariaRelevant}"
          aria-roledescription="${e=>e.ariaRoledescription}"
          ${x(`control`)}
        />
        <slot name="clear-button">
          <button
            class="clear-button ${e=>e.value?``:`clear-button__hidden`}"
            part="clear-button"
            tabindex="-1"
            @click=${e=>e.handleClearInput()}
          >
            <slot name="clear-glyph">
              <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="m2.09 2.22.06-.07a.5.5 0 0 1 .63-.06l.07.06L6 5.29l3.15-3.14a.5.5 0 1 1 .7.7L6.71 6l3.14 3.15c.18.17.2.44.06.63l-.06.07a.5.5 0 0 1-.63.06l-.07-.06L6 6.71 2.85 9.85a.5.5 0 0 1-.7-.7L5.29 6 2.15 2.85a.5.5 0 0 1-.06-.63l.06-.07-.06.07Z"
                />
              </svg>
            </slot>
          </button>
        </slot>
      </div>
      ${pi(e,t)}
    </div>
  </template>
`,ug=`.root`,dg=N.create(`clear-button-hover`).withDefault(e=>{let t=Ep.getValueFor(e),n=cp.getValueFor(e);return t.evaluate(e,n.evaluate(e).focus).hover}),fg=N.create(`clear-button-active`).withDefault(e=>{let t=Ep.getValueFor(e),n=cp.getValueFor(e);return t.evaluate(e,n.evaluate(e).focus).active}),pg=(e,t)=>b`
    ${F(`inline-block`)}

    ${Xm(e,t,ug)}

    ${Zm(e,t,ug)}

    .root {
      display: flex;
      flex-direction: row;
    }
    .control {
      -webkit-appearance: none;
      color: inherit;
      background: transparent;
      border: 0;
      height: calc(100% - 4px);
      margin-top: auto;
      margin-bottom: auto;
      padding: 0 calc(${z} * 2px + 1px);
      font-family: inherit;
      font-size: inherit;
      line-height: inherit;
    }
    .clear-button {
      display: inline-flex;
      align-items: center;
      margin: 1px;
      height: calc(100% - 2px);
      opacity: 0;
      background: transparent;
      color: ${G};
      fill: currentcolor;
      border: none;
      border-radius: calc(${B} * 1px);
      min-width: calc(${q} * 1px);
      ${K}
      outline: none;
      padding: 0 calc((10 + (${z} * 2 * ${Qu})) * 1px);
    }
    .clear-button:hover {
      background: ${dg};
    }
    .clear-button:active {
      background: ${fg};
    }
    :host(:hover:not([disabled], [readOnly])) .clear-button,
    :host(:active:not([disabled], [readOnly])) .clear-button,
    :host(:focus-within:not([disabled], [readOnly])) .clear-button {
        opacity: 1;
    }
    :host(:hover:not([disabled], [readOnly])) .clear-button__hidden,
    :host(:active:not([disabled], [readOnly])) .clear-button__hidden,
    :host(:focus-within:not([disabled], [readOnly])) .clear-button__hidden {
        opacity: 0;
    }
    .control::-webkit-search-cancel-button {
      -webkit-appearance: none;
    }
    .input-wrapper {
      display: flex;
      position: relative;
      width: 100%;
    }
    .start,
    .end {
      display: flex;
      margin: 1px;
      align-items: center;
    }
    .start {
      display: flex;
      margin-inline-start: 11px;
    }
    ::slotted([slot="end"]) {
      height: 100%
    }
    .clear-button__hidden {
      opacity: 0;
    }
    .end {
        margin-inline-end: 11px;
    }
    ::slotted(${e.tagFor(io)}) {
      margin-inline-end: 1px;
    }
  `.withBehaviors(Y(`outline`,Qm(e,t,ug)),Y(`filled`,$m(e,t,ug)),P(eh(e,t,ug))),mg=class extends Nc{constructor(){super(...arguments),this.appearance=`outline`}};J([y],mg.prototype,`appearance`,void 0);var hg=mg.compose({baseName:`search`,baseClass:Nc,template:lg,styles:pg,start:`<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg%22%3E"><path d="M8.5 3a5.5 5.5 0 0 1 4.23 9.02l4.12 4.13a.5.5 0 0 1-.63.76l-.07-.06-4.13-4.12A5.5 5.5 0 1 1 8.5 3Zm0 1a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z"/></svg>`,shadowOptions:{delegatesFocus:!0}}),gg=class extends Lc{appearanceChanged(e,t){e!==t&&(this.classList.add(t),this.classList.remove(e))}connectedCallback(){super.connectedCallback(),this.appearance||=`outline`,this.listbox&&U.setValueFor(this.listbox,Ff)}};J([y({mode:`fromView`})],gg.prototype,`appearance`,void 0);var _g=gg.compose({baseName:`select`,baseClass:Lc,template:zc,styles:Ah,indicator:`
    <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.15 4.65c.2-.2.5-.2.7 0L6 7.79l3.15-3.14a.5.5 0 11.7.7l-3.5 3.5a.5.5 0 01-.7 0l-3.5-3.5a.5.5 0 010-.7z"/>
    </svg>
  `}),vg=Vc.compose({baseName:`skeleton`,template:Bc,styles:(e,t)=>b`
    ${F(`block`)} :host {
      --skeleton-fill-default: ${Sp};
      overflow: hidden;
      width: 100%;
      position: relative;
      background-color: var(--skeleton-fill, var(--skeleton-fill-default));
      --skeleton-animation-gradient-default: linear-gradient(
        270deg,
        var(--skeleton-fill, var(--skeleton-fill-default)) 0%,
        ${Cp} 51%,
        var(--skeleton-fill, var(--skeleton-fill-default)) 100%
      );
      --skeleton-animation-timing-default: ease-in-out;
    }

    :host(.rect) {
      border-radius: calc(${B} * 1px);
    }

    :host(.circle) {
      border-radius: 100%;
      overflow: hidden;
    }

    object {
      position: absolute;
      width: 100%;
      height: auto;
      z-index: 2;
    }

    object img {
      width: 100%;
      height: auto;
    }

    ${F(`block`)} span.shimmer {
      position: absolute;
      width: 100%;
      height: 100%;
      background-image: var(--skeleton-animation-gradient, var(--skeleton-animation-gradient-default));
      background-size: 0px 0px / 90% 100%;
      background-repeat: no-repeat;
      background-color: var(--skeleton-animation-fill, ${Sp});
      animation: shimmer 2s infinite;
      animation-timing-function: var(--skeleton-animation-timing, var(--skeleton-timing-default));
      animation-direction: normal;
      z-index: 1;
    }

    ::slotted(svg) {
      z-index: 2;
    }

    ::slotted(.pattern) {
      width: 100%;
      height: 100%;
    }

    @keyframes shimmer {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100%);
      }
    }
  `.withBehaviors(P(b`
        :host{
          background-color: ${A.CanvasText};
        }
      `))}),yg=Xc.compose({baseName:`slider`,template:Kc,styles:(e,t)=>b`
    ${F(`inline-grid`)} :host {
      --thumb-size: calc((${q} / 2) + ${z} + (${V} * 2));
      --thumb-translate: calc(var(--thumb-size) * -0.5 + var(--track-width) / 2);
      --track-overhang: calc((${z} / 2) * -1);
      --track-width: ${z};
      align-items: center;
      width: 100%;
      user-select: none;
      box-sizing: border-box;
      border-radius: calc(${B} * 1px);
      outline: none;
      cursor: pointer;
    }
    :host(.horizontal) .positioning-region {
      position: relative;
      margin: 0 8px;
      display: grid;
      grid-template-rows: calc(var(--thumb-size) * 1px) 1fr;
    }
    :host(.vertical) .positioning-region {
      position: relative;
      margin: 0 8px;
      display: grid;
      height: 100%;
      grid-template-columns: calc(var(--thumb-size) * 1px) 1fr;
    }
    :host(:${I}) .thumb-cursor {
      box-shadow: 0 0 0 2px ${U}, 0 0 0 4px ${om};
    }
    .thumb-container {
      position: absolute;
      height: calc(var(--thumb-size) * 1px);
      width: calc(var(--thumb-size) * 1px);
      transition: all 0.2s ease;
    }
    .thumb-cursor {
      display: flex;
      position: relative;
      border: none;
      width: calc(var(--thumb-size) * 1px);
      height: calc(var(--thumb-size) * 1px);
      background: padding-box linear-gradient(${ap}, ${ap}),
        border-box ${Gp};
      border: calc(${V} * 1px) solid transparent;
      border-radius: 50%;
      box-sizing: border-box;
    }
    .thumb-cursor::after {
      content: '';
      display: block;
      border-radius: 50%;
      width: 100%;
      margin: 4px;
      background: ${W};
    }
    :host(:not(.disabled)) .thumb-cursor:hover::after {
      background: ${Uf};
      margin: 3px;
    }
    :host(:not(.disabled)) .thumb-cursor:active::after {
      background: ${Wf};
      margin: 5px;
    }
    :host(:not(.disabled)) .thumb-cursor:hover {
      background: padding-box linear-gradient(${ap}, ${ap}),
        border-box ${Kp};
    }
    :host(:not(.disabled)) .thumb-cursor:active {
      background: padding-box linear-gradient(${ap}, ${ap}),
        border-box ${qp};
    }
    .track-start {
      background: ${W};
      position: absolute;
      height: 100%;
      left: 0;
      border-radius: calc(${B} * 1px);
    }
    :host(.horizontal) .thumb-container {
      transform: translateX(calc(var(--thumb-size) * 0.5px)) translateY(calc(var(--thumb-translate) * 1px));
    }
    :host(.vertical) .thumb-container {
      transform: translateX(calc(var(--thumb-translate) * 1px)) translateY(calc(var(--thumb-size) * 0.5px));
    }
    :host(.horizontal) {
      min-width: calc(var(--thumb-size) * 1px);
    }
    :host(.horizontal) .track {
      right: calc(var(--track-overhang) * 1px);
      left: calc(var(--track-overhang) * 1px);
      align-self: start;
      height: calc(var(--track-width) * 1px);
    }
    :host(.vertical) .track {
      top: calc(var(--track-overhang) * 1px);
      bottom: calc(var(--track-overhang) * 1px);
      width: calc(var(--track-width) * 1px);
      height: 100%;
    }
    .track {
      background: ${Mp};
      border: 1px solid ${nm};
      border-radius: 2px;
      box-sizing: border-box;
      position: absolute;
    }
    :host(.vertical) {
      height: 100%;
      min-height: calc(${z} * 60px);
      min-width: calc(${z} * 20px);
    }
    :host(.vertical) .track-start {
      height: auto;
      width: 100%;
      top: 0;
    }
    :host(.disabled),
    :host(.readonly) {
      cursor: ${Al};
    }
    :host(.disabled) {
      opacity: ${Yu};
    }
  `.withBehaviors(P(b`
        .thumb-cursor {
          forced-color-adjust: none;
          border-color: ${A.FieldText};
          background: ${A.FieldText};
        }
        :host(:not(.disabled)) .thumb-cursor:hover,
        :host(:not(.disabled)) .thumb-cursor:active {
          background: ${A.Highlight};
        }
        .track {
          forced-color-adjust: none;
          background: ${A.FieldText};
        }
        .thumb-cursor::after,
        :host(:not(.disabled)) .thumb-cursor:hover::after,
        :host(:not(.disabled)) .thumb-cursor:active::after {
          background: ${A.Field};
        }
        :host(:${I}) .thumb-cursor {
          background: ${A.Highlight};
          border-color: ${A.Highlight};
          box-shadow: 0 0 0 1px ${A.Field}, 0 0 0 3px ${A.FieldText};
        }
        :host(.disabled) {
          opacity: 1;
        }
        :host(.disabled) .track,
        :host(.disabled) .thumb-cursor {
          forced-color-adjust: none;
          background: ${A.GrayText};
        }
      `)),thumb:`
    <div class="thumb-cursor"></div>
  `}),bg=Gc.compose({baseName:`slider-label`,template:Hc,styles:(e,t)=>b`
    ${F(`block`)} :host {
      ${gm}
    }
    .root {
      position: absolute;
      display: grid;
    }
    :host(.horizontal) {
      align-self: start;
      grid-row: 2;
      margin-top: -4px;
    }
    :host(.vertical) {
      justify-self: start;
      grid-column: 2;
      margin-left: 2px;
    }
    .container {
      display: grid;
      justify-self: center;
    }
    :host(.horizontal) .container {
      grid-template-rows: auto auto;
      grid-template-columns: 0;
    }
    :host(.vertical) .container {
      grid-template-columns: auto auto;
      grid-template-rows: 0;
      min-width: calc(var(--thumb-size) * 1px);
      height: calc(var(--thumb-size) * 1px);
    }
    .label {
      justify-self: center;
      align-self: center;
      white-space: nowrap;
      max-width: 30px;
      margin: 2px 0;
    }
    .mark {
      width: calc(${V} * 1px);
      height: calc(${z} * 1px);
      background: ${nm};
      justify-self: center;
    }
    :host(.vertical) .mark {
      transform: rotate(90deg);
      align-self: center;
    }
    :host(.vertical) .label {
      margin-left: calc((${z} / 2) * 2px);
      align-self: center;
    }
    :host(.disabled) {
      opacity: ${Yu};
    }
  `.withBehaviors(P(b`
        .mark {
          forced-color-adjust: none;
          background: ${A.FieldText};
        }
        :host(.disabled) {
          forced-color-adjust: none;
          opacity: 1;
        }
        :host(.disabled) .label {
          color: ${A.GrayText};
        }
        :host(.disabled) .mark {
          background: ${A.GrayText};
        }
      `))}),xg=el.compose({baseName:`switch`,template:Zc,styles:(e,t)=>b`
    :host([hidden]) {
      display: none;
    }

    ${F(`inline-flex`)} :host {
      align-items: center;
      outline: none;
      font-family: ${td};
      ${``} user-select: none;
    }

    :host(.disabled) {
      opacity: ${Yu};
    }

    :host(.disabled) .label,
    :host(.readonly) .label,
    :host(.disabled) .switch,
    :host(.readonly) .switch,
    :host(.disabled) .status-message,
    :host(.readonly) .status-message {
      cursor: ${Al};
    }

    .switch {
      position: relative;
      box-sizing: border-box;
      width: calc(((${q} / 2) + ${z}) * 2px);
      height: calc(((${q} / 2) + ${z}) * 1px);
      background: ${pp};
      border-radius: calc(${q} * 1px);
      border: calc(${V} * 1px) solid ${nm};
      cursor: pointer;
    }

    :host(:not(.disabled):hover) .switch {
      background: ${mp};
      border-color: ${rm};
    }

    :host(:not(.disabled):active) .switch {
      background: ${hp};
      border-color: ${im};
    }

    :host(:${I}) .switch {
      ${ym}
      background: ${gp};
    }

    :host(.checked) .switch {
      background: ${W};
      border-color: transparent;
    }

    :host(.checked:not(.disabled):hover) .switch {
      background: ${Uf};
      border-color: transparent;
    }

    :host(.checked:not(.disabled):active) .switch {
      background: ${Wf};
      border-color: transparent;
    }

    slot[name='switch'] {
      position: absolute;
      display: flex;
      border: 1px solid transparent; /* Spacing included in the transform reference box */
      fill: ${G};
      transition: all 0.2s ease-in-out;
    }

    .status-message {
      color: ${G};
      cursor: pointer;
      ${K}
    }

    .label__hidden {
      display: none;
      visibility: hidden;
    }

    .label {
      color: ${G};
      ${K}
      margin-inline-end: calc(${z} * 2px + 2px);
      cursor: pointer;
    }

    ::slotted([slot="checked-message"]),
    ::slotted([slot="unchecked-message"]) {
        margin-inline-start: calc(${z} * 2px + 2px);
    }

    :host(.checked) .switch {
      background: ${W};
    }

    :host(.checked) .switch slot[name='switch'] {
      fill: ${qf};
      filter: drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.15));
    }

    :host(.checked:not(.disabled)) .switch:hover {
      background: ${Uf};
    }

    :host(.checked:not(.disabled)) .switch:hover slot[name='switch'] {
      fill: ${Jf};
    }

    :host(.checked:not(.disabled)) .switch:active {
      background: ${Wf};
    }

    :host(.checked:not(.disabled)) .switch:active slot[name='switch'] {
      fill: ${Yf};
    }

    .unchecked-message {
      display: block;
    }

    .checked-message {
      display: none;
    }

    :host(.checked) .unchecked-message {
      display: none;
    }

    :host(.checked) .checked-message {
      display: block;
    }
  `.withBehaviors(new Tm(b`
        slot[name='switch'] {
          left: 0;
        }

        :host(.checked) slot[name='switch'] {
          left: 100%;
          transform: translateX(-100%);
        }
      `,b`
        slot[name='switch'] {
          right: 0;
        }

        :host(.checked) slot[name='switch'] {
          right: 100%;
          transform: translateX(100%);
        }
      `),P(b`
        :host(:not(.disabled)) .switch slot[name='switch'] {
          forced-color-adjust: none;
          fill: ${A.FieldText};
        }
        .switch {
          background: ${A.Field};
          border-color: ${A.FieldText};
        }
        :host(.checked) .switch {
          background: ${A.Highlight};
          border-color: ${A.Highlight};
        }
        :host(:not(.disabled):hover) .switch ,
        :host(:not(.disabled):active) .switch,
        :host(.checked:not(.disabled):hover) .switch {
          background: ${A.HighlightText};
          border-color: ${A.Highlight};
        }
        :host(.checked:not(.disabled)) .switch slot[name="switch"] {
          fill: ${A.HighlightText};
        }
        :host(.checked:not(.disabled):hover) .switch slot[name='switch'] {
          fill: ${A.Highlight};
        }
        :host(:${I}) .switch {
          forced-color-adjust: none;
          background: ${A.Field}; 
          border-color: ${A.Highlight};
          outline-color: ${A.FieldText};
        }
        :host(.disabled) {
          opacity: 1;
        }
        :host(.disabled) slot[name='switch'] {
          forced-color-adjust: none;
          fill: ${A.GrayText};
        }
        :host(.disabled) .switch {
          background: ${A.Field};
          border-color: ${A.GrayText};
        }
        .status-message,
        .label {
          color: ${A.FieldText};
        }
      `)),switch:`
    <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="12" height="12" rx="6"/>
    </svg>
  `}),Sg=(e,t)=>b`
      ${F(`grid`)} :host {
        box-sizing: border-box;
        ${K}
        color: ${G};
        grid-template-columns: auto 1fr auto;
        grid-template-rows: auto 1fr;
      }

      .tablist {
        display: grid;
        grid-template-rows: calc(${q} * 1px); auto;
        grid-template-columns: auto;
        position: relative;
        width: max-content;
        align-self: end;
      }

      .start,
      .end {
        align-self: center;
      }

      .activeIndicator {
        grid-row: 2;
        grid-column: 1;
        width: 20px;
        height: 3px;
        border-radius: calc(${B} * 1px);
        justify-self: center;
        background: ${W};
      }

      .activeIndicatorTransition {
        transition: transform 0.2s ease-in-out;
      }

      .tabpanel {
        grid-row: 2;
        grid-column-start: 1;
        grid-column-end: 4;
        position: relative;
      }

      :host(.vertical) {
        grid-template-rows: auto 1fr auto;
        grid-template-columns: auto 1fr;
      }

      :host(.vertical) .tablist {
        grid-row-start: 2;
        grid-row-end: 2;
        display: grid;
        grid-template-rows: auto;
        grid-template-columns: auto 1fr;
        position: relative;
        width: max-content;
        justify-self: end;
        align-self: flex-start;
        width: 100%;
      }

      :host(.vertical) .tabpanel {
        grid-column: 2;
        grid-row-start: 1;
        grid-row-end: 4;
      }

      :host(.vertical) .end {
        grid-row: 3;
      }

      :host(.vertical) .activeIndicator {
        grid-column: 1;
        grid-row: 1;
        width: 3px;
        height: 20px;
        margin-inline-start: calc(${ed} * 1px);
        border-radius: calc(${B} * 1px);
        align-self: center;
        background: ${W};
      }

      :host(.vertical) .activeIndicatorTransition {
        transition: transform 0.2s linear;
      }
    `.withBehaviors(P(b`
        .activeIndicator,
        :host(.vertical) .activeIndicator {
          background: ${A.Highlight};
        }
      `)),Cg=il.compose({baseName:`tab`,template:rl,styles:(e,t)=>b`
      ${F(`inline-flex`)} :host {
        box-sizing: border-box;
        ${K}
        height: calc((${q} + (${z} * 2)) * 1px);
        padding: 0 calc((6 + (${z} * 2 * ${Qu})) * 1px);
        color: ${G};
        border-radius: calc(${B} * 1px);
        border: calc(${V} * 1px) solid transparent;
        align-items: center;
        justify-content: center;
        grid-row: 1 / 3;
        cursor: pointer;
      }

      :host([aria-selected='true']) {
        z-index: 2;
      }

      :host(:hover),
      :host(:active) {
        color: ${G};
      }

      :host(:${I}) {
        ${vm}
      }

      :host(.vertical) {
        justify-content: start;
        grid-column: 1 / 3;
      }

      :host(.vertical[aria-selected='true']) {
        z-index: 2;
      }

      :host(.vertical:hover),
      :host(.vertical:active) {
        color: ${G};
      }

      :host(.vertical:hover[aria-selected='true']) {
      }
    `.withBehaviors(P(b`
          :host {
            forced-color-adjust: none;
            border-color: transparent;
            color: ${A.ButtonText};
            fill: currentcolor;
          }
          :host(:hover),
          :host(.vertical:hover),
          :host([aria-selected='true']:hover) {
            background: transparent;
            color: ${A.Highlight};
            fill: currentcolor;
          }
          :host([aria-selected='true']) {
            background: transparent;
            color: ${A.Highlight};
            fill: currentcolor;
          }
          :host(:${I}) {
            background: transparent;
            outline-color: ${A.ButtonText};
          }
        `))}),wg=nl.compose({baseName:`tab-panel`,template:tl,styles:(e,t)=>b`
  ${F(`block`)} :host {
    box-sizing: border-box;
    ${K}
    padding: 0 calc((6 + (${z} * 2 * ${Qu})) * 1px);
  }
`}),Tg=sl.compose({baseName:`tabs`,template:al,styles:Sg}),Eg=`.control`,Dg=(e,t)=>b`
    ${F(`inline-flex`)}

    ${Xm(e,t,Eg)}

    ${Zm(e,t,Eg)}

    :host {
      flex-direction: column;
      vertical-align: bottom;
    }

    .control {
      height: calc((${q} * 2) * 1px);
      padding: calc(${z} * 1.5px) calc(${z} * 2px + 1px);
    }

    :host .control {
      resize: none;
    }

    :host(.resize-both) .control {
      resize: both;
    }

    :host(.resize-horizontal) .control {
      resize: horizontal;
    }

    :host(.resize-vertical) .control {
      resize: vertical;
    }

    :host([cols]) {
      width: initial;
    }

    :host([rows]) .control {
      height: initial;
    }
  `.withBehaviors(Y(`outline`,Qm(e,t,Eg)),Y(`filled`,$m(e,t,Eg)),P(eh(e,t,Eg))),Og=class extends dl{appearanceChanged(e,t){e!==t&&(this.classList.add(t),this.classList.remove(e))}connectedCallback(){super.connectedCallback(),this.appearance||=`outline`}};J([y],Og.prototype,`appearance`,void 0);var kg=Og.compose({baseName:`text-area`,baseClass:dl,template:fl,styles:Dg,shadowOptions:{delegatesFocus:!0}}),Ag=`.root`,jg=(e,t)=>b`
    ${F(`inline-block`)}

    ${Xm(e,t,Ag)}

    ${Zm(e,t,Ag)}

    .root {
      display: flex;
      flex-direction: row;
    }

    .control {
      -webkit-appearance: none;
      color: inherit;
      background: transparent;
      border: 0;
      height: calc(100% - 4px);
      margin-top: auto;
      margin-bottom: auto;
      padding: 0 calc(${z} * 2px + 1px);
      font-family: inherit;
      font-size: inherit;
      line-height: inherit;
    }

    .start,
    .end {
      display: flex;
      margin: auto;
    }

    .start {
      display: flex;
      margin-inline-start: 11px;
    }

    .end {
      display: flex;
      margin-inline-end: 11px;
    }
  `.withBehaviors(Y(`outline`,Qm(e,t,Ag)),Y(`filled`,$m(e,t,Ag)),P(eh(e,t,Ag))),Mg=class extends pc{appearanceChanged(e,t){e!==t&&(this.classList.add(t),this.classList.remove(e))}connectedCallback(){super.connectedCallback(),this.appearance||=`outline`}};J([y],Mg.prototype,`appearance`,void 0);var Ng=Mg.compose({baseName:`text-field`,baseClass:pc,template:pl,styles:jg,shadowOptions:{delegatesFocus:!0}}),Pg=class extends _l{}.compose({baseName:`toolbar`,baseClass:_l,template:ml,styles:(e,t)=>b`
    ${F(`inline-flex`)} :host {
      --toolbar-item-gap: calc(${z} * 1px);
      background: ${U};
      fill: currentcolor;
      padding: var(--toolbar-item-gap);
      box-sizing: border-box;
      align-items: center;
    }

    :host(${I}) {
      ${vm}
    }

    .positioning-region {
      align-items: center;
      display: inline-flex;
      flex-flow: row wrap;
      justify-content: flex-start;
      flex-grow: 1;
    }

    :host([orientation='vertical']) .positioning-region {
      flex-direction: column;
      align-items: start;
    }

    ::slotted(:not([slot])) {
      flex: 0 0 auto;
      margin: 0 var(--toolbar-item-gap);
    }

    :host([orientation='vertical']) ::slotted(:not([slot])) {
      margin: var(--toolbar-item-gap) 0;
    }

    :host([orientation='vertical']) {
      display: inline-flex;
      flex-direction: column;
    }

    .start,
    .end {
      display: flex;
      align-items: center;
    }

    .end {
      margin-inline-start: auto;
    }

    .start__hidden,
    .end__hidden {
      display: none;
    }

    ::slotted(svg) {
      ${``}
      width: 16px;
      height: 16px;
    }
  `.withBehaviors(P(b`
        :host(:${I}) {
          outline-color: ${A.Highlight};
          color: ${A.ButtonText};
          forced-color-adjust: none;
        }
      `))}),Fg=class extends xl{connectedCallback(){super.connectedCallback(),U.setValueFor(this,Ff)}}.compose({baseName:`tooltip`,baseClass:xl,template:yl,styles:(e,t)=>b`
    :host {
      position: relative;
      contain: layout;
      overflow: visible;
      height: 0;
      width: 0;
      z-index: 10000;
    }

    .tooltip {
      box-sizing: border-box;
      border-radius: calc(${B} * 1px);
      border: calc(${V} * 1px) solid ${em};
      background: ${U};
      color: ${G};
      padding: 4px 12px;
      height: fit-content;
      width: fit-content;
      ${K}
      white-space: nowrap;
      box-shadow: ${Pm};
    }

    ${e.tagFor(M)} {
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: visible;
      flex-direction: row;
    }

    ${e.tagFor(M)}.right,
    ${e.tagFor(M)}.left {
      flex-direction: column;
    }

    ${e.tagFor(M)}.top .tooltip::after,
    ${e.tagFor(M)}.bottom .tooltip::after,
    ${e.tagFor(M)}.left .tooltip::after,
    ${e.tagFor(M)}.right .tooltip::after {
      content: '';
      width: 12px;
      height: 12px;
      background: ${U};
      border-top: calc(${V} * 1px) solid ${em};
      border-left: calc(${V} * 1px) solid ${em};
      position: absolute;
    }

    ${e.tagFor(M)}.top .tooltip::after {
      transform: translateX(-50%) rotate(225deg);
      bottom: 5px;
      left: 50%;
    }

    ${e.tagFor(M)}.top .tooltip {
      margin-bottom: 12px;
    }

    ${e.tagFor(M)}.bottom .tooltip::after {
      transform: translateX(-50%) rotate(45deg);
      top: 5px;
      left: 50%;
    }

    ${e.tagFor(M)}.bottom .tooltip {
      margin-top: 12px;
    }

    ${e.tagFor(M)}.left .tooltip::after {
      transform: translateY(-50%) rotate(135deg);
      top: 50%;
      right: 5px;
    }

    ${e.tagFor(M)}.left .tooltip {
      margin-right: 12px;
    }

    ${e.tagFor(M)}.right .tooltip::after {
      transform: translateY(-50%) rotate(-45deg);
      top: 50%;
      left: 5px;
    }

    ${e.tagFor(M)}.right .tooltip {
      margin-left: 12px;
    }
  `.withBehaviors(P(b`
        :host([disabled]) {
          opacity: 1;
        }
        ${e.tagFor(M)}.top .tooltip::after,
        ${e.tagFor(M)}.bottom .tooltip::after,
        ${e.tagFor(M)}.left .tooltip::after,
        ${e.tagFor(M)}.right .tooltip::after {
          content: '';
          width: unset;
          height: unset;
        }
      `))}),Ig=El.compose({baseName:`tree-view`,template:Tl,styles:(e,t)=>b`
  :host([hidden]) {
    display: none;
  }

  ${F(`flex`)} :host {
    flex-direction: column;
    align-items: stretch;
    min-width: fit-content;
    font-size: 0;
  }
`}),Lg=b`
  .expand-collapse-button svg {
    transform: rotate(0deg);
  }
  :host(.nested) .expand-collapse-button {
    left: var(--expand-collapse-button-nested-width, calc(${q} * -1px));
  }
  :host([selected])::after {
    left: calc(${ed} * 1px);
  }
  :host([expanded]) > .positioning-region .expand-collapse-button svg {
    transform: rotate(90deg);
  }
`,Rg=b`
  .expand-collapse-button svg {
    transform: rotate(180deg);
  }
  :host(.nested) .expand-collapse-button {
    right: var(--expand-collapse-button-nested-width, calc(${q} * -1px));
  }
  :host([selected])::after {
    right: calc(${ed} * 1px);
  }
  :host([expanded]) > .positioning-region .expand-collapse-button svg {
    transform: rotate(90deg);
  }
`,zg=jr`((${Xu} / 2) * ${z}) + ((${z} * ${Qu}) / 2)`,Bg=N.create(`tree-item-expand-collapse-hover`).withDefault(e=>{let t=Ep.getValueFor(e);return t.evaluate(e,t.evaluate(e).hover).hover}),Vg=N.create(`tree-item-expand-collapse-selected-hover`).withDefault(e=>{let t=xp.getValueFor(e);return Ep.getValueFor(e).evaluate(e,t.evaluate(e).rest).hover}),Hg={fluentAccordion:wm,fluentAccordionItem:Cm,fluentAnchor:ih,fluentAnchoredRegion:ah,fluentBadge:ch,fluentBreadcrumb:lh,fluentBreadcrumbItem:uh,fluentButton:hh,fluentCalendar:bh,fluentCard:Ch,fluentCheckbox:wh,fluentCombobox:Fh,fluentDataGrid:Bh,fluentDataGridCell:Rh,fluentDataGridRow:zh,fluentDesignSystemProvider:Uh,fluentDialog:Wh,fluentDivider:Gh,fluentFlipper:Kh,fluentHorizontalScroll:Xh,fluentListbox:Zh,fluentOption:Qh,fluentMenu:$h,fluentMenuItem:eg,fluentNumberField:ig,fluentProgress:ag,fluentProgressRing:og,fluentRadio:sg,fluentRadioGroup:cg,fluentSearch:hg,fluentSelect:_g,fluentSkeleton:vg,fluentSlider:yg,fluentSliderLabel:bg,fluentSwitch:xg,fluentTabs:Tg,fluentTab:Cg,fluentTabPanel:wg,fluentTextArea:kg,fluentTextField:Ng,fluentToolbar:Pg,fluentTooltip:Fg,fluentTreeView:Ig,fluentTreeItem:wl.compose({baseName:`tree-item`,template:Sl,styles:(e,t)=>b`
    ${F(`block`)} :host {
      contain: content;
      position: relative;
      outline: none;
      color: ${G};
      fill: currentcolor;
      cursor: pointer;
      font-family: ${td};
      --expand-collapse-button-size: calc(${q} * 1px);
      --tree-item-nested-width: 0;
    }

    .positioning-region {
      display: flex;
      position: relative;
      box-sizing: border-box;
      background: ${Dp};
      border: calc(${V} * 1px) solid transparent;
      border-radius: calc(${B} * 1px);
      height: calc((${q} + 1) * 1px);
    }

    :host(:${I}) .positioning-region {
      ${vm}
    }

    .positioning-region::before {
      content: '';
      display: block;
      width: var(--tree-item-nested-width);
      flex-shrink: 0;
    }

    :host(:not([disabled])) .positioning-region:hover {
      background: ${Op};
    }

    :host(:not([disabled])) .positioning-region:active {
      background: ${kp};
    }

    .content-region {
      display: inline-flex;
      align-items: center;
      white-space: nowrap;
      width: 100%;
      height: calc(${q} * 1px);
      margin-inline-start: calc(${z} * 2px + 8px);
      ${K}
    }

    .items {
      display: none;
      ${``} font-size: calc(1em + (${z} + 16) * 1px);
    }

    .expand-collapse-button {
      background: none;
      border: none;
      border-radius: calc(${B} * 1px);
      ${``} width: calc((${zg} + (${z} * 2)) * 1px);
      height: calc((${zg} + (${z} * 2)) * 1px);
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      margin: 0 6px;
    }

    .expand-collapse-button svg {
      transition: transform 0.1s linear;
      pointer-events: none;
    }

    .start,
    .end {
      display: flex;
    }

    .start {
      ${``} margin-inline-end: calc(${z} * 2px + 2px);
    }

    .end {
      ${``} margin-inline-start: calc(${z} * 2px + 2px);
    }

    :host(.expanded) > .items {
      display: block;
    }

    :host([disabled]) {
      opacity: ${Yu};
      cursor: ${Al};
    }

    :host(.nested) .content-region {
      position: relative;
      margin-inline-start: var(--expand-collapse-button-size);
    }

    :host(.nested) .expand-collapse-button {
      position: absolute;
    }

    :host(.nested) .expand-collapse-button:hover {
      background: ${Bg};
    }

    :host(:not([disabled])[selected]) .positioning-region {
      background: ${Sp};
    }

    :host(:not([disabled])[selected]) .expand-collapse-button:hover {
      background: ${Vg};
    }

    :host([selected])::after {
      content: '';
      display: block;
      position: absolute;
      top: calc((${q} / 4) * 1px);
      width: 3px;
      height: calc((${q} / 2) * 1px);
      ${``} background: ${W};
      border-radius: calc(${B} * 1px);
    }

    ::slotted(fluent-tree-item) {
      --tree-item-nested-width: 1em;
      --expand-collapse-button-nested-width: calc(${q} * -1px);
    }
  `.withBehaviors(new Tm(Lg,Rg),P(b`
        :host {
          color: ${A.ButtonText};
        }
        .positioning-region {
          border-color: ${A.ButtonFace};
          background: ${A.ButtonFace};
        }
        :host(:not([disabled])) .positioning-region:hover,
        :host(:not([disabled])) .positioning-region:active,
        :host(:not([disabled])[selected]) .positioning-region {
          background: ${A.Highlight};
        }
        :host .positioning-region:hover .content-region,
        :host([selected]) .positioning-region .content-region {
          forced-color-adjust: none;
          color: ${A.HighlightText};
        }
        :host([disabled][selected]) .positioning-region .content-region {
          color: ${A.GrayText};
        }
        :host([selected])::after {
          background: ${A.HighlightText};
        }
        :host(:${I}) .positioning-region {
          forced-color-adjust: none;
          outline-color: ${A.ButtonFace};
        }
        :host([disabled]),
        :host([disabled]) .content-region,
        :host([disabled]) .positioning-region:hover .content-region {
          opacity: 1;
          color: ${A.GrayText};
        }
        :host(.nested) .expand-collapse-button:hover,
        :host(:not([disabled])[selected]) .expand-collapse-button:hover {
          background: ${A.ButtonFace};
          fill: ${A.ButtonText};
        }
      `)),expandCollapseGlyph:`
    <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.65 2.15a.5.5 0 000 .7L7.79 6 4.65 9.15a.5.5 0 10.7.7l3.5-3.5a.5.5 0 000-.7l-3.5-3.5a.5.5 0 00-.7 0z"/>
    </svg>
  `}),register(e,...t){if(e)for(let n in this)n!==`register`&&this[n]().register(e,...t)}};function Ug(e){return xs.getOrCreate(e).withPrefix(`fluent`)}var Wg=pn(`auth`,()=>{let e=ne(null),t=ne(!1),n=p(()=>e.value!==null);async function r(){let[n,r]=await Te.get(`/api/auth/me`);return n?(e.value=null,t.value=!0,!1):(e.value=r,t.value=!0,!0)}async function i(e){be.set(e.trim());let t=await r();return t||be.clear(),t}function a(){be.clear(),e.value=null}return{status:e,ready:t,isAuthed:n,refresh:r,login:i,logout:a}}),Gg=pn(`version`,()=>{let e=ne(null);async function t(){if(e.value)return e.value;let[t,n]=await Te.get(`/api/version`);return t||(e.value=n),e.value}return{info:e,load:t}}),Kg=Se({__name:`App`,setup(e){let t=Wg(),n=Gg();return Ae(async()=>{await Promise.all([t.refresh(),n.load()])}),(e,t)=>{let n=r(`router-view`);return fe(),we(n)}}}),qg=typeof document<`u`;function Jg(e){return typeof e==`object`||`displayName`in e||`props`in e||`__vccOpts`in e}function Yg(e){return e.__esModule||e[Symbol.toStringTag]===`Module`||e.default&&Jg(e.default)}var Q=Object.assign;function Xg(e,t){let n={};for(let r in t){let i=t[r];n[r]=Qg(i)?i.map(e):e(i)}return n}var Zg=()=>{},Qg=Array.isArray;function $g(e,t){let n={};for(let r in e)n[r]=r in t?t[r]:e[r];return n}var $=function(e){return e[e.MATCHER_NOT_FOUND=1]=`MATCHER_NOT_FOUND`,e[e.NAVIGATION_GUARD_REDIRECT=2]=`NAVIGATION_GUARD_REDIRECT`,e[e.NAVIGATION_ABORTED=4]=`NAVIGATION_ABORTED`,e[e.NAVIGATION_CANCELLED=8]=`NAVIGATION_CANCELLED`,e[e.NAVIGATION_DUPLICATED=16]=`NAVIGATION_DUPLICATED`,e}({}),e_=Symbol(``);$.MATCHER_NOT_FOUND,$.NAVIGATION_GUARD_REDIRECT,$.NAVIGATION_ABORTED,$.NAVIGATION_CANCELLED,$.NAVIGATION_DUPLICATED;function t_(e,t){return Q(Error(),{type:e,[e_]:!0},t)}function n_(e,t){return e instanceof Error&&e_ in e&&(t==null||!!(e.type&t))}var r_=Symbol(``),i_=Symbol(``),a_=Symbol(``),o_=Symbol(``),s_=Symbol(``);function c_(){return me(a_)}function l_(e){return me(o_)}var u_=/#/g,d_=/&/g,f_=/\//g,p_=/=/g,m_=/\?/g,h_=/\+/g,g_=/%5B/g,__=/%5D/g,v_=/%5E/g,y_=/%60/g,b_=/%7B/g,x_=/%7C/g,S_=/%7D/g,C_=/%20/g;function w_(e){return e==null?``:encodeURI(``+e).replace(x_,`|`).replace(g_,`[`).replace(__,`]`)}function T_(e){return w_(e).replace(b_,`{`).replace(S_,`}`).replace(v_,`^`)}function E_(e){return w_(e).replace(h_,`%2B`).replace(C_,`+`).replace(u_,`%23`).replace(d_,`%26`).replace(y_,"`").replace(b_,`{`).replace(S_,`}`).replace(v_,`^`)}function D_(e){return E_(e).replace(p_,`%3D`)}function O_(e){return w_(e).replace(u_,`%23`).replace(m_,`%3F`)}function k_(e){return O_(e).replace(f_,`%2F`)}function A_(e){if(e==null)return null;try{return decodeURIComponent(``+e)}catch{}return``+e}var j_=/\/$/,M_=e=>e.replace(j_,``);function N_(e,t,n=`/`){let r,i={},a=``,o=``,s=t.indexOf(`#`),c=t.indexOf(`?`);return c=s>=0&&c>s?-1:c,c>=0&&(r=t.slice(0,c),a=t.slice(c,s>0?s:t.length),i=e(a.slice(1))),s>=0&&(r||=t.slice(0,s),o=t.slice(s,t.length)),r=V_(r??t,n),{fullPath:r+a+o,path:r,query:i,hash:A_(o)}}function P_(e,t){let n=t.query?e(t.query):``;return t.path+(n&&`?`)+n+(t.hash||``)}function F_(e,t){return!t||!e.toLowerCase().startsWith(t.toLowerCase())?e:e.slice(t.length)||`/`}function I_(e,t,n){let r=t.matched.length-1,i=n.matched.length-1;return r>-1&&r===i&&L_(t.matched[r],n.matched[i])&&R_(t.params,n.params)&&e(t.query)===e(n.query)&&t.hash===n.hash}function L_(e,t){return(e.aliasOf||e)===(t.aliasOf||t)}function R_(e,t){if(Object.keys(e).length!==Object.keys(t).length)return!1;for(var n in e)if(!z_(e[n],t[n]))return!1;return!0}function z_(e,t){return Qg(e)?B_(e,t):Qg(t)?B_(t,e):(e&&e.valueOf())===(t&&t.valueOf())}function B_(e,t){return Qg(t)?e.length===t.length&&e.every((e,n)=>e===t[n]):e.length===1&&e[0]===t}function V_(e,t){if(e.startsWith(`/`))return e;if(!e)return t;let n=t.split(`/`),r=e.split(`/`),i=r[r.length-1];(i===`..`||i===`.`)&&r.push(``);let a=n.length-1,o,s;for(o=0;o<r.length;o++)if(s=r[o],s!==`.`)if(s===`..`)a>1&&a--;else break;return n.slice(0,a).join(`/`)+`/`+r.slice(o).join(`/`)}var H_={path:`/`,name:void 0,params:{},query:{},hash:``,fullPath:`/`,matched:[],meta:{},redirectedFrom:void 0},U_=function(e){return e.pop=`pop`,e.push=`push`,e}({}),W_=function(e){return e.back=`back`,e.forward=`forward`,e.unknown=``,e}({});function G_(e){if(!e)if(qg){let t=document.querySelector(`base`);e=t&&t.getAttribute(`href`)||`/`,e=e.replace(/^\w+:\/\/[^/]+/,``)}else e=`/`;return e[0]!==`/`&&e[0]!==`#`&&(e=`/`+e),M_(e)}var K_=/^[^#]+#/;function q_(e,t){return e.replace(K_,`#`)+t}function J_(e,t){let n=document.documentElement.getBoundingClientRect(),r=e.getBoundingClientRect();return{behavior:t.behavior,left:r.left-n.left-(t.left||0),top:r.top-n.top-(t.top||0)}}var Y_=()=>({left:window.scrollX,top:window.scrollY});function X_(e){let t;if(`el`in e){let n=e.el,r=typeof n==`string`&&n.startsWith(`#`),i=typeof n==`string`?r?document.getElementById(n.slice(1)):document.querySelector(n):n;if(!i)return;t=J_(i,e)}else t=e;`scrollBehavior`in document.documentElement.style?window.scrollTo(t):window.scrollTo(t.left==null?window.scrollX:t.left,t.top==null?window.scrollY:t.top)}function Z_(e,t){return(history.state?history.state.position-t:-1)+e}var Q_=new Map;function $_(e,t){Q_.set(e,t)}function ev(e){let t=Q_.get(e);return Q_.delete(e),t}function tv(e){return typeof e==`string`||e&&typeof e==`object`}function nv(e){return typeof e==`string`||typeof e==`symbol`}function rv(e){let t={};if(e===``||e===`?`)return t;let n=(e[0]===`?`?e.slice(1):e).split(`&`);for(let e=0;e<n.length;++e){let r=n[e].replace(h_,` `),i=r.indexOf(`=`),a=A_(i<0?r:r.slice(0,i)),o=i<0?null:A_(r.slice(i+1));if(a in t){let e=t[a];Qg(e)||(e=t[a]=[e]),e.push(o)}else t[a]=o}return t}function iv(e){let t=``;for(let n in e){let r=e[n];if(n=D_(n),r==null){r!==void 0&&(t+=(t.length?`&`:``)+n);continue}(Qg(r)?r.map(e=>e&&E_(e)):[r&&E_(r)]).forEach(e=>{e!==void 0&&(t+=(t.length?`&`:``)+n,e!=null&&(t+=`=`+e))})}return t}function av(e){let t={};for(let n in e){let r=e[n];r!==void 0&&(t[n]=Qg(r)?r.map(e=>e==null?null:``+e):r==null?r:``+r)}return t}function ov(){let e=[];function t(t){return e.push(t),()=>{let n=e.indexOf(t);n>-1&&e.splice(n,1)}}function n(){e=[]}return{add:t,list:()=>e.slice(),reset:n}}function sv(e,t,n,r,i,a=e=>e()){let o=r&&(r.enterCallbacks[i]=r.enterCallbacks[i]||[]);return()=>new Promise((s,c)=>{let l=e=>{e===!1?c(t_($.NAVIGATION_ABORTED,{from:n,to:t})):e instanceof Error?c(e):tv(e)?c(t_($.NAVIGATION_GUARD_REDIRECT,{from:t,to:e})):(o&&r.enterCallbacks[i]===o&&typeof e==`function`&&o.push(e),s())},u=a(()=>e.call(r&&r.instances[i],t,n,l)),d=Promise.resolve(u);e.length<3&&(d=d.then(l)),d.catch(e=>c(e))})}function cv(e,t,n,r,i=e=>e()){let a=[];for(let o of e)for(let e in o.components){let s=o.components[e];if(!(t!==`beforeRouteEnter`&&!o.instances[e]))if(Jg(s)){let c=(s.__vccOpts||s)[t];c&&a.push(sv(c,n,r,o,e,i))}else{let c=s();a.push(()=>c.then(a=>{if(!a)throw Error(`Couldn't resolve component "${e}" at "${o.path}"`);let s=Yg(a)?a.default:a;o.mods[e]=a,o.components[e]=s;let c=(s.__vccOpts||s)[t];return c&&sv(c,n,r,o,e,i)()}))}}return a}function lv(e,t){let n=[],r=[],i=[],a=Math.max(t.matched.length,e.matched.length);for(let o=0;o<a;o++){let a=t.matched[o];a&&(e.matched.find(e=>L_(e,a))?r.push(a):n.push(a));let s=e.matched[o];s&&(t.matched.find(e=>L_(e,s))||i.push(s))}return[n,r,i]}var uv=()=>location.protocol+`//`+location.host;function dv(e,t){let{pathname:n,search:r,hash:i}=t,a=e.indexOf(`#`);if(a>-1){let t=i.includes(e.slice(a))?e.slice(a).length:1,n=i.slice(t);return n[0]!==`/`&&(n=`/`+n),F_(n,``)}return F_(n,e)+r+i}function fv(e,t,n,r){let i=[],a=[],o=null,s=({state:a})=>{let s=dv(e,location),c=n.value,l=t.value,u=0;if(a){if(n.value=s,t.value=a,o&&o===c){o=null;return}u=l?a.position-l.position:0}else r(s);i.forEach(e=>{e(n.value,c,{delta:u,type:U_.pop,direction:u?u>0?W_.forward:W_.back:W_.unknown})})};function c(){o=n.value}function l(e){i.push(e);let t=()=>{let t=i.indexOf(e);t>-1&&i.splice(t,1)};return a.push(t),t}function u(){if(document.visibilityState===`hidden`){let{history:e}=window;if(!e.state)return;e.replaceState(Q({},e.state,{scroll:Y_()}),``)}}function d(){for(let e of a)e();a=[],window.removeEventListener(`popstate`,s),window.removeEventListener(`pagehide`,u),document.removeEventListener(`visibilitychange`,u)}return window.addEventListener(`popstate`,s),window.addEventListener(`pagehide`,u),document.addEventListener(`visibilitychange`,u),{pauseListeners:c,listen:l,destroy:d}}function pv(e,t,n,r=!1,i=!1){return{back:e,current:t,forward:n,replaced:r,position:window.history.length,scroll:i?Y_():null}}function mv(e){let{history:t,location:n}=window,r={value:dv(e,n)},i={value:t.state};i.value||a(r.value,{back:null,current:r.value,forward:null,position:t.length-1,replaced:!0,scroll:null},!0);function a(r,a,o){let s=e.indexOf(`#`),c=s>-1?(n.host&&document.querySelector(`base`)?e:e.slice(s))+r:uv()+e+r;try{t[o?`replaceState`:`pushState`](a,``,c),i.value=a}catch(e){console.error(e),n[o?`replace`:`assign`](c)}}function o(e,n){a(e,Q({},t.state,pv(i.value.back,e,i.value.forward,!0),n,{position:i.value.position}),!0),r.value=e}function s(e,n){let o=Q({},i.value,t.state,{forward:e,scroll:Y_()});a(o.current,o,!0),a(e,Q({},pv(r.value,e,null),{position:o.position+1},n),!1),r.value=e}return{location:r,state:i,push:s,replace:o}}function hv(e){e=G_(e);let t=mv(e),n=fv(e,t.state,t.location,t.replace);function r(e,t=!0){t||n.pauseListeners(),history.go(e)}let i=Q({location:``,base:e,go:r,createHref:q_.bind(null,e)},t,n);return Object.defineProperty(i,`location`,{enumerable:!0,get:()=>t.location.value}),Object.defineProperty(i,`state`,{enumerable:!0,get:()=>t.state.value}),i}var gv=function(e){return e[e.Static=0]=`Static`,e[e.Param=1]=`Param`,e[e.Group=2]=`Group`,e}({}),_v=function(e){return e[e.Static=0]=`Static`,e[e.Param=1]=`Param`,e[e.ParamRegExp=2]=`ParamRegExp`,e[e.ParamRegExpEnd=3]=`ParamRegExpEnd`,e[e.EscapeNext=4]=`EscapeNext`,e}(_v||{}),vv={type:gv.Static,value:``},yv=/[a-zA-Z0-9_]/;function bv(e){if(!e)return[[]];if(e===`/`)return[[vv]];if(!e.startsWith(`/`))throw Error(`Invalid path "${e}"`);function t(e){throw Error(`ERR (${n})/"${l}": ${e}`)}let n=_v.Static,r=n,i=[],a;function o(){a&&i.push(a),a=[]}let s=0,c,l=``,u=``;function d(){l&&=(n===_v.Static?a.push({type:gv.Static,value:l}):n===_v.Param||n===_v.ParamRegExp||n===_v.ParamRegExpEnd?(a.length>1&&(c===`*`||c===`+`)&&t(`A repeatable param (${l}) must be alone in its segment. eg: '/:ids+.`),a.push({type:gv.Param,value:l,regexp:u,repeatable:c===`*`||c===`+`,optional:c===`*`||c===`?`})):t(`Invalid state to consume buffer`),``)}function f(){l+=c}for(;s<e.length;){if(c=e[s++],c===`\\`&&n!==_v.ParamRegExp){r=n,n=_v.EscapeNext;continue}switch(n){case _v.Static:c===`/`?(l&&d(),o()):c===`:`?(d(),n=_v.Param):f();break;case _v.EscapeNext:f(),n=r;break;case _v.Param:c===`(`?n=_v.ParamRegExp:yv.test(c)?f():(d(),n=_v.Static,c!==`*`&&c!==`?`&&c!==`+`&&s--);break;case _v.ParamRegExp:c===`)`?u[u.length-1]==`\\`?u=u.slice(0,-1)+c:n=_v.ParamRegExpEnd:u+=c;break;case _v.ParamRegExpEnd:d(),n=_v.Static,c!==`*`&&c!==`?`&&c!==`+`&&s--,u=``;break;default:t(`Unknown state`);break}}return n===_v.ParamRegExp&&t(`Unfinished custom RegExp for param "${l}"`),d(),o(),i}var xv=`[^/]+?`,Sv={sensitive:!1,strict:!1,start:!0,end:!0},Cv=function(e){return e[e._multiplier=10]=`_multiplier`,e[e.Root=90]=`Root`,e[e.Segment=40]=`Segment`,e[e.SubSegment=30]=`SubSegment`,e[e.Static=40]=`Static`,e[e.Dynamic=20]=`Dynamic`,e[e.BonusCustomRegExp=10]=`BonusCustomRegExp`,e[e.BonusWildcard=-50]=`BonusWildcard`,e[e.BonusRepeatable=-20]=`BonusRepeatable`,e[e.BonusOptional=-8]=`BonusOptional`,e[e.BonusStrict=.7000000000000001]=`BonusStrict`,e[e.BonusCaseSensitive=.25]=`BonusCaseSensitive`,e}(Cv||{}),wv=/[.+*?^${}()[\]/\\]/g;function Tv(e,t){let n=Q({},Sv,t),r=[],i=n.start?`^`:``,a=[];for(let t of e){let e=t.length?[]:[Cv.Root];n.strict&&!t.length&&(i+=`/`);for(let r=0;r<t.length;r++){let o=t[r],s=Cv.Segment+(n.sensitive?Cv.BonusCaseSensitive:0);if(o.type===gv.Static)r||(i+=`/`),i+=o.value.replace(wv,`\\$&`),s+=Cv.Static;else if(o.type===gv.Param){let{value:e,repeatable:n,optional:c,regexp:l}=o;a.push({name:e,repeatable:n,optional:c});let u=l||xv;if(u!==xv){s+=Cv.BonusCustomRegExp;try{RegExp(`(${u})`)}catch(t){throw Error(`Invalid custom RegExp for param "${e}" (${u}): `+t.message)}}let d=n?`((?:${u})(?:/(?:${u}))*)`:`(${u})`;r||(d=c&&t.length<2?`(?:/${d})`:`/`+d),c&&(d+=`?`),i+=d,s+=Cv.Dynamic,c&&(s+=Cv.BonusOptional),n&&(s+=Cv.BonusRepeatable),u===`.*`&&(s+=Cv.BonusWildcard)}e.push(s)}r.push(e)}if(n.strict&&n.end){let e=r.length-1;r[e][r[e].length-1]+=Cv.BonusStrict}n.strict||(i+=`/?`),n.end?i+=`$`:n.strict&&!i.endsWith(`/`)&&(i+=`(?:/|$)`);let o=new RegExp(i,n.sensitive?``:`i`);function s(e){let t=e.match(o),n={};if(!t)return null;for(let e=1;e<t.length;e++){let r=t[e]||``,i=a[e-1];n[i.name]=r&&i.repeatable?r.split(`/`):r}return n}function c(t){let n=``,r=!1;for(let i of e){(!r||!n.endsWith(`/`))&&(n+=`/`),r=!1;for(let e of i)if(e.type===gv.Static)n+=e.value;else if(e.type===gv.Param){let{value:a,repeatable:o,optional:s}=e,c=a in t?t[a]:``;if(Qg(c)&&!o)throw Error(`Provided param "${a}" is an array but it is not repeatable (* or + modifiers)`);let l=Qg(c)?c.join(`/`):c;if(!l)if(s)i.length<2&&(n.endsWith(`/`)?n=n.slice(0,-1):r=!0);else throw Error(`Missing required param "${a}"`);n+=l}}return n||`/`}return{re:o,score:r,keys:a,parse:s,stringify:c}}function Ev(e,t){let n=0;for(;n<e.length&&n<t.length;){let r=t[n]-e[n];if(r)return r;n++}return e.length<t.length?e.length===1&&e[0]===Cv.Static+Cv.Segment?-1:1:e.length>t.length?t.length===1&&t[0]===Cv.Static+Cv.Segment?1:-1:0}function Dv(e,t){let n=0,r=e.score,i=t.score;for(;n<r.length&&n<i.length;){let e=Ev(r[n],i[n]);if(e)return e;n++}if(Math.abs(i.length-r.length)===1){if(Ov(r))return 1;if(Ov(i))return-1}return i.length-r.length}function Ov(e){let t=e[e.length-1];return e.length>0&&t[t.length-1]<0}var kv={strict:!1,end:!0,sensitive:!1};function Av(e,t,n){let r=Q(Tv(bv(e.path),n),{record:e,parent:t,children:[],alias:[]});return t&&!r.record.aliasOf==!t.record.aliasOf&&t.children.push(r),r}function jv(e,t){let n=[],r=new Map;t=$g(kv,t);function i(e){return r.get(e)}function a(e,n,r){let i=!r,s=Nv(e);s.aliasOf=r&&r.record;let l=$g(t,e),u=[s];if(`alias`in e){let t=typeof e.alias==`string`?[e.alias]:e.alias;for(let e of t)u.push(Nv(Q({},s,{components:r?r.record.components:s.components,path:e,aliasOf:r?r.record:s})))}let d,f;for(let t of u){let{path:u}=t;if(n&&u[0]!==`/`){let e=n.record.path,r=e[e.length-1]===`/`?``:`/`;t.path=n.record.path+(u&&r+u)}if(d=Av(t,n,l),r?r.alias.push(d):(f||=d,f!==d&&f.alias.push(d),i&&e.name&&!Fv(d)&&o(e.name)),zv(d)&&c(d),s.children){let e=s.children;for(let t=0;t<e.length;t++)a(e[t],d,r&&r.children[t])}r||=d}return f?()=>{o(f)}:Zg}function o(e){if(nv(e)){let t=r.get(e);t&&(r.delete(e),n.splice(n.indexOf(t),1),t.children.forEach(o),t.alias.forEach(o))}else{let t=n.indexOf(e);t>-1&&(n.splice(t,1),e.record.name&&r.delete(e.record.name),e.children.forEach(o),e.alias.forEach(o))}}function s(){return n}function c(e){let t=Lv(e,n);n.splice(t,0,e),e.record.name&&!Fv(e)&&r.set(e.record.name,e)}function l(e,t){let i,a={},o,s;if(`name`in e&&e.name){if(i=r.get(e.name),!i)throw t_($.MATCHER_NOT_FOUND,{location:e});s=i.record.name,a=Q(Mv(t.params,i.keys.filter(e=>!e.optional).concat(i.parent?i.parent.keys.filter(e=>e.optional):[]).map(e=>e.name)),e.params&&Mv(e.params,i.keys.map(e=>e.name))),o=i.stringify(a)}else if(e.path!=null)o=e.path,i=n.find(e=>e.re.test(o)),i&&(a=i.parse(o),s=i.record.name);else{if(i=t.name?r.get(t.name):n.find(e=>e.re.test(t.path)),!i)throw t_($.MATCHER_NOT_FOUND,{location:e,currentLocation:t});s=i.record.name,a=Q({},t.params,e.params),o=i.stringify(a)}let c=[],l=i;for(;l;)c.unshift(l.record),l=l.parent;return{name:s,path:o,params:a,matched:c,meta:Iv(c)}}e.forEach(e=>a(e));function u(){n.length=0,r.clear()}return{addRoute:a,resolve:l,removeRoute:o,clearRoutes:u,getRoutes:s,getRecordMatcher:i}}function Mv(e,t){let n={};for(let r of t)r in e&&(n[r]=e[r]);return n}function Nv(e){let t={path:e.path,redirect:e.redirect,name:e.name,meta:e.meta||{},aliasOf:e.aliasOf,beforeEnter:e.beforeEnter,props:Pv(e),children:e.children||[],instances:{},leaveGuards:new Set,updateGuards:new Set,enterCallbacks:{},components:`components`in e?e.components||null:e.component&&{default:e.component}};return Object.defineProperty(t,`mods`,{value:{}}),t}function Pv(e){let t={},n=e.props||!1;if(`component`in e)t.default=n;else for(let r in e.components)t[r]=typeof n==`object`?n[r]:n;return t}function Fv(e){for(;e;){if(e.record.aliasOf)return!0;e=e.parent}return!1}function Iv(e){return e.reduce((e,t)=>Q(e,t.meta),{})}function Lv(e,t){let n=0,r=t.length;for(;n!==r;){let i=n+r>>1;Dv(e,t[i])<0?r=i:n=i+1}let i=Rv(e);return i&&(r=t.lastIndexOf(i,r-1)),r}function Rv(e){let t=e;for(;t=t.parent;)if(zv(t)&&Dv(e,t)===0)return t}function zv({record:e}){return!!(e.name||e.components&&Object.keys(e.components).length||e.redirect)}function Bv(e){let t=me(a_),n=me(o_),r=p(()=>{let n=je(e.to);return t.resolve(n)}),i=p(()=>{let{matched:e}=r.value,{length:t}=e,i=e[t-1],a=n.matched;if(!i||!a.length)return-1;let o=a.findIndex(L_.bind(null,i));if(o>-1)return o;let s=Gv(e[t-2]);return t>1&&Gv(i)===s&&a[a.length-1].path!==s?a.findIndex(L_.bind(null,e[t-2])):o}),a=p(()=>i.value>-1&&Wv(n.params,r.value.params)),o=p(()=>i.value>-1&&i.value===n.matched.length-1&&R_(n.params,r.value.params));function s(n={}){if(Uv(n)){let n=t[je(e.replace)?`replace`:`push`](je(e.to)).catch(Zg);return e.viewTransition&&typeof document<`u`&&`startViewTransition`in document&&document.startViewTransition(()=>n),n}return Promise.resolve()}return{route:r,href:p(()=>r.value.href),isActive:a,isExactActive:o,navigate:s}}function Vv(e){return e.length===1?e[0]:e}var Hv=Se({name:`RouterLink`,compatConfig:{MODE:3},props:{to:{type:[String,Object],required:!0},replace:Boolean,activeClass:String,exactActiveClass:String,custom:Boolean,ariaCurrentValue:{type:String,default:`page`},viewTransition:Boolean},useLink:Bv,setup(e,{slots:t}){let n=ee(Bv(e)),{options:r}=me(a_),i=p(()=>({[Kv(e.activeClass,r.linkActiveClass,`router-link-active`)]:n.isActive,[Kv(e.exactActiveClass,r.linkExactActiveClass,`router-link-exact-active`)]:n.isExactActive}));return()=>{let r=t.default&&Vv(t.default(n));return e.custom?r:ye(`a`,{"aria-current":n.isExactActive?e.ariaCurrentValue:null,href:n.href,onClick:n.navigate,class:i.value},r)}}});function Uv(e){if(!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)&&!e.defaultPrevented&&!(e.button!==void 0&&e.button!==0)){if(e.currentTarget&&e.currentTarget.getAttribute){let t=e.currentTarget.getAttribute(`target`);if(/\b_blank\b/i.test(t))return}return e.preventDefault&&e.preventDefault(),!0}}function Wv(e,t){for(let n in t){let r=t[n],i=e[n];if(typeof r==`string`){if(r!==i)return!1}else if(!Qg(i)||i.length!==r.length||r.some((e,t)=>e.valueOf()!==i[t].valueOf()))return!1}return!0}function Gv(e){return e?e.aliasOf?e.aliasOf.path:e.path:``}var Kv=(e,t,n)=>e??t??n,qv=Se({name:`RouterView`,inheritAttrs:!1,props:{name:{type:String,default:`default`},route:Object},compatConfig:{MODE:3},setup(e,{attrs:t,slots:n}){let r=me(s_),i=p(()=>e.route||r.value),a=me(i_,0),o=p(()=>{let e=je(a),{matched:t}=i.value,n;for(;(n=t[e])&&!n.components;)e++;return e}),s=p(()=>i.value.matched[o.value]);ke(i_,p(()=>o.value+1)),ke(r_,s),ke(s_,i);let c=ne();return Oe(()=>[c.value,s.value,e.name],([e,t,n],[r,i,a])=>{t&&(t.instances[n]=e,i&&i!==t&&e&&e===r&&(t.leaveGuards.size||(t.leaveGuards=i.leaveGuards),t.updateGuards.size||(t.updateGuards=i.updateGuards))),e&&t&&(!i||!L_(t,i)||!r)&&(t.enterCallbacks[n]||[]).forEach(t=>t(e))},{flush:`post`}),()=>{let r=i.value,a=e.name,o=s.value,l=o&&o.components[a];if(!l)return Jv(n.default,{Component:l,route:r});let u=o.props[a],d=ye(l,Q({},u?u===!0?r.params:typeof u==`function`?u(r):u:null,t,{onVnodeUnmounted:e=>{e.component.isUnmounted&&(o.instances[a]=null)},ref:c}));return Jv(n.default,{Component:d,route:r})||d}}});function Jv(e,t){if(!e)return null;let n=e(t);return n.length===1?n[0]:n}var Yv=qv;function Xv(e){let t=jv(e.routes,e),n=e.parseQuery||rv,r=e.stringifyQuery||iv,i=e.history,o=ov(),s=ov(),l=ov(),u=c(H_),d=H_;qg&&e.scrollBehavior&&`scrollRestoration`in history&&(history.scrollRestoration=`manual`);let f=Xg.bind(null,e=>``+e),ee=Xg.bind(null,k_),te=Xg.bind(null,A_);function ne(e,n){let r,i;return nv(e)?(r=t.getRecordMatcher(e),i=n):i=e,t.addRoute(i,r)}function re(e){let n=t.getRecordMatcher(e);n&&t.removeRoute(n)}function ie(){return t.getRoutes().map(e=>e.record)}function ae(e){return!!t.getRecordMatcher(e)}function oe(e,a){if(a=Q({},a||u.value),typeof e==`string`){let r=N_(n,e,a.path),o=t.resolve({path:r.path},a),s=i.createHref(r.fullPath);return Q(r,o,{params:te(o.params),redirectedFrom:void 0,href:s})}let o;if(e.path!=null)o=Q({},e,{path:N_(n,e.path,a.path).path});else{let t=Q({},e.params);for(let e in t)t[e]??delete t[e];o=Q({},e,{params:ee(t)}),a.params=ee(a.params)}let s=t.resolve(o,a),c=e.hash||``;s.params=f(te(s.params));let l=P_(r,Q({},e,{hash:T_(c),path:s.path})),d=i.createHref(l);return Q({fullPath:l,hash:c,query:r===iv?av(e.query):e.query||{}},s,{redirectedFrom:void 0,href:d})}function se(e){return typeof e==`string`?N_(n,e,u.value.path):Q({},e)}function ce(e,t){if(d!==e)return t_($.NAVIGATION_CANCELLED,{from:t,to:e})}function le(e){return fe(e)}function ue(e){return le(Q(se(e),{replace:!0}))}function p(e,t){let n=e.matched[e.matched.length-1];if(n&&n.redirect){let{redirect:r}=n,i=typeof r==`function`?r(e,t):r;return typeof i==`string`&&(i=i.includes(`?`)||i.includes(`#`)?i=se(i):{path:i},i.params={}),Q({query:e.query,hash:e.hash,params:i.path==null?e.params:{}},i)}}function fe(e,t){let n=d=oe(e),i=u.value,a=e.state,o=e.force,s=e.replace===!0,c=p(n,i);if(c)return fe(Q(se(c),{state:typeof c==`object`?Q({},a,c.state):a,force:o,replace:s}),t||n);let l=n;l.redirectedFrom=t;let f;return!o&&I_(r,i,n)&&(f=t_($.NAVIGATION_DUPLICATED,{to:l,from:i}),Ee(i,i,!0,!1)),(f?Promise.resolve(f):he(l,i)).catch(e=>n_(e)?n_(e,$.NAVIGATION_GUARD_REDIRECT)?e:Te(e):Ce(e,l,i)).then(e=>{if(e){if(n_(e,$.NAVIGATION_GUARD_REDIRECT))return fe(Q({replace:s},se(e.to),{state:typeof e.to==`object`?Q({},a,e.to.state):a,force:o}),t||l)}else e=_e(l,i,!0,s,a);return ge(l,i,e),e})}function pe(e,t){let n=ce(e,t);return n?Promise.reject(n):Promise.resolve()}function me(e){let t=ke.values().next().value;return t&&typeof t.runWithContext==`function`?t.runWithContext(e):e()}function he(e,t){let n,[r,i,a]=lv(e,t);n=cv(r.reverse(),`beforeRouteLeave`,e,t);for(let i of r)i.leaveGuards.forEach(r=>{n.push(sv(r,e,t))});let c=pe.bind(null,e,t);return n.push(c),Me(n).then(()=>{n=[];for(let r of o.list())n.push(sv(r,e,t));return n.push(c),Me(n)}).then(()=>{n=cv(i,`beforeRouteUpdate`,e,t);for(let r of i)r.updateGuards.forEach(r=>{n.push(sv(r,e,t))});return n.push(c),Me(n)}).then(()=>{n=[];for(let r of a)if(r.beforeEnter)if(Qg(r.beforeEnter))for(let i of r.beforeEnter)n.push(sv(i,e,t));else n.push(sv(r.beforeEnter,e,t));return n.push(c),Me(n)}).then(()=>(e.matched.forEach(e=>e.enterCallbacks={}),n=cv(a,`beforeRouteEnter`,e,t,me),n.push(c),Me(n))).then(()=>{n=[];for(let r of s.list())n.push(sv(r,e,t));return n.push(c),Me(n)}).catch(e=>n_(e,$.NAVIGATION_CANCELLED)?e:Promise.reject(e))}function ge(e,t,n){l.list().forEach(r=>me(()=>r(e,t,n)))}function _e(e,t,n,r,a){let o=ce(e,t);if(o)return o;let s=t===H_,c=qg?history.state:{};n&&(r||s?i.replace(e.fullPath,Q({scroll:s&&c&&c.scroll},a)):i.push(e.fullPath,a)),u.value=e,Ee(e,t,n,s),Te()}let ve;function ye(){ve||=i.listen((e,t,n)=>{if(!Ae.listening)return;let r=oe(e),a=p(r,Ae.currentRoute.value);if(a){fe(Q(a,{replace:!0,force:!0}),r).catch(Zg);return}d=r;let o=u.value;qg&&$_(Z_(o.fullPath,n.delta),Y_()),he(r,o).catch(e=>n_(e,$.NAVIGATION_ABORTED|$.NAVIGATION_CANCELLED)?e:n_(e,$.NAVIGATION_GUARD_REDIRECT)?(fe(Q(se(e.to),{force:!0}),r).then(e=>{n_(e,$.NAVIGATION_ABORTED|$.NAVIGATION_DUPLICATED)&&!n.delta&&n.type===U_.pop&&i.go(-1,!1)}).catch(Zg),Promise.reject()):(n.delta&&i.go(-n.delta,!1),Ce(e,r,o))).then(e=>{e||=_e(r,o,!1),e&&(n.delta&&!n_(e,$.NAVIGATION_CANCELLED)?i.go(-n.delta,!1):n.type===U_.pop&&n_(e,$.NAVIGATION_ABORTED|$.NAVIGATION_DUPLICATED)&&i.go(-1,!1)),ge(r,o,e)}).catch(Zg)})}let be=ov(),xe=ov(),Se;function Ce(e,t,n){Te(e);let r=xe.list();return r.length?r.forEach(r=>r(e,t,n)):console.error(e),Promise.reject(e)}function we(){return Se&&u.value!==H_?Promise.resolve():new Promise((e,t)=>{be.add([e,t])})}function Te(e){return Se||(Se=!e,ye(),be.list().forEach(([t,n])=>e?n(e):t()),be.reset()),e}function Ee(t,n,r,i){let{scrollBehavior:a}=e;if(!qg||!a)return Promise.resolve();let o=!r&&ev(Z_(t.fullPath,0))||(i||!r)&&history.state&&history.state.scroll||null;return de().then(()=>a(t,n,o)).then(e=>e&&X_(e)).catch(e=>Ce(e,t,n))}let De=e=>i.go(e),Oe,ke=new Set,Ae={currentRoute:u,listening:!0,addRoute:ne,removeRoute:re,clearRoutes:t.clearRoutes,hasRoute:ae,getRoutes:ie,resolve:oe,options:e,push:le,replace:ue,go:De,back:()=>De(-1),forward:()=>De(1),beforeEach:o.add,beforeResolve:s.add,afterEach:l.add,onError:xe.add,isReady:we,install(e){e.component(`RouterLink`,Hv),e.component(`RouterView`,Yv),e.config.globalProperties.$router=Ae,Object.defineProperty(e.config.globalProperties,`$route`,{enumerable:!0,get:()=>je(u)}),qg&&!Oe&&u.value===H_&&(Oe=!0,le(i.location).catch(e=>{}));let t={};for(let e in H_)Object.defineProperty(t,e,{get:()=>u.value[e],enumerable:!0});e.provide(a_,Ae),e.provide(o_,a(t)),e.provide(s_,u);let n=e.unmount;ke.add(e),e.unmount=function(){ke.delete(e),ke.size<1&&(d=H_,ve&&ve(),ve=null,u.value=H_,Oe=!1,Se=!1),n()}}};function Me(e){return e.reduce((e,t)=>e.then(()=>me(t)),Promise.resolve())}return Ae}var Zv=`modulepreload`,Qv=function(e){return`/`+e},$v={},ey=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}r=o(t.map(t=>{if(t=Qv(t,n),t in $v)return;$v[t]=!0;let r=t.endsWith(`.css`),i=r?`[rel="stylesheet"]`:``;if(n)for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}else if(document.querySelector(`link[href="${t}"]${i}`))return;let o=document.createElement(`link`);if(o.rel=r?`stylesheet`:Zv,r||(o.as=`script`),o.crossOrigin=``,o.href=t,a&&o.setAttribute(`nonce`,a),document.head.appendChild(o),r)return new Promise((e,n)=>{o.addEventListener(`load`,e),o.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})},ty=Xv({history:hv(),routes:[{path:`/login`,name:`login`,component:()=>ey(()=>import(`./Login-lO02capF.js`),__vite__mapDeps([0,1])),meta:{public:!0}},{path:`/`,component:()=>ey(()=>import(`./AppShell-Da7ngza_.js`),__vite__mapDeps([2,1,3])),children:[{path:``,redirect:`/dashboard`},{path:`dashboard`,name:`dashboard`,component:()=>ey(()=>import(`./Dashboard-B5oTpDq9.js`),__vite__mapDeps([4,1,3]))},{path:`server`,name:`server`,component:()=>ey(()=>import(`./Server-Dbr19gJi.js`),__vite__mapDeps([5,1,3,6]))},{path:`clients`,name:`clients`,component:()=>ey(()=>import(`./Clients-BnAeu3rO.js`),__vite__mapDeps([7,1,3]))},{path:`endpoints`,name:`endpoints`,component:()=>ey(()=>import(`./Endpoints-fP2PRKQm.js`),__vite__mapDeps([8,1,6]))}]},{path:`/:pathMatch(.*)*`,redirect:`/dashboard`}]});ty.beforeEach(async e=>{if(e.meta.public)return!0;let t=Wg();return t.ready||await t.refresh(),t.isAuthed?!0:{name:`login`,query:{redirect:e.fullPath}}}),Ug().register(Hg);var ny=jt(Kg);ny.use(Qt()),ny.use(ty),ny.mount(`#app`);export{pn as a,Dt as c,Wg as i,c_ as n,Ct as o,Gg as r,St as s,l_ as t};