import React, { Component } from 'react'
import { Chart, Axis, Tooltip, Geom, Legend, View } from 'bizcharts';
import DataSet from '@antv/data-set';
import chart_data from '../data/chart_data.json';

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

export default Demo