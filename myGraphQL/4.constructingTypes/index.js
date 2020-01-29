const Koa = require('koa');
const mount = require('koa-mount');
const graphqlHTTP = require('koa-graphql');
const graphql = require('graphql');

const AccountType = new graphql.GraphQLObjectType({
  name: 'Account',
  fields: {
    name: {type: graphql.GraphQLString},
    age: {type: graphql.GraphQLInt},
    sex: {type: graphql.GraphQLString},
    department: {type: graphql.GraphQLString},
  }
})
const queryType = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: {
    account: {
      type: AccountType,
      args: {
        username: {type: graphql.GraphQLString}
      },
      resolve: (_,{username}) => {
        const name = username;
        const age = 20;
        const sex = '男'
        const department = '科学院'
        return {
          name,
          age,
          sex,
          department
        }
      }
    }
  }
})
const schema = new graphql.GraphQLSchema({query: queryType})
const app = new Koa();
app.use(mount('/', graphqlHTTP({
  schema,
  graphiql: true
})))
app.listen(7000)