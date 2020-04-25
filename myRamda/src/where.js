/*
 * @Description:
 * @Autor: liang
 * @Date: 2020-04-24 21:47:22
 * @LastEditors: liang
 * @LastEditTime: 2020-04-24 22:09:52
 */
// where 可多条件过滤数据 相当于 a && b && c...
const {
  filter,
  find,
  where,
  includes,
  gte,
  gt,
  __,
  any,
  all,
} = require("ramda");
const { data } = require("../data");

const predicate = where({
  title: includes("JavaScript"),
  year: gte(__, 2017),
});
// console.log("filter", filter(predicate)(data));
// console.log("find", find(predicate)(data));

const predicate2 = where({
  condition: any(where({ age: gte(__, 3) })),
});
const predicate1 = where({
  type: predicate2,
});
console.log("filter1", filter(predicate1)(data));
console.log("find1", find(predicate1)(data));
