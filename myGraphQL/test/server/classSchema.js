const grapqhql = require('graphql');
const {GraphQLObjectType, GraphQLString, GraphQLInt,GraphQLSchema} = grapqhql
const classType = new GraphQLObjectType({
  name: "Account",
  fields: {
    classNo: {type: GraphQLString},
    age: {type: GraphQLInt},
    sex: {type: GraphQLString},
  }
})
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    class: {
      type: classType,
      args: {
        username: {type: GraphQLString}
      },
      resolve: (_,{classNum}) => {
        const classNo = classNum;
        const age = 20;
        const sex = '男'
        return {
          classNo,
          age,
          sex
        }
      }
    }
  }
})
const schema = new GraphQLSchema({query: queryType})
module.exports = schema
