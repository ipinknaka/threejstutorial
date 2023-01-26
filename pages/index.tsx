import Head from 'next/head';
import { Baloo_2 } from '@next/font/google';
import { useEffect, useState } from 'react';
import { GUI, GUIController } from 'dat.gui';
import Stats from 'stats.js';

import useAbsoluteBeginners from '@/components/UseAbsoluteBeginners';
import useSolarSystem from '@/components/UseSolarSystem';
import useTemplate from '@/components/UseTemplate';
import useShaderSyntax from '@/components/UseShaderSyntax';
import useObjectOnMouseClick from '@/components/UseObjectOnMouseClick';
import useSubdividePlane from '@/components/UseSubdividePlane';
import useModelSketchfab from '@/components/UseModelSketchfab';
import useLoading from '@/components/UseLoading';

const baloo2 = Baloo_2({
  subsets: ['latin'],
});

type TopMenuProps = {
  title: string;
  selectedTitle: string;
}
const TopMenu = ({ title, selectedTitle }: TopMenuProps) => {
  return (
    <div data-name={title}
      className={`cursor-pointer w-fit text-xl mt-4 px-2 rounded-md ${(title == selectedTitle) ? 'bg-green-400' : 'bg-slate-300'}`}>
      {title}
    </div>
  );
}

type datImport = {
  default: typeof import("/home/coder/project/threejstutorial/node_modules/@types/dat.gui/index");
  GUI: typeof GUI;
  GUIController: typeof GUIController;
} | undefined;

