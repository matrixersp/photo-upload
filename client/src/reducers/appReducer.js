import { constants } from "../constants";

export const initialState = {
  loaded: 0,
  size: 0,
  fileProgress: {},
  photosLinks: [],
  uploadError: null,
};

const appReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case constants.SET_UPLOAD_PROGRESS:
      const fileProgress = { ...state.fileProgress, [payload.id]: payload };
      const files = Object.values(fileProgress);
      const loaded =
        files.length > 0
          ? files.reduce((acc, cur) => (acc += cur.loaded), 0)
          : payload.loaded;

      return { ...state, loaded, fileProgress };

    case constants.UPLOAD_PHOTOS_START:
      return { ...initialState };

    case constants.UPLOAD_PHOTOS_SUCCESS:
      return {
        ...state,
        uploadError: null,
        photosLinks: [...state.photosLinks, payload],
      };

    case constants.UPLOAD_PHOTOS_FAILURE:
      const uploadError = payload.request?.statusText || payload.message;
      return { ...state, uploadError };

    default:
      return state;
  }
};

export default appReducer;
