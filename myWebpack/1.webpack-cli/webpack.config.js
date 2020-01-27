module.exports = {
  entry: './src/index1.js'  //指定入口点为 ./src/index1.js,不指定会从 ./src/index.js开始构建
}
// 上述配置等同于
module.exports = {
  entry: {
    main: './src/index1.js'
  }
}
// 或者配置多个入口
module.exports = {
  entry: {
    index: './src/index.js',
    index1: './src/index1.js',
  }
}
// 使用数组来对多个文件进行打包,可以理解为多个文件作为一个入口，webpack 会解析两个文件的依赖后进行打包。
module.exports = {
  entry: {
    main: [
      './src/index.js',
      './src/index1.js'
    ]
  }
}
