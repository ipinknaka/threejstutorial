import Head from 'next/head';
import { Baloo_2 } from '@next/font/google';
import { useEffect, useState } from 'react';
import { GUI, GUIController } from 'dat.gui';
import UseAbsoluteBeginners from '@/components/UseAbsoluteBeginners';

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

  const ab = UseAbsoluteBeginners();

  const menu = [
    'Absolute Beginners',
    'test2',
    'test3'
  ];
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
      // const datgui = new dat.GUI({ autoPlace: false });
      setDat(dati);
      const datgui = new dati.GUI();
      setDatGui(datgui);
    }
    getGui();
  }, []);

  useEffect(() => {
    if (dat) {
      document.getElementById("canvasParent")?.replaceChildren();
      if (datGui && datGui.__controllers.length > 0) datGui.destroy();
      let datgui: GUI;
      switch(+menuId) {
        case 0:
          datgui = new dat.GUI();
          setDatGui(datgui);
          ab.init(datgui);
          const canvas = ab.renderer?.domElement as HTMLCanvasElement;
          document.getElementById("canvasParent")?.appendChild(canvas);
          break;
        case 1:
          datgui = new dat.GUI();
          setDatGui(datgui);
          break;
        default:
          datgui = new dat.GUI();
          setDatGui(datgui);
      }
      
    }
  }, [menuId]);

  return (
    <>
      <Head>
        <title>ThreeJSTutorial</title>
        <meta name="description" content="ThreeJSTutorial" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col justify-center items-center">
        <div
          onClick={topMenuOnClick}
          className={`${baloo2.className} font-light p-4
            flex flex-row justify-evenly items-center w-full bg-gray-900`}
        >
          {
            menu.map((m, idx) => <TopMenu key={`topmenu-${idx}`} idx={idx} title={m} currentMenuId={menuId} />)
          }
        </div>
        {/* 
        {
          menuId == 0 && <AbsoluteBeginners />
        } */}
        <div id="canvasParent" className="w-[600px] h-[600px] bg-green-300"></div>
      </main>
    </>
  )
}
