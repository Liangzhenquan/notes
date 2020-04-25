/*
 * @Description:
 * @Autor: liang
 * @Date: 2020-04-24 22:05:39
 * @LastEditors: liang
 * @LastEditTime: 2020-04-24 22:18:18
 */
// 使用filter时，predicate 难免会出现反向逻辑，如 filter(x => x !== y)
// reject 可以让我们使用正向逻辑
const {
  reject,
  filter,
  where,
  includes,
  not,
  compose,
  propEq,
} = require("ramda");
const { data } = require("../data");
const predicate = where({
  title: includes("JavaScript"),
});
console.log("filter", filter(predicate)(data));
console.log(
  "filter1",
  filter(compose(not, propEq("title", "RxJS in Action")))(data)
);
console.log("reject", reject(predicate)(data));
