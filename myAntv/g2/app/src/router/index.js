/*
 * @Description:
 * @Autor: liang
 * @Date: 2020-05-01 17:11:52
 * @LastEditors: liang
 * @LastEditTime: 2020-05-02 14:33:42
 */
const files = {
  one: "bizcharts基本使用",
  two: "极坐标",
};

const pages = Object.entries(files).reduce((p, [key, value]) => {
  const obj = p;
  const file = require(`../views/${key}/Index`);
  file["name"] = value;
  obj[key] = file;
  return obj;
}, {});
export { pages, files };
