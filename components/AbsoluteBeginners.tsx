import { Spinnaker } from '@next/font/google';
import { useEffect, useReducer, useRef } from 'react';
import { WebGLRenderer, Scene, PerspectiveCamera, AxesHelper, Raycaster, Vector2 } from 'three';

const spinnaker = Spinnaker({
  weight: '400',
  subsets: ['latin'],
})

export default function AbsoluteBeginners() {
  const didRunRef = useRef(false);
  useEffect(() => {
    if (!didRunRef.current) {
      didRunRef.current = true;
      let renderer = new WebGLRenderer({ antialias: true });
      renderer.setSize(600, 600);
      const scene = new Scene();
      const camera = new PerspectiveCamera(75, 1, 0.1, 1000);
      const axesHelper = new AxesHelper(5);
      scene.add(axesHelper);
      camera.position.set(0, 2, 5);

      const animate = () => {
        // stats.begin();
        // cube.rotation.x += 0.01;
        // cube.rotation.y += 0.01;
        // stats.end();
        requestAnimationFrame(animate);
        // cube.rotation.x += 0.01;
        // cube.rotation.y += 0.01;
        renderer.render(scene, camera);
        // statFPS.update();
        // statMS.update();
        // statMB.update();
      }
      animate();

      const canvas = renderer.domElement as HTMLCanvasElement;
      document.getElementById("canvasAbsoluteBeginners")?.appendChild(canvas);
    }
  }, []);

  return (
    <div id="canvasAbsoluteBeginners" className="w-[600px] h-[600px] bg-green-300"></div>
  );
}