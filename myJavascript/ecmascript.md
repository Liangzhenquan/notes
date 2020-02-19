## javascript运行机制
### CPU、进程和线程
**1.CPU**
计算机的核心是CPU，它承担了所有的计算任务。
**2.进程**
cpu资源分配的最小单位（是能拥有资源和独立运行的最小单位）
**3.线程**
是cpu调度的最小单位（线程是建立在进程的基础上的一次程序运行单位，一个进程中可以有多个线程）
>浏览器是多进程的，每一个tab页，就是一个独立的进程，一个进程可以有多个线程
### 浏览器进程
* 主进程
  * ...
* 第三方插件进程
  * ...
* GPU进程
  * `渲染进程`，也就是常说的`浏览器内核`
  * ...
### 浏览器内核（渲染进程）
>进程和线程是一对多的关系，也就是说一个进程包含了多条线程。

渲染进程也是多线程的：
* `GUI渲染线程`
  * 负责渲染页面，布局和绘制
  * 页面需要重绘和回流时，该线程就会执行
  * 与js引擎线程互斥，防止渲染结果不可预期
* `js引擎线程`
  * 负责处理解析和执行javascript脚本程序
  * 只有一个JS引擎线程（单线程）
  * 与GUI渲染线程互斥，防止渲染结果不可预期
* `事件触发线程`
  * 用来控制事件循环（鼠标点击、setTimeout、ajax等）
  * 当事件满足触发条件时，将事件放入到JS引擎所在的执行队列中
* `定时触发器线程`
  * setInterval与setTimeout所在的线程
  * 定时任务并不是由JS引擎计时的，是由定时触发线程来计时的
  * 计时完毕后，通知事件触发线程
* `异步http线程`
  * 浏览器有一个单独的线程用于处理AJAX请求
  * 当请求完成时，若有回调函数，通知事件触发线程

### 为什么javascript是单线程的？
* 1.历史原因，在创建javascript这门语言时，多进程多线程的架构并不流行，硬件支持并不好。
* 2.多线程操作需要加锁，编码的复杂性增高
* 3.如果同时操作DOM，不加锁的情况下，DOM渲染的结果不可预测
### 为什么 GUI 渲染线程与 JS 引擎线程互斥？
因为js是可以操作DOM的，如果同时修改元素属性并渲染界面（`js引擎线程`和`GUI线程`同时运行），那么渲染线程前后获得的元素就可能不一致了。所以为了防止渲染出现不可预测的结果，浏览器设定`js引擎线程`和`GUI线程`互斥，当`js引擎线程`执行时`GUI渲染线程`会被挂起，GUI更新则会被保存在一个队列中等待JS引擎线程空闲时立即被执行。
### 从 Event Loop 看 JS 的运行机制
基本概念：
* js分为同步任务和异步任务
* 同步任务都在JS引擎线程上执行，形成一个`执行栈`
* 事件触发线程管理一个`任务队列`，异步任务触发条件达成，将回调事件放到`任务队列`中
* `执行栈`中所有同步任务执行完毕，此时`js引擎线程`空闲，系统会读取`事件队列`,将可运行的异步任务回调事件添加到`执行栈`中，开始执行

不管是`setTimeout/setInterval`还是`xhr/fetch`代码，在这些代码执行时，本身是同步任务，其中的回调函数才是异步任务。
**setTimeout/setInterval**
代码执行到`setTimeout/setInterval`时，`js引擎线程`通知`定时触发器线程`,间隔一个时间后，会触发一个回调事件，而`定时触发器线程`在接收到这个消息后，会在等待的时间后，将回调事件放入到由`事件触发线程`管理的`事件队列`中
**xhr/fetch**
执行xhr/fetch时，`js引擎线程`会通知`异步http线程`，发送一个网络请求，并制定请求完成后的回调事件，而`异步http线程`在接收到这个消息后，会在请求完成后，将回调事件放入到由`事件触发线程`管理的`事件队列`中

