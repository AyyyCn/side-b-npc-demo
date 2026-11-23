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
import{a as w,b as U,c as s,d as ue,e as J,f as we,g as ge,h as l,i as xe,j as I,k as Te}from"./chunk-OSKQ7EJO.js";import"./chunk-O3A6BAD2.js";import{D as Y,G as pe,I as fe,M as Z,P as he,Z as me,oa as ve,p as V,qa as be,s as ce,t as X,u as de,z as le}from"./chunk-UAW4QEMP.js";import{a as A,b as x,c as p,d as u,e as D,f as _,g as F}from"./chunk-DNQ3AYLV.js";import"./chunk-EJRCZQV5.js";import"./chunk-KXWL3TAT.js";async function Me(r){let i=await ge(r,{[A.key]:{rig:"harper",height:1.62,top:"#6f867b",yaw:0}},!0),o=i.scene,g=i.materials.wood,E=i.materials.stone.clone(),L=i.materials.plaster.clone();E.color.set("#aba99e"),E.roughness=.9,E.normalScale.set(.16,.16),L.color.set("#e7dabd");let S=w("#5b4632"),k=w("#bea479",.38,.66),H=w("#dbceb0"),a=w("#325349"),m=w("#46473d",.48,.42);s(o,E,0,-.1,0,14,.2,11),s(o,L,-5.45,2.1,0,.19,4.3,8.7),s(o,g,-5.32,.13,0,.1,.25,8.7);let ee=w("#697a70"),ye=U("#b7c4b8");for(let e=0;e<4;e++){let t=-2.22+e*.85;s(o,ee,-5.32,2.15,t,.08,1.74,.82),s(o,ye,-5.26,2.15,t,.032,1.6,.73),s(o,ee,-5.23,2.13,t,.027,.055,.74)}s(o,g,-5.24,1.22,-.96,.35,.11,3.7);let oe=w("#77786b");for(let e=-5;e<6;e+=1.45)s(o,oe,e,.002,0,.012,.003,11);for(let e=-4;e<5;e+=1.45)s(o,oe,0,.002,e,14,.003,.012);s(o,L,0,1.92,-3.22,12,3.9,.24),s(o,g,0,.13,-3.03,12,.25,.13);let W=[],te=["#625d4d","#c4bca4","#a77c62","#46616a","#cab792","#746b72","#747854","#b2957d","#333e40","#be8a6f"];for(let[e,t]of p.entries()){let n=t.x;for(let d of[1.41,1.94,2.47])s(o,g,n,d,-2.83,2.54,.077,.5);for(let d of[-1.23,0,1.23])s(o,g,n+d,1.92,-2.83,.057,1.15,.5);for(let d=0;d<2;d++)for(let v=0;v<45;v++){if(v%14===9||v===22)continue;let z=.28+(v*7+e*9)%11*.012;W.push({x:n-1.17+v*.0525,y:1.45+d*.53+z/2,z:-2.68+v%5*.007,h:z,c:te[(v*13+e*7+d*3)%te.length],tilt:v%11===0?-.065:0})}s(o,g,n,.52,-2.2,1.5,1.02,.75),s(o,k,n,.94,-1.818,1.53,.054,.048),s(o,H,n,.65,-1.814,1.35,.4,.021);for(let d of[-.7,.7])s(o,S,n+d,1.14,-2.18,.085,.35,.73);s(o,S,n,1.14,-2.52,1.46,.35,.08),s(o,S,n,1.1,-1.85,1.44,.27,.065),J(o,t.name.toUpperCase(),n,.65,-1.788,1.05,.22,"#3c4036","#ded0b3");for(let d=0;d<7;d++)s(o,d%3===0?a:H,n,1.15,-2.4+d*.071,1.27,.2+d%3*.035,.043)}let Ee=w("#ffffff"),R=new pe(new Z(1,1,1),Ee,W.length),j=new ce;W.forEach((e,t)=>{j.position.set(e.x,e.y,e.z),j.scale.set(.039,e.h,.29),j.rotation.z=e.tilt,j.updateMatrix(),R.setMatrixAt(t,j.matrix),R.setColorAt(t,new de(e.c))}),R.castShadow=R.receiveShadow=!0,o.add(R),J(o,"SIDE B     /     RECORD ARCHIVE",0,2.95,-3.076,4.3,.35,"#344e44","#ddd2b7");for(let e of[-4.65,4.68])s(o,S,e,1.9,-3.04,.1,3.75,.12),s(o,k,e,2.9,-2.93,.25,.09,.14);for(let e of[-3,0,3]){ue(o,m,[e,3.2,-2.8],[e,3.2,-2.3],.028);let t=new Y(new he(.23,.21,22),a);t.position.set(e,3.12,-2.26),o.add(t),s(o,U("#fff1cd"),e,3.005,-2.26,.31,.015,.29),we(o,16767649,30,[e,2.96,-2.24],[e,1,-2])}let q=new X;o.add(q);let ne=[];for(let e=0;e<3;e++){let t=new X;q.add(t),ne.push(t),s(t,k,0,1.01,0,1.055,1.54,.08),s(t,a,0,1.01,.052,1.01,1.49,.052);for(let n=0;n<12;n++)s(t,w(n%2?"#60746a":"#6b7d70"),-.455+n*.083,1.02,.084,.031,1.41,.035);for(let n of[.3,1.71])s(t,S,0,n,.098,1.02,.042,.039);for(let n of[-1,1])s(t,m,n*.42,.14,0,.04,.24,.064),s(t,m,n*.42,.052,0,.063,.065,.186)}let M=new Y(new Z(.49,.49,.035),ve());o.add(M),M.rotation.x=-.12;let Le=p.map(()=>{let e=new le().setFromPoints([new V,new V]),t=new fe(e,new me({color:"#7db49c",dashSize:.14,gapSize:.09,transparent:!0,opacity:.85}));return o.add(t),t}),Ce=p.map(e=>s(o,U("#decba5"),e.x,1.1,-1.805,.25,.055,.012)),G=new V,se,ie;return(e,t,n)=>{se!==e&&(se=e,ie=be(e.end,c=>{let f=F(e,c);return{...f.pos,facing:f.yaw}},Math.atan2(2.6,-4.25)));let d=(e.screen.left+e.screen.right)/2,v=e.screen.right-e.screen.left;q.position.set(d,0,(e.screen.front+e.screen.back)/2),ne.forEach((c,f)=>{c.position.x=e.closed?(f-1)*v/3:(f-1)*.035,c.position.z=e.closed?0:(f-1)*.058});let z=p.find(c=>c.id===e.destination),Ae=Math.max(0,Math.min(1,(t-u)/8));M.visible=t>=u-6&&t<u+8||n.found,M.position.set(z.x,n.found?1.5:1.6-Ae*.42,-2.055),Ce.forEach((c,f)=>c.material.color.set(n.inspected.some(C=>C.i===f&&C.found)?"#a7d796":n.visit?.i===f?"#e6a05b":"#beb494")),Le.forEach((c,f)=>{if(c.visible=t>=u&&t<D+2,!c.visible)return;let C=p[f],He=e.screen.front,ae=e.visible[f]?1:(He-x.z)/(C.z-x.z),O=c.geometry.attributes.position;O.setXYZ(0,x.x,.044,x.z),O.setXYZ(1,x.x+(C.x-x.x)*ae,.044,x.z+(C.z-x.z)*ae),O.needsUpdate=!0,c.computeLineDistances(),c.material.color.set(e.visible[f]?"#9dcfb2":"#d89c61")});let Ie=n.visit&&t>=n.visit.arrive,re=Ie?p[n.visit.i]:null,y=Math.max(0,Math.min(1,(t-e.end+6)/6)),ke=ie(t),N=[];if(y>0)N.push(["r",z.x+.17,1.14+y*.12,-1.72+y*.17,1]);else if(re){let c=Math.min(1,(t-n.visit.arrive)/2,n.visit.found?1:(n.visit.end-t)/2);N.push(["r",re.x+.15,1.16,-1.73,c])}if(i.pose(A.key,n.pos,ke,t,N),y>0){i.handPosition(A.key,"r",G),M.visible=!0;let c=y*y*(3-2*y);M.position.set(z.x+(G.x-.13-z.x)*c,1.11+(G.y+.09-1.11)*c,-2.04+(G.z-.015+2.04)*c),M.rotation.x=-.12-.17*c}else M.rotation.x=-.12;return i.render([3.12,3.83,7.52],[-.12,1.18,-.63],36.5),i.project(n.pos.x,1.78,n.pos.z)}}var P=new URLSearchParams(location.search),h=P.get("screen")!=="open",T=p.some(r=>r.id===P.get("bin"))?P.get("bin"):"dispatch",b,K,Se,Q="";function ze(){b=_(h,T),K=_(!h,T),Q=""}ze();I("lab-title","Perception & search");I("premise","File the same record behind a movable screen. Watch where Ida looks for it.");I("experiment","The missing sleeve");l("fields").innerHTML='<label>File the sleeve in<select id="bin">'+p.map(r=>'<option value="'+r.id+'">'+r.name+"</option>").join("")+'</select></label><label>Folding screen<select id="screen"><option value="closed">Across the room</option><option value="open">Folded aside</option></select></label>';l("actions").innerHTML='<button class="main-action" id="search-start">Watch the search</button><button id="compare-screen">Fold screen aside</button>';l("under").innerHTML='<h3>Ida\u2019s observations</h3><ol class="evidence-list" id="observations"></ol>';l("details").innerHTML='<h3>Where Ida thinks the sleeve is</h3><div id="weights"></div><p class="proof-note">Starting odds use 50 sample filings. Seeing the deposit or finding an empty bin changes Ida\u2019s estimate.</p><p class="interactive"><a id="send-record" hidden>Send the sleeve to sound check \u2197</a></p>';l("weights").innerHTML=p.map(r=>'<div class="prob"><span>'+r.name+"</span><i><b></b></i><span>0%</span></div>").join("");var B=Te({initial:u,limit:()=>b.end,draw:je,describe:Re});function $(r=!1){ze(),B.jump(u,r)}l("bin").value=T;l("screen").value=h?"closed":"open";l("bin").onchange=r=>{T=r.target.value,$()};l("screen").onchange=r=>{h=r.target.value==="closed",$()};l("compare-screen").onclick=()=>{h=!h,l("screen").value=h?"closed":"open",$(!0)};l("search-start").onclick=()=>B.jump(0,!0);function Re(r){let i=F(b,r);return{mode:"perception",closed:h,bin:T,seen:r<u?null:b.seen,visible:b.visible,weights:i.weights,observer:{name:A.name,...i.pos},found:i.found,inspected:i.inspected.map(o=>p[o.i].name),currentSearch:i.visit?p[i.visit.i].name:null,evidence:i.evidence.map(o=>o.text),finishedAt:b.end}}function je(r){let i=F(b,r);Se(b,r,i);let o=l("send-record");if(o.hidden=!i.found,i.found){let a=new URLSearchParams("crew");a.set("archive",h?"closed":"open"),a.set("bin",T);for(let m of["run","seed","hold"])P.has(m)&&a.set(m,P.get(m));o.href="?"+a}let g=i.visit?p[i.visit.i].name:null,E=i.found?"Ida found the sleeve in "+p.find(a=>a.id===T).name:r<u?"The sleeve is about to be filed":r<D?b.seen?"Ida saw the deposit":"The screen blocked the deposit":r<i.visit.arrive?"Ida is walking to "+g:"Ida checks "+g;I("scene-caption",E),I("compare-screen",h?"Fold screen aside":"Unfold screen");let L=h+"/"+T+"/"+i.evidence.length;if(L===Q)return;Q=L;let S=h?b:K,k=h?K:b;l("result").innerHTML='<div class="metrics">'+[[S,"Screen across"],[k,"Screen aside"]].map(([a,m])=>'<div class="metric"><strong>'+a.visits.length+" "+(a.visits.length===1?"bin":"bins")+"</strong><span>"+m+"</span></div>").join("")+"</div><p>Same sleeve in "+p.find(a=>a.id===T).name+". The counts compare complete replays.</p>";let H=l("weights").children;i.weights.forEach((a,m)=>{H[m].querySelector("b").style.width=a*100+"%",H[m].lastChild.textContent=Math.round(a*100)+"%"}),l("observations").innerHTML=i.evidence.map(a=>"<li><time>"+xe(a.t)+"</time><span>"+a.text+"</span></li>").join("")}Me(l("world")).then(r=>{Se=r,B.open()}).catch(B.fail);
