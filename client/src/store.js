import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const initialState = {};

const middleware = [thunk];
const composerEnhancer = composeWithDevTools({
    name: `Redux`,
    realtime: true,
    trace: true,
    traceLimit: 25
});
const store = createStore(
  rootReducer,
  initialState,
  composerEnhancer(applyMiddleware(...middleware))
);

export default store;
