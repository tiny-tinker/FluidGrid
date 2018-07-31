import { createStore, applyMiddleware, compose } from "redux";
import createSaggarMiddleware from "redux-saga";
import rootReducer from "./modules/reducer";

import { imageUrlSubscriber } from "./modules/saga";

const initialState = {};
const enhancers = [];
const saggarMiddleware = createSaggarMiddleware();
const middleware = [saggarMiddleware];

if (process.env.NODE_ENV === "development") {
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

  if (typeof devToolsExtension === "function") {
    enhancers.push(devToolsExtension());
  }
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
);

const store = createStore(rootReducer, initialState, composedEnhancers);

saggarMiddleware.run(imageUrlSubscriber);

export default store;
