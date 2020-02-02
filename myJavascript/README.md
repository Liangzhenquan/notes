## 什么是javascript?
JavaScript（简称“JS”） 是一种具有函数优先的轻量级，解释型或即时编译型的编程语言。
## 组成
人们常把javascript和ECMAScript用来表达相同的含义，但是其实他们是包含关系，也就是JavaScript包含ECMAScript,ECMAScript包含于JavaScript中，javascript由三部分组成：
* 核心-ECMAScript
* DOM-文档对象模型
* BOM-浏览器对象模型
## ECMAScript
### 作用域
作用域是在运行时代码中的某些特定部分中变量，函数和对象的可访问性。当一个块或函数嵌套在另一个块或函数中时，就发生了作用域的嵌套。因此，在当前作用域中无法找到某个变量时，引擎就会在外层嵌套的作用域中继续查找，直到找到该变量，
或抵达最外层的作用域（也就是全局作用域）为止。
```js
let a = 0;
let foo = () => {
  console.log(a)
}
```
以上有两个作用域：全局作用域和foo函数作用域，函数作用域是被嵌套在全局作用域中的，也就是说作用域为：全局 ->foo，当在foo作用域找不着a时，会往外面一层作用域查找a，也就是全局作用域查找a,如果有作用域全局 -> a -> b -> c,在c中查找一个变量x，如果找不到x,会去b作用域找，找不到就往a找，再找不到就往全局找。。直到找完所有作用域。这就是一个作用域链。
### 词法作用域
作用域有两种工作模型：
* 词法作用域
* 动态作用域
**词法作用域**
简单地说，词法作用域就是定义在词法阶段的作用域。换句话说，词法作用域是由你在写代码时将变量和块作用域写在哪里来决定的，因此当词法分析器处理代码时会保持作用域不变。
>无论函数在哪里被调用，也无论它如何被调用，它的词法作用域都只由函数被声明时所处的位置决定。
### 闭包
当函数可以记住并访问所在的词法作用域时，就产生了闭包，即使函数是在当前词法作用域之外执行。
```js
function fn1() {
	var name = 'iceman';
	function fn2() {
		console.log(name);
	}
	return fn2;
}
var fn3 = fn1();
fn3();
```
这样就清晰地展示了闭包：
* fn2的词法作用域能访问fn1的作用域
* 将fn2当做一个值返回
* fn1执行后，将fn2的引用赋值给fn3
* 执行fn3，输出了变量name

我们知道通过引用的关系，fn3就是fn2函数本身。执行fn3能正常输出name，这不就是fn2能记住并访问它所在的词法作用域，而且fn2函数的运行还是在当前词法作用域之外了。
正常来说，当fn1函数执行完毕之后，其作用域是会被销毁的，然后垃圾回收器会释放那段内存空间。而闭包却很神奇的将fn1的作用域存活了下来，fn2依然持有该作用域的引用，这个引用就是闭包。
### this
**为什么要用this?**
```js
function identify() {
  return this.name.toUpperCase();
}
function speak() {
  let hello = `hello i am ${identify.call(this)}`
  console.log(hello);
}
let me = {
  name: 'jack'
}
let you = {
  name: 'tom'
}
identify.call(me);  //JACK
identify.call(you); //TOM
speak.call(me); //hello i am JACK
speak.call(you); //hello i am TOM
```
而如果不用this,我们需要给函数传递一个上下文对象:
```js
function identify(context) {
  return context.name.toUpperCase();
}
function speak(context) {
  let hello = `hello i am ${identify.call(context)}`
  console.log(hello);
}
identify.call(you);
speak.call(me);
```
>this提供了一种更优雅的方式来‘隐式’传递一个对象引用，因此我们可以将API设计的更加简洁并且容易复用
#### 指向
##### 调用位置
this实际上是在函数被调用时发生的绑定，它的指向完全取决于函数在哪里被调用。
在理解this之前，我们先弄明白，什么是**调用位置**？
>调用位置：函数在代码中被调用的位置，而不是声明的位置

##### 绑定规则
* 默认绑定
* 隐式绑定
* 显示绑定
* new绑定

