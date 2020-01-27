const path = require('path');
module.exports = {
  // 告诉webpack-dev-server，给src文件夹下的文件提供localhost:8080服务
  devServer: {
    contentBase: path.join(__dirname, 'src'),
    port: 3000,  //端口号

    //在 webpack-dev-server 静态资源中间件处理之前，可以用于拦截部分请求返回特定内容，或者实现简单的数据 mock。
    before(app) {
      app.get('/', function(req, res) { // 当访问 / 路径时，返回自定义的 json 数据
        res.json({ custom: 'response' })
      })
    },

    // 在 webpack-dev-server 静态资源中间件处理之后，比较少用到，可以用于打印日志或者做一些额外处理
    after: function(app, server, compiler) {
      // do fancy stuff
    }
  }
}