import csv from 'csv-parser';
import fs from 'fs';
import { join } from 'path';

/*
    Parses a CSV. Returns a Promise for parsed results.

    Example:
        import { join } from 'path';

        const path = join(process.cwd(), 'data', 'my-data.csv');
        const data = await parseCSV(path);
*/
export const parseCSV = <D = any>(filepath: string): Promise<D[]> => {
    return new Promise((resolve, reject) => {
        try {
            const results: D[] = [];
            fs.createReadStream(filepath)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => {
                    resolve(results);
                });
        } catch (e) {
            reject(e);
        }
    });
};

/*
    Parses JSON. Returns a Promise for parsed results.

    Example:
        import { join } from 'path';

        const path = join(process.cwd(), 'data', 'my-data.json');
        const data = await parseJSON(path);
*/
export const parseJSON = (filepath: string): Promise<Record<string, any>> => {
    return new Promise((resolve, reject) => {
        try {
            const json = fs.readFileSync(filepath);
            // @ts-ignore
            const parsed = JSON.parse(json);
            resolve(parsed);
        } catch (e) {
            reject(e);
        }
    });
};
