// https://www.youtube.com/watch?v=zMzuPIiznQ4&list=PLjcjAqAnHd1EIxV4FSZIiJZvsdrBc1Xho&index=14

import { useEffect, useState } from 'react';
import {
    ACESFilmicToneMapping,
    EquirectangularReflectionMapping, GridHelper, LoadingManager,
    PerspectiveCamera, Scene, sRGBEncoding, Texture, WebGLRenderer
} from 'three';
import { OrbitControls } from '@/jsm/controls/OrbitControls';
import { GLTFLoader } from '@/jsm/loaders/GLTFLoader';
import { RGBELoader } from '@/jsm/loaders/RGBELoader';

export default function useLoading() {
    const [renderer, setRenderer] = useState<WebGLRenderer>();
    useEffect(() => {
        setRenderer(new WebGLRenderer({ antialias: true }));
    }, []);

    const init = (statFPS: Stats) => {
        document.getElementById('progressWindow')!.style.display = "flex";
        renderer?.setSize(600, 600);
        renderer?.setClearColor(0xA3A3A3);

        const camera = new PerspectiveCamera(45, 1, 0.1, 1000);
        const orbit = new OrbitControls(camera, renderer?.domElement);

        camera.position.set(6, 6, 6);
        orbit.update(); //call update everytime change camera

        const scene = new Scene();


        const gridHelper = new GridHelper(30, 30);
        scene.add(gridHelper);

        const loadingManager = new LoadingManager();
        loadingManager.onStart = (url, loaded, total) => {
            console.log('onStart', url, loaded, total);
        };
        loadingManager.onProgress = (url, loaded, total) => {
            console.log('onProgress', url, loaded, total);
            (document.getElementById('progressBar') as HTMLProgressElement)!.value! = (loaded / total) * 100;
        };
        loadingManager.onLoad = () => {
            console.log('onLoad');
            document.getElementById('progressWindow')!.style.display = "none";
        };
        loadingManager.onError = (url) => {
            console.log('onError', url);
        };

        const gltfLoader = new GLTFLoader(loadingManager);

        const rgbeLoader = new RGBELoader(loadingManager);

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
