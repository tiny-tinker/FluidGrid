import { wrapRequest } from "../utils";

const getImageLists = wrapRequest(async () =>
  fetch("https://picsum.photos/list")
);

export { getImageLists };
