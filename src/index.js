import React from "react";
import ReactDOM from "react-dom";
import Home from "./scenes/Home";
import { Provider } from "react-redux";
import store from "./store";
import "./styles.css";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Home />
      </div>
    </Provider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
