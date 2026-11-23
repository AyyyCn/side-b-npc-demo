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
import{a as X,b as Y,d as Z,e as $}from"./chunk-GYEJYHA5.js";import{C as q,D as v,K as B,M as G,O as N,R as O,X as E,a as L,aa as V,ca as D,d as F,da as H,fa as I,ha as U,ia as W,k as j,ka as _,la as J,ma as K,na as Q,p as b,u as z,w as A,x as R}from"./chunk-IRLDILCX.js";var y=r=>document.getElementById(r),se=r=>(r/10).toFixed(1)+" s";function P(r,o){let a=y(r);a.textContent!==o&&(a.textContent=o)}function de({initial:r,limit:o,draw:a,describe:c}){let e=r,n=!1,l=!1,s=null,i=()=>{l&&(y("scrub").max=Math.ceil(o()),y("scrub").value=Math.round(e),P("time",se(e)),P("play",n?"Pause":e>=o()?"Replay":"Play"),a(e,n))},d=(t,p=!1)=>{e=Math.max(0,Math.min(o(),t)),n=p&&e<o(),i()},u=t=>{l&&n&&(e=Math.min(o(),e+Math.max(0,t)/100),e>=o()&&(n=!1)),i()};function m(t){l&&n&&u(s==null?0:Math.min(100,t-s)),s=t,requestAnimationFrame(m)}function w(){d(e>=o()?0:e,!n)}return y("play").onclick=w,y("finish").onclick=()=>d(o()),y("scrub").oninput=t=>d(Number(t.target.value)),window.addEventListener("resize",i),document.addEventListener("keydown",t=>{t.repeat||/INPUT|SELECT|BUTTON|A/.test(t.target.tagName)||(t.key===" "&&(t.preventDefault(),w()),t.key.toLowerCase()==="f"&&(document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{})))}),window.advanceTime=u,window.render_game_to_text=()=>JSON.stringify(l?{ready:!0,tick:Math.floor(e),playing:n,axes:"x increases right, z toward the front, metres",...c(e)}:{ready:!1}),{get tick(){return e},jump:d,paint:i,open(){l=!0,y("loading").hidden=!0,i(),requestAnimationFrame(m)},fail(t){P("loading","Could not open the 3D venue. "+t.message);for(let p of document.querySelectorAll("button,select,input"))p.disabled=!0}}}var xe=(r,o=.75,a=0)=>new E({color:r,roughness:o,metalness:a}),Te=r=>new q({color:r}),ce=new G(1,1,1);function Me(r,o,a,c,e,n,l,s){let i=new v(ce,o);return i.position.set(a,c,e),i.scale.set(n,l,s),i.castShadow=i.receiveShadow=!0,r.add(i),i}function ye(r,o,a,c,e=.028){let n=new b(...a),l=new b(...c),s=l.clone().sub(n),i=new v(new N(e,e,s.length(),9),o);return i.position.copy(n.add(l).multiplyScalar(.5)),i.quaternion.setFromUnitVectors(new b(0,1,0),s.normalize()),r.add(i),i}function be(r,o,a,c,e,n,l,s="#f2e9d1",i="#24352f"){let d=document.createElement("canvas");d.width=768,d.height=Math.max(48,Math.round(d.width*l/n));let u=d.getContext("2d");u.fillStyle=i,u.fillRect(0,0,d.width,d.height),u.fillStyle=s,u.textAlign="center",u.textBaseline="middle",u.font="bold "+Math.floor(d.height*.6)+"px Helvetica Neue, Arial, sans-serif",u.fillText(o,d.width/2,d.height*.52,d.width*.92);let m=new B(d);m.colorSpace=j,m.anisotropy=8;let w=new v(new O(n,l),new E({map:m,roughness:.78}));return w.position.set(a,c,e),r.add(w),w}function Se(r,o,a,c,e){let n=new H(o,a,22,1.02,.62,2);return n.position.set(...c),n.target.position.set(...e),r.add(n,n.target),n}async function ve(r,o,a){let c=new W({canvas:r,antialias:!0,powerPreference:"high-performance"});c.setPixelRatio(Math.min(devicePixelRatio||1,1.55)),c.toneMapping=F,c.toneMappingExposure=a?1.04:1.08,c.shadowMap.enabled=!0,c.shadowMap.type=L;let e=new R;e.background=new z(a?"#494137":"#24252a"),e.fog=new A(e.background,13,27);let n=new U(c),l=new K;e.environment=n.fromScene(l,.04).texture,e.environmentIntensity=a?.24:.21,l.dispose(),n.dispose(),e.add(new V(a?16771792:12900077,a?11770230:8349797,a?1.15:.82));let s=new I(a?16771016:16767920,a?2.35:1.76);s.position.set(-4.8,7.8,4.1),s.castShadow=!0,s.shadow.mapSize.set(2048,2048),Object.assign(s.shadow.camera,{left:-7,right:7,top:5,bottom:-5,near:1,far:22}),s.shadow.normalBias=.016,s.shadow.bias=-16e-5,e.add(s,s.target);let i=new _().setMeshoptDecoder(J),d=Object.keys(o).map(h=>o[h].rig),[u,m]=await Promise.all([$(i,Object.fromEntries(Object.entries(Z).filter(([h])=>d.includes(h)))),Q()]),w=Y(e,u,o),t=new D(37,1,.05,45),p=new b,k=0,C=0;function ee(h,x,S,g,T,ne=[]){let f=w.get(h);f.root.position.set(x.x,.012,x.z),f.root.rotation.y=S;for(let M of f.pose)M.bone.quaternion.copy(M.original);f.walk.weight=g?1:0,f.idle.weight=g?0:1,f.mixer.setTime(T/10+f.height*.27);for(let M of f.pose)M.original.copy(M.bone.quaternion);f.root.updateWorldMatrix(!0,!0);for(let[M,re,ae,ie]of ne)f.root.worldToLocal(p.set(re,ae,ie)),X(f,M,p.x,p.y,p.z,.97)}function te(h,x,S=38){let g=r.clientWidth,T=r.clientHeight;!g||!T||((k!==g||C!==T)&&(k=g,C=T,c.setSize(g,T,!1)),t.aspect=g/T,t.fov=S,t.position.set(...h),t.aspect<1.45&&t.position.lerp(new b(...x),1-1.45/t.aspect),t.lookAt(...x),t.updateProjectionMatrix(),c.render(e,t))}function oe(h,x,S){return p.set(h,x,S).project(t),{x:(.5+.5*p.x)*k,y:(.5-.5*p.y)*C}}return{scene:e,materials:m,pose:ee,render:te,project:oe}}export{xe as a,Te as b,Me as c,ye as d,be as e,Se as f,ve as g,y as h,se as i,P as j,de as k};
