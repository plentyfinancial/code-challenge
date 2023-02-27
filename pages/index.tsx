import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
    const [name, setName] = useState('');

    useEffect(() => {
        fetch('/api/data')
            .then((raw) => raw.json())
            .then((data) => setName(data.foo));
    });

    let greeting = 'Hello';
    if (name) greeting += ', ' + name;
    greeting += '!';

    return (
        <div className={styles.container}>
            <Head>
                <title>Code Challenge</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>{greeting}</h1>
                <p className={styles.description}>Welcome to Plenty</p>
            </main>
        </div>
    );
};

export default Home;
