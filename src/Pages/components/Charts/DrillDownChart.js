import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const DrillDownChart = ({ doughnutData, nriPieData, riPieData, title }) => {
    const [activeChart, setActiveChart] = useState('doughnut');
    const chartRef = useRef(null);
    const [chartInstance, setChartInstance] = useState(null);

    const buttonStyle = {
        borderRadius: '4px',
        padding: '8px',
        border: 'none',
        fontSize: '16px',
        backgroundColor: '#2eacd1',
        color: 'white',
        top: '10px',
        right: '10px', 
        cursor: 'pointer'
    }

    useEffect(() => {
        if (chartRef.current) {
            const instance = echarts.init(chartRef.current);
            setChartInstance(instance);
            initDoughnutChart(instance);
        }

        return () => {
            if (chartInstance) {
                chartInstance.dispose();
            }
        };
    }, [chartRef]);

    const initDoughnutChart = (instance) => {
        const option = {
            title: {
                text: title,
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                bottom: '5%',
                left: 'center'
            },
            series: [
                {
                    name: 'Users',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: doughnutData
                }
            ]
        };

        instance.setOption(option);

        instance.on('click', (params) => {
            if (params.name === 'NRI Payment') {
                setActiveChart('nriPie');
                initPieChart(instance, nriPieData, 'NRI Payment');
            } else if (params.name === 'RI Payment') {
                setActiveChart('riPie');
                initPieChart(instance, riPieData, 'RI Payment');
            }
            if (params.name === 'NRI KYC') {
                setActiveChart('nriPie');
                initPieChart(instance, nriPieData, 'NRI KYC');
            } else if (params.name === 'RI KYC') {
                setActiveChart('riPie');
                initPieChart(instance, riPieData, 'RI KYC');
            }
            if (params.name === 'NRI Application') {
                setActiveChart('nriPie');
                initPieChart(instance, nriPieData, 'NRI Application');
            } else if (params.name === 'RI Application') {
                setActiveChart('riPie');
                initPieChart(instance, riPieData, 'RI Application');
            }
        });
    };

    const initPieChart = (instance, data, title) => {
        const option = {
            title: {
                text: `${title} Details`,
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                bottom: '10%',
                left: 'center'
            },
            series: [
                {
                    name: 'Payments',
                    type: 'pie',
                    radius: '50%',
                    data: data,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        instance.setOption(option);
    };

    const handleGoBack = () => {
        setActiveChart('doughnut');
        initDoughnutChart(chartInstance);
    };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                {activeChart !== 'doughnut' && <button style={buttonStyle} onClick={handleGoBack}>Go Back</button>}
            </div>
            <div ref={chartRef} style={{ width: '100%', height: '400px' }}></div>
        </div>
    );
};

export default DrillDownChart;