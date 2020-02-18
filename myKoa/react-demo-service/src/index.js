// const Koa = require('koa');
// const cors = require('koa-cors')
import Koa from "koa";
import cors from "koa-cors";
import Router from "koa-router";
const app = new Koa();
const router = new Router();
app.use(cors());
// app.use(async ctx => {
//   ctx.body = {
//     name: "jack",
//     age: 123
//   };
// });
router.post("/test", async ctx => {
  ctx.body = {
    name: "jack",
    age: 123
  };
});
router.post("/test1", async ctx => {});
router.post("/upload", async ctx => {
  ctx.body = {
    code: 1
  };
});
router.post("/uploadLarge", async ctx => {
  ctx.body = {
    code: 1
  };
});
app.use(router.routes()).use(router.allowedMethods());
app.listen(7000, () => {
  console.log("server is running in 7000");
});
