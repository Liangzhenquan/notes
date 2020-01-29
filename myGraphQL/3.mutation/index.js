const Koa = require('koa');
const graphqlHTTP = require('koa-graphql');
const {buildSchema} = require('graphql');
const mount = require('koa-mount');
// 定义schema,查询和类型,mutation
const schema = buildSchema(`
   input AccountInput {
     name: String
     age: Int
     sex: String
     department: String
   }
   type Account {
     name: String
     age: Int
     sex: String
     department: String
   }
   type Mutation {
      createAccount(input: AccountInput): Account
      updateAccount(id: ID!, input: AccountInput): Account
   }
   type Query {
     accounts: [Account]
   }
`)
const  mockDb = {

}
const root = {
  accounts: () => {
     const arr = []
     Object.values(mockDb).forEach((val) => {
      arr.push(val);
     })
     return arr;
  },
  createAccount: ({ input }) => {
    // 相当于数据库的保存
    mockDb[input.name] = input;
    // 返回保存结果
    return mockDb[input.name]
  },
  updateAccount: ({id, input}) => {
    // 相当于数据库的更新
    const updateAccount = Object.assign({}, mockDb[id], input)
    return updateAccount
  }
}
const app = new Koa();
// const middleware =async (ctx, next) => {
//    const req = ctx.request;
//    const res = ctx.response
//    if(req.url.includes('/')) {
//      console.log(ctx);
//      ctx.body = {
//        error: '暂无权限'
//      }
//      return;
//    }
//    next();
// }
// app.use(middleware)
app.use(mount('/',graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
})))
app.listen(7000)