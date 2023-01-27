// https://www.youtube.com/watch?v=0ZW3xrFhY3w&list=PLjcjAqAnHd1EIxV4FSZIiJZvsdrBc1Xho&index=43

import { useEffect, useState } from 'react';
import {
    ArrowHelper,
    AxesHelper, GridHelper, Group, Mesh, MeshBasicMaterial, PerspectiveCamera, Raycaster, Scene,
    SphereGeometry,
    Vector2,
    WebGLRenderer
} from 'three';
import { OrbitControls } from '../jsm/controls/OrbitControls';
import { CSS2DRenderer, CSS2DObject } from '../jsm/renderers/CSS2DRenderer';

export default function useCSS2DRenderer() {
    const [renderer, setRenderer] = useState<WebGLRenderer>();
    useEffect(() => {
        setRenderer(new WebGLRenderer({ antialias: true }));
    }, []);

    const init = (statFPS: Stats) => {
        renderer?.setSize(600, 600);
        renderer?.setClearColor(0x333333);

        const camera = new PerspectiveCamera(45, 1, 0.1, 1000);
        const orbit = new OrbitControls(camera, renderer?.domElement);

        const scene = new Scene();

        camera.position.set(0, 6, 15);
        camera.lookAt(scene.position);
        orbit.update(); //call update everytime change camera

        const gridHelper = new GridHelper(12, 12);
        scene.add(gridHelper);

        // Sets the x, y, and z axes with each having a length of 4
        const axesHelper = new AxesHelper(4);
        scene.add(axesHelper);


        const labelCSS2DRenderer = new CSS2DRenderer();
        labelCSS2DRenderer.setSize(600, 600);
        labelCSS2DRenderer.domElement.style.position = 'absolute';
        labelCSS2DRenderer.domElement.style.top = '0px';
        labelCSS2DRenderer.domElement.style.zIndex = '10';
        labelCSS2DRenderer.domElement.style.pointerEvents = 'none'; // Pass mouse events to under div

        const canvasParent = document.getElementById('canvasParent');
        canvasParent?.appendChild(labelCSS2DRenderer.domElement);



        function createCPointMesh(name: string, x: number, y: number, z: number) {
            const geo = new SphereGeometry(0.1);
            const mat = new MeshBasicMaterial({ color: 0xFF0000 });
            const mesh = new Mesh(geo, mat);
            mesh.position.set(x, y, z);
            mesh.name = name;
            return mesh;
        }
        const group = new Group();
        const sphere1 = createCPointMesh('sphere1', -6, 0, 4);
        group.add(sphere1);
        const sphere2 = createCPointMesh('sphere2', 6, 0, 4);
        group.add(sphere2);
        const sphere3 = createCPointMesh('sphere3', 2, 2, 2);
        group.add(sphere3);
        scene.add(group);

        // const p = document.createElement('p');
        // p.textContent = 'Hello';
        // // const cPointLabel = new CSS2DObject(p);
        // // scene.add(cPointLabel);
        // // cPointLabel.position.set(-6, 0.8, 4);
        // const div = document.createElement('div');
        // div.appendChild(p);
        // const divContainer = new CSS2DObject(div);
        // scene.add(divContainer);
        const p = document.createElement('p');
        p.className = 'block';
        const pContainer = document.createElement('div');
        pContainer.appendChild(p);
        const sphereLabel = new CSS2DObject(pContainer);
        scene.add(sphereLabel);

        const mousePos = new Vector2();
        const raycaster = new Raycaster();
        renderer?.domElement.addEventListener('mousemove', function (e) {
            // mousePos.x = ((e.clientX - renderer.domElement.offsetLeft) / renderer.domElement.width) * 2 - 1;
            // mousePos.y = -((e.clientY - renderer.domElement.offsetTop) / renderer.domElement.height) * 2 + 1;
            mousePos.x = ((e.clientX - renderer.domElement.parentElement?.offsetLeft!) / 600) * 2 - 1;
            mousePos.y = -((e.clientY - renderer.domElement.parentElement?.offsetTop!) / 600) * 2 + 1;
            raycaster.setFromCamera(mousePos, camera);
            const intersects = raycaster.intersectObject(group);
            if (intersects.length > 0) {
                console.log(intersects[0].object.name);
                switch (intersects[0].object.name) {
                    case "sphere1":
                        p.className = "block font-bold text-xl text-red-500";
                        sphereLabel.position.set(-6, 0, 4);
                        p.textContent = 'Sphere 1';
                        break;
                    case "sphere2":
                        p.className = "block";
                        sphereLabel.position.set(6, 0, 4);
                        p.textContent = 'Sphere 2';
                        break;
                    case "sphere3":
                        p.className = "block";
                        sphereLabel.position.set(2, 2, 2);
                        p.textContent = 'Sphere 3';
                        break;
                    default:
                        console.log('default');
                }
            } else {
                p.className = "hidden";
            }
        });
        // let arrow: ArrowHelper;
        // renderer?.domElement.addEventListener('mousedown', function (e) {
        //     mousePos.x = ((e.clientX - renderer.domElement.parentElement?.offsetLeft!) / 600) * 2 - 1;
        //     mousePos.y = -((e.clientY - renderer.domElement.parentElement?.offsetTop!) / 600) * 2 + 1;
        //     console.log('mousedown', mousePos.x, mousePos.y);
        //     scene.remove(arrow);
        //     arrow = new ArrowHelper(raycaster.ray.direction, raycaster.ray.origin, 8, 0xff0000);
        //     scene.add(arrow);
        // });
        const animate = (time: number) => {
            statFPS.update();
            labelCSS2DRenderer.render(scene, camera);
            renderer?.render(scene, camera);
        }
        renderer?.setAnimationLoop(animate);
    }

    return {
        init: init,
        renderer: renderer
    };
}