export default function Home() {
  const [selectedMenu, setSelectedMenu] = useState("");
  const [dat, setDat] = useState<datImport>();
  const [datGui, setDatGui] = useState<GUI>();

  const ab = useAbsoluteBeginners();
  const ss = useSolarSystem();
  const tp = useTemplate();
  const shaderSyntax = useShaderSyntax();
  const omc = useObjectOnMouseClick();
  const subpl = useSubdividePlane();
  const msf = useModelSketchfab();
  const loading = useLoading();

  const topMenuOnClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    //@ts-ignore
    const ds = e.target.dataset;
    if ('name' in ds) {
      setSelectedMenu(ds.name);
    }
  }

  useEffect(() => {
    //https://github.com/dataarts/dat.gui/issues/271
    const getGui = async () => {
      const dati = await import('dat.gui');
      setDat(dati);
    }
    getGui();
  }, []);

  useEffect(() => {
    if (dat) {
      document.getElementById("statsParent")?.replaceChildren();
      const statFPS = new Stats();
      statFPS.showPanel(0);
      // statFPS.dom.style.cssText = 'position:absolute;top:30px;left:10px;';
      statFPS.dom.style.cssText = 'position:relative;top:10px;left:10px;';
      document.getElementById("statsParent")?.appendChild(statFPS.dom);

      document.getElementById("canvasParent")?.replaceChildren();
      if (datGui) {
        datGui.destroy();
        setDatGui(undefined);
      }
      document.getElementById("guiParent")?.replaceChildren();
      let datgui: GUI;
      datgui = new dat.GUI({ autoPlace: false });
      document.getElementById("guiParent")?.appendChild(datgui.domElement);
      setDatGui(datgui);
      let canvas: HTMLCanvasElement;
      const m = menu.find(el => el.name === selectedMenu);
      switch (selectedMenu) {
        case "Absolute Beginners":
          ab.init(statFPS, datgui);
          canvas = ab.renderer?.domElement as HTMLCanvasElement;
          break;

        case "Solar System":
          ss.init(statFPS);
          canvas = ss.renderer?.domElement as HTMLCanvasElement;
          break;

        case "Template":
          tp.init(statFPS);
          canvas = tp.renderer?.domElement as HTMLCanvasElement;
          break;

        case "Shader Syntax":
          shaderSyntax.init(statFPS);
          canvas = shaderSyntax.renderer?.domElement as HTMLCanvasElement;
          break;

        case "Object on mouse click":
          omc.init(statFPS);
          canvas = omc.renderer?.domElement as HTMLCanvasElement;
          break;

        case "Subdivide A Plane":
          subpl.init(statFPS);
          canvas = subpl.renderer?.domElement as HTMLCanvasElement;
          break;

        case "Model Sketchfab":
          msf.init(statFPS);
          canvas = msf.renderer?.domElement as HTMLCanvasElement;
          break;

        case "loading":
          loading.init(statFPS);
          canvas = loading.renderer?.domElement as HTMLCanvasElement;
          break;

        default:
          canvas = document.createElement('canvas');
      }
      document.getElementById("canvasParent")?.appendChild(canvas);
      document.getElementById("info")!.textContent = m!.link;
    }
  }, [selectedMenu]);

  const menu = [
    {
      name: 'Template',
      link: 'https://github.com/WaelYasmina/ThreeBoilerplate/blob/main/src/js/scripts.js'
    },
    {
      name: 'Absolute Beginners',
      link: 'https://www.youtube.com/watch?v=xJAfLdUgdc4&list=PLjcjAqAnHd1EIxV4FSZIiJZvsdrBc1Xho'
    },
    {
      name: 'Solar System',
      link: 'https://www.youtube.com/watch?v=XXzqSAt3UIw&list=PLjcjAqAnHd1EIxV4FSZIiJZvsdrBc1Xho&index=2'
    },
    {
      name: 'Shader Syntax',
      link: 'https://www.youtube.com/watch?v=xZM8UJqN1eY&list=PLjcjAqAnHd1EIxV4FSZIiJZvsdrBc1Xho&index=5'
    },
    {
      name: 'Object on mouse click',
      link: 'https://www.youtube.com/watch?v=By9qRmcrTzs&list=PLjcjAqAnHd1EIxV4FSZIiJZvsdrBc1Xho&index=6'
    },
    {
      name: 'Subdivide A Plane',
      link: 'https://www.youtube.com/watch?v=oQbfy8QP8Lc&list=PLjcjAqAnHd1EIxV4FSZIiJZvsdrBc1Xho&index=8'
    },
    {
      name: 'Model Sketchfab',
      link: 'https://www.youtube.com/watch?v=f1RbD_wkGpc'
    },
    {
      name: 'loading',
      link: 'https://www.youtube.com/watch?v=zMzuPIiznQ4&list=PLjcjAqAnHd1EIxV4FSZIiJZvsdrBc1Xho&index=14'
    },
  ];
  return (
    <>
      <Head>
        <title>ThreeJSTutorial</title>
        <meta name="description" content="ThreeJSTutorial" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {/* <script id="vertexShader" type="x-shader/x-vertex"> */}
        {/* <script id="vertexShader" type="vertex"> */}
        {/* void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          } */}
        {/* </script> */}
        {/* <script id="fragmentShader" type="x-shader/x-fragment"> */}
        {/* <script id="fragmentShader" type="fragment"> */}
        {/* void main() {
            gl_FragColor = vec4(0.5, 0.5, 1.0, 1.0);
          } */}
        {/* </script> */}
      </Head>
      <main className="flex flex-col justify-center items-center">
        {/* <div
          onClick={topMenuOnClick}
          className={`${baloo2.className} font-light p-4
            flex flex-row flex-wrap space-y-4 space-x-4 justify-evenly items-center w-full bg-gray-900`}
        > */}
        <div
          onClick={topMenuOnClick}
          className={`${baloo2.className} font-light px-4 pb-4 w-full bg-gray-900
            flex flex-row flex-wrap justify-evenly items-center`}
        >
          {
            menu.map((m, idx) => <TopMenu key={`topmenu-${idx}`} title={m.name} selectedTitle={selectedMenu} />)
          }
        </div>
        <div className="w-full flex flex-row justify-between">
          <div id="statsParent"></div>
          <div id="guiParent"></div>
        </div>
        <div id="canvasParent" className="w-[600px] h-[600px] bg-green-300"></div>
        <div id="info" className="mt-2 text-sm p-2 bg-gray-200 rounded-sm"></div>
      </main>
      <div id="progressWindow"
        className="fixed top-0 right-0 bottom-0 left-0 
            bg-black opacity-90
            justify-center items-center hidden
          ">
          <progress id="progressBar" value="0" max="100"></progress>
      </div>
    </>
  )
}
