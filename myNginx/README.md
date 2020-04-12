<!--
 * @Description:
 * @Autor: liang
 * @Date: 2020-04-12 10:06:12
 * @LastEditors: liang
 * @LastEditTime: 2020-04-12 22:20:24
 -->

## 环境

配置：ubuntu

## 安装配置 nginx

- 1.安装

```js
sudo apt-get install nginx
```

Ubuntu 安装之后的文件结构大致为：

所有的配置文件都在/etc/nginx 下，并且每个虚拟主机已经安排在了/etc/nginx/sites-available 下
程序文件在/usr/sbin/nginx
日志放在了/var/log/nginx 中
并已经在/etc/init.d/下创建了启动脚本 nginx
默认的虚拟主机的目录设置在了/var/www/nginx-default (有的版本 默认的虚拟主机的目录设置在了/var/www, 请参考/etc/nginx/sites-available 里的配置)

- 2.启动

```js
sudo /etc/init.d/nginx start
```

- 3.查看是否启动

```js
netstat - lnp;
```

打开你的服务器的公网 IP，如果出来一个 welcome to nginx。。。的页面，说明启动成功

## 配置文件 nginx.conf

nginx.conf🈶 由三部分组成

### 1.全局块

从配置文件到 events 之间到内容，主要会设置一些影响 nginx 服务器整体运行到配置指令，主要包括配置运行 nginx 服务器到用户组、运行生成的 worker process 数， 进程 PID 存放路径、日子存放路径和类型以及配置文件的引入等
如：

> worker processes 1;

这是 nginx 服务器并发处理服务到关键配置，值越大，可以处理的并发量越多，但会受软硬件设备但制约

### 2.events 块

涉及指令主要影响 nginx 服务器与用户的网络链接,常用的指令包括是否开启对多 work process 下的网络链接进行序列化，是否允许同时接收多个网络链接，选取哪种事件驱动模型来处理链接请求，每个 worker process 可以同时支持对最大链接数等

> worker connections 1024

每个 worker process 支持最大的连接数为 1024，对性能影响较大，应灵活配置

### 3. http 块

配置最频繁的部分，代理、缓存和日志定义等绝大多数功能和第三方模块的配置都在这里

> http 块分为 http 全局块和 server 块

- http 全局块
  指令包括文件引入、MIME—TYPE 定义、日志自定义、链接超时时间、单链接请求数上限等

```js
http {
  ...   //全局块定义
  server {

  }
}
```

## 使用

```js
worker_processes  1;

events {
    worker_connections  1024;
}
http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    keepalive_timeout  65;

    #gzip  on;
    server {
      listen 80;
      server_name 118.25.178.83;
      index index.html;
      root /var/www/html/build;    //静态文件路径
      try_files $uri $uri/ /index.html;  //网站根目录
      location /api/ {
        proxy_pass http://localhost:3000/;  //反向代理
      }
    }
}
```

### pm2 启动 node

linux 下载 pm2 有很多方法，自行百度，如果都不行，可以试试这种方法

1.首先在本地全局安装 pm2

```js
npm i pm2 -g
```

然后通过`npm config get prefix`查找到全局安装的 pm2（在...node_modules/）下，然后把 pm2 整个文件夹复制出来，打包后通过各种方式上传到服务器 2.配置为全局命令
在 linux 中，通过软连接将 pm2 设置为全局命令

```js
sudo ln -s /pm2/bin/pm2 /usr/local/bin/pm2
```

上面的是 pm2 目录下的 bin 目录下的一个 pm2 可执行文件 软连接到 /usr/local/bin/pm2
这样之后全局输入 pm2 命令都行了
