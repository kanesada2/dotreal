<template>
  <div id="container" class="w-screen h-screen">

  </div>
</template>

<script>
import * as THREE from "three";
import { MindARThree } from "mind-ar/dist/mindar-image-three.prod.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { onMounted, ref, resolveComponent } from "vue";

export default {
  name: "ARScene",
  setup() {
    onMounted(async () => {
      let renderAnimationId;
      const container = document.getElementById('container');
      const mindarThree = new MindARThree({
        container: container,
        maxTrack: 2,
        imageTargetSrc: "./targets.mind"
      });
      const { renderer, scene, camera } = mindarThree;

      const anchor0 = mindarThree.addAnchor(0);
      const anchor1 = mindarThree.addAnchor(1);

      const light = new THREE.AmbientLight(0xffffff, 4);
      scene.add(light);

      const loader = new GLTFLoader();
      const tomato = await new Promise((resolve) => {
        loader.load("./models/tomato.glb", (gltf) => {
          resolve(gltf);
        });
      });
      const pione = await new Promise((resolve) => {
        loader.load("./models/pione.glb", (gltf) => {
          resolve(gltf);
        });
      });

      const mixer = new THREE.AnimationMixer(pione.scene);
      tomato.animations.forEach((clip) => {
        const action = mixer.clipAction(clip);
        action.setLoop(THREE.LoopRepeat);
        action.clampWhenFinished = true;
        action.play();
      });
      pione.animations.forEach((clip) => {
        const action = mixer.clipAction(clip);
        action.setLoop(THREE.LoopRepeat);
        action.clampWhenFinished = true;
        action.play();
      });
      anchor0.group.add(tomato.scene);
      anchor1.group.add(pione.scene);

      const clock = new THREE.Clock();
      const update = () => {
        const delta = clock.getDelta();
        if (mixer) mixer.update(delta);
        renderer.render(scene, camera);
        renderAnimationId = requestAnimationFrame(update);
      };

      mindarThree.start();
      update();

    })
  }
}
</script>

<style>

</style>