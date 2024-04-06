import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  Filler
} from 'chart.js';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  Filler
);

// eslint-disable-next-line react/prop-types
const Chart = ({ fieldId, fieldData, fieldName, fieldColor }) => {
  const data = {
    labels: fieldId,
    datasets: [
      {
        label: fieldName,
        data: fieldData,
        borderColor: fieldColor,
        fill: 'true',
        tension: 0.0
      }
    ]
  };

  const options = {
    plugins: {
      display: true,
      position: 'top'
    },
    tooltip: {
      mode: 'index', // 'point', 'nearest', 'index', 'x', 'y'
      intersect: false
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Entries'
        },
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 45
        }
      },
      y: {
        title: {
          display: true,
          text: 'Value'
        },
        grid: {
          display: false
        },
        ticks: {
          beginAtZero: true
        }
      }
    }
  };

  return (
    <>
      <div style={{backgroundColor:'white'}} className="p-4 shadow-lg rounded-lg m-4 border border-slate-300">
        <Line data={data} options={options} key={fieldName}></Line>
      </div>
    </>
  );
};

export default Chart;
