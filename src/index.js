import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import TableData from './components/TableData'
import CombinationChart from './components/CombinationChart'
import getCsvData from './helpers/CSVToJson'

class Dashboard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      table_data: [],
    }
  }

  componentWillMount() {
    let currentComponent = this;

    getCsvData().then(function (results) {
      currentComponent.setState({
        table_data: results
      });
    });
  }

  render() {
    if (this.state.table_data === undefined || this.state.table_data.length === 0) {
      return false;
    }
    return (
      <div>

        <div style={{ width: '80%', margin: '0 auto' }}>
          <p className='section-header' style={{ fontSize: '16px' }}>Data Table</p>
          <TableData data_to_display={this.state.table_data} />
        </div>

        <div style={{ width: '80%', margin: '0 auto' }}>
          <p className='section-header' style={{ fontSize: '16px' }}>Combination Chart</p>
          <CombinationChart />
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Dashboard />,
  document.getElementById('root')
);

