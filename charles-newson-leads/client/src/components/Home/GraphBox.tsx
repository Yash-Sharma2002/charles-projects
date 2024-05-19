import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function GraphBox({content}:any) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      },
    },
    scales: {
      xAxes: {
          grid: {
              display: false
          }
      },
      yAxes: {
          grid: {
              display: false
          }   
      }
    }
  };
  
  const data = {
    labels: content.labels,
    datasets: [
      {
        data: content.values,
        backgroundColor: '#2A83EC',
      }
    ],
  };

  return (
    <div className='graph-box box-card p-3 me-3 mb-3'>
        <p>{content.title}</p>
        <div className='graph'>
          <Bar options={options} data={data} />
        </div>
    </div>
  )
}
