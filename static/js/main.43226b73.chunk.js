(this.webpackJsonpcandyland=this.webpackJsonpcandyland||[]).push([[0],{16:function(e,t,l){e.exports=l.p+"static/media/player1.5bbf3e1a.png"},17:function(e,t,l){e.exports=l.p+"static/media/player2.5f5aa454.png"},18:function(e,t,l){e.exports=l.p+"static/media/player3.d9765818.png"},19:function(e,t,l){e.exports=l.p+"static/media/player4.8d207f25.png"},20:function(e,t,l){e.exports=l.p+"static/media/board.e5b987bc.jpg"},23:function(e,t,l){e.exports=l(35)},28:function(e,t,l){},29:function(e,t,l){},35:function(e,t,l){"use strict";l.r(t);var a=l(0),p=l.n(a),o=l(15),n=l.n(o),r=(l(28),l(4)),y=l(9),c=l(2),u=(l(29),l(16)),s=l.n(u),i=l(17),f=l.n(i),m=l(18),d=l.n(m),g=l(19),b=l.n(g),E=l(20),h=l.n(E),v=function(e){if(!e.card)return p.a.createElement("div",null);var t=1,l=e.card.type;return l.startsWith("double")&&(l=l.split("double-")[1],t++),e.card?function(e){for(var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,l=[],a="block-".concat(e),o=0;o<t;o++)l.push(p.a.createElement("span",{key:o,className:a}));return p.a.createElement("div",{className:"card"},l)}(l,t):p.a.createElement(p.a.Fragment,null)},C=function(e){if(e.gameOver)return p.a.createElement(c.a,{to:"/gameover"});function t(t){return e.currentPlayer===t?p.a.createElement("span",null,"\ud83d\udc49"):p.a.createElement("span",null)}return p.a.createElement("div",null,p.a.createElement("div",{className:"board-container"},p.a.createElement("img",{src:h.a,alt:"",width:"800"}),p.a.createElement("div",{className:"player-container"},p.a.createElement("button",{className:"drawCard",disabled:!!e.winner,onClick:e.drawCard},"\ud83c\udfb4 Draw Card"),p.a.createElement("div",{className:"player-card"},p.a.createElement("h2",{className:"player1color"},t(0),e.players[0].name," (Square ",e.players[0].position+1,")"),p.a.createElement(v,{card:e.players[0].selectedCard})),p.a.createElement("div",{className:"player-card"},p.a.createElement("h2",{className:"player2color"},t(1),e.players[1].name," (Square ",e.players[1].position+1,")"),p.a.createElement(v,{card:e.players[1].selectedCard})),p.a.createElement("div",{className:"player-card",style:{display:e.playerCount>2?"inherit":"none"}},p.a.createElement("h2",{className:"player3color"},t(2),e.players[2].name," (Square ",e.players[2].position+1,")"),p.a.createElement(v,{card:e.players[2].selectedCard})),p.a.createElement("div",{className:"player-card",style:{display:e.playerCount>3?"inherit":"none"}},p.a.createElement("h2",{className:"player4color"},t(3),e.players[3].name," (Square ",e.players[3].position+1,")"),p.a.createElement(v,{card:e.players[3].selectedCard}))),p.a.createElement("img",{src:s.a,id:"player1",alt:""}),p.a.createElement("img",{src:f.a,id:"player2",alt:""}),p.a.createElement("img",{src:d.a,id:"player3",style:{display:e.playerCount>2?"inherit":"none"},alt:""}),p.a.createElement("img",{src:b.a,id:"player4",style:{display:e.playerCount>3?"inherit":"none"},alt:""})))},w=function(e){var t=Object(a.useState)(e.playersReady),l=Object(r.a)(t,2),o=l[0],n=l[1],y=Object(a.useState)(e.playerCount),u=Object(r.a)(y,2),s=u[0],i=u[1],f=Object(a.useState)(e.players),m=Object(r.a)(f,2),d=m[0],g=m[1];if(o)return e.newGameReset(),p.a.createElement(c.a,{to:"/game"});function b(t){var l=e.players.concat([]);l[t.currentTarget.id].name=t.currentTarget.value,g(l)}return p.a.createElement("div",null,p.a.createElement("div",{className:"form-field"},p.a.createElement("label",null,"Number of Players"),p.a.createElement("select",{value:e.playerCount||s,onChange:function(t){var l=parseInt(t.target.value,10);e.setPlayerCount(l),i(l)}},p.a.createElement("option",null,"2"),p.a.createElement("option",null,"3"),p.a.createElement("option",null,"4"))),p.a.createElement("div",{className:"form-field"},p.a.createElement("label",null,"Player 1 Name:"),p.a.createElement("input",{type:"text",name:"player1name",id:"0",value:d[0].name,onChange:b})),p.a.createElement("div",{className:"form-field"},p.a.createElement("label",null,"Player 2 Name:"),p.a.createElement("input",{type:"text",name:"player2name",id:"1",value:d[1].name,onChange:b})),p.a.createElement("div",{className:"form-field"},p.a.createElement("label",null,"Player 3 Name:"),p.a.createElement("input",{type:"text",disabled:s<3,id:"2",name:"player3name",value:d[2].name,onChange:b})),p.a.createElement("div",{className:"form-field"},p.a.createElement("label",null,"Player 4 Name:"),p.a.createElement("input",{type:"text",disabled:s<4,id:"3",name:"player4name",value:d[3].name,onChange:b})),p.a.createElement("br",null),p.a.createElement("button",{type:"button",className:"start",onClick:function(){!function(){var e=Object(r.a)(d,4),t=e[0],l=e[1],a=e[2],p=e[3];t.position=0,l.position=0,a.position=0,p.position=0,g([t,l,a,p])}(),n(!0)}},"Start"))},j=function(e){return e.setGameOver(!1),e.winner?p.a.createElement("div",null,p.a.createElement("h3",null,"Game Over!"),p.a.createElement("h1",null,"\ud83c\udf6c\ud83c\udf6c\ud83c\udf6c\ud83c\udf6c Congratulations, ",e.winner," \ud83c\udf6d\ud83c\udf6d\ud83c\udf6d\ud83c\udf6d"),p.a.createElement(y.b,{to:"/"},"New Game")):p.a.createElement(c.a,{to:"/"})},N=[{type:"red",top:945,left:110},{type:"purple",top:952,left:146},{type:"yellow",top:940,left:185},{type:"blue",jumpTo:59,top:903,left:208},{type:"orange",top:864,left:211},{type:"green",top:836,left:232},{type:"red",top:818,left:258},{type:"purple",top:809,left:302},{type:"cupcake",top:817,left:343},{type:"yellow",top:842,left:376},{type:"blue",top:876,left:402},{type:"orange",top:908,left:428},{type:"green",top:935,left:458},{type:"red",top:948,left:495},{type:"purple",top:956,left:525},{type:"yellow",top:936,left:545},{type:"blue",top:900,left:556},{type:"orange",top:872,left:544},{type:"green",top:850,left:511},{type:"icecream",top:813,left:486},{type:"red",top:792,left:447},{type:"purple",top:780,left:404},{type:"yellow",top:757,left:365},{type:"blue",top:718,left:359},{type:"orange",top:685,left:379},{type:"green",top:677,left:415},{type:"red",top:681,left:461},{type:"purple",top:705,left:497},{type:"yellow",jumpTo:40,top:732,left:522},{type:"blue",top:763,left:550},{type:"orange",top:788,left:581},{type:"green",top:801,left:615},{type:"red",top:803,left:652},{type:"purple",top:791,left:689},{type:"yellow",top:752,left:716},{type:"blue",top:711,left:724},{type:"orange",top:672,left:718},{type:"green",top:635,left:702},{type:"red",top:614,left:666},{type:"purple",top:591,left:628},{type:"yellow",top:581,left:586},{type:"gummy",top:580,left:544},{type:"blue",top:579,left:502},{type:"orange",top:579,left:458},{type:"green",jumpTo:0,top:595,left:415},{type:"red",top:609,left:375},{type:"purple",top:630,left:352},{type:"yellow",top:662,left:326},{type:"blue",top:694,left:302},{type:"orange",top:724,left:271},{type:"green",top:753,left:242},{type:"red",top:776,left:212},{type:"purple",top:796,left:179},{type:"yellow",top:808,left:145},{type:"blue",top:811,left:105},{type:"orange",top:797,left:67},{type:"green",top:771,left:26},{type:"red",top:728,left:27},{type:"purple",top:690,left:41},{type:"yellow",top:662,left:66},{type:"blue",top:651,left:113},{type:"orange",top:651,left:156},{type:"green",top:663,left:198},{type:"red",top:665,left:234},{type:"purple",top:653,left:268},{type:"yellow",top:626,left:294},{type:"blue",top:590,left:305},{type:"orange",top:549,left:290},{type:"cookie",top:541,left:251},{type:"green",top:533,left:210},{type:"red",top:527,left:170},{type:"purple",top:490,left:144},{type:"yellow",top:453,left:142},{type:"blue",top:415,left:162},{type:"orange",top:387,left:192},{type:"green",jumpTo:0,top:370,left:222},{type:"red",top:354,left:266},{type:"purple",top:351,left:306},{type:"yellow",top:353,left:350},{type:"blue",top:371,left:390},{type:"orange",top:408,left:407},{type:"green",top:445,left:406},{type:"red",top:481,left:400},{type:"purple",top:517,left:418},{type:"yellow",top:527,left:461},{type:"blue",top:534,left:499},{type:"orange",top:540,left:538},{type:"green",top:541,left:574},{type:"red",top:538,left:611},{type:"purple",top:530,left:648},{type:"yellow",top:513,left:681},{type:"lollipop",top:479,left:711},{type:"blue",top:442,left:719},{type:"orange",top:418,left:685},{type:"green",top:416,left:642},{type:"red",top:404,left:601},{type:"purple",top:385,left:566},{type:"yellow",top:352,left:573},{type:"blue",top:322,left:598},{type:"orange",top:292,left:609},{type:"green",top:254,left:604},{type:"popsicle",top:215,left:627},{type:"red",top:181,left:623},{type:"purple",top:175,left:573},{type:"yellow",top:186,left:527},{type:"blue",top:210,left:499},{type:"orange",top:239,left:471},{type:"green",top:268,left:436},{type:"red",top:290,left:402},{type:"purple",top:301,left:361},{type:"yellow",top:311,left:318},{type:"blue",top:310,left:269},{type:"orange",top:320,left:230},{type:"green",top:337,left:193},{type:"red",top:358,left:160},{type:"purple",top:371,left:125},{type:"chocolate",top:361,left:84},{type:"blue",top:332,left:48},{type:"orange",top:300,left:34},{type:"green",top:257,left:32},{type:"red",top:219,left:40},{type:"purple",top:185,left:54},{type:"yellow",top:161,left:68},{type:"blue",top:140,left:93},{type:"orange",top:132,left:136},{type:"green",top:136,left:174},{type:"red",top:172,left:187},{type:"purple",top:204,left:194},{type:"yellow",top:239,left:201},{type:"blue",top:260,left:232},{type:"orange",top:269,left:277},{type:"green",top:254,left:310},{type:"end",top:184,left:356}];function O(e){for(var t,l,a=e.length;0!==a;)l=Math.floor(Math.random()*a),t=e[a-=1],e[a]=e[l],e[l]=t;return e}function S(e,t,l){var a=document.getElementById("player"+(e+1));a.style.top=t+2*e-35+"px",a.style.left=l+"px"}var k=function(){var e=function(){var e=[];return["red","purple","yellow","blue","orange","green"].forEach((function(t){e.push({type:t}),e.push({type:t}),e.push({type:t}),e.push({type:t}),e.push({type:t}),e.push({type:t})})),["double-red","double-purple","double-yellow","double-blue","double-orange","double-green"].forEach((function(t){e.push({type:t}),e.push({type:t}),e.push({type:t}),e.push({type:t})})),e.push({type:"cupcake"}),e.push({type:"lollipop"}),e.push({type:"icecream"}),e.push({type:"gummy"}),e.push({type:"cookie"}),e.push({type:"popsicle"}),e.push({type:"chocolate"}),e}(),t=Object(a.useState)(!1),l=Object(r.a)(t,2),o=l[0],n=l[1],u=Object(a.useState)(""),s=Object(r.a)(u,2),i=s[0],f=s[1],m=Object(a.useState)(O(e.concat([]))),d=Object(r.a)(m,2),g=d[0],b=d[1],E=Object(a.useState)(4),h=Object(r.a)(E,2),v=h[0],k=h[1],x=Object(a.useState)(0),P=Object(r.a)(x,2),T=P[0],G=P[1],W=Object(a.useState)([{name:"Player 1",position:-1,selectedCard:null},{name:"Player 2",position:-1,selectedCard:null},{name:"Player 3",position:-1,selectedCard:null},{name:"Player 4",position:-1,selectedCard:null}]),q=Object(r.a)(W,2),F=q[0],M=q[1],R=Object(a.useState)(!1),B=Object(r.a)(R,2),I=B[0],A=B[1];function D(e){var t=F.concat([]);if(t[T].selectedCard=e,function(e){for(var t,l,a,p=e[T].selectedCard,o=e[T].position+1,r=p.type.startsWith("double")?p.type.split("double-")[1]:p.type,y=p.type.startsWith("double")?2:1,c=(t=p.type,l=o,"lollipop"===t?90:"cookie"===t?67:"cupcake"===t?7:"icecream"===t?18:"gummy"===t?40:"popsicle"===t?99:"chocolate"===t?114:l>=0?l:0);y>0;){for(var u=c;u<N.length;u++)if((a=N[u]).type===r||"end"===a.type){c=(o=u)+1;break}y--}if(o>=N.length-1)return S(T,a.top,a.left),f(F[T].name),void setTimeout((function(){return n(!0)}),4e3);var s,i=(s=a)&&""+s.jumpTo&&s.jumpTo>=0?a.jumpTo:-1;e[T].position=i>-1?i:o,S(T,a.top,a.left),i>-1&&(a=N[i],setTimeout((function(){S(T,a.top,a.left)}),2e3))}(t),M(t),!o){var l=T+1;l>=v&&(l=0),G(l)}}return p.a.createElement("div",{className:"App"},p.a.createElement("h1",null,"\ud83c\udf6c\ud83c\udf6c TES Candyland!! \ud83c\udf6d\ud83c\udf6d",p.a.createElement("small",null,p.a.createElement("a",{href:"https://shop.hasbro.com/en-us/product/candy-land-game:C4E461C2-5056-9047-F5F7-F005920A3999"},"Candyland")," is published by Hasbro. This is an educational parody/tool.")),p.a.createElement(y.a,{basename:"/TESCandyland"},p.a.createElement(c.d,null,p.a.createElement(c.b,{exact:!0,path:"/"},p.a.createElement(w,{players:F,playersReady:I,newGameReset:function(){M([{name:F[0].name,position:-1,selectedCard:null},{name:F[1].name,position:-1,selectedCard:null},{name:F[2].name,position:-1,selectedCard:null},{name:F[3].name,position:-1,selectedCard:null}]),f(""),G(0)},setPlayers:function(e){M([{name:e[0],position:-1,selectedCard:null},{name:e[1],position:-1,selectedCard:null},{name:e[2],position:-1,selectedCard:null},{name:e[3],position:-1,selectedCard:null}]),f(""),A(!1)},setPlayerCount:k,playerCount:v})),p.a.createElement(c.b,{path:"/game"},p.a.createElement(C,{winner:i,currentPlayer:T,gameOver:o,drawCard:function(){var t=Math.floor(Math.random()*g.length);console.log("Selected card index ".concat(t));var l=g.concat([]);l.splice(t,1),console.log(g[t]),console.log("".concat(l.length," cards remaining")),D(g[t]),1===g.length?(console.log("Deck exhausted, shufffling"),b(O(e.concat([])))):b(l)},players:F,playerCount:v})),p.a.createElement(c.b,{path:"/gameover"},p.a.createElement(j,{winner:i,setGameOver:n})))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));n.a.render(p.a.createElement(k,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[23,1,2]]]);
//# sourceMappingURL=main.43226b73.chunk.js.map