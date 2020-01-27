// const Koa = require('koa');
// const cors = require('koa-cors')
import Koa from 'koa';
import cors from 'koa-cors';
const app = new Koa();
app.use(cors())
app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(7000, () => {
  console.log('server is running in 7000')
});