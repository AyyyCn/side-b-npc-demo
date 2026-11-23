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
import{e as Q,f as V,g as tt,l as et,m as ot}from"./chunk-PQNXGCHF.js";import{b as R}from"./chunk-EJRCZQV5.js";var H=10,wt=260,nt=24,O={dock:{x:-4,z:.74},stage:{x:1.9,z:.74},audio:{x:1.94,z:-.34},patch:{x:-2.08,z:-1.46},lights:{x:2.12,z:-1.48},wing:{x:4.47,z:-1.4},booth:{x:.05,z:-1.1}},K=[{person:R.esme,title:"Sound engineer",skills:["sound","move"],home:{x:-5.49,z:1.42},park:{x:-4.9,z:3.15},pace:1.65},{person:R.wes,title:"Stagehand",skills:["move","power"],home:{x:-5.5,z:.02},park:{x:-5.72,z:-.88},pace:1.55},{person:R.nina,title:"Stage manager",skills:["move","cue","power"],home:{x:-1.5,z:-1.25},park:{x:-3.55,z:-1.3},pace:1.62},{person:R.maya,title:"Show technician",skills:["lights","sound","cue"],home:{x:2.65,z:-1.21},park:{x:3.38,z:-1.26},pace:1.52}].map((t,e)=>({...t,id:e,name:t.person.name})),jt={move:"rack handling",power:"power",sound:"audio",lights:"lighting",cue:"show control"};function Mt(t){let e=t.get("seed"),o=e&&/^\d{1,10}$/.test(e)&&Number(e)<=4294967295?Number(e):V,n=t.get("hold"),i=n!==null&&/^\d{1,2}$/.test(n)&&Number(n)<Q?Number(n):tt,c=et(o);return{seed:o,hold:i,messenger:c.checkpoint.guests[i].name,original:c.finalHalls.filter(s=>s===1).length,altered:ot(c,i,!1).east}}function Et(t,e=0){let o=[{id:"rack",name:"Move PA rack",short:"Move rack",roles:["move","move"],from:O.dock,to:O.stage,ticks:70,after:[]},{id:"feed",name:"Set up power",short:"Power",roles:["power"],from:O.patch,ticks:54,after:[]},{id:"lights",name:"Focus house lights",short:"Lights",roles:["lights"],from:O.lights,ticks:58,after:["feed"]},{id:"sound",name:"Patch main sound",short:"Sound",release:e,roles:["sound"],from:O.audio,ticks:48,after:["rack","feed"]}];return t>=nt&&o.push({id:"zone",name:"Open second speaker zone",short:"Zone two",roles:["sound"],from:O.wing,ticks:46,after:["sound"]}),o.push({id:"cue",name:"Run opening cue",short:"Opening cue",roles:["cue","sound"],from:O.booth,ticks:37,after:["lights",t>=nt?"zone":"sound"]}),o.map(n=>({...n,to:n.to??n.from}))}var X={halfX:.48,halfZ:.62,stanceX:1.05,stanceZ:.43,barX:-.61,barY:1.045},Y=.59,rt=.3,ut={left:-6.45,right:5.55,back:-1.48,front:3.52},I=(t,e)=>Math.hypot(t.x-e.x,t.z-e.z);function y(t,e,o,n){return n==="rack"?{x:t.x-X.stanceX,z:t.z+(o===0?-X.stanceZ:X.stanceZ)}:e===2?{x:t.x+(o===0?-.44:.44),z:t.z}:{...t}}function L(t,e=t,o=0,n=o){return{left:Math.min(t.x,e.x)-o,right:Math.max(t.x,e.x)+o,back:Math.min(t.z,e.z)-n,front:Math.max(t.z,e.z)+n}}var J=(t,e=t)=>L(t,e,X.halfX+rt,X.halfZ+rt),A=(t,e)=>t.x>e.left&&t.x<e.right&&t.z>e.back&&t.z<e.front;function lt(t,e,o){let n=0,i=1;for(let[c,s,f,l]of[[t.x,e.x-t.x,o.left,o.right],[t.z,e.z-t.z,o.back,o.front]]){if(Math.abs(s)<1e-10){if(c<=f||c>=l)return!1;continue}let j=(f-c)/s,k=(l-c)/s;if(n=Math.max(n,Math.min(j,k)),i=Math.min(i,Math.max(j,k)),i-n<1e-9)return!1}return!0}function st(t,e,o,n){let i=(p,b)=>o.every(h=>!lt(p,b,h)),c=p=>{let b=I(t,p);return b<=n?p:{x:t.x+(p.x-t.x)*n/b,z:t.z+(p.z-t.z)*n/b}};if(I(t,e)<1e-6)return t;if(i(t,e))return c(e);if(o.some(p=>A(e,p)))return t;let s=[t,e],f=.022;for(let p of o)for(let b of[p.left-f,p.right+f])for(let h of[p.back-f,p.front+f]){let z={x:b,z:h};A(z,ut)&&!o.some(m=>A(z,m))&&s.push(z)}let l=s.map(()=>1/0),j=s.map(()=>-1),k=new Set;for(l[1]=0;;){let p=-1,b=1/0;for(let h=0;h<s.length;h++)!k.has(h)&&l[h]<b&&(p=h,b=l[h]);if(p===-1)return t;if(p===0)return c(s[j[0]]);k.add(p);for(let h=0;h<s.length;h++){if(k.has(h))continue;let z=b+I(s[p],s[h]);z>=l[h]||!i(s[p],s[h])||(l[h]=z,j[h]=p)}}}var pt=(t,e,o)=>({x:t.x+(e.x-t.x)*o,z:t.z+(e.z-t.z)*o}),it=(t,e)=>[J(t,e),...[0,1].map(o=>L(y(t,2,o,"rack"),y(e,2,o,"rack"),Y))];function ht(t,e,o,n,i,c){let s=t.at(-1);if(s?.kind===c&&s.task===i&&s.end===e){let f=s.end-s.start;if(Math.abs((s.to.x-s.from.x)/f-(n.x-o.x))<1e-7&&Math.abs((s.to.z-s.from.z)/f-(n.z-o.z))<1e-7){s.end++,s.to=n;return}}t.push({start:e,end:e+1,from:o,to:n,task:i,kind:c})}function $(t,e,{start:o=0,initial:n=t.map(l=>l.home),rack:i=O.dock,finished:c={},active:s=[],incident:f}={}){let l=t.map(u=>e.filter(w=>w.team.includes(u.id)).sort((w,E)=>w.start-E.start)),j=e.slice(),k=s.slice(),p={...c},b=[],h=t.map(()=>[]),z=n.slice(),m=o,M=Math.max(o,f?.until??0,...e.map(u=>u.job.release??0))+e.reduce((u,w)=>u+w.job.ticks,0)+1200;for(let u=o;u<=M;u++){for(let a=k.length-1;a>=0;a--){let d=k[a];d.end===u&&(p[d.job.id]=u,k.splice(a,1))}if(!j.length&&!k.length&&(!f||u>=f.until))return{entries:b,tracks:h};let w=a=>f?.absent===a&&u<f.until,E=a=>k.find(d=>d.team.includes(a));for(let a=j.length-1;a>=0;a--){let d=j[a],N=d.job;if(u<(N.release??0)||!N.after.every(S=>p[S]!==void 0&&p[S]<=u)||!d.team.every((S,Z)=>!w(S)&&!E(S)&&l[S][0]===d&&I(z[S],y(N.from,d.team.length,Z,N.id))<1e-6)||N.id==="rack"&&z.some((S,Z)=>!d.team.includes(Z)&&it(i,N.to).some(F=>A(S,F))))continue;let _={...d,start:u,end:u+N.ticks};k.push(_),b.push(_),j.splice(a,1),d.team.forEach(S=>l[S].shift()),m=u}let r=k.find(a=>a.job.id==="rack"),v=r?pt(r.from,r.to,(u+1-r.start)/(r.end-r.start)):i,x=r??j.find(a=>a.job.id==="rack"),g=x?it(i,x.to):[],P=z.slice(),D=t.map(()=>({kind:"idle",task:null}));for(let[a]of t.entries()){let d=E(a);d&&(D[a]={kind:"work",task:d.job.id},d===r&&(P[a]=y(v,2,d.team.indexOf(a),"rack")))}let dt=t.map(a=>a.id).sort((a,d)=>Number(w(d))-Number(w(a))||a-d);for(let a of dt){if(E(a))continue;let d=t[a],N=z[a],_=l[a][0],S=w(a),Z=_&&!S,F=Z?y(_.job.from,_.team.length,_.team.indexOf(a),_.job.id):d.park,B=[J(i,v)];for(let C of t)C.id!==a&&B.push(L(z[C.id],P[C.id],Y));x&&!x.team.includes(a)&&(g.some(C=>A(F,C))&&(F=d.park),g.some(C=>A(N,C))||B.push(...g)),u-m>36&&B.some(C=>A(F,C))&&I(N,d.park)>.01&&(F=d.park),P[a]=st(N,F,B,d.pace/H),D[a]={kind:S?"away":I(N,P[a])>1e-6?"walk":Z?"standby":"idle",task:Z?_.job.id:null}}for(let a of t){let d=a.id;ht(h[d],u,z[d],P[d],D[d].task,D[d].kind)}z=P,i=v}throw Error("No clear approach to "+j.map(u=>u.job.id).join(", ")+" from "+JSON.stringify(z))}var ct=(t,e,o)=>Math.max(e,Math.min(o,t)),T=t=>({x:t.x,z:t.z}),mt=(t,e,o)=>({x:t.x+(e.x-t.x)*o,z:t.z+(e.z-t.z)*o}),xt=(t,e,o)=>Math.ceil(Math.hypot(e.x-t.x,e.z-t.z)*H/o-1e-9);function kt(t,e){let o=[];function n(i){if(i.length===t.length){o.push(i);return}for(let c of e)!i.includes(c.id)&&c.skills.includes(t[i.length])&&n([...i,c.id])}return n([]),o}function at(t,e,o,n,i,c){let s=new Map(i.map(k=>[k.id,c?[c.get(k.id)]:kt(k.roles,e)])),f=null,l=1/0;function j(k,p,b,h){if(!k.length){let m=Math.max(0,...Object.values(b));m<l&&(l=m,f=h);return}let z=[];for(let m of k)if(m.after.every(M=>b[M]!==void 0))for(let M of s.get(m.id)){let u=M.map((r,v)=>{let x=p[r],g=y(m.from,M.length,v,m.id);return{id:r,from:x.at,to:g,depart:x.free,arrive:x.free+xt(x.at,g,e[r].pace)}}),w=Math.max(m.release??0,...m.after.map(r=>b[r]),...u.map(r=>r.arrive)),E=w+m.ticks;E<l&&z.push({job:m,team:M,moves:u,start:w,end:E,from:m.from,to:m.to})}z.sort((m,M)=>m.end-M.end);for(let m of z){let{job:M,team:u,end:w}=m;if(w>=l)continue;let E={...b,[M.id]:w},r={...E};for(let x of t)r[x.id]===void 0&&(r[x.id]=Math.max(x.release??0,...x.after.map(g=>r[g]))+(k.find(g=>g.id===x.id)?.ticks??x.ticks));if(Math.max(...Object.values(r))>=l)continue;let v=p.slice();u.forEach((x,g)=>{v[x]={free:w,at:y(M.to,u.length,g,M.id)}}),j(k.filter(x=>x.id!==M.id),v,E,[...h,m])}}if(j(i,o,n,[]),!f)throw Error("No feasible team can complete the remaining jobs.");return f}function G(t,e,o,n,i,c){return{start:t,end:e,from:o,to:n,task:i,kind:c}}function ft(t,e){let o=e.map(()=>[]);for(let n of t)for(let[i,c]of n.team.entries()){let s=n.moves[i],f=o[c];s.arrive>s.depart&&f.push(G(s.depart,s.arrive,s.from,s.to,n.job.id,"walk")),n.start>s.arrive&&f.push(G(s.arrive,n.start,s.to,s.to,n.job.id,"standby")),f.push(G(n.start,n.end,s.to,y(n.to,n.team.length,i,n.job.id),n.job.id,"work"))}return o.map(n=>n.sort((i,c)=>i.start-c.start))}function W(t,e,o,n){return{jobs:t,members:e,entries:o.slice().sort((i,c)=>i.start-c.start),tracks:n,end:Math.max(...o.map(i=>i.end))}}function Dt(t,e=K){let o=at(t,e,e.map(n=>({free:0,at:n.home})),{},t);if(e===K){let n=$(e,o);return W(t,e,n.entries,n.tracks)}return W(t,e,o,ft(o,e))}function U(t,e){return mt(t.from,t.to,ct((e-t.start)/(t.end-t.start||1),0,1))}function q(t,e,o){let n=t.members[e].home,i=null;for(let c of t.tracks[e]){if(o<c.start)break;if(o<c.end)return{...U(c,o),part:c,kind:c.kind};n=c.to,i=c}return{...n,kind:"idle",part:i}}function gt(t,e){let o=O.dock;for(let n of t.entries)if(!(n.job.id!=="rack"||n.start>e)){if(e<n.end)return U(n,e);o=n.to}return T(o)}function Zt(t,e,o){let n=t.entries.filter(f=>f.job.id===e),i=t.jobs.find(f=>f.id===e),c=n.reduce((f,l)=>f+ct(o-l.start,0,l.end-l.start),0),s=n.find(f=>f.start<=o&&o<f.end);return{worked:c,total:i.ticks,current:s,done:c>=i.ticks}}function zt(t,e,o,n,{keepTeams:i=!1}={}){if(!Number.isInteger(e)||e<0||e>=t.end||!t.members[o]||!Number.isInteger(n)||n<1)throw RangeError("Choose an active show tick, a crew member and a positive absence.");let{jobs:c,members:s}=t,f={},l=[],j=new Map,k=s.map((r,v)=>({free:e+(o===v?n:0),at:T(q(t,v,e))}));for(let r of t.entries){if(r.end<=e){f[r.job.id]=r.end,l.push(r);continue}if(!(r.start>e))if(!r.team.includes(o))f[r.job.id]=r.end,l.push(r),r.team.forEach((v,x)=>{k[v]={free:r.end,at:y(r.to,r.team.length,x,r.job.id)}});else{let v=U(r,e);e>r.start&&l.push({...r,end:e,to:v,interrupted:!0}),j.set(r.job.id,{...r.job,from:v,ticks:r.end-e})}}let p=c.filter(r=>f[r.id]===void 0).map(r=>j.get(r.id)??r),b=i?new Map(t.entries.map(r=>[r.job.id,r.team])):null,h=at(c,s,k,f,p,b),z={t:e,absent:o,until:e+n},m=s===K,M=l.filter(r=>r.end>e),u=m?$(s,h,{start:e,initial:s.map(r=>T(q(t,r.id,e))),rack:gt(t,e),finished:f,active:M,incident:z}):{entries:h,tracks:ft(h,s)},w=t.tracks.map((r,v)=>{let x=[];for(let g of r){if(g.start>e)break;let P=!m&&g.kind==="work"&&M.some(D=>D.job.id===g.task&&D.team.includes(v));g.end<=e||P?x.push(g):g.start<e&&x.push({...g,end:e,to:U(g,e)})}if(!m&&v===o){let g=T(q(t,v,e));x.push(G(e,z.until,g,g,null,"away"))}return[...x,...u.tracks[v]]}),E={...W(c,s,[...l,...u.entries],w),incident:z};if(m&&!i){let r=zt(t,e,o,n,{keepTeams:!0});if(r.end<E.end)return r}return E}function Ft(t){let e=t.entries.find(o=>o.job.id==="rack");return e.start+Math.floor((e.end-e.start)/2)}export{wt as a,nt as b,K as c,jt as d,Mt as e,Et as f,X as g,Dt as h,q as i,gt as j,Zt as k,zt as l,Ft as m};
