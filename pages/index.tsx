import Head from 'next/head';
import { Baloo_2 } from '@next/font/google';
import { useEffect, useState } from 'react';
import { GUI, GUIController } from 'dat.gui';
import useAbsoluteBeginners from '@/components/UseAbsoluteBeginners';
import useSolarSystem from '@/components/UseSolarSystem';
import useTemplate from '@/components/UseTemplate';
import useShaderSyntax from '@/components/UseShaderSyntax';
import useObjectOnMouseClick from '@/components/UseObjectOnMouseClick';

const baloo2 = Baloo_2({
  subsets: ['latin'],
});

type TopMenuProps = {
  idx: number;
  title: string;
  currentMenuId: number;
}
const TopMenu = ({ idx, title, currentMenuId }: TopMenuProps) => {
  return (
    <div data-index={idx}
      className={`cursor-pointer text-xl px-2 rounded-md ${(idx == currentMenuId) ? 'bg-green-400' : 'bg-slate-300'}`}>
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
  const [menuId, setMenuId] = useState(100);
  const [dat, setDat] = useState<datImport>();
  const [datGui, setDatGui] = useState<GUI>();

  const ab = useAbsoluteBeginners();
  const ss = useSolarSystem();
  const tp = useTemplate();
  const shaderSyntax = useShaderSyntax();
  const omc = useObjectOnMouseClick();

  const topMenuOnClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    //@ts-ignore
    const ds = e.target.dataset;
    if ('index' in ds) {
      setMenuId(ds.index);
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
      document.getElementById("canvasParent")?.replaceChildren();
      if (datGui) {
        datGui.destroy();
        setDatGui(undefined);
      }
      document.getElementById("guiParent")?.replaceChildren();
      let datgui: GUI;
      let canvas: HTMLCanvasElement;
      switch (+menuId) {
        case 0:
          datgui = new dat.GUI({ autoPlace: false });
          document.getElementById("guiParent")?.appendChild(datgui.domElement);
          setDatGui(datgui);
          ab.init(datgui);
          canvas = ab.renderer?.domElement as HTMLCanvasElement;
          document.getElementById("canvasParent")?.appendChild(canvas);
          document.getElementById("info")!.textContent = menu[menuId].link;
          break;
        case 1:
          datgui = new dat.GUI({ autoPlace: false });
          document.getElementById("guiParent")?.appendChild(datgui.domElement);
          setDatGui(datgui);
          ss.init();
          canvas = ss.renderer?.domElement as HTMLCanvasElement;
          document.getElementById("canvasParent")?.appendChild(canvas);
          document.getElementById("info")!.textContent = menu[menuId].link;
          break;

        //Template
        case 2:
          datgui = new dat.GUI({ autoPlace: false });
          document.getElementById("guiParent")?.appendChild(datgui.domElement);
          setDatGui(datgui);
          tp.init();
          canvas = tp.renderer?.domElement as HTMLCanvasElement;
          document.getElementById("canvasParent")?.appendChild(canvas);
          document.getElementById("info")!.textContent = menu[menuId].link;
          break;

        // Shader Syntax
        case 3:
          datgui = new dat.GUI({ autoPlace: false });
          document.getElementById("guiParent")?.appendChild(datgui.domElement);
          setDatGui(datgui);
          shaderSyntax.init();
          canvas = shaderSyntax.renderer?.domElement as HTMLCanvasElement;
          document.getElementById("canvasParent")?.appendChild(canvas);
          document.getElementById("info")!.textContent = menu[menuId].link;
          break;

        // Create object on mouse click
        case 4:
          datgui = new dat.GUI({ autoPlace: false });
          document.getElementById("guiParent")?.appendChild(datgui.domElement);
          setDatGui(datgui);
          omc.init();
          canvas = omc.renderer?.domElement as HTMLCanvasElement;
          document.getElementById("canvasParent")?.appendChild(canvas);
          document.getElementById("info")!.textContent = menu[menuId].link;
          break;

        default:
          datgui = new dat.GUI({ autoPlace: false });
          document.getElementById("guiParent")?.appendChild(datgui.domElement);
          setDatGui(datgui);
      }

    }
  }, [menuId]);

  const menu = [
    {
      name: 'Absolute Beginners',
      link: 'https://www.youtube.com/watch?v=xJAfLdUgdc4&list=PLjcjAqAnHd1EIxV4FSZIiJZvsdrBc1Xho'
    },
    {
      name: 'Solar System',
      link: 'https://www.youtube.com/watch?v=XXzqSAt3UIw&list=PLjcjAqAnHd1EIxV4FSZIiJZvsdrBc1Xho&index=2'
    },
    {
      name: 'Template',
      link: 'https://github.com/WaelYasmina/ThreeBoilerplate/blob/main/src/js/scripts.js'
    },
    {
      name: 'Shader Syntax',
      link: 'https://www.youtube.com/watch?v=xZM8UJqN1eY&list=PLjcjAqAnHd1EIxV4FSZIiJZvsdrBc1Xho&index=5'
    },
    {
      name: 'Object on mouse click',
      link: 'https://www.youtube.com/watch?v=By9qRmcrTzs&list=PLjcjAqAnHd1EIxV4FSZIiJZvsdrBc1Xho&index=6'
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
        <div
          onClick={topMenuOnClick}
          className={`${baloo2.className} font-light p-4
            flex flex-row justify-evenly items-center w-full bg-gray-900`}
        >
          {
            menu.map((m, idx) => <TopMenu key={`topmenu-${idx}`} idx={idx} title={m.name} currentMenuId={menuId} />)
          }
        </div>
        <div id="canvasParent" className="w-[600px] h-[600px] bg-green-300"></div>
        <div id="guiParent" className="z-10 absolute top-16 right-0"></div>
        <div id="info" className="mt-2 text-sm p-2 bg-gray-200 rounded-sm"></div>
      </main>
    </>
  )
}
