import { useEffect, useState } from 'react';
import {
    AmbientLight, AxesHelper, BoxGeometry,
    CameraHelper, CubeTextureLoader, DirectionalLight, DirectionalLightHelper,
    DoubleSide, Fog, FogExp2, GridHelper, Mesh, MeshBasicMaterial, MeshStandardMaterial,
    Object3D,
    PerspectiveCamera, PlaneGeometry, PointLight, Raycaster, RingGeometry, Scene, ShaderMaterial, SphereGeometry, SpotLight, SpotLightHelper, TextureLoader, Vector2, WebGLRenderer
} from 'three';
import { OrbitControls } from '../jsm/controls/OrbitControls';

import starsTexture from '../public/stars.jpg';
import sunTexture from '../public/sun.jpg';
import mercuryTexture from '../public/mercury.jpg';
import venusTexture from '../public/venus.jpg';
import earthTexture from '../public/earth.jpg';
import marsTexture from '../public/mars.jpg';
import jupiterTexture from '../public/jupiter.jpg';
import saturnTexture from '../public/saturn.jpg';
import saturnRingTexture from '../public/saturn ring.png';
import uranusTexture from '../public/uranus.jpg';
import uranusRingTexture from '../public/uranus ring.png';
import neptuneTexture from '../public/neptune.jpg';
import plutoTexture from '../public/pluto.jpg';
import { StaticImageData } from 'next/image';

export default function useSolarSystem() {
    const [renderer, setRenderer] = useState<WebGLRenderer>();
    useEffect(() => {
        setRenderer(new WebGLRenderer({ antialias: true }));
    }, []);

    const init = () => {

        renderer?.setSize(600, 600);
        renderer!.shadowMap.enabled = true;

        // const camera = new PerspectiveCamera(
        //     45,
        //     window.innerWidth / window.innerHeight,
        //     0.1,
        //     1000
        // );
        const camera = new PerspectiveCamera(45, 1, 0.1, 1000);
        const orbit = new OrbitControls(camera, renderer?.domElement);

        camera.position.set(-90, 140, 140);
        orbit.update(); //call update everytime change camera

        const scene = new Scene();

        const ambientLight = new AmbientLight(0x333333);
        scene.add(ambientLight);


        const cubeTextureLoader = new CubeTextureLoader();
        scene.background = cubeTextureLoader.load([
            starsTexture.src,
            starsTexture.src,
            starsTexture.src,
            starsTexture.src,
            starsTexture.src,
            starsTexture.src,
        ]);

        const textureLoader = new TextureLoader();

        const sunGeo = new SphereGeometry(16, 30, 30);
        const sunMat = new MeshBasicMaterial({
            map: textureLoader.load(sunTexture.src)
        });
        const sun = new Mesh(sunGeo, sunMat);
        scene.add(sun);

        type RingType = {
            innerRadius: number;
            outerRadius: number;
            texture: string;
        }
        function createPlanet(size: number, texture: string, position: number, ring?: RingType) {
            const geo = new SphereGeometry(size, 30, 30);
            const mat = new MeshStandardMaterial({
                map: textureLoader.load(texture)
            });
            const mesh = new Mesh(geo, mat);
            const obj = new Object3D();
            obj.add(mesh);
            if (ring) {
                const ringGeo = new RingGeometry(
                    ring.innerRadius,
                    ring.outerRadius,
                    32);
                const ringMat = new MeshBasicMaterial({
                    map: textureLoader.load(ring.texture),
                    side: DoubleSide
                });
                const ringMesh = new Mesh(ringGeo, ringMat);
                obj.add(ringMesh);
                ringMesh.position.x = position;
                ringMesh.rotation.x = -0.5 * Math.PI;
            }
            scene.add(obj);
            mesh.position.x = position;
            return { mesh, obj }
        }

        const mercury = createPlanet(3.2, mercuryTexture.src, 28);
        const venus = createPlanet(5.8, venusTexture.src, 44);
        const earth = createPlanet(6, earthTexture.src, 62);
        const mars = createPlanet(4, marsTexture.src, 78);
        const jupiter = createPlanet(12, jupiterTexture.src, 100);
        const saturn = createPlanet(10, saturnTexture.src, 138, {
            innerRadius: 10,
            outerRadius: 20,
            texture: saturnRingTexture.src
        });
        const uranus = createPlanet(7, uranusTexture.src, 176, {
            innerRadius: 7,
            outerRadius: 12,
            texture: uranusRingTexture.src
        });
        const neptune = createPlanet(7, neptuneTexture.src, 200);
        const pluto = createPlanet(2.8, plutoTexture.src, 216);

        const pointLight = new PointLight(0xFFFFFF, 2, 300);
        scene.add(pointLight);




        const animate = (time: number) => {
            //Self-rotation
            sun.rotateY(0.004);
            mercury.mesh.rotateY(0.004);
            venus.mesh.rotateY(0.002);
            earth.mesh.rotateY(0.02);
            mars.mesh.rotateY(0.018);
            jupiter.mesh.rotateY(0.04);
            saturn.mesh.rotateY(0.038);
            uranus.mesh.rotateY(0.03);
            neptune.mesh.rotateY(0.032);
            pluto.mesh.rotateY(0.008);

            //Around-sun-rotation
            mercury.obj.rotateY(0.04);
            venus.obj.rotateY(0.015);
            earth.obj.rotateY(0.01);
            mars.obj.rotateY(0.008);
            jupiter.obj.rotateY(0.002);
            saturn.obj.rotateY(0.0009);
            uranus.obj.rotateY(0.0004);
            neptune.obj.rotateY(0.0001);
            pluto.obj.rotateY(0.00007);

            renderer?.render(scene, camera);
        }

        renderer?.setAnimationLoop(animate);
    }

    return {
        init: init,
        renderer: renderer
    };
}
