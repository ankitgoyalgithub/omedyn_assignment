import React, { Component } from 'react'
import { AgGridReact } from 'ag-grid-react';

class TableData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columnDefs: [{
                headerName: "Day", field: "day",
                cellRenderer: function (param) {
                    let value = param.value;
                    return (value.split(" ")[0] + '<br/>' + value.split(" ")[1] + " " + value.split(" ")[2]);
                },
                sortable: true, filter: true
            }, {
                headerName: "Visitors", field: "visitors", sortable: true, filter: true
            }, {
                headerName: "Sessions", field: "sessions", sortable: true, filter: true
            }, {
                headerName: "Time Watched in minutes", field: "timeWatched", sortable: true, filter: true
            }, {
                headerName: "Ad-hoc Questions", field: "adhocQuestions", sortable: true, filter: true
            }, {
                headerName: "Recommended Questions", field: "recQuestions", sortable: true, filter: true
            }, {
                headerName: "Topics", field: "topic", sortable: true, filter: true
            }],
            rowData: this.props.data_to_display,
            gripOptions: {
                'rowHeight': 50
            }
        }
    }

    render() {
        return (
            <div
                className="ag-theme-balham"
                style={{
                    height: '400px'
                }}
            >
                <AgGridReact
                    columnDefs={this.state.columnDefs}
                    rowData={this.state.rowData}
                    gridOptions={this.state.gripOptions}>

                </AgGridReact>
            </div>
        );
    }
}

export default TableData