(this.webpackJsonpdroom=this.webpackJsonpdroom||[]).push([[0],{66:function(e,t,n){},67:function(e,t,n){},68:function(e,t,n){},69:function(e,t,n){},76:function(e,t,n){},86:function(e,t,n){"use strict";n.r(t);var c=n(8),a=n(1),r=n.n(a),i=n(54),o=n.n(i),s=(n(66),n(67),n(7)),l=n(3),u=(n(68),n(69),n(31)),d=["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen"];function p(e){var t=Object(a.useState)(!1,(function(){return!1})),n=Object(l.a)(t,2),r=n[0],i=n[1];return Object(c.jsx)("div",{className:"button-wrapper",style:{width:22.5*(e.numOfInstruments-e.position)},children:Object(c.jsx)("input",{className:"".concat(e.name," ").concat(d[e.stepNum]," ").concat(r?"active":"inactive"," btn"),type:"button",onClick:function(){var t=!r;i(t);var n={name:e.name,active:t,stepNum:e.stepNum};e.handleNoteClick(n)},onKeyDown:function(e){return e.preventDefault()}})})}function m(e){return Object(c.jsx)("div",{children:Object(c.jsx)("div",{className:"step ".concat(e.stepNum),style:{transform:"rotate(".concat(22.5*e.stepNum,"deg)")},children:function(){for(var t=[],n=["kick","snare","ohh","chh","perc"],a=0;a<n.length;a++)t.push(Object(c.jsx)(p,{name:n[a],stepNum:e.stepNum,position:a,numOfInstruments:n.length,handleNoteClick:e.handleNoteClick},Object(u.v4)()));return t}()})})}var f=n(93),h=function(e){return Object(c.jsx)(c.Fragment,{children:Object(c.jsxs)(f.a,{className:"slider",min:90,max:170,defaultValue:120,orientation:"vertical",onChange:function(t){return e.handleChange(t)},children:[Object(c.jsx)(f.d,{bg:"red.100",children:Object(c.jsx)(f.b,{bg:"tomato"})}),Object(c.jsx)(f.c,{boxSize:6})]})})},b=(n(76),n(15)),j=n.p+"static/media/kick.2ba1fda8.mp3",v=n.p+"static/media/snare.7128e61a.mp3",O=n.p+"static/media/hho.b5c105d9.mp3",g=n.p+"static/media/hhc.8b9af951.mp3",N={A1:j,B1:v,C1:n.p+"static/media/clap.6d430d98.mp3",D1:g,E1:O},x=["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen"],y=Object.entries({A1:"kick",B1:"snare",C1:"perc",D1:"chh",E1:"ohh"}),k=new b.a(N).toDestination();function E(e){var t=e.playPause,n=e.passUpLoop,r=Object(a.useState)({kick:Array(16).fill(!1),snare:Array(16).fill(!1),chh:Array(16).fill(!1),ohh:Array(16).fill(!1),perc:Array(16).fill(!1)}),i=Object(l.a)(r,2),o=i[0],d=i[1];function p(e){d((function(t){return t[e.name][e.stepNum]=!t[e.name][e.stepNum],t})),console.log(o[e.name][e.stepNum])}function f(e,t){var n,c=Object(s.a)(y);try{for(c.s();!(n=c.n()).done;){var a=Object(l.a)(n.value,2),r=a[0],i=a[1];o[i][t]&&k.triggerAttackRelease(r,"16n",e)}}catch(f){c.e(f)}finally{c.f()}for(var u=0;u<y.length;u++){var d=0===t?15:t-1,p=document.querySelector(".".concat(y[u][1],".").concat(x[t],".active")),m=document.querySelector(".".concat(y[u][1],".").concat(x[d],".active"));p&&p.classList.add("triggered"),m&&m.classList.remove("triggered")}}return Object(a.useEffect)((function(){n(f)}),[]),console.log("RERENDERED"),Object(c.jsxs)("div",{className:"drums-container",children:[Object(c.jsxs)("div",{className:"drumpad-container",children:[Object(c.jsx)("div",{className:"drumpad-wrapper",children:function(){console.log("RENDERING STEPS");for(var e=[],t=0;t<16;t++)e.push(Object(c.jsx)(m,{handleNoteClick:p,stepNum:t,children:"  "},Object(u.v4)()));return e}()}),Object(c.jsx)("input",{type:"button",id:"playPause",onClick:function(){return t()},value:"droom"}),Object(c.jsx)("div",{className:"drums-controls",children:Object(c.jsx)("div",{className:"slider-wrapper",children:Object(c.jsx)(h,{handleChange:function(e){b.b.bpm.value=e},className:"slider"})})})]}),void console.log("RERENDERED")]})}b.b.bpm.value=120,b.b.swing=.08;var C,w=0;var D=function(){function e(e){C(e,w),w=(w+1)%16,console.log("count",w)}return Object(c.jsx)("div",{children:Object(c.jsx)(E,{playPause:function(){"stopped"===b.b.state?(b.b.toggle(),b.b.scheduleRepeat(e,"16n"),b.c()):(b.b.stop(),b.b.cancel(),w=0)},passUpLoop:function(e){C=e}})})},R=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,95)).then((function(t){var n=t.getCLS,c=t.getFID,a=t.getFCP,r=t.getLCP,i=t.getTTFB;n(e),c(e),a(e),r(e),i(e)}))},S=n(92);o.a.render(Object(c.jsx)(r.a.StrictMode,{children:Object(c.jsx)(S.a,{children:Object(c.jsx)(D,{})})}),document.getElementById("root")),R()}},[[86,1,2]]]);
//# sourceMappingURL=main.05d9b65b.chunk.js.map