import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Divider,
  Typography,
  Snackbar,
  Alert,
  SnackbarContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import "./App.css";
import { uploadPhotos } from "./actions";
import { constants } from "./constants";
import Loader from "./components/Loader";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function App() {
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { overallProgress, photosLinks, uploadError } = useSelector(
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
    e.target.classList.remove("dragging");

    const files = e.dataTransfer.files;
    const filteredFiles = filterFiles(files);

    if (filteredFiles.length > 0) {
      resetUploadData();
      setPhotos(filteredFiles);
      setSnackbarOpen(true);
    } else setError("No photo selected.");
  };

  const resetUploadData = () => {
    setError("");
    dispatch({ type: constants.RESET_UPLOAD_DATA });
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

  useEffect(() => {
    if (selectedPhotos.length > 0)
      dispatch(
        uploadPhotos({ photos: selectedPhotos, type: constants.UPLOAD_PHOTOS })
      );
  }, [selectedPhotos, dispatch]);

  useEffect(() => {
    if (overallProgress === 100)
      setTimeout(() => {
        handleCloseSnackbar();
      }, 6000);
  }, [overallProgress]);

  return (
    <div className="App">
      {/* To display photos */}
      {/* <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {photosLinks.map((link) => (
          <img
            style={{ height: "100px" }}
            key={link}
            src={`http://localhost:5000/photos/upload/${link}`}
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
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity="error">
            {error || uploadError}
          </Alert>
        </Snackbar>
      ) : (
        <Snackbar
          open={snackbarOpen}
          onClose={handleCloseSnackbar}
          sx={{
            "& .MuiPaper-root, & .MuiSnackbarContent-message": {
              padding: 0,
              maxWidth: 400,
              minWidth: 200,
            },
          }}
        >
          <SnackbarContent
            sx={{ bgcolor: "common.white" }}
            message={
              <Accordion sx={{ maxHeight: 500, overflowY: "auto" }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Loader value={overallProgress} />
                    <Typography sx={{ ml: 2 }}>Uploading</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense={false}>
                    {selectedPhotos.map((photo) => (
                      <ListItem key={photo.name}>
                        <ListItemText primary={photo.name} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            }
          />
        </Snackbar>
      )}
    </div>
  );
}

export default App;
