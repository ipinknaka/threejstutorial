// https://github.com/WaelYasmina/subdivideplane/blob/main/src/js/scripts.js
import { useEffect, useState } from 'react';
import {
    DoubleSide, GridHelper, Mesh, MeshBasicMaterial,
    PerspectiveCamera, PlaneGeometry, Raycaster, Scene, SphereGeometry, 
    Vector2, Vector3, WebGLRenderer
} from 'three';
import { OrbitControls } from '../jsm/controls/OrbitControls';

export default function useSubdividePlane() {
    const [renderer, setRenderer] = useState<WebGLRenderer>();
    useEffect(() => {
        setRenderer(new WebGLRenderer({ antialias: true }));
    }, []);

    const init = (statFPS: Stats) => {
        // renderer.setSize(window.innerWidth, window.innerHeight);
        renderer?.setSize(600, 600);
        // renderer!.shadowMap.enabled = true;
        renderer?.setClearColor(0x233333);

        // const camera = new PerspectiveCamera(
        //     45,
        //     window.innerWidth / window.innerHeight,
        //     0.1,
        //     1000
        // );
        const camera = new PerspectiveCamera(45, 1, 0.1, 1000);
        const orbit = new OrbitControls(camera, renderer?.domElement);

        camera.position.set(10, 15, -22);
        orbit.update(); //call update everytime change camera

        const scene = new Scene();

        const planeMesh = new Mesh(
            new PlaneGeometry(20, 20),
            new MeshBasicMaterial({
                side: DoubleSide,
                visible: false
            })
        );
        planeMesh.rotateX(-Math.PI / 2);
        scene.add(planeMesh);

        const grid = new GridHelper(20, 20);
        scene.add(grid);

        const highlightMesh = new Mesh(
            new PlaneGeometry(1, 1),
            new MeshBasicMaterial({
                side: DoubleSide,
                transparent: true
            })
        );
        highlightMesh.rotateX(-Math.PI / 2);
        highlightMesh.position.set(0.5, 0, 0.5);
        scene.add(highlightMesh);

        const mousePosition = new Vector2();
        const raycaster = new Raycaster();
        let intersects;
        const objects: Mesh<SphereGeometry, MeshBasicMaterial>[] = [];
        
        renderer?.domElement.addEventListener('mousemove', function (e) {
            // mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
            // mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
            mousePosition.x  = ( (e.clientX -renderer.domElement.offsetLeft) / renderer.domElement.width ) * 2 - 1;
            mousePosition.y = -( (e.clientY - renderer.domElement.offsetTop) / renderer.domElement.height ) * 2 + 1;

            raycaster.setFromCamera(mousePosition, camera);
            intersects = raycaster.intersectObject(planeMesh);
            if (intersects.length > 0) {
                const intersect = intersects[0];
                const highlightPos = new Vector3().copy(intersect.point).floor().addScalar(0.5);
                highlightMesh.position.set(highlightPos.x, 0, highlightPos.z);

                const objectExist = objects.find(function (object) {
                    return (object.position.x === highlightMesh.position.x)
                        && (object.position.z === highlightMesh.position.z)
                });

                if (!objectExist)
                    highlightMesh.material.color.setHex(0xFFFFFF);
                else
                    highlightMesh.material.color.setHex(0xFF0000);
            }
        });


        const sphereMesh = new Mesh(
            new SphereGeometry(0.4, 4, 2),
            new MeshBasicMaterial({
                wireframe: true,
                color: 0xFFEA00
            })
        );

        renderer?.domElement.addEventListener('mousedown', function () {
            const objectExist = objects.find(function (object) {
                return (object.position.x === highlightMesh.position.x)
                    && (object.position.z === highlightMesh.position.z)
            });

            if (!objectExist) {
                if (intersects.length > 0) {
                    const sphereClone = sphereMesh.clone();
                    sphereClone.position.copy(highlightMesh.position);
                    scene.add(sphereClone);
                    objects.push(sphereClone);
                    highlightMesh.material.color.setHex(0xFF0000);
                }
            }
        });


        const animate = (time: number) => {
            highlightMesh.material.opacity = 1 + Math.sin(time / 120);
            objects.forEach(function(object) {
                object.rotation.x = time / 1000;
                object.rotation.z = time / 1000;
                object.position.y = 0.5 + 0.5 * Math.abs(Math.sin(time / 1000));
            });

            statFPS.update();

            renderer?.render(scene, camera);
        }
        renderer?.setAnimationLoop(animate);

        // window.addEventListener('resize', function() {
        //     camera.aspect = window.innerWidth / window.innerHeight;
        //     camera.updateProjectionMatrix();
        //     renderer.setSize(window.innerWidth, window.innerHeight);
        // });
    }

    return {
        init: init,
        renderer: renderer
    };
}
