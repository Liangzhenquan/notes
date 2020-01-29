const grapqhql = require('graphql');
const {GraphQLObjectType, GraphQLString, GraphQLInt,GraphQLSchema} = grapqhql
const accountType = new GraphQLObjectType({
  name: "Account",
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
const schema = new GraphQLSchema({query: queryType})
module.exports = schema
