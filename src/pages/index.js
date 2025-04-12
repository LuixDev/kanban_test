// pages/index.js
import dynamic from 'next/dynamic';
import Head from 'next/head';

const Board = dynamic(() => import('@components/Board'), { ssr: false });
const NewTaskForm = dynamic(() => import('@components/NewTaskForm'), { ssr: false });


export default function Home() {
  return (
    <>
      <Head>
        <title>Kanban Board</title>
        <meta name="description" content="Tablero Kanban interactivo" />
      </Head>
    
      <main className="container mx-auto p-4">
        <NewTaskForm />
        
        <Board />
      </main>
    </>
  );
}

