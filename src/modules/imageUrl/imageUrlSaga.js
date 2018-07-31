import { put, call, takeLatest, all } from "redux-saga/effects";
import * as ImageUrlApi from "./imageUrlApi";

export function* imageUrlSubscriber() {
  yield all([takeLatest("GET_IMAGE_LISTS", getImageLists)]);
}

export function* getImageLists() {
  try {
    const imageUrls = yield call(ImageUrlApi.getImageLists);

    yield put({ type: "GET_IMAGE_LISTS_SUCCESS", imageUrls });
  } catch (error) {
    yield put({ type: "GET_IMAGE_LISTS_FAIL", error });
  }
}
