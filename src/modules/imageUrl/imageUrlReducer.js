import { handleActions } from "redux-actions";

import { getImageLists } from "./imageUrlAction";

const defaultState = {
  loading: false,
  error: null,
  imageUrls: []
};

const reducer = handleActions(
  {
    [getImageLists](state) {
      return {
        ...state,
        loading: true,
        error: null
      };
    },
    GET_IMAGE_LISTS_SUCCESS: (state, { imageUrls }) => ({
      ...state,
      loading: false,
      error: null,
      imageUrls
    }),
    GET_IMAGE_LISTS_FAIL: (state, { error }) => ({
      ...state,
      loading: false,
      error
    })
  },
  defaultState
);

export default reducer;
