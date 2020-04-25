/*
 * @Description:
 * @Autor: liang
 * @Date: 2020-04-25 10:22:41
 * @LastEditors: liang
 * @LastEditTime: 2020-04-25 19:31:30
 */
// 可以结合merge，converge等重新拼接数组
const {
  prop,
  map,
  compose,
  pick,
  merge,
  converge,
  assoc,
  objOf,
  where,
  gte,
  filter,
  all,
  negate,
  isEmpty,
  __,
} = require("ramda");
const { data } = require("../data");
// 案例1 更新 condition
// const c = compose(
//   objOf("condition"),
//   filter(where({ age: gte(__, 2) })),
//   prop(["condition"])
// );
// const b = converge(merge, [pick(["title"]), c]);

// console.log("pingjie", JSON.stringify(map(b)(data)));

// 案例2
const a = all(where({ age: gte(__, 2) }));
const c = compose(
  objOf("newType"),
  filter(where({ condition: a })),
  prop("type")
);
const b = converge(merge, [pick(["title"]), c]);
console.log("pingjie2", JSON.stringify(map(b)(data)));
console.log("1111", isEmpty()(undefined));
