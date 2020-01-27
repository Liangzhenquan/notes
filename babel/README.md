## Babel是什么？
  babel是一个工具链，主要用于将ECMAScript2015（es6）+版本的代码转换为向后兼容的JavaScript语法，可以使之运行在当前和旧版本的浏览器和其他环境中，下面是babel能为我们做的事：
* 语法转换
* 通过Polyfill方式在目标环境中添加缺失的特性（通过@ babel / polyfill模块）
* 原始码转换（codemods）
* more

babel的基本每一次的大版本更新都会有很大改变，下面的是7.X,跟多详细请查看[babel](https://www.babeljs.cn/docs)官网。
## 核心库 @babel/core
  想要使用babel，则必须安装@babel/core,core的意思是核心，核心是必不可少的，没有它，在 babel 的世界里注定寸步难行。
  我们安装它
  ```javascript
  npm i -d @babel/core
  ```
  或者
  ```javascript
  yarn add --dev @babel/core
  ```
## CLI-命令行工具 @babel/cli
  @babel/cli这个命令行工具，主要是提供babel命令，适合安装在项目中
  ```javascript
  npm i -d @babel/cli @babel/core
  ```
  因为@babel/core是必不可少的，所以需要安装，使用:在package.json文件中：
  ```javascript
  "scripts": {
    "compiler": "babel src -d dist"
  }
  ```
  以上将src目录下的所有内容输出在dist文件夹下,但是输出和输入是没有变化的，因为Babel 虽然开箱即用，但是什么动作都不做。它基本上类似于 `const babel = code => code;` ，将代码解析之后再输出同样的代码。如果想要 Babel 做一些实际的工作，就需要为其添加插件。

## @babel/node
  babel-nodeBabel 6中的命令是babel-cli软件包的一部分。在Babel 7中，此命令已拆分为自己的@babel/node程序包,@babel/node 提供了 babel-node 命令，但是 @babel/node 更适合全局安装，不适合安装在项目里。
## @babel/plugin-transform-arrow-functions
  该插件是将ES2015箭头函数转换为es5的函数。
  ```javascript
  npm i -d @babel/plugin-transform-arrow-functions
  ```
  在4.babel-plugin-tranform-arrow-fn中，我们使用它，
  ```javascript
  //./index.js中
  const a = () => {
    console.log(1)
  }
  ```
  然后执行npm compile,输出到dist文件夹，我们打开dist文件夹中的index.js可以看到，转换为如下：
  ```javascript
  const a = function() {
    console.log(1)
  }
  ```
  箭头函数已经转换为了普通函数，但是const并没有转换为var,ES2015+版本有许多的新特性（let，const,...）等，难道我们没转化一个，就新添加一个插件吗？babel开发者们已经想到了这一点，下面就是用到presets的时候了
## presets
  presets意为预设，也就是说我们可以使用presets为我们预设插件，而不用自己动手组合插件，preset 可以作为 Babel 插件的组合，甚至可以作为可以共享的 [options](https://www.babeljs.cn/docs/options) 配置。
  **官方preset**
  官方已经针对一些常用环境编写了一些 preset：
  * [@babel/preset-env](https://www.babeljs.cn/docs/babel-preset-env)
  * [@babel/preset-flow](https://www.babeljs.cn/docs/babel-preset-flow)
  * [@babel/preset-react](https://www.babeljs.cn/docs/babel-preset-react)
  * [@babel/preset-typescript](https://www.babeljs.cn/docs/babel-preset-typescript)

  **创建preset**
  preset的创建也很简单：
  1.新建.babel.config.js文件
  2.
  ```javascript
  module.exports = function(api) {
    api.cache(true);
    const presets = ["@babel/env"]
    const plugins = []
    return {
      presets,
      plugins,
    }
  }
  ```
  plugins的用法配置和preset类似。
  上面是说我预设一组插件，该插件组合是@babel/preset-env，为什么上面是@babel/env，但是用的依赖包却是@babel/preset-env，其实是因为@babel/env是一个短名称，官网解释到：如果 preset 名称的前缀为 babel-preset-，你还可以使用它的短名称，但是我们也不是babel-preset-呀，这是因为babel-preset这是7.X版本之前的包名称，而7.X版本的包都是以@babel/开头了，所以实际上@babel/preset-env或者@babel/preset-react这些可以写成@babel/env和@babe/react这种短名称，而如果有些包名称是babel-preset-的，那么也可以用短名称，如：
  ```javascript
  {
    "presets": [
      "myPreset",  //短名称
      "babel-preset-myPreset" // 全称
    ]
  }
  ```
  **执行顺序**
  Preset 是逆序排列的（从后往前）。plugin是顺序排列的。
  ```javascript
  {
    "presets": [
      "a",
      "b",
      "c"
    ]
  }
  ```
  将按如下顺序执行： c、b 然后是 a。这主要是为了确保向后兼容，由于大多数用户将 "es2015" 放在 "stage-0" 之前，
## @babel/preset-env
  @babel/preset-env就是一个presets,以官网的话说：@babel/preset-env是一个智能预设，可让您使用最新的JavaScript，而无需微观管理目标环境所需的语法转换（以及可选的浏览器polyfill）。这都使您的生活更轻松，JavaScript包更小！
  [这篇文章](https://juejin.im/post/5ddff3abe51d4502d56bd143#heading-5)讲到：
  >`@babel.preset-env`会根据你配置的目标环境，生成插件列表来编译。对于基于浏览器或 Electron 的项目，官方推荐使用 .browserslistrc 文件来指定目标环境。默认情况下，如果你没有在 Babel 配置文件中(如 .babelrc)设置 targets 或 ignoreBrowserslistConfig，@babel/preset-env 会使用 browserslist 配置源。如果你不是要兼容所有的浏览器和环境，推荐你指定目标环境，这样你的编译代码能够保持最小。
  例如，仅包括浏览器市场份额超过0.25％的用户所需的 polyfill 和代码转换（忽略没有安全更新的浏览器，如 IE10 和 BlackBerry）
## @babel/polyfill
  @babel/polyfill可以模拟完整的ES2015 +环境。
  >从Babel 7.4.0开始，不推荐使用此软件包，而直接包含core-js / stable（以充实ECMAScript功能）和regenerator-runtime / runtime（需要使用转译的生成器函数）：
  ```javascript
  import "core-js/stable";
  import "regenerator-runtime/runtime";
  ```
  我们也可以直接使用它
  ```javascript
  npm install --save @babel/polyfill
  ```
  >请注意该--save选项而不是，--save-dev因为这是一个需要在源代码之前运行的polyfill。
## 配置文件
  使用babel，需要配置文件，来告诉babel使用哪些plugins和哪些presets以及如何使用他们。
  **babel.config.js**
  在项目根目录下(与package.json同级)创建一个名为 babel.config.js 的文件。
  ```javascript
  module.exports = function(api) {
    api.cache(true)
    const presets = []
    const plugins = []
    return {
      presets,
      plugins
    }
  }
  ```
  **.babelrc**
  ```javascript
  {
      "presets": [],
      "plugins": []
  }
  ```
  **package.json**
  可以将 .babelrc 中的配置信息作为 babel 键(key) 添加到 package.json 文件中:
  ```javascript
  {
    ...
    "babel": {
        "presets": [],
        "plugins": []
    }
  }
  ```
  **.babelrc.js**
  与 .babelrc 配置相同，但是可以使用JS编写。
  ```javascript
  //可以在其中调用 Node.js 的API
  const presets = [];
  const plugins = [];
  module.exports = { presets, plugins };
  ```
更多详细使用，[查看官网](https://www.babeljs.cn/docs/)