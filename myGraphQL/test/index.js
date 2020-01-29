const Koa = require('koa');
const graphqlHTTP = require('koa-graphql');
const grapqhql = require('graphql');
const mount = require('koa-mount');
const accountSchema = require('./server/schema')
const classSchema = require('./server/classSchema')
const graphiql = true
const app = new Koa();
app.use(mount('/account', graphqlHTTP({
  schema: accountSchema,
  graphiql
})))
app.use(mount('/class', graphqlHTTP({
  schema: classSchema,
  graphiql
})))
app.listen(7000)