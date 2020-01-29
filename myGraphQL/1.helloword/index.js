const Koa = require('koa');
const mount = require('koa-mount');
const graphqlHTTP = require('koa-graphql');
const {buildSchema} = require('graphql');
// 定义schema，查询和类型
const schema = buildSchema(`
  type Account {
    name: String
    age: Int
    sex: String
    department: String
  }
  type Query {
    hello: String
    accountName: String
    age: Int
    account: Account
  }
`)
// 定义查询对应的处理器
const root = {
  hello: () => {
    return 'hello world'
  },
  accountName: () => {
    return '张三丰'
  },
  age: () => {
    return 18
  },
  account: () => {
    return {
      name: '赵四',
      age: 10,
      sex: '男',
      department: '科学院'
    }
  }
}
const app = new Koa();
app.use(mount('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
})))
app.listen(7000,() => {
  console.log('server is running')
})