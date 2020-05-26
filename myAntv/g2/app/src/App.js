/*
 * @Description:
 * @Autor: liang
 * @Date: 2020-05-01 16:34:10
 * @LastEditors: liang
 * @LastEditTime: 2020-05-02 14:33:21
 */
import React, { useEffect } from "react";
import { pages, files } from "./router";
import "./styles/index.css";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import Page from "./Page";
function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Page pages={pages} files={files} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
