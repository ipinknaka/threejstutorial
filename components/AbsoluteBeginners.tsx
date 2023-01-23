import { Spinnaker } from '@next/font/google';
import { useEffect, useReducer, useRef, useState } from 'react';
import {
  WebGLRenderer, Scene, PerspectiveCamera,
  AxesHelper, BoxGeometry, MeshBasicMaterial, Mesh, PlaneGeometry, GridHelper, DoubleSide,
  SphereGeometry, MeshStandardMaterial, MeshLambertMaterial
} from 'three';
import { OrbitControls } from '../threejsm/OrbitControls';
import { GUI, GUIController } from 'dat.gui';


const spinnaker = Spinnaker({
  weight: '400',
  subsets: ['latin'],
});

export default function AbsoluteBeginners() {

  useEffect(() => {
    let renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(600, 600);

    const camera = new PerspectiveCamera(75, 1, 0.1, 1000);
    const orbit = new OrbitControls(camera, renderer.domElement);

    camera.position.set(0, 2, 5);
    camera.position.set(-10, 30, 30);
    orbit.update(); //call update everytime change camera


    const scene = new Scene();
    const axesHelper = new AxesHelper(5);
    scene.add(axesHelper);

    const boxGeometry = new BoxGeometry();
    const boxMaterial = new MeshBasicMaterial({ color: 0x00FF00 });
    const box = new Mesh(boxGeometry, boxMaterial);
    scene.add(box);

    const planeGeometry = new PlaneGeometry(30, 30);
    const planeMaterial = new MeshBasicMaterial({ color: 0xFDFDFD, side: DoubleSide });
    const plane = new Mesh(planeGeometry, planeMaterial);
    scene.add(plane);
    plane.rotation.x = -0.5 * Math.PI;

    const gridHelper = new GridHelper(30);
    scene.add(gridHelper);

    const sphereGeometry = new SphereGeometry(4);
    // const sphereGeometry = new SphereGeometry(4, 50, 50);
    const sphereMaterial = new MeshBasicMaterial({ color: 0x3300FF, wireframe: false });
    // const sphereMaterial = new MeshStandardMaterial({ color: 0x3300FF, wireframe: false }); // need light to show material
    // const sphereMaterial = new MeshLambertMaterial({ color: 0x3300FF, wireframe: false }); // need light to show material

    const sphere = new Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
    sphere.position.set(-10, 10, 0)

    //https://github.com/dataarts/dat.gui/issues/271
    // let gui: GUI;
    // const options = {
    //   sphereColor: '#FFEA00',
    //   wireframe: false,
    //   speed: 0.01
    // }
    // const setGui = async () => {
    //   const dat = await import('dat.gui');
    //   gui = new dat.GUI();
    //   // const gui = new dat.GUI({ autoPlace: false });
    //   // document.getElementById('gui')?.appendChild(gui.domElement);
    //   gui.addColor(options, 'sphereColor').onChange((e) => {
    //     sphere.material.color.set(e);
    //   });
    //   gui.add(options, 'wireframe').onChange((e) => {
    //     sphere.material.wireframe = e;
    //   });
    //   gui.add(options, 'speed', 0, 0.1);

    // }
    // setGui();


    // let step = 0;

    // const animate = (time: number) => {
    //   // stats.begin();
    //   // cube.rotation.x += 0.01;
    //   // cube.rotation.y += 0.01;
    //   // stats.end();
    //   requestAnimationFrame(animate);
    //   // box.rotation.x += 0.01;
    //   // box.rotation.y += 0.01;
    //   box.rotation.x = time / 1000;
    //   box.rotation.y = time / 1000;
    //   step += options.speed;
    //   sphere.position.y = 10 * Math.abs(Math.sin(step));
    //   renderer.render(scene, camera);
    //   // statFPS.update();
    //   // statMS.update();
    //   // statMB.update();
    // }
    // animate(0);

    const canvas = renderer.domElement as HTMLCanvasElement;
    document.getElementById("canvasAbsoluteBeginners")?.appendChild(canvas);


    return () => {
      document.getElementById("canvasAbsoluteBeginners")?.replaceChildren();
      // document.getElementById('gui')?.replaceChildren();
      setTimeout(() => {
        if (gui) gui.destroy();
        // document.getElementById('gui')?.replaceChildren();
      }, 1000);
      // if (gui.current) gui.current.destroy();
    }
  }, []);

  return (
    <div>
      <div id="canvasAbsoluteBeginners" className="w-[600px] h-[600px] bg-green-300"></div>
      <div id="gui"></div>
    </div>
  );
}