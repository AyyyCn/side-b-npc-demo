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
import{a as X,b as Y,d as Z,e as $}from"./chunk-O3A6BAD2.js";import{C as A,D as S,K as B,M as G,O as N,R as O,X as P,a as E,aa as V,ca as q,d as L,da as D,fa as W,ha as H,ia as I,k as F,ka as U,la as _,ma as J,na as K,p as b,ra as Q,u as R,w as j,x as z}from"./chunk-UAW4QEMP.js";var M=r=>document.getElementById(r),de=r=>(r/10).toFixed(1)+" s";function k(r,o){let a=M(r);a.textContent!==o&&(a.textContent=o)}function ue({initial:r,limit:o,draw:a,describe:c}){let e=r,n=!1,l=!1,s=null,i=()=>{l&&(M("scrub").max=Math.ceil(o()),M("scrub").value=Math.round(e),k("time",de(e)),k("play",n?"Pause":e>=o()?"Replay":"Play"),a(e,n))},d=(t,p=!1)=>{e=Math.max(0,Math.min(o(),t)),n=p&&e<o(),i()},u=t=>{l&&n&&(e=Math.min(o(),e+Math.max(0,t)/100),e>=o()&&(n=!1)),i()};function g(t){l&&n&&u(s==null?0:Math.min(100,t-s)),s=t,requestAnimationFrame(g)}function h(){d(e>=o()?0:e,!n)}return M("play").onclick=h,M("finish").onclick=()=>d(o()),M("scrub").oninput=t=>d(Number(t.target.value)),window.addEventListener("resize",i),document.addEventListener("keydown",t=>{t.repeat||/INPUT|SELECT|BUTTON|A/.test(t.target.tagName)||(t.key===" "&&(t.preventDefault(),h()),t.key.toLowerCase()==="f"&&(document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{})))}),window.advanceTime=u,window.render_game_to_text=()=>JSON.stringify(l?{ready:!0,tick:Math.floor(e),playing:n,axes:"x increases right, z toward the front, metres",...c(e)}:{ready:!1}),{get tick(){return e},jump:d,paint:i,open(){l=!0,M("loading").hidden=!0,i(),requestAnimationFrame(g)},fail(t){k("loading","Could not open the 3D venue. "+t.message);for(let p of document.querySelectorAll("button,select,input"))p.disabled=!0}}}var ye=(r,o=.75,a=0)=>new P({color:r,roughness:o,metalness:a}),be=r=>new A({color:r}),le=new G(1,1,1);function Se(r,o,a,c,e,n,l,s){let i=new S(le,o);return i.position.set(a,c,e),i.scale.set(n,l,s),i.castShadow=i.receiveShadow=!0,r.add(i),i}function ve(r,o,a,c,e=.028){let n=new b(...a),l=new b(...c),s=l.clone().sub(n),i=new S(new N(e,e,s.length(),9),o);return i.position.copy(n.add(l).multiplyScalar(.5)),i.quaternion.setFromUnitVectors(new b(0,1,0),s.normalize()),r.add(i),i}function Ce(r,o,a,c,e,n,l,s="#f2e9d1",i="#24352f"){let d=document.createElement("canvas");d.width=768,d.height=Math.max(48,Math.round(d.width*l/n));let u=d.getContext("2d");u.fillStyle=i,u.fillRect(0,0,d.width,d.height),u.fillStyle=s,u.textAlign="center",u.textBaseline="middle",u.font="bold "+Math.floor(d.height*.6)+"px Helvetica Neue, Arial, sans-serif",u.fillText(o,d.width/2,d.height*.52,d.width*.92);let g=new B(d);g.colorSpace=F,g.anisotropy=8;let h=new S(new O(n,l),new P({map:g,roughness:.78}));return h.position.set(a,c,e),r.add(h),h}function Pe(r,o,a,c,e){let n=new D(o,a,22,1.02,.62,2);return n.position.set(...c),n.target.position.set(...e),r.add(n,n.target),n}async function ke(r,o,a){let c=new I({canvas:r,antialias:!0,powerPreference:"high-performance"});c.setPixelRatio(Math.min(devicePixelRatio||1,1.55)),c.toneMapping=L,c.toneMappingExposure=a?1.04:1.08,c.shadowMap.enabled=!0,c.shadowMap.type=E;let e=new z;e.background=new R(a?"#494137":"#24252a"),e.fog=new j(e.background,13,27);let n=new H(c),l=new J;e.environment=n.fromScene(l,.04).texture,e.environmentIntensity=a?.24:.21,l.dispose(),n.dispose(),e.add(new V(a?16771792:12900077,a?11770230:8349797,a?1.15:.82));let s=new W(a?16771016:16767920,a?2.35:1.76);s.position.set(-4.8,7.8,4.1),s.castShadow=!0,s.shadow.mapSize.set(2048,2048),Object.assign(s.shadow.camera,{left:-7,right:7,top:5,bottom:-5,near:1,far:22}),s.shadow.normalBias=.016,s.shadow.bias=-16e-5,e.add(s,s.target);let i=new U().setMeshoptDecoder(_),d=Object.keys(o).map(f=>o[f].rig),[u,g]=await Promise.all([$(i,Object.fromEntries(Object.entries(Z).filter(([f])=>d.includes(f)))),K()]),h=Y(e,u,o),t=new q(37,1,.05,45),p=new b,v=0,C=0;function ee(f,m,w,x,T=[]){let y=h.get(f);y.root.position.set(m.x,.009,m.z),y.root.rotation.y=w.yaw,Q(y,w,x),y.root.updateWorldMatrix(!0,!0);for(let[re,ae,ie,se,ce=1]of T)y.root.worldToLocal(p.set(ae,ie,se)),X(y,re,p.x,p.y,p.z,ce)}function te(f,m,w){return h.get(f).arms[m][2].getWorldPosition(w)}function oe(f,m,w=38){let x=r.clientWidth,T=r.clientHeight;!x||!T||((v!==x||C!==T)&&(v=x,C=T,c.setSize(x,T,!1)),t.aspect=x/T,t.fov=w,t.position.set(...f),t.aspect<1.45&&t.position.lerp(new b(...m),1-1.45/t.aspect),t.lookAt(...m),t.updateProjectionMatrix(),c.render(e,t))}function ne(f,m,w){return p.set(f,m,w).project(t),{x:(.5+.5*p.x)*v,y:(.5-.5*p.y)*C}}return{scene:e,materials:g,pose:ee,handPosition:te,render:oe,project:ne}}export{ye as a,be as b,Se as c,ve as d,Ce as e,Pe as f,ke as g,M as h,de as i,k as j,ue as k};
