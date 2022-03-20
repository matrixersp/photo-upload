import { constants } from "../constants";
import axios from "axios";

export const uploadPhotos =
  ({ photos }) =>
  async (dispatch) => {
    photos.forEach(async (photo, index) => {
      const formData = new FormData();
      formData.append("photo", photo);

      dispatch({ type: constants.UPLOAD_PHOTOS_START });
      try {
        const response = await axios.post(
          "http://localhost:5000/photos/upload",
          formData,
          {
            onUploadProgress({ loaded, total }) {
              dispatch(
                setUploadProgress({
                  id: index,
                  progress: Math.floor((loaded / total) * 100),
                })
              );
            },
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