**1.默认绑定**
默认绑定是无法应用其他绑定时的默认规则，也就是说不是隐式绑定、显示绑定和new绑定的情况下才会应用默认绑定。
```js
var age = 12
function cat() {
  console.log(this.age)
}
cat()  //12
```
**2.隐式绑定**
```js
function cat() {
  console.log(this.age)
}
var obj = {
  name: 'tom',
  age: 12,
  cat: cat
}
obj.cat()
```
在这种情况下， 调用位置会使用obj上下文来引用函数，我们也可以说函数被调用时obj对象'拥有'或'包含'它
对象引用链中只有最后一层会影响调用位置，例：
```js
function cat() {
  console.log(this.age)
}
var obj = {
  name: 'tom',
  age: 12,
  cat: cat
}
var obj2 = {
  name: 'jack',
  age: 20,
  obj: obj
}
obj2.obj.cat() //12
```
换句话说，函数通过对象链来调用时，this指向函数的最近对象。
但是下面情况this会绑定到全局对象或undefined,取决于是否严格模式
```js
function cat() {
  console.log(this.age)
}
var obj = {
  name: 'tom',
  age: 12,
  cat: cat
}
var foo = obj.cat
var age = 15;
foo()
```
虽然foo和obj.cat是同一个引用，但实际上，它引用的是cat函数本身，此时的foo是不带任何修饰的函数调用，因此应用默认绑定
**3.显式绑定
我们可以通过`call`、`apply`、`bind`来绑定this
```js
function cat() {
  console.log(this.age)
}
var age = 12
var obj = {
  age: 10
}
cat.call(obj) //10
cat.apply(obj) //10
let cat1 = cat.bind(obj)
cat1()  //10
```
**new绑定**
使用new时，会自动执行以下操作:
* 1.创建一个新的对象
* 2.这个新对象被执行原型链接
* 3.这个新对象会绑定到函数调用的this
* 4.如果函数没有返回其他对象，那么new表达式中的函数调用会自动返回这个新对象
```js
function Cat(a) {
  this.a = a
}
var cat = new Cat('tom');
console.log(cat.a) //tom
```
>箭头函数无this，它内部的this是根据外层作用域决定的
## 对象
访问对象的值可以使用.操作符或者[]操作符
* .操作符称为属性访问
* []操作符称为键访问
### Getter和Setter
getter和setter可以改写默认操作，但是只能应用在单个属性上，无法应用在整个对象上，getter是在获取属性值时调用，setter是在设置属性值时调用
```js
let obj = {
  name: 'jack',
  age: 10
}
Object.defineProperty(obj, 'name', {
  get: function() {
    return 1
  }
})
```
```js
let obj = {
  name: 'jack'
}
obj.name //属性访问
obj['name'] //键访问
```
区别: .操作符要求命名满足标识符的命名规范，而[]操作符可以接收任何UTF-8/Unicode字符串作为属性名
## 原型
**为什么需要原型**
```js
function Cat(age, name) {
  this.age = age;
  this.name = name;
  this.eat = () => {
    console.log(`${this.name} is ${this.age}`)
  }
}
let cat1 = new Cat(12, 'tom');
let cat2 = new Cat(10, 'jack');
cat1.eat() //tom is 12
cat2.eat() //jack is 10
```
通过上面，我们可以看出，当我们new一个实例时，每一个实例都会得到一个eat方法，如果new的实例多了，是不是就会很好内存了呢？既然每一个对象都有一个eat方法，我们可不可以把他提取出来，当做共享方法呢？原型就可以做到。
```js
function Cat(age, name) {
  this.age = age;
  this.name = name;
}
Cat.prototype.eat = function() {
  console.log(`${this.name} is ${this.age}`)
}
let cat1 = new Cat(12, 'tom')
let cat2 = new Cat(10, 'jack')
cat1.eat()
cat2.eat()
```
现在，我们把eat方法放到了一个prototype对象中,当我们new一个实例时，我们
会链接到这个prototype,prototype是一个内置属性，我们可以把他当做一个共享库。
其实还有一个__proto__,那么__proto和prototype有什么区别呢？
其实__proto__是指向父构造函数的原型，而prototype是构造函数的原型，依然是上面例子：
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
}
function SubType() {
  this.subProperty = false;
}
SubType.prototype = new SuperType();
SubType.prototype //SuperType {property: true}
SuperType.prototype //{getVal: ƒ, constructor: ƒ}
SubType.prototype.getVal() // true

SubType.prototype.getSubVal = function() {
  return this.subProperty;
}
let sub = new SubType()
sub.getVal()  //true
sub.getSubVal()  //false
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
通过将一个构造函数的原型重写，代之以一个新构造函数的实例，就实现了原型链，原型链是一种继承。如同上面，mySubType继承SubType,SubType继承SuperType;



