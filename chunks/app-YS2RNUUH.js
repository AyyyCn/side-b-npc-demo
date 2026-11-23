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
import{a as j,b as F,c as p,d as A,e as se,f as W,g as je,h as f,i as w,j as P,k as ze}from"./chunk-OSKQ7EJO.js";import"./chunk-O3A6BAD2.js";import{D as G,N as be,O as oe,R as ke,qa as we,t as ue}from"./chunk-UAW4QEMP.js";import{a as E,b as ge,c as C,d as ve,e as ye,f as xe,g as u,h as Me,i as D,j as V,k as Y,l as ne,m as ae}from"./chunk-6DELKLQG.js";import"./chunk-PQNXGCHF.js";import{c as re,f as Te}from"./chunk-DNQ3AYLV.js";import"./chunk-EJRCZQV5.js";import"./chunk-KXWL3TAT.js";var Ce={esme:{rig:"maya",height:1.7,top:"#d9b979",yaw:0},wes:{rig:"sam",height:1.8,top:"#637f88",yaw:0},nina:{rig:"harper",height:1.67,top:"#a2849a",yaw:0},maya:{rig:"jordan",height:1.76,top:"#7e9478",yaw:0}};async function Pe(s){let a=await je(s,Ce,!1),o=a.scene,i=j("#b4bdc3",.33,.79),g=j("#24272a"),pe=j("#474d50",.48,.45),S=j("#c5a062"),$=j("#612c35",.98),v=j("#263b40",.63,.3),M=j("#393934",.89,.1);p(o,M,0,-.12,0,17,.24,11);let d=j("#262a27"),k=j("#4b4b40");for(let e=-3.3;e<5.4;e+=.66){p(o,d,0,.003,e,17,.005,.012);for(let t=-7+Math.round(e*10)%2*.57;t<8;t+=2.65)p(o,d,t,.004,e+.33,.01,.006,.66),p(o,k,t+.029,.008,e+.038,.027,.004,.02)}p(o,g,-7.05,2.1,.2,.16,4.25,7.3);for(let e=-2.5;e<3.8;e+=.18)p(o,j("#302d30"),-6.95,1.96,e,.13,3.96,.074);for(let e of[-5.48,5.48])for(let t of[-2.7,-2.37]){A(o,i,[e,.1,t],[e,3.24,t],.05);for(let c=.12;c<2.9;c+=.41)A(o,i,[e,c,t],[e+.19,c+.28,t],.018)}p(o,g,0,2,-3.33,14,4.2,.25);let R=new ke(14,4.1,180,3),L=R.attributes.position;for(let e=0;e<L.count;e++)L.setZ(e,.12*Math.cos(L.getX(e)*8.8)+.035*Math.cos(L.getX(e)*17.6));R.computeVertexNormals();let ee=new G(R,$);ee.position.set(0,2.02,-3.02),ee.receiveShadow=!0,o.add(ee);for(let e of[-2.7,-2.37])for(let t of[2.91,3.24])A(o,i,[-6.2,t,e],[6.2,t,e],.036);for(let e=-6;e<=6;e+=.48)A(o,i,[e,2.91,-2.36],[e+.48,3.24,-2.36],.019),A(o,i,[e,3.24,-2.36],[e+.48,2.91,-2.36],.019);let Se=new oe(.13,.16,.36,16);for(let e=0;e<7;e++){let t=-5.4+e*1.8,c=new G(Se,g);c.position.set(t,2.79,-2.33),c.rotation.x=.58,o.add(c),A(o,i,[t,3.04,-2.45],[t,2.84,-2.34]);let n=new G(new be(.13,24),F(e%2?"#eebd83":"#8cbfc5"));n.position.set(t,2.63,-2.41),n.rotation.x=-1.06,o.add(n)}function H(e,t,c,n,r,h,T){let b=new ue;e.add(b),b.position.set(t,0,c),p(b,v,0,r/2+.15,0,n,r,h);for(let y of[.16,.16+r,.16+r*.77]){p(b,i,0,y,h/2,n+.025,.028,.028),p(b,i,0,y,-h/2,n+.025,.028,.028);for(let m of[-1,1])p(b,i,m*n/2,y,0,.028,.028,h)}for(let y of[-1,1])for(let m of[-1,1]){p(b,i,y*n*.5,.16+r*.5,m*h*.5,.026,r,.026);for(let K of[.19,.13+r])p(b,i,y*(n/2-.012),K,m*(h/2-.012),.075,.073,.075);let I=new G(new oe(.081,.081,.056,12),g);I.rotation.z=Math.PI/2,I.position.set(y*(n/2-.11),.073,m*(h/2-.1)),b.add(I)}for(let y of[-1,1])p(b,g,y*n*.29,.16+r*.6,h*.5+.015,.12,.13,.022),p(b,i,y*n*.29,.16+r*.61,h*.5+.029,.07,.044,.012);return T&&se(b,T,0,.16+r*.42,h/2+.021,n*.66,r*.22,"#f0dfb7","#344448"),b}let Z=H(o,0,0,u.halfX*2,.9,u.halfZ*2,"PA  /  04");for(let e of[-1,1]){let t=e*(u.halfZ-.055);A(Z,i,[-u.halfX,.92,t],[u.barX,u.barY,t],.027)}A(Z,i,[u.barX,u.barY,-.61],[u.barX,u.barY,.61],.029),p(Z,g,.045,.76,-u.halfZ,.45,.23,.035);for(let e of[-.08,.04,.16])p(Z,i,e,.8,-u.halfZ-.023,.063,.072,.029);H(o,.05,-1.96,1.24,.82,.5,"SHOW CONTROL"),H(o,-4.7,-2.15,1.06,.82,.58,"PATCH"),H(o,-3.47,-2.23,1.1,.68,.66),H(o,4.47,-2.28,1.1,.64,.58),H(o,5.45,-2.2,.72,1.45,.8,"PA");for(let e of[-2.1,2.12]){let t=H(o,e,-2.15,1.1,.81,.71,e<0?"POWER":"LX");for(let c=0;c<9;c++)p(t,c%3===0?F("#97c4a1"):g,-.39+c*.096,1,.02,.034,.025,.17)}let Le=se(o,"SIDE B    /    STAGE LEFT",-.58,2.06,-2.83,3.35,.39,"#ede2c9","#352d32");Le.rotation.x=-.018;for(let e of[-1,1])for(let t=-4.45;t<2.26;t+=.52)p(o,S,t,.008,.74+e*.83,.26,.008,.028);for(let e of[1.24,2.55])for(let t of[.17,1.31])p(o,S,e,.012,t,.21,.011,.033),p(o,S,e,.012,t,.033,.011,.21);W(o,14789756,90,[-3,3.6,.2],[-1,.4,0]),W(o,9553375,88,[3.4,3.4,-.9],[1.5,.6,.7]),W(o,14582912,62,[-2.5,.5,-2.4],[-.9,2,-3]);let Ee=p(o,F("#557c60"),1.76,.89,-1.8,.19,.06,.025),fe,me,he=(e,t,c)=>{let n=D(e,t,c),r=n.kind==="work"&&n.part.task==="rack",h=n.part?.task,T;return r||h==="rack"&&n.kind==="standby"?T=Math.PI/2:(n.kind==="work"||n.kind==="standby")&&(T=h==="sound"?0:Math.PI),{...n,pushing:r,facing:T}};function te(e,t,c,n){return[0,.65,1.3,1.95].reduce((r,h)=>r+(n(D(e,t,Math.max(0,c-h)))?.25:0),0)}return(e,t)=>{if(e!==fe){fe=e;let n=Math.max(e.end,...e.tracks.map(r=>r.at(-1)?.end??0));me=C.map(r=>we(n,h=>he(e,r.id,h),Math.PI/2))}let c=V(e,t);Z.position.set(c.x,0,c.z);for(let n of C){let r=he(e,n.id,t),h=me[n.id](t),T=[],b=te(e,n.id,t,m=>m.kind==="work"&&m.part.task==="rack"),y=te(e,n.id,t,m=>m.kind==="away");if(b){let m=r.z<c.z?-u.stanceZ:u.stanceZ;T.push(["l",c.x+u.barX,u.barY,c.z+m-.15,b],["r",c.x+u.barX,u.barY,c.z+m+.15,b])}if(y){let m=h.yaw;T.push(["r",r.x-.15*Math.cos(m)+.075*Math.sin(m),Ce[n.person.key].height*.88,r.z+.15*Math.sin(m)+.075*Math.cos(m),y])}else if(r.kind==="work"&&r.part.task!=="rack"){let m=r.part.task==="sound"?1:-1,I=te(e,n.id,t,K=>K.kind==="work"&&K.part.task===r.part.task);T.push(["r",r.x-m*.14,.95+.018*Math.sin(t*.25),r.z+m*.43,I*.9])}a.pose(n.person.key,r,h,t,T)}return Ee.material.color.set(Y(e,"lights",t).done?"#a5ffb5":"#665741"),a.render([2.85,3.05,7.65],[-.58,1.02,-.29],36.3),a.project(c.x,1.13,c.z)}}var Q=new URLSearchParams(location.search),z=ye(Q),ie=Q.get("archive"),ce=re.find(s=>s.id===Q.get("bin"))??re[2],q=["open","closed"].includes(ie)?Te(ie==="closed",ce.id):null,O=Q.get("run")==="altered"?"altered":"original",x,l,B,Ae,J="",U="";function Oe(){x=Me(xe(z[O],q?.end??0)),l=x,B=null,J=U=""}Oe();P("lab-title","Crew coordination");P("premise","Call a stagehand on the radio mid-transfer. Can the crew still open the doors on time?");P("experiment","The opening cue");var de=f("related");de.hidden=!1;de.href="?crowd&seed="+z.seed+"&hold="+z.hold;de.textContent="See the crowd that booked this hall \u2197";f("fields").innerHTML='<label>Audience<select id="attendance"><option value="original">Original crowd \xB7 '+z.original+'</option><option value="altered">Interrupted crowd \xB7 '+z.altered+'</option></select></label><label>Radio recipient<select id="who">'+C.map(s=>'<option value="'+s.id+'">'+s.name+" \xB7 "+s.title+"</option>").join("")+'</select></label><label>Absence<select id="duration"><option value="60">6 seconds</option><option value="120" selected>12 seconds</option><option value="200">20 seconds</option></select></label>';f("attendance").value=O;f("who").value=1;f("actions").innerHTML='<button id="apply" class="main-action">Make radio call</button><button id="restore">Reset plan</button>';f("under").innerHTML='<h3>Crew schedule</h3><div id="gantt"></div><p class="proof-note">Solid bars show assigned work. Stripes mark the absence. The line follows the replay.</p>';f("details").innerHTML='<h3 id="decision-title">Current work</h3><p class="notes" id="decision"></p><p class="proof-note" id="order"></p><p class="proof-note interactive"><a id="to-archive">Open the record search \u2197</a></p>';var X=s=>s.team.map(a=>C[a].name).join(" and "),_=()=>Math.max(E,l.end,B?.end??0),N=ze({initial:ae(x),limit:_,draw:Re,describe:He});function le(){Oe(),N.jump(ae(x))}f("attendance").onchange=s=>{O=s.target.value,le()};f("restore").onclick=le;f("who").onchange=f("duration").onchange=()=>{l.incident?le():N.paint()};f("apply").onclick=()=>{let s=Math.floor(N.tick);if(s>=x.end||l.incident)return;let a=Number(f("who").value),o=Number(f("duration").value);l=ne(x,s,a,o),B=ne(x,s,a,o,{keepTeams:!0}),J=U="",N.jump(s,!0)};function He(s){let a=Y(l,"rack",s),o=l.incident;return{mode:"crew",recordReady:q?.end??0,audience:z[O],run:O,seed:z.seed,doors:E,baseEnd:x.end,finish:l.end,keptTeamsEnd:B?.end??null,incident:o??null,rack:{position:V(l,s),worked:a.worked,total:a.total,team:a.current?X(a.current):null},jobs:l.jobs.map(i=>i.id),assignments:l.entries.map(i=>({id:i.job.id,team:X(i),start:i.start,end:i.end})),crew:C.map(i=>{let g=D(l,i.id,s);return{name:i.name,x:g.x,z:g.z,activity:g.kind,skills:i.skills}})}}function Re(s){Ae(l,s);let a=l.incident,o=Y(l,"rack",s),i=Math.round(100*o.worked/o.total),g=l.entries.filter(v=>v.start<=s&&s<v.end),pe=s>=l.end?"Opening cue complete":o.current?X(o.current)+" move the PA rack":!o.done&&i>0?"PA rack parked at "+i+"%":g.length?g.map(v=>v.job.short).join("  \xB7  "):"Crew moving into position";P("scene-caption",pe),f("apply").disabled=!!a||Math.floor(s)>=x.end;let S=O+"/"+(a?[a.t,a.absent,a.until].join("-"):"base");if(S!==J){J=S;let v=a?[[w(B.end),"Keep original teams"],[w(l.end),"Reassign the crew"]]:[[w(x.end),"Planned opening cue"],[w(E),"Doors open"]];if(f("result").innerHTML='<div class="metrics">'+v.map(([M,d])=>'<div class="metric"><strong>'+M+"</strong><span>"+d+"</span></div>").join("")+"</div><p>"+(a?l.end<=E?"Replanned crew makes doors by "+w(E-l.end)+".":"Opening runs "+w(l.end-E)+" past doors.":"Doors are set for "+w(E)+". Each job needs the right skills and a crew member on site.")+"</p>",f("to-archive").href="?perception&seed="+z.seed+"&hold="+z.hold+"&run="+O+"&screen="+(ie??"closed")+"&bin="+ce.id,P("order",z[O]+" guests in East Hall. "+(z[O]>=ge?"The work order includes a second speaker zone.":"One speaker zone covers this audience.")+(q?" The reference sleeve arrives from "+ce.name+" at "+w(q.end)+" for the main sound check.":"")),P("decision-title",a?"Handoff":"On the clock"),a){let M=C[a.absent],d=x.entries.find(k=>k.team.includes(M.id)&&k.start<=a.t&&a.t<k.end);if(d){let k=l.entries.find(L=>L.job.id===d.job.id&&!L.interrupted&&L.start>=a.t),R=Math.round((a.t-d.start)/(d.end-d.start)*100);P("decision",M.name+" answers the radio at "+w(a.t)+". "+(d.job.id==="rack"?"The rack is "+R+"% across the stage. ":d.job.name+" is "+R+"% complete. ")+X(k)+" "+(k.team.length===1?"resumes":"resume")+" at "+w(k.start)+"."+(d.job.id==="rack"?" Both are trained rack handlers.":""))}else P("decision",M.name+" is unavailable from "+w(a.t)+" to "+w(a.until)+". The planner schedules the remaining work from each person\u2019s current position.")}else{let M=x.entries.find(k=>k.job.id==="rack"),d=x.entries.find(k=>k.job.id==="feed");P("decision",X(M)+" move the rack. "+X(d)+" sets up power. Interrupt one crew member to compare the two schedules.")}}let $=Number(f("who").value);f("who").title=C[$].skills.map(v=>ve[v]).join(", "),U!==S&&(U=S,f("gantt").innerHTML=C.map((v,M)=>'<div class="report-row"><b>'+v.name+'</b><div class="work-track">'+l.tracks[M].filter(d=>d.kind==="work"||d.kind==="away").map(d=>'<i class="'+d.kind+'" style="left:'+100*d.start/_()+"%;width:"+100*(d.end-d.start)/_()+'%" title="'+(d.kind==="away"?"Called away":l.jobs.find(k=>k.id===d.task).name)+" \xB7 "+w(d.start)+" to "+w(d.end)+'"></i>').join("")+"<em></em></div></div>").join(""));for(let v of f("gantt").querySelectorAll("em"))v.style.left=s/_()*100+"%"}Pe(f("world")).then(s=>{Ae=s,N.open()}).catch(N.fail);
