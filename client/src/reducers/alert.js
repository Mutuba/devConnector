// import {SET_ALERT, REMOVE_ALERT} from '../actions/types'
// const initialState=[]
// export default function(state=initialState, action){
//   switch(action.type){
//     case SET_ALERT:
//       return [...state, action.payload]
//     case REMOVE_ALERT:
//       return state.filter(alert=>alert.id!==action.payload)
//     default:
//       return state
//   }
// }

import { SET_ALERT, REMOVE_ALERT } from "../actions/types";

const initialState = [];

const alert = (state = initialState, action) => {
  // destructured syntax
  const { type, payload } = action;

  switch (type) {
    case SET_ALERT:
      return [...state, payload];
    case REMOVE_ALERT:
      //got through the alerts and return those whose id is not in the payload
      return state.filter(alert => alert.id !== payload);
    default:
      return state;
  }
};
export default alert;
