import React from "react";
import {  HashRouter, Route, Switch } from "react-router-dom";
import { Popup } from "./Popup";
import "./styles/modal.css";

function App() {

  return (
    <div className="App">
      < HashRouter>
        <Switch>
          <Route exact path="/" component={Popup} />
        </Switch>
      </ HashRouter>
    </div>
  );
}

export default App;
