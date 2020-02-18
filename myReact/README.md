## 什么是React?
用来构建用户界面的javascript库。
## 生命周期
**componentWillMount**
挂载之前被调用，在render之前被调用，因此在此方法中同步调用 setState() 不会触发额外渲染。通常，使用 constructor() 来初始化 state。避免在此方法中引入任何副作用或订阅。如遇此种情况，请改用 componentDidMount()。
```js
componentWillMount() {
  console.log('willMount')
}
render() {
  console.log('render')
  return ...
}
//willMount
//render
```
**componentDidMount**
在组件挂载后（插入 DOM 树中）立即调用。依赖于 DOM 节点的初始化应该放在这里。如需通过网络请求获取数据，此处是实例化请求的好地方。
```js
componentWillMount() {
  console.log('willMount')
}
componentDidMount() {
  console.log('idMount')
}
render() {
  console.log('render')
  return ...
}
//willMount
//idMount
//render
```
**componentWillUpdate**
```js
componentWillUpdate(nextProps,nextState)
```
当组件收到新的 props 或 state 时，会在渲染之前调用,初始渲染不会调用此方法。不能再此方法中调用`this.setState()`,该方法接收两个参数，下次更新的props以及下次更新的state。
```js
state = {
  age: 1
}
componentWillUpdate(nextProps,nextState) {
  console.log(nextState)
}
changeState = () {
   this.states(state =>({
     age: ++state.age
   }))
}
render() {
  return <button onClick={this.changeState}>+<button>
}
```
以上，第一次点击按钮+，打印2,因为`componentWillUpdate`接收的两个参数是下次更新的数据，也就是说点击了+，age由1（旧）变为2（新），下次更新的数据就是2，打印2。
**componentDidUpdate**
```js
componentDidUpdate(prevProps, prevState, snapshot)
```
 会在更新后会被立即调用。首次渲染不会执行此方法。当组件更新后，可以在此处对 DOM 进行操作。如果你对更新前后的 props 进行了比较，也可以选择在此处进行网络请求。（例如，当 props 未发生变化时，则不会执行网络请求）。
```js
componentDidUpdate(prevProps) {
  // 典型用法（不要忘记比较 props）：
  if (this.props.userID !== prevProps.userID) {
    this.fetchData(this.props.userID);
  }
}
```
 也可以在 componentDidUpdate() 中直接调用 setState()，但请注意它必须被包裹在一个条件语句里，正如上述的例子那样进行处理，否则会导致死循环。它还会导致额外的重新渲染，虽然用户不可见，但会影响组件性能。不要将 props “镜像”给 state，请考虑直接使用 props。 欲了解更多有关内容，请参阅为什么 props 复制给 state 会产生 bug。
如果组件实现了 getSnapshotBeforeUpdate() 生命周期（不常用），则它的返回值将作为 componentDidUpdate() 的第三个参数 “snapshot” 参数传递。否则此参数将为 undefined。
**shouldComponentUpdate**
```js
shouldComponentUpdate(nextProps, nextState)
```
根据 shouldComponentUpdate() 的返回值，判断 React 组件的输出是否受当前 state 或 props 更改的影响。默认行为是 state 每次发生变化组件都会重新渲染。大部分情况下，你应该遵循默认行为。
当 props 或 state 发生变化时，shouldComponentUpdate() 会在渲染执行之前被调用。返回值默认为 true。首次渲染或使用 forceUpdate() 时不会调用该方法。
此方法仅作为性能优化的方式而存在。不要企图依靠此方法来“阻止”渲染，因为这可能会产生 bug。你应该考虑使用内置的 PureComponent 组件，而不是手动编写 shouldComponentUpdate()。PureComponent 会对 props 和 state 进行浅层比较，并减少了跳过必要更新的可能性。
```js
class A extends Compoment {
  state = {
    age: 10
    name: 'jack'
  }
  changeAge = () => {
    this.state(state => ({
      age: state.age + 1;
    }))
  }
  render() {
    return (
      <div>
        <B name={this.state.name}/>
        <button onClick={this.changeAge}>+</button>
      </div>
    )
  }
}
class B extends Component {
  shouldComponentUpdate(nextProps) {
    if(this.props.name !== nextProps.name) {
      return true
    }
    return false
  }
  render() {
    return <div>{this.props.name}<div>
  }
}
```
以上如果不用`shouldComponentUpdate`，每次A的state更新，都会执行A的render，然后B也会重新render，用了`shouldComponentUpdate`,可以使得B只在必要的时候重新render，当然，我们也可以用`PureComponent`来实现相同效果
```js
import React,{PureComponent} from 'react';
...
class B extends PureComponent {
  render() {
    return <div>{this.props.name}<div>
  }
}
```
>如果 shouldComponentUpdate() 返回 false，则不会调用 UNSAFE_componentWillUpdate()，render() 和 componentDidUpdate()。
**static getDerivedStateFromProps**
调用 render 方法之前调用，并且在初始挂载及后续更新时都会被调用。它应返回一个对象来更新 state，如果返回 null 则不更新任何内容。
此方法适用于罕见的用例，即 state 的值在任何时候都取决于 props
**getSnapshotBeforeUpdate**
```js
getSnapshotBeforeUpdate(prevProps, prevState)
```
在最近一次渲染输出（提交到 DOM 节点）之前调用。它使得组件能在发生更改之前从 DOM 中捕获一些信息（例如，滚动位置）。此生命周期的任何返回值将作为参数传递给 componentDidUpdate()。
此用法并不常见，但它可能出现在 UI 处理中，如需要以特殊方式处理滚动位置的聊天线程等。
应返回 snapshot 的值（或 null）。