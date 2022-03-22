import { constants, API_URL } from "../constants";
import axios from "axios";

export const uploadPhotos =
  ({ photos, size, controller }) =>
  async (dispatch) => {
    photos.forEach(async (photo, index) => {
      const formData = new FormData();
      formData.append("photo", photo);

      dispatch({ type: constants.UPLOAD_PHOTOS_START, size });
      try {
        const response = await axios.post(
          `${API_URL}/photos/upload`,
          formData,
          {
            onUploadProgress({ loaded, total }) {
              dispatch(setUploadProgress({ id: index, loaded, total }));
            },
            signal: controller.signal,
          }
        );

        dispatch({
          type: constants.UPLOAD_PHOTOS_SUCCESS,
          payload: response.data,
        });
      } catch (error) {
        dispatch({
          type: constants.UPLOAD_PHOTOS_FAILURE,
          payload: error,
        });
      }
    });
  };

export const setUploadProgress = (progress) => ({
  type: constants.SET_UPLOAD_PROGRESS,
  payload: progress,
});

export const resetUploadData = () => ({
  type: constants.RESET_UPLOAD_DATA,
});

export const setOverallSize = (data) => ({
  type: constants.SET_OVERALL_SIZE,
  payload: data,
});