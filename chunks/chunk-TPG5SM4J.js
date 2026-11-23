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
import{a as M}from"./chunk-EJRCZQV5.js";var Z=10,G=28,m=67,S=40,C=400,d=M.length,V=746,h=4.7,F=1.45,E=2.35,j=6,b=12.3,X=4.4;function B(e){let t=e>>>0;return()=>(t=Math.imul(1664525,t)+1013904223>>>0,t/4294967296)}function g(e,t){for(let o=e.length-1;o>0;o--){let r=Math.floor(t()*(o+1));[e[o],e[r]]=[e[r],e[o]]}return e}var I=(e,t)=>Math.hypot(e.x-t.x,e.z-t.z);function O(e,t){for(let o of[-h,h]){if(e.x<o==t.x<o)continue;let r=e.z+(t.z-e.z)*(o-e.x)/(t.x-e.x);if(Math.abs(r)>F)return!1}return!0}function A(e){return e<-h?-1:e>h?1:0}function K(e){let t=B(e),o=g(Array.from({length:d},(i,a)=>a),t),r=g(o.slice(),t),n=g(o.slice(),t),s=M.map(({name:i,index:a})=>{let f=n[a],p=r[a];return{id:a,name:i,group:Math.floor(f/5),rig:Math.floor(t()*4),shirt:Math.floor(t()*10),height:.94+t()*.13,x:-3.75+f%8*1.07+(t()-.5)*.4,z:-3.45+Math.floor(f/8)*1.68+(t()-.5)*.48,yaw:t()*Math.PI*2,velocity:0,seatX:5.75+p%5*1.25+(t()-.5)*.25,seatZ:-3.4+Math.floor(p/5)*.94+(t()-.5)*.19,lane:(t()-.5)*1.75,pace:1.12+t()*.48,leaves:48+Math.floor(t()*50),generosity:2+Math.floor(t()*4),memory:a,told:[],nextTalk:0,partner:-1,doneAt:0,outgoing:!1}}),c=o[0],u=s.map(i=>({tick:0,version:1,from:-1,to:i.id,parent:-1,x:i.x,z:i.z,fromX:i.x,fromZ:i.z}));return{seed:e,tick:0,manager:c,guests:s,receipts:u}}function R(e,t,o){let r=e.guests[t],n=e.guests[o];r.memory=e.receipts.length,e.receipts.push({tick:e.tick,version:2,from:o,to:t,parent:n?n.memory:-1,x:r.x,z:r.z,fromX:n?.x??r.x,fromZ:n?.z??r.z}),r.nextTalk=e.tick+3}function v(e,t){return e.partner>=0&&e.doneAt>=t}var z=(e,t,o)=>t===o&&e.tick>m&&e.tick<=m+S;function W(e,t){for(let o of e.guests){if(!o.outgoing||o.doneAt>e.tick)continue;let r=e.guests[o.partner];!z(e,o.id,t)&&!z(e,r.id,t)&&I(o,r)<=E&&O(o,r)&&(o.told.push(r.id),e.receipts[o.memory].version>e.receipts[r.memory].version&&R(e,r.id,o.id)),o.outgoing=!1,o.partner=r.partner=-1,o.nextTalk=e.tick+5}}function P(e){let t=new Map,o=E,r=(n,s)=>(n+16)*64+s+16;for(let n of e){let s=r(Math.floor(n.x/o),Math.floor(n.z/o));t.has(s)||t.set(s,[]),t.get(s).push(n)}return(n,s)=>{let c=Math.floor(n.x/o),u=Math.floor(n.z/o);for(let i=c-1;i<=c+1;i++)for(let a=u-1;a<=u+1;a++){let f=t.get(r(i,a));if(f)for(let p of f)p.id!==n.id&&s(p)}}}function q(e,t,o){for(let r=0;r<e.guests.length;r++){let n=e.guests[(r+e.tick)%e.guests.length],s=e.receipts[n.memory];if(s.version<2||z(e,n.id,o)||v(n,e.tick)||n.nextTalk>e.tick||n.told.length>=n.generosity)continue;let c=null,u=1/0;t(n,i=>{if(z(e,i.id,o)||v(i,e.tick)||i.id===s.from||n.told.includes(i.id))return;let a=I(n,i);if(a>E||!O(n,i))return;let f=a-(i.group===n.group?.78:0);f<u&&(u=f,c=i)}),c&&(n.partner=c.id,c.partner=n.id,n.doneAt=c.doneAt=e.tick+j,n.outgoing=!0)}}function J(e,t,o,r){let n=e.guests[t.partner];if(z(e,t.id,r)||v(t,e.tick)||e.tick<t.leaves){let l=n?Math.atan2(n.x-t.x,n.z-t.z):t.yaw;return[t.x,t.z,l,0]}let s=e.receipts[t.memory].version===2?1:-1,c=s*t.seatX,u=t.seatZ;for(let l of s===1?[-h,h]:[h,-h])if(!(s*(t.x-l)>=.49||s*(c-l)<=0)){c=l+s*.75,u=t.lane,s*(t.x-l)<-.65&&Math.abs(t.z)>F-.25&&(c=l-s*.52);break}let i=c-t.x,a=u-t.z,f=Math.hypot(i,a);if(f<.09)return[t.x,t.z,Math.atan2(s*8.8-t.x,-4.7-t.z),0];let p=Math.min(t.pace/Z,f);i=i/f*p,a=a/f*p,o(t,l=>{let H=t.x-l.x,L=t.z-l.z,y=Math.hypot(H,L);if(y<.47&&y>.001){let N=(.47-y)*.17/y;i+=H*N,a+=L*N}});let x={x:Math.max(-b,Math.min(b,t.x+i)),z:Math.max(-X,Math.min(X,t.z+a))};O(t,x)||(x.x=t.x);let T=Math.hypot(x.x-t.x,x.z-t.z)*Z;return[x.x,x.z,T>.03?Math.atan2(x.x-t.x,x.z-t.z):t.yaw,T]}function U(e,t=-1){if(e.tick++,e.tick===G&&R(e,e.manager,-2),e.tick===m+1&&t>=0){let n=e.guests[t],s=e.guests[n.partner];s&&(n.partner=s.partner=-1,n.outgoing=s.outgoing=!1)}W(e,t);let o=P(e.guests);q(e,o,t);let r=e.guests.map(n=>J(e,n,o,t));for(let n=0;n<e.guests.length;n++){let s=e.guests[n];[s.x,s.z,s.yaw,s.velocity]=r[n]}}var k=5;function D(e,t){let o=e.tick*d*k;for(let r of e.guests){let n=o+r.id*k;t[n]=r.x,t[n+1]=r.z,t[n+2]=r.yaw,t[n+3]=r.velocity,t[n+4]=r.memory}}function _(e,t,o){for(;e.tick<C;)U(e,t),o&&D(e,o)}function Y(e){let t=K(e),o=new Float32Array((C+1)*d*k);for(D(t,o);t.tick<m;)U(t),D(t,o);let r=structuredClone(t);return _(t,-1,o),{checkpoint:r,original:{frames:o,receipts:t.receipts},finalHalls:t.guests.map(n=>A(n.x))}}function $(e,t,o=!0){let r=structuredClone(e.checkpoint),n=o?new Float32Array(e.original.frames.length):null;n&&n.set(e.original.frames.subarray(0,(m+1)*d*k)),_(r,t,n);let s=r.guests.filter(c=>A(c.x)*e.finalHalls[c.id]===-1).map(c=>c.id);return{hold:t,changed:s,east:r.guests.filter(c=>A(c.x)===1).length,...n?{frames:n,receipts:r.receipts}:{}}}function w(e,t){let o=[];for(let r=t;r>=0;r=e[r].parent)o.unshift(e[r]);return o}function tt(e,t,o){let r=(t*d+o)*k,n=e.frames;return{x:n[r],z:n[r+1],yaw:n[r+2],speed:n[r+3],memory:n[r+4]}}export{Z as a,m as b,S as c,C as d,d as e,V as f,h as g,F as h,A as i,k as j,Y as k,$ as l,w as m,tt as n};
