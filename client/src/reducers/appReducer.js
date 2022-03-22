import { constants } from "../constants";

export const initialState = {
  inProgress: false,
  loaded: 0,
  size: 0,
  fileProgress: {},
  photosLinks: [],
  uploadError: null,
};

const appReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case constants.RESET_UPLOAD_DATA:
      return { ...initialState };

    case constants.SET_UPLOAD_PROGRESS:
      const fileProgress = { ...state.fileProgress, [payload.id]: payload };
      const files = Object.values(fileProgress);
      const loaded =
        files.length > 0
          ? files.reduce((acc, cur) => (acc += cur.loaded), 0)
          : payload.loaded;

      // the images size need to get recalculated
      // because, the images size in request is bigger than the images size
      const overallSize = files.reduce((acc, cur) => (acc += cur.total), 0);
      const size = overallSize > state.size ? overallSize : state.size;

      return { ...state, loaded, fileProgress, size };

    case constants.SET_OVERALL_SIZE:
      return { ...state, size: payload.size, length: payload.length };

    case constants.UPLOAD_PHOTOS_START:
      return { ...state, inProgress: true };

    case constants.UPLOAD_PHOTOS_SUCCESS:
      const photosLinks = [...state.photosLinks, payload];
      return {
        ...state,
        uploadError: null,
        photosLinks,
        inProgress: photosLinks.length === state.length ? false : true,
      };

    case constants.UPLOAD_PHOTOS_FAILURE:
      const uploadError = payload.request?.statusText || payload.message;
      return { ...state, uploadError, inProgress: false };

    default:
      return state;
  }
};

export default appReducer;
