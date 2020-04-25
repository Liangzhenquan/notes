/*
 * @Description:
 * @Autor: liang
 * @Date: 2020-04-24 22:21:40
 * @LastEditors: liang
 * @LastEditTime: 2020-04-25 10:23:16
 */
// update可以更新数组内的对象,但是需要先找到index

const { findIndex, update, propEq, where } = require("ramda");

const { data } = require("../data");
const item = { id: 2, age: 1 };
const newData = (item, data) =>
  update(
    findIndex(
      where({
        id: propEq("id", 1),
      })
    )(data),
    item,
    data
  );
console.log("propEq", propEq("id", 2)(item));
console.log("update", newData(item, data));
