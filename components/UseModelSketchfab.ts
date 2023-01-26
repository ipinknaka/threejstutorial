// https://www.youtube.com/watch?v=f1RbD_wkGpc
// https://github.com/WaelYasmina/modelSketchfab/blob/main/src/js/scripts.js

import { useEffect, useState } from 'react';
import {
    ACESFilmicToneMapping,
    AmbientLight, AxesHelper, BoxGeometry,
    CameraHelper, CubeTextureLoader, DirectionalLight, DirectionalLightHelper,
    DoubleSide, EquirectangularReflectionMapping, Fog, FogExp2, GridHelper, Mesh, MeshBasicMaterial, MeshStandardMaterial,
    Object3D,
    PerspectiveCamera, PlaneGeometry, PointLight, Raycaster, RingGeometry, Scene, ShaderMaterial, SphereGeometry, SpotLight, SpotLightHelper, sRGBEncoding, Texture, TextureLoader, Vector2, WebGLRenderer
} from 'three';
import { OrbitControls } from '@/jsm/controls/OrbitControls';
import { GLTFLoader } from '@/jsm/loaders/GLTFLoader';
import { RGBELoader } from '@/jsm/loaders/RGBELoader';

export default function useModelSketchfab() {
    const [renderer, setRenderer] = useState<WebGLRenderer>();
    useEffect(() => {
        setRenderer(new WebGLRenderer({ antialias: true }));
    }, []);

    const init = (statFPS: Stats) => {
        renderer?.setSize(600, 600);
        renderer?.setClearColor(0xA3A3A3);

        const camera = new PerspectiveCamera(45, 1, 0.1, 1000);
        const orbit = new OrbitControls(camera, renderer?.domElement);

        camera.position.set(6, 6, 6);
        orbit.update(); //call update everytime change camera

        const scene = new Scene();


        const gridHelper = new GridHelper(30, 30);
        scene.add(gridHelper);

        // const ambientLight = new THREE.AmbientLight(0xededed, 0.8);
        // scene.add(ambientLight);

        // const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
        // scene.add(directionalLight);
        // directionalLight.position.set(10, 11, 7);

        const gltfLoader = new GLTFLoader();

        const rgbeLoader = new RGBELoader();

        renderer!.outputEncoding = sRGBEncoding;
        renderer!.toneMapping = ACESFilmicToneMapping;
        renderer!.toneMappingExposure = 4;

        let car: any;

        rgbeLoader.load('/MR_INT-005_WhiteNeons_NAD.hdr', function (texture: Texture) {
            texture.mapping = EquirectangularReflectionMapping;
            scene.environment = texture;

            gltfLoader.load('/free_1975_porsche_911_930_turbo/scene.gltf', function (gltf: { scene: any; }) {
                const model = gltf.scene;
                scene.add(model);
                car = model;
            });
        });



        const animate = (time: number) => {
            statFPS.update();
            if (car) car.rotation.y = - time / 3000;
            renderer?.render(scene, camera);
        }
        renderer?.setAnimationLoop(animate);
    }

    return {
        init: init,
        renderer: renderer
    };
}
