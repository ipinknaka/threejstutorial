// https://www.youtube.com/watch?v=xZM8UJqN1eY&list=PLjcjAqAnHd1EIxV4FSZIiJZvsdrBc1Xho&index=5
import { useEffect, useState } from 'react';
import {
    AxesHelper, Clock, GridHelper, Mesh, PerspectiveCamera, PlaneGeometry, Scene,
    ShaderMaterial,
    TextureLoader,
    Vector2,
    WebGLRenderer
} from 'three';
import { OrbitControls } from '../jsm/controls/OrbitControls';
import nebula from '../public/nebula.jpg';

export default function useShaderSyntax() {
    const [renderer, setRenderer] = useState<WebGLRenderer>();
    useEffect(() => {
        setRenderer(new WebGLRenderer({ antialias: true }));
    }, []);

    const init = () => {
        // renderer.setSize(window.innerWidth, window.innerHeight);
        renderer?.setSize(600, 600);
        // renderer!.shadowMap.enabled = true;
        renderer?.setClearColor(0x111111);

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


        // const gridHelper = new GridHelper(10, 10);
        // scene.add(gridHelper);

        // Sets the x, y, and z axes with each having a length of 4
        const axesHelper = new AxesHelper(4);
        scene.add(axesHelper);

        const uniforms = {
            u_time: { type: 'f', value: 0.0 },
            // u_resolution: { type: 'v2', value: new Vector2(window.innerWidth, window.innerHeight).multiplyScalar(window.devicePixelRatio) },
            u_resolution: { type: 'v2', value: new Vector2(600, 600).multiplyScalar(window.devicePixelRatio) },
            u_mouse: { type: 'v2', value: new Vector2(0.0, 0.0) },
            image: { type: 't', value: new TextureLoader().load(nebula.src) }
        }
        const vShader = `
            uniform float u_time;
            varying vec2 vUv;
            void main() {
                vUv = uv;
                //float newX = sin(position.x * u_time) * sin(position.y * u_time);
                //vec3 newPosition = vec3(newX, position.y, position.z);
                //gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;
        const fShader = `
            uniform float u_time;
            uniform vec2 u_resolution;
            uniform vec2 u_mouse;
            uniform sampler2D image;
            varying vec2 vUv;
            void main() {
                // vec2 st = gl_FragCoord.xy / u_resolution;
                // gl_FragColor = vec4(0.0, st.x, st.y, 1.0);
                // gl_FragColor = vec4(0.0, u_mouse.x, u_mouse.y, 1.0);

                //vec2 st = gl_FragCoord.xy / u_resolution;
                //vec4 texture = texture2D(image, st);
                //gl_FragColor = vec4(0.0, texture.g, 0.0, 1.0);

                //vec2 st = gl_FragCoord.xy / u_resolution;
                //vec4 texture = texture2D(image, st);
                //gl_FragColor = vec4(texture.r, texture.g, texture.b, 1.0);

                // vec2 st = gl_FragCoord.xy / u_resolution;
                // vec4 texture = texture2D(image, st);
                // float effect = abs(sin(texture.x + u_time));
                // gl_FragColor = vec4(vec3(effect), 1.0);

                vec4 texture = texture2D(image, vUv);
                float effect = abs(sin(texture.x + u_time));
                gl_FragColor = vec4(vec3(effect), 1.0);
            }
        `;
        renderer?.domElement.addEventListener('mousemove', (e) => {
            uniforms.u_mouse.value.set(e.screenX / window.innerWidth, 1 - e.screenY / window.innerHeight);
        });
        const planeGeo = new PlaneGeometry(10, 10, 30, 30);
        const planeMat = new ShaderMaterial({
            vertexShader: vShader,
            fragmentShader: fShader,
            // wireframe: true,
            uniforms: uniforms
        });
        const plane = new Mesh(planeGeo, planeMat);
        scene.add(plane);

        const clock = new Clock();

        const animate = (time: number) => {
            uniforms.u_time.value = clock.getElapsedTime();
            renderer?.render(scene, camera);
        }
        renderer?.setAnimationLoop(animate);
    }

    return {
        init: init,
        renderer: renderer
    };
}
