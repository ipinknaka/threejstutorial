// https://github.com/WaelYasmina/ThreeBoilerplate/blob/main/src/js/scripts.js
import { useEffect, useState } from 'react';
import {
    AmbientLight, AxesHelper, BoxGeometry,
    CameraHelper, CubeTextureLoader, DirectionalLight, DirectionalLightHelper,
    DoubleSide, Fog, FogExp2, GridHelper, Mesh, MeshBasicMaterial, MeshStandardMaterial,
    Object3D,
    PerspectiveCamera, PlaneGeometry, PointLight, Raycaster, RingGeometry, Scene, ShaderMaterial, SphereGeometry, SpotLight, SpotLightHelper, TextureLoader, Vector2, WebGLRenderer
} from 'three';
import { OrbitControls } from '../jsm/controls/OrbitControls';

export default function useTemplate() {
    const [renderer, setRenderer] = useState<WebGLRenderer>();
    useEffect(() => {
        setRenderer(new WebGLRenderer({ antialias: true }));
    }, []);

    const init = (statFPS: Stats) => {
        // renderer.setSize(window.innerWidth, window.innerHeight);
        renderer?.setSize(600, 600);
        // renderer!.shadowMap.enabled = true;
        renderer?.setClearColor(0xFEFEFE);

        // const camera = new PerspectiveCamera(
        //     45,
        //     window.innerWidth / window.innerHeight,
        //     0.1,
        //     1000
        // );
        const camera = new PerspectiveCamera(45, 1, 0.1, 1000);
        const orbit = new OrbitControls(camera, renderer?.domElement);

        camera.position.set(6, 8, 14);
        orbit.update(); //call update everytime change camera

        const scene = new Scene();


        const gridHelper = new GridHelper(12, 12);
        scene.add(gridHelper);

        // Sets the x, y, and z axes with each having a length of 4
        const axesHelper = new AxesHelper(4);
        scene.add(axesHelper);

        const animate = (time: number) => {
            statFPS.update();
            renderer?.render(scene, camera);
        }
        renderer?.setAnimationLoop(animate);
    }

    return {
        init: init,
        renderer: renderer
    };
}
