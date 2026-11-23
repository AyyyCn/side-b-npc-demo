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
import{b as N}from"./chunk-EJRCZQV5.js";var Y=N.ida,y={x:-3.25,z:2.25},L=[{id:"intake",name:"Intake",x:-3,z:-2,filings:19},{id:"catalog",name:"Catalogue",x:0,z:-2,filings:23},{id:"dispatch",name:"Dispatch",x:3,z:-2,filings:8}],j=L.reduce((e,n)=>e+n.filings,0),m=L.map(e=>({...e,prior:e.filings/j})),D=18,H=32,P=15,_=1.48,V=8.5,W=Math.cos(42*Math.PI/180),w=(e,n)=>Math.hypot(n.x-e.x,n.z-e.z),R=e=>({x:e.x,z:-1.25});function q(e){return e?{left:-2.15,right:1.04,back:.03,front:.22}:{left:3.55,right:4.68,back:-.03,front:.28}}function F(e,n,i,r=0){let c=0,l=1;for(let[f,h,t,s]of[[e.x,n.x-e.x,i.left-r,i.right+r],[e.z,n.z-e.z,i.back-r,i.front+r]]){if(Math.abs(h)<1e-10){if(f<t||f>s)return!1;continue}let p=(t-f)/h,o=(s-f)/h;if(c=Math.max(c,Math.min(p,o)),l=Math.min(l,Math.max(p,o)),c>l)return!1}return!0}function B(e,n,i){let r=w(e,n);if(r>V||r===0)return!1;let c={x:2.6,z:-4.25};return((n.x-e.x)*c.x+(n.z-e.z)*c.z)/(r*Math.hypot(c.x,c.z))>=W&&!F(e,n,i)}var G=[[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]],J=.4;function Q(e,n,i){let r=(t,s)=>!F(t,s,i,J);if(r(e,n))return[e,n];let c=t=>t.x+","+t.z,l={p:e,g:0,f:w(e,n),parent:null},f=[l],h=new Map([[c(e),0]]);for(;f.length;){f.sort((s,p)=>p.f-s.f);let t=f.pop();if(!(t.g>h.get(c(t.p)))){if(t.p.x===n.x&&t.p.z===n.z){let s=[];for(let o=t;o;o=o.parent)s.unshift(o.p);let p=[e];for(let o=0;o<s.length-1;){let a=s.length-1;for(;a>o+1&&!r(s[o],s[a]);)a--;p.push(s[a]),o=a}return p}for(let[s,p]of G){let o={x:t.p.x+s*.25,z:t.p.z+p*.25};if(o.x<-4.75||o.x>4.75||o.z<-1.25||o.z>2.75||!r(t.p,o))continue;let a=t.g+w(t.p,o),z=c(o);a+1e-8>=(h.get(z)??1/0)||(h.set(z,a),f.push({p:o,g:a,f:a+w(o,n),parent:t}))}}}throw Error("The record bins must be reachable.")}var K=e=>e.slice(1).reduce((n,i,r)=>n+w(e[r],i),0),O=e=>Math.ceil(K(e)/_*10),S=e=>{let n=e.reduce((i,r)=>i+r,0);return e.map(i=>i/n)};function U(e,n,i){let r=null,c=1/0;function l(f,h,t,s,p){if(!h.length){s<c&&(c=s,r=p);return}for(let o of h){let a=t+O(i(f,o))+P;l(o,h.filter(z=>z!==o),a,s+a*e[o],[...p,o])}}return l(n,e.flatMap((f,h)=>f>0?[h]:[]),0,0,[]),r}function Z(e=!0,n="dispatch"){let i=m.findIndex(u=>u.id===n);if(i<0)throw RangeError("Choose a record bin.");let r=q(e),c=m.map(u=>u.prior),l=m.map(u=>B(y,u,r)),f=l[i],h=f?m.map((u,x)=>+(x===i)):S(c.map((u,x)=>l[x]?0:u)),t=[{t:0,weights:c,text:"Ida is watching the archive."},{t:D,weights:h,text:f?"Ida saw the sleeve go into "+m[i].name+".":"The filing was out of sight. Ida can rule out the bins she could see."}],s=new Map,p=(u,x)=>{let d=u+"/"+x;return s.has(d)||s.set(d,Q(u===-1?y:R(m[u]),R(m[x]),r)),s.get(d)},o=h,a=H,z=-1,E=[],C=[],k=[];for(;;){let u=U(o,z,p),x=u[0],d=p(z,x);k.push({t:a,order:u,weights:o.slice()});let M=K(d),I=O(d),b=0;for(let g=1;g<d.length;g++){let v=a+(M?I*b/M:0);b+=w(d[g-1],d[g]),C.push({from:d[g-1],to:d[g],start:v,end:a+(M?I*b/M:0)})}let T=a+I;a=T+P;let A=x===i;if(E.push({i:x,depart:k.at(-1).t,arrive:T,end:a,found:A}),A){t.push({t:a,weights:m.map((g,v)=>+(v===x)),text:"Ida opened "+m[x].name+" and found the sleeve."});break}o=S(o.map((g,v)=>v===x?0:g)),t.push({t:a,weights:o,text:m[x].name+" was empty. Ida updates her search."}),z=x}return{closed:e,destination:n,screen:r,visible:l,seen:f,observations:t,moves:C,visits:E,decisions:k,end:a}}function $(e,n){let i=e.observations.filter(t=>t.t<=n),r=e.decisions.filter(t=>t.t<=n).at(-1),c=e.visits.find(t=>t.depart<=n&&n<t.end),l={...y},f=0,h=Math.atan2(2.6,-4.25);for(let t of e.moves){if(n<t.start)break;let s=Math.min(1,(n-t.start)/(t.end-t.start||1));if(l={x:t.from.x+(t.to.x-t.from.x)*s,z:t.from.z+(t.to.z-t.from.z)*s},n<t.end){f=_,h=Math.atan2(t.to.x-t.from.x,t.to.z-t.from.z);break}h=Math.PI}return{pos:l,speed:f,yaw:h,evidence:i,weights:i.at(-1).weights,decision:r,visit:c,found:n>=e.end,inspected:e.visits.filter(t=>t.end<=n)}}export{Y as a,y as b,m as c,D as d,H as e,Z as f,$ as g};
