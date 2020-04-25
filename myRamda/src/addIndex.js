/*
 * @Description:
 * @Autor: liang
 * @Date: 2020-04-25 20:07:47
 * @LastEditors: liang
 * @LastEditTime: 2020-04-25 20:14:34
 */
const { data } = require("../data");

const { addIndex, map } = require("ramda");
const mapIndex = addIndex(map);
addIndex((val, inx) => inx)(data);
console.log("data", data);
console.log(
  "addIndex",
  JSON.stringify(
    mapIndex((val, inx) => {
      val.key = inx;
      return val;
    })(data)
  )
);
