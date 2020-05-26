import React from "react";
import { Chart, Interval, Tooltip, Coordinate } from "bizcharts";
// import data from "../../data";
function Index() {
  const data = [
    { item: "事例一", count: 40, percent: 0.4 },
    { item: "事例二", count: 21, percent: 0.21 },
    { item: "事例三", count: 17, percent: 0.17 },
    { item: "事例四", count: 13, percent: 0.13 },
    { item: "事例五", count: 9, percent: 0.09 },
  ];

  const cols = {
    percent: {
      formatter: (val) => {
        val = val * 100 + "%";
        return val;
      },
    },
  };

  return (
    <Chart height={400} data={data} scale={cols} autoFit>
      <Coordinate type="theta" radius={0.75} />
      <Tooltip />
      <Interval
        position="percent"
        adjust="stack"
        color="item"
        style={{
          lineWidth: 1,
          stroke: "#fff",
        }}
        label={[
          "count",
          {
            content: (data) => {
              return `${data.item}: ${data.percent * 100}%`;
            },
          },
        ]}
      />
      <h4>饼图</h4>
    </Chart>
  );
}
export default Index;
