[什么是GraphQL?](#什么是GraphQL?)
## 什么是GraphQL?
* 新的API标准，由Facebook在2015年开源
* 一个用于 API 的查询语言，是一个使用基于类型系统来执行查询的服务端运行时（类型系统由你的数据定义）
* 核心是启用声明式数据获取，客户端可以在其中确切指定从API中需要什么数据。
## 为什么会出现GraphQL？
**1.移动使用量的增加导致有效数据的需求**
移动使用的增加，低功耗设备和草率的网络是Facebook开发GraphQL的最初原因。graphql可以最大限度的减少需要通过网络传输的数据量，从而极大地改善了在这些条件下运行的应用程序。
**2.各种不同的前端框架和平台**
前端框架和平台的异构环境使得难以构建和维护一个可以满足所有需求的API。借助GraphQL，每个客户端都可以精确访问其所需的数据。
**3.快速开发和对快速功能开发的期望**
持续部署已成为许多公司的标准，快速迭代和频繁的产品更新是必不可少的。使用REST API，通常需要修改服务器公开数据的方式，以适应特定要求并在客户端进行设计更改。这阻碍了快速的开发实践和产品迭代。
## GraphQL和restful对比
* restful一个接口返回一个资源，graphql一次可以返回多个资源
* restful用不同的url来区别资源，graphql用类型来区别资源
## 基本参数类型
**基本类型**
* String,Int,Float,Boolean和ID,可以在schema声明中直接使用
* [类型]代表数组，例: [Int]代表整型数组
## 参数传递
* 小括号内定义形参，注意：参数需要定义类型
* !(叹号)代表参数不能为空
```js
type Query {
  rollDice(numDice: Int!, numSides: Int): [Int]
}
```
以上表示rollDice接受两个参数numDice(整型，必传)和numSides(整型，选传),返回一个整型数组
## 自定义参数类型
GraphQL允许用户自定义参数类型，通常用来描述要获取的资源的属性
```js
type Account {
  name: String
  age: Int
  salary(city: String): Int
}
type Query {
  acount(name: String): Account
}
```
## 如何在客户端访问GraphQL?
假定服务端有以下接口
```js
const schema = buildSchema(`
  type Account {
    name: String,
    age: Int,
    sex: String,
    salary(city: String): Int
  }
  type Query {
    getClassMates(classNo: Int!): [String]
    getAccount(name: String): Account
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
```
客户端如何查询？
```js
const username = "张三";
const query = `query GetAccount($username: String! $city: String) {
  getAccount(username: $username) {
    name,
    age,
    salary(city: $city)
  }
}`
const variables = {username, city: "上海"}
fetch(`http://localhost:7000/`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query,
    variables,
  })
})
.then(r => r.json())
.then(data => console.log(data))
.catch(error => console.log(error))
```
## Mutation-修改数据
我们已经知道，查询使用query,那么修改数据呢？修改数据用的是Mutation。
```js
input AccountInput {
  name: String
  age: Int
  sex: String
  department: String
  salary: Int
}
type Mutation {
  createAccount(input: AccountInput): account
  updateAccount(id: ID!, input: AccountInput): account
}
```
input代表输入类型
## 高级
### Constructing Types
**1.定义type**
之前学的定义type用的是字符串形式的
```js
const schema = buildSchema(`
  type account {
    name: String
    age: Int
    sex: String
    salary(city: String): Int
  }
`)
```
但是这样不易于维护，为什么？因为假如有报错了，始终报错的是buildSchema这一行，他不会具体到哪一行，
但是如果换成下面这种形式，那么会明确的知道哪个type出错了
```js
const AccountType = new graphql.GraphQLObjectType({
  name: 'Account',
  fields: {
    name: {type: graphql.GraphQLString},
    age: {type: graphql.GraphQLInt},
    sex: {Type: Graphql.GraphQLString}
    ...
  }
})
```
**2.定义query-GraphQLObjectType**
之前定义query用的是字符串
```js
type Query {
  account(username: String): Account
}
```
现在：
```js
const queryType = new graphql.GraphQLObjectType({
  name: "Query",
  fields: {
    account: {
      type: AccountType,
      args: {
        username: {type: GraphQLString}
      },
      // 处理器，实现
      resolve: (_,{username}) => {
        const name = username
        const sex = 'man'
        const age = 20
        return {
          name,
          sex,
          age
        }
      }
    }
  }
})
```
**3.创建schema**
```js
const schema = new graphql.GraphQLSchema({query: queryType})
```
以上queryType就是第二步创建的type
>注意：从以上不难看出，使用constucting type会带来代码量上的上升，但是却更容易维护，没有硬性要求使用哪种方式，但是如果在乎质量的话，可以尝试用constucting
