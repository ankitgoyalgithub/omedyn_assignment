import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import TableData from './components/TableData'
import Demo from './components/Demo'

class Game extends Component {
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

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

