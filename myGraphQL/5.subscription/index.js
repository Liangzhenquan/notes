const Koa = require('koa');
const grapqhqlHTTP = require('koa-graphql');
const mount = require('koa-mount');
const graphql = require('graphql');
const {GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLInt} = graphql;
const accountType = new GraphQLObjectType({
  name: 'Account',
  fields: {
    name: {type: GraphQLString},
    age: {type: GraphQLInt},
    sex: {type: GraphQLString},
  }
})
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    account: {
      type: accountType,
      args: {
        username: {type: GraphQLString}
      },
      resolve: (_,{username}) => {
        const name = username;
        const age = 20;
        const sex = '男'
        return {
          name,
          age,
          sex
        }
      }
    }
  }
})
const subType = new GraphQLObjectType({
  name: 'subscription',
  fields: {
    account: {
      type: accountType,
      args: {
        username: {type: GraphQLString}
      },
      resolve: (_,{username}) => {
        const name = username;
        const age = 20;
        const sex = '男'
        return {
          name,
          age,
          sex
        }
      }
    }
  }
})
const muType = new GraphQLObjectType({
  name: 'mutation',
  fields: {
    createAccount: {
      type: accountType,
      args: {
        username: {type: GraphQLString}
      },
      resolve: (_,{username}) => {
        const name = username;
        const age = 20;
        const sex = '男'
        return {
          name,
          age,
          sex
        }
      }
    }
  }
})
const schema = new GraphQLSchema({query: queryType, subscription: subType, mutation: muType});
const app = new Koa();
app.use(mount('/', grapqhqlHTTP({
  schema,
  graphiql: true
})))
app.listen(7000)