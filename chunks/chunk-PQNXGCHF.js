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
import{a as d}from"./chunk-EJRCZQV5.js";var k=10,F=28,M=67,R=40,N=400,p=d.length,Q=133,V=9,l=4.7,O=1.45,g=2.35,H=.56,U=6,A=12.3,b=4.4;function X(t){let e=t>>>0;return()=>(e=Math.imul(1664525,e)+1013904223>>>0,e/4294967296)}function y(t,e){for(let o=t.length-1;o>0;o--){let r=Math.floor(e()*(o+1));[t[o],t[r]]=[t[r],t[o]]}return t}var C=(t,e)=>Math.hypot(t.x-e.x,t.z-e.z);function L(t,e){for(let o of[-l,l]){if(t.x<o==e.x<o)continue;let r=t.z+(e.z-t.z)*(o-t.x)/(e.x-t.x);if(Math.abs(r)>O)return!1}return!0}function v(t){return t<-l?-1:t>l?1:0}function I(t){let e=X(t),o=y(Array.from({length:p},(i,c)=>c),e),r=y(o.slice(),e),n=y(o.slice(),e),s=d.map(({name:i,index:c})=>{let u=n[c],x=r[c];return{id:c,name:i,group:Math.floor(u/5),rig:Math.floor(e()*4),shirt:Math.floor(e()*10),height:.94+e()*.13,x:-3.75+u%8*1.07+(e()-.5)*.4,z:-3.45+Math.floor(u/8)*1.68+(e()-.5)*.48,yaw:e()*Math.PI*2,velocity:0,walked:0,walkMix:0,seatX:5.75+x%5*1.25+(e()-.5)*.25,seatZ:-3.4+Math.floor(x/5)*.94+(e()-.5)*.19,lane:(e()-.5)*1.75,pace:1.12+e()*.48,leaves:48+Math.floor(e()*50),generosity:2+Math.floor(e()*4),memory:c,told:[],nextTalk:0,partner:-1,doneAt:0,outgoing:!1}}),a=o[0],f=s.map(i=>({tick:0,version:1,from:-1,to:i.id,parent:-1,x:i.x,z:i.z,fromX:i.x,fromZ:i.z}));return{seed:t,tick:0,manager:a,guests:s,receipts:f}}function S(t,e,o){let r=t.guests[e],n=t.guests[o];r.memory=t.receipts.length,t.receipts.push({tick:t.tick,version:2,from:o,to:e,parent:n?n.memory:-1,x:r.x,z:r.z,fromX:n?.x??r.x,fromZ:n?.z??r.z}),r.nextTalk=t.tick+3}function E(t,e){return t.partner>=0&&t.doneAt>=e}var m=(t,e,o)=>e===o&&t.tick>M&&t.tick<=M+R;function G(t,e){for(let o of t.guests){if(!o.outgoing||o.doneAt>t.tick)continue;let r=t.guests[o.partner];!m(t,o.id,e)&&!m(t,r.id,e)&&C(o,r)<=g&&L(o,r)&&(o.told.push(r.id),t.receipts[o.memory].version>t.receipts[r.memory].version&&S(t,r.id,o.id)),o.outgoing=!1,o.partner=r.partner=-1,o.nextTalk=t.tick+5}}function P(t){let e=new Map,o=g,r=(n,s)=>(n+16)*64+s+16;for(let n of t){let s=r(Math.floor(n.x/o),Math.floor(n.z/o));e.has(s)||e.set(s,[]),e.get(s).push(n)}return(n,s)=>{let a=Math.floor(n.x/o),f=Math.floor(n.z/o);for(let i=a-1;i<=a+1;i++)for(let c=f-1;c<=f+1;c++){let u=e.get(r(i,c));if(u)for(let x of u)x.id!==n.id&&s(x)}}}function j(t,e,o){for(let r=0;r<t.guests.length;r++){let n=t.guests[(r+t.tick)%t.guests.length],s=t.receipts[n.memory];if(s.version<2||m(t,n.id,o)||E(n,t.tick)||n.nextTalk>t.tick||n.told.length>=n.generosity)continue;let a=null,f=1/0;e(n,i=>{if(m(t,i.id,o)||E(i,t.tick)||i.id===s.from||n.told.includes(i.id))return;let c=C(n,i);if(c>g||!L(n,i))return;let u=c-(i.group===n.group?.78:0);u<f&&(f=u,a=i)}),a&&(n.partner=a.id,a.partner=n.id,n.doneAt=a.doneAt=t.tick+U,n.outgoing=!0)}}function B(t,e,o){let r=t.guests[e.partner];if(m(t,e.id,o)||E(e,t.tick)||t.tick<e.leaves){let h=r?Math.atan2(r.x-e.x,r.z-e.z):e.yaw;return[e.x,e.z,h,0]}let n=t.receipts[e.memory].version===2?1:-1,s=n*e.seatX,a=e.seatZ;for(let h of n===1?[-l,l]:[l,-l])if(!(n*(e.x-h)>=.49||n*(s-h)<=0)){s=h+n*.75,a=e.lane,n*(e.x-h)<-.65&&Math.abs(e.z)>O-.25&&(s=h-n*.52);break}let f=s-e.x,i=a-e.z,c=Math.hypot(f,i);if(c<.09)return[e.x,e.z,Math.atan2(n*8.8-e.x,-4.7-e.z),0];let u=Math.min(e.pace/k,c);f=f/c*u,i=i/c*u;let x={x:Math.max(-A,Math.min(A,e.x+f)),z:Math.max(-b,Math.min(b,e.z+i))};L(e,x)||(x.x=e.x);let T=Math.hypot(x.x-e.x,x.z-e.z)*k;return[x.x,x.z,T>.03?Math.atan2(x.x-e.x,x.z-e.z):e.yaw,T]}function K(t,e,o,r,n){for(let s of r){let a=t.x-s.x,f=t.z-s.z,i=n[s.id],c=e-t.x-(i?i[0]-s.x:0),u=o-t.z-(i?i[1]-s.z:0),x=Math.max(0,Math.min(1,-(a*c+f*u)/(c*c+u*u||1)));if((a+x*c)**2+(f+x*u)**2<H**2)return!1}for(let s of[-l,l]){let a=.12+H/2;if(!(Math.min(t.x,e)>s+a||Math.max(t.x,e)<s-a)&&Math.max(Math.abs(t.z),Math.abs(o))>O-a)return!1}return Math.abs(e)<=A&&Math.abs(o)<=b}var W=[0,.36,-.36,.76,-.76,1.18,-1.18,1.52,-1.52].map(t=>[Math.cos(t),Math.sin(t)]);function q(t,e,o,r){let n=e[0]-t.x,s=e[1]-t.z;if(Math.abs(n)+Math.abs(s)<1e-8)return e;let a=[];o(t,f=>{Math.abs(t.x-f.x)<1.15&&Math.abs(t.z-f.z)<1.15&&a.push(f)});for(let[f,i]of W){let c=t.x+n*f-s*i,u=t.z+n*i+s*f;if(K(t,c,u,a,r))return[c,u,Math.atan2(c-t.x,u-t.z),Math.hypot(c-t.x,u-t.z)*k]}return[t.x,t.z,t.yaw,0]}function Z(t,e=-1){if(t.tick++,t.tick===F&&S(t,t.manager,-2),t.tick===M+1&&e>=0){let n=t.guests[e],s=t.guests[n.partner];s&&(n.partner=s.partner=-1,n.outgoing=s.outgoing=!1)}G(t,e);let o=P(t.guests);j(t,o,e);let r=new Array(p);for(let n=0;n<p;n++){let s=t.guests[(n+t.tick)%p];r[s.id]=q(s,B(t,s,e),o,r)}for(let n=0;n<t.guests.length;n++){let s=t.guests[n],[a,f,i,c]=r[n];s.walked+=c/k,s.walkMix+=Math.max(-.34,Math.min(.34,Math.min(1,c/.72)-s.walkMix));let u=Math.atan2(Math.sin(i-s.yaw),Math.cos(i-s.yaw));s.yaw+=Math.max(-.57,Math.min(.57,u)),s.x=a,s.z=f,s.velocity=c}}var z=7;function D(t,e){let o=t.tick*p*z;for(let r of t.guests){let n=o+r.id*z;e[n]=r.x,e[n+1]=r.z,e[n+2]=r.yaw,e[n+3]=r.velocity,e[n+4]=r.memory,e[n+5]=r.walked,e[n+6]=r.walkMix}}function _(t,e,o){for(;t.tick<N;)Z(t,e),o&&D(t,o)}function Y(t){let e=I(t),o=new Float32Array((N+1)*p*z);for(D(e,o);e.tick<M;)Z(e),D(e,o);let r=structuredClone(e);return _(e,-1,o),{checkpoint:r,original:{frames:o,receipts:e.receipts},finalHalls:e.guests.map(n=>v(n.x))}}function $(t,e,o=!0){let r=structuredClone(t.checkpoint),n=o?new Float32Array(t.original.frames.length):null;n&&n.set(t.original.frames.subarray(0,(M+1)*p*z)),_(r,e,n);let s=r.guests.filter(a=>v(a.x)*t.finalHalls[a.id]===-1).map(a=>a.id);return{hold:e,changed:s,east:r.guests.filter(a=>v(a.x)===1).length,...n?{frames:n,receipts:r.receipts}:{}}}function w(t,e){let o=[];for(let r=e;r>=0;r=t[r].parent)o.unshift(t[r]);return o}function tt(t,e,o){let r=(e*p+o)*z,n=t.frames;return{x:n[r],z:n[r+1],yaw:n[r+2],speed:n[r+3],memory:n[r+4]}}export{k as a,M as b,R as c,N as d,p as e,Q as f,V as g,l as h,O as i,v as j,z as k,Y as l,$ as m,w as n,tt as o};
