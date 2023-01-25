// https://github.com/WaelYasmina/ThreeBoilerplate/blob/main/src/js/scripts.js
import { useEffect, useState } from 'react';
import {
    AmbientLight, AxesHelper, BoxGeometry,
    CameraHelper, CubeTextureLoader, DirectionalLight, DirectionalLightHelper,
    DoubleSide, Fog, FogExp2, GridHelper, Mesh, MeshBasicMaterial, MeshStandardMaterial,
    Object3D,
    PerspectiveCamera, Plane, PlaneGeometry, PointLight, Raycaster, RingGeometry, Scene, ShaderMaterial, SphereGeometry, SpotLight, SpotLightHelper, TextureLoader, Vector2, Vector3, WebGLRenderer
} from 'three';
import { OrbitControls } from '../jsm/controls/OrbitControls';

export default function useObjectOnMouseClick() {
    const [renderer, setRenderer] = useState<WebGLRenderer>();
    useEffect(() => {
        setRenderer(new WebGLRenderer({ antialias: true }));
    }, []);

    const init = () => {
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


        const mouse = new Vector2();
        const intersectionPoint = new Vector3();
        const planeNormal = new Vector3();
        const plane = new Plane();
        const raycaster = new Raycaster(); 

        renderer?.domElement.addEventListener('mousemove', (e) => {
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            planeNormal.copy(camera.position).normalize();
            // plane.setFromNormalAndCoplanarPoint(planeNormal, new Vector3(0,0,0));
            plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
            raycaster.setFromCamera(mouse, camera);
            raycaster.ray.intersectPlane(plane, intersectionPoint);
        });

        renderer?.domElement.addEventListener('click', (e) => {
            const sphereGeo = new SphereGeometry(0.125, 30, 30);
            const sphereMat = new MeshStandardMaterial({
                color: 0xFFEA00,
                metalness: 0,
                roughness: 0
            });
            const sphere = new Mesh(sphereGeo, sphereMat);
            scene.add(sphere);
            sphere.position.copy(intersectionPoint);
        });

        const animate = (time: number) => {
            renderer?.render(scene, camera);
        }
        renderer?.setAnimationLoop(animate);
    }

    return {
        init: init,
        renderer: renderer
    };
}
