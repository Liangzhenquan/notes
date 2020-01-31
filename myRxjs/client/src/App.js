import React,{useEffect} from 'react';
import { Observable} from 'rxjs/Observable';
import { Subject} from 'rxjs/Subject';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/groupBy';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/map';
function App() {
  let btnRef = React.createRef()
  useEffect(() => {
    Observable
    .of(1,2,3)
    .map(x => x + '!!!')
    .toArray()
    .subscribe((x) => console.log(x))
    // Observable.of({id: 1,name: 'merry'}, {id: 2,name: 'terroy'},{id: -1,name: 'tom'},{id: 2,name:'jack'})
    // .groupBy(p=>p.id)
    // .mergeMap(groupOb => {console.log(groupOb);return groupOb.reduce((prev, curr) => [...prev, curr],[])})
    // .toArray()
    // .subscribe(x => console.log(x))
  },[])
  return (
    <div className="App">
      123
      <button ref={btnRef}>按钮</button>
    </div>
  );
}

export default App;
