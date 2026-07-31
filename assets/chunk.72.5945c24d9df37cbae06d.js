/*! For license information please see chunk.72.5945c24d9df37cbae06d.js.LICENSE.txt */
"use strict";(globalThis.webpackChunk_ember_auto_import_=globalThis.webpackChunk_ember_auto_import_||[]).push([[72],{945:(e,t,n)=>{n.r(t),n.d(t,{default:()=>Ne})
var r=n(831),o=n.n(r),i=(n(341),n(773))
function a(e,t){for(var n=0,r=e.length;n<r;n++)if(e[n]===t)return n
return-1}function s(e){var t=e._promiseCallbacks
return t||(t=e._promiseCallbacks={}),t}var u={mixin:function(e){return e.on=this.on,e.off=this.off,e.trigger=this.trigger,e._promiseCallbacks=void 0,e},on:function(e,t){if("function"!=typeof t)throw new TypeError("Callback must be a function")
var n=s(this),r=void 0;(r=n[e])||(r=n[e]=[]),-1===a(r,t)&&r.push(t)},off:function(e,t){var n,r=s(this),o=void 0
t?-1!==(n=a(o=r[e],t))&&o.splice(n,1):r[e]=[]},trigger:function(e,t,n){var r
if(r=s(this)[e])for(var o=0;o<r.length;o++)(0,r[o])(t,n)}},c={instrument:!1}
function l(e,t){if(2!==arguments.length)return c[e]
c[e]=t}function f(e){return"function"==typeof e}function d(e){return null!==e&&"object"==typeof e}u.mixin(c)
var h=Array.isArray?Array.isArray:function(e){return"[object Array]"===Object.prototype.toString.call(e)},p=Date.now||function(){return(new Date).getTime()},v=[]
function b(e,t,n){1===v.push({name:e,payload:{key:t._guidKey,id:t._id,eventName:e,detail:t._result,childId:n&&n._id,label:t._label,timeStamp:p(),error:c["instrument-with-stack"]?new Error(t._label):null}})&&setTimeout((function(){for(var e=0;e<v.length;e++){var t=v[e],n=t.payload
n.guid=n.key+n.id,n.childGuid=n.key+n.childId,n.error&&(n.stack=n.error.stack),c.trigger(t.name,t.payload)}v.length=0}),50)}function m(e,t){if(e&&"object"==typeof e&&e.constructor===this)return e
var n=new this(y,t)
return T(n,e),n}function y(){}var w=void 0,g=new A
function _(e){try{return e.then}catch(e){return g.error=e,g}}function E(e,t,n){t.constructor===e.constructor&&n===P&&e.constructor.resolve===m?function(e,t){1===t._state?O(e,t._result):2===t._state?(t._onError=null,N(e,t._result)):S(t,void 0,(function(n){t!==n?T(e,n):O(e,n)}),(function(t){return N(e,t)}))}(e,t):n===g?(N(e,g.error),g.error=null):f(n)?function(e,t,n){c.async((function(e){var r=!1,o=function(n,o,i,a){try{n.call(o,(function(n){r||(r=!0,t!==n?T(e,n):O(e,n))}),(function(t){r||(r=!0,N(e,t))}))}catch(e){return e}}(n,t,0,0,e._label)
!r&&o&&(r=!0,N(e,o))}),e)}(e,t,n):O(e,t)}function T(e,t){var n,r
e===t?O(e,t):(r=typeof(n=t),null===n||"object"!==r&&"function"!==r?O(e,t):E(e,t,_(t)))}function C(e){e._onError&&e._onError(e._result),j(e)}function O(e,t){e._state===w&&(e._result=t,e._state=1,0===e._subscribers.length?c.instrument&&b("fulfilled",e):c.async(j,e))}function N(e,t){e._state===w&&(e._state=2,e._result=t,c.async(C,e))}function S(e,t,n,r){var o=e._subscribers,i=o.length
e._onError=null,o[i]=t,o[i+1]=n,o[i+2]=r,0===i&&e._state&&c.async(j,e)}function j(e){var t=e._subscribers,n=e._state
if(c.instrument&&b(1===n?"fulfilled":"rejected",e),0!==t.length){for(var r=void 0,o=void 0,i=e._result,a=0;a<t.length;a+=3)r=t[a],o=t[a+n],r?k(n,r,o,i):o(i)
e._subscribers.length=0}}function A(){this.error=null}var R=new A
function k(e,t,n,r){var o=f(n),i=void 0,a=void 0
if(o){if(i=function(e,t){try{return e(t)}catch(e){return R.error=e,R}}(n,r),i===R)a=i.error,i.error=null
else if(i===t)return void N(t,new TypeError("A promises callback cannot return that same promise."))}else i=r
t._state!==w||(o&&void 0===a?T(t,i):void 0!==a?N(t,a):1===e?O(t,i):2===e&&N(t,i))}function P(e,t,n){var r=this,o=r._state
if(1===o&&!e||2===o&&!t)return c.instrument&&b("chained",r,r),r
r._onError=null
var i=new r.constructor(y,n),a=r._result
if(c.instrument&&b("chained",r,i),o===w)S(r,i,e,t)
else{var s=1===o?e:t
c.async((function(){return k(o,i,s,a)}))}return i}var I=function(){function e(e,t,n,r){this._instanceConstructor=e,this.promise=new e(y,r),this._abortOnReject=n,this._init.apply(this,arguments)}return e.prototype._init=function(e,t){var n=t.length||0
this.length=n,this._remaining=n,this._result=new Array(n),this._enumerate(t),0===this._remaining&&O(this.promise,this._result)},e.prototype._enumerate=function(e){for(var t=this.length,n=this.promise,r=0;n._state===w&&r<t;r++)this._eachEntry(e[r],r)},e.prototype._settleMaybeThenable=function(e,t){var n=this._instanceConstructor,r=n.resolve
if(r===m){var o=_(e)
if(o===P&&e._state!==w)e._onError=null,this._settledAt(e._state,t,e._result)
else if("function"!=typeof o)this._remaining--,this._result[t]=this._makeResult(1,t,e)
else if(n===M){var i=new n(y)
E(i,e,o),this._willSettleAt(i,t)}else this._willSettleAt(new n((function(t){return t(e)})),t)}else this._willSettleAt(r(e),t)},e.prototype._eachEntry=function(e,t){var n
null!==(n=e)&&"object"==typeof n?this._settleMaybeThenable(e,t):(this._remaining--,this._result[t]=this._makeResult(1,t,e))},e.prototype._settledAt=function(e,t,n){var r=this.promise
r._state===w&&(this._abortOnReject&&2===e?N(r,n):(this._remaining--,this._result[t]=this._makeResult(e,t,n),0===this._remaining&&O(r,this._result)))},e.prototype._makeResult=function(e,t,n){return n},e.prototype._willSettleAt=function(e,t){var n=this
S(e,void 0,(function(e){return n._settledAt(1,t,e)}),(function(e){return n._settledAt(2,t,e)}))},e}()
function F(e,t,n){return 1===e?{state:"fulfilled",value:n}:{state:"rejected",reason:n}}var D="rsvp_"+p()+"-",x=0,M=function(){function e(t,n){this._id=x++,this._label=n,this._state=void 0,this._result=void 0,this._subscribers=[],c.instrument&&b("created",this),y!==t&&("function"!=typeof t&&function(){throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")}(),this instanceof e?function(e,t){var n=!1
try{t((function(t){n||(n=!0,T(e,t))}),(function(t){n||(n=!0,N(e,t))}))}catch(t){N(e,t)}}(this,t):function(){throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")}())}return e.prototype._onError=function(e){var t=this
c.after((function(){t._onError&&c.trigger("error",e,t._label)}))},e.prototype.catch=function(e,t){return this.then(void 0,e,t)},e.prototype.finally=function(e,t){var n=this.constructor
return this.then((function(t){return n.resolve(e()).then((function(){return t}))}),(function(t){return n.resolve(e()).then((function(){throw t}))}),t)},e}()
function G(){this.value=void 0}M.cast=m,M.all=function(e,t){return h(e)?new I(this,e,!0,t).promise:this.reject(new TypeError("Promise.all must be called with an array"),t)},M.race=function(e,t){var n=new this(y,t)
if(!h(e))return N(n,new TypeError("Promise.race must be called with an array")),n
for(var r=0;n._state===w&&r<e.length;r++)S(this.resolve(e[r]),void 0,(function(e){return T(n,e)}),(function(e){return N(n,e)}))
return n},M.resolve=m,M.reject=function(e,t){var n=new this(y,t)
return N(n,e),n},M.prototype._guidKey=D,M.prototype.then=P
var L=new G,$=new G
function B(e,t,n){try{e.apply(t,n)}catch(e){return L.value=e,L}}function U(e,t){for(var n={},r=e.length,o=new Array(r),i=0;i<r;i++)o[i]=e[i]
for(var a=0;a<t.length;a++)n[t[a]]=o[a+1]
return n}function V(e){for(var t=e.length,n=new Array(t-1),r=1;r<t;r++)n[r-1]=e[r]
return n}function q(e,t){return{then:function(n,r){return e.call(t,n,r)}}}function K(e,t,n,r){var o=B(n,r,t)
return o===L&&N(e,o.value),e}function Y(e,t,n,r){return M.all(t).then((function(t){var o=B(n,r,t)
return o===L&&N(e,o.value),e}))}function z(e){return!(!e||"object"!=typeof e)&&(e.constructor===M||function(e){try{return e.then}catch(e){return L.value=e,L}}(e))}var W=function(e){function t(t,n,r){return function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,e.call(this,t,n,!1,r))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t}(I)
function X(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}W.prototype._makeResult=F
var H=Object.prototype.hasOwnProperty,J=function(e){function t(t,n){var r=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],o=arguments[3]
return X(this,e.call(this,t,n,r,o))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype._init=function(e,t){this._result={},this._enumerate(t),0===this._remaining&&O(this.promise,this._result)},t.prototype._enumerate=function(e){var t=this.promise,n=[]
for(var r in e)H.call(e,r)&&n.push({position:r,entry:e[r]})
var o=n.length
this._remaining=o
for(var i=void 0,a=0;t._state===w&&a<o;a++)i=n[a],this._eachEntry(i.entry,i.position)},t}(I),Q=function(e){function t(t,n,r){return function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,e.call(this,t,n,!1,r))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t}(J)
function Z(e,t){return M.resolve(e,t)}function ee(e,t){return M.all(e,t)}Q.prototype._makeResult=F
var te=0,ne=void 0
function re(e,t){le[te]=e,le[te+1]=t,2===(te+=2)&&me()}var oe="undefined"!=typeof window?window:void 0,ie=oe||{},ae=ie.MutationObserver||ie.WebKitMutationObserver,se="undefined"==typeof self&&"undefined"!=typeof process&&"[object process]"==={}.toString.call(process),ue="undefined"!=typeof Uint8ClampedArray&&"undefined"!=typeof importScripts&&"undefined"!=typeof MessageChannel
function ce(){return function(){return setTimeout(fe,1)}}var le=new Array(1e3)
function fe(){for(var e=0;e<te;e+=2)(0,le[e])(le[e+1]),le[e]=void 0,le[e+1]=void 0
te=0}var de,he,pe,ve,be,me=void 0
if(se?me=function(){var e=process.nextTick,t=process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/)
return Array.isArray(t)&&"0"===t[1]&&"10"===t[2]&&(e=setImmediate),function(){return e(fe)}}():ae?(he=0,pe=new ae(fe),ve=document.createTextNode(""),pe.observe(ve,{characterData:!0}),me=function(){return ve.data=he=++he%2}):ue?((de=new MessageChannel).port1.onmessage=fe,me=function(){return de.port2.postMessage(0)}):me=void 0===oe?function(){try{var e=n(185)
return void 0!==(ne=e.runOnLoop||e.runOnContext)?function(){ne(fe)}:ce()}catch(e){return ce()}}():ce(),"object"==typeof self)self
else{if("object"!=typeof n.g)throw new Error("no global: `self` or `global` found")
n.g}function ye(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}c.async=re,c.after=function(e){return setTimeout(e,0)}
var we=Z
function ge(){c.on.apply(c,arguments)}if("undefined"!=typeof window&&"object"==typeof window.__PROMISE_INSTRUMENTATION__){var _e=window.__PROMISE_INSTRUMENTATION__
for(var Ee in l("instrument",!0),_e)_e.hasOwnProperty(Ee)&&ge(Ee,_e[Ee])}function Te(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function Ce(){return new M((e=>{window.requestAnimationFrame((()=>e()))}))}let Oe
ye(be={asap:re,cast:we,Promise:M,EventTarget:u,all:function(e,t){return M.all(e,t)},allSettled:function(e,t){return h(e)?new W(M,e,t).promise:M.reject(new TypeError("Promise.allSettled must be called with an array"),t)},race:function(e,t){return M.race(e,t)},hash:function(e,t){return d(e)?new J(M,e,t).promise:M.reject(new TypeError("Promise.hash must be called with an object"),t)},hashSettled:function(e,t){return d(e)?new Q(M,e,!1,t).promise:M.reject(new TypeError("RSVP.hashSettled must be called with an object"),t)},rethrow:function(e){throw setTimeout((function(){throw e})),e},defer:function(e){var t={resolve:void 0,reject:void 0}
return t.promise=new M((function(e,n){t.resolve=e,t.reject=n}),e),t},denodeify:function(e,t){var n=function(){for(var n=this,r=arguments.length,o=new Array(r+1),i=!1,a=0;a<r;++a){var s=arguments[a]
if(!i){if((i=z(s))===$){var u=new M(y)
return N(u,$.value),u}i&&!0!==i&&(s=q(i,s))}o[a]=s}var c=new M(y)
return o[r]=function(e,n){e?N(c,e):void 0===t?T(c,n):!0===t?T(c,V(arguments)):h(t)?T(c,U(arguments,t)):T(c,n)},i?Y(c,o,e,n):K(c,o,e,n)}
return n.__proto__=e,n},configure:l,on:ge,off:function(){c.off.apply(c,arguments)},resolve:Z,reject:function(e,t){return M.reject(e,t)},map:function(e,t,n){return h(e)?f(t)?M.all(e,n).then((function(e){for(var r=e.length,o=new Array(r),i=0;i<r;i++)o[i]=t(e[i])
return M.all(o,n)})):M.reject(new TypeError("RSVP.map expects a function as a second argument"),n):M.reject(new TypeError("RSVP.map must be called with an array"),n)}},"async",(function(e,t){return c.async(e,t)})),ye(be,"filter",(function(e,t,n){if(!(h(e)||d(e)&&void 0!==e.then))return M.reject(new TypeError("RSVP.filter must be called with an array or promise"),n)
if(!f(t))return M.reject(new TypeError("RSVP.filter expects function as a second argument"),n)
var r=h(e)?ee(e,n):function(e,t){return M.resolve(e,t).then((function(e){return ee(e,t)}))}(e,n)
return r.then((function(e){for(var r=e.length,o=new Array(r),i=0;i<r;i++)o[i]=t(e[i])
return ee(o,n).then((function(t){for(var n=new Array(r),o=0,i=0;i<r;i++)t[i]&&(n[o]=e[i],o++)
return n.length=o,n}))}))})),Oe=class extends(o()){constructor(){super(...arguments),Te(this,"clone",null),Te(this,"parentElement",null),Te(this,"nextElementSibling",null),Te(this,"installed",!1)}get el(){return this.clone||this.element}get transitionName(){return this.args.positional[0]||this.args.named.name}get enterClass(){return this.args.named.enterClass||this.transitionName&&`${this.transitionName}-enter`}get enterActiveClass(){return this.args.named.enterActiveClass||this.transitionName&&`${this.transitionName}-enter-active`}get enterToClass(){return this.args.named.enterToClass||this.transitionName&&`${this.transitionName}-enter-to`}get leaveClass(){return this.args.named.leaveClass||this.transitionName&&`${this.transitionName}-leave`}get leaveActiveClass(){return this.args.named.leaveActiveClass||this.transitionName&&`${this.transitionName}-leave-active`}get leaveToClass(){return this.args.named.leaveToClass||this.transitionName&&`${this.transitionName}-leave-to`}didInstall(){if(!1===this.args.named.isEnabled)return
let e=this.getElementToClone()
this.parentElement=e.parentElement,this.nextElementSibling=e.nextElementSibling,this.guardedRun(this.transitionIn)}willRemove(){!1!==this.args.named.isEnabled&&this.installed&&this.guardedRun(this.transitionOut)}addClone(){let e=this.getElementToClone(),t=e.parentElement||this.parentElement,n=e.nextElementSibling||this.nextElementSibling
n&&n.parentElement!==t&&(n=null)
let r=e.cloneNode(!0)
r.setAttribute("id",`${e.id}_clone`),t.insertBefore(r,n),this.clone=r}getElementToClone(){return this.args.named.parentSelector?this.element.closest(this.args.named.parentSelector):this.element}removeClone(){this.clone.isConnected&&null!==this.clone.parentNode&&this.clone.parentNode.removeChild(this.clone)}*transitionIn(){this.enterClass&&(yield*this.transition({className:this.enterClass,activeClassName:this.enterActiveClass,toClassName:this.enterToClass}),this.args.named.didTransitionIn&&this.args.named.didTransitionIn()),this.installed=!0}*transitionOut(){this.leaveClass&&(this.addClone(),yield Ce(),yield*this.transition({className:this.leaveClass,activeClassName:this.leaveActiveClass,toClassName:this.leaveToClass}),this.removeClone(),this.args.named.didTransitionOut&&this.args.named.didTransitionOut(),this.clone=null)}*transition(e){let{className:t,activeClassName:n,toClassName:r}=e,o=this.el
var a
this.addClass(t),this.addClass(n),yield Ce(),o.scrollTop,this.addClass(r),this.removeClass(t),yield(a=function(e){let{transitionDuration:t,transitionDelay:n,animationDuration:r,animationDelay:o,animationIterationCount:i}=window.getComputedStyle(e)
return 1e3*(Math.max(parseFloat(o),parseFloat(n))+Math.max(parseFloat(r)*parseFloat(i),parseFloat(t)))}(o)||0,new M((e=>{(0,i.later)((()=>e()),a)}))),this.removeClass(r),this.removeClass(n)}addClass(e){this.el.classList.add(...e.trim().split(/\s+/))}removeClass(e){this.el.classList.remove(...e.trim().split(/\s+/))}async guardedRun(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r]
let o=e.call(this,...n),i=!1
for(;!i&&this.el;){let{value:e,done:t}=o.next()
i=t,await e}}}
var Ne=Oe},174:(e,t,n)=>{n.r(t),n.d(t,{default:()=>u,modifier:()=>l})
var r=n(292),o=n(927),i=n(341)
function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}class s{constructor(e){a(this,"owner",void 0),a(this,"capabilities",(0,o.capabilities)("3.22")),this.owner=e}createModifier(e,t){return{instance:new e(this.owner,t),element:null}}installModifier(e,t,n){const r=function(e,t){const n=e
return n.element=t,n}(e,t)
r.instance.modify(t,n.positional,n.named)}updateModifier(e,t){e.instance.modify(e.element,t.positional,t.named)}destroyModifier(e){let{instance:t}=e;(0,i.destroy)(t)}}class u{constructor(e,t){(0,r.setOwner)(this,e)}modify(e,t,n){}}(0,o.setModifierManager)((e=>new s(e)),u)
const c=new class{constructor(){a(this,"capabilities",(0,o.capabilities)("3.22"))}createModifier(e){return{element:null,instance:e}}installModifier(e,t,n){const r=function(e,t){const n=e
return n.element=t,n}(e,t),{positional:o,named:i}=n,a=e.instance(t,o,i)
"function"==typeof a&&(r.teardown=a)}updateModifier(e,t){"function"==typeof e.teardown&&e.teardown()
const n=e.instance(e.element,t.positional,t.named)
"function"==typeof n&&(e.teardown=n)}destroyModifier(e){"function"==typeof e.teardown&&e.teardown()}}
function l(e){return(0,o.setModifierManager)((()=>c),e)}},231:(e,t,n)=>{n.r(t),n.d(t,{createFocusTrap:()=>k})
var r=["input","select","textarea","a[href]","button","[tabindex]:not(slot)","audio[controls]","video[controls]",'[contenteditable]:not([contenteditable="false"])',"details>summary:first-of-type","details"],o=r.join(","),i="undefined"==typeof Element,a=i?function(){}:Element.prototype.matches||Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector,s=!i&&Element.prototype.getRootNode?function(e){return e.getRootNode()}:function(e){return e.ownerDocument},u=function(e,t,n){var r=Array.prototype.slice.apply(e.querySelectorAll(o))
return t&&a.call(e,o)&&r.unshift(e),r.filter(n)},c=function e(t,n,r){for(var i=[],s=Array.from(t);s.length;){var u=s.shift()
if("SLOT"===u.tagName){var c=u.assignedElements(),l=e(c.length?c:u.children,!0,r)
r.flatten?i.push.apply(i,l):i.push({scope:u,candidates:l})}else{a.call(u,o)&&r.filter(u)&&(n||!t.includes(u))&&i.push(u)
var f=u.shadowRoot||"function"==typeof r.getShadowRoot&&r.getShadowRoot(u),d=!r.shadowRootFilter||r.shadowRootFilter(u)
if(f&&d){var h=e(!0===f?u.children:f.children,!0,r)
r.flatten?i.push.apply(i,h):i.push({scope:u,candidates:h})}else s.unshift.apply(s,u.children)}}return i},l=function(e,t){return e.tabIndex<0&&(t||/^(AUDIO|VIDEO|DETAILS)$/.test(e.tagName)||e.isContentEditable)&&isNaN(parseInt(e.getAttribute("tabindex"),10))?0:e.tabIndex},f=function(e,t){return e.tabIndex===t.tabIndex?e.documentOrder-t.documentOrder:e.tabIndex-t.tabIndex},d=function(e){return"INPUT"===e.tagName},h=function(e){var t=e.getBoundingClientRect(),n=t.width,r=t.height
return 0===n&&0===r},p=function(e,t){return!(t.disabled||function(e){return d(e)&&"hidden"===e.type}(t)||function(e,t){var n=t.displayCheck,r=t.getShadowRoot
if("hidden"===getComputedStyle(e).visibility)return!0
var o=a.call(e,"details>summary:first-of-type")?e.parentElement:e
if(a.call(o,"details:not([open]) *"))return!0
var i=s(e).host,u=(null==i?void 0:i.ownerDocument.contains(i))||e.ownerDocument.contains(e)
if(n&&"full"!==n){if("non-zero-area"===n)return h(e)}else{if("function"==typeof r){for(var c=e;e;){var l=e.parentElement,f=s(e)
if(l&&!l.shadowRoot&&!0===r(l))return h(e)
e=e.assignedSlot?e.assignedSlot:l||f===e.ownerDocument?l:f.host}e=c}if(u)return!e.getClientRects().length}return!1}(t,e)||function(e){return"DETAILS"===e.tagName&&Array.prototype.slice.apply(e.children).some((function(e){return"SUMMARY"===e.tagName}))}(t)||function(e){if(/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(e.tagName))for(var t=e.parentElement;t;){if("FIELDSET"===t.tagName&&t.disabled){for(var n=0;n<t.children.length;n++){var r=t.children.item(n)
if("LEGEND"===r.tagName)return!!a.call(t,"fieldset[disabled] *")||!r.contains(e)}return!0}t=t.parentElement}return!1}(t))},v=function(e,t){return!(function(e){return function(e){return d(e)&&"radio"===e.type}(e)&&!function(e){if(!e.name)return!0
var t,n=e.form||s(e),r=function(e){return n.querySelectorAll('input[type="radio"][name="'+e+'"]')}
if("undefined"!=typeof window&&void 0!==window.CSS&&"function"==typeof window.CSS.escape)t=r(window.CSS.escape(e.name))
else try{t=r(e.name)}catch(e){return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s",e.message),!1}var o=function(e,t){for(var n=0;n<e.length;n++)if(e[n].checked&&e[n].form===t)return e[n]}(t,e.form)
return!o||o===e}(e)}(t)||l(t)<0||!p(e,t))},b=function(e){var t=parseInt(e.getAttribute("tabindex"),10)
return!!(isNaN(t)||t>=0)},m=function e(t){var n=[],r=[]
return t.forEach((function(t,o){var i=!!t.scope,a=i?t.scope:t,s=l(a,i),u=i?e(t.candidates):a
0===s?i?n.push.apply(n,u):n.push(a):r.push({documentOrder:o,tabIndex:s,item:t,isScope:i,content:u})})),r.sort(f).reduce((function(e,t){return t.isScope?e.push.apply(e,t.content):e.push(t.content),e}),[]).concat(n)},y=function(e,t){var n
return n=(t=t||{}).getShadowRoot?c([e],t.includeContainer,{filter:v.bind(null,t),flatten:!1,getShadowRoot:t.getShadowRoot,shadowRootFilter:b}):u(e,t.includeContainer,v.bind(null,t)),m(n)},w=function(e,t){if(t=t||{},!e)throw new Error("No node provided")
return!1!==a.call(e,o)&&v(t,e)},g=r.concat("iframe").join(","),_=function(e,t){if(t=t||{},!e)throw new Error("No node provided")
return!1!==a.call(e,g)&&p(t,e)}
function E(e,t){var n=Object.keys(e)
if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e)
t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function T(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{}
t%2?E(Object(n),!0).forEach((function(t){C(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):E(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function C(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var O,N=(O=[],{activateTrap:function(e){if(O.length>0){var t=O[O.length-1]
t!==e&&t.pause()}var n=O.indexOf(e);-1===n||O.splice(n,1),O.push(e)},deactivateTrap:function(e){var t=O.indexOf(e);-1!==t&&O.splice(t,1),O.length>0&&O[O.length-1].unpause()}}),S=function(e){return setTimeout(e,0)},j=function(e,t){var n=-1
return e.every((function(e,r){return!t(e)||(n=r,!1)})),n},A=function(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r]
return"function"==typeof e?e.apply(void 0,n):e},R=function(e){return e.target.shadowRoot&&"function"==typeof e.composedPath?e.composedPath()[0]:e.target},k=function(e,t){var n,r=(null==t?void 0:t.document)||document,o=T({returnFocusOnDeactivate:!0,escapeDeactivates:!0,delayInitialFocus:!0},t),i={containers:[],containerGroups:[],tabbableGroups:[],nodeFocusedBeforeActivation:null,mostRecentlyFocusedNode:null,active:!1,paused:!1,delayInitialFocusTimer:void 0},a=function(e,t,n){return e&&void 0!==e[t]?e[t]:o[n||t]},s=function(e){return i.containerGroups.findIndex((function(t){var n=t.container,r=t.tabbableNodes
return n.contains(e)||r.find((function(t){return t===e}))}))},l=function(e){var t=o[e]
if("function"==typeof t){for(var n=arguments.length,i=new Array(n>1?n-1:0),a=1;a<n;a++)i[a-1]=arguments[a]
t=t.apply(void 0,i)}if(!0===t&&(t=void 0),!t){if(void 0===t||!1===t)return t
throw new Error("`".concat(e,"` was specified but was not a node, or did not return a node"))}var s=t
if("string"==typeof t&&!(s=r.querySelector(t)))throw new Error("`".concat(e,"` as selector refers to no known node"))
return s},f=function(){var e=l("initialFocus")
if(!1===e)return!1
if(void 0===e)if(s(r.activeElement)>=0)e=r.activeElement
else{var t=i.tabbableGroups[0]
e=t&&t.firstTabbableNode||l("fallbackFocus")}if(!e)throw new Error("Your focus-trap needs to have at least one focusable element")
return e},d=function(){if(i.containerGroups=i.containers.map((function(e){var t,n,r=y(e,o.tabbableOptions),i=(t=e,(n=(n=o.tabbableOptions)||{}).getShadowRoot?c([t],n.includeContainer,{filter:p.bind(null,n),flatten:!0,getShadowRoot:n.getShadowRoot}):u(t,n.includeContainer,p.bind(null,n)))
return{container:e,tabbableNodes:r,focusableNodes:i,firstTabbableNode:r.length>0?r[0]:null,lastTabbableNode:r.length>0?r[r.length-1]:null,nextTabbableNode:function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],n=i.findIndex((function(t){return t===e}))
if(!(n<0))return t?i.slice(n+1).find((function(e){return w(e,o.tabbableOptions)})):i.slice(0,n).reverse().find((function(e){return w(e,o.tabbableOptions)}))}}})),i.tabbableGroups=i.containerGroups.filter((function(e){return e.tabbableNodes.length>0})),i.tabbableGroups.length<=0&&!l("fallbackFocus"))throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times")},h=function e(t){!1!==t&&t!==r.activeElement&&(t&&t.focus?(t.focus({preventScroll:!!o.preventScroll}),i.mostRecentlyFocusedNode=t,function(e){return e.tagName&&"input"===e.tagName.toLowerCase()&&"function"==typeof e.select}(t)&&t.select()):e(f()))},v=function(e){var t=l("setReturnFocus",e)
return t||!1!==t&&e},b=function(e){var t=R(e)
s(t)>=0||(A(o.clickOutsideDeactivates,e)?n.deactivate({returnFocus:o.returnFocusOnDeactivate&&!_(t,o.tabbableOptions)}):A(o.allowOutsideClick,e)||e.preventDefault())},m=function(e){var t=R(e),n=s(t)>=0
n||t instanceof Document?n&&(i.mostRecentlyFocusedNode=t):(e.stopImmediatePropagation(),h(i.mostRecentlyFocusedNode||f()))},g=function(e){if(function(e){return"Escape"===e.key||"Esc"===e.key||27===e.keyCode}(e)&&!1!==A(o.escapeDeactivates,e))return e.preventDefault(),void n.deactivate();(function(e){return"Tab"===e.key||9===e.keyCode})(e)&&function(e){var t=R(e)
d()
var n=null
if(i.tabbableGroups.length>0){var r=s(t),a=r>=0?i.containerGroups[r]:void 0
if(r<0)n=e.shiftKey?i.tabbableGroups[i.tabbableGroups.length-1].lastTabbableNode:i.tabbableGroups[0].firstTabbableNode
else if(e.shiftKey){var u=j(i.tabbableGroups,(function(e){var n=e.firstTabbableNode
return t===n}))
if(u<0&&(a.container===t||_(t,o.tabbableOptions)&&!w(t,o.tabbableOptions)&&!a.nextTabbableNode(t,!1))&&(u=r),u>=0){var c=0===u?i.tabbableGroups.length-1:u-1
n=i.tabbableGroups[c].lastTabbableNode}}else{var f=j(i.tabbableGroups,(function(e){var n=e.lastTabbableNode
return t===n}))
if(f<0&&(a.container===t||_(t,o.tabbableOptions)&&!w(t,o.tabbableOptions)&&!a.nextTabbableNode(t))&&(f=r),f>=0){var p=f===i.tabbableGroups.length-1?0:f+1
n=i.tabbableGroups[p].firstTabbableNode}}}else n=l("fallbackFocus")
n&&(e.preventDefault(),h(n))}(e)},E=function(e){var t=R(e)
s(t)>=0||A(o.clickOutsideDeactivates,e)||A(o.allowOutsideClick,e)||(e.preventDefault(),e.stopImmediatePropagation())},C=function(){if(i.active)return N.activateTrap(n),i.delayInitialFocusTimer=o.delayInitialFocus?S((function(){h(f())})):h(f()),r.addEventListener("focusin",m,!0),r.addEventListener("mousedown",b,{capture:!0,passive:!1}),r.addEventListener("touchstart",b,{capture:!0,passive:!1}),r.addEventListener("click",E,{capture:!0,passive:!1}),r.addEventListener("keydown",g,{capture:!0,passive:!1}),n},O=function(){if(i.active)return r.removeEventListener("focusin",m,!0),r.removeEventListener("mousedown",b,!0),r.removeEventListener("touchstart",b,!0),r.removeEventListener("click",E,!0),r.removeEventListener("keydown",g,!0),n}
return(n={get active(){return i.active},get paused(){return i.paused},activate:function(e){if(i.active)return this
var t=a(e,"onActivate"),n=a(e,"onPostActivate"),o=a(e,"checkCanFocusTrap")
o||d(),i.active=!0,i.paused=!1,i.nodeFocusedBeforeActivation=r.activeElement,t&&t()
var s=function(){o&&d(),C(),n&&n()}
return o?(o(i.containers.concat()).then(s,s),this):(s(),this)},deactivate:function(e){if(!i.active)return this
var t=T({onDeactivate:o.onDeactivate,onPostDeactivate:o.onPostDeactivate,checkCanReturnFocus:o.checkCanReturnFocus},e)
clearTimeout(i.delayInitialFocusTimer),i.delayInitialFocusTimer=void 0,O(),i.active=!1,i.paused=!1,N.deactivateTrap(n)
var r=a(t,"onDeactivate"),s=a(t,"onPostDeactivate"),u=a(t,"checkCanReturnFocus"),c=a(t,"returnFocus","returnFocusOnDeactivate")
r&&r()
var l=function(){S((function(){c&&h(v(i.nodeFocusedBeforeActivation)),s&&s()}))}
return c&&u?(u(v(i.nodeFocusedBeforeActivation)).then(l,l),this):(l(),this)},pause:function(){return i.paused||!i.active||(i.paused=!0,O()),this},unpause:function(){return i.paused&&i.active?(i.paused=!1,d(),C(),this):this},updateContainerElements:function(e){var t=[].concat(e).filter(Boolean)
return i.containers=t.map((function(e){return"string"==typeof e?r.querySelector(e):e})),i.active&&d(),this}}).updateContainerElements(e),n}}}])
