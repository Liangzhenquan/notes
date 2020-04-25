/*
 * @Description:
 * @Autor: liang
 * @Date: 2020-04-24 22:09:29
 * @LastEditors: liang
 * @LastEditTime: 2020-04-25 10:53:25
 */
const data = [
  {
    id: 1,
    title: "Impatient JavaScript",
    year: 2018,
    condition: [{ age: 1 }],
    type: [{ name: "jack", condition: [{ age: 1 }] }],
  },
  {
    id: 2,
    title: "RxJS in Action",
    year: 2017,
    condition: [{ age: 2 }],
    type: [{ name: "tom", condition: [{ age: 2 }] }],
  },
  {
    id: 3,
    title: "Speaking JavaScript",
    year: 2014,
    condition: [{ age: 3 }],
    type: [{ name: "bom", condition: [{ age: 3 }] }],
  },
];
module.exports = { data };
