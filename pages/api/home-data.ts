// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { parseCSV } from '../../lib/parse';
import { join } from 'path';
import { existsSync} from 'fs';

export type HomeExportType = {
  location: string,
  medianPrice: number,
  expectedAnnualPriceIncrease: number,
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Record<string, HomeExportType>>
) {

    const regionPath = join(process.cwd(), 'data', 'home-price-data.csv');

    if (!existsSync(regionPath)) {
      throw new Error(`File does not exist: ${regionPath}`);
    }

    const regionArray = await parseCSV(regionPath);
    const regionObj: Record<string, { medianPrice: number, location: string }> = {};

    regionArray.forEach((el) => {
      if (el.RegionName == 'United States') return;

      regionObj[el.RegionID] = {
        medianPrice: el['2022-04-30'],
        location: el.RegionName,
      }
    });

    const forecastPath = join(process.cwd(), 'data', 'home-value-forecast-data.csv');
    const forecastArray = await parseCSV(forecastPath);
    const exportData: Record<string, HomeExportType> = {};

    forecastArray.forEach((el) => {
      if (!(el.RegionID in regionObj)) return;

      exportData[el.RegionID] = {
        ...regionObj[el.RegionID],
        expectedAnnualPriceIncrease: el.OneYearForecast,
      }
    })

    res.status(200).json(exportData);
}
