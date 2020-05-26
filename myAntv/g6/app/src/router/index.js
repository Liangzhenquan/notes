/*
 * @Description:
 * @Autor: liang
 * @Date: 2020-05-01 17:11:52
 * @LastEditors: liang
 * @LastEditTime: 2020-05-03 17:26:19
 */
const files = {
  one: "紧凑树",
  two: "生态树",
};

const pages = Object.entries(files).reduce((p, [key, value]) => {
  const obj = p;
  const file = require(`../views/${key}/Index`);
  file["name"] = value;
  obj[key] = file;
  return obj;
}, {});
export { pages, files };
