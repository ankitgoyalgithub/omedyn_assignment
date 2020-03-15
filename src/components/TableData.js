import React, { Component } from 'react'
import { AgGridReact } from 'ag-grid-react';

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
            rowData: this.props.data_to_display,
        }
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