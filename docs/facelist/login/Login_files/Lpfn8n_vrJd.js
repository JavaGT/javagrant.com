if (self.CavalryLogger) { CavalryLogger.start_js(["8FZ1F"]); }

__d("CometLink.react",["BaseLink.react","React","TetraTextContext","TetraTextTypography","isCometRouterUrl","stylex"],(function(a,b,c,d,e,f){"use strict";var g=b("React"),h={disabled:{color:"erlsw9ld",":hover":{textDecoration:"p8dawk7l"}},root:{color:"gmql0nx0",":hover":{textDecoration:"gpro0wi8"}}},i={blueLink:{color:"py34i1dx"},highlight:{color:"q66pz984"},negative:{color:"jdix4yx3"},positive:{color:"g5o1ygfq"},primary:{color:"oo9gr5id"},secondary:{color:"m9osqain"},tertiary:{color:"pipptul6"},white:{color:"ljqsnud1"}},j={bold:{fontWeight:"hnhda86s"},medium:{fontWeight:"ekzkrbhg"},normal:{fontWeight:"b1v8xokw"},semibold:{fontWeight:"lrazzd5p"}},k={block:{display:"a8c37x1j"},"inline-block":{display:"q9uorilb"}};function a(a,c){var d=a.color,e=a.disabled;e=e===void 0?!1:e;var f=a.display;f=f===void 0?"inline":f;var n=a.fbclid,o=a.href,p=a.lynxMode,q=a.role,r=a.target,s=a.weight,t=a.xstyle;a=babelHelpers.objectWithoutPropertiesLoose(a,["color","disabled","display","fbclid","href","lynxMode","role","target","weight","xstyle"]);var u=g.useContext(b("TetraTextContext")),v=r==="_blank"||o!=null&&o!=="#"&&!b("isCometRouterUrl")(o);d=(d=d)!=null?d:u!=null?l(u.type,v):"inherit";s=(s=s)!=null?s:u!=null?m(u.type,v):"inherit";u=q==null&&(o==null||o==="#")?"button":q;return g.jsx(b("BaseLink.react"),babelHelpers["extends"]({},a,{disabled:e,display:"inline",fbclid:n,href:o,lynxMode:p,ref:c,role:u,target:v?"_blank":r,xstyle:[h.root,d!=="inherit"&&i[d],s!=="inherit"&&j[s],e&&h.disabled,f!=="inline"&&k[f],t]}))}function l(a,b){switch(a){case"headline3":case"headline4":case"body1":case"body2":case"body3":case"body4":return b?"blueLink":"primary";case"meta1":case"meta2":case"meta3":case"meta4":return b?"blueLink":"inherit";default:return"inherit"}}function m(a,c){if(!c){c=n(a);return b("TetraTextTypography")[c].fontWeight}return"inherit"}function n(a){switch(a){case"headline3":return"headlineEmphasized3";case"headline4":return"headlineEmphasized4";case"body1":return"bodyLink1";case"body2":return"bodyLink2";case"body3":return"bodyLink3";case"body4":return"bodyLink4";default:return a}}c=g.forwardRef(a);e.exports=c}),null);
__d("EventListenerImplForCacheStorage",["requireCond","cr:1351741"],(function(a,b,c,d,e,f){"use strict";e.exports=b("cr:1351741")}),null);
__d("VideoPlayerContextSensitiveConfigUtils",[],(function(a,b,c,d,e,f){"use strict";var g=function(a,b){return b.every(function(b){return a[b.name]===b.value})};a=function(a,b){return b.find(function(b){return g(a,b.contexts)})};f.getFirstMatchingValueAndContextTargets=a}),null);
__d("VideoPlayerContextSensitiveConfigResolver",["requireCond","VideoPlayerContextSensitiveConfigUtils","VideoPlayerContextSensitiveConfigPayload","cr:1724253"],(function(a,b,c,d,e,f){"use strict";a=function(){function a(a){this.$1={},this.$2={},a==null?(this.$3=b("VideoPlayerContextSensitiveConfigPayload").static_values,this.$4=b("VideoPlayerContextSensitiveConfigPayload").context_sensitive_values):(this.$3=a.staticValues,this.$4=a.contextSensitiveValues)}var c=a.prototype;c.setContexts=function(a){this.$1=a,this.$2=this.$5(a)};c.getValue=function(a){if(this.$2[a]!=null)return this.$2[a];return this.$3[a]!=null?this.$3[a]:null};c.$5=function(a){var c=this;return Object.keys(this.$4).reduce(function(d,e){var f=c.$4[e];if(f!=null){f=b("VideoPlayerContextSensitiveConfigUtils").getFirstMatchingValueAndContextTargets(a,f);f!=null&&(d[e]=f.value)}return d},{})};a.getPayload=function(){return b("VideoPlayerContextSensitiveConfigPayload")};a.getSources=function(){return b("cr:1724253")};return a}();e.exports=a}),null);
__d("VideoPlayerShakaGlobalConfig",["VideoPlayerContextSensitiveConfigResolver"],(function(a,b,c,d,e,f){var g=new(b("VideoPlayerContextSensitiveConfigResolver"))();a=function(a,b){a=g.getValue(a);return a!=null&&typeof a==="boolean"?a:b};f.getBool=a;c=function(a,b){a=g.getValue(a);return a!=null&&typeof a==="number"?a:b};f.getNumber=c;d=function(a,b){a=g.getValue(a);return a!=null&&typeof a==="string"?a:b};f.getString=d}),null);
__d("CacheStorage",["ErrorGuard","EventListenerImplForCacheStorage","ExecutionEnvironment","FBJSON","WebStorage","emptyFunction","killswitch"],(function(a,b,c,d,e,f){var g,h,i="_@_",j="3b",k="CacheStorageVersion",l={length:0,getItem:a=b("emptyFunction"),setItem:a,clear:a,removeItem:a,key:a};c=function(){"use strict";function a(a){this._store=a}var b=a.prototype;b.getStore=function(){return this._store};b.keys=function(){var a=[];for(var b=0;b<this._store.length;b++){var c=this._store.key(b);c!=null&&a.push(c)}return a};b.get=function(a){return this._store.getItem(a)};b.set=function(a,b){this._store.setItem(a,b)};b.remove=function(a){this._store.removeItem(a)};b.clear=function(){this._store.clear()};b.clearWithPrefix=function(a){a=a||"";var b=this.keys();for(var c=0;c<b.length;c++){var d=b[c];d!=null&&d.startsWith(a)&&this.remove(d)}};return a}();d=function(a){"use strict";babelHelpers.inheritsLoose(c,a);function c(){var c;return a.call(this,(c=(g||(g=b("WebStorage"))).getLocalStorage())!=null?c:l)||this}c.available=function(){return!!(g||(g=b("WebStorage"))).getLocalStorage()};return c}(c);f=function(a){"use strict";babelHelpers.inheritsLoose(c,a);function c(){var c;return a.call(this,(c=(g||(g=b("WebStorage"))).getSessionStorage())!=null?c:l)||this}c.available=function(){return!!(g||(g=b("WebStorage"))).getSessionStorage()};return c}(c);var m=function(){"use strict";function a(){this._store={}}var b=a.prototype;b.getStore=function(){return this._store};b.keys=function(){return Object.keys(this._store)};b.get=function(a){return this._store[a]===void 0?null:this._store[a]};b.set=function(a,b){this._store[a]=b};b.remove=function(a){a in this._store&&delete this._store[a]};b.clear=function(){this._store={}};b.clearWithPrefix=function(a){a=a||"";var b=this.keys();for(var c=0;c<b.length;c++){var d=b[c];d.startsWith(a)&&this.remove(d)}};a.available=function(){return!0};return a}(),n={memory:m,localstorage:d,sessionstorage:f};a=function(){"use strict";function a(a,c){this._changeCallbacks=[];this._key_prefix="_cs_";this._exceptionMessage=null;c&&(this._key_prefix=c);if(a=="AUTO"||!a)for(var d in n){c=n[d];if(c.available()){a=d;break}}a&&(!n[a]||!n[a].available()?(b("ExecutionEnvironment").canUseDOM,this._backend=new m()):this._backend=new n[a]());c=this.useBrowserStorage();c&&b("EventListenerImplForCacheStorage").listen(window,"storage",this._onBrowserValueChanged.bind(this));a=c?this._backend.getStore().getItem(k):this._backend.getStore()[k];a!==j&&(b("killswitch")("CACHE_STORAGE_MODULE_CLEAR_OWN_KEYS")?this.clear():this.clearOwnKeys())}var c=a.prototype;c.useBrowserStorage=function(){return this._backend.getStore()===(g||(g=b("WebStorage"))).getLocalStorage()||this._backend.getStore()===(g||(g=b("WebStorage"))).getSessionStorage()};c.addValueChangeCallback=function(a){var b=this;this._changeCallbacks.push(a);return{remove:function(){b._changeCallbacks.slice(b._changeCallbacks.indexOf(a),1)}}};c._onBrowserValueChanged=function(a){this._changeCallbacks&&String(a.key).startsWith(this._key_prefix)&&this._changeCallbacks.forEach(function(b){b(a.key,a.oldValue,a.newValue)})};c.keys=function(){var a=this,c=[];(h||(h=b("ErrorGuard"))).guard(function(){if(a._backend){var b=a._backend.keys(),d=a._key_prefix.length;for(var e=0;e<b.length;e++)b[e].substr(0,d)==a._key_prefix&&c.push(b[e].substr(d))}},{name:"CacheStorage"})();return c};c.set=function(c,d,e){if(this._backend){if(this.useBrowserStorage()&&a._persistentWritesDisabled){this._exceptionMessage="writes disabled";return!1}var f;typeof d==="string"?f=i+d:!e?(f={__t:Date.now(),__v:d},f=b("FBJSON").stringify(f)):f=b("FBJSON").stringify(d);e=this._backend;d=this._key_prefix+c;c=!0;var g=null;while(c)try{g=null,e.set(d,f),c=!1}catch(a){g=a;var h=e.keys().length;this._evictCacheEntries();c=e.keys().length<h}if(g!==null){this._exceptionMessage=g.message;return!1}else{this._exceptionMessage=null;return!0}}this._exceptionMessage="no back end";return!1};c.getLastSetExceptionMessage=function(){return this._exceptionMessage};c.getStorageKeyCount=function(){var a=this._backend;return a?a.keys().length:0};c._evictCacheEntries=function(){var c=[],d=this._backend;d.keys().forEach(function(f){if(f===k)return;var g=d.get(f);if(g===void 0){d.remove(f);return}if(a._hasMagicPrefix(g))return;try{g=b("FBJSON").parse(g,e.id)}catch(a){d.remove(f);return}g&&g.__t!==void 0&&g.__v!==void 0&&c.push([f,g.__t])});c.sort(function(a,b){return a[1]-b[1]});for(var f=0;f<Math.ceil(c.length/2);f++)d.remove(c[f][0])};c.get=function(c,d){var f;if(this._backend){(h||(h=b("ErrorGuard"))).applyWithGuard(function(){f=this._backend.get(this._key_prefix+c)},this,[],{onError:function(){f=null},name:"CacheStorage:get"});if(f!=null)if(a._hasMagicPrefix(f))f=f.substr(i.length);else try{f=b("FBJSON").parse(f,e.id),f&&f.__t!==void 0&&f.__v!==void 0&&(f=f.__v)}catch(a){f=void 0}else f=void 0}f===void 0&&d!==void 0&&(f=d,this.set(c,f));return f};c.remove=function(a){this._backend&&(h||(h=b("ErrorGuard"))).applyWithGuard(this._backend.remove,this._backend,[this._key_prefix+a],{name:"CacheStorage:remove"})};c._setVersion=function(){this.useBrowserStorage()?this._backend.getStore().setItem(k,j):this._backend.getStore()[k]=j};c.clear=function(){this._backend&&((h||(h=b("ErrorGuard"))).applyWithGuard(this._backend.clear,this._backend,[],{name:"CacheStorage:clear"}),this._setVersion())};c.clearOwnKeys=function(){this._backend&&((h||(h=b("ErrorGuard"))).applyWithGuard(this._backend.clearWithPrefix,this._backend,[this._key_prefix],{name:"CacheStorage:clearOwnKeys"}),this._setVersion())};a.getAllStorageTypes=function(){return Object.keys(n)};a._hasMagicPrefix=function(a){return a.substr(0,i.length)===i};a.disablePersistentWrites=function(){a._persistentWritesDisabled=!0};return a}();a._persistentWritesDisabled=!1;e.exports=a}),null);