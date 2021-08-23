import React from "react";
import {  HashRouter, Route, Switch } from "react-router-dom";
import Home from "./page/Home";
import "./styles/style.css"

function App() {

  return (
    <div className="App">
      < HashRouter>
        <Switch>
          <Route exact path="/" component={Home} />
        </Switch>
      </ HashRouter>
    </div>
  );
}

export default App;