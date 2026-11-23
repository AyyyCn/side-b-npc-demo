import * as T from "three";

// A single camera pass. The depth buffer sets the circle of confusion in close coverage.
// The venue and moving cast render together into one multisampled HDR target.
export function createCameraPass(renderer) {
  const target = new T.WebGLRenderTarget(1, 1, {
    type: T.HalfFloatType,
    samples: 2,
  });
  target.depthTexture = new T.DepthTexture(1, 1, T.UnsignedIntType);
  const uniforms = {
    image: { value: target.texture },
    depth: { value: target.depthTexture },
    pixel: { value: new T.Vector2() },
    focus: { value: 5 },
    near: { value: 0.08 },
    far: { value: 64 },
    aperture: { value: 1 },
  };
  const material = new T.ShaderMaterial({
    depthTest: false,
    depthWrite: false,
    uniforms,
    vertexShader:
      "varying vec2 screenUV; void main(){screenUV=uv;gl_Position=vec4(position.xy,0.,1.);}",
    fragmentShader: `
    uniform sampler2D image,depth; uniform vec2 pixel; uniform float focus,near,far,aperture; varying vec2 screenUV;
    const vec2 unit=vec2(-.7373689,.6754903);
    void main(){
      vec2 uv=screenUV;float d=texture2D(depth,uv).r;float z=near*far/(far-d*(far-near));
      float blur=clamp(abs(z-focus)/max(z,.1)*aperture,0.,4.8);
      vec3 sum=texture2D(image,uv).rgb*2.;vec2 ring=vec2(1.,0.);
      for(int i=0;i<10;i++){
        ring=vec2(dot(ring,unit),ring.y*unit.x-ring.x*unit.y);
        sum+=texture2D(image,uv+ring*pixel*blur*sqrt((float(i)+.8)/10.)).rgb;
      }
      vec3 col=sum/12.;
      float luma=dot(col,vec3(.2126,.7152,.0722));
      col=mix(vec3(luma),col,.91);
      col+=vec3(.002,.003,.005)*exp(-3.*luma);
      col*=1.-.16*dot((uv-.5)*1.35,(uv-.5)*1.35);
      gl_FragColor=vec4(col,1.);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`,
  });
  const scene = new T.Scene(),
    camera = new T.Camera(),
    screen = new T.Mesh(new T.PlaneGeometry(2, 2), material);
  screen.frustumCulled = false;
  scene.add(screen);
  return function render(world, lens, focus, close) {
    if (
      target.width !== renderer.domElement.width ||
      target.height !== renderer.domElement.height
    ) {
      target.setSize(renderer.domElement.width, renderer.domElement.height);
      uniforms.pixel.value.set(1 / target.width, 1 / target.height);
    }
    uniforms.focus.value = focus;
    uniforms.aperture.value = ((close ? 9 : 2.2) * target.height) / 900;
    renderer.setRenderTarget(target);
    renderer.render(world, lens);
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);
  };
}
