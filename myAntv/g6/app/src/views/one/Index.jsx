import React, { useEffect } from "react";
import G6 from "@antv/g6";
import ReactDOM from "react-dom";
export default function Index() {
  const ref = React.useRef();
  let graph = null;
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    if (!graph) {
      const result = await fetch(
        "https://gw.alipayobjects.com/os/antvdemo/assets/data/algorithm-category.json"
      ).then((res) => res.json());
      insertGraph(result);
    }
  };
  const insertGraph = (data) => {
    graph = new G6.TreeGraph({
      container: ReactDOM.findDOMNode(ref.current),
      width: 1200,
      height: 700,
      defaultNode: {
        size: 26,
        anchorPoints: [
          [0, 0.5],
          [1, 0.5],
        ],
        style: {
          fill: "#C6E5FF",
          stroke: "#5B8FF9",
        },
        //文本设置
        labelCfg: {
          style: {
            fontSize: 16,
          },
        },
      },
      defaultEdge: {
        type: "cubic-horizontal",
        style: {
          stroke: "#A3B1BF",
        },
      },
      layout: {
        type: "compactBox",
        direction: "RL",
        getId: function getId(d) {
          return d.id;
        },
        getHeight: function getHeight() {
          return 16;
        },
        getWidth: function getWidth() {
          return 80;
        },
        getVGap: function getVGap() {
          return 10;
        },
        getHGap: function getHGap() {
          return 100;
        },
      },
    });
    graph.node(function (node) {
      return {
        label: node.id,
        labelCfg: {
          offset: 10,
          position:
            node.children && node.children.length > 0 ? "right" : "left", //label的位置，如果有子节点，label在右，否则在左
        },
      };
    });
    graph.data(data);
    graph.render();
    graph.fitView();
  };
  return <div ref={ref}></div>;
}
