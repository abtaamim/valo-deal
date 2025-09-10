import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
} from "@mui/material";
import { AddPhotoAlternate } from "@mui/icons-material";
import useAxiosPrivate from "../../../frontend/src/hooks/useAxiosPrivate";
import { customAxios } from "../../../frontend/src/api/axiosPrivate";

export default function CreateOffer() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [parentCategories, setParentCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [images, setImages] = useState([]);
  // const [links, setLinks] = useState("");
  const [startingAt, setStartingAt] = useState("");
  const [endingAt, setEndingAt] = useState("");
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState("parent"); // "parent" | "child"
  const [discount, setDiscount] = useState(0);
  const axiosPrivate = useAxiosPrivate();
  const [parent_cat, setParent_cat] = useState([]);
  const [child_cat, setChild_cat] = useState({}); // children grouped by parent

  // Fetch parent categories
  const get_parent_cat = async () => {
    try {
      const res = await customAxios.get("/category/parent-cat");
      setParent_cat(res.data);
    } catch (error) {
      console.error("Error fetching parent categories:", error);
    }
  };

  useEffect(() => {
    get_parent_cat();
  }, []);

  // Handle parent selection (multiple)
  const handleParentChange = async (e) => {
    const selected = e.target.value; // array of parent IDs
    setParentCategories(selected);

    let newChildCat = {};
    for (const parentId of selected) {
      try {
        const res = await customAxios.get(`/category/child-cat/${parentId}`);
        newChildCat[parentId] = res.data;
      } catch (err) {
        console.error("Error fetching children:", err);
      }
    }
    setChild_cat(newChildCat);
    setChildCategories([]); // reset children when parent changes
  };

  // Handle child checkbox selection
  const handleChildChange = (childId) => {
    setChildCategories((prev) =>
      prev.includes(childId)
        ? prev.filter((id) => id !== childId)
        : [...prev, childId]
    );
  };

  async function handleFormData(file) {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axiosPrivate.post("/upload", formData);
      const data = res.data;
      setImages((prev) => [...prev, data.secure_url]);
      setUploading(false);
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploading(false);
    }
  }
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // fix timezone offset
    return now.toISOString().slice(0, 16);
  };
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      await handleFormData(file);
    }
  };

  // Submit offer
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let category_ids = [];

      if (mode === "parent") {
        category_ids = parentCategories; 
      } else {
        category_ids = childCategories; 
      }


      const payload = {
        title,
        description,
        category_ids,
        img_urls: images,
        discount,
        starting_at: startingAt,
        ending_at: endingAt,
      };

      await axiosPrivate.post("/offer/create-offer", payload);
      alert("Offer created successfully!");
    } catch (error) {
      alert("Error creating offer: " + error.message);
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt={4}>
      <Card sx={{ width: 600, borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" mb={2}>
            Create Offer
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Title"
              margin="normal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              margin="normal"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {/* Mode Selection */}
            <FormControl component="fieldset" margin="normal">
              <Typography variant="subtitle1">Select Mode:</Typography>
              <RadioGroup
                row
                value={mode}
                onChange={(e) => setMode(e.target.value)}
              >
                <FormControlLabel
                  value="parent"
                  control={<Radio />}
                  label="Parent Only"
                />
                <FormControlLabel
                  value="child"
                  control={<Radio />}
                  label="Child Categories"
                />
              </RadioGroup>
            </FormControl>

            {/* Parent Category (Multiple) */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Parent Categories</InputLabel>
              <Select
                multiple
                value={parentCategories}
                onChange={handleParentChange}
                renderValue={(selected) =>
                  parent_cat
                    .filter((cat) => selected.includes(cat._id))
                    .map((cat) => cat.name)
                    .join(", ")
                }
              >
                {parent_cat?.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Child Category Selection */}
            {mode === "child" &&
              parentCategories.map((parentId) => (
                <Box key={parentId} mt={2}>
                  <Typography variant="subtitle2">
                    {parent_cat.find((p) => p._id === parentId)?.name}
                  </Typography>
                  <FormGroup>
                    {child_cat[parentId]?.map((child) => (
                      <FormControlLabel
                        key={child._id}
                        control={
                          <Checkbox
                            checked={childCategories.includes(child._id)}
                            onChange={() => handleChildChange(child._id)}
                          />
                        }
                        label={child.name}
                      />
                    ))}
                  </FormGroup>
                </Box>
              ))}

            {/* Image Upload */}
            <Box mt={2} mb={2}>
              <Button
                component="label"
                variant="outlined"
                startIcon={
                  uploading ? <CircularProgress size={20} /> : <AddPhotoAlternate />
                }
                sx={{ mb: 1 }}
              >
                {uploading ? "Uploading..." : "Upload Images"}
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>

              <Box display="flex" gap={1} flexWrap="wrap">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="preview"
                    width={80}
                    height={80}
                    style={{ borderRadius: 8, objectFit: "cover" }}
                  />
                ))}
              </Box>
            </Box>

            <TextField
              fullWidth
              label="Discount Percentage"
              margin="normal"
              value={discount}
              
              type='number'
              inputProps={{ min: 1, step: "1", max: 100 }}
              onChange={(e) => {
                let value = parseInt(e.target.value, 10);
                if (isNaN(value)) {
                  setDiscount("");
                  return;
                }
                if (value > 100) value = 100;
                if (value < 1) value = 1;

                setDiscount(value);
              }}
            />

            <TextField
              fullWidth
              type="datetime-local"
              label="Starting At"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={startingAt}
              inputProps={{
                min: getMinDateTime(), // can't pick past dates
              }}
              onChange={(e) => {
                setStartingAt(e.target.value);
                // If endingAt is before new startingAt, reset it
                if (endingAt && e.target.value > endingAt) {
                  setEndingAt("");
                }
              }}
            />

            <TextField
              fullWidth
              type="datetime-local"
              label="Ending At"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={endingAt}
              inputProps={{
                min: startingAt || getMinDateTime(), // must be >= startingAt
              }}
              onChange={(e) => setEndingAt(e.target.value)}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2, borderRadius: 2 }}
            >
              Create Offer
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
