if (self.CavalryLogger) { CavalryLogger.start_js(["nkD4T"]); }

__d("XWebGraphQLQueryController",["XController"],(function(a,b,c,d,e,f){e.exports=b("XController").create("/webgraphql/query/",{query_id:{type:"FBID"},variables:{type:"String"},doc_id:{type:"FBID"}})}),null);
__d("WebGraphQLQueryBase",["invariant","WebGraphQLLegacyHelper","XWebGraphQLQueryController"],(function(a,b,c,d,e,f,g){"use strict";a=function(){function a(a){this.$1=a}var c=a.prototype;c.__getVariables=function(){return this.$1};c.__getDocID=function(){return this.constructor.__getDocID()};a.__getController=function(){return b("XWebGraphQLQueryController")};a.__getDocID=function(){g(0,1804)};a.getURI=function(a){return b("WebGraphQLLegacyHelper").getURI({controller:this.__getController(),docID:this.__getDocID(),variables:a})};a.getLegacyURI=function(a){return b("WebGraphQLLegacyHelper").getURI({controller:this.__getController(),queryID:this.getQueryID(),variables:a})};a.getQueryID=function(){g(0,5095)};return a}();e.exports=a}),null);
__d("BaseGraphQLSubscription",["regeneratorRuntime","BanzaiODS","CurrentLocale","CurrentUser","Random","RelayRTIGraphQLSubscriber","RelayRTIUtils","SkywalkerManager","gkx","nullthrows","relay-runtime","uuid"],(function(a,b,c,d,e,f){var g=b("RelayRTIGraphQLSubscriber").subscribeWithMobileStyleTopicTransform,h=b("RelayRTIUtils").computeRoutingHint,i=b("RelayRTIUtils").extractUseCaseFromTopic,j=b("RelayRTIUtils").logSubscriptionEvent,k=b("relay-runtime").getRequest,l=100,m=1e3,n=100,o="gqls_default_logging_base",p="gqls_workplace_logging_base",q=110,r={bumpTotalSubscribeCounter:function(a){b("BanzaiODS").bumpEntityKey(q,"basegraphqlsubscription_migration",a+".subscribe.total")},bumpLegacySubscribeCounter:function(a){b("BanzaiODS").bumpEntityKey(q,"basegraphqlsubscription_migration",a+".subscribe.legacy"),r.bumpTotalSubscribeCounter(a)},bumpSsttSubscribeCounter:function(a){b("BanzaiODS").bumpEntityKey(q,"basegraphqlsubscription_migration",a+".subscribe.sstt"),r.bumpTotalSubscribeCounter(a)},bumpTotalReceiveCounter:function(a){b("BanzaiODS").bumpEntityKey(q,"basegraphqlsubscription_migration",a+".receive.total")},bumpLegacyReceiveCounter:function(a){b("BanzaiODS").bumpEntityKey(q,"basegraphqlsubscription_migration",a+".receive.legacy"),r.bumpTotalReceiveCounter(a)},bumpSsttReceiveCounter:function(a){b("BanzaiODS").bumpEntityKey(q,"basegraphqlsubscription_migration",a+".receive.sstt"),r.bumpTotalReceiveCounter(a)}};function s(a){if(b("gkx")("676906")&&b("Random").coinflip(l))return o;if(b("gkx")("1383502")&&b("Random").coinflip(n))return p;if(b("gkx")("1388683")||b("gkx")("1382775")&&b("Random").coinflip(m))return o}a=function(){"use strict";function a(){}var c=a.prototype;c.getTopic=function(a){throw new Error("getTopic() unimplemented by subclass of BaseGraphQLSubscription")};c.getQuery=function(){throw new Error("getQuery() or getQueryID() unimplemented by subclass of BaseGraphQLSubscription")};c.getQueryParameters=function(a){throw new Error("getQueryParameters() unimplemented by subclass of BaseGraphQLSubscription")};c.getSubscriptionName=function(){var a=k(this.getQuery());return String(b("nullthrows")(a.params.metadata.subscriptionName))};a.subscribe=function(a,b,c){return new this().subscribe(a,b,c)};c.subscribe=function(a,c,d){var e,f=this.getQueryParameters(a),h=k(this.getQuery()).params,i=String(b("nullthrows")((e=h.metadata)==null?void 0:e.subscriptionName));if(t(i)){e="gqls/"+i+"/";var l=b("SkywalkerManager").getSubscriptionType(e);f=babelHelpers["extends"]({},f,{input:babelHelpers["extends"]({},f.input,{client_subscription_id:b("uuid")()})});r.bumpSsttSubscribeCounter(i);e=g(h,f,d==null?void 0:d.forceLogContext,d==null?void 0:d.viewerID)["do"]({start:function(){j("client_subscribe",i,f,d==null?void 0:d.forceLogContext,l,h.id)},next:function(){j("receivepayload",i,f,d==null?void 0:d.forceLogContext,l,h.id)},unsubscribe:function(){j("client_unsubscribe",i,f,d==null?void 0:d.forceLogContext,l,h.id)}});return e.subscribe({next:function(a){r.bumpSsttReceiveCounter(i),typeof a=="object"&&a.data&&c(a.data)}})}e=this.getTopic(a);var m=v(e,b("nullthrows")(k(this.getQuery()).params.id),f,c,d);return{unsubscribe:function(){m.unsubscribe()}}};return a}();a.getTransformContextForBaseGraphQLSubscription_INTERNAL=u;a.subscribeWithSkywalker_INTERNAL=v;function t(a){return a==="web_notification_receive_subscribe"?b("gkx")("1767570"):!1}function u(a,c,d){var e="0";return{viewerID:(d=d)!=null?d:b("CurrentUser").getID(),appID:e,locale:b("CurrentLocale").get(),queryID:a,serializedQueryParameters:JSON.stringify(c),useOSSResponseFormat:!1}}function v(a,c,d,e,f){f===void 0&&(f=null);var g=b("nullthrows")(i(a)),k=b("SkywalkerManager").getSubscriptionType(a);r.bumpLegacySubscribeCounter(g);var l=b("uuid")(),m=babelHelpers["extends"]({},d,{input:babelHelpers["extends"]({},d.input,{client_subscription_id:l})}),n=(d=(d=f)==null?void 0:d.forceLogContext)!=null?d:s(a);n!=null&&(m=babelHelpers["extends"]({},m,{"%options":{client_logged_context:n}}));m=babelHelpers["extends"]({},m,{"%options":babelHelpers["extends"]({},m["%options"],{client_has_ods_usecase_counters:!0})});d={};d.transformContext=JSON.stringify(u(c,m,(f=f)==null?void 0:f.viewerID));f=null;if(l!=null){var o;f=babelHelpers["extends"]({},(o=f)!=null?o:{},{requestId:l})}o=h(g,m.input);if(o!=null){var p;f=babelHelpers["extends"]({},(p=f)!=null?p:{},{routing_hint:o})}j("client_subscribe",g,m,n,k,c);p=babelHelpers["extends"]({context:d,onUnsubscribeEager:function(){j("client_unsubscribe",g,m,n,k,c)},gqlsLifecycleHandler:function(a){return b("regeneratorRuntime").async(function(b){while(1)switch(b.prev=b.next){case 0:e({__type:"lifecycle_event",state:a});case 1:case"end":return b.stop()}},null,this)}},f?{headers:f}:{});o=null;n!=null&&(o={requestId:l,forceLogContext:n});o!=null&&(p=babelHelpers["extends"]({},p,{instrumentationData:o}));return b("SkywalkerManager").subscribe(a,function(a){j("receivepayload",g,m,n,k,c),r.bumpLegacyReceiveCounter(g),e(babelHelpers["extends"]({__type:"data"},JSON.parse(a.payload)))},p)}e.exports=a}),null);
__d("XGraphQLBatchAPIController",["XController"],(function(a,b,c,d,e,f){e.exports=b("XController").create("/api/graphqlbatch/",{queries:{type:"String"},batch_name:{type:"String"},scheduler:{type:"Enum",enumType:1},shared_params:{type:"String"},fb_api_req_friendly_name:{type:"String"},uft_request_id:{type:"String"}})}),null);
__d("WebGraphQL",["errorCode","ActorURI","AsyncRequest","Deferred","FBLogger","WebGraphQLConfig","XGraphQLBatchAPIController","getAsyncParams"],(function(a,b,c,d,e,f,g){"use strict";var h="for (;;);",i=h.length;function j(a){var c=a.getURIBuilder().getURI(),d={exec:function(a,b){return d.execAll([a],b)[0]},execAll:function(a,d){var e={},f={};a=a.map(function(a,c){c="o"+c;e[c]={doc_id:a.__getDocID(),query_params:a.__getVariables()};a=new(b("Deferred"))();f[c]=a;return a.getPromise()});var g=babelHelpers["extends"]({},b("getAsyncParams")("POST"));d&&d.actorID!=null&&(g[b("ActorURI").PARAMETER_ACTOR]=d.actorID);var j=d&&d.batchName?{batch_name:d.batchName}:{};j=new(b("AsyncRequest"))().setURI(c).setOption("suppressEvaluation",!0).setMethod("POST").setRequestHeader("Content-Type","application/x-www-form-urlencoded").setData(babelHelpers["extends"]({},j,g,{queries:JSON.stringify(e)})).setHandler(function(a){a=a.getPayload();a=a.response;try{if(a.startsWith(h)){var c=a.substring(i);c=JSON.parse(c);if(c.error==1357001){Object.keys(f).forEach(function(a){f[a].isSettled()||f[a].reject({data:{},errors:[{message:"Not logged in.",severity:"CRITICAL",should_end_session:!0}]})});return}}c=a.split("\r\n");c.pop();c=c.map(function(a){return JSON.parse(a)});c.forEach(function(a){return Object.keys(a).forEach(function(b){var c=f[b];if(c){b=a[b];b.errors?c.reject(b):b.data?c.resolve(b.data):c.reject({data:{},errors:[{message:"Unexpected response received from server.",severity:"CRITICAL",response:b}]})}})})}catch(c){b("FBLogger")("webgraphql").catching(c).mustfix("Bad response: ","%s%s",a.substr(0,250),a.length>250?"[truncated]":"")}Object.keys(f).forEach(function(a){f[a].isSettled()||f[a].reject({data:{},errors:[{message:"No response received from server.",severity:"CRITICAL"}]})})}).setTimeoutHandler(b("WebGraphQLConfig").timeout,function(){Object.keys(f).forEach(function(a){f[a].isSettled()||f[a].reject({data:{},errors:[{message:"Request timed out.",severity:"CRITICAL"}]})})}).setErrorHandler(function(a){var b=a.getErrorDescription();Object.keys(f).forEach(function(c){f[c].isSettled()||f[c].reject({data:{},errors:[{message:b,severity:"CRITICAL",error:a.getError()}]})})});d&&d.msgrRegion&&j.setRequestHeader("X-MSGR-Region",d.msgrRegion);j.setAllowCrossPageTransition(!0);j.send();return a},__forController:j};return d}a=j(b("XGraphQLBatchAPIController"));c=a;e.exports=c}),null);
__d("PopoverMenu",["ArbiterMixin","ARIA","BehaviorsMixin","Event","Focus","Keys","KeyStatus","SubscriptionsHandler","VirtualCursorStatus","mixin","setTimeout"],(function(a,b,c,d,e,f){a=function(a){babelHelpers.inheritsLoose(c,a);function c(c,d,e,f){var g;g=a.call(this)||this;g._popover=c;g._triggerElem=d;g._getInitialMenu=typeof e!=="function"?function(){return e}:e;g._subscriptions=new(b("SubscriptionsHandler"))();g._subscriptions.addSubscriptions(c.subscribe("init",g._onLayerInit.bind(babelHelpers.assertThisInitialized(g))),c.subscribe("show",g._onPopoverShow.bind(babelHelpers.assertThisInitialized(g))),c.subscribe("hide",g._onPopoverHide.bind(babelHelpers.assertThisInitialized(g))),b("Event").listen(g._triggerElem,"keydown",g._handleKeyEventOnTrigger.bind(babelHelpers.assertThisInitialized(g))),b("VirtualCursorStatus").add(g._triggerElem,g._checkInitialFocus.bind(babelHelpers.assertThisInitialized(g))));f&&g.enableBehaviors(f);return g}var d=c.prototype;d.getContentRoot=function(){return this._popover.getContentRoot()};d.setMenu=function(a){this._menu&&this._menu!==a&&this._menu.destroy();this._menu=a;var c=a.getRoot();this._popover.setLayerContent(c);a.subscribe("done",this._onMenuDone.bind(this));this._popoverShown&&this._menu.onShow();b("ARIA").controls(this._triggerElem,c);this.inform("setMenu",null,"persistent")};d.setInitialFocus=function(a,b){b&&a.focusAnItem()};d.getPopover=function(){return this._popover};d.getTriggerElem=function(){return this._triggerElem};d.getInitialMenu=function(){return this._getInitialMenu()};d.getMenu=function(){return this._menu};d._onLayerInit=function(){this._menu||this.setMenu(this._getInitialMenu()),this._popover.getLayer().subscribe("key",this._handleKeyEvent.bind(this))};d._onPopoverShow=function(){this._menu&&this._menu.onShow(),this._checkInitialFocus(),this._popoverShown=!0};d._checkInitialFocus=function(){var a=b("KeyStatus").isKeyDown()||b("VirtualCursorStatus").isVirtualCursorTriggered();this._menu&&this.setInitialFocus(this._menu,a)};d._onPopoverHide=function(){this._menu&&this._menu.onHide(),this._popoverShown=!1};d._handleKeyEvent=function(a,c){if(c.target===this._triggerElem)return;a=b("Event").getKeyCode(c);if(a===b("Keys").TAB){this._popover.hideLayer();b("Focus").set(this._triggerElem);return}if(c.getModifiers().any)return;switch(a){case b("Keys").RETURN:this.getMenu().getFocusedItem()||this.inform("returnWithoutFocusedItem");return;default:if(a===b("Keys").SPACE&&c.target.type==="file")return;this._menu.handleKeydown(a,c)===!1&&(this._menu.blur(),this._menu.handleKeydown(a,c));break}c.prevent()};d._handleKeyEventOnTrigger=function(a){if(this._isTypeaheadActivationDisabled)return;var c=b("Event").getKeyCode(a),d=String.fromCharCode(c).toLowerCase();/^\w$/.test(d)&&(this._popover.showLayer(),this._menu.blur(),this._menu.handleKeydown(c,a)===!1&&(this._popover.hideLayer(),b("Focus").set(this._triggerElem)))};d.disableTypeaheadActivation=function(){this._isTypeaheadActivationDisabled=!0};d.enableTypeaheadActivation=function(){this._isTypeaheadActivationDisabled=!1};d._onMenuDone=function(a){var c=this;b("setTimeout")(function(){c._popover.hideLayer(),b("Focus").set(c._triggerElem)},0)};d.enable=function(){this._popover.enable()};d.disable=function(){this._popover.disable()};d.destroy=function(){this._subscriptions.release(),this._popover.destroy(),this._getInitialMenu().destroy(),this._menu&&this._menu.destroy()};return c}(b("mixin")(b("ArbiterMixin"),b("BehaviorsMixin")));e.exports=a;Object.assign(a.prototype,{_popoverShown:!1})}),null);
__d("XAsyncRequest",["AsyncRequest"],(function(a,b,c,d,e,f){a=function(){function a(a){this.$1=new(b("AsyncRequest"))(a)}var c=a.prototype;c.setURI=function(a){this.$1.setURI(a);return this};c.setOption=function(a,b){this.$1.setOption(a,b);return this};c.setMethod=function(a){this.$1.setMethod(a);return this};c.setData=function(a){this.$1.setData(a);return this};c.setHandler=function(a){this.$1.setHandler(a);return this};c.setPayloadHandler=function(a){this.setHandler(function(b){return a(b.payload)});return this};c.setErrorHandler=function(a){this.$1.setErrorHandler(a);return this};c.send=function(){this.$1.send();return this};c.abort=function(){this.$1.abort()};c.setReadOnly=function(a){this.$1.setReadOnly(a);return this};c.setAllowCrossOrigin=function(a){this.$1.setAllowCrossOrigin(a);return this};c.setAllowCredentials=function(a){this.$1.setAllowCredentials(a);return this};c.setAllowCrossPageTransition=function(a){this.$1.setAllowCrossPageTransition(a);return this};return a}();e.exports=a}),null);
__d("replaceNativeTimer",["scheduler","cancelAnimationFrame","clearInterval","clearTimeout","requestAnimationFrame","setInterval","setTimeout"],(function(a,b,c,d,e,f){!b("scheduler");a.__fbNativeSetTimeout=a.setTimeout;a.__fbNativeClearTimeout=a.clearTimeout;a.__fbNativeSetInterval=a.setInterval;a.__fbNativeClearInterval=a.clearInterval;a.__fbNativeRequestAnimationFrame=a.requestAnimationFrame;a.__fbNativeCancelAnimationFrame=a.cancelAnimationFrame;b("setTimeout").nativeBackup=a.setTimeout;b("clearTimeout").nativeBackup=a.clearTimeout;b("setInterval").nativeBackup=a.setInterval;b("clearInterval").nativeBackup=a.clearInterval;b("requestAnimationFrame").nativeBackup=a.requestAnimationFrame;b("cancelAnimationFrame").nativeBackup=a.cancelAnimationFrame;a.setTimeout=b("setTimeout");a.clearTimeout=b("clearTimeout");a.setInterval=b("setInterval");a.clearInterval=b("clearInterval");a.requestAnimationFrame=b("requestAnimationFrame");a.cancelAnimationFrame=b("cancelAnimationFrame");function c(){}e.exports=c}),null);