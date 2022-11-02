import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { Select } from '@chakra-ui/react';
import { HomeRegionData } from './api/home-data';

const Home: NextPage = () => {
    const [data, setData] = useState<Record<string, HomeRegionData> | null>(null);
    const [currentData, setCurrentData] = useState<HomeRegionData | null>(null);

    const regionChange = ((e) => {
      setCurrentData(data[e.target.value]);
    });

    useEffect(() => {
        fetch('/api/home-data')
            .then((raw) => raw.json())
            .then((data) => setData(data));
    });

    if (!data) {
      return null;
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Code Challenge</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
              <Select placeholder='Select Region' onChange={regionChange}>
                {data && Object.keys(data).map((key) => {
                  return <option key={key} value={key}>{data[key].location}</option>
                })}
              </Select>

              {currentData && (
                <>
                  <h2>Median Price</h2>
                  <h3>{currentData.medianPrice}</h3>

                  <h2>Expected Annual Increase</h2>
                  <h3>{currentData.expectedAnnualPriceIncrease}</h3>
                </>
              )}
            </main>
        </div>
    );
};

export default Home;
