import React, { useEffect } from "react";
import G6 from "@antv/g6";
import ReactDOM from "react-dom";
export default function Index() {
  const ref = React.useRef();
  let graph = null;
  useEffect(() => {
    if (!graph) {
      getData();
    }
  }, []);
  const getData = async () => {
    const result = await fetch(
      "https://gw.alipayobjects.com/os/antvdemo/assets/data/algorithm-category.json"
    ).then((r) => r.json());
    insertGraph(result);
  };
  const insertGraph = (data) => {
    graph = new G6.TreeGraph({
      container: ReactDOM.findDOMNode(ref.current),
      width: 1000,
      height: 700,
      modes: {
        default: [
          {
            type: "collapse-expand",
            onChange: function onChange(item, collapsed) {
              const data = item.get("model").data;
              data.collapsed = collapsed;
              return true;
            },
          },
          "drag-canvas",
          "zoom-canvas",
        ],
      },
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
      },
      defaultEdge: {
        type: "cubic-horizontal",
        style: {
          stroke: "#A3B1BF",
        },
      },
      layout: {
        type: "dendrogram",
        direction: "LR", // H / V / LR / RL / TB / BT
        nodeSep: 30,
        rankSep: 100,
      },
    });

    graph.node(function (node) {
      return {
        label: node.id,
        labelCfg: {
          position:
            node.children && node.children.length > 0 ? "left" : "right",
          offset: 5,
        },
      };
    });

    graph.data(data);
    graph.render();
    graph.fitView();
  };
  return <div ref={ref}></div>;
}
