import React, { Component } from 'react'
import { AgGridReact } from 'ag-grid-react';
import Papa from 'papaparse';
import moment from 'moment-timezone';

class TableData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columnDefs: [{
                headerName: "Day", field: "day"
            }, {
                headerName: "Visitors", field: "visitors"
            }, {
                headerName: "Sessions", field: "sessions"
            }, {
                headerName: "Time Watched in minutes", field: "timeWatched"
            }, {
                headerName: "Ad-hoc Questions", field: "adhocQuestions"
            }, {
                headerName: "Recommended Questions", field: "recQuestions"
            }, {
                headerName: "Topics", field: "topic"
            }],
            rowData: null,

            table_data: null
        }
        this.getData = this.getData.bind(this);
    }

    componentWillMount() {
        this.getCsvData();
    }

    fetchCsv() {
        return fetch('table_data.csv').then(function (response) {
            let reader = response.body.getReader();
            let decoder = new TextDecoder('utf-8');

            return reader.read().then(function (result) {
                return decoder.decode(result.value);
            });
        });
    }

    getData(result) {
        let rowData = [];

        for (let i = 1; i < result.data.length; i++) {

            if (result.data[i][1]) {
                let dataDay = moment(result.data[i][1].split(" ")[0], "YYYY-MM-DD");
                let seconds = 0;
                if (result.data[i][4] !== "") {
                    seconds = parseInt(result.data[i][4]);
                }

                dataDay.tz(result.data[i][9]);
                rowData.push({
                    day: dataDay.format('dddd') + "\n" + dataDay.format('MMM') + " " + dataDay.format('DD'),
                    visitors: result.data[i][2],
                    sessions: result.data[i][3],
                    timeWatched: parseInt(seconds / 60).toString() + " mins " + parseInt(seconds % 60).toString() + " secs",
                    adhocQuestions: result.data[i][5],
                    recQuestions: result.data[i][6],
                    topic: result.data[i][7]
                })
            }
        }

        this.setState({ rowData: rowData });
    }

    async getCsvData() {
        let csvData = await this.fetchCsv();
        this.getData = this.getData.bind(this);
        Papa.parse(csvData, {
            complete: this.getData
        });
    }

    render() {
        return (
            <div
                className="ag-theme-balham"
                style={{
                    height: '500px',
                    width: '1600px'
                }}
            >
                <AgGridReact
                    columnDefs={this.state.columnDefs}
                    rowData={this.state.rowData}>
                </AgGridReact>
            </div>
        );
    }
}

export default TableData