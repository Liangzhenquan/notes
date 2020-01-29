const Koa = require('koa');
const mount = require('koa-mount');
const cors = require('koa-cors');
const graphqlHTTP = require('koa-graphql');
const {buildSchema} = require('graphql');

const schema = buildSchema(`
  type Account {
    name: String,
    age: Int,
    sex: String,
    salary(city: String): Int
  }
  type Query {
    getClassMates(classNo: Int!): [String]
    getAccount(username: String): Account
  }
`)
const root = {
  getClassMates: ({classNo}) => {
    const obj = {
      1: ['张三','李四','王五'],
      2: ['张大三','李大四','王大五']
    }
    return obj[classNo]
  },
  getAccount: ({username}) => {
    return {
      name:username,
      age: 18,
      sex: '女',
      salary: ({city}) => {
        if(city === '上海') {
          return 100
        }
        return 101
      }
    }
  }
}
const app = new Koa();
app.use(cors());
app.use(mount('/',graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
})))
app.listen(7000)