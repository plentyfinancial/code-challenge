import { Spinner } from '@chakra-ui/react';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { Data } from './api/data';

const Home: NextPage = () => {
    const [data, setData] = useState<Data | null>(null);

    useEffect(() => {
        fetch('/api/data')
            .then((raw) => raw.json())
            .then((data) => setData(data));
    }, []);

    return (
        <div className={styles.container}>
            {data ? 'Data loaded!' : <Spinner />}
        </div>
    );
};

export default Home;
