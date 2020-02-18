<!-- TOC -->

- [什么是 javascript?](#什么是javascript?)
- [组成](#组成)
- [ECMAScript](#ecmascript)
  - [作用域](#作用域)
  - [词法作用域](#词法作用域)
  - [闭包](#闭包)
  - [this](#this)
  - [指向](#指向)
  - [调用位置](#调用位置)
  - [绑定规则](#绑定规则)
  - [对象](#对象)
  - [Getter 和 Setter](#getter和setter)
  - [原型](#原型)
- [DOM](#dom)
- [BOM](#bom)
  - [window对象](#window对象)

## 什么是javascript?

JavaScript（简称“JS”） 是一种具有函数优先的轻量级，解释型或即时编译型的编程语言。

## 组成

人们常把 javascript 和 ECMAScript 用来表达相同的含义，但是其实他们是包含关系，也就是 JavaScript 包含 ECMAScript,ECMAScript 包含于 JavaScript 中，javascript 由三部分组成：

- 核心-ECMAScript
- DOM-文档对象模型
- BOM-浏览器对象模型

## ECMAScript

### 作用域

作用域是在运行时代码中的某些特定部分中变量，函数和对象的可访问性。当一个块或函数嵌套在另一个块或函数中时，就发生了作用域的嵌套。因此，在当前作用域中无法找到某个变量时，引擎就会在外层嵌套的作用域中继续查找，直到找到该变量，
或抵达最外层的作用域（也就是全局作用域）为止。

```js
let a = 0;
let foo = () => {
  console.log(a);
};
```

以上有两个作用域：全局作用域和 foo 函数作用域，函数作用域是被嵌套在全局作用域中的，也就是说作用域为：全局 ->foo，当在 foo 作用域找不着 a 时，会往外面一层作用域查找 a，也就是全局作用域查找 a,如果有作用域全局 -> a -> b -> c,在 c 中查找一个变量 x，如果找不到 x,会去 b 作用域找，找不到就往 a 找，再找不到就往全局找。。直到找完所有作用域。这就是一个作用域链。

### 词法作用域

作用域有两种工作模型：

- 词法作用域
- 动态作用域
  **词法作用域**
  简单地说，词法作用域就是定义在词法阶段的作用域。换句话说，词法作用域是由你在写代码时将变量和块作用域写在哪里来决定的，因此当词法分析器处理代码时会保持作用域不变。
  > 无论函数在哪里被调用，也无论它如何被调用，它的词法作用域都只由函数被声明时所处的位置决定。

### 闭包

当函数可以记住并访问所在的词法作用域时，就产生了闭包，即使函数是在当前词法作用域之外执行。

```js
function fn1() {
  var name = "iceman";
  function fn2() {
    console.log(name);
  }
  return fn2;
}
var fn3 = fn1();
fn3();
```

这样就清晰地展示了闭包：

- fn2 的词法作用域能访问 fn1 的作用域
- 将 fn2 当做一个值返回
- fn1 执行后，将 fn2 的引用赋值给 fn3
- 执行 fn3，输出了变量 name

我们知道通过引用的关系，fn3 就是 fn2 函数本身。执行 fn3 能正常输出 name，这不就是 fn2 能记住并访问它所在的词法作用域，而且 fn2 函数的运行还是在当前词法作用域之外了。
正常来说，当 fn1 函数执行完毕之后，其作用域是会被销毁的，然后垃圾回收器会释放那段内存空间。而闭包却很神奇的将 fn1 的作用域存活了下来，fn2 依然持有该作用域的引用，这个引用就是闭包。

### this

**为什么要用 this?**

```js
function identify() {
  return this.name.toUpperCase();
}
function speak() {
  let hello = `hello i am ${identify.call(this)}`;
  console.log(hello);
}
let me = {
  name: "jack"
};
let you = {
  name: "tom"
};
identify.call(me); //JACK
identify.call(you); //TOM
speak.call(me); //hello i am JACK
speak.call(you); //hello i am TOM
```

而如果不用 this,我们需要给函数传递一个上下文对象:

```js
function identify(context) {
  return context.name.toUpperCase();
}
function speak(context) {
  let hello = `hello i am ${identify.call(context)}`;
  console.log(hello);
}
identify.call(you);
speak.call(me);
```

> this 提供了一种更优雅的方式来‘隐式’传递一个对象引用，因此我们可以将 API 设计的更加简洁并且容易复用

#### 指向

##### 调用位置

this 实际上是在函数被调用时发生的绑定，它的指向完全取决于函数在哪里被调用。
在理解 this 之前，我们先弄明白，什么是**调用位置**？

> 调用位置：函数在代码中被调用的位置，而不是声明的位置

##### 绑定规则

- 默认绑定
- 隐式绑定
- 显示绑定
- new 绑定

**1.默认绑定**
默认绑定是无法应用其他绑定时的默认规则，也就是说不是隐式绑定、显示绑定和 new 绑定的情况下才会应用默认绑定。

```js
var age = 12;
function cat() {
  console.log(this.age);
}
cat(); //12
```

**2.隐式绑定**

```js
function cat() {
  console.log(this.age);
}
var obj = {
  name: "tom",
  age: 12,
  cat: cat
};
obj.cat();
```

在这种情况下， 调用位置会使用 obj 上下文来引用函数，我们也可以说函数被调用时 obj 对象'拥有'或'包含'它
对象引用链中只有最后一层会影响调用位置，例：

```js
function cat() {
  console.log(this.age);
}
var obj = {
  name: "tom",
  age: 12,
  cat: cat
};
var obj2 = {
  name: "jack",
  age: 20,
  obj: obj
};
obj2.obj.cat(); //12
```

换句话说，函数通过对象链来调用时，this 指向函数的最近对象。
但是下面情况 this 会绑定到全局对象或 undefined,取决于是否严格模式

```js
function cat() {
  console.log(this.age);
}
var obj = {
  name: "tom",
  age: 12,
  cat: cat
};
var foo = obj.cat;
var age = 15;
foo();
```

虽然 foo 和 obj.cat 是同一个引用，但实际上，它引用的是 cat 函数本身，此时的 foo 是不带任何修饰的函数调用，因此应用默认绑定
\*\*3.显式绑定
我们可以通过`call`、`apply`、`bind`来绑定 this

```js
function cat() {
  console.log(this.age);
}
var age = 12;
var obj = {
  age: 10
};
cat.call(obj); //10
cat.apply(obj); //10
let cat1 = cat.bind(obj);
cat1(); //10
```

**new 绑定**
使用 new 时，会自动执行以下操作:

- 1.创建一个新的对象
- 2.这个新对象被执行原型链接
- 3.这个新对象会绑定到函数调用的 this
- 4.如果函数没有返回其他对象，那么 new 表达式中的函数调用会自动返回这个新对象

```js
function Cat(a) {
  this.a = a;
}
var cat = new Cat("tom");
console.log(cat.a); //tom
```

> 箭头函数无 this，它内部的 this 是根据外层作用域决定的

### 对象

访问对象的值可以使用.操作符或者[]操作符

- .操作符称为属性访问
- []操作符称为键访问

#### Getter 和 Setter

getter 和 setter 可以改写默认操作，但是只能应用在单个属性上，无法应用在整个对象上，getter 是在获取属性值时调用，setter 是在设置属性值时调用

```js
let obj = {
  name: "jack",
  age: 10
};
Object.defineProperty(obj, "name", {
  get: function() {
    return 1;
  }
});
```

```js
let obj = {
  name: "jack"
};
obj.name; //属性访问
obj["name"]; //键访问
```

区别: .操作符要求命名满足标识符的命名规范，而[]操作符可以接收任何 UTF-8/Unicode 字符串作为属性名

### 原型

**为什么需要原型**

```js
function Cat(age, name) {
  this.age = age;
  this.name = name;
  this.eat = () => {
    console.log(`${this.name} is ${this.age}`);
  };
}
let cat1 = new Cat(12, "tom");
let cat2 = new Cat(10, "jack");
cat1.eat(); //tom is 12
cat2.eat(); //jack is 10
```

通过上面，我们可以看出，当我们 new 一个实例时，每一个实例都会得到一个 eat 方法，如果 new 的实例多了，是不是就会很好内存了呢？既然每一个对象都有一个 eat 方法，我们可不可以把他提取出来，当做共享方法呢？原型就可以做到。

```js
function Cat(age, name) {
  this.age = age;
  this.name = name;
}
Cat.prototype.eat = function() {
  console.log(`${this.name} is ${this.age}`);
};
let cat1 = new Cat(12, "tom");
let cat2 = new Cat(10, "jack");
cat1.eat();
cat2.eat();
```

现在，我们把 eat 方法放到了一个 prototype 对象中,当我们 new 一个实例时，我们
会链接到这个 prototype,prototype 是一个内置属性，我们可以把他当做一个共享库。
其实还有一个**proto**,那么**proto 和 prototype 有什么区别呢？
其实**proto\_\_是指向父构造函数的原型，而 prototype 是构造函数的原型，依然是上面例子：

```js
...
cat1.__proto__ // {eat: f,constructor: f}
cat1.prototype  // undefined
Cat.prototype // {eat: f,constructor: f}
cat1.__proto__ === Cat.prototype //true
```

当我们试图引用对象的属性时，会触发[[GET]]操作，比如`cat1.eat`，第一步是先检查自身是否有这个属性，如果有的话，就使用它，否则就会使用对象的原型链？
**什么是原型链** -当一个构造函数的原型是另一个构造函数的实例时，就构成了原型链

```js
function SuperType() {
  this.property = true;
}
SuperType.prototype.getVal = function() {
  return this.property;
};
function SubType() {
  this.subProperty = false;
}
SubType.prototype = new SuperType();
SubType.prototype; //SuperType {property: true}
SuperType.prototype; //{getVal: ƒ, constructor: ƒ}
SubType.prototype.getVal(); // true

SubType.prototype.getSubVal = function() {
  return this.subProperty;
};
let sub = new SubType();
sub.getVal(); //true
sub.getSubVal(); //false
```

如果我想再创建一个构造函数来继承`SuperType`和`SubType`,该怎么做？

```js
...
function MySubType() {
  this.mySub = 'this is my'
}
MySubType.prototype = new SubType();
MySubType.prototype.getMyVal = function() {
  return this.mySub;
}
let my = new MySubType();
my.getMyVal() // this is my
my.getVal() // true
my.getSubVal() //false
```

通过将一个构造函数的原型重写，代之以一个新构造函数的实例，就实现了原型链，原型链是一种继承。如同上面，mySubType 继承 SubType,SubType 继承 SuperType;

## DOM

文档对象模型（DOM，Document Object Model）是针对 XML 但经过扩展用于 HTML 的应用程序编程接口（API，Application Programming Interface）,也就是说，我们可以在 javascript 中，用 dom 来对 HTML 进行操作。

```js
let doc = document.getElementById("intro"); //id查找
doc.innerHTML = "新的html";
```

以上，我们将操作 dom，查找 html 中 id 为 intro 的标签，并修改它的内部元素。

## BOM

BOM 提供了很多访问浏览器的功能，这些功能与网友内容无关。

### window对象

**窗口位置**

- screenLeft 和 screenTop 分别表示窗口相对于屏幕左边和上边的位置 --IE、Safari、Opera 和 Chrome
- screenX 和 screenY 分别表示窗口相对于屏幕左边和上边的位置 --Safari、Firefox 和 Chrome

```js
let leftPos =
  typeof window.screenLeft === "number" ? window.screenLeft : window.screenX;
let topPos =
  typeof window.screenTop === "number" ? window.screenTop : window.screenY;
```

如果浏览器中 screenLeft 和 screenTop 属性存在，则使用他们，否则用 screenX 和 screenY、
**窗口大小**

- innerWidth、innerHeight、outerWidth、outerHeight --IE9+、Firefox、Safari、Opera 和 Chrome

outerWidth: 浏览器窗口本身的尺寸
innterWidth: 页面中视图区的大小。

> ie8 及更早之前版本没有提供提供取得当前浏览器窗口尺寸的属性，它通过 DOM 提供了页面可见区域的信息

渲染页面的模式分为混杂模式和标准模式，document 中有一个属性叫`compatMode`用于区分渲染页面的模式

- document.compatMode === 'CSS1Compat' --标准模式
- document.compatMode === 'BackCompat' --混杂模式
  标准模式下可以使用 document.documentElement.clientWidth 来获取页面视口的信息,混杂模式下可以使用 document.body.clientWidth 来获取
