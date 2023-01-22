import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import { Baloo_2 } from '@next/font/google';
import { useState } from 'react';

const baloo2 = Baloo_2({
  subsets: ['latin'],
});

type TopMenuProps = {
  title: string;
  isHighlight: boolean;
}
const TopMenu = ({ title, isHighlight }: TopMenuProps) => {
  return (
    <div className={`
      text-xl
      ${isHighlight ? 'bg-green-400' : 'bg-slate-300'}
    `}>
      {title}
    </div>
  );
}

export default function Home() {
  const [menuId, setMenuId] = useState(1);
  return (
    <>
      <Head>
        <title>ThreeJSTutorial</title>
        <meta name="description" content="ThreeJSTutorial" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`${baloo2.className} font-light flex flex-row justify-evenly items-center`}>
        <TopMenu title="Absolute Beginners" isHighlight={false} />
      </div>
      <main className={styles.main}>



        <div className={styles.center}>
          <Image
            className={styles.logo}
            src="/next.svg"
            alt="Next.js Logo"
            width={180}
            height={37}
            priority
          />
          <div className={styles.thirteen}>
            <Image
              src="/thirteen.svg"
              alt="13"
              width={40}
              height={31}
              priority
            />
          </div>
        </div>

        <div className={styles.grid}>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={baloo2.className}>
              Docs <span>-&gt;</span>
            </h2>
            <p className={baloo2.className}>
              Find in-depth information about Next.js features and&nbsp;API.
            </p>
          </a>

          <a
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={baloo2.className}>
              Learn <span>-&gt;</span>
            </h2>
            <p className={baloo2.className}>
              Learn about Next.js in an interactive course with&nbsp;quizzes!
            </p>
          </a>

          <a
            href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={baloo2.className}>
              Templates <span>-&gt;</span>
            </h2>
            <p className={baloo2.className}>
              Discover and deploy boilerplate example Next.js&nbsp;projects.
            </p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={baloo2.className}>
              Deploy <span>-&gt;</span>
            </h2>
            <p className={baloo2.className}>
              Instantly deploy your Next.js site to a shareable URL
              with&nbsp;Vercel.
            </p>
          </a>
        </div>
      </main>
    </>
  )
}
