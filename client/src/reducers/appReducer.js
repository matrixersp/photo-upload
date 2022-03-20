import { constants } from "../constants";

export const initialState = {
  photos: [],
  overallProgress: 0,
  fileProgress: {},
  photosLinks: [],
  uploadError: null,
};

const appReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case constants.UPLOAD_PHOTOS:
      return { ...state, photos: payload };

    case constants.SET_UPLOAD_PROGRESS:
      const fileProgress = { ...state.fileProgress, [payload.id]: payload };
      const files = Object.values(fileProgress);
      const overallProgress =
        files.length > 0
          ? Math.floor(
              files
                .map((file) => file.progress)
                .reduce((acc, cur) => {
                  return acc + cur;
                }, 0) / files.length
            )
          : payload.progress;

      return { ...state, overallProgress, fileProgress };

    case constants.UPLOAD_PHOTOS_SUCCESS:
      return {
        ...state,
        uploadError: null,
        photosLinks: [...state.photosLinks, payload],
      };

    case constants.UPLOAD_PHOTOS_FAILURE:
      const uploadError = payload.request?.statusText || payload.message;
      return { ...state, uploadError };

    case constants.RESET_UPLOAD_DATA:
      return {
        ...state,
        photos: [],
        overallProgress: 0,
        fileProgress: {},
        photosLinks: [],
        uploadError: null,
      };

    default:
      return state;
  }
};

export default appReducer;
