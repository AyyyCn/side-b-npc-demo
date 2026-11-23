/*!
Three.js

The MIT License

Copyright © 2010-2026 three.js authors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

meshoptimizer

MIT License

Copyright (c) 2016-2026 Arseny Kapoulkine

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Earcut

ISC License

Copyright (c) 2024, Mapbox

Permission to use, copy, modify, and/or distribute this software for any purpose
with or without fee is hereby granted, provided that the above copyright notice
and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.

*/
import{a as w,b as P,c as t,d as pe,e as Y,f as fe,g as he,h as d,i as me,j as E,k as be}from"./chunk-CEV25VML.js";import"./chunk-GYEJYHA5.js";import{D as q,G as re,I as ae,M as N,P as ce,Z as de,oa as le,p as B,s as se,t as W,u as te,z as ie}from"./chunk-IRLDILCX.js";import{a as I,b as T,c as l,d as u,e as F,f as O,g as X}from"./chunk-7JDTXHS2.js";import"./chunk-EJRCZQV5.js";import"./chunk-KXWL3TAT.js";async function ve(r){let i=await he(r,{[I.key]:{rig:"harper",height:1.62,top:"#6f867b",yaw:0}},!0),o=i.scene,g=i.materials.wood,M=i.materials.stone.clone(),z=i.materials.plaster.clone();M.color.set("#aba99e"),M.roughness=.9,M.normalScale.set(.16,.16),z.color.set("#e7dabd");let S=w("#5b4632"),L=w("#bea479",.38,.66),C=w("#dbceb0"),a=w("#325349"),f=w("#46473d",.48,.42);t(o,M,0,-.1,0,14,.2,11),t(o,z,-5.45,2.1,0,.19,4.3,8.7),t(o,g,-5.32,.13,0,.1,.25,8.7);let K=w("#697a70"),ge=P("#b7c4b8");for(let e=0;e<4;e++){let s=-2.22+e*.85;t(o,K,-5.32,2.15,s,.08,1.74,.82),t(o,ge,-5.26,2.15,s,.032,1.6,.73),t(o,K,-5.23,2.13,s,.027,.055,.74)}t(o,g,-5.24,1.22,-.96,.35,.11,3.7);let Q=w("#77786b");for(let e=-5;e<6;e+=1.45)t(o,Q,e,.002,0,.012,.003,11);for(let e=-4;e<5;e+=1.45)t(o,Q,0,.002,e,14,.003,.012);t(o,z,0,1.92,-3.22,12,3.9,.24),t(o,g,0,.13,-3.03,12,.25,.13);let D=[],$=["#625d4d","#c4bca4","#a77c62","#46616a","#cab792","#746b72","#747854","#b2957d","#333e40","#be8a6f"];for(let[e,s]of l.entries()){let n=s.x;for(let c of[1.41,1.94,2.47])t(o,g,n,c,-2.83,2.54,.077,.5);for(let c of[-1.23,0,1.23])t(o,g,n+c,1.92,-2.83,.057,1.15,.5);for(let c=0;c<2;c++)for(let m=0;m<45;m++){if(m%14===9||m===22)continue;let R=.28+(m*7+e*9)%11*.012;D.push({x:n-1.17+m*.0525,y:1.45+c*.53+R/2,z:-2.68+m%5*.007,h:R,c:$[(m*13+e*7+c*3)%$.length],tilt:m%11===0?-.065:0})}t(o,g,n,.52,-2.2,1.5,1.02,.75),t(o,L,n,.94,-1.818,1.53,.054,.048),t(o,C,n,.65,-1.814,1.35,.4,.021);for(let c of[-.7,.7])t(o,S,n+c,1.14,-2.18,.085,.35,.73);t(o,S,n,1.14,-2.52,1.46,.35,.08),t(o,S,n,1.1,-1.85,1.44,.27,.065),Y(o,s.name.toUpperCase(),n,.65,-1.788,1.05,.22,"#3c4036","#ded0b3");for(let c=0;c<7;c++)t(o,c%3===0?a:C,n,1.15,-2.4+c*.071,1.27,.2+c%3*.035,.043)}let Te=w("#ffffff"),k=new re(new N(1,1,1),Te,D.length),A=new se;D.forEach((e,s)=>{A.position.set(e.x,e.y,e.z),A.scale.set(.039,e.h,.29),A.rotation.z=e.tilt,A.updateMatrix(),k.setMatrixAt(s,A.matrix),k.setColorAt(s,new te(e.c))}),k.castShadow=k.receiveShadow=!0,o.add(k),Y(o,"SIDE B     /     RECORD ARCHIVE",0,2.95,-3.076,4.3,.35,"#344e44","#ddd2b7");for(let e of[-4.65,4.68])t(o,S,e,1.9,-3.04,.1,3.75,.12),t(o,L,e,2.9,-2.93,.25,.09,.14);for(let e of[-3,0,3]){pe(o,f,[e,3.2,-2.8],[e,3.2,-2.3],.028);let s=new q(new ce(.23,.21,22),a);s.position.set(e,3.12,-2.26),o.add(s),t(o,P("#fff1cd"),e,3.005,-2.26,.31,.015,.29),fe(o,16767649,30,[e,2.96,-2.24],[e,1,-2])}let U=new W;o.add(U);let ee=[];for(let e=0;e<3;e++){let s=new W;U.add(s),ee.push(s),t(s,L,0,1.01,0,1.055,1.54,.08),t(s,a,0,1.01,.052,1.01,1.49,.052);for(let n=0;n<12;n++)t(s,w(n%2?"#60746a":"#6b7d70"),-.455+n*.083,1.02,.084,.031,1.41,.035);for(let n of[.3,1.71])t(s,S,0,n,.098,1.02,.042,.039);for(let n of[-1,1])t(s,f,n*.42,.14,0,.04,.24,.064),t(s,f,n*.42,.052,0,.063,.065,.186)}let j=new q(new N(.49,.49,.035),le());o.add(j),j.rotation.x=-.12;let xe=l.map(()=>{let e=new ie().setFromPoints([new B,new B]),s=new ae(e,new de({color:"#7db49c",dashSize:.14,gapSize:.09,transparent:!0,opacity:.85}));return o.add(s),s}),Se=l.map(e=>t(o,P("#decba5"),e.x,1.1,-1.805,.25,.055,.012));return(e,s,n)=>{let c=(e.screen.left+e.screen.right)/2,m=e.screen.right-e.screen.left;U.position.set(c,0,(e.screen.front+e.screen.back)/2),ee.forEach((h,v)=>{h.position.x=e.closed?(v-1)*m/3:(v-1)*.035,h.position.z=e.closed?0:(v-1)*.058});let R=l.find(h=>h.id===e.destination),Me=Math.max(0,Math.min(1,(s-u)/8));j.visible=s>=u-6&&s<u+8||n.found,j.position.set(R.x,n.found?1.5:1.6-Me*.42,-2.055),Se.forEach((h,v)=>h.material.color.set(n.inspected.some(y=>y.i===v&&y.found)?"#a7d796":n.visit?.i===v?"#e6a05b":"#beb494")),xe.forEach((h,v)=>{if(h.visible=s>=u&&s<F+2,!h.visible)return;let y=l[v],ye=e.screen.front,ne=e.visible[v]?1:(ye-T.z)/(y.z-T.z),V=h.geometry.attributes.position;V.setXYZ(0,T.x,.044,T.z),V.setXYZ(1,T.x+(y.x-T.x)*ne,.044,T.z+(y.z-T.z)*ne),V.needsUpdate=!0,h.computeLineDistances(),h.material.color.set(e.visible[v]?"#9dcfb2":"#d89c61")});let ze=n.visit&&s>=n.visit.arrive,oe=ze?l[n.visit.i]:null;return i.pose(I.key,n.pos,n.yaw,n.speed>.1,s,oe?[["r",oe.x-.13,1.16,-1.71]]:[]),i.render([3.12,3.83,7.52],[-.12,1.18,-.63],36.5),i.project(n.pos.x,1.78,n.pos.z)}}var H=new URLSearchParams(location.search),p=H.get("screen")!=="open",x=l.some(r=>r.id===H.get("bin"))?H.get("bin"):"dispatch",b,Z,ue,_="";function we(){b=O(p,x),Z=O(!p,x),_=""}we();E("lab-title","Perception & search");E("premise","File the same record behind a movable screen. Watch where Ida looks for it.");E("experiment","The missing sleeve");d("fields").innerHTML='<label>File the sleeve in<select id="bin">'+l.map(r=>'<option value="'+r.id+'">'+r.name+"</option>").join("")+'</select></label><label>Folding screen<select id="screen"><option value="closed">Across the room</option><option value="open">Folded aside</option></select></label>';d("actions").innerHTML='<button class="main-action" id="search-start">Watch the search</button><button id="compare-screen">Fold screen aside</button>';d("under").innerHTML='<h3>Ida\u2019s observations</h3><ol class="evidence-list" id="observations"></ol>';d("details").innerHTML='<h3>Where Ida thinks the sleeve is</h3><div id="weights"></div><p class="proof-note">Starting odds use 50 sample filings. Seeing the deposit or finding an empty bin changes Ida\u2019s estimate.</p><p class="interactive"><a id="send-record" hidden>Send the sleeve to sound check \u2197</a></p>';d("weights").innerHTML=l.map(r=>'<div class="prob"><span>'+r.name+"</span><i><b></b></i><span>0%</span></div>").join("");var G=be({initial:u,limit:()=>b.end,draw:Le,describe:Ee});function J(r=!1){we(),G.jump(u,r)}d("bin").value=x;d("screen").value=p?"closed":"open";d("bin").onchange=r=>{x=r.target.value,J()};d("screen").onchange=r=>{p=r.target.value==="closed",J()};d("compare-screen").onclick=()=>{p=!p,d("screen").value=p?"closed":"open",J(!0)};d("search-start").onclick=()=>G.jump(0,!0);function Ee(r){let i=X(b,r);return{mode:"perception",closed:p,bin:x,seen:r<u?null:b.seen,visible:b.visible,weights:i.weights,observer:{name:I.name,...i.pos},found:i.found,inspected:i.inspected.map(o=>l[o.i].name),currentSearch:i.visit?l[i.visit.i].name:null,evidence:i.evidence.map(o=>o.text),finishedAt:b.end}}function Le(r){let i=X(b,r);ue(b,r,i);let o=d("send-record");if(o.hidden=!i.found,i.found){let a=new URLSearchParams("crew");a.set("archive",p?"closed":"open"),a.set("bin",x);for(let f of["run","seed","hold"])H.has(f)&&a.set(f,H.get(f));o.href="?"+a}let g=i.visit?l[i.visit.i].name:null,M=i.found?"Ida found the sleeve in "+l.find(a=>a.id===x).name:r<u?"The sleeve is about to be filed":r<F?b.seen?"Ida saw the deposit":"The screen blocked the deposit":r<i.visit.arrive?"Ida is walking to "+g:"Ida checks "+g;E("scene-caption",M),E("compare-screen",p?"Fold screen aside":"Unfold screen");let z=p+"/"+x+"/"+i.evidence.length;if(z===_)return;_=z;let S=p?b:Z,L=p?Z:b;d("result").innerHTML='<div class="metrics">'+[[S,"Screen across"],[L,"Screen aside"]].map(([a,f])=>'<div class="metric"><strong>'+a.visits.length+" "+(a.visits.length===1?"bin":"bins")+"</strong><span>"+f+"</span></div>").join("")+"</div><p>Same sleeve in "+l.find(a=>a.id===x).name+". The counts compare complete replays.</p>";let C=d("weights").children;i.weights.forEach((a,f)=>{C[f].querySelector("b").style.width=a*100+"%",C[f].lastChild.textContent=Math.round(a*100)+"%"}),d("observations").innerHTML=i.evidence.map(a=>"<li><time>"+me(a.t)+"</time><span>"+a.text+"</span></li>").join("")}ve(d("world")).then(r=>{ue=r,G.open()}).catch(G.fail);
