## 什么是webpack?
>webpack是一个现代js应用程序的静态模块打包器（module bundler）,当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。

![webpack as a bundler](https://user-gold-cdn.xitu.io/2018/3/19/1623bfac4a1e0945?w=2152&h=850&f=png&s=133657)
如上图，webpack 会把我们项目中使用到的多个代码模块（可以是不同文件类型），打包构建成项目运行仅需要的几个静态文件。webpack 有着十分丰富的配置项，提供了十分强大的扩展能力，可以在打包构建的过程中做很多事情。
## 概念
学习webpack，当然需要理解它的概念啦。
**核心概念**
* 入口(entry)
* 输出(output)
* loader
* 插件(plugins)
### 入口(entry)
入口起点(entry point)指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始。进入入口起点后，webpack 会找出有哪些模块和库是入口起点（直接和间接）依赖的。
### loader
因为webpack本身只理解JavaScript，所以如果要处理一些非JavaScript的文件（.css,.png,sass）等文件，则需要loader来实现。loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块，然后你就可以利用 webpack 的打包能力，对它们进行处理。loader的配置很简单，它有两个目标：
* `test`属性，用于标识出应该被对应的loader进行转换的某个或某些文件
* `use`属性，表示进行转换时，应该使用哪个loader
```javascript
//webpack.config.js
const path = require('path');

const config = {
  output: {
    filename: 'my-first-webpack.bundle.js'
  },
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  }
};
module.exports = config;
```
use可以是一个字符串，也可以是一个数组或者一个对象，用对象时：
```javascript
use: {loader: 'less-loader', options: {...}}
```
我们还可以使用 options 给对应的 loader 传递一些配置项，这里不再展开。当你使用一些 loader 时，loader 的说明一般都有相关配置的描述。
以上表示对后缀名为txt的文件用raw-loader进行转换。
>hello，webpack，当你碰到在require()或者import语句中被解析成.txt的路径时，在你对它进行打包之前，先用raw-loader进行转换一下。
**应用顺序**
一个匹配规则中可以配置使用多个 loader，也就是说一个模块文件可以经过多个loader进行转换处理。执行顺序是逆序（后 > 前）例如：
```javascript
module: {
  rules: [
    {
      test: /\.less$/,
      use: [
        "style-loader",
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1
          }
        },
        {
          loader: "less-loader",
          options: {
            noIeCompat: true
          }
        }
      ]
    }
  ]
}
```
对于上面的规则，对于一个.less文件，先后经过less-loader、css-loader、style-loader处理，最后成为一个可打包的模块。
2.多个rule匹配了同一类型文件，列
```javascript
rules: [
  {
    test: /\.js$/,
    exclude: /node_modules/,
    loader: "eslint-loader",
  },
  {
    test: /\.js$/,
    exclude: /node_modules/,
    loader: "babel-loader",
  },
],
```
这样无法法保证 eslint-loader 在 babel-loader 应用前执行。webpack 在 rules 中提供了一个 enforce 的字段来配置当前 rule 的 loader 类型，没配置的话是普通类型，我们可以配置 pre 或 post，分别对应前置类型或后置类型的 loader。
>eslint-loader要检查的是人工编写的代码，如果在babel-loader之后使用，那么检查的是转换之后的代码，所以eslint-loader必须在babel-loader之前使用。

当项目文件类型和应用的 loader 不是特别复杂的时候，通常建议把要应用的同一类型 loader 都写在同一个匹配规则中，这样更好维护和控制。
**module.noParse-忽略文件**
在webpack中，我们需要使用的loader在module.rules中配置，webpack 配置中的 module 用于控制如何处理项目中不同类型的模块。
module还有一个noPase字段，可以用于配置哪些模块文件不需要进行解析，对于一些**不需要解析依赖（也就是没有依赖）**的第三方大型类库等，可以通过这个字段来配置，以提高整体的构建速度。
>**注意**: 使用`noParse`字段进行忽略的模块文件中，不能使用import、require、define 等导入机制。
```javascript
  module: {
    noParse: /jquery | loadsh/,  //使用正则表达式

    // 或者使用function
    noParse(content) {
      return /jquery|lodash/.test(content)
    }
  }
```
### plugin
>loader 被用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。插件接口功能极其强大，可以用来处理各种各样的任务。

想要使用一个插件，你只需要 require() 它，然后把它添加到 plugins 数组中。