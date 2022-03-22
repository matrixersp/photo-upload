import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Divider,
  Typography,
  Snackbar,
  Alert,
  SnackbarContent,
  Stack,
  IconButton,
  LinearProgress,
} from "@mui/material";
import "./App.css";
import { uploadPhotos, setOverallSize } from "./actions";
import { API_URL } from "./constants";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

let controller;

function App() {
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const { loaded, photosLinks, uploadError } = useSelector(
    (state) => state.appReducer
  );
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    e.target.classList.add("dragging");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    e.target.classList.remove("dragging");
  };

  const handleDrop = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (controller) return;
    e.target.classList.remove("dragging");

    const files = e.dataTransfer.files;
    const filteredFiles = filterFiles(files);

    if (filteredFiles.length > 0) {
      setError("");
      setPhotos(filteredFiles);
    } else setError("No photo selected.");
  };

  const filterFiles = (files) => {
    var imageType = /image.*/;
    return Array.from(files).filter((file) => file.type.match(imageType));
  };

  const setPhotos = (photos) => {
    setSelectedPhotos(photos);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleCloseErrorSnackbar = () => {
    setErrorSnackbarOpen(false);
  };

  const overallSize = useMemo(() => {
    return selectedPhotos.length > 0
      ? selectedPhotos.reduce((acc, cur) => (acc += cur.size), 0)
      : 0;
  }, [selectedPhotos]);

  const progress = useMemo(() => {
    return loaded ? (loaded / overallSize) * 100 : 0;
  }, [loaded, overallSize]);

  const totalUploaded = useMemo(() => {
    const mb = 1024 * 1024;
    return loaded
      ? `${(loaded / mb).toFixed(2)} / ${(overallSize / mb).toFixed(2)} mb`
      : null;
  }, [loaded, overallSize]);

  useEffect(() => {
    if (selectedPhotos.length > 0) {
      controller = new AbortController();
      dispatch(setOverallSize(overallSize));
      dispatch(uploadPhotos({ photos: selectedPhotos, controller }));
      setSnackbarOpen(true);
    }
  }, [selectedPhotos, overallSize, dispatch]);

  useEffect(() => {
    if (progress >= 100) {
      controller = null;
      handleCloseSnackbar();
    }
  }, [progress]);

  useEffect(() => {
    if (error || uploadError) {
      setErrorSnackbarOpen(true);
      controller = null;
      setTimeout(() => {
        handleCloseErrorSnackbar();
      }, 6000);
    }
  }, [error, uploadError]);

  const cancelUpload = () => {
    controller.abort();
    controller = null;
  };

  return (
    <div className="App">
      {/* To display photos */}
      {/* <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {photosLinks.map((link) => (
          <img
            style={{ height: "100px" }}
            key={link}
            src={`${API_URL}/photos/upload/${link}`}
            alt={link}
          />
        ))}
      </Box> */}
      <Box
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        direction="row"
        divider={<Divider orientation="vertical" flexItem sx={{ mx: 2.25 }} />}
        sx={{
          alignItems: "center",
          minWidth: 300,
          height: "100vh",
          border: "3px dashed #bdbebf",
        }}
      >
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", textAlign: "justify" }}
        >
          Upload multiple photos
        </Typography>
      </Box>
      {error || uploadError ? (
        <Snackbar open={errorSnackbarOpen} onClose={handleCloseErrorSnackbar}>
          <Alert onClose={handleCloseErrorSnackbar} severity="error">
            {error || uploadError}
          </Alert>
        </Snackbar>
      ) : (
        <Snackbar
          open={snackbarOpen}
          onClose={handleCloseSnackbar}
          sx={{
            "& .MuiPaper-root, & .MuiSnackbarContent-message": {
              padding: 0.75,
              width: "100%",
              minWidth: "320px",
            },
          }}
        >
          <SnackbarContent
            sx={{ width: "100%" }}
            message={
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  sx={{ alignItems: "center", justifyContent: "space-between" }}
                  spacing={3}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <UploadFileIcon sx={{ fontSize: "2.25rem" }} />
                    <Typography>Uploading: {totalUploaded}</Typography>
                  </Stack>
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    sx={{ p: 0.5 }}
                    onClick={() => {
                      cancelUpload();
                      handleCloseSnackbar();
                    }}
                  >
                    <CancelOutlinedIcon />
                  </IconButton>
                </Stack>
                <LinearProgress
                  sx={{ width: "100%" }}
                  variant="determinate"
                  value={progress}
                />
              </Stack>
            }
          />
        </Snackbar>
      )}
    </div>
  );
}

export default App;
