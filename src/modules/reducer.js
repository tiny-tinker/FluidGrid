import { combineReducers } from "redux";
import imageUrlReducer from "./imageUrl/imageUrlReducer";

export default combineReducers({
  imageUrl: imageUrlReducer
});
