import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

import { Chart, Axis, Tooltip, Geom, Legend, View } from 'bizcharts';
import DataSet from '@antv/data-set';
import Papa from 'papaparse';
import moment from 'moment-timezone';

import chart_data from './data/chart_data.json';

let data = [];

chart_data.data.map((event_data) => {
  let label = event_data["Events.timestamp_iso8601"].split(" ")[0];
  data.push({ label: label, 'Visitors Per Day': event_data["Events.visitors"], Time: parseInt(event_data["Views.watched_sec"]) });
})
const ds = new DataSet();
ds.setState('type', '');
const dv = ds.createView().source(data);

dv.transform({
  type: 'fold',
  fields: ['Visitors Per Day'],
  key: 'type',
  value: 'value',
})
  .transform({
    type: 'filter',
    callback: (d) => {
      return d.type !== ds.state.type;
    }
  });
const scale = {
  Total: {
    type: 'linear',
    min: 0,
    max: 10,
  },
};

let chartIns = null;

const getG2Instance = (chart) => {
  chartIns = chart;
};

const legendItems = [
  { value: 'Visitors Per Day', marker: { symbol: 'square', fill: '#54ca76', radius: 5 } },
  { value: 'Time', marker: { symbol: 'hyphen', stroke: '#fad248', radius: 5, lineWidth: 3 } },
];

class Demo extends React.Component {
  render() {
    return (<Chart height={400} width={500} forceFit data={dv} scale={scale} padding="auto" onGetG2Instance={(c) => {
      this.chart = c;
    }}>
      <Legend
        custom
        allowAllCanceled
        items={legendItems}
        onClick={(ev) => {
          setTimeout(() => {
            const checked = ev.checked;
            const value = ev.item.value;
            if (value === 'Time') {
              if (checked) {
                this.chart.get('views')[0].get('geoms')[0].hide()
              } else {
                this.chart.get('views')[0].get('geoms')[0].show()
              }
            }
            const newLegend = legendItems.map((d) => {
              if (d.value === value) {
                d.checked = checked
              }
              return d;
            })
            this.chart.filter('type', (t) => {
              const legendCfg = newLegend.find(i => i.value == t);
              return legendCfg && legendCfg.checked;
            });

            this.chart.legend({
              items: newLegend
            })
            this.chart.repaint();
          }, 0)
        }}
      />
      <Axis name="label" />
      <Axis name="value" position={'left'} />
      <Tooltip />
      <Geom
        type="interval"
        position="label*value"
        color={['type', (value) => {
          if (value === 'Visitors Per Day') {
            return '#2b6cbb';
          }
        }]}
        adjust={[{
          type: 'dodge',
          marginRatio: 1 / 32,
        }]}
      />
      <View data={data} >
        <Axis name="Time" position="right" />
        <Geom type="line" position="label*Time" color="#fad248" size={3} />
      </View>
    </Chart>
    );
  }
}

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

class Game extends React.Component {

  render() {
    return (
      <div>
        <p style={{ fontSize: '16px' }}>Data Table</p>
        <div style={{ width: '100%' }}>
          <TableData />
        </div>
        <p style={{ fontSize: '16px' }}>Combination Chart</p>
        <div>
          <Demo />
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