当我们的同步任务执行完，`JS引擎线程`会询问`事件触发线程`，在`事件队列中`是否有待执行的回调函数，如果有就会加入到`执行栈`中交给`JS引擎线程`执行
### 宏任务与微任务
**宏任务**
每次执行栈执行的代码当做是一个宏任务（包括每次从事件队列中获取一个事件回调并放到执行栈中执行）， 每一个宏任务会从头到尾执行完毕，不会执行其他。
会在一个宏任务执行结果后，在下一个宏任务执行前，GUI渲染线程开始工作，对页面进行渲染。
>宏任务 -->渲染 -->宏任务 -->渲染...

主代码块，setTimeout，setInterval等，都属于宏任务
**微任务**
`宏任务`结束后，会执行渲染，然后执行下一个`宏任务`,而`微任务`可以理解成在当前`宏任务`执行后立即执行的任务，也就是说，当宏任务执行完，会在渲染前，将执行期间所产生的所有微任务都执行完。
Promise，process.nextTick等，属于微任务。

![](https://user-gold-cdn.xitu.io/2019/8/21/16cb1d7bb4bd9fd2?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

举例:
```js
function test() {
  setTimeout(() => {
    console.log(1)
  },0)
  Promise.resolve().then(() => {
    console.log(2)
  })
  console.log(3)
}
test()
console.log(4)
```
以上，整体代码是同步任务，执行test，test是同步，依次执行，遇到setTimeout，通知`定时触发器线程`，间隔一个时间后，会触发一个回调事件，`定时触发器线程`收到通知后，间隔一个时间，将回调事件放入到由`事件触发线程`管理的`任务队列`，然后继续执行test的代码，遇到`Promise.resolve().then`,`then()`里面的回调是一个异步任务，通知事件触发线程，将其加入到`任务队列`,test继续执行，打印3，test函数执行完毕，test出栈，当前执行栈为window，打印4，当前`宏任务`执行完毕，检查`任务队列`是否有任务，检查到有微任务，将微任务放到执行栈中执行，打印2，然后检查到有宏任务，将宏任务放到执行栈中执行，打印1。

>`任务队列`分为`微任务队列`和`宏任务队列`,`setTimeout/setInterval`这些会进入`宏任务队列`,`Promise.resolve().then()`的回调事件会进入`微任务队列`，检查任务队列时，先微后宏，有事件回调，则移入执行栈由`js引擎线程`执行。

链接:
* https://juejin.im/post/5e22b391f265da3e204d8c14
* https://juejin.im/post/5a6547d0f265da3e283a1df7
## defineProperty和Proxy
### defineProperty
语法：
`Object.defineProperty(obj, prop, descriptor)`
* `obj`-要在其上定义属性的对象。
* `prop`-要定义或修改的属性的名称。
* `descriptor`-将被定义或修改的属性描述符。

返回：被传递给函数的对象。
#### 属性描述符-descriptor
descriptor是一个对象，对象里目前存在的属性描述符有两种主要形式：`数据描述符`和`存取描述符`。`数据描述符`是一个具有值的属性，该值可能是可写的，也可能不是可写的。`存取描述符`是由getter-setter函数对描述的属性。描述符必须是这两种形式之一；不能同时是两者。
**`数据描述符`和`存取描述符`均具有:**
`configurable`:
当且仅当该属性的 configurable 为 true 时，该属性描述符才能够被改变，同时该属性也能从对应的对象上被删除。默认为 false。
`enumerable`:
当且仅当该属性的enumerable为true时，该属性才能够出现在对象的枚举属性中。默认为 false。
**`数据描述符`才有:**
`value`:
该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）。默认为 undefined。
`writable`:
当且仅当该属性的writable为true时，value才能被赋值运算符改变。默认为 false。
**`存取描述符`才有:**
`get`:
一个给属性提供 getter 的方法，如果没有 getter 则为 undefined。当访问该属性时，该方法会被执行，方法执行时没有参数传入，但是会传入this对象（由于继承关系，这里的this并不一定是定义该属性的对象）。
`set`:
一个给属性提供 setter 的方法，如果没有 setter 则为 undefined。当属性值修改时，触发执行该方法。该方法将接受唯一参数，即该属性新的参数值。
>如果一个描述符不具有value,writable,get 和 set 任意一个关键字，那么它将被认为是一个数据描述符。如果一个描述符同时有(value或writable)和(get或set)关键字，将会产生一个异常。
### Proxy
用于定义基本操作的自定义行为（如属性查找，赋值，枚举，函数调用等），可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。Proxy 这个词的原意是代理，用在这里表示由它来“代理”某些操作，可以译为“代理器”。
语法
`let obj = new Proxy(target, handler)`
以上，`new Proxy`生成一个`Proxy`实例,`target`是要拦截的目标对象，`handler`也是一个对象，用来定制拦截行为。
```js
let proxy = new Proxy({}, {
  get(target,propKey) {
    return 1
  }
})
proxy.name //1
proxy.age //1
```
如果handler没有设置任何拦截，那就等同于直接通向原对象。
```js
var target = {};
var handler = {};
var proxy = new Proxy(target, handler);
proxy.a = 'b';
target.a // "b"
```
**handler**
handler是一个对象，它具有一些属性
`get`:
定义取值操作,get是一个函数，接收三个参数:`target`:目标对象，也就是`Proxy`构造函数的第一个参数的值，`propKey`，目标对象的键名，`receiver`:是Proxy。
```js
let proxy = new Proxy({age: 10}, {
  get(target,propKey,receiver) {
    console.log(target);
    console.log(propKey);
    return 1
  }
})
proxy.age // {age: 10};name;1
```
`set`:
定义存值操作，是一个函数，接收四个参数:`target`:目标对象，也就是`Proxy`构造函数的第一个参数的值，`propKey`:目标对象的键名，`value`:新值,`receiver`:是Proxy。
```js
let proxy = new Proxy({age: 10}, {
  set(target,propKey,value,receiver) {
    console.log('value:',value);
    return target[propkey] = value;
  }
})
proxy.age = 11 // value: 11
```
...
总结：
Object.definePrototype缺点：对数组支持不好，无法监听到数组的变化，
Proxy缺点：兼容性不是太好，不兼容IE，且无法通过polyfill提供兼容。
## 手写代码
### new
过程：
* 1.创建一个新对象
* 2.新对象执行[[原型]]连接
* 3.this指向新创建的对象
* 4.如果该函数没有返回对象，则返回this。

```js
// 构造函数
function Cat(name, age) {
  this.name = name;
  this.age = age;
  // return {name: 'jack'}
}
// new
function New(Con,...args) {
  let obj = {}
  Object.setPrototypeOf(obj, Con.prototype);
  let result = Con.apply(obj, args);
  return result instanceof Object ? result : obj
}
let cat = New(Cat, 'jack', 12)
```
以上判断构造函数的返回值是否为对象，如果是对象，就使用构造函数的返回值，否则返回创建的对象
### Promise
思路：
* 1.三种状态:`pending`、`fulfilled(resolved)`、`rejected`
* 2.只能由`pending`态转换为`fulfilled(resolved)`或`rejected`
* 3.一旦状态发生改变，不可逆转
```js
function createPromise(constructor) {
  let that = this;
  that.status = 'pending'  //定义初始状态
  that.value = undefined  //定义状态为resolved的时候的状态
  self.reason=undefined;//定义状态为rejected的时候的状态
  function resolve(value) {
    if(that.status === 'pending') {
      that.value = value;
      that.status = 'resolved'
    }
  }
  function reject(reason) {
    if(that.status === 'pending') {
      that.reason = reason;
      that.status = 'rejected'
    }
  }
  // 捕获构造异常
  try {
    constructor(resolve,reject);
  }catch(e) {
     reject(e);
  }
}
//定义then方法
createPromise.prototype.then = function(onFullfilled,onRejected) {
  let that = this;
  switch(that.status) {
    case "resolved":
      onFullfilled(that.value);
      break;
    case "rejected":
      onRejected(that.reason);
      break;
    default:
  }
}
```