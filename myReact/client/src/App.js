import React from "react";
class B extends React.PureComponent {
  render() {
    return (
      <div>
        {this.props.list.map(item => (
          <p>{item}</p>
        ))}
      </div>
    );
  }
}
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      age: 1,
      name: "jack",
      list: [1, 2, 3]
    };
    console.log("constructor");
  }
  // static getDerivedStateFromProps(props, state) {
  //   console.log('static');
  //   return null;
  // }
  UNSAFE_componentWillMount() {
    console.log("willMount");
  }
  componentDidMount() {
    console.log("idmount");
  }
  UNSAFE_componentWillUpdate(nexProps, nextState) {
    console.log("willUpdate");
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log(snapshot);
    console.log("idUpdate");
    let a = 10;
    let b = 100;
    if (a == b) {
      console.log(123);
    }
  }
  onClick = () => {
    this.setState(state => ({
      age: ++state.age
    }));
  };
  deClick = () => {
    this.setState(state => ({
      age: --state.age
    }));
  };
  render() {
    console.log("render");
    return (
      <div>
        周期
        <p> age: {this.state.age}</p>
        <button onClick={this.onClick}>+</button>
        <button onClick={this.deClick}>-</button>
      </div>
    );
  }
}

export default App;
