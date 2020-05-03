import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import JoinChat from "./components/JoinChat";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact component={JoinChat} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
