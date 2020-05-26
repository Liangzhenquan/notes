/*
 * @Description:
 * @Autor: liang
 * @Date: 2020-05-01 17:12:52
 * @LastEditors: liang
 * @LastEditTime: 2020-05-02 14:32:48
 */
import React from "react";
import data from "../../data";
import { Chart, Axis, Tooltip, Geom, Guide } from "bizcharts";
function Index() {
  const cols = {
    value: {
      min: 0,
      nice: true,
    },
    feature: {
      range: [0, 1],
    },
  };
  return (
    <div>
      <Chart height={500} width={600} data={data} scale={cols} forceFit>
        <Axis name="year" />
        <Axis name="feature" />
        <Tooltip
          crosshairs={{
            type: "y",
          }}
        />
        <Guide>
          <Guide.Line top />
        </Guide>
        <Geom type="area" position="feature*value" size={2} color="phone" />
        <Geom type="line" position="feature*value" size={2} color="phone" />
        <Geom
          type="point"
          position="feature*value"
          size={4}
          shape={"square"}
          color="phone"
          style={{
            stroke: "#fff",
            lineWidth: 1,
          }}
        />
      </Chart>
    </div>
  );
}
export default Index;
