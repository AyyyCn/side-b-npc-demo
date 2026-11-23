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
import{a as x,b as Z,c as p,d as z,e as re,f as _,g as ve,h as d,i as k,j as T,k as ye}from"./chunk-CEV25VML.js";import"./chunk-GYEJYHA5.js";import{D,N as fe,O as te,R as me,t as pe}from"./chunk-IRLDILCX.js";import{a as E,b as he,c as j,d as ue,e as be,f as ke,g as we,h as X,i as F,j as B,k as oe,l as ne}from"./chunk-YWD4NHCN.js";import"./chunk-TPG5SM4J.js";import{c as ae,f as ge}from"./chunk-7JDTXHS2.js";import"./chunk-EJRCZQV5.js";import"./chunk-KXWL3TAT.js";var xe={esme:{rig:"maya",height:1.7,top:"#d9b979",yaw:0},wes:{rig:"sam",height:1.8,top:"#637f88",yaw:0},nina:{rig:"harper",height:1.67,top:"#a2849a",yaw:0},maya:{rig:"jordan",height:1.76,top:"#7e9478",yaw:0}};async function Me(a){let n=await ve(a,xe,!1),t=n.scene,r=x("#b4bdc3",.33,.79),g=x("#24272a"),le=x("#474d50",.48,.45),C=x("#c5a062"),Y=x("#612c35",.98),w=x("#263b40",.63,.3),y=x("#393934",.89,.1);p(t,y,0,-.12,0,17,.24,11);let i=x("#262a27"),b=x("#4b4b40");for(let e=-3.3;e<5.4;e+=.66){p(t,i,0,.003,e,17,.005,.012);for(let o=-7+Math.round(e*10)%2*.57;o<8;o+=2.65)p(t,i,o,.004,e+.33,.01,.006,.66),p(t,b,o+.029,.008,e+.038,.027,.004,.02)}p(t,g,-6.05,2.1,.2,.16,4.25,7.3);for(let e=-2.5;e<3.8;e+=.18)p(t,x("#302d30"),-5.95,1.96,e,.13,3.96,.074);for(let e of[-5.48,5.48])for(let o of[-2.7,-2.37]){z(t,r,[e,.1,o],[e,3.24,o],.05);for(let s=.12;s<2.9;s+=.41)z(t,r,[e,s,o],[e+.19,s+.28,o],.018)}p(t,g,0,2,-3.33,14,4.2,.25);let H=new me(14,4.1,180,3),P=H.attributes.position;for(let e=0;e<P.count;e++)P.setZ(e,.12*Math.cos(P.getX(e)*8.8)+.035*Math.cos(P.getX(e)*17.6));H.computeVertexNormals();let $=new D(H,Y);$.position.set(0,2.02,-3.02),$.receiveShadow=!0,t.add($);for(let e of[-2.7,-2.37])for(let o of[2.91,3.24])z(t,r,[-6.2,o,e],[6.2,o,e],.036);for(let e=-6;e<=6;e+=.48)z(t,r,[e,2.91,-2.36],[e+.48,3.24,-2.36],.019),z(t,r,[e,3.24,-2.36],[e+.48,2.91,-2.36],.019);let ze=new te(.13,.16,.36,16);for(let e=0;e<7;e++){let o=-5.4+e*1.8,s=new D(ze,g);s.position.set(o,2.79,-2.33),s.rotation.x=.58,t.add(s),z(t,r,[o,3.04,-2.45],[o,2.84,-2.34]);let h=new D(new fe(.13,24),Z(e%2?"#eebd83":"#8cbfc5"));h.position.set(o,2.63,-2.41),h.rotation.x=-1.06,t.add(h)}function R(e,o,s,h,l,f,G){let u=new pe;e.add(u),u.position.set(o,0,s),p(u,w,0,l/2+.15,0,h,l,f);for(let m of[.16,.16+l,.16+l*.77]){p(u,r,0,m,f/2,h+.025,.028,.028),p(u,r,0,m,-f/2,h+.025,.028,.028);for(let S of[-1,1])p(u,r,S*h/2,m,0,.028,.028,f)}for(let m of[-1,1])for(let S of[-1,1]){p(u,r,m*h*.5,.16+l*.5,S*f*.5,.026,l,.026);for(let O of[.19,.13+l])p(u,r,m*(h/2-.012),O,S*(f/2-.012),.075,.073,.075);let L=new D(new te(.081,.081,.056,12),g);L.rotation.z=Math.PI/2,L.position.set(m*(h/2-.11),.073,S*(f/2-.1)),u.add(L)}for(let m of[-1,1])p(u,g,m*h*.29,.16+l*.6,f*.5+.015,.12,.13,.022),p(u,r,m*h*.29,.16+l*.61,f*.5+.029,.07,.044,.012);return G&&re(u,G,0,.16+l*.42,f/2+.021,h*.66,l*.22,"#f0dfb7","#344448"),u}let ee=R(t,0,0,1.12,.89,.76,"PA  /  04");for(let e of[-1,1])for(let o of[-.17,.17])z(ee,r,[o,.86,e*.38],[o,.86,e*.46],.019);for(let e of[-1,1])z(ee,r,[-.17,.86,e*.46],[.17,.86,e*.46],.027);R(t,-4.7,-2.15,1.06,.82,.58,"PATCH"),R(t,-3.47,-2.23,1.1,.68,.66),R(t,4.47,-2.28,1.1,.64,.58),R(t,5.45,-2.2,.72,1.45,.8,"PA");for(let e of[-2.1,2.12]){let o=R(t,e,-2.15,1.1,.81,.71,e<0?"POWER":"LX");for(let s=0;s<9;s++)p(o,s%3===0?Z("#97c4a1"):g,-.39+s*.096,1,.02,.034,.025,.17)}let Ae=re(t,"SIDE B    /    STAGE LEFT",-.58,2.06,-2.83,3.35,.39,"#ede2c9","#352d32");Ae.rotation.x=-.018;for(let e of[-1,1])for(let o=-4.45;o<2.26;o+=.52)p(t,C,o,.008,.74+e*.83,.26,.008,.028);for(let e of[1.24,2.55])for(let o of[.17,1.31])p(t,C,e,.012,o,.21,.011,.033),p(t,C,e,.012,o,.033,.011,.21);_(t,14789756,90,[-3,3.6,.2],[-1,.4,0]),_(t,9553375,88,[3.4,3.4,-.9],[1.5,.6,.7]),_(t,14582912,62,[-2.5,.5,-2.4],[-.9,2,-3]);let Ce=p(t,Z("#557c60"),1.76,.89,-1.8,.19,.06,.025);return(e,o)=>{let s=F(e,o);ee.position.set(s.x,0,s.z);for(let h of j){let l=X(e,h.id,o),f=l.part,G=f?f.to.x-f.from.x:0,u=f?f.to.z-f.from.z:0,m=f&&Math.hypot(G,u)>.01?Math.atan2(G,u):Math.PI,S=l.kind==="walk",L=[];if(l.kind==="work"&&f.task==="rack"){let O=l.z>s.z?1:-1;m=O<0?.25:Math.PI-.25;let V=s.z+O*.46;L=[["l",s.x+(O<0?.17:-.17),.86,V],["r",s.x+(O<0?-.17:.17),.86,V]],S=!0}else(l.kind==="work"||l.kind==="standby")&&(m=Math.PI);if(l.kind==="away"){m=-1.06;let O=l.x-.13*Math.cos(m)+.08*Math.sin(m),V=l.z+.13*Math.sin(m)+.08*Math.cos(m);L=[["r",O,xe[h.person.key].height*.91,V]]}n.pose(h.person.key,l,m,S,o,L)}return Ce.material.color.set(B(e,"lights",o).done?"#a5ffb5":"#665741"),n.render([2.85,3.05,7.65],[-.58,1.02,-.29],36.3),n.project(s.x,1.13,s.z)}}var Q=new URLSearchParams(location.search),M=be(Q),ie=Q.get("archive"),se=ae.find(a=>a.id===Q.get("bin"))??ae[2],J=["open","closed"].includes(ie)?ge(ie==="closed",se.id):null,A=Q.get("run")==="altered"?"altered":"original",v,c,K,Te,U="",W="";function je(){v=we(ke(M[A],J?.end??0)),c=v,K=null,U=W=""}je();T("lab-title","Crew coordination");T("premise","Call a stagehand on the radio mid-transfer. Can the crew still open the doors on time?");T("experiment","The opening cue");var ce=d("related");ce.hidden=!1;ce.href="?crowd&seed="+M.seed+"&hold="+M.hold;ce.textContent="See the crowd that booked this hall \u2197";d("fields").innerHTML='<label>Audience<select id="attendance"><option value="original">Original crowd \xB7 '+M.original+'</option><option value="altered">Interrupted crowd \xB7 '+M.altered+'</option></select></label><label>Radio recipient<select id="who">'+j.map(a=>'<option value="'+a.id+'">'+a.name+" \xB7 "+a.title+"</option>").join("")+'</select></label><label>Absence<select id="duration"><option value="60">6 seconds</option><option value="120" selected>12 seconds</option><option value="200">20 seconds</option></select></label>';d("attendance").value=A;d("who").value=1;d("actions").innerHTML='<button id="apply" class="main-action">Make radio call</button><button id="restore">Reset plan</button>';d("under").innerHTML='<h3>Crew schedule</h3><div id="gantt"></div><p class="proof-note">Solid bars show assigned work. Stripes mark the absence. The line follows the replay.</p>';d("details").innerHTML='<h3 id="decision-title">Current work</h3><p class="notes" id="decision"></p><p class="proof-note" id="order"></p><p class="proof-note interactive"><a id="to-archive">Open the record search \u2197</a></p>';var N=a=>a.team.map(n=>j[n].name).join(" and "),q=()=>Math.max(E,c.end,K?.end??0),I=ye({initial:ne(v),limit:q,draw:Se,describe:Pe});function de(){je(),I.jump(ne(v))}d("attendance").onchange=a=>{A=a.target.value,de()};d("restore").onclick=de;d("who").onchange=d("duration").onchange=()=>{c.incident?de():I.paint()};d("apply").onclick=()=>{let a=Math.floor(I.tick);if(a>=v.end||c.incident)return;let n=Number(d("who").value),t=Number(d("duration").value);c=oe(v,a,n,t),K=oe(v,a,n,t,{keepTeams:!0}),U=W="",I.jump(a,!0)};function Pe(a){let n=B(c,"rack",a),t=c.incident;return{mode:"crew",recordReady:J?.end??0,audience:M[A],run:A,seed:M.seed,doors:E,baseEnd:v.end,finish:c.end,keptTeamsEnd:K?.end??null,incident:t??null,rack:{position:F(c,a),worked:n.worked,total:n.total,team:n.current?N(n.current):null},jobs:c.jobs.map(r=>r.id),assignments:c.entries.map(r=>({id:r.job.id,team:N(r),start:r.start,end:r.end})),crew:j.map(r=>{let g=X(c,r.id,a);return{name:r.name,x:g.x,z:g.z,activity:g.kind,skills:r.skills}})}}function Se(a){Te(c,a);let n=c.incident,t=B(c,"rack",a),r=Math.round(100*t.worked/t.total),g=c.entries.filter(w=>w.start<=a&&a<w.end),le=a>=c.end?"Opening cue complete":t.current?N(t.current)+" move the PA rack":!t.done&&r>0?"PA rack parked at "+r+"%":g.length?g.map(w=>w.job.short).join("  \xB7  "):"Crew moving into position";T("scene-caption",le),d("apply").disabled=!!n||Math.floor(a)>=v.end;let C=A+"/"+(n?[n.t,n.absent,n.until].join("-"):"base");if(C!==U){U=C;let w=n?[[k(K.end),"Keep original teams"],[k(c.end),"Reassign the crew"]]:[[k(v.end),"Planned opening cue"],[k(E),"Doors open"]];if(d("result").innerHTML='<div class="metrics">'+w.map(([y,i])=>'<div class="metric"><strong>'+y+"</strong><span>"+i+"</span></div>").join("")+"</div><p>"+(n?c.end<=E?"Replanned crew makes doors by "+k(E-c.end)+".":"Opening runs "+k(c.end-E)+" past doors.":"Doors are set for "+k(E)+". Each job needs the right skills and a crew member on site.")+"</p>",d("to-archive").href="?perception&seed="+M.seed+"&hold="+M.hold+"&run="+A+"&screen="+(ie??"closed")+"&bin="+se.id,T("order",M[A]+" guests in East Hall. "+(M[A]>=he?"The work order includes a second speaker zone.":"One speaker zone covers this audience.")+(J?" The reference sleeve arrives from "+se.name+" at "+k(J.end)+" for the main sound check.":"")),T("decision-title",n?"Handoff":"On the clock"),n){let y=j[n.absent],i=v.entries.find(b=>b.team.includes(y.id)&&b.start<=n.t&&n.t<b.end);if(i){let b=c.entries.find(P=>P.job.id===i.job.id&&!P.interrupted&&P.start>=n.t),H=Math.round((n.t-i.start)/(i.end-i.start)*100);T("decision",y.name+" answers the radio at "+k(n.t)+". "+(i.job.id==="rack"?"The rack is "+H+"% across the stage. ":i.job.name+" is "+H+"% complete. ")+N(b)+" "+(b.team.length===1?"resumes":"resume")+" at "+k(b.start)+"."+(i.job.id==="rack"?" Both are trained rack handlers.":""))}else T("decision",y.name+" is unavailable from "+k(n.t)+" to "+k(n.until)+". The planner schedules the remaining work from each person\u2019s current position.")}else{let y=v.entries.find(b=>b.job.id==="rack"),i=v.entries.find(b=>b.job.id==="feed");T("decision",N(y)+" move the rack. "+N(i)+" sets up power. Interrupt one crew member to compare the two schedules.")}}let Y=Number(d("who").value);d("who").title=j[Y].skills.map(w=>ue[w]).join(", "),W!==C&&(W=C,d("gantt").innerHTML=j.map((w,y)=>'<div class="report-row"><b>'+w.name+'</b><div class="work-track">'+c.tracks[y].filter(i=>i.kind==="work"||i.kind==="away").map(i=>'<i class="'+i.kind+'" style="left:'+100*i.start/q()+"%;width:"+100*(i.end-i.start)/q()+'%" title="'+(i.kind==="away"?"Called away":c.jobs.find(b=>b.id===i.task).name)+" \xB7 "+k(i.start)+" to "+k(i.end)+'"></i>').join("")+"<em></em></div></div>").join(""));for(let w of d("gantt").querySelectorAll("em"))w.style.left=a/q()*100+"%"}Me(d("world")).then(a=>{Te=a,I.open()}).catch(I.fail);
