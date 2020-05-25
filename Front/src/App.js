import React from "react";
import Drop from "./components/Drop";
import Home from "./components/Home";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App"></div>
      <Route exact path="/" component={Drop}></Route>
      <Route path="/home" component={Home}></Route>
    </Router>
  );
}

export default App;
