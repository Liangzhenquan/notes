/*
 * @Description:
 * @Autor: liang
 * @Date: 2020-04-21 20:44:55
 * @LastEditors: liang
 * @LastEditTime: 2020-04-23 21:32:01
 */
const { filter, map, compose, prop, forEach, any } = require("ramda");
const fn = () => {
  const data = [
    {
      key: 1,
      name: "燃气壁挂炉",
      type: [[1], [1, 3]],
      proType: [
        {
          key: 1,
          name: "16kw",
          condition: [
            { val: "新装" },
            { val: 16 },
            { val: 128 },
            { val: "有" },
            { val: "有" },
            { val: "上海" },
          ],
        },
        {
          key: 2,
          name: "18kw",
          condition: [
            { val: "新装" },
            { val: 18 },
            { val: 128 },
            { val: "有" },
            { val: "有" },
            { val: "上海" },
          ],
        },
      ],
    },
    {
      key: 2,
      name: "空调",
      type: [[1], [2], [1, 2]],
      proType: [
        {
          key: 1,
          name: "16kw",
          condition: [
            { val: "新装" },
            { val: 16 },
            { val: 128 },
            { val: "有" },
            { val: "有" },
            { val: "上海" },
          ],
        },
        {
          key: 2,
          name: "18kw",
          condition: [
            { val: "新装" },
            { val: 18 },
            { val: 128 },
            { val: "有" },
            { val: "有" },
            { val: "上海" },
          ],
        },
      ],
    },
  ];
  let anyCondition = compose((x) => {
    console.log("xxx", x);
    return false;
  }, prop("condition"));
  let com = compose(forEach(anyCondition), prop("proType"));
  let result = map(com)(data);
  console.log("result", result);
};
fn();
