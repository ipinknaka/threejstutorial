import { OrbitControls } from '../jsm/controls/OrbitControls';
import { GLTFLoader } from '../jsm/loaders/GLTFLoader';

import { GUI, GUIController } from 'dat.gui';
import { useEffect, useState } from 'react';
import {
    AmbientLight, AxesHelper, BoxGeometry,
    CameraHelper, CubeTextureLoader, DirectionalLight, DirectionalLightHelper,
    DoubleSide, Fog, FogExp2, GridHelper, Mesh, MeshBasicMaterial, MeshStandardMaterial,
    PerspectiveCamera, PlaneGeometry, Raycaster, Scene, ShaderMaterial, SphereGeometry, SpotLight, SpotLightHelper, TextureLoader, Vector2, WebGLRenderer
} from 'three';
import nebula from '../public/nebula.jpg';
import stars from '../public/stars.jpg';
import { render } from 'react-dom';
const monkeyUrl = new URL('../public/monkey.glb', import.meta.url);

type datImport = {
    default: typeof import("/home/coder/project/threejstutorial/node_modules/@types/dat.gui/index");
    GUI: typeof GUI;
    GUIController: typeof GUIController;
} | undefined;

export default function useAbsoluteBeginners() {
    const [renderer, setRenderer] = useState<WebGLRenderer>();
    useEffect(() => {
        setRenderer(new WebGLRenderer({ antialias: true }));
    }, []);

    const init = (datgui: GUI) => {

        renderer?.setSize(600, 600);
        renderer!.shadowMap.enabled = true;

        // const camera = new PerspectiveCamera(
        //     75,
        //     window.innerWidth / window.innerHeight,
        //     0.1,
        //     1000
        // );
        const camera = new PerspectiveCamera(75, 1, 0.1, 1000);
        const orbit = new OrbitControls(camera, renderer?.domElement);

        // camera.position.set(0, 2, 5);
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
        // const planeMaterial = new MeshBasicMaterial({ color: 0xFDFDFD, side: DoubleSide });
        const planeMaterial = new MeshStandardMaterial({ color: 0xFDFDFD, side: DoubleSide });
        const plane = new Mesh(planeGeometry, planeMaterial);
        scene.add(plane);
        plane.rotation.x = -0.5 * Math.PI;
        plane.receiveShadow = true;

        const gridHelper = new GridHelper(30);
        scene.add(gridHelper);

        const sphereGeometry = new SphereGeometry(4);
        // const sphereGeometry = new SphereGeometry(4, 50, 50);
        // const sphereMaterial = new MeshBasicMaterial({ color: 0x3300FF, wireframe: false });
        const sphereMaterial = new MeshStandardMaterial({ color: 0x3300FF, wireframe: false }); // need light to show material
        // const sphereMaterial = new MeshLambertMaterial({ color: 0x3300FF, wireframe: false }); // need light to show material

        const sphere = new Mesh(sphereGeometry, sphereMaterial);
        scene.add(sphere);
        sphere.position.set(-10, 10, 0)
        sphere.castShadow = true;

        const ambientLight = new AmbientLight(0x333333);
        scene.add(ambientLight);

        // --- Play with directional light
        // const directionalLight = new DirectionalLight(0xFFFFFF, 0.8);
        // scene.add(directionalLight);
        // directionalLight.position.set(-30, 50, 0);
        // directionalLight.castShadow = true;
        // directionalLight.shadow.camera.bottom = -12;

        // const dLightHelper = new DirectionalLightHelper(directionalLight, 5);
        // scene.add(dLightHelper);

        // const dLightShadowCameraHelper = new CameraHelper(directionalLight.shadow.camera);
        // scene.add(dLightShadowCameraHelper);
        // ---

        const spotLight = new SpotLight(0xFFFFFF);
        scene.add(spotLight);
        spotLight.position.set(-100, 100, 0);
        spotLight.castShadow = true;
        spotLight.angle = 0.2;

        const spotLightHelper = new SpotLightHelper(spotLight);
        scene.add(spotLightHelper);

        // scene.fog = new Fog(0xFFFFFF, 0, 200);
        scene.fog = new FogExp2(0xFFFFFF, 0.01);

        // renderer?.setClearColor(0x33FF33);
        const textureLoader = new TextureLoader();
        // scene.background = textureLoader.load(stars.src);

        const cubeTextureLoader = new CubeTextureLoader();
        scene.background = cubeTextureLoader.load([
            nebula.src,
            nebula.src,
            stars.src,
            stars.src,
            stars.src,
            stars.src,
        ]);

        const box2Geometry = new BoxGeometry(4, 4, 4);
        const box2Material = new MeshBasicMaterial({
            // color: 0x33FFFF,
            map: textureLoader.load(nebula.src)
        });
        const box2MultiMaterial = [
            new MeshBasicMaterial({ map: textureLoader.load(nebula.src) }),
            new MeshBasicMaterial({ map: textureLoader.load(stars.src) }),
            new MeshBasicMaterial({ map: textureLoader.load(stars.src) }),
            new MeshBasicMaterial({ map: textureLoader.load(stars.src) }),
            new MeshBasicMaterial({ map: textureLoader.load(stars.src) }),
            new MeshBasicMaterial({ map: textureLoader.load(stars.src) }),
        ];
        // const box2 = new Mesh(box2Geometry, box2Material);
        const box2 = new Mesh(box2Geometry, box2MultiMaterial);
        scene.add(box2);
        box2.position.set(0, 15, 10);
        box2.name = "TheBox";

        const mousePos = new Vector2();
        renderer?.domElement.addEventListener('mousemove', e => {
            //change to normailize coordinate
            // mousePos.x = (e.clientX / window.innerWidth) * 2 - 1;
            // mousePos.y = -(e.clientY / window.innerHeight) * 2 + 1;
            mousePos.x  = ( (e.clientX -renderer.domElement.offsetLeft) / renderer.domElement.width ) * 2 - 1;
            mousePos.y = -( (e.clientY - renderer.domElement.offsetTop) / renderer.domElement.height ) * 2 + 1;

            // console.log('xy', mousePos);
        });
        const raycaster = new Raycaster();
        const sphereId = sphere.id;

        const plane2Geometry = new PlaneGeometry(10, 10, 10, 10);
        const plane2Material = new MeshBasicMaterial({
            color: 0xFFFFFF,
            wireframe: true
        });
        const plane2 = new Mesh(plane2Geometry, plane2Material);
        scene.add(plane2);
        plane2.position.set(10, 10, 15);

        // //@ts-ignore
        // plane2.geometry.attributes.position.array[0] -= 2 * Math.random();
        // //@ts-ignore
        // plane2.geometry.attributes.position.array[1] -= 2 * Math.random();
        // //@ts-ignore
        // plane2.geometry.attributes.position.array[2] -= 2 * Math.random();

        const lastPointZ = plane2.geometry.attributes.position.array.length - 1;
        //@ts-ignore
        // plane2.geometry.attributes.position.array[lastPointZ] -= 2 * Math.random();

        //Can use script tag for shader/ check index.tsx Head section BUT not work cuz app bundler (webpack/nextjs)
        const vShader = `
            void main() {
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;
        const fShader = `
            void main() {
                gl_FragColor = vec4(0.5, 0.5, 1.0, 1.0);
            }
        `;
        const sphere2Geometry = new SphereGeometry(4);
        const sphere2Material = new ShaderMaterial({
            vertexShader: vShader,
            fragmentShader: fShader
            // vertexShader: document.getElementById("vertexShader")!.textContent!,
            // fragmentShader: document.getElementById("fragmentShader")!.textContent!
        });
        const sphere2 = new Mesh(sphere2Geometry, sphere2Material);
        scene.add(sphere2);
        sphere2.position.set(-5, 10, 10);

        const gltfLoader = new GLTFLoader();
        gltfLoader.load(monkeyUrl.href,
            (gltf: { scene: any; }) => {
                const model = gltf.scene;
                scene.add(model);
                model.position.set(-12, 4, 10);
            },
            undefined,
            (err: any) => {
                console.error(err);
            }
        );






        const options = {
            sphereColor: '#FFEA00',
            wireframe: false,
            speed: 0.01,
            angle: 0.04,
            penumbra: 0.5,
            intensity: 0.6,
        }
        datgui.addColor(options, 'sphereColor').onChange((e) => {
            sphere.material.color.set(e);
        });
        datgui.add(options, 'wireframe').onChange((e) => {
            sphere.material.wireframe = e;
        });
        datgui.add(options, 'speed', 0, 0.1);
        datgui.add(options, 'angle', 0, 1);
        datgui.add(options, 'penumbra', 0, 1);
        datgui.add(options, 'intensity', 0, 1);


        let step = 0;

        const animate = (time: number) => {
            // requestAnimationFrame(animate);

            box.rotation.x = time / 1000;
            box.rotation.y = time / 1000;
            step += options.speed;
            sphere.position.y = 10 * Math.abs(Math.sin(step));

            spotLight.angle = options.angle;
            spotLight.penumbra = options.penumbra;
            spotLight.intensity = options.intensity;
            spotLightHelper.update();


            raycaster.setFromCamera(mousePos, camera);
            const intersects = raycaster.intersectObjects(scene.children);
            // console.log(intersects);
            for (let i = 0; i < intersects.length; i++) {
                if (intersects[i].object.id === sphereId) {
                    //@ts-ignore
                    intersects[i].object.material.color.set(0xFFFFFF);
                }
                if (intersects[i].object.name === "TheBox") {
                    box2.rotation.x = time / 1000;
                    box2.rotation.y = time / 1000;
                }
            }

            //@ts-ignore
            plane2.geometry.attributes.position.array[0] -= 10 * Math.random();
            //@ts-ignore
            plane2.geometry.attributes.position.array[1] -= 10 * Math.random();
            //@ts-ignore
            plane2.geometry.attributes.position.array[2] -= 10 * Math.random();
            //@ts-ignore
            plane2.geometry.attributes.position.array[lastPointZ] = plane2.geometry.attributes.position.array[lastPointZ] + 2;

            renderer?.render(scene, camera);


        }
        // animate(0);
        renderer?.setAnimationLoop(animate);

        // window.addEventListener('resize', () => {
        //     camera.aspect = window.innerWidth / window.innerHeight;
        //     camera.updateProjectionMatrix();
        //     renderer?.setSize(window.innerWidth, window.innerHeight);
        // });
    }

    return {
        init: init,
        renderer: renderer
    };
}
