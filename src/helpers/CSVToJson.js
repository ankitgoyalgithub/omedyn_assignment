import Papa from 'papaparse';
import moment from 'moment-timezone';

async function fetchCsv() {
    return fetch('table_data.csv').then(function (response) {
        let reader = response.body.getReader();
        let decoder = new TextDecoder('utf-8');

        return reader.read().then(function (result) {
            return decoder.decode(result.value);
        });
    });
}

async function getCsvData() {
    let csvData = await fetchCsv();
    let rowData = [];

    Papa.parse(csvData, {
        complete: function (result) {
            for (let i = 1; i < result.data.length; i++) {

                if (result.data[i][1]) {
                    let dataDay = moment(result.data[i][1].split(" ")[0], "YYYY-MM-DD");
                    let seconds = 0;
                    if (result.data[i][4] !== "") {
                        seconds = parseInt(result.data[i][4]);
                    }

                    dataDay.tz(result.data[i][9]);
                    rowData.push({
                        day: dataDay.format('dddd') + " " + dataDay.format('MMM') + " " + dataDay.format('DD'),
                        visitors: result.data[i][2],
                        sessions: result.data[i][3],
                        timeWatched: parseInt(seconds / 60).toString() + " mins " + parseInt(seconds % 60).toString() + " secs",
                        adhocQuestions: result.data[i][5],
                        recQuestions: result.data[i][6],
                        topic: result.data[i][7]
                    })
                }
            }

        }
    });

    return rowData;
}

export default getCsvData