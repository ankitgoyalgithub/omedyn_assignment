import { getJsonFromCsv } from 'convert-csv-to-json';


export class CSVToJson {

    static convert(filePath) {
        let jsonData = getJsonFromCsv(filePath)
        return jsonData;
    }
}