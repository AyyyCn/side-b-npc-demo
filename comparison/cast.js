import * as T from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import maya from "../art/crowd/maya.glb";
import sam from "../art/crowd/sam.glb";
import harper from "../art/crowd/harper.glb";
import jordan from "../art/crowd/jordan.glb";
import { WALK_DISTANCE } from "../npc/gait.js";
import { COUNT, HZ } from "./simulation.js";
const SAMPLES = 24;
const wardrobe = [
  "#dbac8c",
  "#557a84",
  "#ddd9c6",
  "#959656",
  "#af6e4b",
  "#698f73",
  "#7982ad",
  "#ce929e",
  "#889499",
  "#c48c53",
].map((c) => new T.Color(c));
const transform = new T.Object3D();
const skinHeader = `
attribute vec4 skinIndex;
attribute vec4 skinWeight;
attribute vec3 pose;
uniform highp sampler2D crowdAtlas;
mat4 jointRow(float index, float row) {
  ivec2 uv = ivec2(int(index) * 4, int(row));
  return mat4(texelFetch(crowdAtlas,uv,0),texelFetch(crowdAtlas,uv+ivec2(1,0),0),
              texelFetch(crowdAtlas,uv+ivec2(2,0),0),texelFetch(crowdAtlas,uv+ivec2(3,0),0));
}
mat4 sampleClip(float index,float frame,float base){
  float lo=floor(frame),blend=fract(frame); float hi=mod(lo+1.0,${SAMPLES}.0);
  return jointRow(index,base+lo)*(1.0-blend)+jointRow(index,base+hi)*blend;
}
mat4 joint(float index){
  if(pose.z<.001)return sampleClip(index,pose.x,0.);
  if(pose.z>.999)return sampleClip(index,pose.y,${SAMPLES}.0);
  return sampleClip(index,pose.x,0.)*(1.-pose.z)+sampleClip(index,pose.y,${SAMPLES}.0)*pose.z;
}`;
function animateMaterial(material, texture) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.crowdAtlas = { value: texture };
    shader.vertexShader = shader.vertexShader
      .replace("#include <skinning_pars_vertex>", skinHeader)
      .replace(
        "#include <skinbase_vertex>",
        "mat4 crowdSkin=skinWeight.x*joint(skinIndex.x)+skinWeight.y*joint(skinIndex.y)+skinWeight.z*joint(skinIndex.z)+skinWeight.w*joint(skinIndex.w);",
      )
      .replace(
        "#include <skinnormal_vertex>",
        "objectNormal=mat3(crowdSkin)*objectNormal;",
      )
      .replace(
        "#include <skinning_vertex>",
        "transformed=(crowdSkin*vec4(transformed,1.0)).xyz;",
      );
  };
  material.customProgramCacheKey = () => "side-b-batched-crowd";
  return material;
}
// Bake the original skeleton clips once. Each instance subsequently needs just a transform and pose row.
function bakeRig(gltf, scene) {
  const parts = [];
  gltf.scene.traverse((mesh) => {
    if (mesh.isSkinnedMesh)
      parts.push({
        mesh,
        data: new Float32Array(mesh.skeleton.bones.length * 16 * SAMPLES * 2),
      });
  });
  const mixer = new T.AnimationMixer(gltf.scene);
  const duration = [];
  const matrix = new T.Matrix4(),
    bind = new T.Matrix4();
  for (const [clipIndex, name] of ["Idle_Standing", "Walk_Brisk"].entries()) {
    mixer.stopAllAction();
    const clip = T.AnimationClip.findByName(gltf.animations, name);
    duration.push(clip.duration);
    mixer.clipAction(clip).play();
    for (let i = 0; i < SAMPLES; i++) {
      mixer.setTime((i / SAMPLES) * clip.duration);
      gltf.scene.updateMatrixWorld(true);
      for (const { mesh, data } of parts) {
        const { bones, boneInverses } = mesh.skeleton;
        bind.multiplyMatrices(mesh.matrixWorld, mesh.bindMatrixInverse);
        for (let j = 0; j < bones.length; j++) {
          matrix
            .copy(bind)
            .multiply(bones[j].matrixWorld)
            .multiply(boneInverses[j])
            .multiply(mesh.bindMatrix);
          matrix.toArray(
            data,
            ((clipIndex * SAMPLES + i) * bones.length + j) * 16,
          );
        }
      }
    }
  }
  const pose = new T.InstancedBufferAttribute(
    new Float32Array(COUNT * 3),
    3,
  ).setUsage(T.DynamicDrawUsage);
  return {
    duration,
    pose,
    items: parts.map(({ mesh, data }) => {
      const atlas = new T.DataTexture(
        data,
        mesh.skeleton.bones.length * 4,
        SAMPLES * 2,
        T.RGBAFormat,
        T.FloatType,
      );
      atlas.needsUpdate = true;
      const mat = mesh.material.clone();
      const clothing = /original top|plum satin|tailored business fabric/.test(
        mat.name,
      );
      if (clothing) {
        mat.color.set(0xffffff);
        mat.roughness = 0.84;
        if (mat.name.includes("plum satin")) mat.map = null;
      }
      const geometry = mesh.geometry.clone();
      geometry.setAttribute("pose", pose);
      const batch = new T.InstancedMesh(
        geometry,
        animateMaterial(mat, atlas),
        COUNT,
      );
      batch.frustumCulled = false;
      batch.instanceMatrix.setUsage(T.DynamicDrawUsage);
      batch.count = 0;
      batch.castShadow = true;
      batch.receiveShadow = true;
      batch.customDepthMaterial = animateMaterial(
        new T.MeshDepthMaterial({ depthPacking: T.RGBADepthPacking }),
        atlas,
      );
      scene.add(batch);
      return { batch, clothing };
    }),
  };
}
export async function loadCrowd(scene) {
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const rigs = await Promise.all(
    [maya, sam, jordan, harper].map(async (bytes) =>
      bakeRig(
        await loader.parseAsync(
          bytes.buffer.slice(
            bytes.byteOffset,
            bytes.byteOffset + bytes.byteLength,
          ),
          "",
        ),
        scene,
      ),
    ),
  );
  let cast = null,
    groups = [];
  return (guests, poses, time) => {
    if (cast !== guests) {
      cast = guests;
      groups = rigs.map((rig, r) => guests.filter((g) => g.rig === r));
      rigs.forEach((rig, i) =>
        rig.items.forEach(({ batch, clothing }) => {
          batch.count = groups[i].length;
          if (clothing) {
            groups[i].forEach((g, j) => batch.setColorAt(j, wardrobe[g.shirt]));
            if (batch.instanceColor) batch.instanceColor.needsUpdate = true;
          }
        }),
      );
    }
    rigs.forEach((rig, r) => {
      groups[r].forEach((g, j) => {
        const p = poses[g.id],
          offset = g.id * 0.217;
        rig.pose.setXYZ(
          j,
          ((time / HZ / rig.duration[0] + offset) % 1) * SAMPLES,
          ((p.travel / (WALK_DISTANCE * g.height) + offset) % 1) * SAMPLES,
          p.weight,
        );
        transform.position.set(p.x, 0.009, p.z);
        transform.scale.setScalar(g.height);
        transform.rotation.set(0, p.yaw, 0);
        transform.updateMatrix();
        for (const { batch } of rig.items)
          batch.setMatrixAt(j, transform.matrix);
      });
      rig.pose.needsUpdate = true;
      for (const { batch } of rig.items)
        batch.instanceMatrix.needsUpdate = true;
    });
  };
}
