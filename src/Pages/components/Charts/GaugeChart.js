import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const GaugeChart = ({ current, target, max }) => {
    const chartRef = useRef(null);

     const shareFormatter = new Intl.NumberFormat('en-IN')

    useEffect(() => {
        const chart = echarts.init(chartRef.current);

        const option = {
            xAxis: {
                max: 'dataMax'
            },
            yAxis: {
                type: 'category',
                data: ['Approved', 'Target', 'Total'],
                inverse: true,
                animationDuration: 300,
                animationDurationUpdate: 300,
                max: 2
            },
            series: [
                {
                    realtimeSort: true,
                    name: 'Amount',
                    type: 'bar',
                    data: [current, target, max],
                    label: {
                        show: true,
                        position: 'insideLeft',
                        valueAnimation: true,
                        formatter: params => {
                            const value = shareFormatter.format(params.value);
                            return `₹ ${value}`;
                        }
                    }
                }
            ],
            legend: {
                show: true
            },
            animationDuration: 0,
            animationDurationUpdate: 3000,
            animationEasing: 'linear',
            animationEasingUpdate: 'linear'
        };

        chart.setOption(option);

        // Clean up
        return () => {
            chart.dispose();
        };
    }, [current, target, max]);

    return <div ref={chartRef} style={{ width: '90%', height: '400px' }}></div>;
};

export default GaugeChart;