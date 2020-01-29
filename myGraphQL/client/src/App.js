import React from 'react';
import {post} from './api';
class App extends React.Component {
  state = {
    name: ''
  }
  componentWillMount() {
    this.getDate();
  }
  getDate = async () => {
    try {
      const username = 'jack';
      const query = `query GetAccount($username: String! $city: String) {
        getAccount(username: $username) {
          name,
          age,
          salary(city: $city)
        }
      }`
      const variables = {username ,city: "北京"}
      let result = await post('/', query,variables);
      console.log(result.data)
      this.setState(state => (result.data.getAccount))
    } catch(err){}
  }
  render() {
  return <div>姓名：{this.state.name},工资：{this.state.salary}</div>
  }
}

export default App;
