// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { parseCSV, parseJSON } from '../../lib/parse';
import { join } from 'path';

interface HomePriceInfo {
    regionId: string;
    regionName: string;
    homePrice: string;
}

interface HomeValueForecastInfo {
    regionId: string;
    regionName: string;
    oneYearForecast: string;
}

interface MortgageRateInfo {
    name: string;
    rate: string;
}

export type Data = {
    homePrices: HomePriceInfo[];
    homeValueForecasts: HomeValueForecastInfo[];
    mortgageRates: MortgageRateInfo[];
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const homePricePath = join(process.cwd(), 'data', 'home-price-data.csv');
    const homePriceData = await parseCSV<{
        RegionID: string;
        RegionName: string;
        RegionType: string;
        StateName: string;
        HomePrice: string;
    }>(homePricePath);
    const homePrices = homePriceData.map((d) => ({
        regionId: d.RegionID,
        regionName: d.RegionName,
        homePrice: d.HomePrice,
    }));

    const homeValueForecastPath = join(
        process.cwd(),
        'data',
        'home-value-forecast-data.csv'
    );
    const homeValueForecastData = await parseCSV<{
        RegionID: string;
        RegionName: string;
        RegionType: string;
        StateName: string;
        OneYearForecast: string;
    }>(homeValueForecastPath);
    const homeValueForecasts = homeValueForecastData.map((d) => ({
        regionId: d.RegionID,
        regionName: d.RegionName,
        oneYearForecast: d.OneYearForecast,
    }));

    const mortgageRatesPath = join(
        process.cwd(),
        'data',
        'mortgage-rates.json'
    );
    const mortgageRatesData = await parseJSON(mortgageRatesPath);
    const mortgageRates = Object.entries(mortgageRatesData).map(
        ([name, values]) => ({
            name,
            rate: values.rate,
        })
    );

    res.status(200).json({
        homePrices,
        homeValueForecasts,
        mortgageRates,
    });
}
