[什么是Rxjs?](#什么是rxjs)
[基本概念](#基本概念)
[特点](#特点)
[值(Values)](#值values)
[拉取(Pull) vs 推送(Push)](#拉取pull-vs-推送push)
[Observable-可观察对象](#observable-可观察对象)
[Observer-观察者](#observer-观察者)
[Subscription-订阅](#subscription-订阅)
[Operators-操作符](#operators-操作符)
[安装](#安装)
## 什么是Rxjs?
Rxjs是一个库，它通过使用observable序列来编写异步和基于事件的程序。它提供了一个核心类型`Observable`,附属类型
(Observer、 Schedulers、 Subjects)和受[Array#extras] 启发的操作符 (map、filter、reduce、every, 等等)，这些数组操作符可以把异步事件作为集合来处理。
>可以把Rxjs当作是用来处理事件的lodash
## 基本概念
* **Observable(可观察对象):**表示一个概念，这个概念是一个可调用的未来值或事件的集合
* **Observer(观察者):** 一个回调函数的集合，它知道如何去监听由`Observable`提供的值
* **Subscription(订阅):**表示Observable的执行，主要用于取消`Observabel`的执行
* **Operators(操作符):**采用函数式编程风格的纯函数 (pure function)，使用像 map、filter、concat、flatMap 等这样的操作符来处理集合。
* **Subject (主体):**相当于 EventEmitter，并且是将值或事件多路推送给多个 Observer 的唯一方式。
* **Schedulers (调度器):**用来控制并发并且是中央集权的调度员，允许我们在发生计算时进行协调，例如 setTimeout 或 requestAnimationFrame 或其他。
## 特点
**1.纯净性**
Rxjs使用纯函数来产生值的能力，使得我们的代码更不容易出错
我们通常会创建一个非纯函数，在这个函数之外也使用了共享变量的代码，这将使得我们的应用状态一团糟。
```js
let count = 0;
let btn = document.querySelector('button');
btn.addEventListener('click',()=>{console.log(`clicked: ${++count}`)})
```
如果使用Rxjs,可以将应用状态隔离开来
```js
const button = document.querySelector('button');
Rx.Observable.fromEvent(button,'click')
.scan(count=> count + 1,0)
.subscribe(count => console.log(`clicked ${count}`))
```
`scan`操作符工作原理和`reduce`类似，需要一个暴露给回调函数当参数的初始值。每次回调函数运行后的返回值会作为下次回调函数运行时的参数，也就是说`scan`的第2个参数给定了一个初始值0，传入到`scan`的第一个参数（回调函数）中，这个回调函数就能拿到初始值0，并且加1，而后，1作为第二次`scan`的回调函数运行时的参数，从而实现累加。
**2.流动性**
RxJS 提供了一整套操作符来帮助你控制事件如何流经 observables 。
普通的js如何控制一秒钟内最多点击一次
```js
let count = 0;
let rate = 1000;
let lastClick = Date.now() - rate;
let button = document.querySelector('button');
button.addEventListener('click', () => {
  if(Date.now() - lastClick >= rate) {
     console.log(`clicked: ${++count}`)
     lastClick = Date.now();
  }
})
```
使用Rxjs
```js
let button = document.querySelector('button');
Rx.observable.fromEvent(button,'click')
.throttleTime(1000)
.scan(count => count + 1, 0)
.subscribe(count => console.log(`clicked: ${count}`))
```
## 值(Values)
流经 observables 的值，可以对其进行转换。
普通的 JavaScript如何累加每次点击的鼠标 x 坐标:
```js
let count = 0;
let rate = 1000;
let lastClick = Date.now() - rate;
let button = document.querySelector('button');
button.addEventListener('click', (event) => {
  if (Date.now() - lastClick >= rate) {
    count += event.clientX;
    console.log(count)
    lastClick = Date.now();
  }
});
```
Rxjs
```js
let button = document.querySelector('button');
Rx.observable.fromEvent(button,'click')
.throttleTime(1000)
.map(event => event.clientX)
.scan((count, clientX) => count + clientX, 0)
.subscribe(count => console.log(`clicked: ${count}`))
```
## 拉取(Pull) vs 推送(Push)
>拉取和推送是两种不同的协议，用来描述数据生产者 (Producer)如何与数据消费者 (Consumer)进行通信的。

|| 生产者 | 消费者 |
| ----| ---- | ---- |
|**拉取**| **被动的:** 当被请求时产生数据| **主动的** 决定何时请求数据|
|**推送**| **主动的:** 按自己的节奏生产数据| **被动的** 对收到的请求作出反应|
**拉取**
在拉取体系中，有消费者来决定何时从生产者那里接收数据。生产者本身不知道数据是何时交付到消费者手中的。
**推送**
在推送体系中，由生产者来决定何时把数据发送给消费者。消费者本身不知道何时会接收到数据。
## Observable-可观察对象
obserbable核心关注点
* **创建**
* **订阅**
* **执行**
* **清理**

**创建Observables**
>Observables 可以使用 create 来创建, 但通常我们使用所谓的创建操作符, 像 of、from、interval、等等

方法一：使用`Rx.Observable.create`:
```js
const observable = Rx.Observable.create(function subscribe(observer) => {
  const id = setInterval(() => {
    observer.next('hi')
  }, 1000);
})
```
方法二：使用创建操作符：
```js
Rx.Observable.of(1,2,3).subscribe(count => console.log(count))
```
**订阅Obserbables**
Observable对象可以订阅，像:
```js
Rx.Observable.of(1,2,3).subscribe(count => console.log(count))
```
像上面订阅了obserbable对象，这样可以取到它的值。
>订阅Observable本质上是调用函数，并且提供可接受数据的回调函数。
**执行Obserbable**
Observable.create(function subscribe(observer) {...}) 中...的代码表示 “Observable 执行”，它是惰性运算，只有在每个观察者订阅后才会执行.
如下：
```js
  const observable = Observable.create(function subscribe(observer) {
    var id = setInterval(() => {
      console.log('hello world')
      observer.next('hi')
    }, 1000);
  });
```
以上，每秒会像观察者发送一个字符串'hi',上面我还写了一个`console.log('hello world')`,因为`Obserbable执行`是惰性运行的，所以在不订阅observable的情况下，'hello world'是不会被打印出来的，但是如果我们订阅了他：
```js
observable.subscrbe(x => console.log(x));
// 输出
//hello world
//hi
//hello world
//hi
...
```
`Observable执行`可以传递三种类型的值
* "Next" 通知： 发送一个值，比如数字、字符串、对象，等等。
* "Error" 通知： 发送一个 JavaScript 错误 或 异常。
* "Complete" 通知： 不再发送任何值。
>Observable执行中，next可以发送一个或多个，但是如果发送的是"Error"通知或者"Complete"通知的话，那么之后就不会再发送任何通知了。

"Next" 通知是最重要，也是最常见的类型：它们表示传递给观察者的实际数据。"Error" 和 "Complete" 通知可能只会在 Observable 执行期间发生一次，并且只会执行其中的一个。
```js
  const observable = Observable.create(function subscribe(observer) {
    observer.next(1);
    // observer.error('错误')
    observer.next(2);
  });
   observable.subscribe(x => console.log(x),error => console.error(error));
  //  输出
  // 1
  // 2
```
```js
  const observable = Observable.create(function subscribe(observer) {
    observer.next(1);
    observer.error('错误')
    observer.next(2);
  });
   observable.subscribe(x => console.log(x),error => console.error(error));
  //  输出
  // 1
  // 错误
```
因为发送了"Error"或者"Complete"后，之后就不会再发送任何通知，也就是说发送了"Error"通知后，数字2不会被发送。
当然，用try/catch来处理发送"Error"通知会更加优雅，
```js
const observable = Rx.Observable.create(function subscribe(observer) {
  try {
    observer.next('he;llo');
    observer.next('world');

  } catch(err) {
    observer.error(err)
  }
})
```
以上当我们捕捉到异常后，就发送"Error"通知。
**清理Observable执行**
因为 Observable 执行可能会是无限的，并且观察者通常希望能在有限的时间内中止执行，所以我们需要一个 API 来取消执行。因为每个执行都是其对应观察者专属的，一旦观察者完成接收值，它必须要一种方法来停止执行，以避免浪费计算能力或内存资源。
当调用了 observable.subscribe ，观察者会被附加到新创建的 Observable 执行中。这个调用还返回一个对象，即 Subscription (订阅)：
```js
const subscription = observable.subscribe(x => console.log(x));
```
>当订阅了Observable，会得到一个subscription,它表示进行中的执行，只要调用 unsubscribe() 方法就可以取消执行。
如果使用`create()`来创建Observable，Observable 必须定义如何清理执行的资源
```js
const observable = Rx.Observable.create(function subscribe(observer) {
  // 追踪 interval 资源
  const intervalID = setInterval(() => {
    observer.next('hi');
  }, 1000);

  // 提供取消和清理 interval 资源的方法
  return function unsubscribe() {
    clearInterval(intervalID);
  };
});
```
以上，当我们订阅了observable后，因为 `setInterval`函数，会不断向观察者发送"Next"通知，
所以我们需要在取消执行时把interval给清除掉，
## Observer-观察者
**什么是观察者？** -观察者是由 Observable 发送的值的消费者。观察者只是一组回调函数的集合，每个回调函数对应一种 Observable 发送的通知类型：next、error 和 complete,一下是一个典型的观察者对象
```js
const observer = {
  next: x => console.log('Observer got a next value: ' + x),
  error: err => console.error('Observer got an error: ' + err),
  complete: () => console.log('Observer got a complete notification'),
};
```
要使用观察者，需要把它提供给 Observable 的 subscribe 方法：
```js
observable.subscribe(observer);
```
>观察者只是有三个回调函数的对象，每个回调函数对应一种 Observable 发送的通知类型。

我们也可以如下使用：
```js
observable.subscribe(() => console.log('hello'));
```
以上，当我们订阅`observable`时,只提供了一个回调函数作为参数，并没有将其附加到观察者对象上，这种情况，
`observable.subscribe`内部会创建一个观察者对象，并使用第一个回调函数作为next的处理方法,三种类型的回调函数都可以直接作为参数来提供：
```js
observable.subscribe(
  x => console.log('Observer got a next value: ' + x),
  err => console.error('Observer got an error: ' + err),
  () => console.log('Observer got a complete notification')
);
```
等同于
```js
const observer = {
  next: x => console.log('Observer got a next value: ' + x),
  error: err => console.error('Observer got an error: ' + err),
  complete: () => console.log('Observer got a complete notification'),
};
observable.subscribe(observer);
```
## Subscription-订阅
**什么是 Subscription?** -Subscription 是表示可清理资源的对象，通常是 Observable 的执行
>Subscription 基本上只有一个 unsubscribe() 函数，这个函数用来释放资源或去取消 Observable 执行。
Subscription 还可以合在一起。
```js
let observable = Observable.interval(400);
let observable1 = Observable.interval(1000);
let subscription  = observable.subscribe(x => console.log(`first: ${x}`))
let childSubscription  = observable1.subscribe(x => console.log(`second: ${x}`))
subscription.add(childSubscription)
setTimeout(() => {
  // subscription 和 childSubscription 都会取消订阅
  subscription.unsubscribe();
}, 1000);
```
输出:
```js
first: 0
first: 1
second: 0
```
Subscriptions 还有一个 remove(otherSubscription) 方法，用来撤销一个已添加的子 Subscription 。
```js
subscription.remove(childSubscription)
```
## Subject-主体
Subject 是一种特殊类型的 Observable，它允许将值多播给多个观察者，所以 Subject 是多播的，而普通的 Observables 是单播的(每个已订阅的观察者都拥有 Observable 的独立执行)。
```js
    let observable = Observable.create((observer) => {
      setInterval(() => {
        observer.next(100)
      }, 1000);
    })
    let subscriptionA =  observable.subscribe(x => console.log('A',x))
    let subscriptionB = observable.subscribe(x => console.log('B',x))
    setTimeout(() => {
      subscriptionA.unsubscribe();
    }, 1500);
```
以上，只是取消了观察者A的Observable执行，对观察者B的Observable没有影响，所以，1500毫秒后，依然会打印`B 100`
```js
const subject = new Rx.Subject();

subject.subscribe({
  next: (v) => console.log('observerA: ' + v)
});
subject.subscribe({
  next: (v) => console.log('observerB: ' + v)
});
subject.next(1);
subject.next(2);
```
以上，`subscribe`不会调用发送值的新执行，它仅仅是将观察者注册到观察者列表中，类似于其他库或语言中的 addListener 的工作方式。
而后每次调用next(v)、error(e), complete()会将值多播给观察者们，也就是说`subject.next(1)`和`subject.next(2)`会分别将数字1和2发送给观察者A和B，
## Operators-操作符
RxJS 的根基是 Observable，但最有用的还是它的操作符。操作符是允许复杂的异步代码以声明式的方式进行轻松组合的基础代码单元。
**什么是操作符**
操作符是Observable类型上的方法，比如`.map(...)`、`.filter(...)`、`.merge(...)`等，操作符被调用时，它们不会改变已经存在的 Observable 实例。相反，它们返回一个新的 Observable ，它的 subscription 逻辑基于第一个 Observable。
>操作符是函数，它基于当前的Observable创建一个新的Observable,这是一个无副作用的操作：前面的Observable保持不变
也就是说：
```js
let observable = Observerble.of(1,2,3)
// 在of(1,2,3)后加一个操作符.map();
let observable1 = Observerble.of(1,2,3).map(count => count + '!!!')
```
`.of(..)`操作符返回了一个observable(暂叫A),然后我们再在原基础（.of）后加一个操作符`.map(...)`，这时候也返回了一个observable(暂叫B)，这时候这两个observable(A和B)是不一样的
### 操作符分类
根据不同的用途，操作符可以分为创建、转换、过滤、组合、错误处理、工具，等等，下面是一些常用的操作符，[详细请看](https://cn.rx.js.org/manual/overview.html#h213)
**创建操作符**

|名称| 描述 | 示例 | 示例描述|
| ---- | ---- | ---- | ---- |
|create| 创建一个新的 Observable | Rx.Observable.create((observer) => {...}) | | |
|empty| 创建一个什么数据都不发出并且立马完成的Observable| Rx.Observable.empty() | | |
|from| 从一个数组、类数组对象、Promise、迭代器对象或者类Obeservable对象创建一个Observable(几乎可以把任何东西都能转化为Observable)| Rx.Observable.from([1,2,3])| |
|fromEvent|创建一个来自于 DOM 事件，或者 Node 的 EventEmitter 事件或者其他事件的 Observable|let observable = Rx.Observable.from(button,'click');observable.subscribe(x => console.log(x))| 给button绑定click事件，点击button输出event||
|fromPromise|将promise转换为Observable| let observable = Rx.Observable.fromPromise(Promise.resolve(2));observable.subscribe(x => console.log(x),err => console.error('err',err))| promise状态为成功态，所以输出2。如果是失败态，则输出'err2'
|interval|创建一个 Observable ，该 Observable以指定时间间隔发出连续数字| let observable = Rx.Observable.interval(1000);observable.subscribe(x => console.log(x))|每隔1000毫秒发送一个数字(从0开始，无限发送)
|merge|创建一个输出 Observable ，通过把多个 Observables 的值混合到一个 Observable 中来将其打平。| let observable ...;let observable1;Rx.Observable.merge(observable,observable1)|合并observable和observable
|of|创建一个 Observable，它会依次发出由你提供的参数，最后发出完成通知。| let observable = Rx.Observable.of(1,2,3);observable.subscribe(x => console.log(x), () => {}, () => console.log('完成'))|当我们提供的参数1,2,3都发出后，就发送一个"Complete"通知，所以依次打印1,2,3,完成
|range|闯将一个Observable,连续发送区间内的整数| let observable = Rx.Observable.range(1,10);observable.subscribe(x => console.log(x))|连续输出1,2...10|

**转换操作符**

|名称| 描述 | 示例 | 示例描述|
| ---- | ---- | ---- | ---- |
|groupBy|根据指定条件将源 Observable 发出的值进行分组，并将这些分组作为 GroupedObservables 发出，每一个分组都是一个 GroupedObservable|servable.of({id: 1, name:'jack'}, {id:2, name: 'tom'}, {id: 1, name: 'terry'}).groupBy(p => p.id)|将输入按照id进行分组，并输出2个GroupedObservables，两个GroupedObservables有个key属性分别为1和2|
|map|将给定的 project 函数应用于源 Observable 发出的每个值，并将结果值作为 Observable 发出|Rx.Observable.fromEvent(document, 'click').map(ev => ev.clientX).subscribe(x => console.log(x));|将每次点击结果映射为本次点击的clienX|
|mapTo|每次源 Observble 发出值时，都在输出 Observable 上发出给定的常量值。类似于 map，但它每一次都把源值映射成同一个输出值。|Rx.Observable.fromEvent(document, 'click').mapTo('hi').subscribe(x=>console.log(x))
|pluck|将每个源值(对象)映射成它指定的嵌套属性。类似于 map，但仅用于选择每个发出对象的某个嵌套属性。如果属性无法解析，它会返回 undefined 。|Rx.Observable.of({id: 1,name: 'jack'},{id: 2,name: 'jack'}).pluck('id').subscribe(x => console.log(x))|输出每一个对象的id，所以输出1,2
|scan|对源 Observable 使用累加器函数， 返回生成的中间值， 可选的初始值。像是reduce， 但是会发出中间的累加值。|Observable.of({id: 1, name:'jack'}, {id:2, name: 'tom'}, {id: 1, name: 'terry'}).pluck('id').scan((acc,current) => acc +current,0).subscribe(x => console.log(x))|因为scan累加后发出中间值，所以是0+1,1+2,3+1，输出1,3,4|

**过滤操作符**

|名称| 描述 | 示例 | 示例描述|
| ---- | ---- | ---- | ---- |
|debounce|只有在另一个 Observable 决定的一段特定时间经过后并且没有发出另一个源值之后，才从源 Observable 中发出一个值。相对于防抖|Observable.from(button,'click').debounce(() => Observable.interval(1000)).subscribe(x => console.log(1))|如果两次点击间隔大于1秒，则输出1，例：一阵狂点后，只有最后一次点击完成1秒后才会输出1|
|debounceTime|只有在特定的一段时间经过后并且没有发出另一个源值，才从源 Observable 中发出一个值。|Observable.from(button,'click').debounce(1000).subscribe(x => console.log(1)|一阵狂点后，输出1，在效果上感觉跟debounce一样，具体效果自测|
|distinct|返回 Observable，它发出由源 Observable 所发出的所有与之前的项都不相同的项。与去重效果类似|Observable.of({id: 1},{id: 2}, {id: 2}).distinct(p =>p.id).subscribe(x => console.log(x))| 输出id不同的项，因为有两个对象id是2，所以去掉一个，输出{id:1},{id: 2},如果distinct不接收参数，它会直接使用源 Observable 的每个值来检查是否与先前的值相等。
|filter|只会发出源 Observable 中符合标准函数的值|Observable.of({id: 1}, {id: 2}, {id: 1}).filter(p => p.id != 2).subscribe(x => console.log(x))|过滤id是2的对象|
|first|只发出由源 Observable 所发出的值中第一个(或第一个满足条件的值)。|Observable.of({id: 1}, {id: 2}, {id: 1}).first(p => p.id === 1).subscribe(x => console.log(x))|输出第一个id===1的值，如果first不传参或都不满足条件，则输出所有值中的第一个|
|last|只发出由源 Observable 发出的最后一个值。如果传参，则返回所有满足条件中的最后一个|Observable.of({id: 3}, {id: 2}, {id: 3}).last(p => p.id > 0).subscribe(x => console.log(x))|输出{id: 3}|
|skip|跳过源 Observable 发出的前N个值(N = count)。|Observable.of(1,2,3,'a','b').skip(3).subscribe(x => console.log(x))|输出a,b|
|take|只发出源 Observable 最初发出的的N个值 (N = count)。|Observable.interval(1000).take(3).subscribe(x => console.log(x))|只发出前三个，所以输出0,1,2|
|throttle|从源 Observable 中发出一个值，然后在由另一个 Observable 决定的期间内忽略 节流效果|Observable.fromEvent(btnRef.current, 'click').throttle(() => Observable.interval(1000)).subscribe(x => console.log(x))|狂点按钮，以每1000毫秒最多一次的频率打印x|
|throttleTime|从源 Observable 中发出一个值，然后在 duration 毫秒内忽略随后发出的源值， 然后重复此过程。节流效果|Observable.fromEvent(btnRef.current, 'click').throttleTime(1000)).subscribe(x => console.log(x))|狂点按钮，以每1000毫秒最多一次的频率打印x|

**组合操作符**

|名称| 描述 | 示例 | 示例描述|
| ---- | ---- | ---- | ---- |
|merge|创建一个输出 Observable ，它可以同时发出每个给定的输入 Observable 中的所有值|let observable1...;let observable2;let myMerge = observable1.merge(observable2);myMerge.subscribe(x => console.log(1)) |合并两个observable|
|mergeMap|将每个源值投射成 Observable ，该 Observable 会合并到输出 Observable 中|Observable.of({id: 1,name: 'merry'}...).groupBy(p => p.id).mergeMap(g => g.reduce).subscribe(x => console.log(x))|依次打印:[{id: 1...},{id: 1}],[{id: 2...},{id: 2...}]...
|startWith|返回的 Observable 会先发出作为参数指定的项，然后再发出由源 Observable 所发出的项。|Observable.interval(1000).startWith(5).subscribe(x => console.log(x))|先输出5，而后每秒输出一个数字，0,1,2,3,...|
|zip|将多个 Observable 组合以创建一个 Observable，该 Observable 的值是由所有输入 Observables 的值按顺序计算而来的。|

**条件和布尔操作符**

|名称| 描述 | 示例 | 示例描述|
| ---- | ---- | ---- | ---- |
|every|返回的 Observable 发出是否源 Observable 的每项都满足指定的条件。|Observable.of(1,23,5,10).every(x => x > 0).subscribe(x => console.log(x))|所有数字都大于0，所以打印true|
|find|只发出源 Observable 所发出的值中第一个满足条件的值。|Observable.of(1,23,5,10).find(x => x%5 === 0).subscribe(x => console.log(x))|第一个满足条件的是5，所以输出5|
|findIndex|只发出源 Observable 所发出的值中第一个满足条件的值的索引。|Observable.of(1,23,5,10).findIndex(x => x%5 === 0).subscribe(x => console.log(x))|第一天满足条件的5，索引是2，所以输出2|
|isEmpty|如果源 Observable 是空的话，它返回一个发出 true 的 Observable，否则发出 false |Observable.of().isEmpty().subscribe(x => console.log(x))|源Observable是空，所以打印true|

**数学和聚合操作符**

|名称| 描述 | 示例 | 示例描述|
| ---- | ---- | ---- | ---- |
|count|计算源的发送数量，并当源完成时发出该数值。如果接受参数，输出则表示源值中满足函数的值的数量。|Observable.of(1,2,3,5).count().subscribe(x => console.log(x));Observable.of(1,2,3,5).count(x => x > 2).subscribe(x => console.log(x))|前者输出4，后者接受一个函数作为参数，则输出满足函数条件的个数，满足x > 2的个数有3,5,所以输出2|
|max|当源 Observable 完成时它发出单一项：最大值的项。|Observable.of({id: 1}, {id: 2},{id: -1}).max((a,b) => a.id < b.id ? -1:1).subscribe(x => console.log(x))|获取id最大项,所以输出{id: 2},注意：如果max中为a.id > b.id ? -1: 1,则会输出最小项{id: -1}|
|min|当源 Observable 完成时它发出单一项：最小值的项。|Observable.of({id: 1}, {id: 2},{id: -1}).max((a,b) => a.id < b.id ? -1:1).subscribe(x => console.log(x))|跟max相反|
|reduce|在源 Observalbe 上应用 accumulator (累加器) 函数，然后当源 Observable 完成时，返回 累加的结果|
## 安装
```js
npm install rxjs
```
但是如果这时候像如下使用，是会报错的：
```js
import Rx from 'rxjs/Rx';
Rx.Observable.of(1,2,3)
```
报错：
```js
Module not found: Can't resolve 'rxjs-compat/Observable' in 'D:\notes\myRxjs\client\node_modules\rxjs'
```
这时候我们查看package.json文件发现，我们安装的rxjs是6.X版本的，为了实现从RxJS 5到RxJS 6的迁移路径，RxJS团队发布了一个名为rxjs-compat的同级软件包。这个包创建的API之间的兼容层v6和v5。所以我们需要rxjs和rxjs-compat同时安装来升级现有应用程序^6.0.0,使用此软件包，可以在实现RxJS 6升级时继续运行现有代码库而不会出现问题。它支持RxJS 6发行版中已删除的功能。安装的应用程序包的大小将增加rxjs-compat; 如果您的项目还与Webpack 集成在一起，则这种效果会得到增强4.0.0。因此，建议rxjs-compat在升级过程完成后将其从项目中删除。
[参考链接](https://auth0.com/blog/whats-new-in-rxjs-6/)
```js
npm install rxjs-compat
```
然后就可以通过打补丁的方式只导入所需要的(这对于减少bundle的体积是非常有用的):
```js
import { Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
Observable.of(1,2,3).map(x => x + '!!!').subscribe(count => console.log(count))
// 输出
//1!!!
//2!!!
//3!!!
```

