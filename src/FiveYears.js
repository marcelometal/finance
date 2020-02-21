import React from "react";
import { Line } from "react-chartjs-2";

const FiveYears = ({ data }) => {
  let labels = [];
  for (var i = 0, len = data.length; i < len; i++) {
    labels.push("");
  }
  const graphData = {
    labels: labels,
    datasets: [
      {
        backgroundColor: "rgba(75,192,192,0.4)",
        borderCapStyle: "butt",
        borderColor: "rgba(75,192,192,1)",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        data: data,
        fill: false,
        label: "Last 5 years",
        lineTension: 0.1,
        pointBackgroundColor: "#fff",
        pointBorderColor: "rgba(75,192,192,1)",
        pointHitRadius: 0,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointRadius: 0,
      }
    ]
  };

  const options = {
    legend: {
      display: false
    },
    tooltips: {
      enabled: false
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          type: "time",
          distribution: "series",
          ticks: {
            autoSkip: true,
            autoSkipPadding: 75,
            fontSize: 8,
            maxRotation: 0,
            sampleSize: 100,
            source: "data",
          }
        }
      ],
      yAxes: [
        {
          ticks: {
            fontSize: 8,
          },
          stacked: true,
          scaleLabel: {
            display: false,
            labelString: ""
          }
        }
      ]
    }
  };

  return <Line data={graphData} width={150} height={70} options={options} />;
};

export default FiveYears;
