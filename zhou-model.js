import * as T from './vendor/three.module.js';
import {GLTFLoader} from './vendor/GLTFLoader.js';
let pending,skullPending;
export function loadZhou(){pending??=new GLTFLoader().loadAsync('models/zhoukoudian.glb').then(gltf=>{gltf.scene.traverse(o=>{if(o.isMesh){o.material.roughness=1;o.material.metalness=0;o.material.normalScale.set(.4,.4);o.castShadow=o.receiveShadow=true}});return gltf.scene});return pending}
export function cloneZhou(root,scale=1){const group=root.clone(true);group.traverse(o=>{if(o.isMesh){o.geometry=o.geometry.clone();o.material=o.material.clone();}});group.scale.setScalar(scale);return group}
export function loadSkull(){skullPending??=new GLTFLoader().loadAsync('models/zhou-skull.glb?v=2').then(gltf=>{gltf.scene.traverse(o=>{if(o.isMesh){o.material.roughness=1;o.material.metalness=0;o.castShadow=o.receiveShadow=true}});return gltf.scene});return skullPending}
export function cloneSkull(root,scale=1.45){const group=root.clone(true);group.traverse(o=>{if(o.isMesh){o.geometry=o.geometry.clone();o.material=o.material.clone()}});group.scale.setScalar(scale);return group}
export const ZHOU_NAME='Zhoukoudian Site';
// Coordinates refer to the normalized, Y-up scan; all camera movement remains inside the site viewer.
export const ZHOU_VIEWS={overview:{eye:[-3.6,3.4,-6.7],target:[0,.85,0]},detail:{eye:[-1.5,.7,-1.25],target:[-1.1,.45,.35]},door:[2.5,1,-.4],detailMarker:[-1.6,.45,-.2]};
export const SKULL_VIEW={eye:[-5,3.2,6.3],target:[0,.72,0]};
