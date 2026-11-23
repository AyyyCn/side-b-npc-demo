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
import{e as _,f as A,k as D,l as P}from"./chunk-TPG5SM4J.js";import{b as w}from"./chunk-EJRCZQV5.js";var F=10,B=260,y=24,x={dock:{x:-4,z:.74},stage:{x:1.9,z:.74},patch:{x:-2.08,z:-1.51},lights:{x:2.12,z:-1.48},wing:{x:4.2,z:-.32},booth:{x:.05,z:-1.1}},I=[{person:w.esme,title:"Sound engineer",skills:["sound","move"],home:{x:-4.4,z:1.48},pace:1.65},{person:w.wes,title:"Stagehand",skills:["move","power"],home:{x:-4.55,z:.04},pace:1.55},{person:w.nina,title:"Stage manager",skills:["move","cue","power"],home:{x:-1.5,z:-1.27},pace:1.62},{person:w.maya,title:"Show technician",skills:["lights","sound","cue"],home:{x:2.65,z:-1.21},pace:1.52}].map((t,e)=>({...t,id:e,name:t.person.name})),G={move:"rack handling",power:"power",sound:"audio",lights:"lighting",cue:"show control"};function Q(t){let e=t.get("seed"),n=e&&/^\d{1,10}$/.test(e)&&Number(e)<=4294967295?Number(e):A,o=t.get("hold"),i=o!==null&&/^\d{1,2}$/.test(o)&&Number(o)<_?Number(o):w.esme.index,s=D(n);return{seed:n,hold:i,messenger:s.checkpoint.guests[i].name,original:s.finalHalls.filter(c=>c===1).length,altered:P(s,i,!1).east}}function V(t,e=0){let n=[{id:"rack",name:"Move PA rack",short:"Move rack",roles:["move","move"],from:x.dock,to:x.stage,ticks:70,after:[]},{id:"feed",name:"Set up power",short:"Power",roles:["power"],from:x.patch,ticks:54,after:[]},{id:"lights",name:"Focus house lights",short:"Lights",roles:["lights"],from:x.lights,ticks:58,after:["feed"]},{id:"sound",name:"Patch main sound",short:"Sound",release:e,roles:["sound"],from:x.stage,ticks:48,after:["rack","feed"]}];return t>=y&&n.push({id:"zone",name:"Open second speaker zone",short:"Zone two",roles:["sound"],from:x.wing,ticks:46,after:["sound"]}),n.push({id:"cue",name:"Run opening cue",short:"Opening cue",roles:["cue","sound"],from:x.booth,ticks:37,after:["lights",t>=y?"zone":"sound"]}),n.map(o=>({...o,to:o.to??o.from}))}var K=(t,e,n)=>Math.max(e,Math.min(n,t)),N=t=>({x:t.x,z:t.z}),U=(t,e,n)=>({x:t.x+(e.x-t.x)*n,z:t.z+(e.z-t.z)*n}),$=(t,e,n)=>Math.ceil(Math.hypot(e.x-t.x,e.z-t.z)*F/n-1e-9);function O(t,e,n,o){return e===1?N(t):o==="rack"?{x:t.x,z:t.z+(n===0?-.58:.58)}:{x:t.x+(n===0?-.42:.42),z:t.z}}function J(t,e){let n=[];function o(i){if(i.length===t.length){n.push(i);return}for(let s of e)!i.includes(s.id)&&s.skills.includes(t[i.length])&&o([...i,s.id])}return o([]),n}function Z(t,e,n,o,i,s){let c=new Map(i.map(k=>[k.id,s?[s.get(k.id)]:J(k.roles,e)])),d=null,m=1/0;function z(k,j,b,M){if(!k.length){let f=Math.max(0,...Object.values(b));f<m&&(m=f,d=M);return}let v=[];for(let f of k)if(f.after.every(p=>b[p]!==void 0))for(let p of c.get(f.id)){let r=p.map((a,S)=>{let l=j[a],g=O(f.from,p.length,S,f.id);return{id:a,from:l.at,to:g,depart:l.free,arrive:l.free+$(l.at,g,e[a].pace)}}),u=Math.max(f.release??0,...f.after.map(a=>b[a]),...r.map(a=>a.arrive)),h=u+f.ticks;h<m&&v.push({job:f,team:p,moves:r,start:u,end:h,from:f.from,to:f.to})}v.sort((f,p)=>f.end-p.end);for(let f of v){let{job:p,team:r,end:u}=f;if(u>=m)continue;let h={...b,[p.id]:u},a={...h};for(let l of t)a[l.id]===void 0&&(a[l.id]=Math.max(l.release??0,...l.after.map(g=>a[g]))+(k.find(g=>g.id===l.id)?.ticks??l.ticks));if(Math.max(...Object.values(a))>=m)continue;let S=j.slice();r.forEach((l,g)=>{S[l]={free:u,at:O(p.to,r.length,g,p.id)}}),z(k.filter(l=>l.id!==p.id),S,h,[...M,f])}}if(z(i,n,o,[]),!d)throw Error("No feasible team can complete the remaining jobs.");return d}function E(t,e,n,o,i,s){return{start:t,end:e,from:n,to:o,task:i,kind:s}}function H(t,e){let n=e.map(()=>[]);for(let o of t)for(let[i,s]of o.team.entries()){let c=o.moves[i],d=n[s];c.arrive>c.depart&&d.push(E(c.depart,c.arrive,c.from,c.to,o.job.id,"walk")),o.start>c.arrive&&d.push(E(c.arrive,o.start,c.to,c.to,o.job.id,"standby")),d.push(E(o.start,o.end,c.to,O(o.to,o.team.length,i,o.job.id),o.job.id,"work"))}return n.map(o=>o.sort((i,s)=>i.start-s.start))}function L(t,e,n,o){return{jobs:t,members:e,entries:n.slice().sort((i,s)=>i.start-s.start),tracks:o,end:Math.max(...n.map(i=>i.end))}}function Y(t,e=I){let n=Z(t,e,e.map(o=>({free:0,at:o.home})),{},t);return L(t,e,n,H(n,e))}function C(t,e){return U(t.from,t.to,K((e-t.start)/(t.end-t.start||1),0,1))}function R(t,e,n){let o=t.members[e].home,i=null;for(let s of t.tracks[e]){if(n<s.start)break;if(n<s.end)return{...C(s,n),part:s,kind:s.kind};o=s.to,i=s}return{...o,kind:"idle",part:i}}function ee(t,e){let n=x.dock;for(let o of t.entries)if(!(o.job.id!=="rack"||o.start>e)){if(e<o.end)return C(o,e);n=o.to}return N(n)}function te(t,e,n){let o=t.entries.filter(d=>d.job.id===e),i=t.jobs.find(d=>d.id===e),s=o.reduce((d,m)=>d+K(n-m.start,0,m.end-m.start),0),c=o.find(d=>d.start<=n&&n<d.end);return{worked:s,total:i.ticks,current:c,done:s>=i.ticks}}function oe(t,e,n,o,{keepTeams:i=!1}={}){if(!Number.isInteger(e)||e<0||e>=t.end||!t.members[n]||!Number.isInteger(o)||o<1)throw RangeError("Choose an active show tick, a crew member and a positive absence.");let{jobs:s,members:c}=t,d={},m=[],z=new Map,k=new Set,j=c.map((r,u)=>({free:e+(n===u?o:0),at:N(R(t,u,e))}));for(let r of t.entries){if(r.end<=e){d[r.job.id]=r.end,m.push(r);continue}if(!(r.start>e))if(!r.team.includes(n))d[r.job.id]=r.end,m.push(r),r.team.forEach((u,h)=>{k.add(u),j[u]={free:r.end,at:O(r.to,r.team.length,h,r.job.id)}});else{let u=C(r,e);e>r.start&&m.push({...r,end:e,to:u,interrupted:!0}),z.set(r.job.id,{...r.job,from:u,ticks:r.end-e})}}let b=s.filter(r=>d[r.id]===void 0).map(r=>z.get(r.id)??r),M=i?new Map(t.entries.map(r=>[r.job.id,r.team])):null,v=Z(s,c,j,d,b,M),f=H(v,c),p=t.tracks.map((r,u)=>{let h=[];for(let a of r){if(a.end<=e){h.push(a);continue}if(k.has(u)&&a.kind==="work"&&a.start<=e&&e<a.end){h.push(a);continue}a.start<e&&h.push({...a,end:e,to:C(a,e)})}if(u===n){let a=N(R(t,u,e));h.push(E(e,e+o,a,a,null,"away"))}return[...h,...f[u]]});return{...L(s,c,[...m,...v],p),incident:{t:e,absent:n,until:e+o}}}function ne(t){let e=t.entries.find(n=>n.job.id==="rack");return e.start+Math.floor((e.end-e.start)/2)}export{B as a,y as b,I as c,G as d,Q as e,V as f,Y as g,R as h,ee as i,te as j,oe as k,ne as l};
