import React, { useState, useEffect } from "react";
import axios from "axios";
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
  CircularProgress
} from "@mui/material";
import { AddPhotoAlternate } from "@mui/icons-material";
import useAxiosPrivate from '../../../frontend/src/hooks/useAxiosPrivate'
import { customAxios } from "../../../frontend/src/api/axiosPrivate";
export default function CreateOffer() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [childCategory, setChildCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [children, setChildren] = useState([]);
  const [images, setImages] = useState([]);
  const [links, setLinks] = useState("");
  const [startingAt, setStartingAt] = useState("");
  const [endingAt, setEndingAt] = useState("");
  const [uploading, setUploading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const [parent_cat, setParent_cat] = useState([]);
  const [child_cat, setChild_cat] = useState([]);
  
  // // Fetch categories (static for demo)
  // useEffect(() => {
  //   setCategories([
  //     { id: "1", name: "Electronics", children: [{ id: "101", name: "Mobiles" }, { id: "102", name: "Laptops" }] },
  //     { id: "2", name: "Fashion", children: [{ id: "201", name: "Men" }, { id: "202", name: "Women" }] }
  //   ]);
  // }, []);

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

  // Fetch child categories by parentId
  const get_child_cat = async (parentId) => {
    try {
      const res = await customAxios.get(`/category/child-cat/${parentId}`);
      setChild_cat(res.data);
    } catch (error) {
      console.error("Error fetching child categories:", error);
    }
  };

  // Handle parent selection
  const handleParentChange = (e) => {
    const parentId = e.target.value;
    setParentCategory(parentId);
    setChildCategory(""); // reset child category
    get_child_cat(parentId); // fetch children for selected parent
  };

  // ✅ Cloudinary Upload Function
  async function handleFormData(file) {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axiosPrivate.post("/upload", formData);

      const data = res.data;
      setImages((prev) => [...prev, data.secure_url]); // store Cloudinary URL
      setUploading(false);
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploading(false);
    }
  }

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      await handleFormData(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title,
        description,
        category_ids: [parentCategory, childCategory],
        img_urls: images,
        links,
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
          <Typography variant="h5" mb={2}>Create Offer</Typography>

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

            {/* Parent Category */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Parent Category</InputLabel>
              <Select
                value={parentCategory}
                onChange={handleParentChange}
                label="Parent Category"
              >
                {parent_cat?.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Child Category */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Child Category</InputLabel>
              <Select
                value={childCategory}
                onChange={(e) => setChildCategory(e.target.value)}
                disabled={!child_cat?.length}
                label="Child Category"
              >
                {child_cat?.map((child) => (
                  <MenuItem key={child._id} value={child._id}>
                    {child.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Image Upload */}
            <Box mt={2} mb={2}>
              <Button
                component="label"
                variant="outlined"
                startIcon={uploading ? <CircularProgress size={20} /> : <AddPhotoAlternate />}
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
              label="Links"
              margin="normal"
              value={links}
              onChange={(e) => setLinks(e.target.value)}
            />

            <TextField
              fullWidth
              type="datetime-local"
              label="Starting At"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={startingAt}
              onChange={(e) => setStartingAt(e.target.value)}
            />

            <TextField
              fullWidth
              type="datetime-local"
              label="Ending At"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={endingAt}
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
