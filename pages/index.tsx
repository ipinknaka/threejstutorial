import Head from 'next/head';
import { Baloo_2 } from '@next/font/google';
import { useState } from 'react';
import AbsoluteBeginners from '@/components/AbsoluteBeginners';

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

export default function Home() {
  const [menuId, setMenuId] = useState(0);
  const topMenuOnClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    //@ts-ignore
    const ds = e.target.dataset;
    if ('index' in ds) {
      setMenuId(ds.index);
    }
  }
  const menu = [
    'Absolute Beginners',
    'test2',
    'test3'
  ];

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

          {
            menuId == 0 && <AbsoluteBeginners />
          }

      </main>
    </>
  )
}
